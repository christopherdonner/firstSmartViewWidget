# pman.widget.config.behaviour

Perspective widget configuration behaviour to be applied to widgets of perspective to be able to configure them and get ready for DnD

## Responsibilities

  * Masking the unit level widget of perpsective. In case of grid.view, it will be cell
  * Listen and handle DnD of widgets and act accordingly - replace widgets
  * Deleting a widget from perspective
  * Configuration of widget using callouts

## Required Inputs

  * `perspectiveView` to let know about editing change

## Events

### `replace:widget`

This even will be fired on `perspectiveView` when dropping any widget from tools.

### `delete:widget`

This event will be fired on `perspectiveView` when deleting any widget.