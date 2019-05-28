/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',                             // Cross-browser utility belt
  'csui/lib/jquery',
  'csui/lib/marionette',                             // MVC application support
  'csui/utils/nodesprites',
  'i18n',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/globalmessage/impl/progresspanel/impl/nls/progresspanel.lang',  // Use localizable texts
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',            // Template to render the HTML
  'hbs!csui/controls/globalmessage/impl/progresspanel/impl/progressbar',              // Template to render the HTML
  'css!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',            // Stylesheet needed for this view
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (_, $, Marionette, NodeSprites, i18n, Base, PerfectScrollingBehavior,
    lang, panelTemplate, barTemplate) {
  'use strict';

  var BarStateValues = ["pending", "processing", "rejected", "resolved", "aborted"];

  var updateProgressArea = function (elem, info) {
    var errorElem = elem.find(".csui-error");
    if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
      var progressBar = elem.find(".binf-progress-bar");
      this.options.messageHelper.switchField(elem, ".csui-progress", "dynamic",
          ["static", "dynamic"]);
      var bytesOfSize = _.str.sformat(lang.BytesOfSize,
          Base.getReadableFileSizeString(info.count),
          Base.getReadableFileSizeString(info.total));
      elem.find(".csui-progress-text").text(bytesOfSize);
      progressBar.attr("aria-valuenow", info.percentage);
      progressBar.css("width", _.str.sformat("{0}%", info.percentage));
      elem.find(".csui-progress-dynamic .csui-percent").text(
          _.str.sformat("{0}%", info.percentage));
      elem.find('.csui-progress').attr('aria-label',
          _.str.sformat("{0} {1}%", info.label, info.percentage));

    } else {
      this.options.messageHelper.switchField(elem, ".csui-progress", "static",
          ["static", "dynamic"]);
      this.options.messageHelper.switchField(elem, ".csui-progress-static", info.state,
          BarStateValues);
      var stateAriaLabel = _.str.sformat("{0} {1}", info.label,
          lang["State_" + info.state]);
      elem.find('.csui-progress')
          .attr('aria-label', stateAriaLabel);
    }
    errorElem.text(info.errorMessage);
    errorElem.attr("title", info.errorMessage);
    if (info.errorMessage) {
      elem.addClass('csui-error');
    }
    this.options.messageHelper.switchField(elem, ".csui-stateaction", info.state,
        BarStateValues);
  };

  var ProgressBarView = Marionette.ItemView.extend({
    constructor: function ProgressBarView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
      var model = this.model;
      if (!!model.node && model.node.get('mime_type') === undefined) {
        model.node.set({
          container: false,
          type: 144,
          mime_type: model.get('mime_type') || model.get('type')
        }, {silent: true});
      }
      this.listenTo(this.model, 'change', this._updateItem);
    },

    _updateItem: function () {

      var info = this._computeProgress(),
          elem = this.$el;
      updateProgressArea.call(this, elem, info);
    },

    _computeProgress: function () {
      var count      = this.model.get('count'),
          total      = this.model.get('total'),
          state      = this.model.get("state"),
          percentage = Math.floor(count / total * 100);
      if (percentage === 100 && state === 'processing') {
        percentage = 99;
      }
      return {
        count: count,
        total: total,
        percentage: percentage,
        state: state,
        errorMessage: this.model.get("errorMessage"),
        label: _.str.sformat("{0} {1}", this.options.oneFilePending, this.getItemLabel())
      };
    },

    className: "csui-progressbar csui-progressrow",
    template: barTemplate,

    getItemLabel: function () {
      return this.model.get('newName') || this.model.get('name');
    },

    templateHelpers: function () {
      var info        = this._computeProgress(),
          model       = this.model,
          name        = this.getItemLabel(),
          cancelAria  = _.str.sformat(lang.CancelAria, name),
          commandName = !!model.get('commandName') || model.get('commandName');
      info.name = name;
      info.enableCancel = this.options.enableCancel;
      info.type_icon_class = this.model.node ? NodeSprites.findClassByNode(this.model.node) : "";
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      info.cancel = lang.Cancel;
      info.cancelAria = cancelAria;
      info.expand = lang.Expand;
      info.collapse = lang.Collapse;
      info.close = lang.Close;
      return info;
    },

    onRender: function () {
      this._updateItem();
    },

    ui: {
      pendingAction: '.csui-stateaction-pending',
      processingAction: '.csui-stateaction-processing',
      error: '.csui-error'
    },

    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel'
    },

    doCancel: function () {
      this.model.abort();
    }
  });

  var ProgressPanelView = Marionette.CompositeView.extend({
    constructor: function ProgressPanelView(options) {
      options || (options = {});
      _.defaults(options, {
        oneFileSuccess: lang.UploadOneItemSuccessMessage,
        multiFileSuccess: lang.UploadManyItemsSuccessMessage,
        oneFilePending: lang.UploadingOneItem,
        multiFilePending: lang.UploadingItems,
        oneFileFailure: lang.UploadOneItemFailMessage,
        multiFileFailure: lang.UploadManyItemsFailMessage2,
        someFileSuccess: lang.UploadSomeItemsSuccessMessage,
        someFilePending: lang.UploadingSomeItems,
        someFileFailure: lang.UploadSomeItemsFailMessage2,
        enableCancel: true
      });
      if (options.enableCancel) {
        this.panelStateValues = ["resolved", "rejected", "aborted", "processing"];
      }
      else {
        this.panelStateValues = ["resolved", "rejected", "aborted"];
      }
      Marionette.CompositeView.prototype.constructor.call(this, options);
      this.listenTo(this.collection, 'change', this._updateHeader);
      this.originatingView = options.originatingView;
      if (!!this.originatingView) {
        this.originatingView.trigger('global.alert.inprogress');
      }
    },

    onDestroy: function () {
      this.handleProgressComplete();
    },

    handleProgressComplete: function () {
      if (this.originatingView) {
        this.originatingView.trigger('global.alert.completed');
      }
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '> .csui-items-wrapper',
        suppressScrollX: true
      }
    },

    isProgressFailed: function () {
      return $.inArray(this.state, ['rejected', 'aborted']) !== -1;
    },

    isProgressCompleted: function () {
      return $.inArray(this.state, ['resolved', 'rejected', 'aborted']) !== -1;
    },

    _updateHeader: function () {
      var info = this._computeProgress();
      var options = this.options;
      var langTitle;
      var collLen = this.collection.length;
      if (info.state === 'pending' || info.state === 'processing') {
        langTitle = this._getFormatString(options.oneFilePending, options.someFilePending,
            options.multiFilePending, collLen);
      } else if (info.state === 'resolved') {
        langTitle = this._getFormatString(options.oneFileSuccess, options.someFileSuccess,
            options.multiFileSuccess, collLen);
      } else {
        langTitle = this._getFormatString(options.oneFileFailure, options.someFileFailure,
            options.multiFileFailure, collLen);
      }
      info.label = langTitle = _.str.sformat(langTitle,
          this.collection.length, this.collection.length - info.failed, info.failed);
      this.ui.header.find(".csui-title").text(langTitle);
      this.state = info.state;
      if (this.isProgressFailed()) {
        this.ui.header
            .addClass('csui-error')
            .find('.csui-header-icon')
            .toggleClass('csui-icon-notification-warning-white binf-hidden');
        this.ui.processingAction
            .addClass('binf-hidden');
        this.ui.closeAction.parent('.csui-close')
            .removeClass('binf-hidden');
        this.ui.header.find('.csui-progress').addClass('binf-hidden');
        this.ui.header.find(".csui-title").attr('tabindex', '0').focus();
      }

      if (this.isProgressCompleted()) {
        this.handleProgressComplete();
      }

      updateProgressArea.call(this, this.ui.header, info);
      if (!this.stateExpandCollapse) {
        var arrow = this.ui.header.find(".csui-expand").find(":not(.binf-hidden)");
        if (arrow.hasClass("csui-expand-up")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-expand-down")) {
          this.doCollapse(false);
        }
      }
      var isempty = !this.collection || this.collection.length === 0;
      if (this.$el.hasClass("csui-empty")) {
        if (!isempty) {
          this.$el.removeClass("csui-empty");
        }
      } else {
        if (isempty) {
          this.$el.addClass("csui-empty");
        }
      }
    },

    _getFormatString: function (str1, str2, str5, collen) {
      var res;
      if (collen <= 1) {
        res = str1;
      } else if (collen > 1 && collen < 5) {
        res = str2;
      } else {
        res = str5;
      }
      return res;
    },

    _computeProgress: function () {
      var allDone    = true,
          processing = false,
          allAborted = true,
          failed     = 0,
          count      = 0,
          total      = 0;
      this.collection.forEach(function (item) {
        count += item.get('count');
        total += item.get('total');
        if (item.get("state") === "pending" || item.get("state") === "processing") {
          allDone = false;
        }
        if (item.get("state") !== "pending") {
          processing = true;
        }
        if (item.get("state") === "rejected" || item.get("state") === "aborted") {
          ++failed;
        }
        if (item.get("state") === "resolved" || item.get("state") === "rejected") {
          allAborted = false;
        }
      });
      var percentage = (total > 0) ? Math.floor(count / total * 100) : 0;
      if (percentage === 100 && !allDone) {
        percentage = 99;
      }
      var state   = allDone ? failed ? allAborted ? "aborted" : "rejected" : "resolved" :
                    processing ? "processing" : "pending",
          dynamic = state !== "pending";
      return {
        count: count,
        total: total,
        failed: failed,
        percentage: percentage,
        state: state,
        dynamic: dynamic
      };
    },
    className: 'csui-progresspanel',

    childView: ProgressBarView,
    childViewContainer: ".csui-items",
    childViewOptions: function () {
      return _.extend(this.options, {
        enableCancel: this.options.enableCancel,
        messageHelper: this.options.messageHelper
      });
    },
    template: panelTemplate,

    templateHelpers: function () {
      var info = this._computeProgress();
      BarStateValues.forEach(function (value) {
        info["state_" + value] = lang["State_" + value];
      });
      this.panelStateValues.forEach(function (value) {
        info["stateaction_" + value] = lang["StateAction_" + value];
        info["stateaction_all_" + value] = lang["StateAction_all_" + value];
      });
      info.cancel = lang.Cancel;
      info.expand = lang.Expand;
      info.expandAria = lang.ExpandAria;
      info.collapse = lang.Collapse;
      info.collapseAria = lang.CollapseAria;
      info.close = lang.Close;
      info.closeAria = lang.CloseAria;
      info.processing = (info.state === "processing") ? true : false;
      info.progressTitleId = _.uniqueId("progressTitle");
      return info;
    },

    onRender: function () {
      this._updateHeader();
    },

    ui: {
      header: '.csui-header',
      pendingAction: '.csui-header .csui-stateaction-pending',
      processingAction: '.csui-header .csui-stateaction-processing',
      closeAction: '.csui-header .csui-action-close',
      collapseAction: '.csui-header .csui-expand-up',
      expandAction: '.csui-header .csui-expand-down'
    },
    events: {
      'click @ui.pendingAction': 'doCancel',
      'click @ui.processingAction': 'doCancel',
      'click @ui.closeAction': 'doClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand'
    },

    doCancel: function () {
      this.collection.forEach(function (item) {
        item.abort();
      });
    },

    doCollapse: function (animated) {
      animated = (animated === false) ? false : true;
      var items = this.$el.find(".csui-items");
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
          ".csui-expand", "down",
          ["up", "down"]);
      this.options.messageHelper.collapsePanel(this, items, items, animated);
      this.stateExpandCollapse = "collapsed";
      this.$el.find('.csui-expand-down').focus();
    },

    doExpand: function (animated) {
      var items = this.$el.find(".csui-items"),
          self  = this;
      animated = (animated === false) ? false : true;
      this.options.messageHelper.switchField(this.$el.find(".csui-header"),
          ".csui-expand", "up",
          ["up", "down"]);
      this.options.messageHelper.expandPanel(this, items, items, animated);
      this.stateExpandCollapse = "expanded";
      this.$el.find('.csui-expand-up').focus();
      this.$el.one(this.options.messageHelper.transitionEnd(), function () {
        self.trigger('ensure:scrollbar');
      });
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      this.currentlyFocusedElement().focus();
    },

    currentlyFocusedElement: function () {
      return this.ui.header.find('.csui-progress');
    },

    doClose: function () {
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          if (self.isProgressFailed()) {
            self.trigger('escaped:focus');
          }
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    doResize: function () {
      if (this.options.sizeToParentContainer) {
        var minWidth = parseInt(this.$el.css('min-width'), 10);
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        this.uncompressedMinWidth || (this.uncompressedMinWidth = minWidth);
        if (this.uncompressedMinWidth > parentWidth) {
          this.$el.addClass('compressed');
        }
        else {
          this.$el.removeClass('compressed');
        }
        var newWidth = this.$el.width();
        var translateX = (parentWidth - newWidth) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    }
  });

  return ProgressPanelView;

});
