# RunWebReportPre Controller

**Module: webreports/controls/run.webreport.pre/run.webreport.pre.controller**

An object of util functions used for retrieving and processing 'run' related information for a WebReport, including Destination and Parameter Prompt models.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript
var pageContext = new PageContext(),
    currentNode = pageContext.getModel(NodeModelFactory, {attributes: {id: 348547}}),
    runWRController = new RunWRController(); // create an instance of the RunWebReportPre controller

// call a function of the controller:
runWRController.getRunWRPreModel({
							node: currentNode,
							context: pageContext
						})
```
