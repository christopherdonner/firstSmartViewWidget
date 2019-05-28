CollectionErrorBehavior
=======================

Shows the failing state of a collection view in an embedded error
control, which replaces the content of the view. This behavior utilizes
the empty view concept.

Showing the error control is triggered by the `error` event of the view's
collection and takes place during re-rendering of the whole view.

Usage
-----

    var ObjectView = Marionette.CollectionView.extend({

      className: 'my-objects',

      behaviors: {

        CollectionError: {
          behaviorClass: CollectionErrorBehavior
        }

      },

      ...

    });

You can specify a custom collection to listen to:

    CollectionError: {
      behaviorClass: CollectionErrorBehavior,
      collection: function () {
        return this.backendCollection;
      }
    }
