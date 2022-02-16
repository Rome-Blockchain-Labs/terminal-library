import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionCircle } from '.'

export const ThreeDotsVerticalIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ? height : '24'}
      hoverColor={activeColor}
      viewBox="0 0 24 24"
      width={width ? width : '24'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionCircle
        cx="12"
        cy="7"
        data-name="Ellipse 76"
        fill={active ? activeColor : color}
        id="Ellipse_76"
        r="2"
      />
      <TransitionCircle
        cx="12"
        cy="12"
        data-name="Ellipse 76"
        fill={active ? activeColor : color}
        id="Ellipse_76"
        r="2"
      />
      <TransitionCircle
        cx="12"
        cy="17"
        data-name="Ellipse 76"
        fill={active ? activeColor : color}
        id="Ellipse_76"
        r="2"
      />
    </SVG>
  )
)
