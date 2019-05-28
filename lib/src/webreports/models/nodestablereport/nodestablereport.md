# NodesTableReport Model

**Module: webreports/models/nodestablereport/nodestablereport.model**

Returns a collection of NodeModel objects. 

This collection must use the ID of a WebReport that uses the `widget_nodeslist_nodestable` default reportview. This uses the INSERTJSON tag with the @NODESTABLEFIELDS directive to return Smart UI compatible node data from nodes in the data source. See WebReports Tag Guide and NodesListReport widget documentation for more information.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript

// Create a connector for your Content Server instance
var connector = new Connector({
    connection: {
        url: '//server/instance/cs/api/v1',
        supportPath: '/instancesupport'
    }
}),
// Create an instance of the NodesTableReport model
nodesTableReportCollection = new nodesTableReportCollection(undefined,{
    connector: connector,
    id: 12345,
    parameters: [
        {
            name: 'myparm1',
            value: 'val1'
        },
        {
            name: 'myparm2',
            value: 'val2'
        }
    ]
});

nodesTableReportModel.fetch()
        .done(function(){
            console.log(nodesListReportModel.length);
        });
```

When creating a new NodesTableReport collection the first parameter for the constructor is for the collection attributes and the second is for the options.

### Attributes

No attributes defined

### Options

`connector` (Connector)
: **Mandatory.** A connector object instance referencing RequireJS path `csui/utils/connector`

`id` (integer)
: **Mandatory.** The DataID for the WebReport that contains the INSERTJSON @NODESTABLEFIELDS tag.

`parameters` (object)
: **Optional.** One or more “name”-“value” pairs for the parameters that you want to pass into the WebReport.