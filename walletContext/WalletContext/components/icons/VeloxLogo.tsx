import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const VeloxLogoIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 13.612}
      viewBox="0 0 68.406 13.612"
      width={width ?? 68.406}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M29.546 11.643h9.688V9.69H31.5V1.954h-1.953zM14.489 9.69h9.7v1.953h-9.7zm9.7-7.721h-9.7v1.953h9.7zm-2.734 3.86h-6.962v1.953h6.962zM5.332 8.639 2.086 0H-.001l4.382 11.658h1.914l3.6-9.705H7.812zM68.407 13.612l-5.081-6.92 3.478-4.738h-2.423l-2.266 3.087-2.266-3.087h-2.423l3.478 4.738-3.631 4.947.027.02h2.382l2.434-3.317 3.87 5.27zM48.782 11.944h-.016a5.137 5.137 0 1 1 .016 0zm0-8.322a3.185 3.185 0 1 0-.016 6.369h.016a3.184 3.184 0 0 0 0-6.369z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
