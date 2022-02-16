import React from 'react'

import { NetworkName } from './constants'
import { useWallets } from './WalletContext'

/**
 * This component is currently un-used but will be used soon to:
 * 1) hide components that should not render when they are connected to the wrong network
 * 2) Link to a modal to change the network
 * **/

const NetworkSwitchRender: (props: {
  expectedNetworkName: NetworkName
  customComponent?: React.ComponentElement<any, any>
  children: any
}) => any = (props) => {
  const { customComponent, expectedNetworkName } = props
  const wallets = useWallets()

  const onClick = async () => {
    if (wallets.isOnNetwork(expectedNetworkName)) {
      wallets.promptWalletChange()
    } else {
      wallets.switchNetwork(expectedNetworkName)
    }
  }

  if (wallets.isOnNetwork(expectedNetworkName)) {
    return props.children
  } else if (customComponent) {
    return React.cloneElement(customComponent, {
      expectedNetworkName,
      onClick,
    })
  } else {
    return <button onClick={onClick}>Switch network default</button>
  }
}

export default NetworkSwitchRender
