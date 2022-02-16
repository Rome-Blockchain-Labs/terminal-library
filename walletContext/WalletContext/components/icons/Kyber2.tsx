import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const Kyber2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14}
      viewBox="0 0 14 14"
      width={width ?? 14}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="logo - Kyber">
        <g data-name="logo - Velox">
          <g data-name="Group 5123">
            <g data-name="Group 6178">
              <g data-name="Component 87 – 10">
                <circle
                  cx="7"
                  cy="7"
                  data-name="Ellipse 58"
                  fill="#b4bbc7"
                  r="7"
                />
              </g>
              <g data-name="Group 5117" transform="translate(.65 .663)">
                <circle
                  cx="6"
                  cy="6"
                  data-name="Ellipse 63"
                  fill="#fff"
                  r="6"
                  transform="translate(.35 .337)"
                />
              </g>
            </g>
          </g>
        </g>
        <g fill="#31cb9e">
          <TransitionPath
            d="m6.588 7.003 3.578 2.049a.189.189 0 0 0 .286-.163V5.113a.187.187 0 0 0-.286-.162Z"
            data-name="Path 6850"
          />
          <TransitionPath
            d="M10.09 4.044 7.645 2.245a.195.195 0 0 0-.306.1l-.894 4.01 3.624-2a.18.18 0 0 0 .021-.308"
            data-name="Path 6851"
          />
          <TransitionPath
            d="m7.645 11.758 2.449-1.8a.183.183 0 0 0-.02-.312L6.445 7.643l.893 4.007a.193.193 0 0 0 .3.11"
            data-name="Path 6852"
          />
          <TransitionPath
            d="m5.658 6.928.93-4.351a.185.185 0 0 0-.286-.187L3.919 4.217a.494.494 0 0 0-.193.394v4.637a.494.494 0 0 0 .193.4L6.29 11.47a.185.185 0 0 0 .286-.187Z"
            data-name="Path 6853"
          />
        </g>
      </g>
    </svg>
  )
)
