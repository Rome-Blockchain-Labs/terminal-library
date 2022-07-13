import WalletProvider from './context/WalletProvider'
import { useWallet } from './hooks/useWalletContext'
import { WALLETS } from './constants/wallet'
import { getWalletForConnector } from './connectors/index'
import { getName } from './utils/getName'
import { injected, injectedHooks, walletConnect, walletConnectHooks } from './hooks/useConnectors'

const MetamaskConnector = {
  wallet: injected,
  hooks: injectedHooks,
}
const WalletConnectConnector = {
  wallet: walletConnect,
  hooks: walletConnectHooks,
}

export { WalletProvider, useWallet, getWalletForConnector, getName, WALLETS, MetamaskConnector, WalletConnectConnector }
