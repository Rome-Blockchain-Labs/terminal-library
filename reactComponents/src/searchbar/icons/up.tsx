import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const UpIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 7}
      viewBox="0 0 7 4"
      width={width ?? 4}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >      
      <path d="M6 3.5L3.50551 1L1 3.5" stroke="#7A808A" strokeLinecap="round" transform="translate(0)"/>              
    </svg>
  )
);

export default UpIcon;