import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { generateDynamicItems } from '../../mock';
import { outerHeight } from '../../utils';
import DynamicItem from '../DynamicItem';
import styles from './index.module.scss'
import WrappedItem from './warppedItem';


let ELEMENT_HEIGHT = 100;
let VISIBLE_COUNT = 0;
const BUFFER_SIZE = 3;

function DynamicFunction() {
  const [list, setList] = useState(generateDynamicItems());
  const [firstItem, setFirstItem] = useState(0);
  const [lastItem, setLastItem] = useState(0);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [itemScrollYs, setItemScrollYs] = useState<number[]>([]);
  const [visibleList, setVisibleList] = useState<typeof list>(list);
  const [scrollHeight, setScrollHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const anchorItem = useRef({ index: 0, offset: 0 })

  const updateScrollY = useCallback(() => {
    const items = document.getElementsByClassName(styles.wrapItem);
    const lastIdx = (items[items.length - 1] as any).dataset.index;
    const anchorDom = Array.from(items).find((item) => Number((item as any).dataset.index) === anchorItem.current.index);
    itemHeights[anchorItem.current.index] = outerHeight(anchorDom);
    itemScrollYs[anchorItem.current.index] = containerRef.current!.scrollTop - anchorItem.current.offset;
    for (let i = (anchorDom as any).dataset.index + 1; i < lastIdx; i++) {
      const item = items[i];
      const index = (item as any).dataset.index;
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index - 1] + itemHeights[index - 1];
      itemScrollYs[index] = scrollY;
    }

    for (let i = (anchorDom as any).dataset.index - 1; i >= 0; i--) {
      const item = items[i];
      const index = (item as any).dataset.index
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index + 1] - itemHeights[index];
      itemScrollYs[index] = scrollY;
    }
    setItemHeights([...itemHeights]);
    setItemScrollYs([...itemScrollYs]);
  }, [itemHeights, itemScrollYs]);


  const sizeChange = useCallback(() => {
    updateScrollY();
    setItemHeights([...itemHeights]);
  }, [itemHeights, updateScrollY]);

  useLayoutEffect(() => {
    let scrollH = itemHeights.reduce((sum, h) => sum += h, 0);
    setScrollHeight(scrollH + (list.length - itemHeights.length) * ELEMENT_HEIGHT);
  }, [itemHeights, list]);

  const updateAnchorItem = useCallback(
    (container) => {
      const delta = container.scrollTop - lastScrollTop.current;
      lastScrollTop.current = container.scrollTop;
      const isPositive = delta >= 0;
      anchorItem.current.offset += delta;
      let index = anchorItem.current.index;
      let offset = anchorItem.current.offset;
      if (isPositive) {
        while (index < list.length && offset >= itemHeights[index]) {
          offset -= itemHeights[index];
          index++;
        }
        anchorItem.current = { index, offset };
      } else {
        while (offset < 0) {
          offset += itemHeights[index];
          index--;
        }
        if (index < 0) {
          anchorItem.current = { index: 0, offset: 0 };
        } else {
          anchorItem.current = { index, offset };
        }
      }
    },
    [itemHeights, list],
  )

  const scroll = useCallback(
    (event) => {
      const container = event.target;
      updateAnchorItem(container);
      const start = Math.max(0, anchorItem.current.index - BUFFER_SIZE);
      setFirstItem(start);
      setLastItem(Math.min(list.length, start + VISIBLE_COUNT + BUFFER_SIZE * 2));
      // if (container.scrollTop + container.clientHeight >=
      //   container.scrollHeight - 10) {
      //   setList([...list, ...generateDynamicItems()]);
      // }
    },
    [list, updateAnchorItem],
  )
  useLayoutEffect(() => {
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    VISIBLE_COUNT = Math.ceil(containerHeight / ELEMENT_HEIGHT);
    setLastItem(VISIBLE_COUNT + BUFFER_SIZE);
  }, [])
  useLayoutEffect(() => {
    setVisibleList(list.slice(firstItem, lastItem));
  }, [list, firstItem, lastItem]);
  useLayoutEffect(() => {
    const scrolls: number[] = [];
    const heights: number[] = [];
    list.forEach((item, idx) => {
      item.index = scrolls.length;
      scrolls[idx] = idx * ELEMENT_HEIGHT;
    })
    setItemScrollYs(scrolls);
  }, [list]);
  return (
    <div onScroll={scroll} ref={containerRef} className={styles.container}>
      <div className={styles.sentry} style={{ transform: `translateY(${scrollHeight}px)` }} ></div>
      {
        visibleList.map((item, idx) => 
          <WrappedItem index={item.index!} sizeChange={sizeChange} key={idx} style={{transform: `translateY(${itemScrollYs[item.index!]}px)`}} >
            <DynamicItem item={item} />
          </WrappedItem>
        )
      }
    </div>
  );
}

export default DynamicFunction;
