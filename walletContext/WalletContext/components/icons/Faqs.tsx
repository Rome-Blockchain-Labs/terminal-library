import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const FaqsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 22.891}
      viewBox="0 0 22.892 22.891"
      width={width ?? 22.892}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Icon - FAQ"
        id="Icon_-_FAQ"
        transform="translate(-1290.191 -713.226)"
      >
        <g
          data-name="Group 38"
          id="Group_38"
          transform="translate(1290.191 713.226)"
        >
          <TransitionPath
            d="M1301.637,736.117a11.446,11.446,0,1,1,11.446-11.445A11.458,11.458,0,0,1,1301.637,736.117Zm0-21.439a9.993,9.993,0,1,0,9.993,9.993A10,10,0,0,0,1301.637,714.679Z"
            data-name="Path 59"
            fill={active ? activeColor : color}
            id="Path_59"
            transform="translate(-1290.191 -713.226)"
          />
        </g>
        <g
          data-name="Group 39"
          id="Group_39"
          transform="translate(1300.675 718.939)"
        >
          <TransitionPath
            d="M1301.989,721.062a.973.973,0,0,1-.974-.969.963.963,0,0,1,.963-.969h.012a.969.969,0,0,1,0,1.937Z"
            data-name="Path 60"
            fill={active ? activeColor : color}
            id="Path_60"
            transform="translate(-1301.015 -719.125)"
          />
        </g>
        <g
          data-name="Group 40"
          id="Group_40"
          transform="translate(1299.72 722.754)"
        >
          <TransitionPath
            d="M1303.138,730.472h-1.191a.727.727,0,0,1-.726-.726v-5.23h-.465a.726.726,0,1,1,0-1.453h1.191a.727.727,0,0,1,.726.726v5.23h.465a.726.726,0,1,1,0,1.453Z"
            data-name="Path 61"
            fill={active ? activeColor : color}
            id="Path_61"
            transform="translate(-1300.029 -723.063)"
          />
        </g>
      </g>
    </svg>
  )
)
