# NodeListReportView

**Module: webreports/widgets/nodeslistreport/nodeslistreport.view**

  Shows a NodesListReport view. The NodesListReport view provides a list of nodes returned by a WebReport. This is similar to other list widgets such sa Favorites and Recently Accessed.
  
  This widget must use the ID of a WebReport that uses the `widget_nodeslist_nodestable` default reportview. This uses the INSERTJSON tag with the @NODESTABLEFIELDS directive to return Smart UI compatible node data from nodes in the data source. See WebReports tag guide and NodesListReport widget documentation for more information.

It allows for filtering on the nodes by opening a search field and entering filter criteria. The nodes are filtered by name and sorted alphabetically ascending. Clicking on a single node executes the default action for the node.  Clicking on the expand icon will show the expanded NodesTableReport view with more columns and node interactivity.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

     var    contentRegion = new Marionette.Region({el: '#content'}),
            pageContext   = new PageContext(),
            nodesListReportView,
            options;

     options = {
        context: pageContext,
        data: {
            id: 73591,
            title: 'Most Commonly Accessed Locations',
            titleBarIcon: 'title-assignments',
            searchPlaceholder: 'Search Common Locations'
        }
     };

     nodesListReportView = new NodesListReportView(options);
     contentRegion.show(nodesListReportView);
     pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new NodesListReportView.

### Options

`id` (integer)
:**Mandatory.** The ID for the WebReport that you want to use to generate the JSON data for the tile.

`title` (string)
:**Optional.** The title for the tile. Typically, this would describe the WebReport that you are rendering.

`titleBarIcon` (string)
:**Optional.** The CSS class for the icon that you want to appear in the top left corner. For example: Content ServerInstallDir/support/csui/themes/carbonfiber/icons.css contains icons such as title-assignments, title-customers, title- favourites, title-opportunities, title-recentlyaccessed, title-activityfeed, title-customviewsearch. Default value = “title-webreports” icon .

`searchPlaceholder
` (string)
:**Optional.** A custom string that will appear when the user clicks Search. Default value = “Search NodesList Report.”

`parameters` (array)
:**Optional.** One or more “name”-“value” pairs for the parameters that you want to pass into the WebReport.

#### Returns:

  The newly created object instance.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


