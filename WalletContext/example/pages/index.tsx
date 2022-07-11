import type { NextPage } from 'next'
import { useCallback, useEffect } from 'react'
import { useActiveWeb3React, useWallet, SUPPORTED_WALLETS } from 'web3react-v8-ian'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { connector, account, isActive } = useActiveWeb3React()
  const { setSelectedWallet } = useWallet()
  const tryActivation = useCallback(async (connector: any) => {
    console.log(connector.provider)
    // const wallet = getWalletForConnector(connector)

    // log selected wallet

    try {
      await connector.activate()
      setSelectedWallet('INJECTED' as any)
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`)
    }
  }, [])
  const getOptions = () => {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      const isActive = option.connector === connector

      const optionProps = {
        active: isActive,
        id: `connect-${key}`,
        link: option.href,
        header: option.name,
        color: option.color,
        key,
        icon: option.iconURL,
      }
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
      <button
        onClick={() => {
          SUPPORTED_WALLETS.METAMASK?.connector?.activate(1)
          setSelectedWallet('INJECTED' as any)
        }}
      >
        adf
      </button>
      {account}
      {getOptions()}
    </div>
  )
}

export default Home

function Option({
  link = null,
  clickable = true,
  size,
  onClick,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: () => void
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <button id={id} onClick={onClick}>
      <div>
        <div color={color}>
          {active ? (
            <div>
              <div>
                <div />
              </div>
            </div>
          ) : (
            ''
          )}
          {header}
        </div>
        {subheader && <div>{subheader}</div>}
      </div>
    </button>
  )
  if (link) {
    return <div>{content}</div>
  }

  return content
}
