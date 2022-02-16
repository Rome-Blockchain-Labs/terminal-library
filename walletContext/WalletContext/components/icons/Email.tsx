import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const EmailIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      fill="none"
      height={height ?? 20}
      hoverStrokeColor={activeColor}
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={width ?? 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SVG>
  )
)
