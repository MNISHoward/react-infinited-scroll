import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import styles from './index.module.scss'
import ResizeObserver from 'resize-observer-polyfill';

type TProps = {
  children: React.ReactElement,
  style: any,
  index: number,
  ref: any,
  idx: number,
  ob: ResizeObserver
}

const WrappedItem = React.memo<TProps>(forwardRef(({
  children,
  style,
  index,
  idx,
  ob
}, ref: any) => {
  const myRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref[idx] = { dom: myRef.current, index };
  }, [ref, idx, index]);
  useLayoutEffect(() => {
    ob.observe(myRef.current!);
    const ref = myRef.current!;
    return () => {
      ob.unobserve(ref);
    }
  }, [ob]);

  return <div style={style} data-index={index} ref={myRef} className={styles.wrapItem} >{children}</div>;
}));

export default WrappedItem;