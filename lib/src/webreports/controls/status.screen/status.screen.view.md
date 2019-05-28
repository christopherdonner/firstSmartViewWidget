# RunWebReportPre Controller

**Module: webreports/controls/status.screen/status.screen.view**

A view displaying the response of the a WebReport execution, designed to be rendered in a DialogView.  Any Node models related to the specific Destination must be passed in the options.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript
require(['csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/contexts/page/page.context',  'csui/utils/contexts/factories/connector',
			'csui/controls/globalmessage/globalmessage',
			'webreports/controls/status.screen/status.screen.view',
			'webreports/models/run.webreport.pre/run.webreport.pre.model',
			'webreports/models/run.webreport/run.webreport.model',
			'./status.screen.mock.js'
		], function (_, Marionette, PageContext, ConnectorFactory, GlobalMessage, StatusScreenView, WebReportRunModelPre, WebReportRunModel, WRMock) {

			var statusView,
				context = new PageContext(),
				connector = context.getObject(ConnectorFactory),
				region = new Marionette.Region({el: "#webreport-status-screen-demo"}),
				attributes = { id: 678823 },
				options = { connector: connector },
				WRRunPreModel = new WebReportRunModelPre(attributes, options),
				WRRunModel = new WebReportRunModel(attributes, options);

			WRMock.enable();

			WRRunPreModel
					.fetch()
					.done( function(){

						WRRunModel
							.fetch()
							.done( function(){

								statusView = new StatusScreenView({
									destinationModel: WRRunPreModel.destinationModel,
									executeModel: WRRunModel
								});

								region.show(statusView);
							})
					})

		});
```

### Options

`destinationModel` (Destination Model)
: **Mandatory.** The "destinationModel" returned by fetching /webreports/model/run.webreport.pre.  The attributes for this model outline destination-specific information for the WebReport's execution.

`executeModel` (Run WebReport Model)
: **Mandatory.** The /webreports/model/run.webreport execution model.  The attributes for this model include resolved destination-specific information after the WebReport has fully executed.

`primaryNode` (Node Model)
: **Optional.** A Node model of the target output for the WebReport (ie - the newly created Document when the Destination settings create a new Content Server Node).  This is only required if using a Node, Version, or Workflow Destination.

`secondaryNode` (Node Model)
: **Optional.** A Node model of the target output PARENT for the WebReport output (ie - the parent of the newly created Document when the Destination settings create a new Content Server Node).  This is only required if using a Node, Version, or Workflow Destination.
