"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTokensAsync = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const flatted_1 = require("flatted");
const graphql_request_1 = require("graphql-request");
const graphqlClients_1 = require("./graphqlClients");
const config_1 = require("./config");
const getRomeSearchTokenQuery = (networks) => {
    let network;
    let pair_search = ``;
    const networkDatasetLength = Math.round(config_1.maxHits / networks.length);
    // Looping through all networks.
    for (network of networks) {
        pair_search += `
      ${network}:
        ${network}_pair_search(
          where:{
            concat_ws:{_ilike:$searchText}, 
            exchange:{_in:$exchanges}
          }, 
          limit:${networkDatasetLength}, 
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
    return (0, graphql_request_1.gql) `query SearchTokens($searchText:String!,$exchanges:[String!]!){${pair_search}}`;
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
const searchTokenAsync_searchString = searchString => {
    //empty string turns to 0x which is found by every pair.
    return searchString ? `%${searchString}%` : '%0x%';
};
// Function that creates the actual async token.
const searchTokensAsync = (searchString, searchNetworks, searchExchanges) => __awaiter(void 0, void 0, void 0, function* () {
    let res;
    const searchText = searchTokenAsync_searchString(searchString);
    const parameters = searchTokenAsync_Parameters(searchText, searchExchanges);
    const query = getRomeSearchTokenQuery(searchNetworks);
    // IMPORTANT!!!
    // IMPORTANT!!!
    // Fun fact, we are injecting ALL active exchanges for ANY network, wheter it is support or not.
    // This does not cause any errors at the moment, but this makes the query QUITE nasty.
    // This should be handled at some point.
    // IMPORTANT!!!
    // IMPORTANT!!!
    try {
        res = yield graphqlClients_1.romePairsClient.request(query, parameters);
    }
    catch (e) {
        throw new Error(`${(0, flatted_1.stringify)(e, Object.getOwnPropertyNames(e))}, args:${(0, flatted_1.stringify)({ parameters, query, })}`);
    }
    // IMPORTANT!!!
    // IMPORTANT!!!
    const mappedPairs = Object
        // Loading an array from each data set comprised of [{networkName},{networkResults}].
        .entries(res)
        .map((network) => {
        // Adding the network to the results so we can display this information to the user.
        network[1].map(result => result.network = network[0]);
        // Returning only the data that is of interest to us.
        return network[1];
    })
        // Flattening all the data sets into one data set.
        .flat()
        .filter((pair) => pair.token0 && pair.token1)
        .map((pair) => {
        const tokenPrices = pair.latest_token0_usd_price && pair.latest_token1_usd_price ?
            {
                token0Price: new bignumber_js_1.default(pair.latest_token1_usd_price)
                    .dividedBy(pair.latest_token0_usd_price)
                    .toString(),
                token1Price: new bignumber_js_1.default(pair.latest_token0_usd_price)
                    .dividedBy(pair.latest_token1_usd_price)
                    .toString(),
            } :
            {
                token0Price: 1,
                token1Price: 1,
            };
        return Object.assign(Object.assign(Object.assign({}, pair), { volumeUSD: pair.last_24hour_usd_volume }), tokenPrices);
    });
    return mappedPairs;
});
exports.searchTokensAsync = searchTokensAsync;
