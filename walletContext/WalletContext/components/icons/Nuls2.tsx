import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Nuls2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5681"
      id="Group_5681"
      transform="translate(-1792.333 -574.388)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 86"
        fill="#82bd39"
        id="Ellipse_86"
        r="12.5"
        transform="translate(1792.333 574.388)"
      />
      <TransitionPath
        d="M1803.585,589.513l1.247,1.644V594.7l-4.687-2.081v-9.154a.464.464,0,0,1,.166-.354l.533-.457a.5.5,0,0,1,.7.051l.02.025,4.27,5.6,2.358,1.443v-7.719l-2.084-1.04-.1,4.841-1.1-1.464-.05-5.312,4.666,2.171v9.113l-1.06.873-3.339-1.865-3.706-4.862-.051,7.386,2.207,1.131Z"
        data-name="Path 5492"
        fill="#fff"
        id="Path_5492"
      />
    </g>
  </svg>
))
