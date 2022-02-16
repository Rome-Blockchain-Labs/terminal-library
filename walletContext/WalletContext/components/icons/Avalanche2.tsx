import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Avalanche2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5662"
      id="Group_5662"
      transform="translate(-1792.333 -274.927)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 72"
        fill="#e84142"
        id="Ellipse_72"
        r="12.5"
        transform="translate(1792.333 274.927)"
      />
      <TransitionPath
        d="M1809.242,287.751a.826.826,0,0,1,1.565,0l2.7,4.735c.433.748.078,1.358-.788,1.358h-5.433c-.856,0-1.21-.61-.787-1.358Zm-5.217-9.114a.82.82,0,0,1,1.556,0l.6,1.083,1.417,2.49a2.584,2.584,0,0,1,0,2.254l-4.754,8.238a2.5,2.5,0,0,1-1.949,1.142h-3.946c-.867,0-1.221-.6-.788-1.358Z"
        data-name="Path 5085"
        fill="#fff"
        id="Path_5085"
      />
    </g>
  </svg>
))
