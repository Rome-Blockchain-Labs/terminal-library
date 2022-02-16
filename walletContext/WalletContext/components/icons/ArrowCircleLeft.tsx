import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ArrowCircleLeftIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      fill="none"
      height={height ?? 24}
      hoverStrokeColor={activeColor}
      viewBox="2 2 20 20"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
        stroke={active ? activeColor : color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SVG>
  )
)
