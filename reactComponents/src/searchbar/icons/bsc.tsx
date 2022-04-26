import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const BscIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16}
      width={width ?? 16}
      viewBox="0 0 16 16"        
      fill="none"
    >      
    <g transform='translate(0)'>
      <path d="M7.97 15.94C12.3717 15.94 15.94 12.3717 15.94 7.97C15.94 3.56829 12.3717 0 7.97 0C3.56829 0 0 3.56829 0 7.97C0 12.3717 3.56829 15.94 7.97 15.94Z" fill="white"/>
      <path d="M5.0799 6.78001L7.9799 3.88001L10.8799 6.78001L12.5599 5.09001L7.9799 0.51001L3.3999 5.09001L5.0799 6.78001Z" fill="#F3BA2F"/>
      <path d="M2.20122 6.28291L0.518311 7.96582L2.20122 9.64873L3.88414 7.96582L2.20122 6.28291Z" fill="#F3BA2F"/>
      <path d="M5.07991 9.15002L7.97991 12.05L10.8799 9.15002L12.5699 10.84L7.98991 15.42L3.40991 10.84L5.08991 9.16002" fill="#F3BA2F"/>
      <path d="M13.7554 6.28291L12.0725 7.96582L13.7554 9.64873L15.4383 7.96582L13.7554 6.28291Z" fill="#F3BA2F"/>
      <path d="M9.68001 7.97001L7.97001 6.26001L6.71001 7.52001L6.56001 7.66001L6.26001 7.96001L7.97001 9.67001L9.68001 7.96001" fill="#F3BA2F"/>
    </g>    
    </svg>
  )
);

export default BscIcon;

