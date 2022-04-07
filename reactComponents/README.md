### npm install dependency in package.json

```

    "@romeblockchain/terminal-library": "git+https://github.com/Rome-Blockchain-Labs/terminal-library.git#8dda04858acb1c45437325857eff56c60afca5ee"
```

### import and use the react react component

import {HelloWorldComponent} from "@romeblockchain/terminal-library/reactComponents/dist"

```
<div>
    <HelloWorldComponent/>
</div>
```

### Publishing Instructions

1. Go to `react-virtuazlied/dist/es/WindowScroller/utils/onScroll.js`
2. Delete the last line `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
3. `npm run publish`
