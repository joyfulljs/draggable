/**
 * `transform` property name with browser vendor prefix if needed.
 */
export declare const transformProperty: string;
/**
 * make a element draggable
 * @param el target html element
 * @param options options
 */
export default function Draggable(el: HTMLElement, options: IOptions): {
    reset: () => void;
    destroy: () => void;
};
/**
 * get computed style of transform
 * @param el target html element
 */
export declare function getTransform(el: HTMLElement): string[];
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
