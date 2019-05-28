# TabPanelView

**Module: csui/controls/tab.panel/tab.panel.view**

Renders a panel made of button links and content panes using Bootstrap Tabs.

### Overridables

***contentView***
: View to render in the content pane of a tab (Backbone.View or a function
  returning a Backbone.View, mandatory)

***contentViewOptions***
: Constructor options for a new content view instance (object literal or a
  function returning an object literal, optional)

### Examples

```
TabPanelView    <div class="tab-panel" role="tabpanel">

TabLinksView      <div class="tab-links">

                    <ul class="nav nav-tabs" role="tablist">
                    
TabLinkView           <li role="tab">

                        <a href="#{{id}}" aria-controls="{{id}}"
                           data-toggle="tab">{{title}}</a>
                           
                      </li>
                      
                    </ul>
                    
                  </div>

TabContentView    <div class="tab-content">

                    <div role="tabpanel" class="tab-pane fade" id="{{id}}">

ContentView           ...

                  </div>

                </div>
```

---
## TabPanelView(options)

Creates a new instance.

### Options

Tabs can be populated by a collection or by an array `options.tabs`;
the collection is created automatically from the options in the latter case.

***collection***
: List of tab models controlling the tab links and panes (Backbone.Collection,
  mandatory if `tabs` not provided, otherwise ignored)

***tabs***
: List of tab definitions controlling the tab links and panes (array of object
  literals, mandatory if `tabs` not provided, otherwise ignored)

***delayTabContent***
: Delays creation of the tab content until the tab get activated (boolean,
  `false` by default, ignored if `mode` is 'spy')

#### Tab

***title***
: Title of the tab link to switch to the tab content (string, mandatory)

***id***
: Unique ID used internally by the Bootstrap implementation; generated
  automatically if not provided (string, optional)

Other properties can be used by the content view.

```json
{
  "title": "Overview",
  ...
}
```

### Examples

```
// Create tabs saying hello to specified users
var HelloView = Backbone.View.extend({
      render: function () {
        this.$el.text('Hello, ' + this.model.get('title'), +'!');
        return this;
      }
    }),

    tabPanelView = new TabPanelView({
      contentView: HelloView,
      tabs: [
        {title: 'Joe'},
        {title: 'Jane'}
      ]
    }),

    tabsRegion = new Marionette.Region({el: 'body'}),

tabsRegion.show(tabPanelView);

// Create tabs rendered by different views
var FirstView = Backbone.View.extend({
      render: function () {
        this.$el.text('First ' + this.model.get('gender'));
        return this;
      }
    }),

    OtherView = Backbone.View.extend({
      render: function () {
        this.$el.text('Other ' + this.model.get('gender'));
        return this;
      }
    }),

    MyTabPanelView = new TabPanelView.extend({
      contentView: function (model) {
        if (this.collection.indexOf(model) === 0) {
          return FirstView;
        } else {
          return OtherView;
        }
      }
    }),

    people = new Backbone.Collection([
      {title: 'Joe',  gender: 'male'},
      {title: 'Jane', gender: 'female'}
    ]),

    tabPanelView = new MyTabPanelView({
      collection: people
    }),

    tabsRegion = new Marionette.Region({el: 'body'}),

tabsRegion.show(tabPanelView);
```
