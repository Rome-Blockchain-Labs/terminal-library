import React, { FC, memo } from 'react'

import {
  IIconProps,
  TransitionCircle,
  TransitionEllipse,
  TransitionPath,
} from '.'

export const CosmosIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 21.747}
      viewBox="0 0 19.02 21.747"
      width={width ?? 19.02}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5706"
        id="Group_5706"
        transform="translate(-21.185 -528.01)"
      >
        <TransitionPath
          d="M1869.652,545.847c-1.342,0-2.43,4.868-2.43,10.873s1.088,10.874,2.43,10.874,2.431-4.868,2.431-10.874S1870.994,545.847,1869.652,545.847Zm.168,21.133a.192.192,0,0,1-.307.051,5.774,5.774,0,0,1-.927-2.047c-1.081-3.479-.824-10.949-.824-10.949.508-5.931,1.432-7.332,1.747-7.643a.191.191,0,0,1,.246-.02c.456.323.839,1.676.839,1.676a31.973,31.973,0,0,1,1.028,8.135,42.284,42.284,0,0,1-.566,7.266C1870.541,566.365,1869.82,566.98,1869.82,566.98Z"
          data-name="Path 5902"
          fill={active ? activeColor : color}
          id="Path_5902"
          transform="translate(-1838.958 -17.837)"
        />
        <TransitionPath
          d="M1879.084,551.309c-.669-1.164-5.432.315-10.644,3.3s-8.887,6.355-8.219,7.519,5.432-.314,10.643-3.3,8.887-6.355,8.22-7.52Zm-18.247,10.662c-.255-.032-.2-.242-.2-.242a5.779,5.779,0,0,1,1.313-1.823c2.481-2.669,9.089-6.164,9.089-6.164,5.4-2.51,7.073-2.4,7.5-2.287a.191.191,0,0,1,.139.2c-.051.557-1.036,1.562-1.036,1.562a31.876,31.876,0,0,1-6.543,4.942,42.188,42.188,0,0,1-6.584,3.124c-2.786,1-3.678.684-3.678.684Z"
          data-name="Path 5903"
          fill={active ? activeColor : color}
          id="Path_5903"
          transform="translate(-1838.958 -17.837)"
        />
        <TransitionPath
          d="M1879.06,562.17c.673-1.162-2.994-4.544-8.187-7.555s-9.956-4.507-10.628-3.344,2.993,4.544,8.189,7.554S1878.387,563.333,1879.06,562.17Zm-18.369-10.45a.194.194,0,0,1,.11-.293,5.782,5.782,0,0,1,2.236.225c3.552.809,9.887,4.777,9.887,4.777,4.877,3.413,5.625,4.916,5.737,5.343a.191.191,0,0,1-.106.223,4.324,4.324,0,0,1-1.871-.114,31.994,31.994,0,0,1-7.556-3.189,42.023,42.023,0,0,1-6-4.13c-2.266-1.909-2.437-2.84-2.437-2.84Z"
          data-name="Path 5904"
          fill={active ? activeColor : color}
          id="Path_5904"
          transform="translate(-1838.958 -17.837)"
        />
        <TransitionCircle
          cx="1.279"
          cy="1.279"
          data-name="Ellipse 89"
          fill={active ? activeColor : color}
          id="Ellipse_89"
          r="1.279"
          transform="translate(29.415 537.578)"
        />
        <TransitionEllipse
          cx="0.742"
          cy="0.768"
          data-name="Ellipse 90"
          fill={active ? activeColor : color}
          id="Ellipse_90"
          rx="0.742"
          ry="0.768"
          transform="translate(29.952 533.178)"
        />
        <TransitionEllipse
          cx="0.742"
          cy="0.768"
          data-name="Ellipse 91"
          fill={active ? activeColor : color}
          id="Ellipse_91"
          rx="0.742"
          ry="0.768"
          transform="translate(29.952 535.788)"
        />
        <TransitionEllipse
          cx="0.742"
          cy="0.768"
          data-name="Ellipse 92"
          fill={active ? activeColor : color}
          id="Ellipse_92"
          rx="0.742"
          ry="0.768"
          transform="translate(29.952 545.202)"
        />
      </g>
    </svg>
  )
)
