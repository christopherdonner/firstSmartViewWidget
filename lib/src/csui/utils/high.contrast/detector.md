HighContrastDetector
====================

RequireJS plugin detecting if the high-contrast has been enabled in the web browser.
It checks the colour contrast only once and if required later, it returns the initial
result:

 ```javascript
require([
  ...
  'csui/utils/high.contrast/detector!'
], function (..., highContrast) {
  // highContrast will be false or true
});
```

In addition to the returned boolean, this plugin it adds or removes the class
"csui-highcontrast" to the root `html` element of the web page. It can be used
in selectors of high-contrast specific styles:

```css
.csui-highcontrast .binf-widgets ... {
  ...
}
```
