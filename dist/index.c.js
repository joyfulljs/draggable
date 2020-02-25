'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * bind event
 * @param target window | HTMLElement
 * @param type event type
 * @param handler event handler
 * @param capture if capture phase
 */
function on(target, type, handler, capture) {
    if (capture === void 0) { capture = false; }
    target.addEventListener(type, handler, capture);
}
/**
 * unbind event
 * @param target window | HTMLElement
 * @param type event type
 * @param handler event handler
 * @param capture if capture phase
 */
function off(target, type, handler, capture) {
    if (capture === void 0) { capture = false; }
    target.removeEventListener(type, handler, capture);
}
/**
 * bind mouse or touch event according to current env
 * @param el  window | HTMLElement
 * @param onStart on start handler
 * @param onMove on move handler
 * @param onEnd on end handler
 * @param onCancel on cancel handler. useless in none-touch device.
 */
function XTouch(el, onStart, onMove, onEnd, onCancel) {
    var isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) {
        on(el, 'touchstart', onStart);
        on(window, 'touchmove', onMove);
        on(window, 'touchend', onEnd);
        on(el, 'touchcancel', onCancel);
    }
    else {
        var oldStart_1 = onStart, oldMove_1 = onMove, oldEnd_1 = onEnd;
        onStart = function (e) {
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = e.changedTouches = [e];
            oldStart_1(e);
        };
        onMove = function (e) {
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = e.changedTouches = [e];
            oldMove_1(e);
        };
        onEnd = function (e) {
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = [];
            // @ts-ignore
            e.changedTouches = [e];
            oldEnd_1(e);
        };
        on(el, 'mousedown', onStart);
        on(window, 'mousemove', onMove);
        on(window, 'mouseup', onEnd);
    }
    return function unbind() {
        if (isTouchDevice) {
            off(el, 'touchstart', onStart);
            off(window, 'touchmove', onMove);
            off(window, 'touchend', onEnd);
            off(el, 'touchcancel', onCancel);
        }
        else {
            off(el, 'mousedown', onStart);
            off(window, 'mousemove', onMove);
            off(window, 'mouseup', onEnd);
        }
    };
}

/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
function Draggable(el, options) {
    // matrix(1, 0, 0, 1, -60, -49)
    // matrix(3.5, 0, 0, 3.5, 0, 0)
    var unbind = XTouch(el, handleDown, handleMove, handleUp, handleUp);
    var oldParts = getTransform(el);
    var _a = options || {}, onMoving = _a.onMoving, maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY;
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
            parts[4] = deltX;
            parts[5] = deltY;
            el.style.transform = "matrix(" + parts.join(',') + ")";
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
function getTransform(el) {
    var transform = window.getComputedStyle(el).transform;
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

exports.default = Draggable;
exports.getTransform = getTransform;
