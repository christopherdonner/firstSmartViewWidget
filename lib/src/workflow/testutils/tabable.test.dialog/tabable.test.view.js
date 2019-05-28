/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!workflow/testutils/tabable.test.dialog/tabable.test',
  'css!workflow/testutils/tabable.test.dialog/tabable.test'
], function (_, $, Backbone, Marionette, TabablesBehavior, LayoutViewEventsPropagationMixin, template) {
  'use strict';

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      this.el.appendChild(view.el);
    }
  });

  var TabableTestView = Marionette.LayoutView.extend({

    template: template,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    regions: {
      view: '.tabable-test.view'
    },

    constructor: function TabableTestView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    show: function () {
      var region = new NonEmptyingRegion({el: document.body});
      region.show(this);
      return this;
    },

    destroy: function () {
      TabableTestView.__super__.destroy.apply(this, arguments);
      return this;
    },

    kill: function () {
      TabableTestView.__super__.destroy.apply(this, arguments);
      return true;
    },

    onRender: function () {
      if (this.options.view) {
        this.view.show(this.options.view);
      }
    }
  });

  _.extend(TabableTestView.prototype, LayoutViewEventsPropagationMixin);
  return TabableTestView;
});


