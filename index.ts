
import XTouch from '@joyfulljs/xtouch';

export default function Draggable(el: HTMLElement, options: IOptions) {

  // matrix(1, 0, 0, 1, -60, -49)
  // matrix(3.5, 0, 0, 3.5, 0, 0)

  const oldParts = getTransform(el);
  let startX: number = 0, startY: number = 0;
  let isTouchDown: boolean = false;
  const unbind = XTouch(el, handleDown, handleMove, handleUp, handleUp);

  function handleDown(e: TouchEvent) {
    isTouchDown = true;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  }

  function handleMove(e: TouchEvent) {
    if (isTouchDown) {
      const touch = e.touches[0];
      let parts: Array<string | number> = getTransform(el);

      let deltX = touch.pageX - startX + +parts[4];
      let deltY = touch.pageY - startY + +parts[5];

      startX = touch.pageX;
      startY = touch.pageY;

      let maxX = el.offsetWidth - 50;
      let maxY = el.offsetHeight - 50;
      let minX = -maxX;
      let minY = -maxY;
      // TODO: does transformOrigin affect the result?
      if (parts[0] > 1) {
        maxX *= +parts[0];
        minX *= +parts[0];
      }
      if (parts[3] > 1) {
        maxY *= +parts[0];
        minY *= +parts[0];
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

      parts[4] = deltX;
      parts[5] = deltY;
      el.style.transform = `matrix(${parts.join(',')})`;
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
   * triggered when user scaling
   * @param e event argument { scale: number }
   */
  onScaleChange(e: { scale: number }): void;
}