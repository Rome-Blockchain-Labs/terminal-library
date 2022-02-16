import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const CChainIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 19}
      viewBox="0 0 16 16"
      width={width ?? 19}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionCircle
        cx="8"
        cy="8"
        data-name="Ellipse 72"
        fill="#000"
        id="Ellipse_72"
        r="8"
      />
      <TransitionPath
        d="M1804.432,284.243a.527.527,0,0,1,1,0l1.719,3.018c.276.477.05.866-.5.866h-3.463c-.546,0-.771-.389-.5-.866Zm-3.325-5.809a.523.523,0,0,1,.992,0l.382.69.9,1.587a1.647,1.647,0,0,1,0,1.437l-3.03,5.251a1.591,1.591,0,0,1-1.242.728H1796.6c-.552,0-.778-.382-.5-.866Z"
        data-name="Path 5085"
        fill="#fff"
        id="Path_5085"
        transform="translate(-1793.654 -276.069)"
      />
    </svg>
  )
)
