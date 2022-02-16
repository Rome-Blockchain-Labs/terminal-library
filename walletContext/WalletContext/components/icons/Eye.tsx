import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const EyeIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 9.857}
      hoverColor={activeColor}
      viewBox="0 0 13.671 9.857"
      width={width ?? 13.671}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5180"
        id="Group_5180"
        transform="translate(5.085 3.178)"
      >
        <TransitionPath
          d="M1291.169,785.731a1.751,1.751,0,1,1,1.751-1.751A1.753,1.753,0,0,1,1291.169,785.731Zm0-2.542a.791.791,0,1,0,.791.791A.792.792,0,0,0,1291.169,783.189Z"
          data-name="Path 2093"
          fill={active ? activeColor : color}
          id="Path_2093"
          transform="translate(-1289.418 -782.229)"
        />
      </g>
      <g data-name="Group 5181" id="Group_5181" transform="translate(0 0)">
        <TransitionPath
          d="M1288.31,787.122c-2.715,0-4.993-1.578-6.772-4.69a.479.479,0,0,1,0-.476c1.78-3.113,4.058-4.691,6.772-4.691s4.994,1.578,6.772,4.691a.479.479,0,0,1,0,.476C1293.3,785.544,1291.025,787.122,1288.31,787.122Zm-5.8-4.928c1.59,2.67,3.489,3.968,5.8,3.968s4.209-1.3,5.8-3.968c-1.59-2.67-3.489-3.969-5.8-3.969S1284.1,779.524,1282.51,782.194Z"
          data-name="Path 2094"
          fill={active ? activeColor : color}
          id="Path_2094"
          transform="translate(-1281.474 -777.265)"
        />
      </g>
    </SVG>
  )
)
