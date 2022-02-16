import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const AvalancheIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 21.119}
      viewBox="0 0 23.554 21.119"
      width={width ?? 23.554}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Avalanche Logo"
        id="Avalanche_Logo"
        transform="translate(-1694.2 -277.874)"
      >
        <TransitionPath
          d="M1715.858,298.993h-6.809a1.71,1.71,0,0,1-1.578-2.715l3.446-5.94a1.7,1.7,0,0,1,3.136,0l3.382,5.938a1.7,1.7,0,0,1-1.576,2.717Zm-3.374-8.34c-.09,0-.247.112-.393.364h0l-3.441,5.934c-.148.263-.151.447-.107.522s.2.162.507.162h6.809c.313,0,.475-.088.518-.162s.037-.255-.119-.523l-3.382-5.938C1712.731,290.765,1712.575,290.653,1712.484,290.653Zm-.98.024h0Zm-15.407,8.315a1.7,1.7,0,0,1-1.576-2.718l9.855-17.355,0-.005a1.858,1.858,0,0,1,1.563-1.041h0a1.855,1.855,0,0,1,1.561,1.041l2.531,4.482a3.954,3.954,0,0,1,.021,3.457l-5.982,10.368a3.846,3.846,0,0,1-2.987,1.77Zm9.457-19.4-9.855,17.354c-.147.258-.166.452-.12.531s.224.159.518.159h4.947a2.429,2.429,0,0,0,1.872-1.121l5.941-10.3a2.562,2.562,0,0,0-.023-2.19l-2.512-4.445c-.14-.241-.294-.354-.381-.354h0C1705.852,279.231,1705.7,279.343,1705.553,279.592Z"
          data-name="Path 1946"
          fill={active ? activeColor : color}
          id="Path_1946"
          transform="translate(0)"
        />
      </g>
    </svg>
  )
)
