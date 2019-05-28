/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/widgets/favorites/impl/favorites2.group.view',
  'css!csui/widgets/favorites/impl/favorites2.groups.rows.view'
], function (module,
    $,
    Marionette,
    FavoriteGroupView
) {
  'use strict';

  var FavoriteGroupsRowsView = Marionette.CollectionView.extend({
    className: 'csui-favorite-groups-rows',
    tagName: 'ul',
    childView: FavoriteGroupView,
    childViewOptions: function () {
      return {
        parent: this,
        groupsView: this.options.parent,
        groupsViewStateModel: this.options.groupsViewStateModel,
        dragData: this.options.dragData,
        useEditMode: this._useEditMode,
        dragAndDropEnabled: this.options.dragAndDropEnabled
      };
    },
    initialize: function (options) {
      this._useEditMode = options && options.useEditMode;
    },
    events: {
      'focusout': function (event) {
        if (event.relatedTarget) {
          if ($.contains(this.el, event.relatedTarget) == false) {
            this.trigger('groups:focusout');
          }
        }
      }
    }
  });

  return FavoriteGroupsRowsView;
});
