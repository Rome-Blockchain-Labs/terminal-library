import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const SearchIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 19.519}
      hoverColor={activeColor}
      viewBox="0 0 19.519 19.519"
      width={width ?? 19.519}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1427.667,779.6l-5.554-5.555a7.774,7.774,0,1,0-1.061,1.06l5.554,5.555a.75.75,0,0,0,1.061-1.06Zm-17.8-10.482a6.258,6.258,0,1,1,6.258,6.257A6.265,6.265,0,0,1,1409.868,769.119Z"
        data-name="Search icon"
        fill={active ? activeColor : color}
        id="Search_icon"
        transform="translate(-1408.368 -761.362)"
      />
    </SVG>
  )
)
