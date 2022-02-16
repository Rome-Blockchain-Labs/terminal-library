import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const AvaxBridgeIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.765}
      viewBox="0 0 14.765 14.765"
      width={width ?? 14.765}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1756.273,443.37a7.383,7.383,0,1,0,7.383,7.383A7.383,7.383,0,0,0,1756.273,443.37Zm-1.174,10.5a1.477,1.477,0,0,1-1.151.674h-2.331c-.511,0-.72-.355-.465-.8l4.645-8.179a.484.484,0,0,1,.918,0l.355.64.837,1.471a1.53,1.53,0,0,1,0,1.331Zm5.831.674h-3.209c-.506,0-.715-.36-.465-.8l1.622-2.8a.488.488,0,0,1,.924,0l1.593,2.8C1761.651,454.182,1761.441,454.543,1760.93,454.543Z"
        data-name="icon - AVAX Bridge"
        fill={active ? activeColor : color}
        id="icon_-_AVAX_Bridge"
        transform="translate(-1748.891 -443.37)"
      />
    </svg>
  )
)
