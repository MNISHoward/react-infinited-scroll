import React, { forwardRef } from 'react'
import styles from './FixFunction/index.module.scss'

type TProps = {
  item: any,
  ref: any
}

const Item = React.memo<TProps>(forwardRef(({
  item,
}, ref: any) => {
  return (
    <div ref={ref} className={styles.item} >
      <div className={styles.info} >
        <span>{item.name}</span>
        <span>Thumb Up: {item.thumbUp}</span>
      </div>
      <div className={styles.pic} >
        <img src={item.pic} alt="" />
      </div>
      <div className={styles.comment} >{item.comment}</div>
    </div>
  )
}));


export default Item;
