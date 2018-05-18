var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var Blocks = /** @class */ (function () {
    //--------constructor--------
    function Blocks(options) {
        //element heights array
        this.elementHeights = [];
        //grid sizes object
        this.sizes = [];
        //window resize delay in milliseconds
        this.resizeDelay = 100;
        // is currently throttling resize
        this.resizeThrottle = false;
        //place elements using position of transform
        this.usePosition = true;
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
        this.sizes.sort(function (a, b) { return b.minWidth - a.minWidth; });
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
    Blocks.prototype.selectChildren = function (onlyUnPacked) {
        //if selecting non packed elements
        if (onlyUnPacked) {
            return Array.from(this.container.children).filter(function (node) {
                return !node.hasAttribute("data-packed");
            });
            //select every element
        }
        else {
            return Array.from(this.container.children);
        }
    };
    //return array of all container children heights
    Blocks.prototype.setElementHeights = function () {
        var heights = [];
        this.elements.forEach(function (element) {
            heights.push(element.clientHeight);
        });
        return heights;
    };
    //return array with a length of # of columns, and value of 0
    Blocks.prototype.fillEmptyColumns = function () {
        return new Array(this.currentSize.columns).fill(0);
    };
    //find appropriate column for element, and set styles to place block
    Blocks.prototype.setElementsStyles = function () {
        var _this = this;
        this.elements.forEach(function (element, index) {
            //set column
            var columnTarget = _this.columnHeights.indexOf(Math.min.apply(Math, __spread(_this.columnHeights)));
            //set element as absolute
            element.style.position = "absolute";
            //set node postion
            var elemTop = _this.columnHeights[columnTarget] + "px";
            var elemLeft = columnTarget * _this.columnWidth +
                columnTarget * _this.currentSize.gutter + "px";
            //by postition
            if (_this.usePosition) {
                element.style.top = elemTop;
                element.style.left = elemLeft;
            }
            else {
                //by transform
                element.style.transform = "translate3d(" + elemLeft + " , " + elemTop + ", 0)";
            }
            //set packed data attribute
            element.setAttribute("data-packed", "");
            // set packed class if an animation class is provided
            if (_this.animationEndClass) {
                element.addEventListener("animationend", function () {
                    element.classList.add(_this.animationEndClass);
                }, { once: true });
            }
            _this.columnHeights[columnTarget] +=
                _this.elementHeights[index] + _this.currentSize.gutter;
        });
    };
    //check media querys and return approprite size base on passed in options
    Blocks.prototype.checkMediaQuery = function () {
        // find index of widest matching media query
        var sizeIndex = this.sizes
            .map(function (size) {
            return (size.minWidth &&
                window.matchMedia("(min-width: " + size.minWidth + "px)").matches);
        })
            .indexOf(true);
        //if no media query match, use first index
        return sizeIndex === -1 ? this.sizes[0] : this.sizes[sizeIndex];
    };
    //repack if reached new media query
    Blocks.prototype.onWindowResize = function () {
        var newSize = this.checkMediaQuery();
        if (this.currentSize != newSize) {
            this.currentSize = newSize;
            this.rePack();
        }
    };
    //optimized window resize function, only executing based on resize delay
    Blocks.prototype.setupResize = function () {
        var _this = this;
        // only run if we're not throttled
        if (!this.resizeThrottle) {
            // actual callback action
            this.onWindowResize();
            // we're throttled!
            this.resizeThrottle = true;
            // set a timeout to un-throttle
            setTimeout(function () {
                _this.resizeThrottle = false;
            }, this.resizeDelay);
        }
    };
    //return the calculated parent containers width, based on gutters and column width
    Blocks.prototype.getContainerWidth = function () {
        return this.columnWidth * this.currentSize.columns +
            this.currentSize.gutter * (this.currentSize.columns - 1) + "px";
    };
    //update layout, only packing newly found unpacked blocks (used for appending)
    Blocks.prototype.update = function () {
        //select unpacked elements
        this.elements = this.selectChildren(true);
        //get those elements heights
        this.elementHeights = this.setElementHeights();
        //set those elements styles
        this.setElementsStyles();
    };
    //find all blocks and place them
    Blocks.prototype.rePack = function () {
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
    };
    //remove window resize listener
    Blocks.prototype.destroy = function () {
        window.removeEventListener("resize", this.boundResize, false);
    };
    return Blocks;
}());
export { Blocks };
