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
   * return false to cancel this movement.
   * @param e event argument { deltX:number, deltX:number, originalEvent:TouchEvent }
   */
  onMoving(e: IMoveEvent): boolean;
  /**
   * set true to prevent moving the element,
   * used when only need onMoving callback.
   */
  stay?: boolean;
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

# tip

your can combine 'maxX/maxY/minX/minY' to achieve some special functionality.  
for example:  
- set `maxX=0` and `minX=0` at the same time to make only draggable at y direction
- set `maxY=0` and `minY=0` at the same time to make only draggable at x direction

# LICENSE

MIT
