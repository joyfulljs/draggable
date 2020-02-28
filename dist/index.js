import { getProperty } from '@joyfulljs/vendor-property';
import XTouch from '@joyfulljs/xtouch';
/**
 * `transform` property name with browser vendor prefix if needed.
 */
export var transformProperty = getProperty('transform');
/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
export default function Draggable(el, options) {
    // matrix(1, 0, 0, 1, -60, -49)
    // matrix(3.5, 0, 0, 3.5, 0, 0)
    var unbind = XTouch(el, handleDown, handleMove, handleUp, handleUp);
    var oldParts = getTransform(el);
    var _a = options || {}, onMoving = _a.onMoving, onStart = _a.onStart, onEnd = _a.onEnd, maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY;
    var startX = 0, startY = 0;
    var beginX = 0, beginY = 0;
    var isTouchDown = false;
    function handleDown(e) {
        isTouchDown = true;
        beginX = startX = e.touches[0].pageX;
        beginY = startY = e.touches[0].pageY;
        onStart && onStart(e);
    }
    function handleMove(e) {
        if (isTouchDown) {
            var touch = e.touches[0];
            var parts = getTransform(el);
            var deltX = touch.pageX - startX;
            var deltY = touch.pageY - startY;
            var x = deltX + +parts[4];
            var y = deltY + +parts[5];
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
                x = maxX;
            }
            else if (x < minX) {
                x = minX;
            }
            if (y > maxY) {
                y = maxY;
            }
            else if (y < minY) {
                y = minY;
            }
            if (onMoving && onMoving({
                totalDeltX: touch.pageX - beginX,
                totalDeltY: touch.pageY - beginY,
                deltX: deltX,
                deltY: deltY,
                originalEvent: e
            }) === false) {
                return;
            }
            parts[4] = x;
            parts[5] = y;
            // @ts-ignore ts handle string index incorrectly, so ignore it.
            el.style[transformProperty] = "matrix(" + parts.join(',') + ")";
        }
    }
    function handleUp(e) {
        isTouchDown = false;
        onEnd && onEnd(e);
    }
    function reset() {
        var parts = getTransform(el);
        parts[4] = oldParts[4];
        parts[5] = oldParts[5];
        // @ts-ignore
        el.style[transformProperty] = "matrix(" + parts.join(',') + ")";
    }
    return {
        reset: reset,
        destroy: unbind
    };
}
/**
 * get computed style of transform
 * @param el target html element
 */
export function getTransform(el) {
    // @ts-ignore
    var transform = window.getComputedStyle(el)[transformProperty];
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}
