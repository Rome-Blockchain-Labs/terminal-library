import React from 'react';
import styled from 'styled-components';
import { useCopyClipboard } from '../hooks/useCopyClipboard';
import Button from './Button';
import CopyIcon from "../icons/copy";

const StyledCopyButton = styled(Button)`
  background-color: #474F5C;
  min-width: auto;
  padding: 2px;
`;
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  align-items: center;
`;

export default function CopyButton(props: {
  toCopy: string;
  children?: React.ReactNode;
}): JSX.Element {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <StyledCopyButton onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText tw="flex items-center">
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <CopyIcon width={16} height={16} />
      )}
      {isCopied ? '' : props.children}
    </StyledCopyButton>
  );
}
