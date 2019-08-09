# NodeInfoView

Shows a panel with the common properties of the node, volume or containing
workspace (project or connected) for the node currently opened in the context.

## Example

    // Wrap the widget placeholder
    var contentRegion = new Marionette.Region(
          el: '#hello'
        }),
        // Create the data managing context
        context = new PageContext({
          factories: {
            node: {
              attributes: {
                id: 12345
              }
            }
          }
        }),
        // Create the widget instance
        nodeInfoView = new NodeInfoView({
          context: context,
          data: {
            node: true,
            containingWorkspace: true,
            volume: false
          }
        });

      // Show the widget on the page
      contentRegion.show(nodeInfoView);
      // Load data from the server
      context.fetch();
