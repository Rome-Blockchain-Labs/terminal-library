import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Polkadot2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5665"
      id="Group_5665"
      transform="translate(-1792.333 -305.769)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 74"
        fill="#fff"
        id="Ellipse_74"
        r="12.5"
        transform="translate(1792.333 305.769)"
      />
      <g data-name="Group 5664" id="Group_5664">
        <TransitionPath
          d="M1804.941,307.448a8.232,8.232,0,0,0-8.2,8.2,8.393,8.393,0,0,0,.433,2.663,1.128,1.128,0,1,0,2.138-.718,5.428,5.428,0,0,1-.319-2.09,5.914,5.914,0,1,1,6.27,6.081s-1.15.07-1.723.14a6.1,6.1,0,0,0-.627.124.074.074,0,0,1-.107,0h0a.076.076,0,0,1,0-.091l.178-.972,1.081-4.861a1.124,1.124,0,0,0-2.2-.47s-2.57,11.9-2.57,12.005a1.08,1.08,0,0,0,.781,1.314l.019,0h.059a1.079,1.079,0,0,0,1.316-.776.139.139,0,0,0,.007-.029.5.5,0,0,1,0-.054c.032-.14.356-1.723.356-1.723a2.918,2.918,0,0,1,2.414-2.295c.249-.038,1.291-.108,1.291-.108a8.193,8.193,0,0,0-.6-16.342Z"
          data-name="Path 5087"
          id="Path_5087"
        />
        <TransitionPath
          d="M1805.438,326.351a1.366,1.366,0,0,0-1.616,1.059l0,.021a1.36,1.36,0,0,0,1.04,1.619h.041a1.339,1.339,0,0,0,1.616-.988l0-.016v-.075A1.416,1.416,0,0,0,1805.438,326.351Z"
          data-name="Path 5088"
          fill="#e6007a"
          id="Path_5088"
        />
      </g>
    </g>
  </svg>
))
