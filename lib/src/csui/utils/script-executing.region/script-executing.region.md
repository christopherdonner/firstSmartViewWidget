ScriptExecutingRegion
=====================

Shows a `Backbone.View`, which includes `<script>` elements in its HTML
content. The code in these elements will be executed, once the view gets
added to DOM of the HTML page.

`Marionette.Region` appends the child view by `HTMLElement.appendChild`,
which does not execute code in `<script>` elements. `$.append` used by
this custom region does.

The view with the HTML content should be shown first, when the region's
element has been appended to DOM, otherwise you will need to ensure, that
the view, which eventually appends all sub-views to DOM uses these custom
regions.

```javascript
var HTMLContentChildView = Marionette.ItemView.extend({
      template: false,
      constructor: function HTMLContentChildView(options) {
        Marionette.ItemView.prototype.constructor.apply(this, arguments);
        this.listenTo(this.model, 'change', this.render);
      },
      onRender: function() {
        var source = this.model.get('source');
        if (source) {
          this.$el.html(source);
        }
      }
    }),

    HTMLContentTileView = TileView.extend({
      icon: 'title-htmlcontent',
      title: 'HTML Content',
      contentView: HTMLContentChildView,
      regionClass: ScriptExecutingRegion
    }),

    htmlContent = new Backbone.Model(),

    htmlContentTileView = new HTMLContentTileView({
      contentViewOptions: function () {
        return htmlContent;
      }
    });

    htmlContentRegion = new ScriptExecutingRegion({el: '#html-tile'});

htmlContentRegion.show(htmlContentTileView);

htmlContent.set('source', '<p>updated</p><script>alert("hello");</' + 'script>');

```
