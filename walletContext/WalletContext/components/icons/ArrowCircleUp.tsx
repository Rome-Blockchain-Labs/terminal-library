import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const ArrowCircleUpIcon: FC<IIconProps> = memo(
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
        d="m9 11 3-3m0 0 3 3m-3-3v8m0-13a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  )
)
