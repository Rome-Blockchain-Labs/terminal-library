import React, { memo } from 'react';
import './style.css';


export const Chip = memo(
  (props) => {
    const {label, checked, onChange, name, value} = props
    return (
      <>
        <input type="checkbox" id={`${label}-${name}`} onChange={onChange} checked={checked} name={name} value={value}/>
        <label htmlFor={`${label}-${name}`}>{label} </label>
      </>
    );
  }
);
export default Chip;