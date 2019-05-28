VisualDataFilteredCountView
========

Shows a filtered count chart in a tile. Currently supported chart types for the filtered count widget are pie, donut and bar. This widget requires a WebReport to be used to get the data. There are default reportviews that generate data in the correct format. 

The widget supports showing grouped counts of distinct values in a particular WebReport data source column. The active column and other aspects of the chart view can be dynamically changed in the UI both in the smaller tile view and in the expanded view if the relevant options are enabled.

The expanded view has support for additional features such as dynamically filtering columns by one or more values. It also allows one or more custom launch buttons to be added which can run a WebReport to process the grouped and filtered data.

This widget is fully documented in the Perspective Manager help. 

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

```javascript

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          barChartView = new VisualDataFilteredCountView({
                            context: pageContext,
                            data: {
                              id: 12345,
                              title: 'My Bar Chart',
                              type: 'bar',
                              activeColumn: 'Habitat',
                              filterable: true,
                              expandable: true,
                              viewValueAsPercentage: false,
                              groupAfter: -1,
                              sortBy: 'ordinal',
                              sortOrder: 'asc',
                              launchButtonConfig: {
                                rowLimit: 2000,
                                launchButtons:
                                        [
                                          {
                                            launchButtonID: 12345,
                                            launchButtonLabel: "label1",
                                            launchButtonTooltip: "tooltip1"
                                          },
                                          {
                                            launchButtonID: 54321,
                                            launchButtonLabel: "label2",
                                            launchButtonTooltip: "tooltip2"
                                          },
                                          {
                                            launchButtonID: 88888,
                                            launchButtonLabel: "label3",
                                            launchButtonTooltip: "tooltip3"
                                          }
                                        ]
                              },
                              filters: [{"column":"Legs","operator":"IN","value":["4"]},{"column":"Tail","operator":"IN","value":["yes"]}]
                            }
                          });

      contentRegion.show(barChartView);
      pageContext.fetch();


```

### Options

`id` (integer)
: **Mandatory.** DataID for the WebReport which contains the Visualization data

`activeColumn` (string)
: **Mandatory.** The name of the column in the data source which will be used to group and count the data.

`title` (string)
: **Optional.** The title of the tile to be rendered in the tile header

`type` (string)
: **Optional.** Defines the type of visualization used for your data set.
    Valid values are: ["bar","donut","pie"].
    Default = "bar".

`filterable` (boolean)
: **Optional.** Determines whether the control for filtering is available in the tile view. 
  Default = false.
  
`expandable` (boolean)
: **Optional.** Determines whether the expanded view is available. 
    Default = false.

`viewValueAsPercentage` (boolean)
: **Optional.** Determines whether the count values are shown as actual or percentages.
    Default = false.

`groupAfter` (integer)
: **Optional.** The threshold used to determine how many distinct data values should be displayed before grouping the remaining values under Other. 
    Valid values: [-1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    Default = -1 (This uses the default for the particular chart type. Bar chart default: 15, Pie chart default: 5, Donut chart default: 5.)
    
`sortBy` (string)
: **Optional.** Defines the type of visualization used for your data set.
    Valid values are: ["ordinal","Count"].
    Default = "Count".
 
`sortOrder` (string)
: **Optional.** Defines the type of visualization used for your data set.
    Valid values are: ["desc","asc"].
    Default = "desc".

`filters` (array)
: **Optional.** Array of objects defining any default filters to be applied. These will show as applied in the expanded view when the chart is loaded and can be removed by the user.
    
`launchButtonConfig` (Object)
: **Optional.** Object containing the `launchButtons` array to define custom buttons in the expanded view which can run a WebReport. There is also a `rowLimit` integer to limit the number of items that can be exported in the UI for performance reasons.

`parameters` (array)
: **Optional.** Parameters that are to be appended to the URL and passed into the Chart WebReport


