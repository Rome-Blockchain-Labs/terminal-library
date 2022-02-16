import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const DisconnectedWalletChainIcon: FC<IIconProps> = memo(
  ({ color = '#7a808a', height, width }) => (
    <svg
      height={height || 21.604}
      viewBox="0 0 21.604 21.131"
      width={width || 21.604}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            data-name="Rectangle 2957"
            fill={color}
            height="21.131"
            id="Rectangle_2957"
            transform="translate(0 0)"
            width="21.604"
          />
        </clipPath>
      </defs>
      <g
        data-name="icon - Disconnect Wallet"
        id="icon_-_Disconnect_Wallet"
        transform="translate(0 0)"
      >
        <g clipPath="url(#clip-path)" data-name="Group 8215" id="Group_8215">
          <TransitionPath
            d="M20.854,9.816H19.9V6.885a1.979,1.979,0,0,0-1.976-1.977h-.478V1.977A1.979,1.979,0,0,0,15.472,0H3.2A3.207,3.207,0,0,0,0,3.2V17.927a3.207,3.207,0,0,0,3.2,3.2H17.927A1.979,1.979,0,0,0,19.9,19.154V16.223h.951a.751.751,0,0,0,.75-.75V10.566a.751.751,0,0,0-.75-.75m-4.9-7.839V4.908H13.915A4.582,4.582,0,0,0,12.132,1.5h3.34a.478.478,0,0,1,.478.477m-6.619.048a3.1,3.1,0,0,1,3.084,2.883H6.245A3.1,3.1,0,0,1,9.331,2.025M3.2,1.5H6.529A4.583,4.583,0,0,0,4.745,4.908H3.2A1.7,1.7,0,1,1,3.2,1.5M18.4,19.154a.477.477,0,0,1-.476.477H3.2a1.705,1.705,0,0,1-1.7-1.7V5.916a3.188,3.188,0,0,0,1.7.492H17.927a.477.477,0,0,1,.476.477V9.816h-.285a3.2,3.2,0,0,0,0,6.407H18.4Zm1.7-4.431H18.118a1.7,1.7,0,0,1,0-3.407H20.1Z"
            data-name="Path 8240"
            fill={color}
            id="Path_8240"
          />
          <TransitionPath
            d="M13.385,12.207A2.862,2.862,0,0,0,9.338,8.159l-.3.3A.75.75,0,0,0,10.1,9.519l.3-.3a1.362,1.362,0,0,1,1.925,1.926L9.909,13.561a1.329,1.329,0,0,1-.937.382H8.958a1.329,1.329,0,0,1-.943-.4.751.751,0,1,0-1.072,1.051,2.814,2.814,0,0,0,2.016.845,2.9,2.9,0,0,0,2.036-.84Z"
            data-name="Path 8241"
            fill={color}
            id="Path_8241"
          />
          <TransitionPath
            d="M7.247,16.224l-.3.3a1.394,1.394,0,0,1-1.926,0,1.362,1.362,0,0,1,0-1.926l2.413-2.414a1.341,1.341,0,0,1,1.9.02A.751.751,0,0,0,10.4,11.152a2.856,2.856,0,0,0-4.053-.005L3.962,13.536a2.862,2.862,0,1,0,4.047,4.047l.3-.3a.75.75,0,0,0-1.061-1.061"
            data-name="Path 8242"
            fill={color}
            id="Path_8242"
          />
          <TransitionPath
            d="M11.093,16.336a.75.75,0,0,0-.75.75v1.2a.75.75,0,0,0,1.5,0v-1.2a.75.75,0,0,0-.75-.75"
            data-name="Path 8243"
            fill={color}
            id="Path_8243"
          />
          <TransitionPath
            d="M14.085,14.541h-1.2a.75.75,0,0,0,0,1.5h1.2a.75.75,0,0,0,0-1.5"
            data-name="Path 8244"
            fill={color}
            id="Path_8244"
          />
          <TransitionPath
            d="M4.51,11.253a.75.75,0,0,0,0-1.5h-1.2a.75.75,0,1,0,0,1.5Z"
            data-name="Path 8245"
            fill={color}
            id="Path_8245"
          />
          <TransitionPath
            d="M6.306,9.458a.75.75,0,0,0,.75-.75v-1.2a.75.75,0,0,0-1.5,0v1.2a.75.75,0,0,0,.75.75"
            data-name="Path 8246"
            fill={color}
            id="Path_8246"
          />
        </g>
      </g>
    </svg>
  )
)
