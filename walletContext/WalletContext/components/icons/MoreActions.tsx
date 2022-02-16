import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const MoreActionsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg height={height ?? 16} viewBox="0 0 32 32" width={width ?? 16}>
      <TransitionPath
        d="M 16 4 C 9.3844277 4 4 9.3844277 4 16 C 4 22.615572 9.3844277 28 16 28 C 22.615572 28 28 22.615572 28 16 C 28 9.3844277 22.615572 4 16 4 z M 16 6 C 21.534692 6 26 10.465308 26 16 C 26 21.534692 21.534692 26 16 26 C 10.465308 26 6 21.534692 6 16 C 6 10.465308 10.465308 6 16 6 z M 10 14 C 8.9072754 14 8 14.907275 8 16 C 8 17.092725 8.9072754 18 10 18 C 11.092725 18 12 17.092725 12 16 C 12 14.907275 11.092725 14 10 14 z M 16 14 C 14.907275 14 14 14.907275 14 16 C 14 17.092725 14.907275 18 16 18 C 17.092725 18 18 17.092725 18 16 C 18 14.907275 17.092725 14 16 14 z M 22 14 C 20.907275 14 20 14.907275 20 16 C 20 17.092725 20.907275 18 22 18 C 23.092725 18 24 17.092725 24 16 C 24 14.907275 23.092725 14 22 14 z"
        fill={active ? activeColor : color}
        fontFamily="Sans"
        overflow="visible"
      />
    </svg>
  )
)
