/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      if (this.options.prependChild) {
        this.el.insertBefore(view.el, this.el.childNodes[0]);
      } else {
        this.el.appendChild(view.el);
      }
    },

    empty: function (options) {
      var view = this.currentView;
      if (view) {
        view.off('destroy', this.empty, this);
        this.triggerMethod('before:empty', view);
        if (!(options && options.preventDestroy)) {
          this._destroyView();
        }
        this.triggerMethod('empty', view);
        delete this.currentView;
      }
      return this;
    },

    _destroyView: function () {
      var view = this.currentView;
      if (view.isDestroyed === true || view._isDestroyed) {
        return;
      }

      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'before:destroy', view);
      }
      if (view.destroy) {
        view.destroy();
      } else {
        view.remove();
        if (typeof view.isDestroyed === 'function') {
          view._isDestroyed = true;
        } else {
          view.isDestroyed = true;
        }
      }
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'destroy', view);
      }
    }

  });

  return NonEmptyingRegion;

});
