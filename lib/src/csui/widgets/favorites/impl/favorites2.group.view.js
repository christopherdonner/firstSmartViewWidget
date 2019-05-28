/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  'csui/lib/hammer',
  "csui/utils/log",
  'csui/utils/base',
  'csui/dialogs/modal.alert/modal.alert',
  'hbs!csui/widgets/favorites/impl/favorites2.group',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'css!csui/widgets/favorites/impl/favorites2.groups.view',
], function (module, $, _, Marionette, Hammer, log, base,
    ModalAlertView,
    template,
    lang) {
  'use strict';

  var FavoriteGroupView = Marionette.ItemView.extend({
    className: 'csui-favorite-group',
    template: template,
    tagName: 'li',

    initialize: function (options) {
      this.parent = options.parent;
      this.groupsView = options.groupsView;
      this._dragData = options.dragData;
      this._useEditMode = options.useEditMode;
      this._dragAndDropEnabled = options.dragAndDropEnabled;
    },

    ui: {
      groupNameButton: '.csui-favorite-group-name-link',
      nameInput: '.csui-favorite-group-input-name',
      cancelButton: '.csui-btn-edit-cancel',
      startEditButton: '.csui-btn-edit-start',
      deleteButton: '.csui-btn-delete'
    },

    templateHelpers: function () {
      var name = this.model.get('name');
      return {
        tabindex: this.model.get('isTabable') && !this._isReadonly() ? '0' : '-1',
        isRename: this.model.get('isRename'),
        name: name,
        groupNameAria: name == lang.fav_ungrouped ? lang.fav_ungroupedAria :
                       _.str.sformat(lang.favoritesGroupAria, name),
        namePlaceholder: lang.addFavoriteNamePlaceHolder,
        EditCancelTooltip: lang.addFavoriteCancelButtonLabel,
        EditCancelAria: lang.addFavoriteCancelButtonAria,
        EditStartTooltip: lang.editGroupButtonLabel,
        EditStartAria: lang.editGroupButtonAria,
        DeleteTooltip: lang.deleteGroupButtonLabel,
        DeleteAria: lang.deleteGroupButtonAria
      };
    },

    modelEvents: {
      "change": "render"
    },

    onRender: function () {
      var groupClasses = this.className;
      if (this.model.get('isSelected')) {
        groupClasses += ' binf-active';
      }

      var isSingleGroupEditing = this.model.get('isSingleGroupEditing');
      var isRename = this.model.get('isRename');
      if (isRename) {
        groupClasses += ' csui-favorite-group-rename';
      }
      var isReadonly = this._isReadonly();
      if (isReadonly) {
        groupClasses += ' csui-favorite-group-readonly';
      }

      if (this.dragStarted) {
        groupClasses += ' csui-dragstarted';
      }
      var draggable = !(isReadonly || isRename || isSingleGroupEditing || this._useEditMode ||
                        this.dragStarted || !this._dragAndDropEnabled);

      this.$el.attr('draggable', draggable);
      this.$el.find('a.csui-favorite-group-name-link').attr('draggable', draggable);

      this.$el.attr('class', groupClasses); // replace all classes

      if (this._useEditMode && !isReadonly && !isRename) {
        this._assignTouchControl();
      }

      if (this.model.isNew() && this.model.get('isRename')) {
        this._startEditing();
      } else {
      }

    },

    onDomRefresh: function () {
      if (this.model.isNew() || this.model.get('isRename')) {
        this.ui.nameInput.focus();
      } else {
        if (this._hasFocus && this.isRendered) {
          var self = this;
          setTimeout(function () {
            if (self.isRendered) {
              self._setFocus();
            }
          }, 100);
        }
      }
    },

    onDestroy: function () {
      if (this.hammer) {
        this.hammer.destroy();
      }
    },

    _startDragOperation: function () {
      this._dragData.clear();
      var tab_id = this.model.get('tab_id');
      if (tab_id !== -1) {
        this._dragData.set('groupId', tab_id);
        this.dragStarted = true;
        return true;
      } else {
        return false;
      }
    },

    _stopDragOperation: function () {
      this.dragStarted = false;
      this._dragData.clear();
      this._removeDragline();
      this._removeDragStarted();
    },

    _moveItemsToThisGroup: function () {
      var args;

      var tab_id = this.model.get('tab_id');
      if (tab_id === undefined) {
        return; // do not allow to move items into unsaved group
      }
      var isGroupsEditing = this.model.get('isGroupsEditing');
      if (!isGroupsEditing && this._dragData.get('favorites') &&
          this._dragData.get('favorites').length && this._dragData.get('groupId') !== undefined) {
        args = {
          idSources: this._dragData.get('favorites'),
          tabIdSource: this._dragData.get('groupId'),
          tabIdDestination: tab_id
        };
        this.trigger('dropped:favorite', args);
        return args.savePromise;
      } else if (this._dragData.get('groupId') !== undefined) {
        args = {
          tabIdSource: this._dragData.get('groupId'),
          tabIdDestination: tab_id,
          dropAfter: this._dropAfter
        };
        this.trigger('group:dropped', args);
        return args.savePromise;
      } else {
        var deferred = $.Deferred();
        deferred.reject();
        return deferred.promise();
      }
    },

    _selectThisGroup: function () {
      var args = {groupModel: this.model};
      this.triggerMethod("before:group:selected", args);
      if (!args.cancel) {
        this.triggerMethod("group:selected", args);
      }
    },

    _isReadonly: function () {
      var isReadonly = this.model.get('tab_id') === -1 || this.model.get('isReadonly');
      return isReadonly;
    },

    events: {
      'click @ui.cancelButton': function (event) {
        event.preventDefault();
        event.stopPropagation();

        this._cancelEdit();
      },

      'click @ui.startEditButton': function (event) {
        event.preventDefault();
        event.stopPropagation();
        this._startEditing();
      },

      'click @ui.deleteButton': function (event) {
        event.preventDefault();
        event.stopPropagation();
        var self = this;
        ModalAlertView.confirmQuestion(lang.deleteGroupConfirmatonText,
            lang.deleteGroupConfirmatonTitle, {buttons: ModalAlertView.OkCancel})
            .fail(function () {
              self._setFocus();
            })
            .done(function (arg) {
              self.triggerMethod('group:delete', {model: self.model});
            });
      },

      'focus @ui.groupNameButton': function (event) {
        this._hasFocus = true;
        this.trigger('group:focused');
      },

      'focus @ui.startEditButton': function (event) {
        this._hasStartEditButtonFocus = true;
      },

      'focusout @ui.startEditButton': function (event) {
        this._hasStartEditButtonFocus = false;
      },

      'focus @ui.deleteButton': function (event) {
        this._hasDeleteButtonFocus = true;
      },

      'focusout @ui.deleteButton': function (event) {
        this._hasDeleteButtonFocus = false;
      },
      'keydown @ui.nameInput': function (event) {
        switch (event.keyCode) {
        case 13:
          event.preventDefault();
          event.stopPropagation();

          this._save();
          break;
        case 27:

          event.preventDefault();
          event.stopPropagation();

          this._cancelEdit();
          break;
        }

      },
      'keydown': function (event) {
        var id = this.model.get('tab_id');
        var isRename = this.model.get('isRename');
        var isMac = base.isMacintosh();

        switch (event.keyCode) {
        case 88:
          if (isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
              event.ctrlKey) {

            event.preventDefault();
            event.stopPropagation();
            this._dragData.unset('favorites');
            if (id === -1) {
              this._dragData.unset('favorites');
            } else {
              this._dragData.set({groupId: id});
            }

          }
          break;
        case 86:
          if (isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
              event.ctrlKey) {

            event.preventDefault();
            event.stopPropagation();

            var dragSourceGroupId = this._dragData.get('groupId');
            if (id === dragSourceGroupId) {
              return;
            }

            this._dropAfter = false;

            var self = this;
            this._moveItemsToThisGroup().then(function () {
              self._selectThisGroup();
            });
          }
          break;
        case 37:
          if (this._hasFocus && !isRename) {
            if (this._hasStartEditButtonFocus) {
              event.preventDefault();
              event.stopPropagation();
              this.ui.groupNameButton.focus();
            } else {
              if (this._hasDeleteButtonFocus) {
                event.preventDefault();
                event.stopPropagation();
                this.ui.startEditButton.focus();
              }
            }
          }
          break;
        case 39:
          if (this._hasFocus && !isRename) {
            if (this._hasStartEditButtonFocus) {
              event.preventDefault();
              event.stopPropagation();
              this.ui.deleteButton.focus();
            } else {
              if (!this._hasDeleteButtonFocus) {
                event.preventDefault();
                event.stopPropagation();
                this.ui.startEditButton.focus();
              }
            }
          }
          break;
        }
      },

      'click': function (event) {
        if (!event.ctrlKey) { // don't handle ctrl-Enter (Enter also triggers 'click')

          event.preventDefault();
          if (this.model.isNew() || this.model.get('isRename') ||
              this.model.get('isGroupsEditing')) {
            return;
          }
          this._selectThisGroup();
        }
      },
      'dragstart': function (event) {
        if (this._startDragOperation()) {
          event.originalEvent.dataTransfer.setData('text', '');
        }
      },
      'dragover': function (event) {

        if (this.dragStarted) {
          return; // don't allow dropping to the same element
        }

        var tab_id = this.model.get('tab_id');
        if (tab_id === undefined) {
          return; // don't allow dropping to a group that is about to be created but not saved yet
        }
        if (!this._dragData.get('favorites') || this._dragData.get('favorites').length === 0) {

          var h = this.$el.height();
          var targetTabId = this.model.get('tab_id');
          var dropAfter = event.offsetY > (h / 2);
          if (this._moveNotPossible(this.model.collection, this._dragData.get('groupId'),
              targetTabId,
              dropAfter)) {
            this._removeDragline();
            this._dropAfter = undefined;
            event.preventDefault();
          } else {
            if (dropAfter) {
              if (targetTabId === -1) {
                this._removeDragline();
                this._dropAfter = undefined;
              } else {
                if (this._dropAfter === undefined || this._dropAfter === false) {
                  this._removeDragline();
                  this.$el.after('<div class="csui-favorite-group csui-dragline">');
                  this._dropAfter = true;
                }
                event.preventDefault();
              }
            } else {
              if (this._dropAfter === undefined || this._dropAfter === true) {
                this._removeDragline();
                this.$el.before('<div class="csui-favorite-group csui-dragline">');
                this._dropAfter = false;
              }
              event.preventDefault();
            }
          }
        } else {
          if (this._dragData.get('favorites') && this._dragData.get('favorites').length) {

            if (this._dragData.get('groupId') === tab_id) {
              return;
            }
            this.$el.addClass('csui-dragover');

            event.preventDefault();
          }
        }
      },
      'drop': function (event) {

        this.$el.removeClass('csui-dragover');

        event.preventDefault();
        this._moveItemsToThisGroup();
        this._removeDragline();
      },
      'dragleave': function (event) {
        this._removeDragline();
        this.$el.removeClass('csui-dragover');
      },
      'dragend': function (event) {
        event.preventDefault();
        this._stopDragOperation();
      }
    },

    _cancelEdit: function () {
      if (this.model.isNew()) {
        this.triggerMethod('group:delete', {model: this.model});
      } else {
        this.model.set('isRename', false);
        this.trigger('group:finished:editing');
      }
    },

    _moveNotPossible: function (collection, idSource, idDestination, moveAfterDestination) {
      var args = {
        idSource: idSource,
        idDestination: idDestination,
        moveAfterDestination: moveAfterDestination
      };
      this.trigger('group:before:dropped', args);
      return args.cancel;
    },

    _setFocus: function () {
      if (this.ui.groupNameButton.length > 0) {
        this.ui.groupNameButton.focus();
      }
    },

    _assignTouchControl: function () {
      this.hammer && this.hammer.destroy();

      var isGroupsEditing = this.model.get('isGroupsEditing');
      if (this.$el.length > 0 && !isGroupsEditing) {

        this.hammer = new Hammer.Manager(this.$el[0]);

        var press = new Hammer.Press({time: 500});
        this.hammer.add([press]);

        this.hammer.on('press', _.bind(this._onPress, this));
      }
    },

    _onPress: function () {
      this._startEditing();
    },

    _startEditing: function () {
      this.model.set('isRename', true);
      this.trigger('group:editing', {model: this.model});
    },

    _save: function () {
      var name = this.ui.nameInput.val();
      if (name) {
        this.model.set('name', name);
        this.triggerMethod('group:changed', {model: this.model});
      }
    },

    _removeDragline: function () {
      this.parent.$el.find('.csui-favorite-group.csui-dragline').remove();
      delete this._dropAfter;
    },

    _removeDragStarted: function () {
      this.parent.$el.find('.csui-dragstarted').removeClass('csui-dragstarted');
    }
  });

  return FavoriteGroupView;
});
