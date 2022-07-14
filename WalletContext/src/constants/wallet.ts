import { Connector } from '@web3-react/types'

import { Wallet, injected, walletConnect } from '../hooks/useConnectors'

interface WalletInfo {
  connector?: Connector
  wallet?: Wallet
  name: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    wallet: Wallet.INJECTED,
    name: 'MetaMask',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    wallet: Wallet.WALLET_CONNECT,
    name: 'WalletConnect',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}
