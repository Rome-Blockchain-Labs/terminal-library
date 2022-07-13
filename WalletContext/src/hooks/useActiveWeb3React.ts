import { useContext } from 'react'
import { WalletContext } from '../context/WalletProvider'
import { Wallet } from './useConnectors'

export function useActiveWeb3React() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a useWalletsProvider')
  }
  const { priorityWallet, connectors } = context
  if (!priorityWallet) {
    const network = connectors.find((c) => c.wallet === Wallet.NETWORK)
    if (network) {
      return network
    } else {
      return
    }
  }
  const { connector, hooks, wallet } = priorityWallet
  return { connector, hooks, wallet }
}
