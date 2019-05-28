/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/perspective.manage/impl/pman.panel.view',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'hbs!csui/perspective.manage/impl/pman',
  'css!csui/perspective.manage/impl/pman',
  'csui/perspective.manage/behaviours/pman.widget.config.behaviour'
], function (_, $, Backbone, Marionette, base, NonEmptyingRegion, PManPanelView, lang, template) {

  var pmanContainer;

  var PManView = Marionette.ItemView.extend({

    className: 'pman pman-container',
    template: template,

    templateHelpers: function () {
      return {
        addWidget: lang.addWidget,
        save: lang.save,
        cancel: lang.cancel
      };
    },

    ui: {
      "pmanPanel": ".pman-header .pman-pannel-wrapper",
      'cancelEdit': '.pman-header .cancel-edit',
      'addIcon': '.pman-header .icon-toolbarAdd',
      'saveBtn': '.pman-header .icon-save'
    },

    events: {
      'click @ui.cancelEdit': "onClickClose",
      'click @ui.addIcon': "togglePannel",
      'click @ui.saveBtn': "onClickSave"
    },

    constructor: function PManView(options) {
      options || (options = {});
      _.defaults(options, {
        applyMasking: this.applyMasking.bind(this),
        container: document.body
      });
      options.container = $(options.container);
      this.context = options.context;
      this._prepareForEdit(options.perspective || options.context.perspective);
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._registerEventHandler();
    },

    _registerEventHandler: function () {
      this.listenTo(this, 'change:layout', function (newLayoutType) {
        this.perspective.set('perspective', {
          type: newLayoutType,
          options: {perspectiveMode: 'edit'}
        }, {silent: true});
        this._triggerEditMode();
        this.togglePannel();
      });
      this.listenTo(this.context, 'save:perspective', this._savePerspective);
    },

    _prepareForEdit: function (originalPerspective) {
      if (!originalPerspective) {
        throw new Error("Missing perspective");
      }
      this.perspective = this._clonePrespective(originalPerspective);
      if (this.perspective.isNew()) {
        this.perspective.set('perspective', this._getDefaultPerspectiveConfig());
      }

      var perspectiveOptions = this.perspective.get('perspective').options || {};
      perspectiveOptions.perspectiveMode = 'edit';
    },

    _clonePrespective: function (original) {
      var perspectiveConfig = original.get('perspective');
      var config = JSON.parse(JSON.stringify(perspectiveConfig));
      original.set('perspective', config);
      return original;
    },

    show: function () {
      var container = this.getContainer(),
          region    = new NonEmptyingRegion({
            el: container
          });
      region.show(this);
      return this;
    },

    getContainer: function () {
      if (!pmanContainer || !$.contains(this.options.container, pmanContainer)) {
        pmanContainer = $('<div>', {'class': 'binf-widgets'}).appendTo(this.options.container)[0]
      }
      return pmanContainer;
    },
    _getDefaultPerspectiveConfig: function () {
      return {
        "type": "left-center-right",
        "options": {
          "center": {
            "type": "csui/widgets/nodestable"
          }
        }
      };
    },

    _fetchPerspective: function () {
      var self = this;
      if (!this.perspective.isNew()) {
        this.perspective.fetch().then(function () {
          self.ui.saveBtn.removeAttr('disabled');
        });
      } else {
        self.ui.saveBtn.removeAttr('disabled');
      }
    },
    _savePerspective: function (updatedPerspective) {
      this.perspective.set('perspective', updatedPerspective);
      var self = this;
      this.perspective.save().then(function () {
        require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("success", lang.perspectiveSaveSuccess);
          updatedPerspective.id = self.perspective.get('id');
          self.context.perspective.set(updatedPerspective);
          self._doExitPerspective();
        });
      }, function (error) {
        var errorMessage;
        if (error && error.responseJSON && error.responseJSON.error) {
          errorMessage = error.responseJSON.error;
        } else {
          var errorHtml = base.MessageHelper.toHtml();
          base.MessageHelper.reset();
          errorMessage = $(errorHtml).text();
        }
        require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("error", errorMessage);
        });
      });
    },

    onClickSave: function () {
      var self = this;
      require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmWarning(lang.saveConfirmMsg, lang.saveConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self.context.triggerMethod('serialize:perspective', self.perspective);
              }
            });
      });
    },

    onClickClose: function () {
      this._doExitPerspective();
    },

    togglePannel: function () {
      if (!this.ui.pmanPanel.hasClass('binf-active')) {
        this._openToolsPanel();
      } else {
        this._closeToolsPanel();
      }
    },

    _openToolsPanel: function () {
      this.pmanPanelView.trigger('reset:items');
      this.ui.addIcon.addClass('binf-active');
      this.ui.addIcon.attr("title", lang.close);
      this.ui.pmanPanel.addClass('binf-active');
    },

    _closeToolsPanel: function () {
      this.ui.pmanPanel.removeClass('binf-active');
      this.ui.addIcon.attr("title", lang.addWidget);
      this.ui.addIcon.removeClass('binf-active');
    },

    applyMasking: function () {

    },

    _initializeWidgets: function () {
      this.pmanPanelRegion = new Marionette.Region({
        el: this.ui.pmanPanel
      });
      this.pmanPanelView = new PManPanelView({
        pmanView: this
      });
      this.pmanPanelRegion.show(this.pmanPanelView);
    },

    _triggerEditMode: function () {
      var perspectiveConfig = new Backbone.Model(this.perspective.get('perspective'));
      this.context.triggerMethod('enter:edit:perspective', perspectiveConfig);
    },

    onRender: function () {
      var self = this;
      this.options.container.addClass('perspective-editing');
      this.options.applyMasking();
      this._initializeWidgets();
      this._triggerEditMode();
      $(document).on('click.' + this.cid, {view: this}, this._documentClick);
      this._fetchPerspective();

    },

    _documentClick: function (event) {
      var self = event.data.view;
      if (self.ui.addIcon.is(event.target) || !!self.ui.addIcon.has(event.target).length) {
        return;
      }
      if (self.ui.pmanPanel.is(event.target) || !!self.ui.pmanPanel.has(event.target).length) {
        return;
      }
      self._closeToolsPanel();
    },
    _doExitPerspective: function () {
      this.options.container.removeClass('perspective-editing');
      this.context.triggerMethod('exit:edit:perspective', this.perspective);
      $(document).off('click.' + this.cid, this._documentClick);
      this.trigger('destroy');
    },

  }, {
    placeHolderWidget: 'csui/perspective.manage/widgets/perspective.placeholder'
  });

  return PManView;
});
