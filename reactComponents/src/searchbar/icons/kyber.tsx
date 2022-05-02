import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const KyberIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 16}
    width={width ?? 16}
    viewBox="0 0 11 15">
    
    <g transform='translate(0)'>
      <g clipPath="url(#clip0_1021_1517)">
        <path d="M4.53003 7.01998L10.2 10.02C10.34 10.1 10.52 10.06 10.61 9.92998C10.64 9.88998 10.65 9.83998 10.65 9.78998V4.25998C10.65 4.09998 10.51 3.97998 10.36 3.97998C10.3 3.97998 10.25 3.98998 10.2 4.01998L4.53003 7.01998V7.01998Z" fill="#7A808A"/>
        <path d="M10.0801 2.68995L6.21006 0.0599538C6.07006 -0.0400462 5.89006 -0.0100462 5.78006 0.109954C5.76006 0.139954 5.74006 0.169954 5.73006 0.209954L4.31006 6.06995L10.0501 3.13995C10.1801 3.07995 10.2401 2.92995 10.1801 2.79995V2.77995C10.1801 2.77995 10.1201 2.70995 10.0801 2.67995" fill="#7A808A"/>
        <path d="M6.20006 13.98L10.0801 11.35C10.2001 11.28 10.2401 11.12 10.1701 11L10.1501 10.98C10.1501 10.98 10.0901 10.92 10.0501 10.9L4.31006 7.96997L5.72006 13.84C5.77006 14 5.93006 14.09 6.09006 14.05C6.13006 14.05 6.17006 14.03 6.20006 14" fill="#7A808A"/>
        <path d="M3.06 6.91L4.53 0.540004C4.56 0.390004 4.46 0.250004 4.31 0.220004C4.23 0.200004 4.15 0.220004 4.09 0.260004L0.31 2.95C0.12 3.08 0 3.29 0 3.52V10.31C0 10.54 0.11 10.76 0.31 10.9L4.06 13.57C4.19 13.65 4.37 13.63 4.47 13.5C4.51 13.44 4.53 13.37 4.52 13.29L3.07 6.92L3.06 6.91Z" fill="#7A808A"/>
      </g>
      <defs>
        <clipPath id="clip0_1021_1517">
        <rect width="10.65" height="14.05" fill="white"/>
        </clipPath>
      </defs>
    </g>
  </SVGIcon>    
)

export default memo(KyberIcon);
