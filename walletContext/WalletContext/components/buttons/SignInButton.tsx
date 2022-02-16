import React, { FC } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import tw, { theme } from 'twin.macro'
import { Default } from '../../../utils/mediaQuery'

import { SignInIcon } from '../icons'

export const SignInButton: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const active = false

  return (
    <>
      <button
        css={[
          tw`inline-flex items-center justify-center text-xl font-medium text-yellow-400 cursor-not-allowed`,
          isMobile && tw`px-2`,
          !active && tw`text-gray-300`,
        ]}
        data-for="layout-qwe"
        data-tip="Coming soon"
      >
        <SignInIcon
          color={
            isMobile || !active
              ? theme`colors.gray.400`
              : theme`colors.yellow.400`
          }
        />
        <Default>
          <span tw="ml-2">SIGN-IN</span>
        </Default>
      </button>
      <ReactTooltip
        border
        backgroundColor={theme`colors.gray.500`}
        delayHide={100}
        effect="solid"
        id="layout-qwe"
        place="bottom"
        textColor={theme`colors.yellow.400`}
        tw="transition rounded-full! text-lg! font-semibold"
      />
    </>
  )
}
