"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeNames = exports.networkNames = exports.networkExchangePairs = exports.minStringSearch = exports.maxHits = exports.romeTokenSyncUri = void 0;
const lodash_1 = require("lodash");
exports.romeTokenSyncUri = String(process.env.REACT_APP_HASURA_API_ENDPOINT_WS || //todo should be a prop or something
    'https://romenet.prod.velox.global/v1/graphql').replace('ws', 'http');
exports.maxHits = Number(process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM || 500);
exports.minStringSearch = Number(process.env.REACT_APP_SEARCH_INPUT_LENGTH_MINIMUM || 3);
const AvalanchePairs = [
    ["avalanche", "baguette"],
    ["avalanche", "canary"],
    ["avalanche", "complusnetwork"],
    ["avalanche", "elkfinance"],
    ["avalanche", "kyberdmm"],
    ["avalanche", "lydiafinance"],
    ["avalanche", "oliveswap"],
    ["avalanche", "pandaswap"],
    ["avalanche", "pangolin"],
    ["avalanche", "sushiswap"],
    ["avalanche", "traderjoe"],
    ["avalanche", "yetiswap"],
    ["avalanche", "zeroexchange"],
];
const BSCPairs = [
    ["bsc", "apeswap"],
    ["bsc", "babyswap"],
    ["bsc", "biswap"],
    ["bsc", "ellipsis.finance"],
    ["bsc", "mdex"],
    ["bsc", "pancakeswap"],
    ["bsc", "safeswap"],
    ["bsc", "sushiswap"],
];
const moonbeamPairs = [
    ["moonbeam", "beamswap"],
    ["moonbeam", "solarflare"],
    ["moonbeam", "stellaswap"],
    ["moonbeam", "sushiswap"],
];
const moonriverPairs = [
    ["moonriver", "solarbeam"],
    ["moonriver", "sushiswap"],
];
exports.networkExchangePairs = [...BSCPairs, ...AvalanchePairs, ...moonbeamPairs, ...moonriverPairs];
exports.networkNames = (0, lodash_1.uniq)(exports.networkExchangePairs.map(pair => pair[0]));
const exchangeNames = networkNames => (0, lodash_1.uniq)(exports.networkExchangePairs.filter(pair => networkNames.includes(pair[0])).map(pair => pair[1]));
exports.exchangeNames = exchangeNames;