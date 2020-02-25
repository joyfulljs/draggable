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
     * return false to cancel this moving.
     * @param e event argument { scale: number }
     */
    onMoving(e: {
        deltX: number;
        deltY: number;
        originalEvent: TouchEvent;
    }): boolean;
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
