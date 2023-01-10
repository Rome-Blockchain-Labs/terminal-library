import { useMemo } from 'react'
import { ConnectionType } from '../connection/connectors'
import { getConnection } from '../connection/utils'

const SELECTABLE_WALLETS = [ConnectionType.INJECTED, ConnectionType.COINBASE_WALLET, ConnectionType.WALLET_CONNECT]

export default function useOrderedConnections(selectedWallet: ConnectionType | undefined) {
  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = []

    // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet))

    // Add network connection last as it should be the fallback.
    orderedConnectionTypes.push(ConnectionType.NETWORK)

    return orderedConnectionTypes.map(getConnection)
  }, [selectedWallet])
}
