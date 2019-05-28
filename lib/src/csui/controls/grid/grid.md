# GridView

**Module: csui/controls/grid/grid.view**

Renders a responsive grid of rows and columns using Bootstrap Grid.

### Overridables

***cellView***
: View to render in the content of a cell (Backbone.View or a function
  returning a Backbone.View, mandatory)

***cellViewOptions***
: Constructor options for a new cell view instance (object literal or a
  function returning an object literal, optional)

### Examples

```
GridView     <div class="container-fluid">

RowView        <div class="row">

ColumnView       <div class="col-sm-6 col-md-3">

CellView           ...

                 </div>

               </div>

             </div>
```

---
## GridView(options)

Creates a new instance.

### Options

Grid cells can be populated by a collection or by an array `options.rows`;
the collection is created automatically from the options in the latter case.

***collection***
: List of grid row models controlling the grid rows and columns
  (Backbone.Collection, mandatory if `rows` not provided, otherwise ignored)

***tabs***
: List of grid row and column definitions controlling the grid cells
  (array of object literals, mandatory if `tabs` not provided, otherwise ignored)

#### Row

***columns***
: Either a sub-collection of a row model, or an array of object literals if
  the `options.rows` were used to initialize the grid.

```json
{
  "columns": [...]
}
```

#### Column

***sizes***
: Sets the cell width for different viewport sizes using a map of Bootstrap
  device sizes as keys and counts of 12-column grid columns as values
  (object literal, at least one key mandatory)

***pulls***
: Sets the cell displacement to the left for different viewport sizes using a map
  of Bootstrap device sizes as keys and counts of 12-column grid columns as values
  (object literal, optional)

***pushes***
: Sets the cell displacement to the right for different viewport sizes using a map
  of Bootstrap device sizes as keys and counts of 12-column grid columns as values
  (object literal, optional)

***offsets***
: Sets the fixed cell position from the row beginning for different viewport sizes
  using a map of Bootstrap device sizes as keys and counts of 12-column grid
  columns as values (object literal, optional)

***heights***
: Sets the cell height for different viewport sizes using a map of sizes as keys
  and string constants `full`, 'three-quarters`, `two-thirds`, `half`, `third` and
  `quarter` as values (object literal, optional)

Setting the height works only if the `grid-rows` CSS class is added to the grid
container element.  Grid cells without a specific height will be sized using
media queries automatically to show a grid of rather bigger tiles.

Other properties can be used by the cell view.

```json
{
  "sizes": {...},
  "pulls": {...},
  "pushes": {...},
  "offsets": {...},
  "heights": {...}
}
```

### Examples

```
// Create grid cells with names of specified users
var HelloView = Backbone.View.extend({
      render: function () {
        this.$el.text(this.model.get('name'));
        return this;
      }
    }),

    gridView = new GridView({
      cellView: HelloView,
      rows: [
        {
          columns: [
            {
              sizes: {sm: 6},
              name: 'Joe'
            },
            {
              sizes: {sm: 6},
              name: 'Jane'
            }
          ]
        }
      ]
    }),

    gridRegion = new Marionette.Region({el: 'body'}),

gridRegion.show(gridView);

// Create grid cells rendered by different views
var MaleView = Backbone.View.extend({
      render: function () {
        this.$el.text('Handsome ' + this.model.get('name'));
        return this;
      }
    }),

    FemaleView = Backbone.View.extend({
      render: function () {
        this.$el.text('Beautiful ' + this.model.get('name'));
        return this;
      }
    }),

    MyGridView = new GridView.extend({
      contentView: function (model) {
        switch (this.model.get('gender')) {
          case 'male':
            return MaleView;
          case: 'female':
            return FemaleView;
        }
      }
    }),

    HumanCell = Backbone.Model.extend({
      initialize: function (attributes, options) {
        this.columns = new Backbone.Collection(attributes.columns);
      }
    }),

    people = new Backbone.Collection([
      {
        columns: [
          {
            sizes: {sm: 6},
            name: 'Joe',
            gender: 'male'
          },
          {
            sizes: {sm: 6},
            name: 'Jane',
            gender: 'female'
          }
        ]
      },
      {model: HumanCell}
    ),

    gridView = new MyGridView({
      collection: people
    }),

    gridRegion = new Marionette.Region({el: 'body'}),

gridRegion.show(gridView);
```
