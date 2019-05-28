ItemErrorBehavior
=================

Shows the failing state of an item view in an embedded error control,
which replaces the template and the content of the view.

Showing the error control is triggered by the `error` event of the view's
model and takes place during re-rendering of the whole view.

Usage
-----

    var ObjectView = Marionette.ItemView.extend({

      className: 'my-object',

      behaviors: {

        ItemError: {
          behaviorClass: ItemErrorBehavior
        }

      },

      ...

    });

You can specify a custom model to listen to:

    ItemError: {
      behaviorClass: ItemErrorBehavior,
      model: function () {
        return this.backendModel;
      }
    }

You can specify a custom element or element selector within the view,
if the error control should not be rendered over the entire view:

    ItemError: {
      behaviorClass: ItemErrorBehavior,
      el: '.my-error'
    }

You can specify a custom region within the view, if the error control
should not be rendered over the entire view:

    ItemError: {
      behaviorClass: ItemErrorBehavior,
      region: function () {
        return this.contentRegion;
      }
    }

You can specify a custom error view or custom error view options, which
will be added to the error model, possibly overriding it:

    ItemError: {
      behaviorClass: ItemErrorBehavior,
      errorView: MyErrorView,
      errorViewOptions: {...}
    }
