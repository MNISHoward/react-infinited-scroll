import React, { Component } from 'react'
import { outerHeight } from '../utils'
import styles from './index.module.scss'
import ResizeObserver from 'resize-observer-polyfill'
import WrappedItem from './wrappedItem'

type TProps<T> = {
  list: T[];
  children: (item: T) => React.ReactElement;
  bufferSize: number;
  load?: () => void;
  keyProp?: string;
  elementHeight: number;
}

type TExtra = {
  index?: number
}

type TState<T> = {
  firstItem: number;
  lastItem: number;
  visibleList: T[];
  _list: (T & TExtra)[];
  scrollHeight: number;
  itemHeights: number[];
  itemScrollYs: number[];
}

export default class DynamicInfinitedScroll<T extends TExtra> extends Component<TProps<T>, TState<T>> {
  static defaultProps = {
    bufferSize: 3
  }

  VISIBLE_COUNT = 0;
  containerRef = React.createRef<HTMLDivElement>();
  anchorItem = { index: 0, offset: 0 }
  lastScrollTop = 0;
  ro: ResizeObserver = new ResizeObserver(() => {});
  items: { dom: HTMLDivElement, index: number }[] = [];

  constructor(props: TProps<T>) {
    super(props);
    const _list: T[] = [];
    this.props.list.forEach((item, idx) => {
      item.index = _list.length;
      _list.push(item)
    })
    this.state = {
      firstItem: 0,
      lastItem: 0,
      _list,
      visibleList: [],
      scrollHeight: 0,
      itemHeights: [],
      itemScrollYs: [],
    }
  }

  componentDidMount() {
    const containerHeight = this.containerRef.current?.clientHeight ?? 0;
    this.VISIBLE_COUNT = Math.ceil(containerHeight / this.props.elementHeight);
    this.setState({
      ...this.state,
      lastItem: this.VISIBLE_COUNT + this.props.bufferSize,
    });
    this.ro = new ResizeObserver(() => {
      this.sizeChange();
    })
  }

  componentDidUpdate(prevProps: TProps<T>, prevState: TState<T>) {
    const { firstItem: preFirstItem, lastItem: preLastItem, itemHeights: preItemHeights } = prevState;
    const { list: preList } = prevProps;
    const { firstItem, lastItem, itemHeights, _list } = this.state;
    const { list, elementHeight, bufferSize } = this.props;
    if (list !== preList) {
      const _list: T[] = [];
      list.forEach((item, idx) => {
        item.index = _list.length;
        _list.push(item);
      });
      const last = Math.min(_list.length, firstItem + this.VISIBLE_COUNT + bufferSize * 2);
      const scrollH = itemHeights.reduce((sum, h) => sum += h, 0);
      this.setState({
        ...this.state,
        _list,
        visibleList: _list.slice(firstItem, last),
        scrollHeight: scrollH + (_list.length - itemHeights.length) * elementHeight,
        lastItem: last
      })
    }
    if (firstItem !== preFirstItem || lastItem !== preLastItem) {
      this.setState({
        ...this.state,
        visibleList: _list.slice(firstItem, lastItem),
      })
    }
    if (itemHeights !== preItemHeights) {
      const scrollH = itemHeights.reduce((sum, h) => sum += h, 0);
      this.setState({
        ...this.state,
        scrollHeight: scrollH + (_list.length - itemHeights.length) * elementHeight
      })
    }
  }

   updateScrollY = () => {
    const items = this.items;
    const { itemHeights, itemScrollYs } = this.state;
    const domIndex = Array.from(items).findIndex((item) => item.index === this.anchorItem.index);
    const anchorDom = items[domIndex].dom;
    itemHeights[this.anchorItem.index] = outerHeight(anchorDom);
    itemScrollYs[this.anchorItem.index] = this.containerRef.current!.scrollTop - this.anchorItem.offset;
    for (let i = domIndex + 1; i < items.length; i++) {
      const item = items[i].dom;
      if (item === null) return;
      const index = items[i].index;
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index - 1] + itemHeights[index - 1];
      itemScrollYs[index] = scrollY;
    }

    for (let i = domIndex - 1; i >= 0; i--) {
      const item = items[i].dom;
      if (item === null) return;
      const index = items[i].index;
      itemHeights[index] = outerHeight(item);
      const scrollY = itemScrollYs[index + 1] - itemHeights[index];
      itemScrollYs[index] = scrollY;
    }
    if (itemScrollYs[0] > 0) {
      const diff = itemScrollYs[0];
      for (let i = 0; i < items.length; i++) {
        itemScrollYs[i] -= diff;
      }
      const actualScrollTop = this.anchorItem.index - 1 >= 0 ? itemScrollYs[this.anchorItem.index - 1] + this.anchorItem.offset : this.anchorItem.offset;
      this.containerRef.current!.scrollTop = actualScrollTop;
      this.lastScrollTop = actualScrollTop;
    }
    this.setState({
      ...this.state,
      itemHeights: [...itemHeights],
      itemScrollYs: [...itemScrollYs]
    })
  }

  sizeChange = () => {
    this.updateScrollY();
  }

  updateAnchorItem = (container: HTMLDivElement) => {
    const { _list, itemHeights, itemScrollYs, firstItem } = this.state;
    const { elementHeight } = this.props
    const delta = container.scrollTop - this.lastScrollTop;
    this.lastScrollTop = container.scrollTop;
    const isPositive = delta >= 0;
    this.anchorItem.offset += delta;
    let index = this.anchorItem.index;
    let offset = this.anchorItem.offset;
    if (isPositive) {
      while (index < _list.length && offset >= itemHeights[index]) {
        if (!itemHeights[index]) {
          itemHeights[index] = elementHeight;
        }
        offset -= itemHeights[index];
        index++;
      }
      if (index >= _list.length) {
        this.anchorItem = { index: _list.length - 1, offset: 0 };
      } else {
        this.anchorItem = { index, offset };
      }
    } else {
      while (offset < 0) {
        if (!itemHeights[index - 1]) {
          itemHeights[index - 1] = elementHeight;
        }
        offset += itemHeights[index - 1];
        index--;
      }
      if (index < 0) {
        this.anchorItem = { index: 0, offset: 0 };
      } else {
        this.anchorItem = { index, offset };
      }
    }
    if (itemScrollYs[firstItem] < 0) {
      const actualScrollTop = itemHeights.slice(0, Math.max(0, this.anchorItem.index)).reduce((sum, h) => sum + h, 0);
      this.containerRef.current!.scrollTop = actualScrollTop;
      this.lastScrollTop = actualScrollTop;
      if (actualScrollTop === 0) {
        this.anchorItem = { index: 0, offset: 0 };
      }
      this.updateScrollY();
    }
  }

  updateVisible = () => {
    const { bufferSize } = this.props;
    const { _list } = this.state;
    const start = Math.max(0, this.anchorItem.index - bufferSize);
    this.setState({
      ...this.state,
      firstItem: start,
      lastItem: Math.min(_list.length, start + this.VISIBLE_COUNT + bufferSize * 2)
    })
  }

  scrollHandler = () => {
    const container = this.containerRef.current!;
    this.updateAnchorItem(container);
    this.updateVisible();
    if (container.scrollTop + container.clientHeight >=
      container.scrollHeight) {
      this.props.load?.()
    }
  }

  render() {
    const children = this.props.children;
    if (typeof children != 'function') {
      throw new Error('Must to be a function for children')
    }
    const { visibleList } = this.state;
    return (
      <div onScroll={this.scrollHandler} ref={this.containerRef} className={styles.container}>
        <div className={styles.sentry} style={{ transform: `translateY(${this.state.scrollHeight}px)` }} ></div>
        {
          visibleList?.map((item, idx) => 
            <WrappedItem ob={this.ro} ref={this.items} idx={idx} index={item.index!} key={item.index} style={{transform: `translateY(${this.state.itemScrollYs[item.index!]}px)`}} >
              {children(item)}
            </WrappedItem>
          )
        }
      </div>
    )
  }
}