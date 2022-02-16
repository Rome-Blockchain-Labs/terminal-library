import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ExtendIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.185}
      hoverColor={activeColor}
      viewBox="0 0 12.833 11.185"
      width={width ?? 12.833}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5057"
        id="Group_5057"
        transform="translate(-304.176 -787.33)"
      >
        <TransitionPath
          d="M315.077,787.33h-8.968a1.935,1.935,0,0,0-1.933,1.933v7.321a1.935,1.935,0,0,0,1.933,1.932h3.111a.468.468,0,0,0,0-.937h-3.111a1,1,0,0,1-1-1v-7.321a1,1,0,0,1,1-1h8.968a1,1,0,0,1,1,1v2.928a.468.468,0,1,0,.936,0v-2.928A1.935,1.935,0,0,0,315.077,787.33Z"
          data-name="Path 1996"
          fill={active ? activeColor : color}
          id="Path_1996"
        />
        <TransitionPath
          d="M319.884,797.884h-3.661a1.2,1.2,0,0,0-1.2,1.2v2.2a1.2,1.2,0,0,0,1.2,1.2h3.661a1.2,1.2,0,0,0,1.2-1.2v-2.2A1.2,1.2,0,0,0,319.884,797.884Zm.263,3.4a.264.264,0,0,1-.263.263h-3.661a.263.263,0,0,1-.263-.263v-2.2a.264.264,0,0,1,.263-.264h3.661a.264.264,0,0,1,.263.264Z"
          data-name="Path 1997"
          fill={active ? activeColor : color}
          id="Path_1997"
          transform="translate(-4.075 -3.965)"
        />
        <TransitionPath
          d="M309.44,791.931H310.5a.468.468,0,1,0,0-.936h-2.2a.471.471,0,0,0-.468.468v2.2a.468.468,0,1,0,.936,0v-1.066l2.129,2.128a.468.468,0,0,0,.662-.662Z"
          data-name="Path 1998"
          fill={active ? activeColor : color}
          id="Path_1998"
          transform="translate(-1.377 -1.377)"
        />
      </g>
    </SVG>
  )
)
