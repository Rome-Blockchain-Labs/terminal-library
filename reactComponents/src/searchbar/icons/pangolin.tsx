import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const PangolinIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14}
      width={width ?? 12}
      viewBox="0 0 14 12"        
      fill="none"
    >      
    <g transform='translate(0)'>
      <g clipPath="url(#clip0_1021_1532)">
        <path d="M10.6201 1.61L7.31006 4.01L9.93006 5.92L13.0401 3.66L11.8501 0H10.0901L10.6101 1.6L10.6201 1.61Z" fill="#7A808A"/>
        <path d="M1.19 0L0 3.65L3.11 5.91L5.73 4.01L2.42 1.6L2.94 0H1.19Z" fill="#7A808A"/>
        <path d="M3.11011 1.38L6.22011 3.64V1.94L3.56011 0L3.11011 1.38Z" fill="#7A808A"/>
        <path d="M9.48007 0L6.82007 1.93V3.63L9.93007 1.37L9.48007 0Z" fill="#7A808A"/>
        <path d="M3.12012 6.64V6.66L6.22012 8.92V4.38L3.12012 6.63V6.64Z" fill="#7A808A"/>
        <path d="M9.92007 6.64L6.82007 4.38V8.91L9.93007 6.65V6.63L9.92007 6.64Z" fill="#7A808A"/>
        <path d="M3.11011 9.57004L6.22011 11.83V9.63004L3.69011 7.79004L3.11011 9.57004Z" fill="#7A808A"/>
        <path d="M6.82007 9.64005V11.84L9.93007 9.58005L9.35007 7.80005L6.82007 9.64005Z" fill="#7A808A"/>
        </g>
        <defs>
        <clipPath id="clip0_1021_1532">
        <rect width="13.04" height="11.84" fill="white"/>
        </clipPath>
        </defs>
    </g>    
    </svg>
  )
);

export default PangolinIcon;
