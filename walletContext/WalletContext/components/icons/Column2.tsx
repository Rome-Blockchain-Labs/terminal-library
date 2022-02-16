import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionRect } from '.'

export const Column2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.63}
      viewBox="0 0 13.153 11.63"
      width={width ?? 13.153}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="icon - 2 col"
        fill={active ? activeColor : color}
        transform="translate(-69.951 -837.254)"
      >
        <TransitionRect
          data-name="Rectangle 2511"
          height="11.63"
          rx="1"
          transform="translate(69.951 837.254)"
          width="6.2"
        />
        <TransitionRect
          data-name="Rectangle 2512"
          height="11.63"
          rx="1"
          transform="translate(76.904 837.254)"
          width="6.2"
        />
      </g>
    </SVG>
  )
)
