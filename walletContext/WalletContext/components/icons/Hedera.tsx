import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const HederaIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 12.363}
      viewBox="0 0 11.481 12.363"
      width={width ?? 11.481}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Layer 2"
        id="Layer_2"
        transform="translate(-1863.244 -609.573)"
      >
        <g
          data-name="Layer 1-2"
          id="Layer_1-2"
          transform="translate(1863.244 609.573)"
        >
          <TransitionPath
            d="M1874.725,621.936h-1.793v-3.812h-7.894v3.812h-1.793V609.573h1.793v3.721h7.894v-3.721h1.793Zm-9.6-5.239h7.894v-1.97h-7.894Z"
            data-name="Path 5906"
            fill={active ? activeColor : color}
            id="Path_5906"
            transform="translate(-1863.244 -609.573)"
          />
        </g>
      </g>
    </svg>
  )
)
