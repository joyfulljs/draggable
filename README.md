# make element draggable

[![Build Status](https://travis-ci.org/joyfulljs/draggable.svg?branch=master)](https://travis-ci.org/joyfulljs/draggable)
[![codecov](https://codecov.io/gh/joyfulljs/draggable/branch/master/graph/badge.svg?v=1)](https://codecov.io/gh/joyfulljs/draggable)

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

[docs](./index.d.ts)

# tip

You can combine 'maxX/maxY/minX/minY' to achieve some special functionality.  
for example:

- set `maxX=0` and `minX=0` at the same time to make only draggable at y direction
- set `maxY=0` and `minY=0` at the same time to make only draggable at x direction

Return `false` inside `onMoving` callback to prevent moving the element.

# license

MIT
