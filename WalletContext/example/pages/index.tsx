import type { NextPage } from 'next'
import { useCallback } from 'react'
import {
  useActiveWeb3React,
  useWallet,
  MetamaskConnector,
  WalletConnectConnector,
  WALLETS,
  getWalletForConnector,
} from 'web3react-v8-ian'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { wallet, hooks } = MetamaskConnector
  const account = hooks.useAccount()
  console.log(account)
  const { setSelectedWallet } = useWallet()

  const tryActivation = useCallback(async (connector: any) => {
    const wallet = getWalletForConnector(connector)
    try {
      console.log('trying to cconnct', wallet, connector.activate)
      await connector.activate().catch((err: any) => {
        console.log(err)
      })
      setSelectedWallet(wallet as any)
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`)
    }
  }, [])

  const getOptions = () => {
    return WALLETS.map((wallet: any) => {
      // const isActive = wallet.connector === connector

      return (
        <div key={wallet.name}>
          {/* <div>{isActive ? 'connected' : 'disconnected'}</div> */}
          <button onClick={() => tryActivation(wallet.connector)}>{wallet.name}</button>
        </div>
        // <Option
        //   {...optionProps}
        //   onClick={() => {
        //     if (!isActive && !option.href && !!option.connector) {
        //       tryActivation(option.connector, option.name)
        //     }
        //   }}
        //   subheader={null}
        // />
      )

      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              {...optionProps}
              onClick={() => {
                if (!isActive && !option.href && !!option.connector) {
                  tryActivation(option.connector)
                }
              }}
              subheader={null}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={<Trans>Install Metamask</Trans>}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        } else if (option.name === 'Injected' && isTally) {
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              onClick={() => {
                option.connector === connector
                  ? setWalletView(WALLET_VIEWS.ACCOUNT)
                  : !option.href && option.connector && tryActivation(option.connector)
              }}
              color={'#E8831D'}
              header={<Trans>Tally</Trans>}
              active={option.connector === connector}
              subheader={null}
              link={null}
              icon={TallyIcon}
            />
          )
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            {...optionProps}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && option.connector && tryActivation(option.connector)
            }}
            subheader={null} //use option.descriptio to bring back multi-line
          />
        )
      )
    })
  }
  return (
    <div className={styles.container}>
      account:{account}
      {getOptions()}
      <button onClick={() => wallet.activate()}>metamask</button>
    </div>
  )
}

export default Home
