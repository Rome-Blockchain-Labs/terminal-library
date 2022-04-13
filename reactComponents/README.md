# Search Bar Token Pair Centric Widget
## npm install
```
 npm i @romeblockchain/react-components
```
## How to use the search bar component
```
import { SearchBar } from '@romeblockchain/react-components';

<div>
    <SearchBar />    
</div>
```

### SearchBar Props Options
 - customSearchInput      // JSON format for input style
 - customSearchFilter     // JSON format for filter wrapper
 - customChip             // JSON format for network and change filter style
 - customLoading          // JSON format for lading style
 - customResult           // JSON format for result wrapper 
 - customTokenDetail      // JSON format for token detail style
 - customActions          // Component List

### Props attribute descrption
```
const customSearchInput = {
    styles: {
        width: "-webkit-fill-available",
        border: "none",
        color: "#FFF",
        display: "block",
        borderColor: "#067c82",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "0",
        background: "#08333c",
        padding: "11px 15px",
        fontSize: "15px",
        fontFamily: "'Fira Code', monospace"
    },
    placeholder: "You can search by token pairs here."
}


const customSearchFilter = {
    title: "You can filter",
    description: (c1, c2) => {
        return `Awesome! ${c1} networks and ${c2} exchanges`
    },    
    styles: {
        wrapper: {
            toogleHeight: "10px",
            toggleWidth: "10px",
            toggleMarginRight: "25px",
            toggleTop: "20px",
            toggleBorderBottom: "2px solid currentColor",
            toggleBorderRight: "2px solid currentColor",
            contentBorder: "0",
            contentBorderTop: "none",
            contentBorderRight: "none",
            contentBorderBottom: "none",
            contentBorderLeft: "none",
            borderRadius: "0",
            margin: "0 10px"
        },
        header: {
            display: "inline",
            width: "auto",
            border: "none",
            backgroundColor: "#f4f4f4", 
            color: "#444",
            display: "block",         
            padding: "18px",   
            textAlign: "left",     
            margin: "5px",     
            borderRadius: "0",     
            hoverColor: "#ddd"
        },
        network: {
            justifyContent: "center",
            alignItems: "center",
            padding:  "5px 10px",
            backgroundColor: "#ddd",
            borderRadius: "0"
        },
        exchange: {
            justifyContent: "center",
            alignItems: "center",
            padding:  "5px 10px",
            backgroundColor: "#ddd",
            borderRadius: "0"
        }
    }
}

const customChip = {
    styles: {
        fontSize: "14px",    
        borderRadius: "5px",
        backgroundColor: "#FFF",
        border: "solid 2px #7d7d7d",
        padding: "0.1rem 0.3rem",       
        margin:"5px",   
        defaultColor: "white",
        checkedColor: "#666699",
        checkedBackgroundColor: "black"
  }
}

const customLoading = {
    styles: {
        color: "black",
        fontSize: "15px"
    }
}

const customResult = {
    styles: {
        width: "auto",
        height: "300px",
        border: "1px solid grey",
        color: "#FFF",
        display: "block",
        border-color: "#067c82",
        border-style: "solid",
        border-width: "1px",
        border-radius: "0",
        background: "#08333c",
        padding: "0",
        font-size: "15px",
        font-family: "'Fira Code', monospace"
    }
}

const customTokenDetail = {
    styles: {
        header: {
            padding: "10px",
            color: "black",
            background: "green"
        },
        panel: {
            padding: "10px",
            color: "black",
            background: "white"
        }
    }
}
```


```
// customActions is the array list which has the index and component
const customActions = [
    {
        index: 1,
        component: actionComponent1
    },
    {    
        index: 2,
        component: actionComponent2   
    },
    {   
        index: 3,
        component: actionComponent3
    },
    ...
]

// You can refer the detail for the token pair information from the prop
const actionComponent1 = (props) => {  
  const {detail} = props
  const handleClick = () => {
    console.log('Exchange: ', detail)
  }
  return (
    <div onClick={handleClick}>Exchange</div>
  )
}
```

## After that you can pass the props as follows;
```
    // All the props are optional, you may pass or not
    <SearchBar
        customSearchInput={customSearchInput}
        customSearchFilter={customSearchFilter}
        customChip={customChip}
        customResult={customResult}
        customTokenDetail={customTokenDetail}
        customLoading={customLoading}
        customActions={customActions}
    />
```
