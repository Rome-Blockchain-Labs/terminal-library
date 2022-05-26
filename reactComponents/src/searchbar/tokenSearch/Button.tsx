import React, { FC } from 'react';
import styled from 'styled-components';

type ButtonProps = {
  styleOverrides?: any;
  children?: any;
  className?: string;
  onClick?: (e: React.SyntheticEvent) => void
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-sizing: border-box;
  outline: none;
  padding: 3px 6px;
  margin: 3px;
  color: #B4BBC7;
  background-color: #474F5C;
`;

const Button: FC<ButtonProps> = ({ className, styleOverrides, onClick, children }) => {
  return (
    <StyledButton className={className} onClick={onClick} style={styleOverrides}>
      {children}
    </StyledButton>
  );
}
export default Button;