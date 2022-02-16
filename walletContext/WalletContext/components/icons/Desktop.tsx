import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const DesktopIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      fill="currentColor"
      height={height ?? 20}
      hoverStrokeColor={activeColor}
      stroke="currentColor"
      viewBox="0 0 100.25 100.25"
      width={width ?? 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M89.5,14.962h-79c-0.829,0-1.5,0.672-1.5,1.5v49.189c0,0.828,0.671,1.5,1.5,1.5h28.233l-1.405,14.753
        c-0.004,0.045,0.001,0.089,0.001,0.134h-7.451c-0.829,0-1.5,0.672-1.5,1.5s0.671,1.5,1.5,1.5h41.736c0.829,0,1.5-0.672,1.5-1.5
        s-0.671-1.5-1.5-1.5h-8.197c0-0.045,0.005-0.088,0.001-0.134l-1.405-14.753H89.5c0.829,0,1.5-0.672,1.5-1.5V16.462
        C91,15.634,90.328,14.962,89.5,14.962z M60.416,82.038H40.328l1.418-14.887h17.253L60.416,82.038z M88,64.152H12V17.963h76V64.152z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </SVG>
  )
)
