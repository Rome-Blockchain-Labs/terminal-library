import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Connector } from '@web3-react/types'
import { useWallets, useActiveWeb3React, SUPPORTED_WALLETS } from '@romeblockchain/wallet'

const Home: NextPage = () => {
  const { setSelectedWallet } = useWallets()
  const { hooks, wallet } = useActiveWeb3React()

  const account = hooks?.useAccount()
  const active = hooks?.useIsActive()

  const [web3Account, setWeb3Account] = useState<string>()
  const [web3Wallet, setWeb3Wallet] = useState<string>()

  const tryActivation = useCallback(async (connector: Connector, wallet: any) => {
    try {
      await connector.activate()
      setSelectedWallet(wallet)
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`)
    }
  }, [])

  useEffect(() => {
    if (account) {
      setWeb3Account(account)
    }

    if (wallet) {
      setWeb3Wallet(wallet)
    }
  }, [account, wallet])

  return (
    <div className={styles.container}>
      <div>Active Account</div>
      <div>{web3Wallet}</div>
      <div>{web3Account}</div>
      <div>{active ? 'connected' : 'disconnected'}</div>

      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key]
        return (
          <div key={key}>
            <button
              onClick={() => {
                if (option.connector) {
                  tryActivation(option.connector, option.wallet)
                }
              }}
            >
              {option.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Home
