import React, { useCallback, useState } from 'react'
import DynamicInfinitedScroll from '../../dynamic-infinited-scroll';
import { generateDynamicItems } from '../../mock';
import DynamicItem from '../DynamicItem';
import styles from './index.module.scss'

export default function DynamicClass() {
  const [list, setList] = useState(generateDynamicItems());
  const load = useCallback(() => {
    setList([...list, ...generateDynamicItems()]);
  }, [list]);
  return (
    <div className={styles.container} >
      <DynamicInfinitedScroll load={load} list={list} elementHeight={100} >
        {
          (item) => 
            <DynamicItem item={item} />
          
        }
      </DynamicInfinitedScroll>
    </div>
  )
}