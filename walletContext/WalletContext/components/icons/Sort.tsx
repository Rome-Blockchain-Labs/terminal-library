import React, { FC, ForwardedRef, forwardRef } from 'react'

import { IIconProps, TransitionPath } from '.'

export const SortIcon: FC<IIconProps> = forwardRef(
  ({ height, width }, ref: ForwardedRef<SVGSVGElement>) => (
    <svg
      ref={ref}
      data-name="Group 4999"
      height={height ?? 4.916}
      viewBox="0 0 7.117 4.916"
      width={width ?? 7.117}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M668.123,752.457a.349.349,0,0,0-.49,0l-.848.847,0-3.391a.347.347,0,0,0-.346-.346.342.342,0,0,0-.343.343l-.006,3.394-.842-.841a.342.342,0,1,0-.484.484l1.427,1.427.006.006a.338.338,0,0,0,.144.087l.009,0,.026.009a.268.268,0,0,1,.046.006l0,0h.034l0,0,.049-.009.023-.012a.3.3,0,0,0,.15-.081l1.436-1.436A.346.346,0,0,0,668.123,752.457Z"
        data-name="Path 1990"
        fill="#b4bbc7"
        transform="translate(-664.667 -749.568)"
      />
      <TransitionPath
        d="M3.457,2.89a.349.349,0,0,0-.49,0l-.848.847,0-3.391A.347.347,0,0,0,1.776,0a.342.342,0,0,0-.343.343L1.428,3.737.586,2.9A.337.337,0,0,0,.1,2.9a.339.339,0,0,0,0,.484L1.529,4.806l.006.006a.337.337,0,0,0,.144.087l.009,0,.026.009a.268.268,0,0,1,.046.006l0,0H1.8l0,0,.049-.009L1.871,4.9a.3.3,0,0,0,.15-.081L3.457,3.38A.346.346,0,0,0,3.457,2.89Z"
        data-name="Path 1991"
        fill="#515967"
        transform="translate(7.117 4.916) rotate(180)"
      />
    </svg>
  )
)
