import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const PancakeswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.82}
      viewBox="0 0 14.618 14.82"
      width={width ?? 14.618}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M31.765,21.822c-.03-1.592-1.481-2.983-3.576-3.781l.655-3.629a1.517,1.517,0,0,0-1.462-1.764,1.463,1.463,0,0,0-1.462,1.462v3.327c-.5-.05-1.008-.1-1.512-.1a15.266,15.266,0,0,0-1.563.1V14.11a1.453,1.453,0,1,0-2.873.3l.706,3.629c-2.095.8-3.5,2.189-3.526,3.781h0v1.159c0,2.47,3.276,4.486,7.309,4.486s7.309-2.016,7.309-4.486h0V21.822Zm-10.179.907c-.454,0-.807-.554-.807-1.21s.353-1.21.807-1.21.807.554.807,1.21S22.04,22.729,21.586,22.729Zm5.6,0c-.454,0-.807-.554-.807-1.21s.353-1.21.807-1.21.807.554.807,1.21S27.635,22.729,27.181,22.729Z"
        data-name="Path 6027"
        fill={active ? activeColor : color}
        id="Path_6027"
        transform="translate(-17.15 -12.648)"
      />
    </svg>
  )
)
