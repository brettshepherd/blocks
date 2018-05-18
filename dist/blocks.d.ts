export interface BlockOptions {
    container: any;
    sizes: {
        columns: number;
        minWidth?: number;
        gutter: number;
    }[];
    animationEndClass?: string;
    usePosition?: boolean;
}
export declare class Blocks {
    private container;
    private elements;
    private columnHeights;
    private columnWidth;
    private elementHeights;
    private sizes;
    private currentSize;
    private resizeDelay;
    private resizeThrottle;
    private boundResize;
    private animationEndClass;
    private usePosition;
    constructor(options: BlockOptions);
    private selectChildren(onlyUnPacked);
    private setElementHeights();
    private fillEmptyColumns();
    private setElementsStyles();
    private checkMediaQuery();
    private onWindowResize();
    private setupResize();
    private getContainerWidth();
    update(): void;
    rePack(): void;
    destroy(): void;
}
