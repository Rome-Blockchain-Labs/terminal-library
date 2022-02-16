import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const EosIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 24.092}
      viewBox="0 0 15.997 24.092"
      width={width ?? 15.997}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5700"
        id="Group_5700"
        transform="translate(-1861.654 -454.634)"
      >
        <g data-name="Layer 2" id="Layer_2">
          <g data-name="Layer 1-2" id="Layer_1-2">
            <TransitionPath
              d="M1869.652,454.634l-5.637,7.758-2.361,11.467,8,4.867,8-4.867-2.409-11.516Zm-6.7,18.7,1.782-8.721,4.048,12.287Zm2.361-10.7,4.336-5.975,4.337,5.975-4.337,13.106Zm5.155,14.262,4.048-12.287,1.783,8.721Z"
              data-name="Path 5870"
              fill={active ? activeColor : color}
              id="Path_5870"
            />
          </g>
        </g>
      </g>
    </svg>
  )
)
