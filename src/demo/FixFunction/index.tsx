import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { generateItems } from '../../mock';
import { outerHeight } from '../../utils';
import Item from '../Item';
import styles from './index.module.scss';


let ELEMENT_HEIGHT = 0;
let VISIBLE_COUNT = 0;
const BUFFER_SIZE = 3;

function FixFunction() {
  const [list, setList] = useState(generateItems());
  const [firstItem, setFirstItem] = useState(0);
  const [lastItem, setLastItem] = useState(0);
  const [visibleList, setVisibleList] = useState<typeof list>(list);
  const [scrollHeight, setScrollHeight] = useState(0);
  const itemRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const anchorItem = useRef({ index: 0, offset: 0 })

  const updateAnchorItem = useCallback(
    (container) => {
      const index = Math.floor(container.scrollTop / ELEMENT_HEIGHT);
      const offset = container.scrollTop - ELEMENT_HEIGHT * index;
      anchorItem.current = {
        index,
        offset
      }
    },
    [],
  )

  const scroll = useCallback(
    (event) => {
      const container = event.target;
      const delta = container.scrollTop - lastScrollTop.current;
      lastScrollTop.current = container.scrollTop;
      const isPositive = delta >= 0;
      anchorItem.current.offset += delta;
      let tempFirst = firstItem;
      if (isPositive) {
        if (anchorItem.current.offset >= ELEMENT_HEIGHT) {
          updateAnchorItem(container);
        }
        if (anchorItem.current.index - tempFirst >= BUFFER_SIZE) {
          tempFirst = Math.min(list.length - VISIBLE_COUNT, anchorItem.current.index - BUFFER_SIZE)
          setFirstItem(tempFirst);
        }
      } else {
        if (container.scrollTop <= 0) {
          anchorItem.current = { index:0, offset: 0 };
        } else if (anchorItem.current.offset < 0) {
          updateAnchorItem(container);
        }
        if (anchorItem.current.index - firstItem < BUFFER_SIZE) {
          tempFirst = Math.max(0, anchorItem.current.index - BUFFER_SIZE)
          setFirstItem(tempFirst);
        }
      }
      setLastItem(Math.min(tempFirst + VISIBLE_COUNT + BUFFER_SIZE * 2, list.length));
      if (container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10) {
        setList([...list, ...generateItems()]);
      }
    },
    [list, updateAnchorItem, firstItem],
  )
  useLayoutEffect(() => {
    ELEMENT_HEIGHT = outerHeight(itemRef.current);
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    VISIBLE_COUNT = Math.ceil(containerHeight / ELEMENT_HEIGHT);
    setLastItem(VISIBLE_COUNT + BUFFER_SIZE);
  }, [])
  useLayoutEffect(() => {
    setVisibleList(list.slice(firstItem, lastItem));
    setScrollHeight(list.length * ELEMENT_HEIGHT);
  }, [list, firstItem, lastItem]);
  useLayoutEffect(() => {
    list.forEach((item, idx) => {
      item.scrollY = idx * ELEMENT_HEIGHT;
    })
  }, [list]);
  return (
    <div onScroll={scroll} ref={containerRef} className={styles.container}>
      <div className={styles.sentry} style={{ transform: `translateY(${scrollHeight}px)` }} ></div>
      {
        visibleList.map((item, idx) =>
          <div key={idx} style={{transform: `translateY(${item.scrollY}px)`}} className={styles.wrapItem} >
            <Item ref={itemRef} item={item} />
          </div>
        )
      }
    </div>
  );
}

export default FixFunction;
