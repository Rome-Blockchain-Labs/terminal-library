import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const DownIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 7}
      viewBox="0 0 7 5"
      width={width ?? 5}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    > 
      <path d="M1 1L3.49449 3.5L6 1" stroke="#7A808A" strokeLinecap="round" transform="translate(0)"/>             
    </svg>
  )
);

export default DownIcon;