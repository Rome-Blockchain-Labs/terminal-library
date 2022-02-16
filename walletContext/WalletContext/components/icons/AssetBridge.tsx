import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const AssetBridgeIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 10.94}
      viewBox="0 0 14.702 10.94"
      width={width ?? 14.702}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5130"
        id="Group_5130"
        transform="translate(-1188.232 -791.452)"
      >
        <TransitionPath
          d="M1201.476,802.392h-1.191a1.459,1.459,0,0,1-1.458-1.457v-1.881a3.244,3.244,0,0,0-6.488,0v1.881a1.459,1.459,0,0,1-1.458,1.457h-1.191a1.459,1.459,0,0,1-1.458-1.457v-7.084a2.4,2.4,0,0,1,2.4-2.4h9.905a2.4,2.4,0,0,1,2.4,2.4v7.084A1.46,1.46,0,0,1,1201.476,802.392Zm-5.893-7.616a4.283,4.283,0,0,1,4.278,4.278v1.881a.424.424,0,0,0,.423.423h1.191a.424.424,0,0,0,.423-.423v-7.084a1.365,1.365,0,0,0-1.363-1.364h-9.905a1.365,1.365,0,0,0-1.364,1.364v7.084a.424.424,0,0,0,.423.423h1.191a.423.423,0,0,0,.423-.423v-1.881A4.283,4.283,0,0,1,1195.583,794.775Z"
          data-name="Path 2077"
          fill={active ? activeColor : color}
          id="Path_2077"
        />
      </g>
    </svg>
  )
)
