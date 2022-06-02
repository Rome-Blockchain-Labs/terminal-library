import React, { FC } from 'react';
import styled from 'styled-components';

type ButtonProps = {
  styleOverrides?: any;
  children?: any;
  className?: string;
  onClick?: (e: React.SyntheticEvent) => void
}

const StyledButton = styled.button`
  ${({ styleOverrides }) => `
    display: flex;
    align-items: center;
    border-color: ${styleOverrides?.button.borderColor || '#232C38'};      
    background-color: ${styleOverrides?.button.backColor || '#232C38'};
    color: ${styleOverrides?.button.color || '#B1B8C3'};      
    border-radius: ${styleOverrides?.button.borderRadius || '4px'};      
    font-size: ${styleOverrides?.button.fontSize || '0.75rem'};      
    padding: ${styleOverrides?.button.padding || '4px 6px'};      
    border-width: 0;      
    box-sizing: border-box;

    &:hover {
      background-color: ${styleOverrides?.button.hoverBackColor || 'black'};      
    }
    & span {
      padding-right: 3px;
    }
  `}  
`;

const Button: FC<ButtonProps> = ({ className, styleOverrides, onClick, children }) => {
  return (
    <StyledButton className={className} onClick={onClick} style={styleOverrides}>
      {children}
    </StyledButton>
  );
}
export default Button;