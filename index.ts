
import XTouch from '@joyfulljs/xtouch';

/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
export default function Draggable(el: HTMLElement, options: IOptions) {

  // matrix(1, 0, 0, 1, -60, -49)
  // matrix(3.5, 0, 0, 3.5, 0, 0)

  const unbind = XTouch(el, handleDown, handleMove, handleUp, handleUp);
  const oldParts = getTransform(el);

  let { onMoving, maxX, maxY, minX, minY, stay } = options || {};
  let startX: number = 0, startY: number = 0;
  let beginX: number = 0, beginY: number = 0;
  let isTouchDown: boolean = false;

  function handleDown(e: TouchEvent) {
    isTouchDown = true;
    beginX = startX = e.touches[0].pageX;
    beginY = startY = e.touches[0].pageY;
  }

  function handleMove(e: TouchEvent) {
    if (isTouchDown) {
      const touch = e.touches[0];
      let parts: Array<string | number> = getTransform(el);
      let deltX = touch.pageX - startX + +parts[4];
      let deltY = touch.pageY - startY + +parts[5];

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
      if (deltX > maxX) {
        deltX = maxX
      }
      else if (deltX < minX) {
        deltX = minX
      }
      if (deltY > maxY) {
        deltY = maxY
      }
      else if (deltY < minY) {
        deltY = minY
      }

      if (onMoving && onMoving({
        deltX: touch.pageX - beginX,
        deltY: touch.pageY - beginY,
        originalEvent: e
      }) === false) {
        return
      }

      if (!stay) {
        parts[4] = deltX;
        parts[5] = deltY;
        el.style.transform = `matrix(${parts.join(',')})`;
      }
    }
  }

  function handleUp() {
    isTouchDown = false;
  }

  function reset() {
    const parts = getTransform(el);
    parts[4] = oldParts[4];
    parts[5] = oldParts[5];
    el.style.transform = `matrix(${parts.join(',')})`;
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
  let transform = window.getComputedStyle(el).transform;
  if (!transform || transform === 'none') {
    transform = 'matrix(1, 0, 0, 1, 0, 0)'
  }
  return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

export interface IOptions {
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

export interface IMoveEvent {
  /**
   * move distance for x direction
   */
  deltX: number,
  /**
   * move distance for y direction
   */
  deltY: number,
  /**
   * the original event argument
   * TouchEvent for touch device
   * MouseEvent for none-touch device
   */
  originalEvent: TouchEvent
}