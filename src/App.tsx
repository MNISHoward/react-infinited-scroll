import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import FixInfinitedScroll from './fix-infinited-scroll';
import Item from './Item';
import { generateItems } from './mock';

function outerHeight(el: any) {
  let height = el.offsetHeight;
  const style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

let ELEMENT_HEIGHT = 0;
let VISIBLE_COUNT = 0;
const BUFFER_SIZE = 3;

function App() {
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
      if (isPositive) {
        if (anchorItem.current.offset >= ELEMENT_HEIGHT) {
          updateAnchorItem(container);
        }
        if (anchorItem.current.index - firstItem >= BUFFER_SIZE) {
          setFirstItem(Math.min(list.length - VISIBLE_COUNT, anchorItem.current.index - BUFFER_SIZE));
        }
      } else {
        if (container.scrollTop <= 0) {
          anchorItem.current = { index:0, offset: 0 };
        } else if (anchorItem.current.offset < 0) {
          updateAnchorItem(container);
        }
        if (anchorItem.current.index - firstItem < BUFFER_SIZE) {
          setFirstItem(Math.max(0, anchorItem.current.index - BUFFER_SIZE));
        }
      }
      setLastItem(Math.min(firstItem + VISIBLE_COUNT + BUFFER_SIZE * 2, list.length));
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
    <>
      <div onScroll={scroll} ref={containerRef} className="container">
        <div className="sentry" style={{ transform: `translateY(${scrollHeight}px)` }} ></div>
        {
          visibleList.map((item, idx) => 
            <Item style={{transform: `translateY(${item.scrollY}px)`}} ref={itemRef} item={item} key={idx} />
          )
        }
      </div>
      <FixInfinitedScroll list={list} >
        {
          (item, ref) => 
            <Item ref={ref} item={item} style={{}} />
          
        }
      </FixInfinitedScroll>
    </>
  );
}

export default App;
