# Perspective Manager

Perspective Manager enables editing of perspectives using Drag and Drop of various widgets.

## Responsibilities

    1. Masking page provided container to prevent widgets to receive events
    2. Perspective header with tools required for editing
        - Widgets to DnD
        - Save
        - Cancel
    3. Saving perspective changes

## Constructor

### Parameters

* `options` - *Object* The view's options object.
* `options.context` - *Context*.
* `options.perspective` - *Perspective* to edit.

### Returns

The newly created object instance.

## API

### `show`

Function to Enter into the perspective editing


### `hide`

Function to exit from perspective editing

## Events

### `enter:edit:perspective`

To allow perspecitve view to get ready for editing and apply perspective provided

#### Args

* `perspective` - Clone of perspective provided in constructor. All perspective editings will be applied to this.

### `exit:edit:perspective`

Exiting from perspective editing.

## Examples


```js
var context = new PageContext();
var perspective = ...;

var pmanView = new PManView({
    context: context,
    perspective: perspective
});
pmanView.show();

```