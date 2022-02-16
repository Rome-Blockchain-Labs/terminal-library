import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const LinkIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.185}
      hoverColor={activeColor}
      viewBox="0 0 11.185 11.185"
      width={width ?? 11.185}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5112"
        id="Group_5112"
        transform="translate(-1124.021 -785.992)"
      >
        <g
          data-name="Group 5110"
          id="Group_5110"
          transform="translate(1127.87 785.992)"
        >
          <TransitionPath
            d="M1132.258,794h-.029a2.683,2.683,0,0,1-1.9-.811.468.468,0,0,1,.668-.654,1.756,1.756,0,0,0,1.243.53h.018a1.748,1.748,0,0,0,1.234-.5l2.581-2.58a1.788,1.788,0,0,0-2.529-2.529l-.318.319a.468.468,0,0,1-.661-.661l.319-.319a2.723,2.723,0,0,1,3.851,3.851l-2.552,2.552A2.711,2.711,0,0,1,1132.258,794Z"
            data-name="Path 2058"
            fill={active ? activeColor : color}
            id="Path_2058"
            transform="translate(-1130.195 -785.992)"
          />
        </g>
        <g
          data-name="Group 5111"
          id="Group_5111"
          transform="translate(1124.021 789.171)"
        >
          <TransitionPath
            d="M1126.742,799.1a2.722,2.722,0,0,1-1.926-4.648l2.552-2.551a2.711,2.711,0,0,1,1.925-.807h.028a2.678,2.678,0,0,1,1.9.811.467.467,0,1,1-.668.653,1.751,1.751,0,0,0-1.242-.529,1.781,1.781,0,0,0-1.253.5l-2.582,2.58a1.788,1.788,0,0,0,2.529,2.529l.319-.319a.467.467,0,0,1,.661.661l-.319.319A2.715,2.715,0,0,1,1126.742,799.1Z"
            data-name="Path 2059"
            fill={active ? activeColor : color}
            id="Path_2059"
            transform="translate(-1124.021 -791.092)"
          />
        </g>
      </g>
    </SVG>
  )
)
