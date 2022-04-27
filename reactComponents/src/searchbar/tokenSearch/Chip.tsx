import React, { useContext, FC } from 'react';
import styled from 'styled-components';
import TokenSearchContext from '../Context/TokenSearch';

import { Logo } from './Logo'
import CheckedIcon from '../icons/checked'
import UnCheckedIcon from '../icons/unchecked';

const StyledChip = styled.div`
    ${({ styles }) => `
        > input {
          display: none;
        }

        > input + label {
          -webkit-transition: all 500ms ease;
          transition: all 500ms ease;    
          cursor: pointer;    
          display: grid;
          align-items: center;
              
          -moz-user-select: -moz-none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
    
          font-size: ${styles?.fontSize || "8px"};  
          font-weight: ${styles?.fontWeight || "500"};  
          border-radius: ${styles?.borderRadius || "4px"};  
          background-color: ${styles?.backgroundColor || "#232B35"};  
          border: ${styles?.border || "solid 2px #232B35"};   
          padding: ${styles?.padding || "2px 5px"};   
          margin: ${styles?.margin || "5px"};   
          color: ${styles?.defaultColor || "#B4BBC7"};   
          width: ${styles?.width || "108px"};   
          height: ${styles?.height || "auto"};   
          text-align: ${styles?.textAlign || "left"}; 
          text-transform: ${styles?.textTransform || "uppercase"}; 
          grid-template-columns: ${styles?.gridTemplateColumns || "20px 75px 10px"}; 
          >:last-child {      
            justify-self: ${styles?.justifySelf || "end"}; 
          }
        }
        
        > input:checked + label {   
          -webkit-transition: all 500ms ease;
          transition: all 500ms ease;   
          border-color: ${styles?.checkedBorderColor || "#474F5C"};    
          color: ${styles?.checkedColor || "white"};   
          background-color: ${styles?.checkedBackgroundColor || "#474F5C"};   
        }    
    `}   
`;

export const Chip: FC<any> = (props) => {
  const renderProps = useContext(TokenSearchContext);
  
  const { label, checked, onChange, name, value, styles, filter } = props
  
  const { customChip } = renderProps
  const customStyles = styles === undefined ? customChip?.styles : styles
  
  const checkedStatus = checked ? <CheckedIcon /> : <UnCheckedIcon />

  return (
    <StyledChip styles={customStyles} 
    >      
      <input type="checkbox" id={`${label}-${name}`} onChange={onChange} checked={checked} name={name} value={value} />
      <label htmlFor={`${label}-${name}`}>
        <Logo label={label} filter={filter} width={16} height={16}/>
        <span>{label}</span>
        {label !== 'Select All' && checkedStatus}
      </label>
    </StyledChip>
  );
}
export default Chip;