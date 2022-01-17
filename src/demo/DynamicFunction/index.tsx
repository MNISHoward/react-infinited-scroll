import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { generateDynamicItems } from '../../mock';
import { outerHeight } from '../../utils';
import DynamicItem from '../DynamicItem';
import styles from './index.module.scss'
import WrappedItem from './wrappedItem';


let ELEMENT_HEIGHT = 100;
let VISIBLE_COUNT = 0;
const BUFFER_SIZE = 3;

type ITEM_TYPE = ReturnType<typeof generateDynamicItems>[0];

function DynamicFunction() {
  const [data, setData] = useState(generateDynamicItems());
  const [list, setList] = useState<ITEM_TYPE[]>([]);
  const [firstItem, setFirstItem] = useState(0);
  const [lastItem, setLastItem] = useState(0);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [itemScrollYs, setItemScrollYs] = useState<number[]>([]);
  const [visibleList, setVisibleList] = useState<typeof list>();
  const [scrollHeight, setScrollHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ dom: HTMLDivElement[], index: number }[]>([]);
  const lastScrollTop = useRef(0);
  const anchorItem = useRef({ index: 0, offset: 0 })

  const updateScrollY = useCallback(() => {
    const items = itemRefs.current.filter(item => item.dom !== null);
    const domIndex = Array.from(items).findIndex((item) => item.index === anchorItem.current.index);
    const anchorDom = items[domIndex].dom;
    itemHeights[anchorItem.current.index] = outerHeight(anchorDom);
    itemScrollYs[anchorItem.current.index] = containerRef.current!.scrollTop - anchorItem.current.offset;
    for (let i = domIndex + 1; i < items.length; i++) {
      const item = items[i].dom;
      const index = items[i].index;
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index - 1] + itemHeights[index - 1];
      itemScrollYs[index] = scrollY;
    }

    for (let i = domIndex - 1; i >= 0; i--) {
      const item = items[i].dom;
      const index = items[i].index;
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index + 1] - itemHeights[index];
      itemScrollYs[index] = scrollY;
    }
    setItemHeights([...itemHeights]);
    setItemScrollYs([...itemScrollYs]); 
  }, [itemHeights, itemScrollYs]);


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
          if (!itemHeights[index]) {
            itemHeights[index] = ELEMENT_HEIGHT;
          }
          offset -= itemHeights[index];
          index++;
        }
        if (index >= list.length) {
          anchorItem.current = { index: list.length - 1, offset: 0 };
        } else {
          anchorItem.current = { index, offset };
        }
      } else {
        while (offset < 0) {
          if (!itemHeights[index - 1]) {
            itemHeights[index - 1] = ELEMENT_HEIGHT;
          }
          offset += itemHeights[index - 1];
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

  const sizeChange = useCallback(() => {
    updateScrollY();
  }, [updateScrollY]);

  const scroll = useCallback(
    (event) => {
      const container = event.target;
      updateAnchorItem(container);
      const start = Math.max(0, anchorItem.current.index - BUFFER_SIZE);
      setFirstItem(start);
      setLastItem(Math.min(list.length, start + VISIBLE_COUNT + BUFFER_SIZE * 2));
      if (container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10) {
        setData([...data, ...generateDynamicItems()]);
      }
    },
    [list, updateAnchorItem, data],
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
    const list: ITEM_TYPE[] = [];
    data.forEach((item) => {
      item.index = list.length;
      list.push(item);
    })
    setList(list);
  }, [data]);
  return (
    <div onScroll={scroll} ref={containerRef} className={styles.container}>
      <div className={styles.sentry} style={{ transform: `translateY(${scrollHeight}px)` }} ></div>
      {
        visibleList?.map((item, idx) => 
          <WrappedItem ref={itemRefs.current} idx={idx} index={item.index!} sizeChange={sizeChange} key={item.index} style={{transform: `translateY(${itemScrollYs[item.index!]}px)`}} >
            <DynamicItem item={item} />
          </WrappedItem>
        )
      }
    </div>
  );
}

export default DynamicFunction;
