import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const CreamIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.837}
      viewBox="0 0 15.294 14.837"
      width={width ?? 15.294}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M7.647 0A7.535 7.535 0 0 0 0 7.418a7.535 7.535 0 0 0 7.647 7.418 7.53 7.53 0 0 0 7.647-7.418A7.541 7.541 0 0 0 7.647 0Zm.615 7.768 2.681 2.6a.482.482 0 0 1-.053.742 4.908 4.908 0 0 1-2.99 1.007 4.749 4.749 0 0 1-4.806-5.236A4.775 4.775 0 0 1 7.41 2.746a4.964 4.964 0 0 1 3.507.989.475.475 0 0 1 .035.725l-2.69 2.609a.479.479 0 0 0 0 .699Z"
        data-name="logo - Cream"
        fill="#7a808a"
      />
    </svg>
  )
)
