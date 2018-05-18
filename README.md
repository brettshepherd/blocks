
# blocks.ts

blocks.ts is a library for creating super performant fixed width masonry style layouts.
It was created using typescript, and compiled into production ready es5 javascript, with the additional support of .d.ts file, bringing you the benefits of type checking.

## Install

Using NPM, install blocks.ts and add it to your `package.json` dependencies.

```
$ npm install blocks.ts --save
```

## Instantiate

All you need to do is import Blocks and instantiate it, assigning it to a variable so you can call the appropriate functions.

```
// import Blocks
import Blocks from 'Blocks.ts'

// create an instance
const blocks = Blocks({
  // ...BlockOptions
})
```

## Block options

Note that all parameters, _except `position`_, are **required**:

* (required) **container** (node or CSS selector)
* (required) **sizes** (array)
* [position] **position** boolean (defaulting to `true`)
* [animationEndClass] **animationEndClass** string

### container

An element, or CSS selector, that represents the grid wrapper. The _direct children_ of this element must be the grid items.

```
// passing an element

const containerElement =  document.querySelector('.container');
const blocks = Blocks({
  container: containerElement
})

// passing a selector (document.querySelector is used to get the element)

const blocks = Blocks({
  container: '.container'
})
```

### sizes

An array of objects describing the grid's properties at different breakpoints.

When defining your sizes, note the following:

* Sizes must use **`min-width` media queries (px)**
* The `minWidth` property **must not be added** for your smallest default size

```
// minWidth- the minimum viewport width (px)
// columns - the number of vertical columns
// gutter  - the space (px) between the columns and grid items

const sizes: [
{columns: 1, gutter: 15},
{minWidth: 800, columns: 2, gutter: 20},
{minWidth: 1200, columns: 3, gutter: 20},
{minWidth: 1600, columns: 4, gutter: 20}
]

const blocks = Blocks({
  sizes: sizes
})
```

### position

A boolean, defaulting to `true`, indicating that the grid items should be positioned using the `top` and `left` CSS properties.

If set to `false`, the grid items will be positioned using the `transform` CSS property.

```
// grid items positioned via the 'transform' property

const blocks = Blocks({
  position: false
})
```

> note: the block container element needs to be positioned relative/absolute

### animationEndClass

If supplied, places the class on each block after the animation has completed. This is primarily used for transitioning element positions, as using a transition of transform or top/left directly on the block class would cause the elements to come in from position 0,0 when they are first loaded. By using an animation, such as a fade-in, then adding a transition to the animationEndClass, you can avoid this problem.

```
// animationEndClass supplied in javascript

const blocks = Blocks({
  animationEndClass: "placed"
})

//stlyes applied to a block

.block {
	width: 300px;
	background: black;
	animation: fadeIn 0.5s  ease-in;
}

//styles to be applied after block has been positioned

.block.placed {
	transition: all  0.4s; (allows block postion to transition when moved)
}
```

## API

Blocks exposes the following methods:

* **rePack()**
* **update()**
* **destroy()**

### .rePack()

Used to pack _all elements_ within the container.

```
// pack ALL grid items
	blocks.rePack()
```

Note that it should be called when creating your instance, to pack the initial items.

### .update()

Used to pack elements without the `packed` attribute within the container, primarily for when new elements are appended.

```
// pack NEW grid items
	blocks.update()
```

### .destroy()

Used to remove the window resize event listener.

```
// remove the resize listener
	blocks.destroy()      // 'false' removes it
})
```

## License

[MIT](https://opensource.org/licenses/MIT). © 2018 Brett Shepherd
