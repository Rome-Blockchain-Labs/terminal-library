"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedNetworksNameByWallet = exports.getNetworkNameFromChainId = exports.getNetworkNameFromChainHex = exports.getProviderForNetworkName = exports.getChainIdByNetworkName = exports.getChainHexByNetworkName = exports.getNetworkByNetworkName = void 0;
const ethers = __importStar(require("ethers"));
const lodash_1 = require("lodash");
const networks = [
    {
        blockExplorerUrl: 'https://etherscan.io/',
        chainHex: '0x4',
        chainId: 4,
        name: 'Rinkeby',
        nativeCurrency: {
            decimals: 18,
            name: 'Ethereum',
            symbol: 'Eth',
        },
        provider: new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f731a1ccfb1a4cc8bc8017b635686621'),
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        supportingWallets: ['metamask'],
    },
    {
        blockExplorerUrl: 'https://etherscan.io/',
        chainHex: '0x1',
        chainId: 1,
        name: 'Ethereum',
        nativeCurrency: {
            decimals: 18,
            name: 'Ethereum',
            symbol: 'Eth',
        },
        provider: new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        supportingWallets: ['metamask'],
    },
    {
        blockExplorerUrl: 'https://snowtrace.io/',
        chainHex: '0xa86a',
        chainId: 43114,
        name: 'Avalanche',
        nativeCurrency: {
            decimals: 18,
            name: 'AVAX',
            symbol: 'AVAX',
        },
        provider: new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc'),
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        supportingWallets: ['metamask'],
    },
    {
        blockExplorerUrl: 'https://bscscan.com/',
        chainHex: '0x38',
        chainId: 56,
        name: 'BSC',
        nativeCurrency: {
            decimals: 18,
            name: 'Binance Smart chain',
            symbol: 'BSC',
        },
        provider: new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
        rpcUrl: 'https://bsc-dataseed.binance.org',
        supportingWallets: ['metamask'],
    },
];
const networksByName = (0, lodash_1.keyBy)(networks, 'name');
const networksByChainHex = (0, lodash_1.keyBy)(networks, 'chainHex');
const networksByChainId = (0, lodash_1.keyBy)(networks, 'chainId');
//////////////////////////////////
const getNetworkByNetworkName = (networkName) => {
    const found = networksByName[networkName];
    if (found)
        return found;
    throw new Error(`Invalid network name:${networkName}`);
};
exports.getNetworkByNetworkName = getNetworkByNetworkName;
const getChainHexByNetworkName = (networkName) => (0, exports.getNetworkByNetworkName)(networkName).chainHex;
exports.getChainHexByNetworkName = getChainHexByNetworkName;
const getChainIdByNetworkName = (networkName) => (0, exports.getNetworkByNetworkName)(networkName).chainId;
exports.getChainIdByNetworkName = getChainIdByNetworkName;
const getProviderForNetworkName = (networkName) => (0, exports.getNetworkByNetworkName)(networkName).provider;
exports.getProviderForNetworkName = getProviderForNetworkName;
//////////////////////////////////
const getNetworkNameFromChainHex = (chainHex) => {
    const found = networksByChainHex[chainHex];
    if (found)
        return found.name;
    throw new Error(`Invalid network chainHex:${chainHex}`);
};
exports.getNetworkNameFromChainHex = getNetworkNameFromChainHex;
///////////////////////////////////////
const getNetworkNameFromChainId = (chainId) => {
    const found = networksByChainId[chainId];
    if (found)
        return found.name;
    return 'unknown';
};
exports.getNetworkNameFromChainId = getNetworkNameFromChainId;
const getSupportedNetworksNameByWallet = (walletName) => networks
    .filter((n) => n.supportingWallets.includes(walletName))
    .map((n) => n.name);
exports.getSupportedNetworksNameByWallet = getSupportedNetworksNameByWallet;
