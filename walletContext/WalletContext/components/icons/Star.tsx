import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const StarIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.188}
      hoverColor={activeColor}
      viewBox="0 0 11.716 11.188"
      width={width ?? 11.716}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M969.987,1067.961l-3.485-.5-1.558-3.159a.465.465,0,0,0-.834,0l-1.559,3.159-3.484.5a.464.464,0,0,0-.258.792l2.525,2.459-.6,3.471a.464.464,0,0,0,.185.454.457.457,0,0,0,.273.089.47.47,0,0,0,.216-.053l3.118-1.639,3.109,1.638a.464.464,0,0,0,.675-.489l-.6-3.471,2.526-2.459a.465.465,0,0,0-.258-.792Zm-3.092,2.756a.464.464,0,0,0-.134.411l.478,2.783-2.493-1.313a.465.465,0,0,0-.432,0l-2.5,1.315.478-2.784a.464.464,0,0,0-.134-.411l-2.026-1.971,2.794-.406a.463.463,0,0,0,.35-.254l1.251-2.534,1.25,2.534a.463.463,0,0,0,.35.254l2.794.406Z"
        data-name="Path 141"
        fill={active ? activeColor : color}
        id="Path_141"
        transform="translate(-958.669 -1064.039)"
      />
    </SVG>
  )
)
