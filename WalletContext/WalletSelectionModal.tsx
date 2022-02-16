import React, { FC, useRef } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import tw from 'twin.macro'
import useOnClickOutside from 'use-onclickoutside'
import { CloseButton } from './components/buttons'
import { AvalancheIcon, BinanceIcon } from './components/icons'
import { WalletName } from './constants'
import MetamaskLogo from './images/logos/MetamaskLogo'
import { useWallets } from './WalletContext'

const ExtraWidgetDivider = tw.div`border-b border-solid border-gray-400 ml-3 mr-3 mt-1.5 mb-3.5`

const HoverBox: FC<{ text: string; onClick: () => void }> = (props) => {
  const { onClick, text } = props
  return (
    <div
      tw="flex items-center min-w-[100px] min-h-[100px] rounded border border-solid border-gray-400 p-3 cursor-pointer justify-center text-center text-lg hover:bg-gray-400 hover:font-bold grayscale hover:grayscale-0 transition m-5"
      onClick={onClick}
    >
      <div>
        <div tw="m-auto mb-3 w-auto max-w-min">{props.children}</div>
        <div>{text}</div>
      </div>
    </div>
  )
}

const WalletBox: FC<{ walletName: WalletName }> = (props) => {
  const { walletName } = props
  const { connectToWallet } = useWallets()
  return (
    <HoverBox
      text={walletName.toUpperCase()}
      onClick={() => connectToWallet('metamask')}
    >
      {props.children}
    </HoverBox>
  )
}

const WalletSelectionModal: (props: { children?: any }) => any = (props) => {
  const {
    active,
    cancelWalletChangePrompt,
    promptingWalletChange,
    switchNetwork,
  } = useWallets()
  console.log(promptingWalletChange)
  const ref = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(ref, cancelWalletChangePrompt)

  if (!promptingWalletChange) {
    return null
  }

  if (!active) {
    return (
      <>
        <div tw="absolute top-0 z-20 w-full h-full bg-black bg-opacity-80" />
        <div tw="absolute top-0 w-full h-full z-30 flex justify-center items-center">
          <div
            ref={ref}
            tw="bg-dark-400 max-w-xl w-full p-7 rounded-xl text-gray-100 flex flex-col items-center"
          >
            <div tw="flex justify-between text-yellow-400 pb-4 w-full">
              <div tw="flex-grow ">CONNECT TO WALLET</div>
              <CloseButton onClick={cancelWalletChangePrompt} />
            </div>
            <ExtraWidgetDivider css={['width:100%']} />
            <div tw="flex">
              <WalletBox walletName={'metamask'}>
                <MetamaskLogo size={30} />
              </WalletBox>
            </div>
            <div tw="mt-5 text-lg">
              By connecting, I accept the Wallet's Terms of Service
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div tw="absolute top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="absolute top-0 w-full h-full z-30 flex justify-center items-center">
        <div
          ref={ref}
          tw="bg-dark-400 max-w-xl w-full p-7 rounded-xl text-gray-100 flex flex-col items-center"
        >
          <div tw="flex justify-between text-yellow-400 pb-4 w-full">
            <div tw="flex-grow text-center">SELECT A METAMASK NETWORK</div>
            <CloseButton onClick={cancelWalletChangePrompt} />
          </div>
          <ExtraWidgetDivider css={['width:100%']} />
          <div tw="flex">
            <HoverBox
              text={'Avalanche'}
              onClick={() => switchNetwork('Avalanche')}
            >
              <AvalancheIcon color={'gray-100'} />
            </HoverBox>
            <HoverBox text={'BSC'} onClick={() => switchNetwork('BSC')}>
              <BinanceIcon color={'gray-100'} />
            </HoverBox>
            <HoverBox text={'Rinkeby'} onClick={() => switchNetwork('Rinkeby')}>
              <BinanceIcon color={'gray-100'} />
            </HoverBox>
          </div>
        </div>
      </div>
    </>
  )
}

export default WalletSelectionModal
