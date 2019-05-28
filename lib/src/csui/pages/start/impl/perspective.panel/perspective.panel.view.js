/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/base', 'csui/pages/start/impl/perspective.factory',
  'csui/controls/progressblocker/blocker',
  'csui/utils/commandhelper',
  'csui/pages/start/impl/perspective.panel/perspective.animator',
  'css!csui/pages/start/impl/perspective.panel/perspective.panel',
  'csui/lib/jquery.redraw', 'csui/lib/jquery.scrollbarwidth'
], function (require, module, $, _, Marionette, base, PerspectiveFactory,
    BlockingView, CommandHelper, PerspectiveAnimator) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    progressWheel: true,
    waitForData: true,
    perspectiveShowDelay: 0,
    limitTimeToWaitForData: true,
    maximumTimeToWaitForData: 3000,
    detachableBlockingView: true
  });

  if (!config.waitForData) {
    config.perspectiveShowDelay = 0;
  }

  var pageUnloading = false;
  $(window).bind('beforeunload.' + module.id, function (event) {
    pageUnloading = true;
  });

  var PerspectivePanelView = Marionette.ItemView.extend({
    className: 'cs-perspective-panel',

    template: false,

    constructor: function PerspectivePanelView() {
      Marionette.View.prototype.constructor.apply(this, arguments);
      var context = this.options.context;
      this.perspectiveFactory = new PerspectiveFactory({
        context: context
      });
      this.perspectiveAnimator = new PerspectiveAnimator(this);
      BlockingView.imbue(this);
      this.blockingView.makeGlobal(config.detachableBlockingView);

      this.listenTo(context, "maximize:widget", this._addMaximizedWidget);
      this.listenTo(context, "restore:widget:size", this._removeMaximizedWidget);

      this.listenTo(context, 'change:perspective', this.onChangePerspective);
      this.listenTo(context, 'enter:edit:perspective', this.onEnterEditPerspective);
      this.listenTo(context, 'exit:edit:perspective', this.onExitEditPerspective);
      this.listenTo(context, 'serialize:perspective', this.onSerializePerspective);
      if (config.progressWheel) {
        this.listenTo(context, 'request:perspective', this.blockActions)
            .listenTo(context, 'error:perspective', this.unblockActions)
            .listenTo(context, 'sync', this.unblockActions)
            .listenTo(context, 'error', this.unblockActions);
        if (config.limitTimeToWaitForData) {
          this.listenTo(context, 'request', function () {
            var self = this;
            setTimeout(function () {
              self.unblockActions();
            }, config.maximumTimeToWaitForData);
          });
        }
      }
      this.listenTo(this, 'render', this.onRendered);

      this._maximizedWidgets = {};
      this._currentPerspectiveSignature = undefined;
    },

    onEnterEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(perspectiveToEdit)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
          }.bind(this));
    },
    onSerializePerspective: function (perspectiveModel) {
      if (_.isFunction(this.currentPerspectiveView.serializePerspective)) {
        var self = this;
        this.currentPerspectiveView.serializePerspective(perspectiveModel).done(function (perspective) {
          self.options.context.trigger('save:perspective', perspective);
        }).fail(function (error) {
          self._showModalError({message: error});
        });
      }
    },

    onExitEditPerspective: function (perspectiveToEdit) {
      this.blockActions();
      this.isSwitchingEditMode = true; // To bypass animation
      this.doChangePerspective(this.options.context.perspective)
          .always(function () {
            this.isSwitchingEditMode = false;
            this.unblockActions();
          }.bind(this));
    },

    onRendered: function () {
      if (this.options.context.perspective.get('type')) {
        this.onChangePerspective();
      }
    },

    onChangePerspective: function () {
      this.doChangePerspective();
    },

    doChangePerspective: function (targetPerspective) {
      if (this._isRendered) {
        var context     = this.options.context,
            self        = this,
            perspective = targetPerspective || this.options.context.perspective,
            deferred    = $.Deferred();
        pageUnloading = false;
        this.perspectiveFactory.createPerspective(perspective)
            .done(function (perspectiveView) {
              perspectiveView.widgetsResolved.always(function () {
                context.clear();
                if (!pageUnloading) {
                  self._swapPerspective(perspectiveView, perspective).always(function () {
                    deferred.resolve(perspectiveView);
                  });
                } else {
                  deferred.resolve(perspectiveView);
                }
              });
            })
            .fail(function (error) {
              if (config.progressWheel) {
                self.unblockActions();
              }
              if (!pageUnloading) {
                self._showError(error);
              }
              deferred.reject(error);
            });
        return deferred.promise();
      }
      return $.Deferred().resolve().promise();
    },

    _isInPerspectiveEditMode: function () {
      return !!this.currentPerspective && !!this.currentPerspective.get('options') &&
             this.currentPerspective.get('options').perspectiveMode === 'edit';
    },

    _setSupportMaximizeWidget: function () {
      if (this._isInPerspectiveEditMode() ||  // Maximize not allowed in Edit Perspective mode
          this.currentPerspectiveView._supportMaximizeWidget !== true) {
        $("body").removeClass("csui-support-maximize-widget");
      }
      else {
        $("body").addClass("csui-support-maximize-widget");
      }
    },

    _setShowingMaximizedWidget: function (showingMaximizedWidget) {
      if (showingMaximizedWidget) {
        $("body").addClass("csui-maximized-widget-mode");
      }
      else {
        $("body").removeClass("csui-maximized-widget-mode");
      }
      !!this.currentPerspectiveView && this.currentPerspectiveView.triggerMethod('dom:refresh');
    },

    _addMaximizedWidget: function (ev) {
      if (this._isInPerspectiveEditMode()) {
        return;
      }
      if (this._maximizedWidgets[this._getCurrentPerspectiveSignature()] === undefined) {
        var maximizedWidgetInfo = {
          perspectiveSignature: this._getCurrentPerspectiveSignature(),
          cellAddress: this.getCellAddress(ev)
        };
        this._maximizedWidgets[maximizedWidgetInfo.perspectiveSignature] = maximizedWidgetInfo;
        this._maximizeWidgetView(maximizedWidgetInfo.cellAddress);
      }
      else {
        !!this.currentPerspectiveView && this.currentPerspectiveView.triggerMethod('dom:refresh');
      }
    },

    getCellAddress: function (ev) {
      return (ev.widgetView ? ev.widgetView.$el.parent().attr("data-csui-cell_address") :
              ev.currentPerspectiveView.$el.find(".binf-row").children().attr(
                  "data-csui-cell_address"));
    },
    _removeMaximizedWidget: function (ev) {
      delete this._maximizedWidgets[this._getCurrentPerspectiveSignature()];
      this._restoreWidgetViewSize(ev.widgetView);
    },

    _maximizeWidgetView: function (cellAddress) {
      this.currentPerspectiveView.$el.find(".binf-row > div").each(function () {
        $(this).attr("data-csui-mwv-old-class", $(this).attr("class"));
        if ($(this).attr("data-csui-cell_address") === cellAddress) {
          $(this).parent().addClass("csui-maximized-row zero-gutter");
          $(this).attr("class", "binf-col-xs-12 csui-maximized-column zero-gutter");
        }
        else {
          $(this).attr("class", "binf-hidden-xs binf-hidden-sm binf-hidden-md binf-hidden-lg");
        }
      });

      this._setShowingMaximizedWidget(true);
    },

    _restoreWidgetViewSize: function (widgetView) {
      var $widgetRow = widgetView.$el.parent().parent();

      $widgetRow.removeClass("csui-maximized-row zero-gutter");
      this.currentPerspectiveView.$el.find(".binf-row > div").each(function () {
        $(this).attr("class", $(this).attr("data-csui-mwv-old-class"));
      });

      this._setShowingMaximizedWidget(false);
    },

    _ensureWidgetViewMaximized: function () {
      this._setSupportMaximizeWidget();

      this._currentPerspectiveSignature = undefined;
      var currentMaximizedWidgetInfo = this._maximizedWidgets[this._getCurrentPerspectiveSignature()];
      if (currentMaximizedWidgetInfo === undefined ||
          this.currentPerspectiveView._supportMaximizeWidgetOnDisplay !== true) {
        this._setShowingMaximizedWidget(false);
      }
      else {
        this._maximizeWidgetView(currentMaximizedWidgetInfo.cellAddress);
      }

      if (this.currentPerspectiveView._supportMaximizeWidgetOnDisplay !== true) {
        delete this._maximizedWidgets[this._getCurrentPerspectiveSignature()];
      }
    },

    _getCurrentPerspectiveSignature: function () {
      if (this._currentPerspectiveSignature === undefined) {
        var cellSignatures = [];
        !!this.currentPerspectiveView &&
        this.currentPerspectiveView.$el.find(".binf-row > div").each(function () {
          var address = $(this).attr("data-csui-cell_address");
          var widgetType = $(this).attr("data-csui-widget_type");
          var classNames = $(this).attr("class");

          if (address === undefined) {
            address = "";
          }

          cellSignatures.push([address, widgetType, classNames].join(","));
        });

        this._currentPerspectiveSignature = cellSignatures.join("|");
      }

      return this._currentPerspectiveSignature;
    },

    _swapPerspective: function (perspectiveView, perspective) {
      var self     = this,
          perspectiveShown,
          deferred = $.Deferred();

      var scopeId = window.location.href;
      scopeId = scopeId.substr(scopeId.indexOf('#'));

      function showPerspective() {
        if (!perspectiveShown) {
          perspectiveShown = true;
          _.delay(function () {
            if (!pageUnloading) {
              self._showPerspective(perspectiveView, perspective, deferred);
            }
          }, config.perspectiveShowDelay);
        }
      }

      function fetchData() {
        self.options.context
            .fetch()
            .fail(function (error) {
              if (!pageUnloading) {
                if (window.csui && window.csui.mobile) {
                  if (error.statusCode === 500 && (window.location.href.indexOf('#') === -1 ||
                                                   window.location.href.indexOf('#home') !== -1)) {
                    showPerspective();
                    return;
                  }
                  else if (error.statusCode === 0) {
                    CommandHelper.showOfflineMessage(error);
                  }
                  else {
                    self._showModalError(error);
                    self.options.context.trigger('reject:perspective', error);
                  }

                  perspectiveView.destroy();
                }
                else {
                  self._showError(error);
                  showPerspective();
                }
              }
            })
            .done(showPerspective);
      }

      perspectiveView.render();

      if (scopeId && scopeId === '#offline.list') {
        showPerspective();
        this.unblockActions();
      } else if (config.waitForData) {
        fetchData();
        if (config.limitTimeToWaitForData) {
          setTimeout(showPerspective, config.maximumTimeToWaitForData);
        }
      } else {
        var eventName = this.currentPerspectiveView ?
                        'swap:perspective' : 'show:perspective';
        this.once(eventName, fetchData);
        showPerspective();
      }
      return deferred;
    },
    _showPerspectiveForEditMode: function (perspectiveView, perspective) {
      this.currentPerspectiveView.destroy();

      this.currentPerspectiveView = perspectiveView;
      this.currentPerspective = perspective;
      this._currentPerspectiveSignature = undefined;
      this._ensureWidgetViewMaximized();

      perspectiveView.triggerMethod('before:show');
      this.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },

    _showPerspective: function (perspectiveView, perspective, deferred) {
      var body = $(document.body),
          self = this;

      function finishShowingPerspective(perspectiveView) {
        body.scrollTop(0);
        self.perspectiveAnimator.finishAnimation();
        self.currentPerspectiveView = perspectiveView;
        self.currentPerspective = perspective;
        self._ensureWidgetViewMaximized();
        self._showWidgetInMaximizeMode(perspective);
        deferred.resolve(perspectiveView);
      }

      if (!!this.isSwitchingEditMode) {
        this._showPerspectiveForEditMode(perspectiveView, perspective);
        deferred.resolve(perspectiveView);
        return;
      }
      this.perspectiveAnimator.startAnimation(perspectiveView);

      if (this.currentPerspectiveView) {
        this.triggerMethod('before:swap:perspective', this);
        this.perspectiveAnimator.swapPerspective(this.currentPerspectiveView, perspectiveView)
            .done(function () {
              self.currentPerspectiveView.destroy();
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('swap:perspective', self);
            });
      }
      else {
        this.triggerMethod('before:show:perspective', this);
        this.perspectiveAnimator.showPerspective(perspectiveView)
            .done(function () {
              finishShowingPerspective(perspectiveView);
              self.triggerMethod('show:perspective', self);
            });

      }
    },
    _showWidgetInMaximizeMode: function (perspective) {
      var perspectiveType    = perspective && perspective.get("type"),
          perspectiveOptions = perspective && perspective.get("options"),
          widgetType,
          noOfWidgets        = 0,
          maximizeWidgets    = ['csui/widgets/nodestable', 'nodestable'];
      if (perspectiveType === 'grid' && perspectiveOptions.rows.length === 1 &&
          perspectiveOptions.rows[0].columns.length === 1) {
        widgetType = perspectiveOptions.rows[0].columns[0].widget.type;
        noOfWidgets++;
      }
      else if (perspectiveType === 'left-center-right') {
        if (perspectiveOptions.right.type) {
          widgetType = perspectiveOptions.right.type;
          noOfWidgets++;
        }
        if (perspectiveOptions.center.type) {
          widgetType = perspectiveOptions.center.type;
          noOfWidgets++;
        }
        if (perspectiveOptions.left.type) {
          widgetType = perspectiveOptions.left.type;
          noOfWidgets++;
        }
      } else if (perspectiveType === 'flow') {
        widgetType = perspectiveOptions.widgets[0].type;
        noOfWidgets = perspectiveOptions.widgets.length;
      }
      if (noOfWidgets === 1 && ($.inArray(widgetType, maximizeWidgets) != -1)) {
        perspective.set("showWidgetInMaxMode", true);
        this._addMaximizedWidget(this);
      }

    },

    _showError: function (error) {
      require(['csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage('error', error.message);
      });
    },

    _showModalError: function (error, options) {
      require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.message, options);
      });
    }
  });

  return PerspectivePanelView;
});
