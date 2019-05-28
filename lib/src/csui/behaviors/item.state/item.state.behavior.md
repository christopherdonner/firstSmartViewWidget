ItemStateBehavior
=================

Shows loading and failing state of an item view as a text, which is
refreshed on `request`, `sync` and `error` events of the view's
model.  If the view supports blocking actions not limited to the
local view itself, it will take part on the delegated or lobal blocking
view.

When the model is fetched, the model is cleared and until the fetch is
finished, the *loading* message stays displayed. If the fetch fails,
the *failed* message will be shown.

Usage
-----

You have to specify messages for the three possible view states; there
are no default texts:

    var ObjectView = Marionette.ItemView.extend({

      className: 'my-object',

      behaviors: {

        ItemState: {
          behaviorClass: ItemStateBehavior,
          stateMessages: {
            loading: 'Loading item...',
            failed: 'Loading item failed.'
          }
        }

      },

      ...

    });

You have to to specify styling of the element showing the state messages;
there is no default styling:

    .my-object .csui-item-state {
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

    ItemState: {
      behaviorClass: ItemStateBehavior,
      stateMessages: {
        loading: 'Loading object...',
        failed: 'Loading object failed.'
      },
      stateViewOptions: {
        template: stateTemplate,
        templateHelpers: function () {
          return {...};
        }
      }
    }

    <span>{{message}}</span>

You can specify a custom state view; you will need to handle the two
view states on your own; there will be no `message` placeholder available
in the template data.  You can specify additional constructor options,
statically or dynamically:

    ItemState: {
      behaviorClass: ItemStateBehavior,
      stateView: MyIconStateView,
      stateViewOptions: {...}
    }

If you use a custom state view and need just one constructor option -
`stateMessages` - like the default state view, you can use the same property,
which will be passed as `options.stateMessages` to the view's constructor.
You can use the `stateViewOptions` parameter too; `stateMessages` will be
merged into its result:

    ItemState: {
      behaviorClass: ItemStateBehavior,
      stateView: MyIconStateView,
      stateMessages: {
        loading: 'Loading objects...',
        failed: 'Loading objects failed.'
      }
    }
