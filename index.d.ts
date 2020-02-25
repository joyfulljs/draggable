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
export interface IOptions {
    /**
     * triggered when dragging.
     * return false to cancel this movement.
     * @param e event argument { deltX:number, deltX:number, originalEvent:TouchEvent }
     */
    onMoving(e: IMoveEvent): boolean;
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
