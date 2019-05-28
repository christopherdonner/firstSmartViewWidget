/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/controls/dialog/dialog.view',
  'i18n!csui/controls/conflict.resolver/impl/conflict.dialog/impl/nls/lang', 'csui/utils/log',
  'csui/controls/list/simplelist.view',
  'csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.item/conflict.item.view',
  'csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.list.view',
  'css!csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.dialog'
], function (_, $, Backbone, DialogView, lang, log, SimpleListView, ConflictItemView, ConflictListView) {
  "use strict";

  function ConflictDialog(options) {
    this.options = options || {};
    this.deferred = $.Deferred();
    this.removeItemList = {};
    this._resolveCount = this.options.conflictFiles.length;
    this.deferred.then(_.bind(this.destroy, this), _.bind(this.destroy, this));
  }

  _.extend(ConflictDialog.prototype, Backbone.Events, {

    destroy: function () {
      this._view.destroy();
      this._view.off();
      this._dialog.destroy();
    },

    show: function () {
      var conflictFiles = this.options.conflictFiles;

      conflictFiles[0].first = true;
      this._view = this._getListView(conflictFiles);
      this._dialog = this._createDialog(conflictFiles);
      this._view.$el.hover(function(){
        $('.cs-content').trigger('scroll');
      });
      return this.deferred;
    },

    _createDialog: function (conflictFiles) {
      var options = this.options,
        self = this,
        conflictMsg = conflictFiles.length > 1? lang.conflictCount: lang.oneConflict,
        h2Label = _.str.sformat(conflictMsg, conflictFiles.length);

      var dialog = new DialogView({
        standardHeader: false,
        view: this._view,
        className: 'csui-conflict-dialog csui-individual',
        attributes:{
          'data-backdrop': "static"
        },
        headers: [
          {
            id: 'h1',
            label: this.options.h1Label,
            class: 'csui-numUploads'
          },
          {
            id: 'h2',
            label: h2Label,
            class: 'csui-numConflicts'
          }],
        buttons: [
        {
          id: 'upload',
          label: options.actionBtnLabel,
          toolTip: options.actionBtnLabel,
          disabled: true,
          click: function(){
            dialog.destroy();
            self._resolutionComplete();
          }
        },
        {
          id: 'cancel',
          label: lang.cancel,
          toolTip: lang.cancel,
          click: function() {
            dialog.destroy();
            self.cancel();
          }
        }
        ],
        dialogTxtAria: this.options.h1Label + '. ' + h2Label
      });

      dialog.on('hide', function () {
        dialog.off();
        this.cancel();
      }, this);

      dialog.show();
      return dialog;
    },


    _getListView: function (conflictFiles) {

      var self = this,
        listView = new ConflictListView({
          data: {
            items: conflictFiles
          },
        numConflicts:conflictFiles.length,
        removeItemList : this.removeItemList,
        connector: this.options.connector,
        parentId: this.options.parentId,
        trackResolved: function(complete){
          self.trackResolved(complete);
        }
      });

      return listView;
    },

    cancel: function () {
      this.deferred.reject();
      return true;
    },

    trackResolved: function(resolved) {
      var header = $('.csui-conflict-dialog.csui-individual .csui-numConflicts');

      if (!resolved) {
        this._resolveCount++;
        this._dialog.updateButton('upload', {disabled: true});
      }
      else if (--this._resolveCount === 0) {
        this._dialog.updateButton('upload', {disabled: false});
      }

      var conflictMsg = (this._resolveCount > 1) || this._resolveCount === 0 ? lang.conflictCount: lang.oneConflict;
      header.text(_.str.sformat(conflictMsg, this._resolveCount));
      return true;
    },


    _resolutionComplete: function () {
      this.deferred.resolve(this._view.collection.models, this.removeItemList);
      return true;
    }

  });

  ConflictDialog.version = "1.0";
  return ConflictDialog;

});
