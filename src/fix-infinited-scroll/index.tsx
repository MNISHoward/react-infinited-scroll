import React, { Component, RefObject } from "react";
import { outerHeight } from "../utils";
import styles from './index.module.scss'

type TProps<T> = {
  list: T[];
  children: (item: T, ref: RefObject<React.ReactElement>) => React.ReactElement;
  bufferSize: number;
  load?: () => void;
  keyProp?: string;
}

type TExtra = {
  scrollY?: number
}

type TState<T> = {
  firstItem: number;
  lastItem: number;
  visibleList: T[];
  scrollHeight: number;
}

export default class FixInfinitedScroll<T extends TExtra> extends Component<TProps<T>, TState<T>> {

  static defaultProps = {
    bufferSize: 3
  }

  ELEMENT_HEIGHT = 0;
  VISIBLE_COUNT = 0;
  itemRef = React.createRef<React.ReactElement>();
  containerRef = React.createRef<HTMLDivElement>();
  anchorItem = { index: 0, offset: 0 }
  lastScrollTop = 0;

  constructor(props: TProps<T>) {
    super(props);
    if (!this.props.list || this.props.list.length < 0) {
      throw new Error('list can not be empty')
    }
    this.state = {
      firstItem: 0,
      lastItem: 0,
      visibleList: this.props.list,
      scrollHeight: 0,
    }
  }

  componentDidMount() {
    this.ELEMENT_HEIGHT = outerHeight(this.itemRef.current);
    const containerHeight = this.containerRef.current?.clientHeight ?? 0;
    this.VISIBLE_COUNT = Math.ceil(containerHeight / this.ELEMENT_HEIGHT);
    this.setState({
      ...this.state,
      lastItem: this.VISIBLE_COUNT + this.props.bufferSize,
      scrollHeight: this.ELEMENT_HEIGHT * this.props.list.length
    });
    this.props.list.forEach((item, idx) => {
      item.scrollY = idx * this.ELEMENT_HEIGHT;
    })
  }

  componentDidUpdate(prevProps: TProps<T>, prevState: TState<T>) {
    const { firstItem: preFirstItem, lastItem: preLastItem } = prevState;
    const { list: preList } = prevProps;
    const { firstItem, lastItem } = this.state;
    const { list } = this.props;
    if (list !== preList) {
      this.setState({
        ...this.state,
        visibleList: list.slice(firstItem, lastItem),
        scrollHeight: list.length * this.ELEMENT_HEIGHT
      })
      list.forEach((item, idx) => {
        item.scrollY = idx * this.ELEMENT_HEIGHT;
      })
    }
    if (firstItem !== preFirstItem || lastItem !== preLastItem) {
      this.setState({
        ...this.state,
        visibleList: list.slice(firstItem, lastItem),
      })
    }
  }

  updateAnchorItem = (container: HTMLDivElement) => {
    const index = Math.floor(container.scrollTop / this.ELEMENT_HEIGHT);
      const offset = container.scrollTop - this.ELEMENT_HEIGHT * index;
      this.anchorItem = {
        index,
        offset
      }
  }

  scrollHandler = () => {
    const container = this.containerRef.current!;
    const delta = container.scrollTop - this.lastScrollTop;
    this.lastScrollTop = container.scrollTop;
    const isPositive = delta >= 0;
    this.anchorItem.offset += delta;
    let tempFirst = this.state.firstItem;
    if (isPositive) {
      if (this.anchorItem.offset >= this.ELEMENT_HEIGHT) {
        this.updateAnchorItem(container);
      }
      if (this.anchorItem.index - this.state.firstItem >= this.props.bufferSize) {
        tempFirst = Math.min(this.props.list.length - this.VISIBLE_COUNT, this.anchorItem.index - this.props.bufferSize)
        this.setState({
          ...this.state,
          firstItem: tempFirst
        });
      }
    } else {
      if (container.scrollTop <= 0) {
        this.anchorItem = { index:0, offset: 0 };
      } else if (this.anchorItem.offset < 0) {
        this.updateAnchorItem(container);
      }
      if (this.anchorItem.index - this.state.firstItem < this.props.bufferSize) {
        tempFirst = Math.max(0, this.anchorItem.index - this.props.bufferSize)
        this.setState({
          firstItem: tempFirst
        });
      }
    }
    this.setState({
      lastItem: Math.min(tempFirst + this.VISIBLE_COUNT + this.props.bufferSize * 2, this.props.list.length)
    })
    if (container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10) {
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
      <div className={styles.container} onScroll={this.scrollHandler} ref={this.containerRef} >
        <div className={styles.sentry} style={{ transform: `translateY(${this.state.scrollHeight}px)` }} ></div>
        {
          visibleList.map((item, idx) => {
            const renderNode = children(item, this.itemRef);
            return (
              <div key={(item as any)[this.props.keyProp!] ?? idx}
                style={{ transform: `translateY(${item.scrollY}px)`, contain: 'size' }}
                className={styles.wrapItem} >
                  { renderNode }
              </div>
            )
          })
        }
      </div>
    )
  }
}