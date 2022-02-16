import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const ExchangeIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 14.117}
      hoverColor={activeColor}
      viewBox="0 0 14.116 14.117"
      width={width ?? 14.116}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M548.971,794.759a2.026,2.026,0,1,0-2.613,1.928v3.1a3.01,3.01,0,0,1-3.007,3.007h-.737l1.153-1.153a.588.588,0,0,0-.831-.831l-2.155,2.155,0,0a.584.584,0,0,0-.171.375.563.563,0,0,0,0,.114h0a.585.585,0,0,0,.138.308c.011.013.021.024.033.035l2.153,2.154a.588.588,0,0,0,.831-.831l-1.153-1.154h.737a4.187,4.187,0,0,0,4.183-4.182v-3.1A2.019,2.019,0,0,0,548.971,794.759Zm-2.026.85a.85.85,0,1,1,.85-.85A.851.851,0,0,1,546.945,795.61Z"
        data-name="Path 1921"
        fill={active ? activeColor : color}
        id="Path_1921"
        transform="translate(-534.855 -792.015)"
      />
      <TransitionPath
        d="M541.456,794.98l.031-.033a.6.6,0,0,0,.139-.311.625.625,0,0,0,0-.114.587.587,0,0,0-.165-.371l0,0h0l0,0-2.157-2.157a.588.588,0,0,0-.831.831l1.154,1.153h-.739a4.187,4.187,0,0,0-4.182,4.182v3.1a2.026,2.026,0,1,0,1.175,0v-3.1a3.01,3.01,0,0,1,3.007-3.007h.738L538.47,796.3a.588.588,0,0,0,.831.831Zm-5.314,8.208a.85.85,0,1,1-.85-.85A.851.851,0,0,1,536.142,803.188Z"
        data-name="Path 1922"
        fill={active ? activeColor : color}
        id="Path_1922"
        transform="translate(-533.266 -791.816)"
      />
    </SVG>
  )
)
