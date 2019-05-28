/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/generic/generic.view',
  'csui/controls/table/inlineforms/folder/folder.view',
  'csui/controls/table/inlineforms/shortcut/shortcut.view',
  'csui/controls/table/inlineforms/url/url.view',
  'csui/controls/table/inlineforms/collection/collection.view',
  'csui-ext!csui/controls/table/inlineforms/inlineform.factory'
], function (_, inlineFormViewRegistry,
    InlineFormGenericView,
    InlineFormFolderView,
    InlineFormShortcutView,
    InlineFormUrlView,
    InlineFormCollectionView) {

  function InlineFormViewFactory() {}

  _.extend(InlineFormViewFactory.prototype, {

    getInlineFormView: function (addableType) {
      var InlineFormView = inlineFormViewRegistry.getInlineFormView(addableType);
      return InlineFormView;
    }

  });

  return new InlineFormViewFactory();

});
