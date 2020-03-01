'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * vendor prefixes that being taken into consideration.
 */
var vendors = ['webkit', 'ms', 'moz', 'o'];
/**
 * get vendor property name that contains uppercase letter.
 * e.g. webkitTransform
 * @param prop property name. for example: transform
 * @param host optional. property owner. default to `document.body.style`.
 */
function getProperty(prop, host) {
    var targetHost = host || document.body.style;
    if (!(prop in targetHost)) {
        var char1 = prop.charAt(0).toUpperCase();
        var charLeft = prop.substr(1);
        for (var i = 0; i < vendors.length; i++) {
            var vendorProp = vendors[i] + char1 + charLeft;
            if (vendorProp in targetHost) {
                return vendorProp;
            }
        }
    }
    return prop;
}

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
 * To bind event
 * @param el taget element. required.
 * @param options event handlers and other configration. required.
 */
function XTouch(el, options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
        throw new Error('[xtouch]: argument `options` is missing or illegal.');
    }
    var onStart = options.onStart, onMove = options.onMove, onEnd = options.onEnd, capture = options.capture;
    var startTarget = null;
    var _onStart = function (e) {
        if (e.type === 'mousedown') {
            startTarget = e.target;
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = e.changedTouches = [e];
            // @ts-ignore
            e.targetTouches = [e];
        }
        onStart(e);
    }, _onMove = function (e) {
        if (e.type === 'mousemove') {
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = e.changedTouches = [e];
            // @ts-ignore
            e.targetTouches = e.target === startTarget ? [e] : [];
        }
        onMove(e);
    }, _onEnd = function (e) {
        if (e.type === 'mouseup') {
            // @ts-ignore
            e.identifier = 0;
            // @ts-ignore
            e.touches = [];
            // @ts-ignore
            e.changedTouches = [e];
            // @ts-ignore
            e.targetTouches = e.target === startTarget ? [e] : [];
        }
        onEnd(e);
    };
    if (onStart) {
        on(el, 'touchstart', _onStart, capture);
        on(el, 'mousedown', _onStart, capture);
    }
    if (onMove) {
        on(window, 'touchmove', _onMove, capture);
        on(window, 'mousemove', _onMove, capture);
    }
    if (onEnd) {
        on(window, 'touchend', _onEnd, capture);
        on(window, 'mouseup', _onEnd, capture);
    }
    return function unbind() {
        off(el, 'touchstart', _onStart, capture);
        off(window, 'touchmove', _onMove, capture);
        off(window, 'touchend', _onEnd, capture);
        off(el, 'mousedown', _onStart, capture);
        off(window, 'mousemove', _onMove, capture);
        off(window, 'mouseup', _onEnd, capture);
    };
}

/**
 * `transform` property name with browser vendor prefix if needed.
 */
var transformProperty = getProperty('transform');
/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
function Draggable(el, options) {
    var _a = options || {}, onMoving = _a.onMoving, onStart = _a.onStart, onEnd = _a.onEnd, maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY, useCapture = _a.useCapture;
    var startX = 0, startY = 0;
    var beginX = 0, beginY = 0;
    var isTouchDown = false;
    var unbind = XTouch(el, { onStart: handleDown, onMove: handleMove, onEnd: handleUp, capture: useCapture });
    var oldParts = getTransform(el);
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
function getTransform(el) {
    // @ts-ignore
    var transform = window.getComputedStyle(el)[transformProperty];
    if (!transform || transform === 'none') {
        transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return transform.replace(/\(|\)|matrix|\s+/g, '').split(',');
}

exports.default = Draggable;
exports.getTransform = getTransform;
exports.transformProperty = transformProperty;
