import { Connector } from '@web3-react/types'

import {
  injectedConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
  networkConnection,
  ConnectionType,
} from './connectors'
const CONNECTIONS = [injectedConnection, coinbaseWalletConnection, walletConnectConnection, networkConnection]

export function getConnection(connector: Connector | ConnectionType) {
  if (connector instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === connector)
    if (!connection) {
      throw Error('unsupported connector')
    }

    return connection
  } else {
    switch (connector) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection
      case ConnectionType.NETWORK:
        return networkConnection
      default:
        throw Error('invalid connector')
    }
  }
}

export function getConnectionName(connectionType: ConnectionType, isMetaMask?: boolean, connectionName?: string) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? 'MetaMask' : connectionName ? connectionName : 'Browser Wallet'
    case ConnectionType.COINBASE_WALLET:
      return 'Coinbase Wallet'
    case ConnectionType.WALLET_CONNECT:
      return 'WalletConnect'
    case ConnectionType.NETWORK:
      return 'Network'
    case ConnectionType.GNOSIS_SAFE:
      return 'Gnosis Safe'
  }
}
