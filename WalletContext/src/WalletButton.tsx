import React, { FC } from 'react'
import { useWallets } from './WalletContext'

const WalletButton: FC = () => {
  const wallets = useWallets()

  const onConnect = async () => wallets.promptWalletChange()
  const onDisconnect = async () => wallets.disconnectFromWallet()
  if (wallets.active) {
    // const tooltipText = `You are currently connected to ${getNetworkNameFromChainId(
    //   wallets.chainId || 1
    // )} on ${wallets.walletName}`
    return (
      // <MouseoverTooltip text={tooltipText}>
        <div tw={'flex items-center'} onClick={onDisconnect}>
          {/*<ConnectedWalletChainIcon color={theme`colors.yellow.400`} />*/}
          <span tw="text-yellow-400">DISCONNECT</span>
        </div>
      // </MouseoverTooltip>
    )
  }
  return (
    <div tw={'flex items-center'} onClick={onConnect}>
      {/*<DisconnectedWalletChainIcon />*/}
      <span tw={'text-gray-200'}>CONNECT WALLET</span>
    </div>
  )
}

export default WalletButton
