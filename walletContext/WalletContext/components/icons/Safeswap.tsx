import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const SafeswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 17.766}
      hoverColor={activeColor}
      viewBox="0 0 16.072 17.766"
      width={width ?? 16.072}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="menu icon - SafeSwap">
        <g data-name="Group 6947" fill="#7a808a">
          <TransitionPath
            d="M16.071 10.598v-5.02a2.445 2.445 0 0 0-1.138-1.971L9.174.282a2.441 2.441 0 0 0-2.277 0l-5.76 3.325a1.163 1.163 0 0 0 0 2.108l.863.5-.147.252a.229.229 0 0 0 .2.345.215.215 0 0 0 .042 0l1.421-.265a.226.226 0 0 0 .157-.111.229.229 0 0 0 .017-.192l-.483-1.343a.23.23 0 0 0-.195-.151.226.226 0 0 0-.219.113l-.1.168-.63-.365 5.52-3.187a1.094 1.094 0 0 1 .9 0l5.76 3.325a1.1 1.1 0 0 1 .45.78v4.38l1.36.785a.686.686 0 0 0 .018-.151Z"
            data-name="Path 7127"
            fill={active ? activeColor : color}
          />
          <TransitionPath
            d="m14.948 12.15-.014-.01-1.166-.675.107-.184a.229.229 0 0 0-.24-.341l-.592.111-.83.154a.228.228 0 0 0-.157.111.231.231 0 0 0-.017.192l.483 1.342a.23.23 0 0 0 .195.151h.021a.23.23 0 0 0 .2-.114l.137-.236.918.534-5.545 3.112a1.093 1.093 0 0 1-.9-.011l-5.719-3.394a1.129 1.129 0 0 1-.452-.794V7.891L.001 7.097v5a2.476 2.476 0 0 0 1.125 1.977l5.719 3.395a2.323 2.323 0 0 0 1.167.3 2.3 2.3 0 0 0 1.109-.268l5.8-3.255a1.153 1.153 0 0 0 .028-2.093Z"
            data-name="Path 7128"
            fill={active ? activeColor : color}
          />
          <TransitionPath
            d="m10.047 9.324-4.172-2.5L7.909 5.65l2.7 1.56v.6l1.376.794v-1.8a.688.688 0 0 0-.344-.6l-3.39-1.957a.688.688 0 0 0-.688 0l-3.39 1.957a.687.687 0 0 0-.145 1.078l2.859 1.65v.09l3.036 1.82-2.035 1.13-2.682-1.61v-.653L3.83 8.915v1.836a.69.69 0 0 0 .334.59l3.356 2.014a.688.688 0 0 0 .688.012l3.423-1.9a.689.689 0 0 0 .02-1.193l-.608-.364-1-.576Z"
            data-name="Path 7129"
            fill={active ? activeColor : color}
          />
          <TransitionPath
            d="m10.047 9.342 1 .576-1-.6Z"
            data-name="Path 7130"
            fill={active ? activeColor : color}
          />
          <TransitionPath
            d="M6.888 9.03v-.09L4.03 7.29a.687.687 0 0 0 .135.107Z"
            data-name="Path 7131"
            fill={active ? activeColor : color}
          />
        </g>
      </g>
    </SVG>
  )
)
