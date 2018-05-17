export interface BlockOptions {
  container: any;
  sizes: { columns: number; minWidth: number; gutter: number }[];
  animationEndClass?: string;
  usePosition?: boolean;
}

export class Blocks {
  //--------variables--------

  //holding container of grid elements
  private container: HTMLElement;

  //child nodes of container
  private elements: HTMLElement[];

  //column number array
  private columnHeights: any[];

  //columnWidth
  private columnWidth: number;

  //element heights array
  private elementHeights: number[] = [];

  //grid sizes object
  private sizes: { columns: number; minWidth: number; gutter: number }[] = [];

  //current size object
  private currentSize: { columns: number; minWidth: number; gutter: number };

  //window resize delay in milliseconds
  private resizeDelay: number = 100;

  // is currently throttling resize
  private resizeThrottle: boolean = false;

  //resize refernce with bound this
  private boundResize: any;

  //animation end class
  private animationEndClass: string = "placed";

  //place elements using position of transform
  private usePosition: boolean = true;

  //--------constructor--------
  constructor(options: BlockOptions) {
    //assign grid container
    this.container = options.container.nodeType
      ? options.container
      : document.querySelector(options.container);

    //assign sizes object
    this.sizes = options.sizes;

    //assign animation end class
    if (options.animationEndClass !== undefined) {
      this.animationEndClass = options.animationEndClass;
    }

    //assing animation end class
    if (options.usePosition !== undefined) {
      this.usePosition = options.usePosition;
    }

    //order sizes largest to smallest
    this.sizes.sort((a, b) => b.minWidth - a.minWidth);

    //assign current size
    this.currentSize = this.checkMediaQuery();

    //inital repack
    this.rePack();

    //bind resize function
    this.boundResize = this.setupResize.bind(this);

    //add window resize listener
    window.addEventListener("resize", this.boundResize, false);
  }

  //-------methods--------

  //return array aor either all children (false), or only unpacked (true)
  private selectChildren(onlyUnPacked: boolean): HTMLElement[] {
    //if selecting non packed elements
    if (onlyUnPacked) {
      return Array.from(this.container.children).filter(node => {
        return !node.hasAttribute("data-packed");
      }) as HTMLElement[];

      //select every element
    } else {
      return Array.from(this.container.children) as HTMLElement[];
    }
  }

  //return array of all container children heights
  private setElementHeights(): number[] {
    let heights: number[] = [];

    this.elements.forEach(element => {
      heights.push(element.clientHeight);
    });

    return heights;
  }

  //return array with a length of # of columns, and value of 0
  private fillEmptyColumns(): number[] {
    return new Array(this.currentSize.columns).fill(0);
  }

  //find appropriate column for element, and set styles to place block
  private setElementsStyles() {
    this.elements.forEach((element, index) => {
      //set column
      let columnTarget = this.columnHeights.indexOf(
        Math.min(...this.columnHeights)
      );

      //set element as absolute
      element.style.position = "absolute";

      //set node postion
      let elemTop = this.columnHeights[columnTarget] + "px";
      let elemLeft = `${columnTarget * this.columnWidth +
        columnTarget * this.currentSize.gutter}px`;

      //by postition
      if (this.usePosition) {
        element.style.top = elemTop;
        element.style.left = elemLeft;
      } else {
        //by transform
        element.style.transform = `translate3d(${elemLeft} , ${elemTop}, 0)`;
      }

      //set packed data attribute
      element.setAttribute("data-packed", "");

      // set packed class
      element.addEventListener(
        "animationend",
        () => {
          element.classList.add(this.animationEndClass);
        },
        { once: true }
      );

      this.columnHeights[columnTarget] +=
        this.elementHeights[index] + this.currentSize.gutter;
    });
  }

  //check media querys and return approprite size base on passed in options
  private checkMediaQuery() {
    // find index of widest matching media query
    let sizeIndex = this.sizes
      .map(size => {
        return (
          size.minWidth &&
          window.matchMedia(`(min-width: ${size.minWidth}px)`).matches
        );
      })
      .indexOf(true);

    //if no media query match, use first index
    return sizeIndex === -1 ? this.sizes[0] : this.sizes[sizeIndex];
  }

  //repack if reached new media query
  private onWindowResize() {
    let newSize = this.checkMediaQuery();
    if (this.currentSize != newSize) {
      this.currentSize = newSize;
      this.rePack();
    }
  }

  //optimized window resize function, only executing based on resize delay
  private setupResize() {
    // only run if we're not throttled
    if (!this.resizeThrottle) {
      // actual callback action
      this.onWindowResize();
      // we're throttled!
      this.resizeThrottle = true;
      // set a timeout to un-throttle
      setTimeout(() => {
        this.resizeThrottle = false;
      }, this.resizeDelay);
    }
  }

  //return the calculated parent containers width, based on gutters and column width
  private getContainerWidth(): string {
    return `${this.columnWidth * this.currentSize.columns +
      this.currentSize.gutter * (this.currentSize.columns - 1)}px`;
  }

  //update layout, only packing newly found unpacked blocks (used for appending)
  update() {
    //select unpacked elements
    this.elements = this.selectChildren(true);

    //get those elements heights
    this.elementHeights = this.setElementHeights();

    //set those elements styles
    this.setElementsStyles();
  }

  //find all blocks and place them
  rePack() {
    //reset column heights elements
    this.columnHeights = this.fillEmptyColumns();

    //reselect all elements
    this.elements = this.selectChildren(false);

    //set element height array
    this.elementHeights = this.setElementHeights();

    //set column width using first element since all have fixed width
    this.columnWidth = this.elements[0].offsetWidth;

    //set container width
    this.container.style.width = this.getContainerWidth();

    //set elements styles
    this.setElementsStyles();
  }
  //remove window resize listener
  destroy() {
    window.removeEventListener("resize", this.boundResize, false);
  }
}
