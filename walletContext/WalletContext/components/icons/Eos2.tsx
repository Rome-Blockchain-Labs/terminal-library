import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const Eos2Icon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '25'}
    viewBox="0 0 25 25"
    width={width ? width : '25'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      data-name="Group 5678"
      id="Group_5678"
      transform="translate(-1792.333 -454.419)"
    >
      <TransitionCircle
        cx="12.5"
        cy="12.5"
        data-name="Ellipse 77"
        fill="#fff"
        id="Ellipse_77"
        r="12.5"
        transform="translate(1792.333 454.419)"
      />
      <g data-name="Layer 2" id="Layer_2">
        <g data-name="Layer 1-2" id="Layer_1-2">
          <TransitionPath
            d="M1804.832,454.873l-5.637,7.757-2.361,11.468,8,4.867,8-4.867-2.409-11.516Zm-6.7,18.7,1.783-8.721,4.047,12.287Zm2.361-10.7,4.336-5.974,4.337,5.974-4.337,13.106Zm5.156,14.263,4.047-12.287,1.783,8.721Z"
            data-name="Path 5457"
            id="Path_5457"
          />
        </g>
      </g>
    </g>
  </svg>
))
