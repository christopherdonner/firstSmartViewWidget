Rich Text Editor Controller (csui/controls/rich.text.editor/rich.text.editor)
====================================================================================
> refer to this [ckeditor api docs](https://docs.ckeditor.com/ckeditor4/latest/api/).

## Including rich text editor
```js
require(['csui/controls/rich.text.editor/rich.text.editor'], function(RichTextEditor) {

});
```

## Get ckeditor    
`RichTextEditor.getRichTextEditor(config)`

## Config
```js
var config = {
    externalPlugins: ['plugin1', 'plugin2'],
    externalPluginBasePath: 'module/plugins/'   //folder name same as plugin name
},
ckeditor = RichTextEditor.getRichTextEditor(config);
```

## Config options
 Option                    | Type            | Default Value  | Description               
 ------------------------  | --------------- | -------------- | -----------------------
 externalPlugins           | array string    | undefined      | module specific plugins
 externalPluginsBasePath   | string          | undefined      | external plugins path

> Above config is csui specific. CKEditor config can be passed here which will override the default
  ckeditor config options.
  CKEditor config reference [CKEDITOR.config doc]( https://docs.ckeditor.com/ckeditor4/latest/api/CKEDITOR_config.html)


> **Caution! Each module should be careful on binding the events on direct ckeditor global instance.
 Binding and unbinding of events should be carefully done to prevent memory leakages and should
 never call `removeAllListeners()` on ckeditor to avoid ckeditor's unbinding of pre-binded events**

## Best practice to bind and unbind event on ckeditor global instance
CKEditor global instance is referenced by 2 ways:
- `window.CKEDITOR`, which is added by ckeditor lib to window object.
- `RichTextEditor.getRichTextEditor(config)`, which also returns the same ckeditor global instance.

> For binding and unbinding of events refer to [CKEDITOR.event doc](https://docs.ckeditor.com/ckeditor4/latest/api/CKEDITOR_event.html)

## DON'TS: binding/unbinding events
```js
//inside some function or constructor    
ckeditor.on('instanceReady', function(event) {
    // function body
});

// on view destroy or ckeditor sub-instance destroy (window.CKEDITOR.instances)
ckeditor.removeAllListeners();  // Never do like this
```
Anonymous function don't have any reference so unbinding the event is not possible on it without
using removeAllListener() which is completely wrong.

> **Caution!** as mentioned above, we should never call `removeAllListeners()` on ckeditor global
instance.

## DOS: binding/unbinding events
```js
this._onInstanceReady = function(event) {
    // function body
    // this -> refers to ckeditor instance
};

this._onInstanceReady = _.bind(function(event) {
    // function body
    // this -> referes to the view
}, this);

ckeditor.on('instanceReady', this._onInstanceReady);

on view destroy or ckeditor sub-instance destroy (`window.CKEDITOR.instances`) created on el.

ckeditor.removeListener('instanceReady', this._onInstanceReady);
```

> Make sure the event functions are properly referenced and in removal of listener it points to the
same function reference otherwise due to memory leakages, it may cause several problems in modules
who so ever using ckeditor.

## Check events binded to ckeditor global instance
`window.CKEDITOR._.events`
