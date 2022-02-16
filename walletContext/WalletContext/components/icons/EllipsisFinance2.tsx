import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const EllipsisFinance2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14}
      viewBox="0 0 14 14"
      width={width ?? 14}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="a"
          x1=".04"
          x2=".953"
          y1=".938"
          y2=".04"
        >
          <stop offset="0" stopColor="#56afe7" />
          <stop offset="1" stopColor="#3772d6" />
        </linearGradient>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="b"
          x2="1"
          y1=".5"
          y2=".5"
        >
          <stop offset="0" stopColor="#6063d9" />
          <stop offset="1" stopColor="#db7ace" />
        </linearGradient>
      </defs>
      <g data-name="logo - Ellipse Finance">
        <g data-name="logo - PancakeSwap">
          <g data-name="logo - TradeJoe">
            <g data-name="logo - Velox">
              <g data-name="Group 5123">
                <g data-name="Group 6178">
                  <g data-name="Component 87 – 19">
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
          </g>
        </g>
        <g data-name="Group 6945">
          <TransitionPath
            d="M1572.783 1637.532a7.73 7.73 0 0 0 1.831-.612c.189-.091.376-.191.557-.3l.024-.015a3.394 3.394 0 0 0 1.887-2.4 2.527 2.527 0 0 0-.213-1.3 3.794 3.794 0 0 1-1.419 2.3 4.417 4.417 0 0 1-1.031.588 2.4 2.4 0 0 1-2.129-.022l-.013-.009-.01-.012a2.546 2.546 0 0 1-.361-1.167.045.045 0 0 1 0-.006v-.049a3 3 0 0 1 1.5-2.594c.007 0 .186-.137.5-.318a6.98 6.98 0 0 1 .777-.4 7.484 7.484 0 0 1 1.089-.395l.063-.017c.094-.025.188-.047.281-.067.019 0 .138-.028.32-.054a4.966 4.966 0 0 1 2.288.133c-1.236-1.234-3.857-1.048-6.107.505a6.937 6.937 0 0 0-2.524 3.006 3.071 3.071 0 0 0 .089 2.9 1.875 1.875 0 0 0 .163.1 3.764 3.764 0 0 0 2.29.235c.1-.016.157-.029.16-.03Z"
            data-name="Path 7125"
            fill="url(#a)"
            transform="translate(-1567.576 -1627.184)"
          />
          <TransitionPath
            d="M1581.744 1642.056a4.428 4.428 0 0 1 1.031-.588 2.4 2.4 0 0 1 2.129.022l.013.01.01.011a2.562 2.562 0 0 1 .348 1.613 3.185 3.185 0 0 1-1.48 2.208c-.007.005-.19.14-.507.324a6.39 6.39 0 0 1-.568.3 7.312 7.312 0 0 1-1.638.576 5.477 5.477 0 0 1-1.668.143h-.014l-.073-.007-.044-.005h-.015a2.774 2.774 0 0 1-.777-.2c1.24 1.222 3.852 1.033 6.1-.515a6.944 6.944 0 0 0 2.524-3 3.066 3.066 0 0 0-.089-2.9 3.984 3.984 0 0 0-2.582-.3l-.1.019a8.78 8.78 0 0 0-.44.091l-.06.016a7.913 7.913 0 0 0-1.068.387 8.263 8.263 0 0 0-.762.392l-.014.009c-1.548.923-1.9 1.939-1.9 2.661v.153a2.567 2.567 0 0 0 .224.885 3.8 3.8 0 0 1 1.42-2.305Z"
            data-name="Path 7126"
            fill="url(#b)"
            transform="translate(-1575.618 -1636.086)"
          />
        </g>
      </g>
    </svg>
  )
)
