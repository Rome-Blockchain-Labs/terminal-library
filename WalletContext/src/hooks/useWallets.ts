import { useContext } from 'react'
import { WalletContext } from '../context/WalletProvider'

export function useWallets() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a useWalletsProvider')
  }
  return context
}
