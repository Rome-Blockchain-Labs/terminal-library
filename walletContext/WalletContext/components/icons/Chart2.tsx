import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const Chart2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 6.761}
      hoverColor={activeColor}
      viewBox="0 0 7.189 6.761"
      width={width ?? 7.189}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5159"
        id="Group_5159"
        transform="translate(0.104 0.1)"
      >
        <g
          data-name="Group 5157"
          id="Group_5157"
          transform="translate(0 2.404)"
        >
          <TransitionPath
            d="M499.449,800.815h-6.413a.274.274,0,0,1-.228-.427l1.6-2.4a.274.274,0,0,1,.351-.093l1.4.7,1.465-1.83a.274.274,0,0,1,.2-.1.264.264,0,0,1,.209.08l1.6,1.6a.274.274,0,0,1,.08.194v2A.274.274,0,0,1,499.449,800.815Zm-5.9-.549h5.626V798.65l-1.306-1.306-1.412,1.764a.275.275,0,0,1-.337.074l-1.387-.693Z"
            data-name="Path 2080"
            fill={active ? activeColor : color}
            id="Path_2080"
            stroke={active ? activeColor : color}
            strokeWidth="0.2"
            transform="translate(-492.762 -796.659)"
          />
        </g>
        <g data-name="Group 5158" id="Group_5158" transform="translate(0)">
          <TransitionPath
            d="M493.036,793.841a.274.274,0,0,1-.219-.439l1.2-1.6a.274.274,0,0,1,.342-.081l1.409.7,1.865-2.238a.275.275,0,0,1,.2-.1.267.267,0,0,1,.207.08l1.6,1.6a.274.274,0,0,1-.388.388l-1.391-1.391-1.812,2.174a.274.274,0,0,1-.333.07l-1.4-.7-1.066,1.419A.273.273,0,0,1,493.036,793.841Z"
            data-name="Path 2081"
            fill={active ? activeColor : color}
            id="Path_2081"
            stroke={active ? activeColor : color}
            strokeWidth="0.2"
            transform="translate(-492.762 -790.086)"
          />
        </g>
      </g>
    </SVG>
  )
)
