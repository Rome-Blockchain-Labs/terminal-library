import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionCircle, TransitionPath } from '.'

export const ChartIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 10.685}
      hoverColor={activeColor}
      viewBox="0 0 12.971 10.685"
      width={width ?? 12.971}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5730"
        id="Group_5730"
        transform="translate(-167.029 -233)"
      >
        <g
          data-name="Group 4929"
          id="Group_4929"
          transform="translate(167.029 234.315)"
        >
          <g
            data-name="Group 201"
            id="Group_201"
            transform="translate(0 3.434)"
          >
            <TransitionPath
              d="M1232.575,1079.418h-9.158a.392.392,0,0,1-.326-.609l2.29-3.434a.391.391,0,0,1,.5-.133l2.006,1,2.092-2.614a.392.392,0,0,1,.285-.146.375.375,0,0,1,.3.114l2.29,2.289a.391.391,0,0,1,.115.277v2.862A.392.392,0,0,1,1232.575,1079.418Zm-8.426-.784h8.034v-2.308l-1.865-1.864-2.016,2.52a.392.392,0,0,1-.481.106l-1.98-.99Z"
              data-name="Path 382"
              fill={active ? activeColor : color}
              id="Path_382"
              transform="translate(-1223.025 -1073.483)"
            />
          </g>
          <g data-name="Group 202" id="Group_202" transform="translate(0)">
            <TransitionPath
              d="M1223.417,1072.272a.391.391,0,0,1-.312-.627l1.717-2.289a.39.39,0,0,1,.488-.115l2.012,1.006,2.664-3.2a.394.394,0,0,1,.283-.141.383.383,0,0,1,.295.114l2.29,2.29a.392.392,0,0,1-.554.554l-1.986-1.986-2.587,3.1a.392.392,0,0,1-.476.1l-2-1-1.521,2.027A.39.39,0,0,1,1223.417,1072.272Z"
              data-name="Path 383"
              fill={active ? activeColor : color}
              id="Path_383"
              transform="translate(-1223.026 -1066.91)"
            />
          </g>
        </g>
        <TransitionCircle
          cx="2.5"
          cy="2.5"
          data-name="Ellipse 95"
          fill="#00070e"
          id="Ellipse_95"
          r="2.5"
          transform="translate(175 233)"
        />
        <TransitionPath
          d="M431.072,850.165h-.877v-.877a.3.3,0,1,0-.6,0v.877h-.877a.3.3,0,1,0,0,.6h.877v.878a.3.3,0,0,0,.6,0v-.878h.877a.3.3,0,1,0,0-.6Z"
          data-name="Path 6017"
          fill={active ? activeColor : color}
          id="Path_6017"
          transform="translate(-252.418 -614.988)"
        />
      </g>
    </SVG>
  )
)
