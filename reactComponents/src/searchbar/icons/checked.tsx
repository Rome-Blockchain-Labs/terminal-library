import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const CheckedIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 11}
      width={width ?? 8}
      viewBox="0 0 11 8"        
      fill="none"
    >      
    <g transform='translate(0)'>
      <path d="M1 2.91L4.29 6.16L9.48 1" stroke="#00C30E" strokeWidth="1.5" strokeLinecap="round"/>
    </g>    
    </svg>
  )
);

export default CheckedIcon;