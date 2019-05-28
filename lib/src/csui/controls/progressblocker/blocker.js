/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore',
  'csui/lib/marionette', 'csui/utils/log',
  'i18n!csui/controls/progressblocker/impl/nls/lang',
  'hbs!csui/controls/progressblocker/impl/blocker',
  'css!csui/controls/progressblocker/impl/blocker'
], function (module, _, Marionette, log, lang, template) {
  'use strict';

  log = log(module.id);

  var config = module.config();
  _.defaults(config, {
    delay: 10,
    disableDelay: 10,
    globalOnly: false
  });
  var enableDelay = config.delay,
      disableDelay = config.disableDelay,
      globalOnly = config.globalOnly,
      suppressedViews = [],
      globalBlockingView, detachableBlockingView;

  var BlockingView = Marionette.ItemView.extend({
    className: 'load-container binf-hidden',
    template: template,

    constructor: function BlockingView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.parentView = options.parentView;
      this.focus = options.focus;
      this.counter = 0;
    },

    serializeData: function () {
      return {
        loadingText: lang.loadingText
      };
    },

    enable: function () {
      if (!this.options.local) {
        var blockingView = this._getGlobalBlockingView();
        if (blockingView) {
          log.debug(
              'Blocking view delegates global enabling by {0} ({1}) to {2} ({3}), counter: {4}.',
              log.getObjectName(this.parentView), this.parentView.cid,
              log.getObjectName(blockingView.parentView), blockingView.parentView.cid,
              blockingView.counter) && console.log(log.last);
          if (detachableBlockingView) {
            suppressBlockingView(this);
          } else {
            return blockingView.enable();
          }
        }
      }
      if (this.counter) {
        ++this.counter;
      } else {
        this.counter = 1;
        if (this.disableTimeout) {
          clearTimeout(this.disableTimeout);
          this.disableTimeout = undefined;
        } else {
          this.enableTimeout = setTimeout(_.bind(function () {
            this.enableTimeout = undefined;
            this._show();
            log.debug('Blocking view enabled by {0} ({1}).',
                log.getObjectName(this.parentView), this.parentView.cid)
            && console.log(log.last);
            Marionette.triggerMethodOn(this.parentView, 'enable:blocking', this);
          }, this), enableDelay);
        }
      }
    },

    disable: function () {
      if (!this.options.local) {
        var blockingView = this._getGlobalBlockingView();
        if (blockingView) {
          log.debug(
              'Blocking view delegates global disabling by {0} ({1}) to {2} ({3}), counter: {4}.',
              log.getObjectName(this.parentView), this.parentView.cid,
              log.getObjectName(blockingView.parentView), blockingView.parentView.cid,
              blockingView.counter) && console.log(log.last);
          if (!detachableBlockingView) {
            return blockingView.disable();
          }
        }
      }
      if (this.counter > 1) {
        --this.counter;
      } else if (this.counter === 0) {
        log.debug('Blocking view has been already disabled by {0} ({1}).',
            log.getObjectName(this.parentView), this.parentView.cid)
        && console.log(log.last);
      } else {
        this.counter = 0;
        if (this.enableTimeout) {
          clearTimeout(this.enableTimeout);
          this.enableTimeout = undefined;
          releaseBlockingViews(this);
        } else {
          this.disableTimeout = setTimeout(_.bind(function () {
            this.disableTimeout = undefined;
            this._hide();
            log.debug('Blocking view disabled by {0} ({1}).',
                log.getObjectName(this.parentView), this.parentView.cid)
            && console.log(log.last);
            releaseBlockingViews(this);
            Marionette.triggerMethodOn(this.parentView, 'disable:blocking', this);
          }, this), disableDelay);
        }
      }
    },

    onBeforeDestroy: function () {
      this._clearTimeouts();
      this._resetGlobalBlockingView();
    },

    makeGlobal: function (detachable) {
      if (!globalBlockingView) {
        detachableBlockingView = !!detachable;
        globalBlockingView = this;
        this.$el.addClass('csui-global');
      }
    },

    _getGlobalBlockingView: function () {
      if (globalBlockingView && globalBlockingView !== this &&
          (globalOnly || globalBlockingView.counter)) {
        return globalBlockingView;
      }
    },

    _resetGlobalBlockingView: function () {
      if (globalBlockingView === this) {
        globalBlockingView = undefined;
        this.$el.removeClass('csui-global');
      }
    },

    _clearTimeouts: function () {
      if (this.enableTimeout) {
        clearTimeout(this.enableTimeout);
      }
      if (this.disableTimeout) {
        clearTimeout(this.disableTimeout);
      }
    },

    _show: function () {
      this.$el.removeClass('binf-hidden');
      if (this.focus) {
        this.$('.loader').focus();
      }
    },

    _hide: function () {
      this.$el.addClass('binf-hidden');
    }
  });

  var ParentWithBlockingView = {
    blockActions: function () {
      logParentBlockActions.call(this, true);
      showImage(this.blockingView.$el);
      this.blockingView.enable();
      ++this._blockingCounter;
      return this;
    },

    blockWithoutIndicator: function () {
      logParentBlockActions.call(this, false);
      hideImage(this.blockingView.$el);
      this.blockingView.enable();
      ++this._blockingCounter;
      return this;
    },

    unblockActions: function () {
      if (this === this.blockingView.parentView) {
        log.debug('Blocking view asked for disabling for {0} ({1}), counter: {2}.',
            log.getObjectName(this), this.cid, this.blockingView.counter)
        && console.log(log.last);
      } else {
        log.debug(
            'Blocking view asked for disabling for {0} ({1}) by {2} ({3}), counter: {4}.',
            log.getObjectName(this), this.cid,
            log.getObjectName(this.blockingView.parentView),
            this.blockingView.parentView.cid, this.blockingView.counter)
        && console.log(log.last);
      }
      this.blockingView.disable();
      if (this._blockingCounter) {
        --this._blockingCounter;
      }
      return this;
    },

    showBlockingView: function () {
      log.debug('Blocking view is showing for {0} ({1}).',
          log.getObjectName(this), this.cid) && console.log(log.last);
      this.blockingView.render();
      this.blockingView.parentView.$el.append(this.blockingView.el);
    },

    destroyBlockingView: function () {
      log.debug('Blocking view is destroying for {0} ({1}).',
          log.getObjectName(this), this.cid) && console.log(log.last);
      if (this._blockingCounter) {
        log.debug('Blocking view needs cleanup for {0} ({1}), counter: {2}.',
            log.getObjectName(this), this.cid, this._blockingCounter)
        && console.log(log.last);
      }
      while (this._blockingCounter) {
        this.unblockActions();
      }
      this.blockingView.destroy();
    }
  };

  function suppressBlockingView(view) {
    log.debug('Blocking view is suppressing {0} ({1}).',
        log.getObjectName(view.parentView), view.parentView.cid)
    && console.log(log.last);
    hideImage(view.$el);
    suppressedViews.push(view);
  }

  function releaseBlockingViews(view) {
    if (view === globalBlockingView) {
      suppressedViews.forEach(function (view) {
        log.debug('Blocking view is releasing {0} ({1}).',
            log.getObjectName(view.parentView), view.parentView.cid)
        && console.log(log.last);
        showImage(view.$el);
      });
      suppressedViews = [];
    }
  }

  function showImage(element) {
    element.find('.outer-border').removeClass('binf-hidden');
  }

  function hideImage(element) {
    element.find('.outer-border').addClass('binf-hidden');
  }

  function logParentBlockActions(indicator) {
    indicator = indicator ? 'with' : 'without';
    if (this === this.blockingView.parentView) {
      log.debug(
          'Blocking view asked for enabling {0} indicator for {1} ({2}), counter: {3}.',
          indicator, log.getObjectName(this), this.cid, this.blockingView.counter)
      && console.log(log.last);
    } else {
      log.debug(
          'Blocking view asked for enabling for {0} indicator for {0} ({1}) by {2} ({3}), counter: {4}.',
          indicator, log.getObjectName(this), this.cid,
          log.getObjectName(this.blockingView.parentView),
          this.blockingView.parentView.cid, this.blockingView.counter)
      && console.log(log.last);
    }
  }

  BlockingView.imbue = function (parent, parentView) {
    var options;
    if (Object.getPrototypeOf(parent) === Object.prototype) {
      options = parent;
      parent = options.parent;
      parentView = options.parentView;
    } else {
      options = {};
    }
    parentView || (parentView = parent);
    var blockingView = new BlockingView({
      parentView: parentView,
      local: options.local,
      focus: options.focus
    });
    parent.blockingView = blockingView;
    parent.blockingPrototype = ParentWithBlockingView;
    _.extend(parent, ParentWithBlockingView);
    parent._blockingCounter = 0;
    parent.listenTo(parentView, 'render', parent.showBlockingView)
          .listenTo(parentView, 'before:destroy', parent.destroyBlockingView);
  };

  var ChildWithBlockingView = {

    blockActions: function () {
      logChildBlockActions.call(this);
      this.childWithBlockingView.blockActions();
      return this;
    },

    blockWithoutIndicator: function () {
      logChildBlockActions.call(this);
      this.childWithBlockingView.blockWithoutIndicator();
      return this;
    },

    unblockActions: function () {
      log.debug('Blocking view delegates disabling for {0} ({1}) to {2} ({3}).',
          log.getObjectName(this), this.cid,
          log.getObjectName(this.childWithBlockingView),
          this.childWithBlockingView.cid) && console.log(log.last);
      this.childWithBlockingView.unblockActions();
      return this;
    }
  };

  function logChildBlockActions() {
    log.debug('Blocking view delegates enabling for {0} ({1}) to {2} ({3}).',
        log.getObjectName(this), this.cid, log.getObjectName(this.childWithBlockingView),
        this.childWithBlockingView.cid) && console.log(log.last);
  }

  BlockingView.delegate = function (parent, child) {
    if (Object.getPrototypeOf(parent) === Object.prototype) {
      var options = parent;
      parent = options.parent;
      child = options.child;
    }
    parent.childWithBlockingView = child;
    parent.childWithBlockingViewPrototype = ChildWithBlockingView;
    _.extend(parent, ChildWithBlockingView);
  };

  return BlockingView;
});
