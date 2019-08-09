# GreetingView

Shows a panel greeting a specified subject.  Sample usage:

    // Wrap the widget placeholder
    var contentRegion = new Marionette.Region(
          el: '#greeting'
        }),
        // Create the data managing context
        context = new PageContext(),
        // Create the widget instance
        greetingView = new GreetingView({
          context: context
        });

      // Show the widget on the page
      contentRegion.show(greetingView);
      // Load data from the server
      context.fetch();
