import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const StellarIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16.778}
      viewBox="0 0 19.83 16.778"
      width={width ?? 19.83}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5705"
        id="Group_5705"
        transform="translate(-1859.737 -399.144)"
      >
        <g data-name="Layer 2" id="Layer_2">
          <g data-name="Layer 1-2" id="Layer_1-2">
            <TransitionPath
              d="M1876.768,401.34l-2.388,1.216-11.529,5.873a6.868,6.868,0,0,1,10.159-6.884l1.366-.7.2-.1a8.39,8.39,0,0,0-13.317,6.791q0,.319.024.638a1.526,1.526,0,0,1-.829,1.475l-.721.368v1.714l2.122-1.082h0l.687-.351.677-.344h0l12.155-6.193,1.366-.7,2.823-1.439v-1.713Z"
              data-name="Path 5908"
              fill={active ? activeColor : color}
              id="Path_5908"
            />
            <TransitionPath
              d="M1879.567,403.34l-15.653,7.97-1.366.7-2.811,1.432v1.713l2.792-1.422,2.387-1.217,11.542-5.881a7,7,0,0,1,.058.9,6.869,6.869,0,0,1-10.227,5.987l-.084.044-1.482.755a8.39,8.39,0,0,0,13.319-6.786c0-.216-.009-.431-.025-.645a1.526,1.526,0,0,1,.828-1.474l.722-.368Z"
              data-name="Path 5909"
              fill={active ? activeColor : color}
              id="Path_5909"
            />
          </g>
        </g>
      </g>
    </svg>
  )
)
