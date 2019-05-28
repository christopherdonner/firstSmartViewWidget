/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone', 'csui/utils/log',
  'csui/models/widget/widget.model',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/behaviours/impl/nls/lang',
  'hbs!csui/perspective.manage/behaviours/impl/widget.masking',
  'css!csui/perspective.manage/behaviours/impl/widget.masking',
], function (require, i18n, _, $, Marionette, Backbone, log, WidgetModel, WidgetOptionsFormView,
    lang,
    maskingTemplate) {
  'use strict';
  var WidgetMaskingView = Marionette.ItemView.extend({
    template: maskingTemplate,
    className: function () {
      return WidgetMaskingView.className
    },

    ui: {
      delete: '.csui-pman-widget-close',
      masking: '.csui-pman-widget-masking'
    },

    events: {
      'click @ui.masking': '_showCallout',
      'drop': 'onDrop',
      'dragover': 'onDragOver',
      'dragenter': 'onDragEnter',
      'dragleave': 'onDragLeave',
      'click @ui.delete': 'onDeleteClick'
    },

    constructor: function WidgetMaskingView(options) {
      Marionette.ItemView.apply(this, arguments);
      this.dropCounter = 0;
      this.manifest = undefined;
      this.perspectiveView = options.perspectiveView;
      this.widgetView = options.widgetView;
      this.widgetConfig = options.widgetConfig;
    },

    onRender: function () {
      var self = this;
      this._loadManifest().done(function (manifest) {
        self._createOptionsForm(function () {
          self._updateWidgetOptions();
        });
      });
    },

    _showCallout: function () {
      if (!this.widgetConfig || _.isEmpty(this.widgetConfig) ||
          this.widgetConfig.type === 'csui/perspective.manage/widgets/perspective.placeholder') {
        return;
      }
      this._loadManifest().done(function (manifest) {
        this._showOptionsCallout(manifest);
      }.bind(this));
    },

    _showOptionsCallout: function (manifest) {
      this._calculatePopoverPlacement();

      if (!!this.$popoverEl.data('binf.popover')) {
        this.$popoverEl.binf_popover('destroy');
        return;
      }
      this.perspectiveView.$el.find('.' + WidgetMaskingView.className +
                                    ' .csui-pman-popover-holder').binf_popover('destroy');

      if (!!this.optionsFormView) {
        this._showPopover();
      } else {
        this._createOptionsForm();
      }
    },

    _createOptionsForm: function (afterRenderCallback) {
      this.optionsFormView = new WidgetOptionsFormView(_.defaults({
        context: this.perspectiveView.options.context,
        manifest: this.manifest
      }, this.options));
      if (!!afterRenderCallback) {
        this.optionsFormView.listenToOnce(this.optionsFormView, 'render:form', afterRenderCallback);
      }
      this.optionsFormView.render();
      this.optionsFormView.listenTo(this.optionsFormView, 'change:field',
          this._onChangeField.bind(this));
    },

    _calculatePopoverPlacement: function () {
      var adjust       = this._determineCalloutPlacement(),
          contentClass = (i18n && i18n.settings.rtl) ?
                         adjust.placement == 'right' ? adjust.mirror ? 'right' : 'left' : 'right' :
                         ((adjust.placement == 'left' && adjust.mirror) ? 'right' :
                          adjust.placement);
      this.$popoverEl = this.$el.find('.csui-pman-popover-' + contentClass);
      this.placement = adjust.placement;
    },
    _showPopover: function () {
      var popoverOptions = {
        html: true,
        content: this.optionsFormView.el,
        trigger: 'manual',
        viewport: { // Limit popover placement to perspective panel only
          selector: this.options.perspectiveSelector,
          padding: 15
        },
        placement: this.placement
      };
      this.$popoverEl.binf_popover(popoverOptions);
      this.$popoverEl.off('hidden.binf.popover')
          .on('hidden.binf.popover', this._handleCalloutHide.bind(this));
      this.$popoverEl.binf_popover('show');
      this._registerPopoverEvents();
    },

    _registerPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').on('click.' + this.cid, {view: this},
          this._documentClickHandler);
      $('.pman-container').on('click.' + this.cid, {view: this}, this._documentClickHandler);
    },

    _unregisterPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid,
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid, this._documentClickHandler);
    },
    _handleCalloutHide: function () {
      this._unregisterPopoverEvents();
      this._updateWidgetOptions();
    },

    _updateWidgetOptions: function () {
      var isValid = this.optionsFormView.validate();
      var updatedConfig = this.optionsFormView.getValues();
      this.perspectiveView.trigger("update:widget:options", this.widgetView, isValid,
          updatedConfig);
      if (isValid) {
        this.widgetView.$el.removeClass('binf-has-error');
      } else {
        this.widgetView.$el.addClass('binf-has-error');
      }
    },
    _documentClickHandler: function (event) {
      var self = event.data.view;
      if (!!$(event.target).closest('.binf-popover').length) {
        return;
      }
      if (self.$el.is(event.target) || !!self.$el.has(event.target).length) {
        return;
      }
      if (!$.contains(document, event.target)) {
        return;
      }
      self._unregisterPopoverEvents();
      self.$popoverEl.binf_popover('destroy');
    },

    _onChangeField: function (field) {
      if (field.name === WidgetOptionsFormView.widgetSizeProperty) {
        this.perspectiveView.trigger("update:widget:size", this.options.widgetView, field.value);
        this.$popoverEl.binf_popover('destroy');
      }
    },

    _determineCalloutPlacement: function () {
      var offset    = this.$el.offset(),
          left      = offset.left,
          width     = $(document).outerWidth(),
          right     = $(document).width() - (left + this.$el.width()),
          isRtl     = i18n && i18n.settings.rtl,
          placement = isRtl ? right < 550 ? 'left' : 'right' : left < 550 ? 'right' : 'left',
          mirror    = false;
      var contentWidth = isRtl ? right + this.$el.width() + 500 :
                         this.$el.offset().left + this.$el.width() + 500;
      var documentWidth = $(document).width();
      if ((contentWidth > documentWidth) &&
          (!isRtl && placement == 'right' || isRtl && placement == 'left')) {
        placement = placement == 'right' ? 'left' : 'right';
        mirror = true;
      }
      return {
        placement: placement,
        mirror: mirror
      };
    },

    _isPreviewWidget: function () {
      return this.widgetConfig.type === WidgetMaskingView.perspectiveWidget;
    },

    _loadManifest: function () {
      if (this.manifest !== undefined) {
        return $.Deferred().resolve(this.manifest);
      }
      if (this._isPreviewWidget()) {
        this.manifest = this.widgetConfig.options.widget.get('manifest');
        return this._loadManifest();
      }
      var deferred = $.Deferred();
      var self        = this,
          widgetModel = new WidgetModel({id: this.widgetConfig.type});
      widgetModel.fetch().then(function () {
        self.manifest = widgetModel.get('manifest');
        deferred.resolve(self.manifest);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    onDeleteClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var self = this;
      require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.deleteConfirmMsg, lang.deleteConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self._doDeleteWidget();
              }
            });
      });
    },

    _doDeleteWidget: function () {
      this.perspectiveView.trigger("delete:widget", this.widgetView);
    },

    _doReplaceWidget: function (widgetToReplace) {
      var manifest = (widgetToReplace.get('manifest') || {});
      this.perspectiveView.trigger('replace:widget', this.widgetView, {
        type: WidgetMaskingView.perspectiveWidget,
        kind: manifest.kind,
        options: {
          options: {}, // To be used and filled by callout form
          widget: widgetToReplace
        }
      });
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
      this.dropCounter++;
      this.$el.addClass('csui-widget-drop');
    },

    onDragLeave: function () {
      this.dropCounter--;
      if (this.dropCounter === 0) {
        this.$el.removeClass('csui-widget-drop');
      }
    },

    _extractWidgetToDrop: function (event) {
      var dragData = event.originalEvent.dataTransfer.getData("text");
      if (!dragData) {
        return undefined;
      }
      try { // TODO get rid of try catch and handle like non-droppable object
        var widgetToReplace = new WidgetModel(JSON.parse(dragData));
        return widgetToReplace;
      } catch (e) {
        return false;
      }
    },

    onDrop: function (event) {
      this.onDragLeave();
      var widgetToReplace = this._extractWidgetToDrop(event);
      if (!widgetToReplace) {
        return;
      }
      if (this.widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        this._doReplaceWidget(widgetToReplace);
      } else {
        var self = this;
        require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(lang.replaceConfirmMsg, lang.replaceConfirmTitle)
              .done(function (userConfirmed) {
                if (userConfirmed) {
                  self._doReplaceWidget(widgetToReplace);
                }
              });
        });
      }
    }

  }, {
    className: 'csui-configure-perspective-widget',
    perspectiveWidget: 'csui/perspective.manage/widgets/perspective.widget',
    placeholderWidget: 'csui/perspective.manage/widgets/perspective.placeholder',
    widgetSizeProperty: '__widgetSize'
  });

  var PerspectiveWidgetConfigurationBehaviour = Marionette.Behavior.extend({

    defaults: {
      perspectiveSelector: '.perspective-editing .cs-perspective > div'
    },

    constructor: function PerspectiveWidgetConfigurationBehaviour(options, view) {
      if (!options.perspectiveView) {
        throw new Marionette.Error({
          name: 'perspectiveView',
          message: 'Undefined perspectiveView options'
        });
      }
      this.perspectiveView = options.perspectiveView;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      _.extend(this.perspectiveView, {
        getPManPlaceholderWidget: function () {
          return {
            type: WidgetMaskingView.placeholderWidget,
            options: {}
          };
        }
      })
    },

    _ensureWidgetElement: function () {
      if (!_.isObject(this.$widgetEl)) {
        this.$widgetEl = this.options.el ? $(this.options.el) : this.view.$el;
      }
      if (!this.$widgetEl || this.$widgetEl.length === 0) {
        throw new Marionette.Error('An "el" ' + this.$widgetEl.selector + ' must exist in DOM');
      }
      return true;
    },

    _checkAndApplyMask: function () {
      if (this.$el.find('.' + WidgetMaskingView.className).length > 0) {
        return;
      }
      this._ensureWidgetElement();
      var widgetConfig = this._resolveWidgetConfiguration();
      var maskingView = new WidgetMaskingView(
          _.extend(this.options, {
            widgetView: this.view,
            widgetConfig: widgetConfig
          }));
      maskingView.render();
      this.$widgetEl.append(maskingView.el);
      this.$widgetEl.addClass('csui-pman-editable-widget')
      this.$widgetEl.data('pman.widget', {attributes: {manifest: widgetConfig}});
    },

    _resolveWidgetConfiguration: function () {
      if (!!this.view.model && !!this.view.model.get('widget')) {
        return this.view.model.get('widget');
      }
      if (!!this.view.getPManWidgetConfig && _.isFunction(this.view.getPManWidgetConfig)) {
        return this.view.getPManWidgetConfig();
      }
      if (!!this.options.widgetConfig) {
        return this.options.widgetConfig;
      }
    },

    onRender: function () {
      this._checkAndApplyMask();
    },

    onDestroy: function () {
    },

  });

  return PerspectiveWidgetConfigurationBehaviour;

})
