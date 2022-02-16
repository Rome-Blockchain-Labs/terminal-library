import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const BenqiLogoIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 12.727}
      viewBox="0 0 48.346 12.727"
      width={width ?? 48.346}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M0 12.687V1.963h5.646a2.793 2.793 0 0 1 3.1 2.745 2.4 2.4 0 0 1-1.843 2.47 2.613 2.613 0 0 1 2.059 2.647 2.83 2.83 0 0 1-3.117 2.9zM6.411 5.1a1.165 1.165 0 0 0-1.255-1.176l-2.862.038v2.333h2.862a1.15 1.15 0 0 0 1.255-1.157m.216 4.372a1.255 1.255 0 0 0-1.392-1.255H2.294v2.49h2.941c.863 0 1.392-.451 1.392-1.235M10.685 12.687V1.963h7.607v2.019h-5.313v2.255h5.2v2.019h-5.2v2.431h5.313v2.019h-7.607zM27.487 12.687l-5.117-7v7h-2.298V1.963h2.353l4.98 6.744V1.963h2.294v10.744h-2.215zM45.523 5.629h2.823v7.058h-2.823zM45.523 4.767l2.51-1.1a.52.52 0 0 0 .314-.471V1.947h-.02l-2.392 1.039a.73.73 0 0 0-.431.647v1.134zM33.78 5.591a3.918 3.918 0 0 1 7.744.843 3.048 3.048 0 0 1-.078.725l1.314 2.862a6.35 6.35 0 1 0-4.137 2.607l-1.019-2.255a3.908 3.908 0 0 1-3.9-3.941 3 3 0 0 1 .078-.843"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M42.779 12.687h-2.941L37.995 8.57h2.921z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
