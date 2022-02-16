import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const EthereumIcon: FC<IIconProps> = memo(({ height, width }) => (
  <svg
    height={height ? height : '32'}
    viewBox="0 0 24 24"
    width={width ? width : '32'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <TransitionPath
      d="M12.791 2.385v7.91l6.566 2.984zM12.389 2.637 5.976 13.279l6.413-2.915.125-.057.028-.013v-7.91l-.013.022zM12.791 24.37l6.444-9.075-6.444 3.805zM6.102 15.295l6.354 8.953.086.121v-5.271l-.061-.036zM19.403 13.575l-6.611-3v6.912l3.606-2.132zM12.389 10.639l-6.458 2.936 6.458 3.818.125.074.028.016V10.57l-.028.013z"
      fill="#7a808a"
    />
  </svg>
))
