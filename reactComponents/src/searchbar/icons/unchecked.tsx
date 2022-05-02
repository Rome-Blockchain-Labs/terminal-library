import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const UnCheckedIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 8}
    width={width ?? 8}
    viewBox="0 0 8 8">
    
    <g transform='translate(0)'>
      <g clipPath="url(#clip0_1021_1505)">
        <path d="M0.75 0.75L6.92 6.92" stroke="#7A808A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.92 0.75L0.75 6.92" stroke="#7A808A" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <defs>
      <clipPath id="clip0_1021_1505">
        <rect width="7.67" height="7.67" fill="white"/>
      </clipPath>
      </defs>
    </g>    
  </SVGIcon>    
)

export default memo(UnCheckedIcon);
