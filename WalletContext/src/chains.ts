import type { AddEthereumChainParameter } from '@web3-react/types'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY ? process.env.REACT_APP_INFURA_KEY : process.env.INFURA_KEY

const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY ? process.env.REACT_APP_ALCHEMY_KEY : process.env.ALCHEMY_KEY

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}
const AVAX: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Avax',
  symbol: 'AVAX',
  decimals: 18,
}
const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Binance Coin',
  symbol: 'BNB',
  decimals: 18,
}

const GLMR: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Glimmer',
  symbol: 'GLMR',
  decimals: 18,
}
const MOVR: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Moonriver',
  symbol: 'MOVR',
  decimals: 18,
}
const METIS: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Metis',
  symbol: 'METIS',
  decimals: 18,
}

const JEWEL: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Jewel',
  symbol: 'JEWEL',
  decimals: 18,
}

const KLAY: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Klay',
  symbol: 'KLAY',
  decimals: 18,
}

interface BasicChainInformation {
  urls: (string | undefined)[]
  name: string
}

export enum NetworkName {
  ETHEREUM = 'ethereum',
  AVALANCHE = 'avalanche',
  BINANCE = 'bsc',
  MOONBEAM = 'moonbeam',
  MOONRIVER = 'moonriver',
  METIS = 'metis',
  OPTIMISM = 'optimism',
  POLYGON = 'polygon',
  DFK = 'dfk',
  KLAYTN = 'klaytn',
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter {
  const chainInformation = CHAINS[chainId]
  return {
    chainId,
    chainName: chainInformation.name,
    nativeCurrency: chainInformation.nativeCurrency,
    rpcUrls: chainInformation.urls as any,
    blockExplorerUrls: chainInformation.blockExplorerUrls,
  }
}

const NetworkChainMap: { [key in NetworkName]: number } = {
  ethereum: 1,
  avalanche: 43114,
  bsc: 56,
  moonbeam: 1284,
  moonriver: 1285,
  metis: 1088,
  optimism: 10,
  polygon: 137,
  dfk: 53935,
  klaytn: 8217,
}

export const CHAINS: { [chainId: number]: ExtendedChainInformation } = {
  1: {
    urls: [
      INFURA_KEY ? `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161` : undefined,
      ALCHEMY_KEY ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}` : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
    name: 'Mainnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  5: {
    urls: [INFURA_KEY ? `https://goerli.infura.io/v3/${INFURA_KEY}` : undefined].filter((url) => url !== undefined),
    name: 'Görli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
  // Optimism
  10: {
    urls: [
      INFURA_KEY ? `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}` : undefined,
      'https://mainnet.optimism.io',
    ].filter((url) => url !== undefined),
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  // Arbitrum
  42161: {
    urls: [
      INFURA_KEY ? `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}` : undefined,
      'https://arb1.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  // Polygon
  137: {
    urls: [
      INFURA_KEY ? `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}` : undefined,
      'https://polygon-rpc.com',
    ].filter((url) => url !== undefined),
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  80001: {
    urls: [INFURA_KEY ? `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}` : undefined].filter(
      (url) => url !== undefined,
    ),
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  43114: {
    urls: ['https://api.avax.network/ext/bc/C/rpc'].filter((url) => url !== undefined),
    name: 'Avalanche',
    nativeCurrency: AVAX,
    blockExplorerUrls: ['https://snowtrace.io'],
  },

  56: {
    urls: ['https://bsc-dataseed.binance.org'].filter((url) => url !== undefined),
    name: 'Binance',
    nativeCurrency: BNB,
    blockExplorerUrls: ['https://bscscan.com'],
  },
  1284: {
    urls: ['https://rpc.api.moonbeam.network'].filter((url) => url !== undefined),
    name: 'Glimmer',
    nativeCurrency: GLMR,
    blockExplorerUrls: ['https://moonbeam.moonscan.io'],
  },
  1285: {
    urls: ['https://rpc.moonriver.moonbeam.network'].filter((url) => url !== undefined),
    name: 'Moonriver',
    nativeCurrency: MOVR,
    blockExplorerUrls: ['https://moonriver.moonscan.io'],
  },
  1088: {
    urls: ['https://andromeda.metis.io/?owner=1088'].filter((url) => url !== undefined),
    name: 'Metis',
    nativeCurrency: METIS,
    blockExplorerUrls: ['https://andromeda-explorer.metis.io'],
  },
  53935: {
    urls: ['https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'].filter((url) => url !== undefined),
    name: 'DFK',
    nativeCurrency: JEWEL,
    blockExplorerUrls: ['https://subnets.avax.network/defi-kingdoms'],
  },
  8217: {
    urls: ['https://public-node-api.klaytnapi.com/v1/cypress'].filter((url) => url !== undefined),
    name: 'Klaytn',
    nativeCurrency: KLAY,
    blockExplorerUrls: ['https://scope.klaytn.com'],
  },
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls as any

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {},
)
export const getAddChainParametersfromNetworkName = (network: NetworkName): AddEthereumChainParameter | number => {
  const chainId = NetworkChainMap[network]
  return getAddChainParameters(chainId)
}
