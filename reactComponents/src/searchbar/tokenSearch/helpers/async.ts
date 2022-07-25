import BN from 'bignumber.js';
import { stringify } from 'flatted';
import { gql } from 'graphql-request';
import { romePairsClient } from './graphqlClients';
import { maxHits } from './config';
import { NetworkType } from '../../../types';

const getRomeSearchTokenQuery = (networks, isPair = false) => {
  let network;
  let pair_search = '';

  let where = `{
    concat_ws:{_ilike:$searchText},             
    exchange:{_in:$exchanges}
  }`;

  if (isPair)
    where = `
      {
        _and:[
          {concat_ws:{_ilike:$filter1}},
          {concat_ws:{_ilike:$filter2}}
        ],        
        exchange:{_in:$exchanges}
      }
    `;

  // Looping through all networks.
  for (network of networks) {
    pair_search += `
      ${network}:
        ${network}_pair_search(
          where:${where}, 
          limit:${maxHits}, 
          order_by:{ last_24hour_usd_volume:desc_nulls_last }
        ) 
        {
          id:pair_address
          exchange
          token0 {
            address
            symbol
            name
            decimals
            id:address
            image:primary_img_uri
          }
          token1 {
            address
            symbol
            name
            decimals
            id:address
            image:primary_img_uri
          }
          last_24hour_usd_volume
          latest_token0_usd_price
          latest_token1_usd_price
        }`;
  }

  let graphQl = gql`query SearchTokens($searchText:String!,$exchanges:[String!]!){${pair_search}}`;

  if (isPair)
    graphQl = gql`query SearchTokens($filter1:String!,$filter2:String!,$exchanges:[String!]!){${pair_search}}`;

  return graphQl;
};

// Function that prepares the parameters of the GraphQL query.
// It's not doing much at the moment, but if needs to be expanded, at least it will keep the code cleaner.
const searchTokenAsync_Parameters = (searchText, searchExchanges) => {
  return {
    exchanges: [...searchExchanges],
    searchText,
  };
};

// Function that prepares de search text for the GraphQL query.
// Again, for code cleaness and possible expansion.
const searchTokenAsync_searchString = (searchString) => {
  //empty string turns to 0x which is found by every pair.
  return searchString ? `%${searchString}%` : '%0x%';
};

// Function that creates the actual async token.
// eslint-disable-next-line
export const searchTokensAsync = async (
  searchString: string,
  searchNetworks: Array<string>,
  searchExchanges: Array<string>,
  networks: NetworkType[]
) => {
  let res;
  let isPair = false;
  const queries = searchString.split(' ');

  const searchText = searchTokenAsync_searchString(searchString);
  let parameters: any = searchTokenAsync_Parameters(searchText, searchExchanges);

  if (queries.length > 1) {
    parameters = {
      exchanges: [...searchExchanges],
      filter1: `%${queries[0]}%`,
      filter2: `%${queries[1]}%`,
    };
    isPair = true;
  }

  const query = getRomeSearchTokenQuery(searchNetworks, isPair );

  // IMPORTANT!!!
  // IMPORTANT!!!
  // Fun fact, we are injecting ALL active exchanges for ANY network, wheter it is support or not.
  // This does not cause any errors at the moment, but this makes the query QUITE nasty.
  // This should be handled at some point.
  // IMPORTANT!!!
  // IMPORTANT!!!
  try {
    res = await romePairsClient.request(query, parameters);
  } catch (e) {
    throw new Error(
      `${stringify(e, Object.getOwnPropertyNames(e))}, args:${stringify({ parameters, query })}`
    );
  }
  // IMPORTANT!!!
  // IMPORTANT!!!

  const mappedPairs = Object
    // Loading an array from each data set comprised of [{networkName},{networkResults}].
    .entries(res)
    .map((network: any) => {
      // Adding the network to the results so we can display this information to the user.
      network[1].map((result) => (result.network = network[0]));

      // Returning only the data that is of interest to us.
      return network[1];
    })
    // Flattening all the data sets into one data set.
    .flat()
    .filter((pair: any) => {

      // This checks if the pair's exchange and network is included in the network-exchange list
      // passed to the searchbox component.
      // This is a hacky fix. Ideally we should use the 'in' property in the Hasura search filters
      // to only include valid exchanges per network pair search
      const validNetworkExchange = !!networks.find(network => {
         const isExchange = network.exchanges.filter(exchange => exchange.name === pair.exchange)
         const isPair = network.id === pair.network
         if(isExchange.length > 0 && isPair){return true}
       })
      return pair.token0 && pair.token1 && validNetworkExchange
    })
    .map((pair: any) => {
      const tokenPrices =
        pair.latest_token0_usd_price && pair.latest_token1_usd_price
          ? {
              token0Price: new BN(pair.latest_token1_usd_price)
                .dividedBy(pair.latest_token0_usd_price)
                .toString(),
              token1Price: new BN(pair.latest_token0_usd_price)
                .dividedBy(pair.latest_token1_usd_price)
                .toString(),
            }
          : {
              token0Price: 1,
              token1Price: 1,
            };

      return {
        ...pair,
        volumeUSD: pair.last_24hour_usd_volume,
        ...tokenPrices,
      };
    })
    .sort((pair0:any, pair1:any)=>{
      return Number(pair1.last_24hour_usd_volume) - Number(pair0.last_24hour_usd_volume)
    }
  );
  return mappedPairs;
};
