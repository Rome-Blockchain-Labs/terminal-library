import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Stellar2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5683"
      id="Group_5683"
      transform="translate(-1792.333 -395.304)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 88"
        fill="#fff"
        id="Ellipse_88"
        r="12.5"
        transform="translate(1792.333 395.304)"
      />
      <g data-name="Layer 2" id="Layer_2">
        <g data-name="Layer 1-2" id="Layer_1-2">
          <TransitionPath
            d="M1811.948,401.579l-2.387,1.216-11.53,5.873a7.058,7.058,0,0,1-.059-.9,6.87,6.87,0,0,1,10.218-5.988l1.367-.7.2-.1a8.39,8.39,0,0,0-13.317,6.791q0,.32.024.638a1.525,1.525,0,0,1-.829,1.475l-.72.367v1.714l2.121-1.081h0l.688-.351.677-.345h0L1810.558,404l1.366-.695,2.823-1.439v-1.713Z"
            data-name="Path 5496"
            id="Path_5496"
          />
          <TransitionPath
            d="M1814.747,403.579l-15.653,7.97-1.366.7-2.81,1.432v1.712l2.791-1.422,2.388-1.216,11.541-5.881a6.975,6.975,0,0,1,.059.9,6.868,6.868,0,0,1-10.228,5.986l-.084.045-1.481.755a8.39,8.39,0,0,0,13.318-6.786c0-.216-.008-.432-.024-.645a1.527,1.527,0,0,1,.828-1.475l.721-.367Z"
            data-name="Path 5497"
            id="Path_5497"
          />
        </g>
      </g>
    </g>
  </svg>
))
