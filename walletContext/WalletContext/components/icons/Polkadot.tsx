import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const PolkadotIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 21.64}
      viewBox="0 0 16.178 21.64"
      width={width ?? 16.178}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5687"
        id="Group_5687"
        transform="translate(-1861.563 -307.21)"
      >
        <g data-name="Group 5686" id="Group_5686">
          <TransitionPath
            d="M1869.761,307.21a8.231,8.231,0,0,0-8.2,8.2,8.429,8.429,0,0,0,.432,2.663,1.128,1.128,0,1,0,2.139-.719,5.408,5.408,0,0,1-.319-2.09,5.914,5.914,0,1,1,6.27,6.081s-1.151.07-1.723.14a6.094,6.094,0,0,0-.627.124.074.074,0,0,1-.107,0h0a.074.074,0,0,1,0-.091l.178-.972,1.081-4.861a1.124,1.124,0,1,0-2.2-.47s-2.57,11.9-2.57,12.006a1.08,1.08,0,0,0,.78,1.313l.019,0h.06a1.079,1.079,0,0,0,1.316-.775.267.267,0,0,0,.007-.03.226.226,0,0,1,0-.053c.032-.14.356-1.723.356-1.723a2.917,2.917,0,0,1,2.414-2.3c.248-.038,1.291-.108,1.291-.108a8.192,8.192,0,0,0-.6-16.341Z"
            data-name="Path 5500"
            fill={active ? activeColor : color}
            id="Path_5500"
          />
          <TransitionPath
            d="M1870.258,326.112a1.367,1.367,0,0,0-1.616,1.059l0,.021a1.36,1.36,0,0,0,1.04,1.619h.04a1.338,1.338,0,0,0,1.616-.987l.005-.017v-.075A1.417,1.417,0,0,0,1870.258,326.112Z"
            data-name="Path 5501"
            fill={active ? activeColor : color}
            id="Path_5501"
          />
        </g>
      </g>
    </svg>
  )
)
