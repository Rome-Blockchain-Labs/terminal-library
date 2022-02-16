import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const DexterIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 13.342}
      viewBox="0 0 10.811 13.342"
      width={width ?? 10.811}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5742"
        id="Group_5742"
        transform="translate(-1917.328 -597.726)"
      >
        <TransitionPath
          d="M1927.546,619.969a.591.591,0,0,0,.593-.588v-.693a.591.591,0,0,0-.593-.588h-9.626a.59.59,0,0,0-.593.588v.693a.59.59,0,0,0,.593.588Z"
          fill={active ? activeColor : color}
          fill-rule="evenodd"
          id="Fill-16"
          transform="translate(0 -8.901)"
        />
        <TransitionPath
          d="M1927.85,605.042l-2.828-2.806,2.828-2.805a.516.516,0,0,0,0-.734l-.825-.819a.526.526,0,0,0-.74,0l-2.827,2.806-2.828-2.806a.526.526,0,0,0-.74,0l-.825.819a.515.515,0,0,0,0,.734l2.828,2.805-2.828,2.806a.516.516,0,0,0,0,.734l.825.818a.526.526,0,0,0,.74,0l2.828-2.8,2.827,2.806a.527.527,0,0,0,.74,0l.825-.819a.516.516,0,0,0,0-.734"
          fill={active ? activeColor : color}
          fill-rule="evenodd"
          id="Fill-18"
          transform="translate(-0.692)"
        />
      </g>
    </svg>
  )
)
