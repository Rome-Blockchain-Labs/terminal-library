import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Binance2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5677"
      id="Group_5677"
      transform="translate(-1792.333 -366.16)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 76"
        fill="#fff"
        id="Ellipse_76"
        r="12.5"
        transform="translate(1792.333 366.16)"
      />
      <g data-name="Layer 2" id="Layer_2">
        <g data-name="Layer 1-2" id="Layer_1-2">
          <TransitionPath
            d="M1800.29,376.794l4.542-4.543,4.545,4.545,2.643-2.643-7.188-7.188-7.185,7.185,2.643,2.643m-7.152,1.867,2.643-2.644,2.643,2.643-2.643,2.643Zm7.152,1.866,4.542,4.542,4.545-4.544,2.644,2.642h0l-7.188,7.187-7.185-7.185,0,0,2.646-2.639m10.951-1.865,2.643-2.643,2.643,2.643-2.643,2.643Z"
            data-name="Path 5455"
            fill="#f3ba2f"
            id="Path_5455"
          />
          <TransitionPath
            d="M1807.513,378.658h0l-2.682-2.681-1.982,1.981h0l-.227.228-.47.47,0,0,0,0,2.679,2.68,2.682-2.682h0l0,0"
            data-name="Path 5456"
            fill="#f3ba2f"
            id="Path_5456"
          />
        </g>
      </g>
    </g>
  </svg>
))
