import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const KuuLogoIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16.576}
      viewBox="0 0 39.486 16.576"
      width={width ?? 39.486}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M3692.219 325.489a.577.577 0 0 1-.577-.577v-6.17a.577.577 0 1 1 1.155 0v5.218l10.987-5.73a.577.577 0 1 1 .534 1.024l-11.831 6.17a.576.576 0 0 1-.268.065zm11.764 9.127a.577.577 0 0 0 .1-.811l-6.061-7.71a.577.577 0 0 0-.709-.161l-5.346 2.635a.577.577 0 0 0-.322.518v5.075a.577.577 0 1 0 1.155 0v-4.716l4.6-2.27 5.772 7.342a.577.577 0 0 0 .811.1zm13.1-6.026v-9.849a.577.577 0 1 0-1.155 0v9.849a4.995 4.995 0 1 1-9.989 0v-6.037a.577.577 0 0 0-1.155 0v6.037a6.149 6.149 0 1 0 12.3 0zm14.049 0v-9.849a.577.577 0 0 0-1.155 0v9.849a4.994 4.994 0 1 1-9.989 0v-6.037a.577.577 0 1 0-1.155 0v6.037a6.149 6.149 0 1 0 12.3 0z"
        fill={active ? activeColor : color}
        transform="translate(-3691.641 -318.164)"
      />
    </svg>
  )
)
