import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const AboutUsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 24.26}
      viewBox="0 0 24.26 24.26"
      width={width ?? 24.26}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1391.684,770.378l-9-9a3.13,3.13,0,0,0-4.423,0l-9,9a3.13,3.13,0,0,0,0,4.423l9,9a3.13,3.13,0,0,0,4.423,0l9-9a3.129,3.129,0,0,0,0-4.422Zm-6.14,8.584a6.179,6.179,0,0,1-1.986-7.489.8.8,0,1,0-1.461-.651,7.741,7.741,0,0,0-.671,3.17,7.821,7.821,0,0,0,2.979,6.109l-2.713,2.714a1.775,1.775,0,0,1-2.445,0l-2.577-2.577v-8.381a4.075,4.075,0,0,1,4.07-4.07h3.474a.8.8,0,0,0,0-1.6h-3.474a5.674,5.674,0,0,0-5.668,5.668v6.783l-4.829-4.829a1.732,1.732,0,0,1,0-2.446l9-9a1.732,1.732,0,0,1,2.445,0l9,9a1.728,1.728,0,0,1,0,2.444Z"
        data-name="Icon - About Us"
        fill={active ? activeColor : color}
        id="Icon_-_About_Us"
        transform="translate(-1368.339 -760.459)"
      />
    </svg>
  )
)
