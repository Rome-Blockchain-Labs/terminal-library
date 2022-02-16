import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const AlgorandIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 17.18}
      viewBox="0 0 17.12 17.18"
      width={width ?? 17.12}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5704"
        id="Group_5704"
        transform="translate(-1861.092 -637.072)"
      >
        <TransitionPath
          d="M1864.062,654.252l2.485-4.3,2.485-4.288,2.469-4.3.409-.682.182.682.757,2.833-.848,1.47-2.485,4.288-2.47,4.3h2.969l2.485-4.3,1.288-2.227.606,2.227,1.151,4.3h2.666l-1.151-4.3-1.151-4.288-.3-1.106,1.848-3.2h-2.7l-.091-.318-.939-3.515-.121-.455h-2.591l-.061.091-2.424,4.2-2.485,4.3-2.469,4.288-2.485,4.3Z"
          data-name="Path 5907"
          fill={active ? activeColor : color}
          id="Path_5907"
        />
      </g>
    </svg>
  )
)
