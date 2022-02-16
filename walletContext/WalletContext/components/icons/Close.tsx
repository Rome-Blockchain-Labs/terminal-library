import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const CloseIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height = 11.28, width = 9.462 }) => (
    <SVG
      height={height - 2}
      hoverColor={activeColor}
      viewBox="0 0 9.519 9.517"
      width={width - 2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M894.073,795.134l3.751-3.75a.591.591,0,1,0-.836-.835l-3.751,3.75-3.75-3.75a.591.591,0,0,0-.836.835l3.751,3.75-3.751,3.751a.591.591,0,1,0,.836.835l3.75-3.75,3.751,3.75a.591.591,0,0,0,.836-.835Z"
        data-name="Path 6071"
        fill={active ? activeColor : color}
        id="Path_6071"
        transform="translate(-888.478 -790.376)"
      />
    </SVG>
  )
)
