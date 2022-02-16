import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const SolanaIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.888}
      viewBox="0 0 19.048 14.888"
      width={width ?? 19.048}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5726"
        id="Group_5726"
        transform="translate(-1609.832 -538.514)"
      >
        <TransitionPath
          d="M1612.928,538.7a.643.643,0,0,1,.44-.182h15.2a.312.312,0,0,1,.221.532l-3,3a.625.625,0,0,1-.44.182h-15.2a.311.311,0,0,1-.22-.531Z"
          data-name="Path 6008"
          fill={active ? activeColor : color}
          id="Path_6008"
        />
        <TransitionPath
          d="M1625.784,544.265a.621.621,0,0,0-.44-.182h-15.2a.311.311,0,0,0-.312.309.315.315,0,0,0,.092.223l3,3a.626.626,0,0,0,.44.182h15.2a.312.312,0,0,0,.221-.532Z"
          data-name="Path 6009"
          fill={active ? activeColor : color}
          id="Path_6009"
        />
        <TransitionPath
          d="M1612.928,549.87a.643.643,0,0,1,.44-.182h15.2a.312.312,0,0,1,.221.532l-3,3a.625.625,0,0,1-.44.182h-15.2a.311.311,0,0,1-.22-.531Z"
          data-name="Path 6010"
          fill={active ? activeColor : color}
          id="Path_6010"
        />
      </g>
    </svg>
  )
)
