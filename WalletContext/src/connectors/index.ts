import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { useMemo } from 'react'
import { INFURA_NETWORK_URLS } from '../constants/infura'
import { Wallet } from '../context/WalletProvider'

export const BACKFILLABLE_WALLETS = [Wallet.COINBASE_WALLET, Wallet.WALLET_CONNECT, Wallet.INJECTED]
export const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS, Wallet.FORTMATIC]

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

export function getWalletForConnector(connector: Connector) {
  switch (connector) {
    case injected:
      return Wallet.INJECTED
    case walletConnect:
      return Wallet.WALLET_CONNECT
    case network:
      return Wallet.NETWORK
    default:
      throw Error('unsupported connector')
  }
}

export function getConnectorForWallet(wallet: Wallet) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injected
    case Wallet.WALLET_CONNECT:
      return walletConnect
    default:
      return network
  }
}

function getHooksForWallet(wallet: Wallet) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injectedHooks
    case Wallet.WALLET_CONNECT:
      return walletConnectHooks
    default:
      return networkHooks
  }
}

export const [network, networkHooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: INFURA_NETWORK_URLS, defaultChainId: 1 }),
)

export const [injected, injectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: INFURA_NETWORK_URLS,
        qrcode: true,
      },
      onError,
    }),
)

interface ConnectorListItem {
  connector: Connector
  hooks: Web3ReactHooks
}

function getConnectorListItemForWallet(wallet: Wallet) {
  return {
    connector: getConnectorForWallet(wallet),
    hooks: getHooksForWallet(wallet),
  }
}

export function useConnectors(selectedWallet: Wallet | undefined) {
  return useMemo(() => {
    const connectors: ConnectorListItem[] = []
    if (selectedWallet) {
      connectors.unshift(getConnectorListItemForWallet(selectedWallet))
    }
    connectors.push(
      ...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet).map(getConnectorListItemForWallet),
    )
    connectors.push({ connector: network, hooks: networkHooks })
    const web3ReactConnectors: [Connector, Web3ReactHooks][] = connectors.map(({ connector, hooks }) => [
      connector,
      hooks,
    ])
    return web3ReactConnectors
  }, [selectedWallet])
}
