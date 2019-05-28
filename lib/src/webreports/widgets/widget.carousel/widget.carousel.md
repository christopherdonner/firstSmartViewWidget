# Widget Carousel

**Module: webreports/widgets/widget.carousel/widget.carousel.view**

Creates a carousel of widgets using the bootstrap carousel plugin.  Each child widget added to the carousel's options becomes a slide in the carousel itself - one widget per slide.  The maximum number of slides is 10. 

Only WebReport widgets are allowed inside of a carousel, and a carousel widget cannot be added as a child widget to another carousel widget.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

        // Create the data managing context:
        var context = new PageContext(),

        // Create an instance of the carousel and populate it with 3 widgets:
        carouselView = new CarouselView({
            context: context,
            data: {
                "title": "My Carousel Widget",
                "titleBarIcon": "", 
                "header": false, 
                "behavior": {
                    "auto_cycle": true, 
                    "interval": 5000, 
                    "pause_on_hover": true, 
                    "wrap": true
                },
                "widgets": [
                    {
                        "type": "webreports/widgets/tilereport",
                        "options": {
                            "header": true,
                            "scroll": true,
                            "id": 102374,
                            "title": "My Data"
                        }
                    },
                    {
                        "type": "webreports/widgets/nodeslistreport",
                        "options": {
                            "title": "Important Documents",
                            "searchPlaceholder": "Search",
                            "id": 102123
                        }
                    },
                    {
                        "type": "webreports/widgets/tilereport",
                        "options": {
                            "header": true,
                            "scroll": true,
                            "id": 102375,
                            "title": "Audit Report"
                        }
                    }
                ]
            }
        }),

        // Create helpers to show the views on the page
        carouselRegion = new Marionette.Region({
            el: "#carousel_parent"
        });

        // Show the views on the page
        carouselRegion.show(carouselView);

        // Fetch the data from the server to populate the tiles with
        context.fetch();

### Options

`header` (boolean)
: **Optional.** Specifies whether the tile will include a header area that contains the title and title icon. Note that this header will appear above all child widgets.
This should only be set to true if all the child widgets do not have their own headers, otherwise it would appear as if it had two headers:  one for the parent carousel widget, and another for the child widget itself.
Default = False.

`title` (string)
: **Optional.** The title for the tile that appears in the header. 
  Default = a blank string.

`titleBarIcon` (string)
: **Optional.** The CSS class for the icon that you want to appear in the top left corner of the header. For example: support/csui/themes/carbonfiber/icons.css contains icons such as title-assignments, title-customers, title-favourites, title-opportunities, title-recentlyaccessed, title-activityfeed, title-customviewsearch. 
Default = WebReports icon.

`auto_cycle` (boolean)
: **Optional.** Specifies whether the carousel will automatically cycle once it is fully loaded.
Default = True.

`interval` (integer)
: **Optional.** The amount of time in milliseconds between slide transitions.
Default = 5000.

`pause_on_hover` (boolean)
: **Optional.** TRUE will pause the carousel when the mouse pointer hovers over it.  FALSE will allow slide transitions even if the mouse is hovering over the carousel.
Default = True.

`wrap` (boolean)
: **Optional.** TRUE will allow the carousel to cycle continuously - once it reaches the last slide it will loop back to the first slide and repeat.  FALSE will cause the carousel to cycle once with no repeats.
Default = True.

`widgets` (array)
: **Mandatory.** One or more widgets that will be used to populate the carousel.  Each object in the array needs to contain the type of the widget (eg: "webreports/widgets/tilereport") and the options as required by that specific widget.
Default = empty array.