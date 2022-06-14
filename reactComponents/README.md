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
  - [Props](#props)
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

## Props

`customActions`

| Type | Default value |
| --- | --- |
| array, null | null |

Example:
```tsx
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


## Authors

## License
[MIT License](https://andreasonny.mit-license.org/2019) © Rome Blockchain Labs
