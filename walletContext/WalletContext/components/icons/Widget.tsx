import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const WidgetIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      data-name="add Widget"
      height={height ?? 11.164}
      viewBox="0 0 11.436 11.164"
      width={width ?? 11.436}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5731"
        id="Group_5731"
        transform="translate(-151.564 -250)"
      >
        <g
          data-name="Group 5727"
          id="Group_5727"
          transform="translate(151.564 251.794)"
        >
          <TransitionPath
            d="M444.194,790h6.44a1.466,1.466,0,0,1,1.464,1.465v6.44a1.466,1.466,0,0,1-1.464,1.465h-6.44a1.467,1.467,0,0,1-1.465-1.465v-6.44A1.467,1.467,0,0,1,444.194,790Zm-.682,1.465v.786h1.482v-1.468h-.8A.682.682,0,0,0,443.513,791.467Zm7.122-.681h-4.856v1.468h5.537v-.786A.682.682,0,0,0,450.634,790.786Zm-6.44,7.8h6.44a.682.682,0,0,0,.681-.682v-4.87h-7.8v4.87A.682.682,0,0,0,444.194,798.589Z"
            data-name="Path 6011"
            fill={active ? activeColor : color}
            id="Path_6011"
            transform="translate(-442.729 -790.002)"
          />
          <TransitionPath
            d="M445.566,798.019a.392.392,0,1,1,0-.784h4.7a.392.392,0,0,1,0,.784Z"
            data-name="Path 6012"
            fill={active ? activeColor : color}
            id="Path_6012"
            transform="translate(-442.568 -793.456)"
          />
          <TransitionPath
            d="M447.457,800.437h4.7a.392.392,0,0,1,0,.784h-4.7a.392.392,0,0,1,0-.784Z"
            data-name="Path 6013"
            fill={active ? activeColor : color}
            id="Path_6013"
            transform="translate(-445.446 -794.985)"
          />
          <TransitionPath
            d="M445.924,803.631h4.7a.392.392,0,0,1,0,.784h-4.7a.392.392,0,0,1,0-.784Z"
            data-name="Path 6014"
            fill={active ? activeColor : color}
            id="Path_6014"
            transform="translate(-443.112 -796.51)"
          />
        </g>
        <circle
          cx="2.5"
          cy="2.5"
          data-name="Ellipse 93"
          fill="#00070e"
          id="Ellipse_93"
          r="2.5"
          transform="translate(158 250)"
        />
        <TransitionPath
          d="M431.072,850.165h-.877v-.877a.3.3,0,1,0-.6,0v.877h-.877a.3.3,0,1,0,0,.6h.877v.878a.3.3,0,0,0,.6,0v-.878h.877a.3.3,0,1,0,0-.6Z"
          data-name="Path 6015"
          fill={active ? activeColor : color}
          id="Path_6015"
          transform="translate(-269.418 -597.988)"
        />
      </g>
    </svg>
  )
)
