import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ChevronLeftIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 12.14}
      hoverColor={activeColor}
      viewBox="0 0 6.356 12.14"
      width={width ?? 6.356}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M.55,12.14a.532.532,0,0,1-.206-.04A.549.549,0,0,1,0,11.591V.55A.55.55,0,0,1,.951.174L6.207,5.781A.551.551,0,0,1,6.2,6.54L.945,11.973a.549.549,0,0,1-.4.167M1.1,1.94v8.292l3.947-4.08Z"
        fill={active ? activeColor : color}
        transform="translate(6.355 12.14) rotate(180)"
      />
    </SVG>
  )
)
