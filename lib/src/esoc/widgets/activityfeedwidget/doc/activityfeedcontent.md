# ActivityFeedContent (esoc/widgets/activityfeedwidget/activityfeedcontent)

  Shows a Activity view as raw List View. The Activities view provides a list of Activities as given
  through the page context. Activities are filtered based on the params provided as options.
  Clicking on the expanded icon will show the expanded Activity view. It is same as
  "esoc/widgets/activityfeedwidget" with few more extra parameters.
  Information on remaining option parameters can be available in ./activityfeedwidget.md file.


### Example

      var contentRegion    = new Marionette.Region({el: '#content1'}),
                pageContext      = new PageContext(),
                options          = {
                  "enableFiltersForStandardView": false,
                  "hideupdatesfrom": false,
                  "hideExpandIcon": false
                },
                contentView = new ActivityFeedContent(options).contentView;

            contentRegion.show(contentView);
            pageContext.fetch();

### constructor(options)

  Creates a new ActivityFeedContentView.

#### Parameters:

* `options.enableFiltersForStandardView` - *Boolean* optional parameter and default value is false.
     If set to true then activity feed filter panel(both activity type and updatesfrom filters)
     renders at left side of the feeds in standard view.
* `options.hideupdatesfrom` - *Boolean* optional parameter and default value is false.
     If set to true then we don't see updatesfrom filter in the activity feed filter panel.
* `options.hideExpandIcon` - *Boolean* optional parameter and default value is false.
     If set to true then expand icon will not be shown.

#### Returns:

  The newly created object instance.
