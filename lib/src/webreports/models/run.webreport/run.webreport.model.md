# RunWebReportPre Model

**Module: webreports/models/run.webreport/run.webreport.model**

A model for executing a WebReport.  This is an interface for the /output RestAPI for WebReport nodes.


### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript

    // Create a connector and context for your Content Server instance
    var context = new PageContext(),
        connector = context.getObject(ConnectorFactory),
        WRRunModel = context.getModel(WebReportRunModelFactory, {
            attributes: { id: 12345 },
            options: {
                connector: connector,
                id: 12345,
                parameters: {
                    "inputLabel1":"value1",
                    "inputLabel2":"value2"
                }
            }
        });


    WRMock.enable();

    WRRunModel
            .sync( "create", WRRunModel, {
                attrs: {
                    "method": "POST"
                },
                success: function(resp) {
                    // store the response as the model's attrs:
                    alert("The WebReport was executed.")
                }
            });
```

### Attributes
`id` (integer)
: **Optional.** The DataID of the WebReport to be executed.  This is used to generate a unique property name for the factory for a given WebReport node.


### Options
`connector` (Connector)
: **Mandatory.** A connector object instance referencing RequireJS path `csui/utils/connector`

`id` (integer)
: **Mandatory.** The DataID of the WebReport to be executed.

`parameters` (Object)
: **Optional.**  An object containing name/value pairs for any optional parameters that will be passed into the WebReport being executed as Parameters.
