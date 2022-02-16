import * as ethers from 'ethers'
import { keyBy } from 'lodash'

export type NetworkName = 'Ethereum' | 'Avalanche' | 'BSC' | 'Rinkeby'
export type WalletName = 'metamask'

type Network = {
  chainHex: string
  chainId: number
  name: NetworkName
  provider: ethers.providers.BaseProvider
  supportingWallets: Array<WalletName>
  blockExplorerUrl: string
  nativeCurrency: {
    decimals: number
    name: string
    symbol: string
  }
  rpcUrl: string
}

const networks: Array<Network> = [
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
    provider: new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/f731a1ccfb1a4cc8bc8017b635686621'
    ),
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
    provider: new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    ),
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
    provider: new ethers.providers.JsonRpcProvider(
      'https://api.avax.network/ext/bc/C/rpc'
    ),
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
    provider: new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org'
    ),
    rpcUrl: 'https://bsc-dataseed.binance.org',
    supportingWallets: ['metamask'],
  },
]
const networksByName = keyBy(networks, 'name')
const networksByChainHex = keyBy(networks, 'chainHex')
const networksByChainId = keyBy(networks, 'chainId')
//////////////////////////////////
export const getNetworkByNetworkName = (networkName: NetworkName) => {
  const found = networksByName[networkName]
  if (found) return found
  throw new Error(`Invalid network name:${networkName}`)
}
export const getChainHexByNetworkName = (networkName: NetworkName) =>
  getNetworkByNetworkName(networkName).chainHex
export const getChainIdByNetworkName = (networkName: NetworkName) =>
  getNetworkByNetworkName(networkName).chainId
export const getProviderForNetworkName = (networkName: NetworkName) =>
  getNetworkByNetworkName(networkName).provider
//////////////////////////////////
export const getNetworkNameFromChainHex = (chainHex: string) => {
  const found = networksByChainHex[chainHex]
  if (found) return found.name
  throw new Error(`Invalid network chainHex:${chainHex}`)
}
///////////////////////////////////////
export const getNetworkNameFromChainId = (chainId: number) => {
  const found = networksByChainId[chainId]
  if (found) return found.name
  return 'unknown'
}

export const getSupportedNetworksNameByWallet = (walletName: WalletName) =>
  networks
    .filter((n) => n.supportingWallets.includes(walletName))
    .map((n) => n.name)
