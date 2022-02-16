import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const PolkaswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16}
      viewBox="0 0 16 16"
      width={width ?? 16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Polkaswap_logo" transform="translate(-22.5 -22.5)">
        <TransitionPath
          d="M81.97,79.583a1.476,1.476,0,0,1-2.088,2.088A21,21,0,0,1,78.1,77.8,21,21,0,0,1,81.97,79.583Z"
          data-name="Path 6018"
          fill={active ? activeColor : color}
          id="Path_6018"
          transform="translate(-47.128 -46.873)"
        />
        <TransitionPath
          d="M48.455,77.9a20.025,20.025,0,0,1-1.783,3.87,1.476,1.476,0,0,1-2.088-2.088A21,21,0,0,1,48.455,77.9Z"
          data-name="Path 6019"
          fill={active ? activeColor : color}
          id="Path_6019"
          transform="translate(-18.351 -46.958)"
        />
        <TransitionPath
          d="M81.97,44.284a1.472,1.472,0,0,1,0,2.088,21,21,0,0,1-3.87,1.783,21,21,0,0,1,1.783-3.87A1.472,1.472,0,0,1,81.97,44.284Z"
          data-name="Path 6020"
          fill={active ? activeColor : color}
          id="Path_6020"
          transform="translate(-47.128 -18.097)"
        />
        <TransitionPath
          d="M46.672,44.284a21,21,0,0,1,1.783,3.87,20.759,20.759,0,0,1-3.87-1.768,1.49,1.49,0,0,1,0-2.1A1.472,1.472,0,0,1,46.672,44.284Z"
          data-name="Path 6021"
          fill={active ? activeColor : color}
          id="Path_6021"
          transform="translate(-18.351 -18.097)"
        />
        <TransitionPath
          d="M87.916,66.778a1.47,1.47,0,0,1-1.478,1.478A53.74,53.74,0,0,1,80.8,66.778,53.74,53.74,0,0,1,86.438,65.3,1.47,1.47,0,0,1,87.916,66.778Z"
          data-name="Path 6022"
          fill={active ? activeColor : color}
          id="Path_6022"
          transform="translate(-49.416 -36.278)"
        />
        <TransitionPath
          d="M29.616,66.778a53.74,53.74,0,0,1-5.638,1.478,1.478,1.478,0,0,1,0-2.956A53.74,53.74,0,0,1,29.616,66.778Z"
          data-name="Path 6023"
          fill={active ? activeColor : color}
          id="Path_6023"
          transform="translate(0 -36.278)"
        />
        <TransitionPath
          d="M66.778,87.916A1.47,1.47,0,0,1,65.3,86.438,53.74,53.74,0,0,1,66.778,80.8a53.74,53.74,0,0,1,1.478,5.638A1.47,1.47,0,0,1,66.778,87.916Z"
          data-name="Path 6024"
          fill={active ? activeColor : color}
          id="Path_6024"
          transform="translate(-36.278 -49.416)"
        />
        <TransitionPath
          d="M66.778,29.616A53.74,53.74,0,0,1,65.3,23.978a1.478,1.478,0,1,1,2.956,0A53.74,53.74,0,0,1,66.778,29.616Z"
          data-name="Path 6025"
          fill={active ? activeColor : color}
          id="Path_6025"
          transform="translate(-36.278)"
        />
      </g>
    </svg>
  )
)
