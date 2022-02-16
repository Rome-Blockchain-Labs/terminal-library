import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const PoolIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.524}
      hoverColor={activeColor}
      viewBox="0 0 12.694 11.524"
      width={width ?? 12.694}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M11.792 10.152a.966.966 0 0 1-1.531 0 1.96 1.96 0 0 0-3.149 0 .91.91 0 0 1-.776.376.885.885 0 0 1-.755-.376 1.96 1.96 0 0 0-3.149 0 .966.966 0 0 1-1.531 0 .5.5 0 1 0-.809.581 1.962 1.962 0 0 0 3.149 0 .912.912 0 0 1 .776-.378.933.933 0 0 1 .754.378 1.961 1.961 0 0 0 3.149 0 .922.922 0 0 1 .776-.378.942.942 0 0 1 .755.378 1.891 1.891 0 0 0 1.525.792h.079a1.9 1.9 0 0 0 1.544-.792.5.5 0 1 0-.809-.581z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M1.658 9.184a1.929 1.929 0 0 0 1.585-.792.885.885 0 0 1 .776-.377.9.9 0 0 1 .754.377 1.957 1.957 0 0 0 1.564.792 1.934 1.934 0 0 0 1.584-.792.9.9 0 0 1 .776-.377.91.91 0 0 1 .755.377 1.891 1.891 0 0 0 1.525.792h.079a1.9 1.9 0 0 0 1.544-.792.5.5 0 1 0-.809-.581.965.965 0 0 1-1.531 0 1.961 1.961 0 0 0-3.149 0 .942.942 0 0 1-.776.377.915.915 0 0 1-.755-.377 1.961 1.961 0 0 0-3.149 0 .965.965 0 0 1-1.531 0 .5.5 0 0 0-.809.581 1.964 1.964 0 0 0 1.567.792zM2.838 1.874a.5.5 0 0 0 .5-.5.38.38 0 1 1 .759 0v4.387a.5.5 0 1 0 1 0v-.672h2.511v.672a.5.5 0 1 0 1 0V1.375a.38.38 0 1 1 .759 0 .5.5 0 1 0 1 0 1.373 1.373 0 0 0-2.73-.206H5.083a1.373 1.373 0 0 0-2.73.206.5.5 0 0 0 .485.499zm2.253 2.22V2.161h2.517v1.928z"
        fill={active ? activeColor : color}
      />
    </SVG>
  )
)
