<h1>React Infinited Scroll</h1>

<p>Infinited Scroll Container for React Frame.</p>

<h2>Install</h2>
<br/>
<pre>
npm install react-infinited-scroll
or
yarn add react-infinited-scroll
</pre>

<h2>Usage</h2>
<br/>

### **Static Height Element**

> **If the ight of element inside of scrolling container is static, Please use FixInfinitedScroll**

```js
import React, { useCallback, useState } from 'react';
import FixInfinitedScroll from '../../fix-infinited-scroll';
import { generateItems } from '../../mock';
import Item from '../Item';
import styles from './index.module.scss';

type TProps = {};

const FixClass =
  React.memo <
  TProps >
  (() => {
    const [list, setList] = useState(generateItems());
    const load = useCallback(() => {
      setList([...list, ...generateItems()]);
    }, [list]);
    return (
      <div className={styles.container}>
        <FixInfinitedScroll load={load} list={list}>
          {(item, ref) => <Item ref={ref} item={item} />}
        </FixInfinitedScroll>
      </div>
    );
  });

export default FixClass;
```

### **Dynamic Height Element**

> **If the height of element inside of scrolling container only render by displaying, Please use 'DynamicInfinitedScroll'**

```js
import React, { useCallback, useState } from 'react';
import DynamicInfinitedScroll from '../../dynamic-infinited-scroll';
import { generateDynamicItems } from '../../mock';
import DynamicItem from '../DynamicItem';
import styles from './index.module.scss';

export default function DynamicClass() {
  const [list, setList] = useState(generateDynamicItems());
  const load = useCallback(() => {
    setList([...list, ...generateDynamicItems()]);
  }, [list]);
  return (
    <div className={styles.container}>
      <DynamicInfinitedScroll load={load} list={list} elementHeight={100}>
        {(item) => <DynamicItem item={item} />}
      </DynamicInfinitedScroll>
    </div>
  );
}
```

<h2>API</h2>
<br />

### **load**

> When scroll to the bottom of container, it will fire the load callback, should load and change list.  
> **Callback of type: () => void;**

<br />

### **list**

> rendering list.  
> **List type: any[]**

<br />

### **elementHeight**

> neccessary property for estimating height, it must be set to 'DynamicInfinitedScroll'  
> **element height type: number**
