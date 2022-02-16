import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const OverviewIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      data-name="navicon - Overview"
      height={height ?? 12.217}
      hoverColor={activeColor}
      viewBox="0 0 13.613 12.217"
      width={width ?? 13.613}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M90.06,794.9a.459.459,0,0,0-.007-.075l-2.094-6.981a.522.522,0,0,0-.5-.373h-1.4a.524.524,0,0,0,0,1.047h1.007l1.78,5.934H84.665a.524.524,0,0,0-.524.524v.873H82.4v-.873a.524.524,0,0,0-.524-.524H77.689l1.78-5.934h1.007a.524.524,0,0,0,0-1.047h-1.4a.522.522,0,0,0-.5.373l-2.094,6.981a.458.458,0,0,0-.007.075.464.464,0,0,0-.015.075v1.745a2.961,2.961,0,0,0,5.916.174h1.78a2.961,2.961,0,0,0,5.916-.174v-1.745A.464.464,0,0,0,90.06,794.9Zm-8.711,1.821a1.92,1.92,0,0,1-3.84,0V795.5h3.84Zm7.679,0a1.92,1.92,0,0,1-3.84,0V795.5h3.84Z"
        data-name="Path 6931"
        fill={active ? activeColor : color}
        id="Path_6931"
        transform="translate(-76.462 -787.473)"
      />
    </SVG>
  )
)
