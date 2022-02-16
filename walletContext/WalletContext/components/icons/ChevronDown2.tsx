import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const ChevronDown2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      fill="none"
      height={height ?? 24}
      stroke={active ? activeColor : color}
      viewBox="0 0 24 24"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="m19 9-7 7-7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  )
)
