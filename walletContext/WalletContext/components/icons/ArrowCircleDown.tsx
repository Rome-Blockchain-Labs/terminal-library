import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const ArrowCircleDownIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      fill="none"
      height={height ?? 24}
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>
  )
)
