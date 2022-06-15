# Search Bar Token Pair Centric Widget

> A react component which fetches token pairs and shows information from various network and its exchanges

## Prerequisites

This project requires NodeJS (version 16.13 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
16.13.1
v8.1.2
```
## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Launching the app on development mode](#launching-the-app-on-development-mode)
    - [Building a distribution version](#building-a-distribution-version)
    - [Publishing package into npm repositories](#publishing-package-into-npm-repositories)
    - [How to use the search bar component](#how-to-use-the-search-bar-component)
  - [API](#api)
  - [Authors](#authors)
  - [License](#license)

## Getting Started
 
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See notes on how to publish and deploy the project on a live system.
 
 
## Installation
```sh
$ npm i @romeblockchain/react-components
```
Or if you prefer using Yarn:

```shell script
$ yarn add @romeblockchain/react-components
```

## Usage
### Launching the app on development mode
```shell script
$ git clone https://github.com/Rome-Blockchain-Labs/terminal-library.git
$ cd terminal-library
$ npm run dev
```

### Building a distribution version
```sh
$ npm run build
```
This task will create a distribution version of the project
inside your local `dist/` folder

### Publishing package into npm repositories
Before npm publish, it requires that you already logged into npm repository.
```shell script
$ npm login
$ Username: 
$ Password:
$ Email: (this IS public)
``` 
After logging into npm repository, make sure that you update the version in `package.json`. You can publish different version into npm so that update higher version than current.
```shell script
$ npm run publish
```

### How to use the search bar component
```
import { SearchBar } from '@romeblockchain/react-components';

<div>
    <SearchBar {...props} />    
</div>
```

## API

### Types
- `NetworkId`
```tsx
NetworkId = 'ethereum' | 'avalanche' | 'bsc' | 'moonriver' | 'moonbeam'
```

- `ExchangeName`
```tsx
ExchangeName =
  | 'uniswapv2'
  | 'uniswapv3'
  | 'sushiswap'
  | 'pangolin'
  | 'traderjoe'
  | 'pancakeswap'
  | 'safeswap'
  | 'kyberdmm'
  | 'zeroexchange'
  | 'yetiswap'
  | 'baguette'
  | 'canary'
  | 'lydiafinance'
  | 'elkfinance'
  | 'pandaswap'
  | 'complusnetwork'
  | 'oliveswap'
  | 'mdex'
  | 'ellipsis.finance'
  | 'biswap'
  | 'apeswap'
  | 'knightswap.finance'
  | 'babyswap'
  | 'synapse'
  | 'beamswap'
  | 'solarflare'
  | 'stellaswap'
  | 'zenlink'
  | 'solarbeam'
  | 'shibaswap'
  | 'quickswap'
  | 'solidex'
  | 'spookyswap'
  | 'spiritswap'
  | 'vvs.finance'
  | 'mm.finance'
  | 'cronaswap'
  | 'crodex'
  | 'cyborgswap';
```

- `NetworkType`
```tsx
NetworkType = {
  id: NetworkId;
  name?: string;
  icon?: ReactNode;
  exchanges: ExchangeType[];
}
```

- `ExchangeType`
```tsx
ExchangeType = {
  name: ExchangeName;
  icon?: ReactNode;
}
```

- `CustomWrapperType`
```tsx
CustomWrapperType = {
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  button?: {
    borderColor?: string;
    backColor?: string;
    color?: string;
    borderRadius?: string;
    fontSize?: string;
    padding?: string;
    hoverBackColor?: string;
  };
}
```

- `CustomSearchInputType`
```tsx
CustomSearchInputType = {
  input?: {
    width?: string;
    height?: string;
    border?: string;
    color?: string;
    display?: string;
    borderRadius?: string;
    background?: string;
    padding?: string;
    fontSize?: string;
    fontFamily?: string;
  };

  icon?: {
    right?: string;
    top?: string;
    height?: number;
    width?: number;
    color?: string;
    activeColor?: string;
  };

  placeholder?: string;
}
```

- `CustomSearchFilterType`
```tsx
CustomSearchFilterType = {
  wrapper?: {
    backgroundColor?: string;
    borderRadius?: string;
    toggleColor?: string;
    toggleHeight?: string;
    toggleWidth?: string;
    toggleMarginRight?: string;
    toggleLeft?: string;
    toggleTop?: string;
    toggleBorderBottom?: string;
    toggleBorderRight?: string;
    contentBorder?: string;
    contentBorderRadius?: string;
    margin?: string;
  };

  content?: {
    network?: string;
    exchange?: string;
    header?: {
      display?: string;
      justifyContent?: string;
      alignItems?: string;
      width?: string;
      border?: string;
      backgroundColor?: string;
      color?: string;
      padding?: string;
      textAlign?: string;
      margin?: string;
      borderRadius?: string;
      fontSize?: string;
      fontWeight?: string;
      hoverColor?: string;
    };
    wrapper?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
      backgroundColor?: string;
      borderRadius?: string;
    };
    content?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
    };
    description?: {
      textAlign?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
      backgroundColor?: string;
      color?: string;
    };
  };
}
```

- `CustomResultType`
```tsx
CustomResultType = {
  title?: {
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    fontSize2?: string;
  };
  content?: {
    padding?: string;
    background?: string;
    borderRadius?: string;
    width?: string;
    height?: string;
    border?: string;
    color?: string;
    display?: string;
    borderColor?: string;
    borderStyle?: string;
    borderWidth?: string;
    fontSize?: string;
    fontFamily?: string;
  };
}
```

- `CustomSearchFilterType`
```tsx
CustomSearchFilterType = {
  wrapper?: {
    backgroundColor?: string;
    borderRadius?: string;
    toggleColor?: string;
    toggleHeight?: string;
    toggleWidth?: string;
    toggleMarginRight?: string;
    toggleLeft?: string;
    toggleTop?: string;
    toggleBorderBottom?: string;
    toggleBorderRight?: string;
    contentBorder?: string;
    contentBorderRadius?: string;
    margin?: string;
  };

  content?: {
    network?: string;
    exchange?: string;
    header?: {
      display?: string;
      justifyContent?: string;
      alignItems?: string;
      width?: string;
      border?: string;
      backgroundColor?: string;
      color?: string;
      padding?: string;
      textAlign?: string;
      margin?: string;
      borderRadius?: string;
      fontSize?: string;
      fontWeight?: string;
      hoverColor?: string;
    };
    wrapper?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
      backgroundColor?: string;
      borderRadius?: string;
    };
    content?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
    };
    description?: {
      textAlign?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
      backgroundColor?: string;
      color?: string;
    };
  };
}
```

- `ActionComponentType`
```tsx
ActionComponentType = {
    detail: CustomSearchFilterType
};
```

- `ActionType`
```tsx
ActionType = {
    component?: FC<ActionComponentType>,
    detail?: TokenPair
}
```

### Props
- `customWrapper`

| Type | Default value |
| --- | --- |
| CustomWrapperType | null |

Example:
```tsx

```

- `customSearchInput`

| Type | Default value |
| --- | --- |
| CustomSearchInputType | null |

Example:
```tsx

```

- `customSearchFilter`

| Type | Default value |
| --- | --- |
| CustomSearchFilterType | null |

Example:
```tsx

```

- `customChip`

| Type | Default value |
| --- | --- |
| CustomChipType | null |

Example:
```tsx

```

- `customResult`

| Type | Default value |
| --- | --- |
| CustomResultType | null |

Example:
```tsx

```

- `customTokenDetail`

| Type | Default value |
| --- | --- |
| CustomTokenDetailType | null |

Example:
```tsx

```

- `customLoading`

| Type | Default value |
| --- | --- |
| CustomLoadingType | null |

Example:
```tsx

```

- `customActions`

| Type | Default value |
| --- | --- |
| Array<ActionType> | null |

Example:
```tsx
// customActions is the array list which has the index and component
const customActions = [
    actionComponent1
    actionComponent2   
    actionComponent3    
    ...
]

// You can refer the detail for the token pair information from the prop
const actionComponent1 = (props: ActionType) => {  
  const { detail } = props
  const handleClick = () => {
    console.log('Exchange: ', detail)
  }
  return (
    <div onClick={handleClick}>Exchange</div>
  )
}
```


- `networks`

| Type | Default value |
| --- | --- |
| Array<NetworkType> | null |

Example:
```tsx

```


## Authors

## License
[MIT License](https://andreasonny.mit-license.org/2019) © Rome Blockchain Labs
