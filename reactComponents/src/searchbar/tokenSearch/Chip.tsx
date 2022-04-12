import React, { memo, useContext } from 'react';
import styled from 'styled-components';
import TokenSearchContext from '../Context/TokenSearch';

const StyledChip = styled.div`
  > input {
    display: none;
  }

  > input + label {
    -webkit-transition: all 500ms ease;
    transition: all 500ms ease;
    font-size: ${ props => props?.styles?.fontSize || "14px" };  
    cursor: pointer;
    border-radius: ${ props => props?.styles?.borderRadius || "5px" };  
    background-color: ${ props => props?.styles?.backgroundColor || "#FFF" };  
    border: ${ props => props?.styles?.border || "solid 2px #7d7d7d" };   
    padding: ${ props => props?.styles?.padding || "0.1rem 0.3rem" };   
    display: inline-block;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin: ${ props => props?.styles?.margin || "5px" };   
  }

  > input:checked + label {
    -webkit-transition: all 500ms ease;
    transition: all 500ms ease;    
    border-color: ${ props => props?.styles?.checkedColor || "#666699" };    
    color: ${ props => props?.styles?.checkedColor || "white" };   
    background-color: ${ props => props?.styles?.checkedBackgroundColor || "#666699" };  
  }
`;


export const Chip = memo(
  (props: any) => {
    const renderProps = useContext(TokenSearchContext);  
    const {label, checked, onChange, name, value} = props
    const { customChip } = renderProps
    return (
      <StyledChip styles={customChip?.styles}
      >
        <input type="checkbox" id={`${label}-${name}`} onChange={onChange} checked={checked} name={name} value={value} />
        <label htmlFor={`${label}-${name}`}>{label} </label>
      </StyledChip>
    );
  }
);
export default Chip;