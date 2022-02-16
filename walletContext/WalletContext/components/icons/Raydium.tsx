import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const RaydiumIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 15.479}
      viewBox="0 0 13.34 15.479"
      width={width ?? 13.34}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M12.641 5.809v5.4l-5.974 3.467-5.976-3.467V4.276L6.67.804l4.591 2.667.694-.4L6.67 0 0 3.87v7.739l6.67 3.87 6.67-3.87v-6.2z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M4.999 11.213h-1v-3.37H7.33a1.187 1.187 0 0 0 .839-.358 1.215 1.215 0 0 0 .348-.846 1.141 1.141 0 0 0-.089-.457 1.165 1.165 0 0 0-.261-.384 1.178 1.178 0 0 0-.382-.261 1.122 1.122 0 0 0-.454-.089H3.999V4.422h3.334a2.211 2.211 0 0 1 1.554.653 2.242 2.242 0 0 1 .65 1.564 2.232 2.232 0 0 1-1.349 2.045 3.844 3.844 0 0 1-1.192.181h-2zM9.514 11.127H8.349l-.9-1.576a3.753 3.753 0 0 0 1.042-.215zM11.945 4.687l.689.384.689-.384v-.816l-.689-.4-.689.4z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
