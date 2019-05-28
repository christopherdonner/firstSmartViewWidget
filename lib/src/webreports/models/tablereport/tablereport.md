# TableReport Model

**Module: webreports/models/tablereport/tablereport.model**

Returns a collection of table columns and data from the output of a WebReport. The WebReport used by this collection must be based on either the widget_table_report_process_data_in_webreport or widget_table_report_process_data_in_datasource default reportviews which use the INSERTJSON @TABLEREPORT directive. See WebReports documentation for more information on setting this up.

### Example

```javascript

var context = new PageContext(),
    connector = context.getObject(ConnectorFactory),
    tableReportCollection = new TableReportCollection(undefined,{
        context: context,
        connector: connector,
        data: {
            id: 440295,
            sortBy: 'SubType',
            sortOrder: 'DESC',
            swrLaunchCell: {
                id: 12345,
                iconClass: 'my-icon-class',
                hoverText: 'Some hover text for my icon.'
            },
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
        }
    });

    tableReportCollection.fetch()
            .done(function(){
                console.log(tableReportCollection);
            });
```

When creating a new NodesTableReport collection the first parameter for the constructor is for the collection attributes and the second is for the options.

### Attributes

No attributes defined

### Options

`connector` (Connector)
: **Mandatory.** A connector object instance referencing RequireJS path `csui/utils/connector`.


`context` (PageContext)
: **Optional.** A PageContext object instance referencing RequireJS path `csui/utils/contexts/page/page.context`.

### Options Data

`id` (integer)
: **Mandatory.** The DataID for the WebReport that contains the INSERTJSON @NODESTABLEFIELDS tag.

`sortBy` (string)
: **Mandatory.**The column name for the default sort column.

`sortOrder` (string)
: **Mandatory.** The default sort order. Valid values are "ASC" or "DESC".

`swrLaunchCell` (object)
 **Optional.** Specify a WebReport to be used when launching a SubWebReport. This renders a cell using 'webreports/controls/table.report/cells/launch.subwebreport/launch.subwebreport.view' using the ID value specified by the `id` property. The `iconClass` property can be used to provide a css class to customize the cell icon. The `hoverText` property can be used to specify custom hover text for the icon.

`parameters` (object)
 **Optional.** One or more "name"-"value" pairs for the parameters that you want to pass into the WebReport.