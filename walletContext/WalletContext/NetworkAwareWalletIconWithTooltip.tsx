import React from 'react'
import { theme } from 'twin.macro'
import { ConnectWalletIcon } from './components/icons'

import { NetworkName } from './constants'
import { useWallets } from './WalletContext'

const NetworkAwareWalletIconWithTooltip: (props: {
  expectedNetworkName: NetworkName
  active?: boolean
  tooltipId?: string
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>> = (
  props
) => {
  const { active, expectedNetworkName, tooltipId } = props
  const wallets = useWallets()

  const onClick = async () => {
    if (wallets.isOnNetwork(expectedNetworkName)) {
      wallets.promptWalletChange()
    } else {
      wallets.switchNetwork(expectedNetworkName)
    }
  }

  const height = 12
  const width = 12
  const color = wallets.isOnNetwork(expectedNetworkName)
    ? theme`colors.green.900`
    : theme`colors.orange.500`
  const tooltipText = wallets.isOnNetwork(expectedNetworkName)
    ? 'CHANGE WALLET'
    : 'CONNECT WALLET'
  const activeColor = theme`colors.yellow.400`
  return (
    <button
      data-for={tooltipId}
      data-tip={tooltipText}
      tw="transition mx-1.5"
      onClick={onClick}
    >
      <ConnectWalletIcon
        active={active}
        activeColor={activeColor}
        color={color}
        height={height}
        width={width}
      />
    </button>
  )
}

export default NetworkAwareWalletIconWithTooltip
