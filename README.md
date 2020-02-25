# make element draggable

# useage

```JS
import Draggable from '@joyfulljs/draggable';

// ...
mount(){
  this.instance = new Draggable(this.refs.el);
},
active(){
  // if need to reset to origin state
  this.instance.reset()
},
unmount(){
  this.instance.destroy()
}
// ...

```

# api

```js
function Draggable(el: HTMLElement, options: IOptions): {
    reset: () => void;
    destroy: () => void;
};

interface IOptions {
  /**
   * triggered when dragging.
   * return false to cancel this moving.
   * @param e event argument { scale: number }
   */
  onMoving(e: {
      deltX: number;
      deltY: number;
      originalEvent: TouchEvent;
  }): boolean;
  /**
   * x轴正向最大拖动
   */
  maxX?: number;
  /**
   * y轴正向最大拖动
   */
  maxY?: number;
  /**
   * x轴负向最大拖动
   */
  minX?: number;
  /**
   * y轴负向最大拖动
   */
  minY?: number;
}
```

# LICENSE

MIT
