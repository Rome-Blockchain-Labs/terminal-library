import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { useWallets, useActiveWeb3React } from 'web3react-v8-ian'
import styles from '../styles/Home.module.css'
import { Connector } from '@web3-react/types'

const Home: NextPage = () => {
  const { setSelectedWallet, connectors } = useWallets()
  const a = useActiveWeb3React()

  const account = a?.hooks?.useAccount()
  const active = a?.hooks?.useIsActive()
  const wallet = a?.wallet

  const tryActivation = useCallback(async (connector: Connector, wallet: any) => {
    try {
      await connector.activate()
      setSelectedWallet(wallet)
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div>Active Account</div>
      <div>{wallet}</div>
      <div>{account}</div>
      <div>{active}</div>

      {connectors
        .filter((connector) => connector.wallet !== 'NETWORK')
        .map((connector, idx) => {
          return (
            <div key={idx}>
              <button
                onClick={() => {
                  if (connector) {
                    tryActivation(connector.connector, connector.wallet)
                  }
                }}
              >
                {connector.wallet}
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default Home
