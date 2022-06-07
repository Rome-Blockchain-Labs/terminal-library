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
    justify-content: space-between;
    border-color: ${styleOverrides?.borderColor || '#474F5C'};      
    background-color: ${styleOverrides?.backColor || '#474F5C'};
    color: ${styleOverrides?.color || '#B4BBC7'};      
    border-radius: ${styleOverrides?.borderRadius || '4px'};
    font-size: ${styleOverrides?.fontSize || '0.75rem'};
    padding: ${styleOverrides?.padding || '4px 6px'};
    border-width: 0;      
    box-sizing: border-box;
    min-width: 60px;

    &:hover {
      background-color: ${styleOverrides?.hoverBackColor || '#00070E'};
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