import { FC } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

export {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
};

type CustomWrapperType = {
  backgroundColor: string | undefined,
  borderRadius: string | undefined,    
  border: string | undefined,
  button: {
      borderColor: string | undefined,
      backColor: string | undefined,
      color: string | undefined,
      borderRadius: string | undefined,
      fontSize: string | undefined,
      padding: string | undefined,
      hoverBackColor: string | undefined
  } | undefined
}

type CustomSerchInputType = {
  input: {
      width: string | undefined,
      height: string | undefined,
      border: string | undefined,
      color: string | undefined,
      display: string | undefined,
      borderRadius: string | undefined,
      background: string | undefined,
      padding: string | undefined,
      fontSize: string | undefined,
      fontFamily: string | undefined
  } | undefined,

  icon: {
      right: string | undefined,
      top: string | undefined,
      height: number | undefined,
      width: number | undefined,
      color: string | undefined,
      activeColor: string | undefined
  } | undefined,

  placeholder : string | undefined
}

type CustomSearchFilterType = {  
    wrapper: {
        backgroundColor: string | undefined,
        borderRadius: string | undefined,
        toggleColor: string | undefined,
        toggleHeight: string | undefined,
        toggleWidth: string | undefined,
        toggleMarginRight: string | undefined,    
        toggleLeft: string | undefined,    
        toggleTop: string | undefined,    
        toggleBorderBottom: string | undefined, 
        toggleBorderRight: string | undefined, 
        contentBorder: string | undefined,        
        contentBorderRadius: string | undefined,
        margin: string | undefined
    } | undefined,

    fitler: {
        network: string | undefined,
        exchange: string | undefined,
        header: {
            display: string | undefined,
            justifyContent: string | undefined,
            alignItems: string | undefined,
            width: string | undefined,
            border: string | undefined,
            backgroundColor: string | undefined,
            color: string | undefined,            
            padding: string | undefined,
            textAlign: string | undefined,
            margin: string | undefined,
            borderRadius: string | undefined,
            fontSize: string | undefined,
            fontWeight: string | undefined,     
            hoverColor: string | undefined
        } | undefined,
        wrapper: {
            justifyContent: string | undefined,
            alignItems: string | undefined,
            padding: string | undefined,
            backgroundColor: string | undefined,
            borderRadius: string | undefined
        } | undefined,
        content: {
            justifyContent: string | undefined,
            alignItems: string | undefined,
            padding:  string | undefined
        } | undefined,
        description: {
            textAlign: string | undefined,
            fontSize: string | undefined,
            fontWeight: string | undefined,
            padding: string | undefined,
            backgroundColor: string | undefined,
            color: string | undefined
        } | undefined
    }
}

type CustomResultType = {        
  title: {
      color: string | undefined,
      fontSize: string | undefined,      
      padding: string | undefined,
      margin: string | undefined,   
      fontSize2: string | undefined,
  } | undefined,
  content: {
      padding: string | undefined,
      background: string | undefined,
      borderRadius: string | undefined,    
      width: string | undefined,
      height: string | undefined,
      border: string | undefined,   
      color: string | undefined,
      display: string | undefined,   
      borderColor: string | undefined,  
      borderStyle: string | undefined,  
      borderWidth: string | undefined,  
      fontSize: string | undefined,  
      fontFamily: string | undefined
  } | undefined
}

type CustomLoadingType ={
  loadingTitle: string | undefined,
  notFoundTitle: string | undefined,
  color: string | undefined,
  fontSize: string | undefined
}

type CustomChipType = {
  fontSize: string | undefined,
  fontWeight: string | undefined,
  borderRadius: string | undefined,
  backgroundColor: string | undefined,
  border: string | undefined, 
  padding: string | undefined, 
  margin: string | undefined, 
  defaultColor: string | undefined, 
  width: string | undefined, 
  height: string | undefined, 
  textAlign: string | undefined,
  textTransform: string | undefined, 
  gridTemplateColumns: string | undefined,
  justifySelf: string | undefined,     
  checkedBorderColor: string | undefined,  
  checkedColor: string | undefined, 
  checkedBackgroundColor: string | undefined
}

type CustomAllChipType = {
  fontSize: string | undefined,
  fontWeight: string | undefined,
  borderRadius: string | undefined,
  backgroundColor: string | undefined,
  border: string | undefined,
  padding: string | undefined,
  margin: string | undefined,
  defaultColor: string | undefined,
  width: string | undefined,
  height: string | undefined,
  textAlign: string | undefined,
  textTransform: string | undefined,
  gridTemplateColumns:  string | undefined,
  justifySelf: string | undefined
}

type CustomTokenDetailType = {
  list: {
      container: {
          display: string | undefined,
          alignItems: string | undefined,
          padding: string | undefined,
          background: string | undefined,
          borderBottom: string | undefined,
          gridTemplateColumns: string | undefined
      } | undefined,

      token: {
          color: string | undefined,
          fontSize: string | undefined,
          fontWeight: string | undefined,
          padding: string | undefined,
      } | undefined,

      pair: {
          color: string | undefined,
          fontSize: string | undefined
      } | undefined,

      detail: {
          padding: string | undefined
      } | undefined
  } | undefined,
  details: {
      content: {
          display: string | undefined,
          alignItems: string | undefined,
          padding: string | undefined,
          margin: string | undefined,
          background: string | undefined,
          borderBottom: string | undefined,
          borderRadius: string | undefined,
          fontSize: string | undefined,
          gridTemplateColumns: string | undefined
      } | undefined,

      token: {
          fontSize: string | undefined,
          fontWeight: string | undefined
      } | undefined,

      address: {
          fontSize: string | undefined
      } | undefined,

      detail: {
          fontSize: string | undefined
      } | undefined
  } | undefined
}

type ActionComponentType = {
  index: number,
  component: FC
}
 
export type RenderProps = {
  customWrapper?: CustomWrapperType;
  customSearchInput?: CustomSerchInputType;
  customSearchFilter?: CustomSearchFilterType;
  customChip?: CustomChipType;
  customResult?: CustomResultType;
  customTokenDetail?: CustomTokenDetailType;
  customLoading?: CustomLoadingType;
  customActions?: Array<ActionComponentType>;
  customAllChip?: CustomAllChipType;
};