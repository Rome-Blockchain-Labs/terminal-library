import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionRect } from '.'

export const Column1Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.63}
      viewBox="0 0 13.207 11.63"
      width={width ?? 13.207}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionRect
        data-name="icon - 1 col"
        fill={active ? activeColor : color}
        height="11.63"
        rx="1"
        width="13.207"
      />
    </SVG>
  )
)
