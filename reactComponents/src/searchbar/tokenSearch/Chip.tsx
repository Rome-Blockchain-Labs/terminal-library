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
    cursor: pointer;    
    display: inline-block;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ${
      ({props}) => `
        font-size: ${ props?.styles?.fontSize || "14px" };  
        border-radius: ${ props?.styles?.borderRadius || "5px" };  
        background-color: ${ props?.styles?.backgroundColor || "#FFF" };  
        border: ${ props?.styles?.border || "solid 2px #7d7d7d" };   
        padding: ${ props?.styles?.padding || "0.1rem 0.3rem" };   
        margin: ${ props?.styles?.margin || "5px" };   
        color: ${ props?.styles?.defaultColor || "black" };   
        width: ${ props?.styles?.width || "100px" };   
        height: ${ props?.styles?.height || "auto" };   
        text-align: ${ props?.styles?.textAlign || "center" }; 
      `
    }      
  }

  > input:checked + label {
    -webkit-transition: all 500ms ease;
    transition: all 500ms ease;   
    ${
      ({props}) => `
        border-color: ${ props?.styles?.checkedColor || "#666699" };    
        color: ${ props?.styles?.checkedColor || "white" };   
        background-color: ${ props?.styles?.checkedBackgroundColor || "gray" };  
      `
    }     
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