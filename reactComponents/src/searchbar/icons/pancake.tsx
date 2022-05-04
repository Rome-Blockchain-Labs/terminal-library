import React, { FC } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const PancakeSwapIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 16}
    width={width ?? 16}
    viewBox="0 0 12 12">
    
    <g transform='translate(0)'>
      <g clipPath="url(#clip0_1021_1592)">
        <path d="M11.76 7.39C11.74 6.11 10.57 4.99 8.88 4.35L9.41 1.43C9.52 0.77 9.07 0.14 8.41 0.03C8.35 0.03 8.3 0.02 8.24 0.01C7.59 0.01 7.06 0.54 7.06 1.19V3.86C6.65 3.82 6.25 3.78 5.84 3.78C5.42 3.78 5 3.81 4.58 3.86V1.18C4.59 0.54 4.07 0 3.42 0C2.77 0 2.25 0.51 2.24 1.16C2.24 1.25 2.24 1.34 2.27 1.43L2.84 4.35C1.15 4.99 0.02 6.11 0 7.39V8.32C0 10.31 2.64 11.93 5.88 11.93C9.12 11.93 11.76 10.31 11.76 8.32V7.39ZM3.57 8.12C3.21 8.12 2.92 7.67 2.92 7.15C2.92 6.63 3.2 6.18 3.57 6.18C3.94 6.18 4.22 6.63 4.22 7.15C4.22 7.67 3.94 8.12 3.57 8.12ZM8.07 8.12C7.71 8.12 7.42 7.67 7.42 7.15C7.42 6.63 7.7 6.18 8.07 6.18C8.44 6.18 8.72 6.63 8.72 7.15C8.72 7.67 8.44 8.12 8.07 8.12Z" fill="#7A808A" />
      </g>
      <defs>
        <clipPath id="clip0_1021_1592">
          <rect width="11.76" height="11.93" fill="white" />
        </clipPath>
      </defs>
    </g>
  </SVGIcon>    
)

export default PancakeSwapIcon
