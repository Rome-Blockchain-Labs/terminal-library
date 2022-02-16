import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const SwapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.888}
      hoverColor={activeColor}
      viewBox="0 0 12.261 11.888"
      width={width ?? 12.261}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M12.262 6.681a1.712 1.712 0 0 0-1.252-1.644 3.537 3.537 0 0 0-3.511-3.21H4.032L5.009.85a.5.5 0 0 0-.7-.7L2.482 1.977a.461.461 0 0 0-.042.641.424.424 0 0 0 .039.058l1.827 1.828a.5.5 0 0 0 .7-.7l-.977-.978h3.468a2.543 2.543 0 0 1 2.517 2.234 1.713 1.713 0 1 0 2.248 1.621zm-2.437 0a.72.72 0 1 1 .72.721.721.721 0 0 1-.721-.721zM0 5.207a1.713 1.713 0 0 0 1.252 1.644 3.538 3.538 0 0 0 3.511 3.21h3.468l-.977.977a.5.5 0 1 0 .7.7l1.827-1.827a.459.459 0 0 0 .042-.641.5.5 0 0 0-.038-.058L7.958 7.384a.5.5 0 1 0-.7.7l.977.977H4.767A2.543 2.543 0 0 1 2.25 6.827 1.713 1.713 0 1 0 .004 5.203zm2.436 0a.72.72 0 1 1-.72-.72.721.721 0 0 1 .725.72z"
        fill={active ? activeColor : color}
      />
    </SVG>
  )
)
