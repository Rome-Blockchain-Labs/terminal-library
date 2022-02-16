import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const EyeHideIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.375}
      hoverColor={activeColor}
      viewBox="0 0 13.671 11.375"
      width={width ?? 13.671}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1313.1,776.094a.48.48,0,1,0-.686.672l1.391,1.42a10.939,10.939,0,0,0-2.74,3.3.479.479,0,0,0,0,.476c1.779,3.112,4.058,4.69,6.772,4.69a6.432,6.432,0,0,0,3.34-.94l1.441,1.471a.48.48,0,1,0,.687-.672Zm3.981,5.436.929.948a.77.77,0,0,1-.175.035h0a.775.775,0,0,1-.753-.983Zm.755,4.159c-2.311,0-4.209-1.3-5.8-3.968a9.535,9.535,0,0,1,2.453-2.836l1.867,1.9a1.745,1.745,0,0,0,2.379,2.429l1.749,1.785A5.477,5.477,0,0,1,1317.836,785.689Z"
        data-name="Path 2095"
        fill={active ? activeColor : color}
        id="Path_2095"
        transform="translate(-1311 -775.95)"
      />
      <TransitionPath
        d="M1327.239,781.952c-1.779-3.113-4.057-4.691-6.77-4.691a5.487,5.487,0,0,0-1.81.25.48.48,0,0,0-.329.593.474.474,0,0,0,.594.33,5.561,5.561,0,0,1,1.525-.213h.019c2.31,0,4.209,1.3,5.8,3.969a11.4,11.4,0,0,1-1.388,1.891.48.48,0,0,0,.705.652,12.65,12.65,0,0,0,1.655-2.3A.479.479,0,0,0,1327.239,781.952Z"
        data-name="Path 2096"
        fill={active ? activeColor : color}
        id="Path_2096"
        transform="translate(-1313.631 -776.42)"
      />
    </SVG>
  )
)
