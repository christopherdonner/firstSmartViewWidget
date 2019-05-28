/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!csui/controls/tile/behaviors/impl/expanding.behavior'
], function (require, _, Backbone, Marionette, template) {
  "use strict";

  var ExpandingBehavior = Marionette.Behavior.extend({

    defaults: {
      expandButton: '.tile-footer'
    },

    triggers: {
      'click .cs-more': 'expand',
      'click .tile-header': 'expand'
    },

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderExpandButton);
      this.listenTo(view, 'expand', this._expand);
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    _renderExpandButton: function () {
      var expandButtonSelector = getOption.call(this, 'expandButton'),
          expandButton         = this.view.$(expandButtonSelector),
          iconTitle = getOption.call(this, 'expandIconTitle'),
          expandIconTitle = iconTitle ? iconTitle : 'Expand',
          iconAria = getOption.call(this, 'expandIconAria'),
          expandIconAria = iconAria ? iconAria : expandIconTitle,
          data                 = { expandIconTitle: expandIconTitle,
                                   expandIconAria: expandIconAria};
      expandButton.html(template(data));
    },

    _expand: function () {
      if (this.expanded) {
        return;
      }
      this.expanded = true;
      var expandedViewValue = this.getOption('expandedView'),
          expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                              expandedViewValue : expandedViewValue.call(this.view),
          requiredModules   = ['csui/controls/dialog/dialog.view'],
          self              = this;
      if (_.isString(expandedViewClass)) {
        requiredModules.push(expandedViewClass);
      }
      require(requiredModules, function (DialogView) {
        if (_.isString(expandedViewClass)) {
          expandedViewClass = arguments[1];
        }
        var expandedViewOptions = getOption.call(self, 'expandedViewOptions'),
            expandedView        = new expandedViewClass(expandedViewOptions);
        self._dialog = new DialogView({
          iconLeft: getOption.call(self, 'titleBarIcon'),
          imageLeftUrl: getOption.call(self, 'titleBarImageUrl'),
          imageLeftClass: getOption.call(self, 'titleBarImageClass'),
          title: getOption.call(self, 'dialogTitle'),
          iconRight: getOption.call(self, 'dialogTitleIconRight'),
          className: 'cs-expanded ' + (getOption.call(self, 'dialogClassName') || ''),
          largeSize: true,
          view: expandedView
        });
        self.listenTo(self._dialog, 'hide', function () {
          self.triggerMethod('collapse');
        }).listenTo(self._dialog, 'destroy', self._enableExpandingAgain);
        self._dialog.show();
      });
    },

    _enableExpandingAgain: function () {
      this.expanded = false;
    },

    _destroyExpandedView: function () {
      if (this._dialog) {
        this._dialog.destroy();
        this._dialog = undefined;
      }
    }

  });
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ExpandingBehavior;

});
