import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const TableIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      data-name="Component 149 – 3"
      height={height ?? 11.184}
      id="Component_149_3"
      viewBox="0 0 11.757 11.184"
      width={width ?? 11.757}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5729"
        id="Group_5729"
        transform="translate(-151.243 -233)"
      >
        <TransitionPath
          d="M1202.842,1066.91H1196.4a1.466,1.466,0,0,0-1.465,1.465v6.439a1.466,1.466,0,0,0,1.465,1.465h6.439a1.467,1.467,0,0,0,1.465-1.465v-6.439A1.467,1.467,0,0,0,1202.842,1066.91Zm.681,1.465v1.754h-4.582v-2.436h3.9A.682.682,0,0,1,1203.523,1068.375Zm-7.12-.682h1.755v2.436h-2.436v-1.754A.682.682,0,0,1,1196.4,1067.694Zm-.681,7.121v-3.9h2.436v4.582H1196.4A.682.682,0,0,1,1195.722,1074.814Zm7.12.681h-3.9v-4.582h4.582v3.9A.682.682,0,0,1,1202.842,1075.5Z"
          data-name="Path 1953"
          fill={active ? activeColor : color}
          id="Path_1953"
          transform="translate(-1043.695 -832.094)"
        />
        <g data-name="Group 5728" id="Group_5728">
          <TransitionCircle
            cx="2.5"
            cy="2.5"
            data-name="Ellipse 94"
            fill="#00070e"
            id="Ellipse_94"
            r="2.5"
            transform="translate(158 233)"
          />
          <TransitionPath
            d="M431.072,850.165h-.877v-.877a.3.3,0,1,0-.6,0v.877h-.877a.3.3,0,1,0,0,.6h.877v.878a.3.3,0,0,0,.6,0v-.878h.877a.3.3,0,1,0,0-.6Z"
            data-name="Path 6016"
            fill={active ? activeColor : color}
            id="Path_6016"
            transform="translate(-269.418 -614.988)"
          />
        </g>
      </g>
    </svg>
  )
)
