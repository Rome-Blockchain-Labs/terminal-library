import type { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

interface IGetAddChainParameters {
  CHAINS: IChains;
  chainId: number;
}

export function getAddChainParameters({
  chainId,
  CHAINS,
}: IGetAddChainParameters): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

interface IChains {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
}

interface IGenerateChains {
  infuraKey?: string;
  alchemyKey?: string;
}

export const generateChains = ({
  infuraKey,
  alchemyKey,
}: IGenerateChains): IChains => {
  return {
    1: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://mainnet.infura.io/v3/${infuraKey}` : undefined,
        alchemyKey
          ? `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
          : undefined,
        'https://cloudflare-eth.com',
      ].filter((url) => url !== undefined),
      name: 'Mainnet',
    },
    3: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://ropsten.infura.io/v3/${infuraKey}` : undefined,
      ].filter((url) => url !== undefined),
      name: 'Ropsten',
    },
    4: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://rinkeby.infura.io/v3/${infuraKey}` : undefined,
      ].filter((url) => url !== undefined),
      name: 'Rinkeby',
    },
    5: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://goerli.infura.io/v3/${infuraKey}` : undefined,
      ].filter((url) => url !== undefined),
      name: 'Görli',
    },
    42: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://kovan.infura.io/v3/${infuraKey}` : undefined,
      ].filter((url) => url !== undefined),
      name: 'Kovan',
    },
    // Optimism
    10: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://optimism-mainnet.infura.io/v3/${infuraKey}` : undefined,
        'https://mainnet.optimism.io',
      ].filter((url) => url !== undefined),
      name: 'Optimism',
      nativeCurrency: ETH,
      blockExplorerUrls: ['https://optimistic.etherscan.io'],
    },
    69: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://optimism-kovan.infura.io/v3/${infuraKey}` : undefined,
        'https://kovan.optimism.io',
      ].filter((url) => url !== undefined),
      name: 'Optimism Kovan',
      nativeCurrency: ETH,
      blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
    },
    // Arbitrum
    42161: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://arbitrum-mainnet.infura.io/v3/${infuraKey}` : undefined,
        'https://arb1.arbitrum.io/rpc',
      ].filter((url) => url !== undefined),
      name: 'Arbitrum One',
      nativeCurrency: ETH,
      blockExplorerUrls: ['https://arbiscan.io'],
    },
    421611: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://arbitrum-rinkeby.infura.io/v3/${infuraKey}` : undefined,
        'https://rinkeby.arbitrum.io/rpc',
      ].filter((url) => url !== undefined),
      name: 'Arbitrum Testnet',
      nativeCurrency: ETH,
      blockExplorerUrls: ['https://testnet.arbiscan.io'],
    },
    // Polygon
    137: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://polygon-mainnet.infura.io/v3/${infuraKey}` : undefined,
        'https://polygon-rpc.com',
      ].filter((url) => url !== undefined),
      name: 'Polygon Mainnet',
      nativeCurrency: MATIC,
      blockExplorerUrls: ['https://polygonscan.com'],
    },
    80001: {
      //@ts-ignore
      urls: [
        infuraKey ? `https://polygon-mumbai.infura.io/v3/${infuraKey}` : undefined,
      ].filter((url) => url !== undefined),
      name: 'Polygon Mumbai',
      nativeCurrency: MATIC,
      blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    },
  };
};

export const generateURLS = (CHAINS: IChains): { [chainId: number]: string[] } => {
  const URLS = Object.keys(CHAINS).reduce<{
    [chainId: number]: string[];
  }>((accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  }, {});
  return URLS;
};
