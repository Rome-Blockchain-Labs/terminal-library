import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const LendingIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.013}
      viewBox="0 0 13.715 14.013"
      width={width ?? 13.715}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 4836"
        id="Group_4836"
        transform="translate(-564.146 -792.504)"
      >
        <g
          data-name="Group 4779"
          id="Group_4779"
          transform="translate(564.146 792.504)"
        >
          <TransitionPath
            d="M566.243,799.124h5.348a2.1,2.1,0,0,0,2.1-2.1V794.6a2.1,2.1,0,0,0-2.1-2.1h-5.348a2.1,2.1,0,0,0-2.1,2.1v2.427A2.1,2.1,0,0,0,566.243,799.124Zm5.348-1.194h-5.348a.9.9,0,0,1-.9-.9v-1.237h7.154v1.237A.9.9,0,0,1,571.591,797.931Zm-5.348-4.233h5.348a.9.9,0,0,1,.9.9H565.34A.9.9,0,0,1,566.243,793.7Z"
            data-name="Path 1923"
            fill={active ? activeColor : color}
            id="Path_1923"
            transform="translate(-564.146 -792.504)"
          />
          <TransitionPath
            d="M576.836,801.793h-5.348a2.1,2.1,0,0,0-2.1,2.1v2.428a2.1,2.1,0,0,0,2.1,2.1h5.348a2.1,2.1,0,0,0,2.1-2.1V803.89A2.1,2.1,0,0,0,576.836,801.793Zm-5.348,1.194h5.348a.9.9,0,0,1,.9.9h-7.153A.9.9,0,0,1,571.488,802.987Zm5.348,4.234h-5.348a.9.9,0,0,1-.9-.9V805.08h7.154v1.237A.9.9,0,0,1,576.836,807.221Z"
            data-name="Path 1924"
            fill={active ? activeColor : color}
            id="Path_1924"
            transform="translate(-565.218 -794.402)"
          />
        </g>
        <g
          data-name="Group 4784"
          id="Group_4784"
          transform="translate(564.942 799.498)"
        >
          <g data-name="Group 4780" id="Group_4780" transform="translate(0)">
            <TransitionPath
              d="M565.544,802.487a.4.4,0,0,1-.4-.4v-.4a.4.4,0,1,1,.8,0v.4A.4.4,0,0,1,565.544,802.487Z"
              data-name="Path 1925"
              fill={active ? activeColor : color}
              id="Path_1925"
              transform="translate(-565.146 -801.293)"
            />
          </g>
          <g
            data-name="Group 4781"
            id="Group_4781"
            transform="translate(0 1.332)"
          >
            <TransitionPath
              d="M565.544,804.386a.4.4,0,0,1-.4-.4v-.623a.4.4,0,0,1,.8,0v.623A.4.4,0,0,1,565.544,804.386Z"
              data-name="Path 1926"
              fill={active ? activeColor : color}
              id="Path_1926"
              transform="translate(-565.146 -802.967)"
            />
          </g>
          <g
            data-name="Group 4782"
            id="Group_4782"
            transform="translate(0 2.889)"
          >
            <TransitionPath
              d="M565.942,806.118h-.4a.4.4,0,0,1-.4-.4v-.4a.629.629,0,1,1,.8.8Z"
              data-name="Path 1927"
              fill={active ? activeColor : color}
              id="Path_1927"
              transform="translate(-565.146 -804.924)"
            />
          </g>
          <g
            data-name="Group 4783"
            id="Group_4783"
            transform="translate(1.561 3.287)"
          >
            <TransitionPath
              d="M567.9,806.22h-.4a.4.4,0,0,1,0-.8h.4a.4.4,0,0,1,0,.8Z"
              data-name="Path 1928"
              fill={active ? activeColor : color}
              id="Path_1928"
              transform="translate(-567.108 -805.424)"
            />
          </g>
        </g>
      </g>
    </svg>
  )
)
