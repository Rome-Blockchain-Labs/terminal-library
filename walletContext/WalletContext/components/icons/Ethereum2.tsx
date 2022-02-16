import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Ethereum2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '32'}
    viewBox="0 0 32 32"
    width={width ? width : '32'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <TransitionCircle cx="16" cy="16" fill="#627EEA" r="16" />
      <g fill="#FFF" fillRule="nonzero">
        <TransitionPath d="M16.498 4v8.87l7.497 3.35z" fillOpacity=".602" />
        <TransitionPath d="M16.498 4L9 16.22l7.498-3.35z" />
        <TransitionPath
          d="M16.498 21.968v6.027L24 17.616z"
          fillOpacity=".602"
        />
        <TransitionPath d="M16.498 27.995v-6.028L9 17.616z" />
        <TransitionPath
          d="M16.498 20.573l7.497-4.353-7.497-3.348z"
          fillOpacity=".2"
        />
        <TransitionPath d="M9 16.22l7.498 4.353v-7.701z" fillOpacity=".602" />
      </g>
    </g>
  </svg>
))
