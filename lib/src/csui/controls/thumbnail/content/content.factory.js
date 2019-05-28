/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/thumbnail/content/content.registry',
  'csui/controls/thumbnail/content/favorite/favorite.view',
  'csui/controls/thumbnail/content/node.state/node.state.view',
  'csui/controls/thumbnail/content/name/name.view',
  'csui/controls/thumbnail/content/member/member.view',
  'csui/controls/thumbnail/content/size/size.view',
  'csui/controls/thumbnail/content/select/select.view',
  'csui/controls/thumbnail/content/date/date.view',
  'csui/controls/thumbnail/content/thumbnail.icon/thumbnail.icon.view',
  'csui/controls/thumbnail/content/overview/overview.view',
  'csui/controls/thumbnail/content/properties/properties.view',
  'csui-ext!csui/controls/thumbnail/content/content.factory'
], function (_, contentViewRegistry) {

  function ContentViewFactory() {}

  _.extend(ContentViewFactory.prototype, {
    getContentView: function (columnDefinition) {
      var ContentView = contentViewRegistry.getContentView(columnDefinition);
      return ContentView;
    }
  });

  return new ContentViewFactory();
});