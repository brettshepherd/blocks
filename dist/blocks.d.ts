export interface BlockOptions {
    container: any;
    sizes: {
        columns: number;
        minWidth: number;
        gutter: number;
    }[];
    animationEndClass?: string;
    usePosition?: boolean;
}
export declare class Blocks {
    container: HTMLElement;
    elements: HTMLElement[];
    columnHeights: any[];
    columnWidth: number;
    elementHeights: number[];
    sizes: {
        columns: number;
        minWidth: number;
        gutter: number;
    }[];
    currentSize: {
        columns: number;
        minWidth: number;
        gutter: number;
    };
    resizeDelay: number;
    resizeThrottle: boolean;
    boundResize: any;
    animationEndClass: string;
    usePosition: boolean;
    constructor(options: BlockOptions);
    selectChildren(onlyUnPacked: boolean): HTMLElement[];
    setElementHeights(): number[];
    fillEmptyColumns(): any[];
    setElementsStyles(): void;
    update(): void;
    rePack(): void;
    checkMediaQuery(): {
        columns: number;
        minWidth: number;
        gutter: number;
    };
    onWindowResize(): void;
    setupResize(): void;
    getContainerWidth(): string;
    destroy(): void;
}
