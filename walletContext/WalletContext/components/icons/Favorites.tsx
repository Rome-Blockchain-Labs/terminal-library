import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const FavoritesIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 12.69}
      viewBox="0 0 12.238 12.69"
      width={width ?? 12.238}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1201.148,822.48l-2.066-3.578a4.431,4.431,0,1,0-7.963,0l-2.066,3.578a.53.53,0,0,0,.009.548.518.518,0,0,0,.487.25l1.983-.128.882,1.781a.532.532,0,0,0,.46.3h.017a.532.532,0,0,0,.462-.266l1.748-3.028,1.749,3.028a.53.53,0,0,0,.461.266h.017a.532.532,0,0,0,.46-.3l.881-1.781,1.983.128a.515.515,0,0,0,.487-.25A.532.532,0,0,0,1201.148,822.48ZM1195.1,813.6a3.366,3.366,0,1,1-3.366,3.365A3.369,3.369,0,0,1,1195.1,813.6Zm-2.174,9.963-.6-1.208a.529.529,0,0,0-.511-.3l-1.343.087,1.3-2.259a4.434,4.434,0,0,0,2.449,1.422Zm5.457-1.5a.534.534,0,0,0-.512.3l-.6,1.208-1.3-2.254a4.424,4.424,0,0,0,2.45-1.422l1.3,2.259Z"
        data-name="Icon - Favorites"
        fill={active ? activeColor : color}
        id="Icon_-_Favorites"
        transform="translate(-1188.982 -812.538)"
      />
    </svg>
  )
)
