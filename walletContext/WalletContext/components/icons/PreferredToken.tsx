import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const PreferredTokenIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 24}
      viewBox="0 0 18.942 18.94"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M7.759 14.521a.792.792 0 0 1-.54-.211l-4-3.718A.793.793 0 1 1 4.298 9.43l3.445 3.2 6.89-6.889a.792.792 0 0 1 1.12 1.119l-7.431 7.428a.786.786 0 0 1-.563.233z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M15.979 18.94H2.962A2.964 2.964 0 0 1 0 15.98V2.962A2.965 2.965 0 0 1 2.962 0h13.017a2.965 2.965 0 0 1 2.962 2.962v13.017a2.964 2.964 0 0 1-2.962 2.961zM2.962 1.584a1.379 1.379 0 0 0-1.378 1.378v13.017a1.379 1.379 0 0 0 1.378 1.376h13.017a1.379 1.379 0 0 0 1.378-1.376V2.962a1.379 1.379 0 0 0-1.378-1.378z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
