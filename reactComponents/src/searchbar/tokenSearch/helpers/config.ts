
import { uniq } from "lodash";


export const romeTokenSyncUri = String(
  process.env.REACT_APP_HASURA_API_ENDPOINT_WS ||//todo should be a prop or something
    'https://romenet.prod.velox.global/v1/graphql'
).replace('ws', 'http');

export const maxHits = Number(process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM || 500)

const AvalanchePairs = [
  ["avalanche","baguette"],
  ["avalanche","canary"],
  ["avalanche","complusnetwork"],
  ["avalanche","elkfinance"],
  ["avalanche","kyberdmm"],
  ["avalanche","lydiafinance"],
  ["avalanche","oliveswap"],
  ["avalanche","pandaswap"],
  ["avalanche","pangolin"],
  ["avalanche","sushiswap"],
  ["avalanche","traderjoe"],
  ["avalanche","yetiswap"],
  ["avalanche","zeroexchange"],
]
const BSCPairs = [
  ["bsc","apeswap"],
  ["bsc","babyswap"],
  ["bsc","biswap"],
  ["bsc","ellipsis.finance"],
  ["bsc","mdex"],
  ["bsc","pancakeswap"],
  ["bsc","safeswap"],
  ["bsc","sushiswap"],
]
const moonbeamPairs = [
  ["moonbeam","beamswap"],
  ["moonbeam","solarflare"],
  ["moonbeam","stellaswap"],
  ["moonbeam","sushiswap"],
]
const moonriverPairs = [
  ["moonriver","solarbeam"],
  ["moonriver","sushiswap"],
]
export const networkExchangePairs = [...BSCPairs,...AvalanchePairs, ...moonbeamPairs, ...moonriverPairs];
export const networkNames = uniq(networkExchangePairs.map(pair => pair[0]));
// eslint-disable-next-line
export const exchangeNames = (networkNames: Array<string>) => uniq(networkExchangePairs.filter(pair => networkNames.includes(pair[0])).map(pair => pair[1]));

