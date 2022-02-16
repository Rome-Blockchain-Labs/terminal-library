import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const KyberIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 17.454}
      viewBox="0 0 13.237 17.454"
      width={width ?? 13.237}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="icon - Kyber Dmm"
        id="icon_-_Kyber_Dmm"
        transform="translate(0 0.001)"
      >
        <TransitionPath
          d="M20,22.776,27.041,26.5a.389.389,0,0,0,.51-.117.323.323,0,0,0,.053-.179V19.339a.355.355,0,0,0-.364-.345.391.391,0,0,0-.2.051Z"
          data-name="Path 6845"
          fill={active ? activeColor : color}
          id="Path_6845"
          transform="translate(-14.367 -14.049)"
        />
        <TransitionPath
          d="M26.173,3.345,21.36.072a.4.4,0,0,0-.537.065.346.346,0,0,0-.066.122L19,7.55,26.131,3.9a.317.317,0,0,0,.153-.442.338.338,0,0,0-.111-.118"
          data-name="Path 6846"
          fill={active ? activeColor : color}
          id="Path_6846"
          transform="translate(-13.649)"
        />
        <TransitionPath
          d="M21.355,45.485l4.819-3.273a.317.317,0,0,0,.088-.464.355.355,0,0,0-.127-.1L19,38l1.757,7.29a.383.383,0,0,0,.458.261.4.4,0,0,0,.139-.06"
          data-name="Path 6847"
          fill={active ? activeColor : color}
          id="Path_6847"
          transform="translate(-13.649 -28.107)"
        />
        <TransitionPath
          d="M3.8,9.377,5.633,1.462a.338.338,0,0,0-.286-.394.388.388,0,0,0-.277.053L.38,4.445A.876.876,0,0,0,0,5.161V13.6a.875.875,0,0,0,.38.726l4.667,3.314a.382.382,0,0,0,.506-.085A.317.317,0,0,0,5.61,17.3Z"
          data-name="Path 6848"
          fill={active ? activeColor : color}
          id="Path_6848"
          transform="translate(0 -0.785)"
        />
      </g>
    </svg>
  )
)
