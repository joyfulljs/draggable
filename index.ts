
import { getProperty } from '@joyfulljs/vendor-property';
import XTouch from '@joyfulljs/xtouch';

/**
 * `transform` property name with browser vendor prefix if needed.
 */
export const transformProperty = getProperty('transform');

/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
export default function Draggable(el: HTMLElement, options: IOptions) {

  let { onMoving, onStart, onEnd, maxX, maxY, minX, minY, useCapture } = options || {};
  let startX: number = 0, startY: number = 0;
  let beginX: number = 0, beginY: number = 0;
  let isTouchDown: boolean = false;

  const unbind = XTouch(el, { onStart: handleDown, onMove: handleMove, onEnd: handleUp, capture: useCapture });
  const oldParts = getTransform(el);

  function handleDown(e: TouchEvent) {
    isTouchDown = true;
    beginX = startX = e.touches[0].pageX;
    beginY = startY = e.touches[0].pageY;
    onStart && onStart(e);
  }

  function handleMove(e: TouchEvent) {
    if (isTouchDown) {
      const touch = e.touches[0];
      let parts: Array<string | number> = getTransform(el);
      let deltX = touch.pageX - startX;
      let deltY = touch.pageY - startY;
      let x = deltX + +parts[4];
      let y = deltY + +parts[5];

      startX = touch.pageX;
      startY = touch.pageY;

      // take transform: scale into consideration
      // TODO: does transformOrigin affect the result?
      if (parts[0] > 1) {
        maxX *= +parts[0];
        minX *= +parts[0];
      }
      if (parts[3] > 1) {
        maxY *= +parts[3];
        minY *= +parts[3];
      }
      if (x > maxX) {
        x = maxX
      } else if (x < minX) {
        x = minX
      }
      if (y > maxY) {
        y = maxY
      } else if (y < minY) {
        y = minY
      }

      if (onMoving && onMoving({
        totalDeltX: touch.pageX - beginX,
        totalDeltY: touch.pageY - beginY,
        deltX,
        deltY,
        originalEvent: e
      }) === false) {
        return
      }

      parts[4] = x;
      parts[5] = y;
      // @ts-ignore ts handle string index incorrectly, so ignore it.
      el.style[transformProperty] = `matrix(${parts.join(',')})`;
    }
  }

  function handleUp(e: TouchEvent) {
    isTouchDown = false;
    onEnd && onEnd(e)
  }

  function reset() {
    const parts = getTransform(el);
    parts[4] = oldParts[4];
    parts[5] = oldParts[5];
    // @ts-ignore
    el.style[transformProperty] = `matrix(${parts.join(',')})`;
  }

  return {
    reset,
    destroy: unbind
  }
}

/**
 * get computed style of transform
 * @param el target html element
 */
export function getTransform(el: HTMLElement): string[] {
  // @ts-ignore
  let transform = window.getComputedStyle(el)[transformProperty]
  if (!transform || transform === 'none') {
    transform = 'matrix(1, 0, 0, 1, 0, 0)'
  }
  return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

/**
 * instance configraton options
 */
export interface IOptions {
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
  /**
   * use capture phase for the underneth event binding.
   */
  useCapture?: boolean
}

export interface IMoveEvent {
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