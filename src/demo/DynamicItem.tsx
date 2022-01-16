import React, { useEffect, useState } from 'react'
import styles from './DynamicFunction/index.module.scss'

type TProps = {
  item: any,
}

const DynamicItem = React.memo<TProps>(({
  item,
}) => {
  const [pic, setPic] = useState<string>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    let id: any = null;
    if (item.isDeffer) {
      setPic(item.pic2);
      setWidth(item.width);
      setHeight(item.height);
    } else {
      id = setTimeout(() => {
        setPic(item.pic2)
        setWidth(item.width);
        setHeight(item.height);
        item.isDeffer = true;
      }, Math.random() * 2000)
    }
    return () => {
      clearTimeout(id)
    }
  }, [item])
  return (
    <div className={styles.item} >
      <div className={styles.info} >
        <span>{item.name}</span>
        <span>Thumb Up: {item.thumbUp}</span>
      </div>
      <div className={styles.pic} >
        <img src={item.pic} alt="" />
        <img src={pic} alt="" style={pic ? { width, height } : {}} />
      </div>
      <div className={styles.comment} >{item.comment}</div>
    </div>
  )
});


export default DynamicItem;
