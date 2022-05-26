import React, { useContext, FC } from 'react';
import styled from 'styled-components';
import TokenSearchContext from '../Context/TokenSearch';
import { Logo } from './Logo';
import CheckedIcon from '../icons/checked';
import UnCheckedIcon from '../icons/unchecked';

const StyledChip = styled.div`
  ${({ styleOverrides }) => `
    > input {
      display: none;
    }

    > input + label {
      
      transition: all 500ms ease;    
      cursor: pointer;    
      display: grid;
      align-items: center;
      user-select: none;

      ::-webkit-transition: all 500ms ease;    
      ::-moz-user-select: -moz-none;
      ::-webkit-user-select: none;
      ::-ms-user-select: none;          

      font-size: ${styleOverrides?.fontSize || "8px"};  
      font-weight: ${styleOverrides?.fontWeight || "500"};  
      border-radius: ${styleOverrides?.borderRadius || "4px"};  
      background-color: ${styleOverrides?.backgroundColor || "#232B35"};  
      border: ${styleOverrides?.border || "solid 2px #232B35"};   
      padding: ${styleOverrides?.padding || "2px 5px"};   
      margin: ${styleOverrides?.margin || "5px"};   
      color: ${styleOverrides?.defaultColor || "#B4BBC7"};   
      width: ${styleOverrides?.width || "108px"};   
      height: ${styleOverrides?.height || "auto"};   
      text-align: ${styleOverrides?.textAlign || "left"}; 
      text-transform: ${styleOverrides?.textTransform || "uppercase"}; 
      grid-template-columns: ${styleOverrides?.gridTemplateColumns || "22% 68% 10%"}; 
      >:last-child {      
        justify-self: ${styleOverrides?.justifySelf || "end"}; 
      }
    }
    
    > input:checked + label {   
      ::-webkit-transition: all 500ms ease;
      transition: all 500ms ease;   
      border-color: ${styleOverrides?.checkedBorderColor || "#474F5C"};    
      color: ${styleOverrides?.checkedColor || "white"};   
      background-color: ${styleOverrides?.checkedBackgroundColor || "#474F5C"};   
    }    
  `}
  
  @media (max-width: 375px) {
    width: 50%;

    > input + label {
      width: auto;
    }
  }
`;

export const Chip: FC<any> = (props) => {
  const renderProps = useContext(TokenSearchContext);

  const { label, checked, onChange, name, value, styleOverrides, grayscaleFilter, icon } = props;

  const { customChip } = renderProps;
  const customStyles = styleOverrides === undefined ? customChip : styleOverrides;

  const checkedStatus = checked ? <CheckedIcon /> : <UnCheckedIcon />;

  return (
    <StyledChip styleOverrides={customStyles}>
      <input
        type="checkbox"
        id={`${label}-${name}`}
        onChange={onChange}
        checked={checked}
        name={name}
        value={value}
      />
      <label htmlFor={`${label}-${name}`}>
        <div className={checked ? 'chip-icon active' : 'chip-icon'}>
          {icon ?? <Logo label={label} grayscaleFilter={grayscaleFilter} width={16} height={16} />}
        </div>
        <span>{label}</span>
        {!['Select All', 'Deselect All'].includes(label) && checkedStatus}
      </label>
    </StyledChip>
  );
};
export default Chip;
