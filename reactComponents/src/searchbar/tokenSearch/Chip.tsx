import React, { useContext, FC } from "react";
import styled from "styled-components";
import TokenSearchContext from "../Context/TokenSearch";
import NetworkExchangeIcon from "./NetworkExchangeIcon";
import CheckedIcon from "../icons/checked";
import UnCheckedIcon from "../icons/unchecked";

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

      font-size: ${styleOverrides?.fontSize || "0.75rem"};  
      font-weight: ${styleOverrides?.fontWeight || "500"};  
      border-radius: ${styleOverrides?.borderRadius || "4px"};  
      background-color: ${styleOverrides?.backgroundColor || "#232B35"};  
      border: ${styleOverrides?.border || "solid 2px #232B35"};   
      padding: ${styleOverrides?.padding || "2px 5px"};   
      margin: ${styleOverrides?.margin || "5px"};   
      color: ${styleOverrides?.defaultColor || "#B4BBC7"};   
      min-width: ${styleOverrides?.width || "115px"};   
      height: ${styleOverrides?.height || "35px"};   
      text-align: ${styleOverrides?.textAlign || "left"}; 
      text-transform: ${styleOverrides?.textTransform || "uppercase"}; 
      grid-template-columns: ${
        styleOverrides?.gridTemplateColumns ||
        "minmax(20px, auto) auto minmax(20px, auto)"
      };
      >:last-child {      
        justify-self: ${styleOverrides?.justifySelf || "end"}; 
      }

      &:hover {
        background-color: ${
          styleOverrides?.checkedBackgroundColor || "#474F5C"
        };
        border: ${styleOverrides?.border || "solid 2px #474F5C"};        
      }
    }
    
    > input:checked + label {   
      ::-webkit-transition: all 500ms ease;
      transition: all 500ms ease;   
      border-color: ${styleOverrides?.checkedBorderColor || "#474F5C"};    
      color: ${styleOverrides?.checkedColor || "white"};   
      background-color: ${
        styleOverrides?.checkedBackgroundColor || "#474F5C"
      };   
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

  const {
    label,
    checked,
    onChange,
    name,
    value,
    styleOverrides,
    grayscaleFilter,
    icon,
  } = props;

  const { customChip } = renderProps;
  const customStyles =
    styleOverrides === undefined ? customChip : styleOverrides;

  const checkedStatus = checked ? (
    <CheckedIcon width={12} height={12} />
  ) : (
    <UnCheckedIcon width={10} height={10} />
  );

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
        <div className={checked ? "chip-icon active" : "chip-icon"}>
          <NetworkExchangeIcon
            icon={icon}
            label={label}
            size={16}
            grayscaleFilter={grayscaleFilter}
            active={checked}
          />
        </div>
        <span>{label}</span>
        {!["Select All", "Deselect All"].includes(label) && checkedStatus}
      </label>
    </StyledChip>
  );
};
export default Chip;
