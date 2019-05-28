/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/folder/folder.view'
], function ($, _, Marionette, inlineFormViewRegistry, FolderFormView) {

  var InlineFormCollectionView = FolderFormView.extend({
        className: function () {
          var className = "csui-inlineform-collection";
          if (FolderFormView.prototype.className) {
            className += ' ' + _.result(FolderFormView.prototype, 'className');
          }
          return className;
        }
      },
      {
        CSSubType: 298 // Content Server Subtype of Collection is 298
      }
  );

  inlineFormViewRegistry.registerByAddableType(
      InlineFormCollectionView.CSSubType,
      InlineFormCollectionView);

  return InlineFormCollectionView;
});
