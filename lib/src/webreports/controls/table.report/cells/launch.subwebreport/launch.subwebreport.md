# LaunchSubWebreportView

**Module: webreports/controls/table.report/cells/launch.subwebreport/launch.subwebreport.view**

Enables launching of a sub-WebReport from a table report.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

    var tableReportView;
    		 
    
    var options = {
		context: pageContext,
		data: {
			id: 12345,
			title: 'My list of items',
			header: false,
			titleBarIcon: 'title-assignments',
			columnsWithSearch: 'Name',
			sortBy: 'Name',
			sortOrder: 'desc',
			swrLaunchCell: {
				id: 98765, // ID of sub-WebReport to launch
				iconClass: 'binf-glyphicon binf-glyphicon-piggy-bank', // Icon to show next to line item in table
				hoverText: 'Launch sub-WebReport' // text that appears when icon is hovered
			}
		}
	 };

	 tableReportView = new TableReportView(options);
      

### Options

`swrLaunchCell` (object)
: **Mandatory.** The options for the sub-WebReport

### Options Data

`id` (integer)
: **Mandatory.** ID of sub-WebReport to launch

`iconClass` (string)
: **Optional.** CSS classname for the icon to display (which acts as a launch button). The Smart UI includes the glyphicon webfont from Bootstrap: https://getbootstrap.com/docs/3.3/components/#glyphicons to use them, you need to prefix 'glyphicon' classnames with 'binf-'. For example: "binf-glyphicon binf-glyphicon-folder-open". Alternatively you can use a class that points to an SVG icon in the support directory. Default value = “icon icon-subwebreport".

`hoverText` (string)
: **Optional.** 'ALT text' that appears when mouse hovers over icon, or when an assistive technology (such as a screen reader) is used.
