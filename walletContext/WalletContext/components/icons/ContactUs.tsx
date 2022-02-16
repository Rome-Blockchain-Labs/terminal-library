import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const ContactUsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 18.75}
      viewBox="0 0 18.75 18.75"
      width={width ?? 18.75}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Icon - Contact Us"
        id="Icon_-_Contact_Us"
        transform="translate(-1450.663 -714.361)"
      >
        <g data-name="Group 31" id="Group_31">
          <TransitionPath
            d="M1468.663,726.861a.75.75,0,0,1-.53-.219l-2.78-2.781h-6.69a1.752,1.752,0,0,1-1.75-1.75v-6a1.752,1.752,0,0,1,1.75-1.75h9a1.752,1.752,0,0,1,1.75,1.75v10a.747.747,0,0,1-.75.75Zm-10-11a.251.251,0,0,0-.25.25v6a.25.25,0,0,0,.25.25h7a.747.747,0,0,1,.53.22l1.72,1.72v-8.19a.251.251,0,0,0-.25-.25Z"
            data-name="Path 56"
            fill={active ? activeColor : color}
            id="Path_56"
          />
        </g>
        <g data-name="Group 32" id="Group_32">
          <TransitionPath
            d="M1451.413,733.111a.747.747,0,0,1-.75-.75v-10a1.752,1.752,0,0,1,1.75-1.75h2a.75.75,0,0,1,0,1.5h-2a.251.251,0,0,0-.25.25v8.19l1.72-1.72a.746.746,0,0,1,.53-.22h7a.25.25,0,0,0,.25-.25v-2a.75.75,0,0,1,1.5,0v2a1.752,1.752,0,0,1-1.75,1.75h-6.689l-2.781,2.781A.75.75,0,0,1,1451.413,733.111Z"
            data-name="Path 57"
            fill={active ? activeColor : color}
            id="Path_57"
          />
        </g>
      </g>
    </svg>
  )
)
