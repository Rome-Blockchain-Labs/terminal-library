import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const FilledStarIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.188}
      hoverColor={activeColor}
      viewBox="0 0 20 20"
      width={width ?? 11.716}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M19.1,8c-0.1-0.2-0.2-0.3-0.4-0.3l-5.6-0.8l-2.5-5c-0.2-0.3-0.7-0.3-0.9,0l-2.5,5L1.7,7.6
        C1.5,7.6,1.4,7.8,1.3,8c-0.1,0.2,0,0.4,0.1,0.5l4,3.9l-1,5.5c0,0.2,0,0.4,0.2,0.5c0.1,0.1,0.2,0.1,0.3,0.1c0.1,0,0.2,0,0.2-0.1
        l5-2.6l5,2.6c0.2,0.1,0.4,0.1,0.5,0c0.2-0.1,0.2-0.3,0.2-0.5l-1-5.5l4-3.9C19.1,8.3,19.2,8.1,19.1,8z"
        data-name="Path 141"
        fill={active ? activeColor : color}
        id="Path_141"
      />
    </SVG>
  )
)
