// ================ DEMO TEST ===============
import * as React from 'react';
import { render } from 'react-dom';
import AvalancheIcon from './searchbar/icons/avalanche';
import BscIcon from './searchbar/icons/bsc';
import MdexIcon from './searchbar/icons/mdex';
import PangolinIcon from './searchbar/icons/pangolin';
import BiswapIcon from './searchbar/icons/biswap';
import PancakeIcon from './searchbar/icons/pancake';
import { SearchBar } from './searchbar';
import { NetworkType } from './types';
/*
const customWrapper = {
  backgroundColor: '#474F5C',      
  borderRadius: '4px',    
  border: 'none'  
}

const customSearchInput = {
  input: {
      width: '-webkit-fill-available',
      height: 'auto',
      border: 'none',
      color: 'red',
      display: 'block',
      borderRadius: '4px',
      background: 'blue',
      padding: '100px 154px',
      fontSize: '8px',
      fontFamily: "'Fira Code', monospace"
  },

  icon: {
      right: '16px',
      top: '62px'        
  },

  placeholder : 'Search pair by symbol, name, contract or token'
}

const customSearchFilter = {
  wrapper: {
      backgroundColor: '#00070E',
      borderRadius: '4px',
      toggleColor: '#B4BBC7',
      toggleHeight: '7px',
      toggleWidth: '7px',
      toggleMarginRight: '0',    
      toggleLeft: '50%',    
      toggleTop: '5px',    
      toggleBorderBottom: '2px solid currentColor', 
      toggleBorderRight: '2px solid currentColor', 
      contentBorder: 'none',        
      contentBorderRadius: '0',
      margin: '0'
  },

  network: {
      title: 'Select Network(s)',
      header: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'auto',
          border: 'none',
          backgroundColor: '#00070E',
          color: '#B4BBC7',            
          padding: '6px 14px',
          textAlign: 'left',
          margin: '4px 0',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: '500',     
          hoverColor: '#474F5C'
      },
      wrapper: {
          justifyContent: 'center',
          alignItems: 'center',
          padding:  '0 0 5px',
          backgroundColor: '#00070E',
          borderRadius: '4px'
      },
      content: {
          justifyContent: 'start',
          alignItems: 'center',
          padding:  '0 0 5px'
      },
      description: {
          textAlign: 'right',
          fontSize: '9px',
          fontWeight: '100',
          padding: '10px 10px 5px',
          backgroundColor: '#00070E',
          color: '#7A808A'
      }
  },

  exchange: {
      // it's same with network property
  }
}

const customResult = {        
  title: {
      color: '#B4BBC7',
      fontSize: '9px',      
      padding: '4px 16px',      
      margin: '0',   
      fontSize2: '7px',                     
      buttonBorderColor: '#232C38',      
      buttonBackColor: '#232C38',      
      buttonColor: '#7A808A',      
      buttonBorderRadius: '4px',      
      buttonHoverBackColor: 'black'
  },
  content: {
      padding: '14px',
      background: '#00070E',
      borderRadius: '4px',    
      width: 'auto',
      height: '300px',
      border: '1px solid grey',   
      color: '#FFF',
      display: 'block',   
      borderColor: '#474F5C',  
      borderStyle: 'solid',  
      borderWidth: '1px',  
      fontSize: '15px',  
      fontFamily: "'Fira Code', monospace'" 
  }
}

const customLoading ={
  loadingTitle: 'Searching...',
  notFoundTitle: 'No results found',
  color: 'white',
  fontSize: '12px'
}

const customChip = {
  fontSize: '8px',
  fontWeight: '500',
  borderRadius: '4px',
  backgroundColor: '#232B35',
  border: 'solid 2px #232B35', 
  padding: '7px 5px', 
  margin: '5px', 
  defaultColor: '#B4BBC7', 
  width: '122px', 
  height: 'auto', 
  textAlign: 'left',
  textTransform: 'uppercase', 
  gridTemplateColumns: '25px 85px 10px',
  justifySelf: 'end',     
  checkedBorderColor: '#474F5C',  
  checkedColor: 'white', 
  checkedBackgroundColor: '#474F5C'
}

const customAllChip = {
  fontSize: '9px',
  fontWeight: '100',
  borderRadius: '4px',
  backgroundColor:'#474F5C',
  border: '0',
  padding: '4px 10px',
  margin: '0',
  defaultColor: '#7A808A',   
  width: 'auto',
  height: 'auto',
  textAlign: 'center' ,
  textTransform: 'inherit',
  gridTemplateColumns:  '40px',
  justifySelf: 'center'
}

const customTokenDetail = {
  list: {
      container: {
          display: 'grid',
          alignItems: 'center',            
          padding: '5px 0',
          background: '#00070E',
          borderBottom: '1px solid #474F5C',
          gridTemplateColumns: '18% 1% 18% 5% 6% 37% 10%'
      },

      token: {
          color: '#B4BBC7',
          fontSize: '12px',
          fontWeight: '600'
      },

      pair: {
          color: '#B4BBC7',
          fontSize: '8px'
      },

      detail: {
          padding: '3px'
      },

      button: {
          borderColor: '#474F5C',
          backgroundColor: '#474F5C', 
          color: '#7A808A',
          borderRadius: '4px',
          fontSize: '10px',
          padding: '3px',
          hoverBackColor: '#232C38'
      }
  },
  details: {
      content: {
          display: 'block',
          alignItems: 'center',
          padding:'5px 13px',
          margin: '5px 0',
          background: '#474F5C',
          borderBottom: '1px solid #474F5C',
          borderRadius: '4px',
          fontSize: '10px',
          gridTemplateColumns: '52% 48% 1%'
      },

      token: {
          fontSize: '12px',
          fontWeight: '600'
      },

      address: {
          fontSize: '10px'
      },

      detail: {
          fontSize: '10px'
      }

  }
}
*/

const TableAction = (props: any) => {
  const handleClick = () => {
    console.log(props);
  };

  return (
    <div data-tip="Chart" onClick={handleClick}>
      <span>Table</span>
    </div>
  );
};
const ChartAction = (props: any) => {
  const handleClick = () => {
    console.log(props);
  };

  return (
    <div data-tip="Chart" onClick={handleClick}>
      <span>Chart</span>
    </div>
  );
};

const networks: NetworkType[] = [
  {
    id: 'avalanche',
    name: 'Avalanche',
    icon: <AvalancheIcon></AvalancheIcon>,
    exchanges: [
      {
        name: 'pangolin',
        icon: <PangolinIcon></PangolinIcon>,
      },
      {
        name: 'traderjoe',
      },
    ],
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    icon: <BscIcon></BscIcon>,
    exchanges: [
      {
        name: 'biswap',
        icon: <BiswapIcon></BiswapIcon>,
      },
      {
        name: 'pancakeswap',
        icon: <PancakeIcon></PancakeIcon>,
      },
      {
        name: 'mdex',
        icon: <MdexIcon></MdexIcon>,
      },
    ],
  },
];

const rootElement = document.getElementById('root');
render(
  <SearchBar
    networks={networks}
    customActions={[
      { component: TableAction, index: 1 },
      { component: ChartAction, index: 2 },
    ]}
  />,
  rootElement
);
