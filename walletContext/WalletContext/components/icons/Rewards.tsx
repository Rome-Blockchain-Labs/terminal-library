import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const RewardsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      data-name="Component 322 – 1"
      height={height ?? 12.141}
      hoverColor={activeColor}
      id="Component_322_1"
      viewBox="0 0 12.793 12.141"
      width={width ?? 12.793}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="Group 6579" id="Group_6579">
        <TransitionPath
          d="M112.748,794.172a2.471,2.471,0,0,0-1.829,4.144v2.906a.524.524,0,0,0,.838.418l.991-.743.991.743a.523.523,0,0,0,.838-.418v-2.906a2.471,2.471,0,0,0-1.828-4.144Zm0,1.047a1.434,1.434,0,1,1-1.434,1.434A1.435,1.435,0,0,1,112.748,795.219Zm.314,4.6a.519.519,0,0,0-.628,0l-.468.35V799a2.279,2.279,0,0,0,1.563,0v1.178Z"
          data-name="Path 6932"
          fill={active ? activeColor : color}
          id="Path_6932"
          transform="translate(-104.394 -789.604)"
        />
        <TransitionPath
          d="M112.818,787.628h-9.136a1.83,1.83,0,0,0-1.828,1.828v6.527a1.831,1.831,0,0,0,1.828,1.828h3.263a.524.524,0,1,0,0-1.047h-3.263a.782.782,0,0,1-.781-.781v-6.527a.782.782,0,0,1,.781-.781h9.136a.783.783,0,0,1,.782.781v6.526a.786.786,0,0,1-.391.676.524.524,0,1,0,.524.907,1.837,1.837,0,0,0,.915-1.582v-6.527A1.831,1.831,0,0,0,112.818,787.628Z"
          data-name="Path 6933"
          fill={active ? activeColor : color}
          id="Path_6933"
          transform="translate(-101.854 -787.628)"
        />
        <TransitionPath
          d="M113.012,791.367h-7.831a.524.524,0,0,0,0,1.047h7.831a.524.524,0,0,0,0-1.047Z"
          data-name="Path 6934"
          fill={active ? activeColor : color}
          id="Path_6934"
          transform="translate(-102.701 -788.757)"
        />
        <TransitionPath
          d="M107.663,794.7a.524.524,0,0,0-.524-.524h-1.957a.524.524,0,1,0,0,1.047h1.957A.524.524,0,0,0,107.663,794.7Z"
          data-name="Path 6935"
          fill={active ? activeColor : color}
          id="Path_6935"
          transform="translate(-102.701 -789.604)"
        />
        <TransitionPath
          d="M105.182,796.976a.524.524,0,0,0,0,1.047h1.3a.524.524,0,0,0,0-1.047Z"
          data-name="Path 6936"
          fill={active ? activeColor : color}
          id="Path_6936"
          transform="translate(-102.701 -790.45)"
        />
      </g>
    </SVG>
  )
)
