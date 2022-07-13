import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { useMemo } from 'react'
import { INFURA_NETWORK_URLS } from '../constants/infura'

export enum Wallet {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  FORTMATIC = 'FORTMATIC',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}
export interface Web3ReactConnector {
  connector: Connector
  hooks: Web3ReactHooks
  wallet: Wallet
}

export const SELECTABLE_WALLETS = [Wallet.WALLET_CONNECT, Wallet.INJECTED]

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
      return undefined
  }
}

export function getConnectorForWallet(wallet: Wallet | null) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injected
    case Wallet.WALLET_CONNECT:
      return walletConnect
    case Wallet.NETWORK:
      return network
    default:
      return undefined
  }
}

export function getHooksForWallet(wallet: Wallet | null) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injectedHooks
    case Wallet.WALLET_CONNECT:
      return walletConnectHooks
    case Wallet.NETWORK:
      return networkHooks
    default:
      return undefined
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
  wallet: Wallet
}

function getConnectorListItemForWallet(wallet: Wallet) {
  const connector = getConnectorForWallet(wallet)
  const hooks = getHooksForWallet(wallet)

  if (!connector || !hooks) return
  return {
    connector,
    hooks,
    wallet,
  }
}
export function useConnectors(selectedWallet: Wallet | null) {
  return useMemo(() => {
    const connectors: ConnectorListItem[] = []
    if (selectedWallet) {
      const wallet = getConnectorListItemForWallet(selectedWallet)
      if (wallet) {
        connectors.push(wallet)
      }
    }
    const inactiveWallets = SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet)
    const connectorList = inactiveWallets.map(getConnectorListItemForWallet)
    const validConnectors = connectorList.filter((e) => e)

    validConnectors.forEach((connector) => {
      if (connector) connectors.push(connector)
    })

    connectors.push({ connector: network, hooks: networkHooks, wallet: Wallet.NETWORK })
    const web3ReactConnectors: Web3ReactConnector[] = connectors.map(({ connector, hooks, wallet }) => ({
      connector,
      hooks,
      wallet,
    }))
    return web3ReactConnectors
  }, [selectedWallet])
}
