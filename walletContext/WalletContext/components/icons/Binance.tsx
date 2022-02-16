import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const BinanceIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 23.39}
      viewBox="0 0 23.389 23.39"
      width={width ?? 23.389}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Layer 2"
        id="Layer_2"
        transform="translate(-1857.958 -366.726)"
      >
        <g data-name="Layer 1-2" id="Layer_1-2">
          <TransitionPath
            d="M1865.11,376.555l4.542-4.543,4.545,4.545,2.643-2.643-7.188-7.188-7.185,7.186,2.643,2.643m-7.152,1.866,2.643-2.643,2.643,2.642-2.644,2.644Zm7.152,1.867,4.542,4.542,4.545-4.545,2.644,2.642h0l-7.188,7.188-7.185-7.186,0,0,2.647-2.64m10.951-1.865,2.643-2.643,2.643,2.643-2.643,2.643Z"
            data-name="Path 5868"
            fill={active ? activeColor : color}
            id="Path_5868"
          />
          <TransitionPath
            d="M1872.333,378.42h0l-2.682-2.682-1.982,1.981h0l-.228.228-.469.47,0,0,0,0,2.679,2.68,2.682-2.682h0"
            data-name="Path 5869"
            fill={active ? activeColor : color}
            id="Path_5869"
          />
        </g>
      </g>
    </svg>
  )
)
