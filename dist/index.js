import XTouch from '@joyfulljs/xtouch';
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
    var _a = options || {}, onMoving = _a.onMoving, maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY, stay = _a.stay;
    var startX = 0, startY = 0;
    var beginX = 0, beginY = 0;
    var isTouchDown = false;
    function handleDown(e) {
        isTouchDown = true;
        beginX = startX = e.touches[0].pageX;
        beginY = startY = e.touches[0].pageY;
    }
    function handleMove(e) {
        if (isTouchDown) {
            var touch = e.touches[0];
            var parts = getTransform(el);
            var deltX = touch.pageX - startX + +parts[4];
            var deltY = touch.pageY - startY + +parts[5];
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
                deltX = maxX;
            }
            else if (deltX < minX) {
                deltX = minX;
            }
            if (deltY > maxY) {
                deltY = maxY;
            }
            else if (deltY < minY) {
                deltY = minY;
            }
            if (onMoving && onMoving({
                deltX: touch.pageX - beginX,
                deltY: touch.pageY - beginY,
                originalEvent: e
            }) === false) {
                return;
            }
            if (!stay) {
                parts[4] = deltX;
                parts[5] = deltY;
                el.style.transform = "matrix(" + parts.join(',') + ")";
            }
        }
    }
    function handleUp() {
        isTouchDown = false;
    }
    function reset() {
        var parts = getTransform(el);
        parts[4] = oldParts[4];
        parts[5] = oldParts[5];
        el.style.transform = "matrix(" + parts.join(',') + ")";
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
    var transform = window.getComputedStyle(el).transform;
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}
