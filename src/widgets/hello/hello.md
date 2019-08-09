# HelloView

Shows a panel greeting the currently authenticated user.  Sample usage:

    // Wrap the widget placeholder
    var contentRegion = new Marionette.Region(
          el: '#hello'
        }),
        // Create the data managing context
        context = new PageContext(),
        // Create the widget instance
        helloView = new HelloView({
          context: context
        });

      // Show the widget on the page
      contentRegion.show(helloView);
      // Load data from the server
      context.fetch();
