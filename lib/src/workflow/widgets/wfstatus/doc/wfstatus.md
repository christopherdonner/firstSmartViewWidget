# WFStatusView (widgets/wfstatus)

### Workflow Status
Workflow Status is a status view for a running or completed workflows.


   Shows a WFStatusView. The WFStatusView provides, status of workflow assignments as given
   through the page context in doughnut chart. The doughnut shaped chart displays the sole status
   of all the workflows related to the page context, either on time, late or complete. Clicking
   on each doughnut segment or on the expanded icon opens the expanded view of My assignments with
   corresponding list of assignments.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          wfstatusView = new WFStatusView({context: pageContext});

      contentRegion.show(wfstatusView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new WFStatusView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [WFStatusView](#) object for an example.
    Workflow tracking as Tile View:
    - refer index.html (workflow/widgets/wfstatus/test/index.html)

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title


