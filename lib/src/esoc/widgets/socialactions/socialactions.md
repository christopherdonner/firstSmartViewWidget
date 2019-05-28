# EsocialView

Shows a panel eSocial-commenting the currently authenticated user.  Sample usage:

    var contentRegion = ..., // Marionette.Region
        connector = ...,     // Connector

        // Create the widget instance
        esocialView = new EsocialView({
          connector: connector
        });

      // Show the widget on the page
      contentRegion.show(esocialView);
