import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const MenuIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 24}
      viewBox="0 0 24 24"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M4 6h16M4 12h16M4 18h16"
        stroke={active ? activeColor : color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
)
