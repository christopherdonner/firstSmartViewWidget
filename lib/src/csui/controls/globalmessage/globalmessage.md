# GlobalMessage

Shows temporary message alerts in the dedicated region on the page,
by default at the top.

## Methods

Methods showing messages can work only after the region to contain them has
been specified by calling `setMessageRegionView`.

### setMessageRegionView(view)

Messages are displayed at the top of the page by default and they can span over 
the entire page height.  If you want to move the location and/or limit the space
for the message to a specific rectangle on the page, you can use this method.

If you display a bigger widget like NodesTable, for example, you can pass the view,
which makes the boundary of the space for the messages to this method.

```javascript
csui.onReady2([
  'csui/lib/marionette', 'csui/utils/contexts/browsing/browsing.context',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/globalmessage/globalmessage'
], function (Marionette, BrowsingContext, NodesTableView, GlobalMessage) {
  'use strict';
  var contentRegion = new Marionette.Region({el: '#content'}),
      browsingContext = new BrowsingContext(),
      nodesTableView = new NodesTableView({context: browsingContext});
  
  GlobalMessage.setMessageRegionView(nodesTableView);
  contentRegion.show(nodesTableView);
  browsingContext.fetch();
});
```

### showCustomView(customView)

Shows a custom view provided by the caller. The view should offer some means
to destroy itself; it will not be removed from the page automatically. As
soon as the custom view gets destroyed, it will be removed from the page.

```javascript
// Create an instance of the custom view and show it
var customView = new CustomView();
GlobalMessage.showCustomView(customView);
```

```javascript
// custom.view.js: declare the custom view object
var CustomView = Marionette.ItemView.extend({
  className: 'custom-message',
  template: template, // from custom.hbs and custom.css
  events: {
    'click button': function () {
      this.$el.fadeOut(300, this.destroy.bind(this));
    }
  }
});
```

```html
<!-- custom.hbs -->
<p>This page is out-of-date.</p>
<button type="button" class="binf-btn binf-btn-primary">Reload</button>
```

```css
/* custom.css */
.custom-message {
  background-color: #f7f7f7;
  height: 100px;
}
.custom-message p {
  font-size: 1.5em;
  margin: .5em;
}
.custom-message .binf-btn {
  border-radius: 16px;
  float: right;
  margin-right: 1em;
}
```

### showMessage(type, text, details)

Shows a textual message at the top of the page.  Messages of the type
"success" are hidden automatically, other types need to be hidden by
clicking on the close button.  Messages of the type "none" have no icon
and neutral styling; other message types have distinct colours.

#### Arguments:

***type*** (string)
: Type of the message: "info", "success", "warning", "error", "none".

***text*** (string)
: Message to show in the header of the message panel.

***details*** (string)
: An optional text, which can be displayed by clicking on the "Details"
  button in the body of the message panel.  If this parameter is not
  provided, there is no "Details" button and even no message panel body
  rendered.
