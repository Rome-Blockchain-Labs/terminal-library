import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ArrowUpIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 6.835}
      hoverColor={activeColor}
      viewBox="0 0 4.947 6.835"
      width={width ?? 4.947}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M4.806,4.018a.485.485,0,0,0-.681,0L2.946,5.2l0-4.715A.483.483,0,0,0,2.47,0a.475.475,0,0,0-.477.477L1.985,5.2.815,4.026a.469.469,0,0,0-.674,0,.472.472,0,0,0,0,.673L2.125,6.683l.008.008a.469.469,0,0,0,.2.121l.012,0,.036.013a.372.372,0,0,1,.064.008l0,0H2.5l0,0,.068-.012L2.6,6.807a.41.41,0,0,0,.208-.112l2-2A.481.481,0,0,0,4.806,4.018Z"
        data-name="Path 1991"
        fill={active ? activeColor : color}
        id="Path_1991"
        transform="translate(4.947 6.835) rotate(180)"
      />
    </SVG>
  )
)
