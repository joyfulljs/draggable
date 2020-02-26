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
   * triggered when touchmove/mousemove
   * return false to cancel this movement.
   * @param e e
   */
  onMoving(e: IMoveEvent): boolean;
  /**
   * triggered when touchstart/mousedown
   * @param e e
   */
  onStart(e: TouchEvent): boolean;
  /**
   * triggered when touchend/mouseup
   * @param e e
   */
  onEnd(e: TouchEvent): void;
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

interface IMoveEvent {
  /**
   * total move distance for x direction since start
   */
  totalDeltX: number;
  /**
   * total move distance for Y direction since start
   */
  totalDeltY: number;
  /**
   * move distance for x direction
   */
  deltX: number;
  /**
   * move distance for y direction
   */
  deltY: number;
  /**
   * the original event argument
   * TouchEvent for touch device
   * MouseEvent for none-touch device
   */
  originalEvent: TouchEvent;
}

```

# tip

You can combine 'maxX/maxY/minX/minY' to achieve some special functionality.  
for example:  
- set `maxX=0` and `minX=0` at the same time to make only draggable at y direction
- set `maxY=0` and `minY=0` at the same time to make only draggable at x direction

Return `false` inside `onMoving` callback to prevent moving the element. 

# LICENSE

MIT
