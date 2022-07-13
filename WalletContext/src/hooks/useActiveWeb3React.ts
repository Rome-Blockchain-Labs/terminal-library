import { useContext } from 'react'
import { WalletContext } from '../context/WalletProvider'

export function useActiveWeb3React() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a useWalletsProvider')
  }
  const { priorityWallet } = context
  const { connector, hooks, wallet } = priorityWallet
  return { connector, hooks, wallet }
}
