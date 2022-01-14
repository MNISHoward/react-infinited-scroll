import React, { useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import ResizeObserver from 'resize-observer-polyfill';

type TProps = {
  children: React.ReactElement,
  style: any,
  sizeChange: () => void;
  index: number
}

const WrappedItem = React.memo<TProps>(({
  children,
  style,
  sizeChange,
  index
}) => {
  const resizeObserver = useRef<ResizeObserver>(new ResizeObserver((entries, observer) => {
    sizeChange();
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

  return <div style={style} data-index={index} ref={resizedContainerRef} className={styles.wrapItem} >{children}</div>;
});

export default WrappedItem;