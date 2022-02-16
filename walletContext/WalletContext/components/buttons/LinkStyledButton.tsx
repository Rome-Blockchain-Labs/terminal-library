import tw, { styled } from 'twin.macro'

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  ${tw`font-medium text-yellow-400 no-underline border-none cursor-pointer bg-none`}

  ${({ disabled }) => disabled && tw`text-gray-400 cursor-default`}

  :hover {
    ${({ disabled }) => !disabled && tw`underline`}
  }

  :focus {
    ${tw`outline-none`}
    ${({ disabled }) => !disabled && tw`underline`}
  }
`
