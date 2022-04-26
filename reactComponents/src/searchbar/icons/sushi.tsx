import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const SushiIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 13}
      width={width ?? 12}
      viewBox="0 0 13 12"        
      fill="none"
    >      
    <g transform='translate(0)'>
      <g clipPath="url(#clip0_1021_1587)">
      <path d="M9.12008 1.84998C6.39008 -0.0700237 3.50008 -0.550024 2.64008 0.679976L0.180081 4.25998H0.200081C-0.419919 5.31998 0.470081 7.09998 2.25008 8.73998C2.74008 8.61998 3.18008 8.33998 3.50008 7.94998C3.77008 7.64998 4.06008 7.37998 4.38008 7.13998C4.59008 6.94998 4.88008 6.84998 5.16008 6.87998C5.54008 6.87998 5.96008 7.25998 6.66008 8.16998C7.36008 9.07998 8.32008 9.34998 8.91008 8.86998C8.96008 8.81998 9.02008 8.81998 9.07008 8.75998C9.25008 8.62998 9.42008 8.46998 9.56008 8.29998C9.42008 8.25998 9.25008 8.20998 9.12008 8.16998C9.07008 8.16998 9.07008 8.11998 9.07008 8.05998C9.07008 7.99998 9.12008 8.00998 9.18008 8.00998C9.28008 8.03998 9.40008 8.07998 9.51008 8.10998L9.67008 8.15998C9.67008 8.15998 9.74008 8.06998 9.77008 8.00998C9.83008 7.91998 9.89008 7.82998 9.96008 7.70998C9.63008 7.63998 9.30008 7.54998 8.99008 7.42998C8.05008 7.07998 7.16008 6.60998 6.34008 6.02998C5.46008 5.43998 4.67008 4.73998 3.97008 3.93998C2.96008 2.74998 2.55008 1.61998 3.02008 0.949976C3.78008 -0.120024 6.40008 0.419976 8.90008 2.17998C10.2401 3.04998 11.3501 4.23998 12.1301 5.62998C12.2901 5.62998 12.4401 5.65998 12.5901 5.70998C12.8601 6.26998 12.8601 6.91998 12.5901 7.47998C13.3901 6.23998 11.8901 3.66998 9.11008 1.84998H9.12008ZM2.32008 1.84998C2.37008 1.79998 2.43008 1.84998 2.43008 1.89998C2.47008 2.01998 2.49008 2.14998 2.48008 2.27998C2.53008 2.32998 2.48008 2.38998 2.43008 2.38998C2.38008 2.43998 2.32008 2.38998 2.32008 2.33998C2.30008 2.20998 2.27008 2.07998 2.21008 1.95998C2.21008 1.90998 2.27008 1.90998 2.32008 1.84998V1.84998ZM6.12008 6.66998C6.07008 6.66998 6.01008 6.71998 5.96008 6.66998C4.77008 5.87998 3.75008 4.85998 2.98008 3.64998C2.81008 3.37998 2.66008 3.09998 2.54008 2.80998C2.54008 2.77664 2.55675 2.73998 2.59008 2.69998C2.64008 2.64998 2.70008 2.69998 2.70008 2.74998C2.85008 3.07998 3.03008 3.39998 3.23008 3.69998C3.99008 4.81998 4.98008 5.76998 6.12008 6.49998C6.12008 6.54998 6.18008 6.59998 6.12008 6.65998V6.66998Z" fill="#7A808A"/>
      <path d="M5.34008 2.51998C5.34008 2.51998 5.32008 2.53998 5.31008 2.54998C4.93008 3.08998 5.69008 4.20998 6.91008 5.06998C8.20008 5.92998 9.48008 6.18998 9.85008 5.65998C9.85008 5.64998 9.86008 5.63998 9.87008 5.62998C10.2001 5.07998 9.45008 3.98998 8.25008 3.14998C6.99008 2.30998 5.73008 2.03998 5.33008 2.52998L5.34008 2.51998Z" fill="#7A808A"/>
      <path d="M12.6 5.71C12.45 5.66 12.29 5.64 12.14 5.63C12.44 6.11 12.48 6.71 12.25 7.23L12.23 7.26C11.86 7.79 11.02 7.93 9.96 7.71C9.89 7.82 9.83 7.92 9.77 8.01C9.73 8.06 9.7 8.11 9.67 8.16H9.71C9.76 8.17 9.76 8.23 9.76 8.28C9.76 8.33 9.71 8.33 9.65 8.33L9.56 8.3C9.42 8.47 9.25 8.63001 9.07 8.76C9.02 8.81 8.96 8.81 8.91 8.87C8.32 9.35 7.36 9.08 6.66 8.17C5.96 7.26 5.54 6.89 5.16 6.89C4.87 6.87 4.59 6.96 4.38 7.15C4.06 7.39 3.77 7.66 3.5 7.96C3.18 8.35 2.74 8.63 2.25 8.75C2.7 9.16 3.17 9.54001 3.67 9.89001C6.37 11.8 9.23 12.29 10.12 11.1L10.15 11.12L12.61 7.48C12.88 6.92 12.88 6.27 12.61 5.72L12.6 5.71ZM11.42 8.49C10.99 8.52 10.56 8.51 10.13 8.44C10.07 8.44 10.02 8.39 10.02 8.33C10.02 8.27 10.07 8.22001 10.13 8.22001C10.55 8.29001 10.99 8.31001 11.42 8.27001C11.48 8.27001 11.53 8.32 11.53 8.38C11.53 8.44 11.48 8.49 11.42 8.49V8.49Z" fill="#7A808A"/>
      </g>
      <defs>
      <clipPath id="clip0_1021_1587">
      <rect width="12.81" height="11.73" fill="white"/>
      </clipPath>
      </defs>
    </g>    
    </svg>
  )
);

export default SushiIcon;