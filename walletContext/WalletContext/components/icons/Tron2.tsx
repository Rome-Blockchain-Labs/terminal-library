import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Tron2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5663"
      id="Group_5663"
      transform="translate(-1792.333 -424.449)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 73"
        fill="#fff"
        id="Ellipse_73"
        r="12.5"
        transform="translate(1792.333 424.449)"
      />
      <g id="tron">
        <TransitionPath
          d="M1816.041,434.537c-.974-.9-2.323-2.274-3.421-3.249l-.065-.045a1.254,1.254,0,0,0-.36-.2h0c-2.648-.494-14.97-2.8-15.21-2.768a.459.459,0,0,0-.189.072l-.062.049a.733.733,0,0,0-.169.272l-.016.043v.266c1.387,3.863,6.865,16.516,7.943,19.486.065.2.189.584.419.6h.052c.124,0,.65-.7.65-.7s9.408-11.41,10.36-12.625a3.072,3.072,0,0,0,.325-.48A.782.782,0,0,0,1816.041,434.537Zm-8.014,1.329,4.015-3.33,2.355,2.17Zm-1.56-.218-6.913-5.666,11.185,2.063Zm.624,1.485,7.076-1.141-8.089,9.746Zm-8.476-6.586,7.274,6.173-1.052,9.025Z"
          data-name="Path 5086"
          fill="#ff060a"
          id="Path_5086"
        />
      </g>
    </g>
  </svg>
))
