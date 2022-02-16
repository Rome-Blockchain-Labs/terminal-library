import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const TronIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 20.791}
      viewBox="0 0 19.761 20.791"
      width={width ?? 19.761}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5685"
        id="Group_5685"
        transform="translate(-1861.369 -428.035)"
      >
        <g id="tron">
          <TransitionPath
            d="M1880.861,434.3c-.975-.9-2.323-2.274-3.421-3.249l-.065-.045a1.253,1.253,0,0,0-.36-.2h0c-2.648-.493-14.97-2.8-15.211-2.767a.441.441,0,0,0-.188.071l-.062.049a.718.718,0,0,0-.169.273l-.016.042v.266c1.387,3.863,6.864,16.517,7.943,19.486.065.2.188.585.419.6h.052c.123,0,.65-.695.65-.695s9.408-11.409,10.36-12.624a3.12,3.12,0,0,0,.325-.481A.785.785,0,0,0,1880.861,434.3Zm-8.015,1.329,4.016-3.33,2.355,2.17Zm-1.559-.218-6.913-5.666,11.185,2.063Zm.624,1.485,7.075-1.141L1870.9,445.5Zm-8.476-6.585,7.274,6.172-1.053,9.025Z"
            data-name="Path 5499"
            fill={active ? activeColor : color}
            id="Path_5499"
          />
        </g>
      </g>
    </svg>
  )
)
