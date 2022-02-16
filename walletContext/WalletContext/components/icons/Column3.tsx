import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionRect } from '.'

export const Column3Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.63}
      viewBox="0 0 13.207 11.63"
      width={width ?? 13.207}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="icon - 3 col"
        fill={active ? activeColor : color}
        transform="translate(-89.732 -837.254)"
      >
        <TransitionRect
          data-name="Rectangle 2513"
          height="11.63"
          rx="1"
          transform="translate(89.732 837.254)"
          width="3.935"
        />
        <TransitionRect
          data-name="Rectangle 2514"
          height="11.63"
          rx="1"
          transform="translate(99.004 837.254)"
          width="3.935"
        />
        <TransitionRect
          data-name="Rectangle 2515"
          height="11.63"
          rx="1"
          transform="translate(94.368 837.254)"
          width="3.935"
        />
      </g>
    </SVG>
  )
)
