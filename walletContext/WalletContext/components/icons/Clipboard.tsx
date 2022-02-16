import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ClipboardIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      fill="none"
      height={height ?? 13}
      hoverStrokeColor={activeColor}
      stroke={color ? color : 'currentColor'}
      viewBox="0 0 24 24"
      width={width ?? 13}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SVG>
  )
)
