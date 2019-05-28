# TileReportView

**Module: webreports/widgets/tilereport/tilereport.view**

Displays the HTML output of a WebReport in a tile. The WebReport must have the mime type set to text/html on the destination tab.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

      // Create the data managing context
      var context = new PageContext(),

      sampleTileReportView = new TileReportView({
          context: context,
          data: {
              titleBarIcon: 'mime_audio',
              title: 'Sample WebReports Tile',
              id: 12345,
              scroll: true,
              header: true,
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
      }),
      // Create helpers to show the views on the page
      region = new Marionette.Region({
        el: "#content"
      });

      // Show the views on the page
      region.show(sampleTileReportView);

      // Fetch the WebReport output from the server to populate the tile with
      context.fetch();

### Options

`id` (integer)
: **Mandatory.** The DataID for the WebReport that you want to appear on the tile.

`title` (string)
: **Optional.** The title for the tile. Typically, this would describe the WebReport that you are rendering. 
  Default = HTML WebReport

`titleBarIcon` (string)
: **Optional.** The CSS class for the icon that you want to appear in the top left corner. For example: support/csui/themes/carbonfiber/icons.css contains icons such as title-assignments, title-customers, title-favourites, title-opportunities, title-recentlyaccessed, title-activityfeed, title-customviewsearch. Default = WebReports icon.

`Note: You can specify a custom icon within the WebReport template by adding a CSS selector that uses background-image and then referencing the selector in this option. See the widget_html_report_image_icons_sample default reportview for an example of this.`

`header` (boolean)
: **Optional.** Specifies whether the tile will include a header area that contains the title and title icon. 
  Default = True.

`scroll` (boolean)
: **Optional.** Specifies whether users can scroll through the content on the tile. If scrolling is disabled, content will be truncated.
  Default = True.

`parameters` (array)
: **Optional.** One or more “name”-“value” pairs for the parameters that you want to pass into the WebReport.