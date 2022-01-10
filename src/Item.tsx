import React, { forwardRef } from 'react'

type TProps = {
  item: any,
  style: any,
  ref: any
}

const Item = React.memo<TProps>(forwardRef(({
  item,
  style
}, ref: any) => {
  return (
    <div ref={ref} style={style} className="item" >
      <div className="info" >
        <span>{item.name}</span>
        <span>Thumb Up: {item.thumbUp}</span>
      </div>
      <div className="pic" >
        <img src={item.pic} alt="" />
      </div>
      <div className="comment" >{item.comment}</div>
    </div>
  )
}));


export default Item;
