import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const ChevronDownIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 5}
      viewBox="0 0 9 5"
      width={width ?? 9}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M4.5,0,9,5H0Z"
        data-name="Path 2031"
        fill={active ? activeColor : color}
        id="Path_2031"
        transform="translate(9 5) rotate(180)"
      />
    </svg>
  )
)
