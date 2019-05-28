ToolbarStateBehavior
=======================

Shows loading or failing state of toolbar-supporting actions as a text,
which is enabled on the `request` event and disabled on the `sync` event.
If fetching of permitted actions fails, an error text will be shown.

This behavior utilizes the empty view concept.  When the delayed action
collection is geting fetched, it is expected to be empty and if the fetch
fails, the collection is expected to stay empty.

Usage
-----

You can apply the behavior to the `ToolbarView` using default options:

    var DelayedToolbarView = ToolbarView.extend({

      className: 'my-delayed-toolbar',

      behaviors: {

        ToolbarState: {
          behaviorClass: ToolbarStateBehavior
        }

      },

      ...

    });

If the tool item collection does not carry the `delayedActions` property,
you have to specify the delayed action collection explicitly, by the view's
constructor option, for example:

    var DelayedToolbarView = ToolbarView.extend({

      behaviors: {

        ToolbarState: {
          behaviorClass: ToolbarStateBehavior,
          delayedActions: function () {
            return this.options.delayedActions;
          }
        }

      },

      ...

    });

When initializing the toolbar view with a tool item collection filtered
by action permissions, use a tool item collection, which stays empty
during the fetch, or if the fetch fails:

    var MyDelayedToolbarView = ToolbarView.extend({

      behaviors: {

        ToolbarState: {
          behaviorClass: ToolbarStateBehavior
        }

      },

      constructor: function MyDelayedToolbarView(options) {
        _.extend(options, {
          collection: new FilteredToolItemsCollection(
              options.toolItemFactory, {
                status: {
                  nodes: options.selectedNodes
                },
                commands: options.commands,
                delayedActions: options.displayedNodes.delayedActions
              })
        }, toolItemFactory.options)

        ToolbarView.prototype.constructor.call(this, options);
      },

      ...

    });

You can also embed a toolbar view and pass a tool item collection to its
constructor, which stays empty during the fetch, or if the fetch fails.
If you want to show the state message on the toolbar only if there are
any objects selected (the toolbar could be empty otherwise), you can update
the toolbar action state on object selection changes:

    var MyNodesView = Marionette.LayoutView.extend({

      constructor: function TopToolbarView(options) {
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);

        var selectedNodes = new NodeCollection(),
            toolItemFactory = options.toolItemFactory,
            delayedActions = options.displayedNodes.delayedActions,
            filteredToolItems = new FilteredToolItemsCollection(
                toolItemFactory, {
                  status: {
                    nodes: selectedNodes
                  },
                  commands: commands,
                  delayedActions: delayedActions
                }),
            toolbarView = new DelayedToolbarView(_.extend({
              collection: filteredToolItems
            }, toolItemFactory.options));

        if (delayedActions) {
          this.listenTo(selectedNodes, 'add,remove,reset', function () {
            toolbarView.actionState.set('showMessage', !!selectedNodes.length);
          });
        }
      },

      ...

    });

You have to specify styling of the element showing the state messages;
there is no default styling:

    .my-delayed-toolbar > ul > li.csui-toolbar-state {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      padding-top: 0.6em;
      font-style: italic;
      font-weight: 300;
      color: #666666;
    }
