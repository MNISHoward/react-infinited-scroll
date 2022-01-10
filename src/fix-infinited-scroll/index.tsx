import React, { Component, RefObject } from "react";
import styles from './index.m.scss'

type TProps<T> = {
  list: any[];
  children: (item: T, ref: RefObject<React.ReactElement>) => React.ReactNode
}

type TState<T> = {
  firstItem: number;
  lastItem: number;
  visibleList: T[];
  scrollHeight: number;
  itemRef: RefObject<React.ReactElement>
}

export default class FixInfinitedScroll<T> extends Component<TProps<T>, TState<T>> {

  constructor(props: TProps<T>) {
    super(props);
    this.state = {
      firstItem: 0,
      lastItem: 0,
      visibleList: [],
      scrollHeight: 0,
      itemRef: React.createRef<React.ReactElement>()
    }
  }

  componentDidMount() {
    
  }

  render() {
    const children = this.props.children;
    if (typeof children != 'function') {
      throw new Error('Must to be a function for children')
    }
    return (
      <div className={styles.container} >{children(this.props.list[0], this.state.itemRef)}</div>
    )
  }
}