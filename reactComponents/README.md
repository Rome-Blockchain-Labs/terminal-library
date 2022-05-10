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

### Props attribute descrption

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

### Set configuration params in .ENV (Optional)
```
REACT_APP_SEARCH_INPUT_LENGTH_MINIMUM=3
REACT_APP_SEARCH_ASYNC_DELAY=300
REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM=500
```
## After that you can pass the props as follows;
```
    // All the props are optional, you may pass or not
    <SearchBar customActions={customActions}                
    />
```

## Development IDE Envirement;
vscode-exteinsion: ``` ESLint```
``` 
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
} 
```

