/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/utils/log",
  'csui/utils/base',
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorite2group',
  'csui/widgets/favorites/impl/favorites2.groups.header.view',
  'csui/widgets/favorites/impl/favorites2.groups.rows.view',
  'csui/widgets/favorites/impl/favorites2.groups.footer.view',
  "csui/controls/progressblocker/blocker",
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'hbs!csui/widgets/favorites/impl/favorites2.groups',
  'css!csui/widgets/favorites/impl/favorites2.groups.view',
], function (module,
    $,
    _,
    Backbone,
    Marionette,
    log,
    base,
    PerfectScrollingBehavior,
    GlobalMessage,
    Favorite2GroupsCollectionFactory,
    Favorite2GroupModel,
    FavoriteGroupsHeaderView,
    FavoriteGroupsRowsView,
    FavoriteGroupsFooterView,
    BlockingView,
    lang,
    template
) {
  'use strict';

  var FavoriteGroupsView = Marionette.LayoutView.extend({

    className: 'csui-favorite-groups',
    template: template,

    ui: {
    },

    regions: {
      headerRegion: '.csui-favorite-groups-header-region',
      rowsRegion: '.csui-favorite-groups-rows-region',
      footerRegion: '.csui-favorite-groups-footer-region'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-favorite-groups-rows',
        suppressScrollX: true
      }
    },

    constructor: function FavoriteGroupsView(options) {
      options || (options = {});

      var config = module.config();
      _.defaults(options, {});

      FavoriteGroupsView.__super__.constructor.call(this, options);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
    },

    initialize: function () {
      var self = this;
      this.collection = this.options.collection ||
                        this.context.getCollection(Favorite2GroupsCollectionFactory,
                            {detached: true, permanent: true}
                        );

      this._useEditMode = base.isTouchBrowser();
      this._isSingleGroupEditing = false; // true if a single group is being renamed/edited
      this._isGroupsEditing = false; // only used for touch browsers

      this._dragData = this.options.dragData;

      if (this.options.collection) {
        this.collection.fetched = false;
      }

      this.listenTo(this.collection, 'reset', function () {
        this.collection.each(function (groupModel, index) {
          if (index > 0) {
            groupModel.set('isTabable', false);
          } else {
            groupModel.set('isTabable', true);  // only the first item is tabable
          }
        });
      });

      this.headerView = new FavoriteGroupsHeaderView({useEditMode: this._useEditMode});
      this.rowsView = new FavoriteGroupsRowsView({
        dragData: this._dragData,
        parent: this,
        collection: this.collection,
        sort: true,
        useEditMode: this._useEditMode,
        dragAndDropEnabled: this.options.dragAndDropEnabled
      });
      this.footerView = new FavoriteGroupsFooterView({groups: this.collection});

      this.listenTo(this.rowsView, 'childview:group:focused', function (childView) {
        this._setFocusAtView(childView);
      });
      this.listenTo(this.rowsView, 'groups:focusout', function () {
        this.$el.find('.csui-favorite-group.csui-in-focus').removeClass('csui-in-focus');
        this.$el.removeClass('csui-favorite-groups-has-group-in-focus');
        this.rowsView.children.each(function (aChildView) {
          delete aChildView._hasFocus;
        });
      });
      this.listenTo(this.rowsView, 'childview:before:group:selected', function (childView, args) {
        if (this._isSingleGroupEditing) {
          args.cancel = true; // inform caller to stop the selection
        } else {
          this.triggerMethod('before:group:selected', childView);
        }
      });
      this.listenTo(this.rowsView, 'childview:group:selected', function (childView, args) {
        if (this._modelOfNewlySelectedGroup(childView)) {
          this.triggerMethod('group:selected', childView);
          this.selectGroup(childView);
          this._tryReSetFocus();
        }
      });
      this.listenTo(this.rowsView, 'childview:group:before:dropped', function (childView, args) {
        if (this._checkMoveNotPossible(args.idSource, args.idDestination,
            args.moveAfterDestination)) {
          args.cancel = true; // tell sender that move won't be performed
        }
      });
      this.listenTo(this.rowsView, 'childview:group:dropped', function (childView, args) {
        this.triggerMethod('group:dropped', args);
      });
      this.listenTo(this.rowsView, 'childview:dropped:favorite', function (childView, args) {
        this.triggerMethod('dropped:favorite', args);
      });
      this.listenTo(this.rowsView, 'childview:group:editing', function (childView, args) {
        this._setSingleGroupEditingMode(childView);
      });
      this.listenTo(this.rowsView, 'childview:group:changed', function (childView, args) {
        var model = args.model;
        this._saveGroup(model);
        this._setSingleGroupEditingMode(false);
        this._setGroupsEditingMode(false);
        this._tryReSetFocus();
      });
      this.listenTo(this.rowsView, 'childview:group:delete', function (childView, args) {
        var model = args.model;
        if (model.isNew()) {
          model.destroy();  // destroy of a not saved model does not return a promise
          self._setSingleGroupEditingMode(false);
          self._setGroupsEditingMode(false);
          self.triggerMethod('group:deleted', model);
        } else {
          model.destroy({wait: true}).then(function () {
            self._setSingleGroupEditingMode(false);
            self._setGroupsEditingMode(false);
            self.triggerMethod('group:deleted', model);
          });
        }
        this._tryReSetFocus();
      });
      this.listenTo(this.rowsView, 'childview:group:finished:editing', function () {
        this._setSingleGroupEditingMode(false);
      });

      this.listenTo(this.headerView, 'add:item', function (args) {
        if (!this._isSingleGroupEditing) {
          this._isSingleGroupEditing = true;
          this.headerView.isAddEnabled(false);

          var newGroup = new Favorite2GroupModel({
            "name": "", // start with empty name
            "order": 1,  // put it at first position
            "isRename": true
          }, {connector: this.collection.connector});

          this.collection.add(newGroup, {at: 0});
        }
      });

      this.listenTo(this.headerView, 'toggleEditMode:on', function () {
        this._setGroupsEditingMode(true);
      });

      this.listenTo(this.headerView, 'toggleEditMode:off', function () {
        if (this._editingView) {
          this._editingView._save();  // this comes back in handler for 'childview:group:changed'
          this._setSingleGroupEditingMode(false);
        } else {
          this._setGroupsEditingMode(false);
        }
      });
    },

    events: {
      'keydown': function (event) {
        var currentGroup;
        switch (event.keyCode) {

        case 38:

          event.preventDefault();
          event.stopPropagation();

          if (!this._isSingleGroupEditing && this._focusedModelIndex !== undefined) {
            if (this._focusedModelIndex > 0) {
              currentGroup = this.collection.at(this._focusedModelIndex);
              var prevGroup = this.collection.at(this._focusedModelIndex - 1);

              var prevView = this.rowsView.children.findByModel(prevGroup);
              this._setFocusAtView(prevView);
              currentGroup.set('isTabable', false);
              prevGroup.set('isTabable', true);
            }
          }
          break;
        case 40:

          event.preventDefault();
          event.stopPropagation();

          if (!this._isSingleGroupEditing && this._focusedModelIndex !== undefined) {
            if (this._focusedModelIndex < this.collection.length - 1) {
              currentGroup = this.collection.at(this._focusedModelIndex);
              var nextGroup = this.collection.at(this._focusedModelIndex + 1);

              var nextView = this.rowsView.children.findByModel(nextGroup);
              this._setFocusAtView(nextView);
              currentGroup.set('isTabable', false);
              nextGroup.set('isTabable', true);
            }
          }
          break;
        }
      }
    },

    onRender: function () {
      this._updateGroupsCssClasses();
      this.headerRegion.show(this.headerView);
      this.rowsRegion.show(this.rowsView);
      this.$el.find('.csui-favorite-groups-rows-region').attr('role', 'navigation').attr(
          'aria-label', lang.favoriteGroupsNavAria);
      this.footerRegion.show(this.footerView);
    },

    onBeforeDestroy: function () {
      if (this._isSingleGroupEditing) {
        if (this._editingView.model.isNew()) {
          this._editingView.model.destroy();
        }
      }
    },

    _setFocusAtView: function (childView) {
      this.rowsView.children.each(function (aChildView) {
        if (aChildView.cid !== childView.cid) {
          delete aChildView._hasFocus;
          aChildView.$el.removeClass('csui-in-focus');
        }
      });
      childView._hasFocus = true;
      childView.$el.addClass('csui-in-focus');

      this.$el.addClass('csui-favorite-groups-has-group-in-focus');
      this._focusedModelIndex = this.collection.indexOf(childView.model);
    },

    _setFocusedByIndex: function (groupToFocusIndex) {
      var focusedModel = this.rowsView.collection.at(groupToFocusIndex);
      var focusedView = this.rowsView.children.findByModel(focusedModel);
      this._setFocusAtView(focusedView);
    },

    _tryReSetFocus: function () {
      if (!this._isSingleGroupEditing && this._focusedModelIndex !== undefined) {
        var model = this.collection.at(this._focusedModelIndex);
        if (model) {
          var focusedView = this.rowsView.children.findByModel(model);
          if (focusedView) {
            focusedView._setFocus();
          }
        }
      }
    },

    _setGroupsEditingMode: function (on) {
      var isGroupsEditing = this._isGroupsEditing = on;
      this._updateGroupsCssClasses();
      this.collection.each(function (groupModel) {
        groupModel.set('isGroupsEditing', isGroupsEditing);
      });
      this.triggerMethod("group:any:editing", {on: on});
    },

    _setSingleGroupEditingMode: function (view) {
      var args;
      if (view) {
        this._isSingleGroupEditing = true;
        this._editingView = view;
        this.headerView.isAddEnabled(false);
        args = {on: true, groupModel: view.model};
      } else {
        this._editingView = undefined;
        this._isSingleGroupEditing = false;
        this.headerView.isAddEnabled(true);
        args = {on: false};
      }
      var isSingleGroupEditing = this._isSingleGroupEditing;
      this._updateGroupsCssClasses();

      this.collection.each(function (groupModel) {
        groupModel.set('isSingleGroupEditing', isSingleGroupEditing);
      });
      this.triggerMethod("group:any:editing", args);
    },

    _updateGroupsCssClasses: function () {
      if (this._useEditMode) {
        this.$el.addClass('csui-favorite-groups-has-groups-editing');
      }
      if (this._isSingleGroupEditing || this._isGroupsEditing) {
        this.$el.removeClass('csui-favorite-groups-editing-none');
        this.$el.addClass('csui-favorite-groups-editing-any');
      } else {
        this.$el.addClass('csui-favorite-groups-editing-none');
        this.$el.removeClass('csui-favorite-groups-editing-any');
      }
      if (this._isSingleGroupEditing && !this._isGroupsEditing) {
        this.$el.addClass('csui-favorite-single-group-editing');
      } else {
        this.$el.removeClass('csui-favorite-single-group-editing');
      }
      if (!this._isSingleGroupEditing && this._isGroupsEditing) {
        this.$el.addClass('csui-favorite-groups-editing');
      } else {
        this.$el.removeClass('csui-favorite-groups-editing');
      }
    },

    _checkMoveNotPossible: function (idSource, idDestination, moveAfterDestination) {
      var modelSource = this.collection.get(idSource);
      var modelDestination = this.collection.get(idDestination);
      var sourceIndex = this.collection.indexOf(modelSource);
      var targetIndex = this.collection.indexOf(modelDestination);
      if (sourceIndex < targetIndex) {
        targetIndex = targetIndex - 1;
      }
      if (moveAfterDestination) {
        targetIndex = targetIndex + 1;
      }
      return sourceIndex === targetIndex;
    },

    _modelOfNewlySelectedGroup: function (newlySelectedGroup) {
      var newlySelectedGroupModel;
      if (newlySelectedGroup instanceof Backbone.Model) {
        newlySelectedGroupModel = newlySelectedGroup;
      } else {
        if (newlySelectedGroup instanceof Backbone.View) {
          newlySelectedGroupModel = newlySelectedGroup.model;
        }
      }
      if (!newlySelectedGroupModel ||
          (this.selectedGroup &&
           newlySelectedGroupModel.get('tab_id') == this.selectedGroup.get('tab_id'))) {
        return undefined;
      } else {
        return newlySelectedGroupModel;
      }
    },

    selectGroup: function (group) {
      var newlySelectedGroupModel = this._modelOfNewlySelectedGroup(group);
      if (!newlySelectedGroupModel) {
        return;
      }

      if (this.selectedGroup) {
        this.selectedGroup.set('isSelected', false);
      }
      newlySelectedGroupModel.set('isSelected', true);
      this.selectedGroup = newlySelectedGroupModel;
    },

    _endEditing: function (model) {
      if (!model.isNew()) {
        model.set({'isRename': false}); // let the UI update
      }
      this._setSingleGroupEditingMode(false);
    },

    _saveGroup: function (model) {
      var self = this;

      model.save({}, {
        wait: true
      }).then(function () {
        self._endEditing(model);
      }).fail(function (err) {
        model.trigger('error', model); // need sync for blocking view

        var errorMessage;
        if (err && err.responseJSON && err.responseJSON.error) {
          errorMessage = err.responseJSON.error;
        } else {
          var errorHtml = base.MessageHelper.toHtml();
          base.MessageHelper.reset();
          errorMessage = $(errorHtml).text();
        }
        log.error('Saving failed. ', errorMessage) && console.error(log.last);
        GlobalMessage.showMessage('error', lang.errorFavoriteGroupSaveFailed + ' ' + errorMessage);
      });
    }
  });

  return FavoriteGroupsView;
});
