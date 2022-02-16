import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const DashboardIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 21.125}
      viewBox="0 0 23.518 21.125"
      width={width ?? 23.518}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Icon - Dashboard"
        id="Icon_-_Dashboard"
        transform="translate(-1329.46 -713.552)"
      >
        <TransitionPath
          d="M1344.974,720.551l-2.093,2.093a3.167,3.167,0,0,0-1.659-.478,3.229,3.229,0,1,0,2.719,1.538l2.093-2.093a.75.75,0,0,0-1.06-1.06Zm-3.752,6.509a1.7,1.7,0,1,1,1.7-1.7A1.7,1.7,0,0,1,1341.222,727.06Z"
          data-name="Path 52"
          fill={active ? activeColor : color}
          id="Path_52"
        />
        <TransitionPath
          d="M1348.54,716.1a11.761,11.761,0,1,0-14.636,18.413.753.753,0,0,0,.467.163h13.7a.753.753,0,0,0,.467-.163,11.761,11.761,0,0,0,0-18.413Zm.715,15.59a10.334,10.334,0,0,1-1.449,1.486h-13.168a10.261,10.261,0,1,1,14.617-1.486Z"
          data-name="Path 53"
          fill={active ? activeColor : color}
          id="Path_53"
        />
      </g>
    </svg>
  )
)
