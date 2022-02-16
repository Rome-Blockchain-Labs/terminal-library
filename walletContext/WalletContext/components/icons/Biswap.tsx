import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const BiswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height="14.88"
      viewBox="0 0 14.937 14.88"
      width="14.937"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <clipPath id="clip-path-1">
          <TransitionPath
            d="M29.413,17.529c-.523.11-1.019.248-1.4.33a2.529,2.529,0,0,0-1.982,2.2c-.165,1.156.22,1.651.055,3-.3,2.367-2.559,3.165-3.6,3.661-.605.275-2.092.935-3.219,1.431A7.427,7.427,0,0,0,23.648,29.6H23.7a7.461,7.461,0,0,0,7.44-7.432v-.057A7.451,7.451,0,0,0,29.523,17.5a.209.209,0,0,1-.11.028"
            data-name="Path 8501"
            fill="#7a808a"
            id="Path_8501"
            transform="translate(-19.264 -17.501)"
          />
        </clipPath>
        <clipPath id="clip-paths">
          <TransitionPath
            d="M0,7.461v.025a7.352,7.352,0,0,0,2.367,5.392l2.394-3.6A2.528,2.528,0,0,0,7.293,8.4C6.137,9.717,3,8.286,1.046,6.5a10.288,10.288,0,0,0-.853-.77A8.8,8.8,0,0,0,0,7.461M4.789,4.986c-.221-.582.082-1.352.192-3.691C5.2,1.323,6.247,2.644,6.44,6c0,0-1.349-.33-1.651-1.019M7.415,0A7.454,7.454,0,0,0,.715,4.24C3.193,4.845,5.835,6.167,6.6,6.359a19.109,19.109,0,0,0,.8-2.422c.55-1.486,2.257-1.045,2.724-.99.77.11.99-.165,2.614-.44.083,0,.165-.028.248-.028A7.436,7.436,0,0,0,7.463,0Z"
            data-name="Path 8503"
            fill="#7a808a"
            id="Path_8503"
            transform="translate(0 -0.001)"
          />
        </clipPath>
      </defs>
      <g
        data-name="menu icon - Biswap"
        id="menu_icon_-_Biswap"
        transform="translate(0 -0.001)"
      >
        <g
          data-name="Group 8345"
          id="Group_8345"
          transform="translate(3.061 2.781)"
        >
          <g
            clipPath="url(#clip-path-1)"
            data-name="Group 8344"
            id="Group_8344"
          >
            <TransitionPath
              d="M22.075,17.819l-2.5-13.855L5.977,6.51l2.5,13.855Z"
              data-name="Path 8500"
              fill="#7a808a"
              id="Path_8500"
              transform="translate(-8.088 -6.115)"
            />
          </g>
        </g>
        <g
          data-name="Group 8347"
          id="Group_8347"
          transform="translate(0 0.001)"
        >
          <g
            clipPath="url(#clip-paths)"
            data-name="Group 8346"
            id="Group_8346"
            transform="translate(0 0)"
          >
            <TransitionPath
              d="M-25.677-19.168l5.453,15.393,15.7-5.24L-9.981-24.408Z"
              data-name="Path 8502"
              fill="#7a808a"
              id="Path_8502"
              transform="translate(21.598 20.53)"
            />
          </g>
        </g>
      </g>
    </svg>
  )
)
