import React, { memo, FC } from 'react';
import { IIconProps } from '.';

const SVGIcon: FC<IIconProps> = ({children, width, height, viewBox}) => {
  return (
    <svg
      height={height ?? 16}
      width={width ?? 16}
      viewBox={viewBox}
      fill="none"
    >
      {children}
    </svg>
  )
}

export default memo(SVGIcon)