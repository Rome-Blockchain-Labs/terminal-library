import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const Biswap2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.909}
      viewBox="0 0 14.937 14.909"
      width={width ?? 14.937}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="linear-gradient"
          x1="0.594"
          x2="0.447"
          y1="0.675"
          y2="-0.125"
        >
          <stop offset="0" stopColor="#ff496a" />
          <stop offset="1" stopColor="#e42648" />
        </linearGradient>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="linear-gradient-2"
          x1="0.323"
          x2="0.616"
          y1="0.323"
          y2="1.175"
        >
          <stop offset="0.002" stopColor="#1158f1" />
          <stop offset="1" stopColor="#119bed" />
        </linearGradient>
      </defs>
      <TransitionPath
        d="M7.455,14.909A7.455,7.455,0,1,0,0,7.455,7.443,7.443,0,0,0,7.455,14.909Z"
        data-name="Path 8497"
        fill="#fff"
        id="Path_8497"
      />
      <TransitionPath
        d="M21.25,10.128c-.523.11-1.018.248-1.4.33a2.528,2.528,0,0,0-1.981,2.2c-.165,1.155.22,1.65.055,3-.3,2.366-2.558,3.163-3.6,3.659-.605.275-2.091.935-3.218,1.43A7.457,7.457,0,0,0,21.36,10.1.208.208,0,0,1,21.25,10.128Z"
        data-name="Path 8498"
        fill="url(#linear-gradient)"
        id="Path_8498"
        transform="translate(-8.047 -7.322)"
      />
      <TransitionPath
        d="M6.6,6.354a19.1,19.1,0,0,0,.8-2.421c.55-1.485,2.256-1.045,2.723-.99.77.11.99-.165,2.613-.44.083,0,.165-.028.248-.028A7.451,7.451,0,0,0,.715,4.236C3.191,4.841,5.832,6.162,6.6,6.354ZM4.979,1.293C5.2,1.32,6.244,2.641,6.437,6c0,0-1.348-.33-1.65-1.018C4.566,4.4,4.869,3.631,4.979,1.293Zm8.28,1.513ZM0,7.455A8.8,8.8,0,0,1,.193,5.722a10.266,10.266,0,0,1,.853.77C3,8.28,6.134,9.71,7.29,8.39h0a2.527,2.527,0,0,1-2.531.88l-2.393,3.6A7.349,7.349,0,0,1,0,7.455Z"
        data-name="Path 8499"
        fill="url(#linear-gradient-2)"
        id="Path_8499"
      />
    </svg>
  )
)
