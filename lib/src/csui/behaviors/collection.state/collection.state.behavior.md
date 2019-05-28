CollectionStateBehavior
=======================

Shows loading, empty or failing state of a collection view as a text,
which is refreshed on `request`, `sync` and `error` events of the view's
collection.  If the view supports blocking actions not limited to the
local view itself, it will take part on the delegated or lobal blocking
view.

This behavior utilizes the empty view concept.  When the collection
is fetched, the collection is cleared and until the fetch is finished,
the *loading* message stays displayed.  If no models are fetched, the
*empty* message will be shown.  If the fetch fails, the *failed* message
will be shown.

Usage
-----

You have to specify messages for the three possible view states; there
are no default texts:

    var ObjectListView = Marionette.CollectionView.extend({

      className: 'my-object-list',

      behaviors: {

        CollectionState: {
          behaviorClass: CollectionStateBehavior,
          stateMessages: {
            empty: 'No items found.',
            loading: 'Loading items...',
            failed: 'Loading items failed.'
          }
        }

      },

      ...

    });

You have to to specify styling of the element showing the state messages;
there is no default styling:

    .my-object-list .csui-collection-state {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-size: 20px;
      font-style: italic;
      font-weight: 300;
      color: #666666;
    }

You can specify a custom template for the state view, including the
`templateHelpers` method to override the default placeholder values;
the `message` placeholder will render the state message:

    CollectionState: {
      behaviorClass: CollectionStateBehavior,
      stateMessages: {
        empty: 'No objects found.',
        loading: 'Loading objects...',
        failed: 'Loading objects failed.'
      },
      stateViewOptions: {
        template: stateTemplate,
        templateHelpers: function () {
          return {...};
        }
      }
    }

    <span>{{message}}</span>

You can specify a custom state view; you will need to handle the three
view states on your own; there will be no `message` placeholder available
in the template data.  You can specify additional constructor options,
statically or dynamically:

    CollectionState: {
      behaviorClass: CollectionStateBehavior,
      stateView: MyIconStateView,
      stateViewOptions: {...}
    }

If you use a custom state view and need just one constructor option -
`stateMessages` - like the default state view, you can use the same property,
which will be passed as `options.stateMessages` to the view's constructor.
You can use the `stateViewOptions` parameter too; `stateMessages` will be
merged into its result:

    CollectionState: {
      behaviorClass: CollectionStateBehavior,
      stateView: MyIconStateView,
      stateMessages: {
        empty: 'No objects found.',
        loading: 'Loading objects...',
        failed: 'Loading objects failed.'
      }
    }

You can specify a custom collection to listen to:

    CollectionState: {
      behaviorClass: CollectionStateBehavior,
      collection: function () {
        return this.backendCollection;
      },
      stateMessages: {
        empty: 'No objects found.',
        loading: 'Loading objects...',
        failed: 'Loading objects failed.'
      }
    }
