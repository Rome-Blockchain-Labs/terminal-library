import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const MdexIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 12.854}
      viewBox="0 0 14.592 12.854"
      width={width ?? 14.592}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M5.216 4.032c.642.6 1.147 1.057 1.692 1.562-2.34 1.582-.162 4.13 1.6 2.632a1.384 1.384 0 0 0-.039-2.081c-1.245-1.147-2.5-2.282-3.741-3.436A1.479 1.479 0 0 0 2.161 3.85c0 2.989.058 5.977.013 8.959a1.884 1.884 0 0 1-2.158-1.963c0-2.418-.039-4.843.013-7.261a3.63 3.63 0 0 1 6.137-2.561c1.35 1.262 2.658 2.58 4.05 3.792 1.264 1.1 1.186 3.728-.292 5.089-4.101 3.391-8.737-2.444-4.708-5.873z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M9.2 3.176c-.532-.48-1.011-.908-1.478-1.335 1.724-3.053 6.9-1.88 6.853 1.692.039 2.483.006 4.959-.032 7.442a1.826 1.826 0 0 1-2.113 1.776c.006-2.891.013-5.8.052-8.7a1.665 1.665 0 0 0-.979-1.776c-.987-.441-1.629.246-2.303.901z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
