# ListView (controls/list)

  Shows a ListView. The ListView provides a generic list, which can apply different item types as list items.
  Currently it is used with [StandardListItem](#), [StatefulListItem](#) and [ObjectListItem](#).
  The type of list item is set through the property 'childView'.
  The list provides a header which has a configurable icon and title, along with a search icon.
  Clicking the search icon opens a search field replacing the header title. When text is entered in the search field
  a search is performed on the list items, eventually reducing their number. Clearing the field shows the complete
  list again, as does closing the search field by clicking on the search icon again.

### Example

    var FavoritesView = ListView.extend({

    constructor: function FavoritesView(options) {
      options || (options = {});
      options.titleBarIcon = options.showTitleIcon === false ? undefined : 'title-icon title-favourites';
      ListView.prototype.constructor.apply(this, arguments);
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.title || lang.dialogTitle,
        icon: this.options.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        hideSearch: false
      };
    },

    childView: StandardListItem,

    childViewOptions: {
      templateHelpers: function () {
        return {
          text: this.model.get('short_name'),
          icon: NodeSpriteCollection.findClassByNode(this.model)
        };
      }
    },

    behaviors: {

      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          return this.options.context.getCollection(FavoriteCollectionFactory);
        }
      },

      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: FavoritesTableView,
        orderBy: 'name asc',
        titleBarIcon: 'cs-icon-star',
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'favorites'
      },

      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    onClickItem: function (target) {
      //this.trigger('click:item');
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function( target) {
      this.triggerMethod('expand');
    }
    });

    var list = new ListView();
    list.render();



## Constructor Summary

### constructor(options)

  Creates a new StandardListItem.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* to evaluate a dynamic binding.
* `options.text` - *String* The text. It can be a static string or a binding expression of the form {<model attribute>},
which is tried to evaluate against the model given as 'model' parameter.
* `options.icon` - *String* A css class desribing an icon (as a background-image to a div).

#### Returns:

  The newly created object instance.

#### Example:

  See the [StandardListItem](#) object for an example.

## Events Summary

## click:item(event)

The event is fired if the authentication against the connection was successful.

### Parameters
* `event` - *Object* The event object

## Display options

### hideSearch
The search icon can be hidden from the view by adding a 'hideSearch: true' parameter to the templateHelpers function.
