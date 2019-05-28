# RunWebReportPre Model

**Module: webreports/models/run.webreport.pre/run.webreport.pre.model**

Returns the Prompt Form Model for a given WebReport node, with additional fields containing a parametersModel and destinationModel for general information not associated with the prompt FormView. 


### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript

// Create a connector and context for your Content Server instance
var context = new PageContext(),
    connector = context.getObject(ConnectorFactory),
    // Create an instance of the RunWebReportPre model
    WRRunModel = context.getModel(WebReportRunModelFactory,{
        attributes: {
            id: 12345
        },
        options: {
            connector: connector,
            id: 12345
        }
    });

// Fetch the model data:
WRRunModel
    .fetch()
    .done(function (){
        
        // Pass the parameters' promptModel into a FormView to render the prompt fields:
        webreportRunFormView = new FormView({
            context: context,
            model: WRRunModel
        });
        
        // Destination and additional Parameter data models are included in the fetched data:
        console.log(WRRunModel.parametersModel); 
        console.log(WRRunModel.destinationModel);
        
        webreportRunFormRegion = new Marionette.Region({
            el: "#webreport-run-form"
        });

        webreportRunFormRegion.show(webreportRunFormView);

    });
```

### Attributes
`id` (integer)
: **Mandatory.** The DataID for the WebReport for which to check for Destination and Parameter Prompt data.  This is used to generate a unique property name for the factory for a given WebReport node.


### Options
`connector` (Connector)
: **Mandatory.** A connector object instance referencing RequireJS path `csui/utils/connector`

`id` (integer)
: **Mandatory.** The DataID for the WebReport for which to check for Destination and Parameter Prompt data.  
