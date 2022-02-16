import React, { FC, memo } from 'react'
import { theme } from 'twin.macro'

import { CloseIcon } from '../icons'

type CloseButtonProps = {
  onClick: () => void
  width?: number
  height?: number
  color?: string
}

export const CloseButton: FC<CloseButtonProps> = memo(
  ({ onClick, width = 16, height = 16, color = theme`colors.yellow.400` }) => {
    return (
      <button onClick={onClick}>
        <CloseIcon color={color} height={height} width={width} />
      </button>
    )
  }
)
