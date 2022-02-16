import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const BenqiIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.837}
      viewBox="0 0 14.832 14.837"
      width={width ?? 14.832}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M3.001 6.524a4.572 4.572 0 0 1 9.036.984 3.566 3.566 0 0 1-.091.846l1.533 3.34a7.41 7.41 0 1 0-4.827 3.043l-1.19-2.631a4.56 4.56 0 0 1-4.552-4.6 3.487 3.487 0 0 1 .092-.984"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M13.502 14.807H10.07l-2.15-4.8h3.408z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
