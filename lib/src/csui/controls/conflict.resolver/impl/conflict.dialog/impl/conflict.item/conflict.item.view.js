/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/nodesprites',
  'csui/models/namequery',
  'i18n!csui/controls/conflict.resolver/impl/conflict.dialog/impl/nls/lang',
  'csui/controls/progressblocker/blocker',
  "csui/utils/base",
  "csui/utils/log",
  'hbs!csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.item/conflict.item',
  'css!csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.item/conflict.item',
  'css!csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.item/progress.wheel',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (_,
  $,
  Marionette,
  NodeSpriteCollection,
  NameQuery,
  lang,
  ProgressIndicator,
  base,
  log,
  itemTemplate) {


  var ConflictListItem = Marionette.ItemView.extend({

    constructor: function ConflictListItem(options) {
      Marionette.ItemView.call(this, options);
      this._onDynamicPlacment = _.bind(this._setDynamicPlacement, this);
      $(window).bind("resize.app", this._onDynamicPlacment);
      if(!this.model.get('newName')){
        var name = this.model.get('name');
        this.model.set('newName', name);
      }
    },

    ui: {
      'inputField': 'input',
      'fileDescription': '.csui-description',
      'versionBtn': '.btn-version',
      'renameBtn': '.btn-rename',
      'cancelIcon': '.circle_delete',
      'progressWheel': '.csui-progress-container',
      'errorMessage': '.csui-msg',
      'statusText': '.csui-status',
      'cancelEdit': '.edit-cancel',

      'conflictFields': '.conflict-field',
      'renameFields': '.rename-field'

    },

    triggers: {
      'click @ui.versionBtn': 'click:version',
      'mouseleave': 'hide:cancel',
      'click @ui.cancelEdit': 'cancel:input'
    },

    events: {
      'click @ui.renameBtn': 'onRename',
      'focusout @ui.renameFields': '_queryName',
      'click @ui.cancelIcon': 'onCancelUpload',
      'keydown @ui.cancelIcon': 'onCancelUpload',
      'click .btn-undo': 'undo',
      'mouseenter': 'onHover',
      'focus *[tabindex]': 'onFocus',
      'keydown': 'onKeyInView'
    },

    tagName: 'div',
    className: 'binf-list-group-item',
    template: itemTemplate,

    templateHelpers: function () {
      var multiRowClass = this.options.multiConflicts && (this.model.status !== 'skip') ? '' : 'no-cancel-icon',
          newName = this.model.get('newName');
      return {
        'file-icon': this.getMimeTypeIcon(),
        'name': newName,
        'conflict-error-msg': lang.nameConflict,
        'conflict': !this.model.status,
        'status': this.getStatus(),
        'excludeAddVersion': this.model.excludeAddVersion || this.model.get('versioned') === false,
        'version': lang.addVersion,
        'versionAria': _.str.sformat(lang.nameConflictVersionAria, newName),
        'rename': lang.rename,
        'renameAria': _.str.sformat(lang.nameConflictRenameAria, newName),
        'skip': lang.skip,
        'skipAria': _.str.sformat(lang.nameConflictSkipAria, newName),
        'multiConflicts': this.options.multiConflicts,
        'multiRowClass': multiRowClass,
        'undo': lang.undo,
        'undoAria': _.str.sformat(lang.undoAria, newName, this.getStatus()),
        'status-ok': this.getResolveStatus(),
        'status-icon': this.getStatusIcon(),
        'cancel': lang.cancel,
        'inputPlaceHolder': lang.inputPlaceHolder,
        'statusNotSkip': this.model.status !== 'skip',
        'noServerError': this.model.status !== 'serverError',
        'resolvedStyle': this.resolvedStyle

      };
    },
    onKeyInView: function (event) {
      var keyCode = event.keyCode,
          target = $(event.target),
          retVal = true;
      switch (keyCode) {
        case 9:
          if (target.hasClass('cs-input')) {
            this.ui.cancelEdit.focus();
            retVal = false;
          }
          if (target.hasClass('edit-cancel')) {
            this.ui.inputField.focus();
            retVal = false;
          }
          break;
        case 27:
          if (target.hasClass('cs-input')) {
            this.onCancelInput();
            this.$el.trigger('setCurrentTabFocus');
            retVal = false;
          }
          break;
        case 32:
        case 13:
          if (target.hasClass('edit-cancel')) {
            this.onCancelInput();
          }
          if (target.hasClass('cs-input') && keyCode === 13) {
            this._queryName();
            retVal = false;
          }
      }
      return retVal;
    },

    onFocus: function (event) {
      this.trigger('item:focus', event.target);
    },

    getStatus: function () {
      switch (this.model.status) {
        case 'renamed':
          return lang.renamed;
        case 'skip':
          return lang.skip;
        case 'version':
          return lang.addVersion;
        case 'serverError':
          return lang.serverError;
      }
      return lang.conflict;
    },

    getStatusIcon: function () {
      var icon = 'csui-icon-notification-warning';
      switch (this.model.status) {
        case 'version':
        case 'renamed':
        case 'skip':
          icon = 'csui-icon-notification-success';
          break;
        case 'serverError':
          icon = 'category_delete';
          break;
      }
      return icon;
    },

    getMimeTypeIcon: function () {
      var mimeType;
      if ((this.model.get('mime_type') === undefined) && (this.model.get('file') !== undefined)) {
        mimeType = this.model.get('file').type;
      } else if (this.model.get('mime_type') !== null) {
        mimeType = this.model.get('mime_type');
      } else {
        mimeType = this.model.get('type');
      }
      this.model.set('mime_type', mimeType);
      return NodeSpriteCollection.findClassByNode(this.model);
    },


    getResolveStatus: function () {
      var status = '';
      switch (this.model.status) {
        case 'version':
        case 'renamed':
        case 'skip':
          status = 'ok';
          break;
        case 'serverError':
          status = 'error';
          break;
      }
      return status;
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this._onDynamicPlacment);
    },

    onClickVersion: function (model) {
      this.model.status = 'version';
      this.model.set('newVersion', true);
      this.setResolveStatus(true);
      this.render();
    },

    onRename: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var name = this.model.get('newName');
      this.ui.inputField.val(name);
      this.ui.conflictFields.addClass('binf-hidden');
      this.ui.renameFields.removeClass('binf-hidden');
      this.ui.inputField.focus();

      this.ui.fileDescription.addClass('edit-mode');
      this.$el.addClass('edit-mode');
      this.$el.find('.csui-status-icon').addClass('edit-mode');
    },

    onCancelInput: function () {
      this.render();
    },

    onCancelUpload: function (event) {
      if (event.keyCode === undefined || event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
        event.preventDefault();
      this.options.removeItemList[this.model.get('id')] = this.model;
      this.previousState = this.model.status;
      this.model.status = 'skip';
      this.setResolveStatus(true);
      this.render();
      }
    },

    setResolveStatus: function(resolved){
      if (this._resolved && !resolved){
        this.trigger('resolved', false);
      }
      if (!this._resolved && resolved){
        this.trigger('resolved', true);
      }

      this._resolved = resolved;
    },

    onHover: function () {
      if (!this.resolvedStyle){
        this.resolvedStyle = "width:" + $('.csui-button-container').width() + 'px;';
      }
      this.ui.cancelIcon.addClass('binf-show');
    },

    onHideCancel: function () {
      this.ui.cancelIcon.removeClass('binf-show');
    },

    onRender: function () {
      var node = this.model;

      if (node.get('first')) {
        this.$el.addClass('no-border');
      }

      this._setDynamicPlacement();
    },

    undo: function (event) {
      event.preventDefault();
      event.stopPropagation();

      var id = this.model.get('id');
      this.model.status = this.previousState;

      if (this.previousState) {
        delete this.options.removeItemList[id];
        this.previousState = undefined;
      }
      else {
        this.oldName && this.model.set('newName', this.oldName);
        this.oldId && this.model.set('id', this.oldId);
        this.oldName = this.Id = undefined;
        this.model.set('newVersion', undefined);
        delete this.options.removeItemList[id];
        this.model.status = undefined;
        this.setResolveStatus(false);
      }
      this.render();
    },

    _queryName: function () {
      var newName = this.ui.inputField.val(),
        oldName = this.model.get('newName');
      newName = newName && newName.trim();
      if (newName && newName !== oldName) {
        this.oldName = oldName;
        this.oldId = this.model.get('id');
        this.model.set('id', undefined);
        this.model.set('newName', newName);
        this.ui.progressWheel.removeClass('binf-hidden');
        this._runNameQuery([{name: newName}]);
      }
      else{
        this.onCancelInput();
      }
    },

    _runNameQuery: function (name) {
      var self = this,
          nameQuery = new NameQuery({containerId: this.options.parentId},
              {connector: this.options.connector});

      nameQuery.queryNames(name)
        .done(function (cleanFileName, conflictFileName) {
          if (conflictFileName && conflictFileName.length > 0) {
            self._resetConflictStatus(conflictFileName);
          }
          else {
            self._setRenameStatus();
          }
        })
        .fail(function (resp) {
          self.ui.progressWheel.addClass('binf-hidden');
          self._processServerError(resp);
        });
    },

    _processServerError: function (response) {
      this.options.removeItemList[this.model.get('id')] = this.model;
      this.model.status = 'serverError';
      this.$el.removeClass('edit-mode');
      this._setErrorMsg(response);
      this.setResolveStatus(true);
      this.render();
    },

    _setErrorMsg: function (response) {
      var msg = lang.serverError,
        logMsg = 'Conflict.Item.View: Server returned error during name query';

      if (response) {
        logMsg = new base.RequestErrorMessage(response);
      }

      log.error(logMsg) && console.error(log.last);
    },

    _setRenameStatus: function () {
      this.model.status = 'renamed';
      this.$el.removeClass('edit-mode');
      this.setResolveStatus(true);
      this.render();
    },

    _resetConflictStatus: function (newConflictFile) {
      this.model.set('id', newConflictFile[0].id);
      this.render();
    },

    _setDynamicPlacement: function () {
      var acceptedWidth = $(window).width() - (88 * 2);

      if (acceptedWidth < 600) {
        this.$el.addClass('sm');
        this.ui.statusText.addClass('sm');
        this.ui.fileDescription.addClass('sm');
      }
      else {
        this.$el.removeClass('sm');
        this.ui.statusText.removeClass('sm');
        this.ui.fileDescription.removeClass('sm');
      }
    }
  });


  return ConflictListItem;

});

