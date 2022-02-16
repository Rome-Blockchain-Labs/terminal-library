import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const WalletTrackerIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 24}
      viewBox="0 0 20.246 20.247"
      width={width ?? 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1141.874 922.143h-.314v-2.635a2.007 2.007 0 0 0-2-2h-.314v-2.638a2.007 2.007 0 0 0-2.006-2h-11.6a3.168 3.168 0 0 0-3.165 3.166v13.915a3.168 3.168 0 0 0 3.165 3.166h13.917a2.007 2.007 0 0 0 2-2.006v-2.633h.314a.845.845 0 0 0 .845-.845v-4.64a.845.845 0 0 0-.842-.85zm-4.64-7.588a.315.315 0 0 1 .316.314v2.631h-1.792a4.472 4.472 0 0 0-1.346-2.948zm-5.941.418a2.8 2.8 0 0 1 2.774 2.53h-5.549a2.8 2.8 0 0 1 2.776-2.529zm-5.655-.418h2.534a4.471 4.471 0 0 0-1.344 2.948h-1.19a1.474 1.474 0 0 1 0-2.948zm14.231 16.55a.315.315 0 0 1-.314.316h-13.917a1.476 1.476 0 0 1-1.474-1.475v-11.117a3.137 3.137 0 0 0 1.474.365h13.917a.314.314 0 0 1 .314.314v2.635h-1.508a3.165 3.165 0 0 0 0 6.33h1.508zm1.16-4.323h-2.667a1.475 1.475 0 0 1 0-2.949h2.667z"
        fill={active ? activeColor : color}
        transform="translate(-1122.474 -912.865)"
      />
    </svg>
  )
)
