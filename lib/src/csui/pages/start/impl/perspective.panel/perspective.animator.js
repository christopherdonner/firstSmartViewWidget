/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery'],
  function ( module, _, $) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    ltrAnimation: false
  });

  function PerspectiveAnimator(perspectivePanelView) {
    this.perspectivePanelView = perspectivePanelView;
  }

  PerspectiveAnimator.prototype = {

    startAnimation: function (perspectiveView) {
      var perspectivePanel = this.perspectivePanelView;

      perspectivePanel.$el
        .redraw()
        .addClass('csui-in-transition');

      perspectiveView.$el.addClass('cs-on-stage-right');
      perspectiveView.triggerMethod('before:show');
      this.perspectivePanelView.$el.append(perspectiveView.el);
      perspectiveView.triggerMethod('show');
    },


    swapPerspective: function (currentPerspectiveView, upcomingPerspectiveView) {
      var deferred = $.Deferred();

      currentPerspectiveView.$el.addClass('cs-on-stage-left');
      upcomingPerspectiveView.$el
        .one(this._transitionEnd(), deferred.resolve)
        .redraw()
        .removeClass('cs-on-stage-right');
      return deferred.promise();
    },

    showPerspective: function (perspectiveView) {
      var deferred = $.Deferred();

      perspectiveView.$el
        .one(this._transitionEnd(), deferred.resolve)
        .redraw()
        .removeClass('cs-on-stage-right');
      return deferred.promise();
    },

    finishAnimation: function () {
      this.perspectivePanelView.$el.removeClass('csui-in-transition');
    },

    _transitionEnd: _.once(
      function () {
        var transitions = {
              transition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend'
            },
            element = document.createElement('div'),
            transition;
        for (transition in transitions) {
          if (typeof element.style[transition] !== 'undefined') {
            return transitions[transition];
          }
        }
      }
    )
  };

  return PerspectiveAnimator;
});

