import React, { forwardRef, useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import ResizeObserver from 'resize-observer-polyfill';

type TProps = {
  children: React.ReactElement,
  style: any,
  sizeChange: () => void;
  index: number,
  ref: any,
  idx: number
}

const WrappedItem = React.memo<TProps>(forwardRef(({
  children,
  style,
  sizeChange,
  index,
  idx
}, ref: any) => {
  const resizeObserver = useRef<ResizeObserver>(
    new ResizeObserver((entries, observer) => {
      sizeChange();
    })
  );
  const myRef = useRef<HTMLDivElement>();
  const resizedContainerRef = useCallback((container: HTMLDivElement) => {
    ref[idx] = { dom: container, index };
    myRef.current = container;
  }, [ref, idx, index]);
  useEffect(() => {
    const ref = resizeObserver.current;
    resizeObserver.current.observe(myRef.current!);
    return () => {
      if (ref)
        ref.disconnect();
    }
  }, []);

  return <div style={style} data-index={index} ref={resizedContainerRef} className={styles.wrapItem} >{children}</div>;
}));

export default WrappedItem;