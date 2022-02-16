import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const NulsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 15.871}
      viewBox="0 0 9.523 15.871"
      width={width ?? 9.523}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5703"
        id="Group_5703"
        transform="translate(-1863.912 -577.082)"
      >
        <TransitionPath
          d="M1867.406,587.684l1.267,1.67v3.6l-4.761-2.113v-9.3a.471.471,0,0,1,.167-.359l.542-.464a.5.5,0,0,1,.712.051l.021.026,4.337,5.685,2.4,1.465V580.1l-2.117-1.056-.1,4.917-1.121-1.486-.051-5.4,4.739,2.206v9.256l-1.077.887-3.392-1.894L1865.2,582.6l-.051,7.5,2.242,1.148Z"
          data-name="Path 5905"
          fill={active ? activeColor : color}
          id="Path_5905"
        />
      </g>
    </svg>
  )
)
