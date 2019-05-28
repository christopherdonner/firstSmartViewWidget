csui.define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'hbs!esoc/widgets/activityfeedwidget/impl/emptyactivityfeed',
  "css!esoc/widgets/activityfeedwidget/activityfeed.css"
], function (_, $, Marionette, lang, EmptyActivityFeedTemplate) {
  var EmptyActivityFeedView = Marionette.ItemView.extend({
    className: 'esoc-empty-activityfeed-wrapper',
    template: EmptyActivityFeedTemplate,
    templateHelpers: function () {
      return {
        emptyActivityFeed: !!this.options && !!this.options.parentCollectionView &&
                           (_.contains(['userwidget', 'metadata'],
                               this.options.parentCollectionView.options.origin)) ?
                           lang.emptyactivityfeedforuserprofile : lang.emptyactivityfeed
      };
    },
    constructor: function EmptyActivityFeedView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyActivityFeedView;
});