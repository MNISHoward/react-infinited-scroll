import React, { useCallback, useState } from 'react'
import FixInfinitedScroll from '../../fix-infinited-scroll';
import { generateItems } from '../../mock';
import Item from '../Item';
import styles from './index.module.scss'

type TProps = {}

const FixClass = React.memo<TProps>(() => {
  const [list, setList] = useState(generateItems());
  const load = useCallback(() => {
    setList([...list, ...generateItems()]);
  }, [list]);
  return (
    <div className={styles.container} >
      <FixInfinitedScroll load={load} list={list} >
        {
          (item, ref) => 
            <Item ref={ref} item={item} style={{}} />
          
        }
      </FixInfinitedScroll>
    </div>
  )
});


export default FixClass;