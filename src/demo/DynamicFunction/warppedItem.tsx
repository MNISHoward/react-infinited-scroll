import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import styles from './index.module.scss'
import ResizeObserver from 'resize-observer-polyfill';

type TProps = {
  children: React.ReactElement,
  style: any,
  idx: number,
  sizeChange: (idx: number, height: number) => void;
}

const WrappedItem = React.memo<TProps>(({
  children,
  style,
  idx,
  sizeChange
}) => {
  const idxRef = useRef<number>(idx);
  const resizeObserver = useRef<ResizeObserver>(new ResizeObserver((entries, observer) => {
    const contentRect = entries[0].contentRect;
    sizeChange(idxRef.current, contentRect.height);
  }));
  const resizedContainerRef = useCallback((container: HTMLDivElement) => {
      if (container !== null) {
        resizeObserver.current.observe(container);
      }
      else {
        if (resizeObserver.current)
            resizeObserver.current.disconnect();
      }
  }, []);
  useEffect(() => {
    const ref = resizeObserver.current;
    return () => {
      if (ref)
        ref.disconnect();
    }
  }, []);
  useLayoutEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  return <div style={style} ref={resizedContainerRef} className={styles.wrapItem} >{children}</div>;
});

export default WrappedItem;