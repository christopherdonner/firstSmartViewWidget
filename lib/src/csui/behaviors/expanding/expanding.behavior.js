/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette'
], function (require, _, Backbone, Marionette) {

  var ExpandingBehavior = Marionette.Behavior.extend({

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    onExpand: function () {
      if (this.expanded) {
        return;
      }
      this.expanded = true;

      var self = this;
      var collection = this.view.completeCollection ?
                       this.view.completeCollection.clone() :
                       this.view.collection.clone();
      if (this.view.currentFilter !== undefined) {
        collection.setFilter(this.view.currentFilter, {fetch: false});
      }
      this.view.isSearchOpen() && this.view.searchClicked();

      var expandedViewValue = self.getOption('expandedView');
      var expandedViewClass = expandedViewValue;
      if (_.isString(expandedViewValue) !== true) {
        expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                            expandedViewValue :
                            expandedViewValue.call(self.view);
      }
      var requiredModules = ['csui/controls/dialog/dialog.view'];
      if (_.isString(expandedViewClass)) {
        requiredModules.push(expandedViewClass);
      }
      require(requiredModules, function (DialogView) {
        if (_.isString(expandedViewClass)) {
          expandedViewClass = arguments[1];
        }
        var expandedViewOptions = getOption(self.options, 'expandedViewOptions', self.view);
        self.expandedView = new expandedViewClass(_.extend({
          context: self.view.options.context,
          collection: collection,
          orderBy: getOption(self.options, 'orderBy', self.view),
          filterBy: self.view.currentFilter,
          limited: false,
          isExpandedView: true
        }, expandedViewOptions));
        self.dialog = new DialogView({
          iconLeft: getOption(self.options, 'titleBarIcon', self.view) ||
                    getOption(self.view.options, 'titleBarIcon', self.view),
          actionIconLeft: getOption(self.options, 'actionTitleBarIcon', self.view) ||
                             getOption(self.view.options, 'actionTitleBarIcon', self.view),
          imageLeftUrl: getOption(self.options, 'titleBarImageUrl', self.view),
          imageLeftClass: getOption(self.options, 'titleBarImageClass', self.view),
          title: getOption(self.options, 'dialogTitle', self.view),
          iconRight: getOption(self.options, 'dialogTitleIconRight', self.view),
          className: getClassName(self.options, 'dialogClassName', self.view),
          largeSize: true,
          view: self.expandedView,
          headerView: getOption(self.options, 'headerView', self.view)
        });
        self.listenTo(self.dialog, 'before:hide', self._expandOtherView)
            .listenTo(self.dialog, 'destroy', self._enableExpandingAgain);
        self._expandOtherView(false);
        self.dialog.show();
      }, function (error) {
        self.expanded = false;
      });
    },

    _destroyExpandedView: function (immediately) {
      if (this.dialog) {
        var method = immediately ? 'kill' : 'destroy';
        this.dialog[method]();
        this.dialog = undefined;
      }
    },

    _expandOtherView: function (expand) {
      this.options.collapsedView && this.options.collapsedView.triggerMethod(
          expand === false ? 'go:away' : 'go:back');
    },

    _enableExpandingAgain: function () {
      this.expanded = false;
      if (this.view.tabableRegionBehavior) {
        var navigationBehavior = this.view.tabableRegionBehavior,
            targetElement      = this.view.ui.tileExpand;
        navigationBehavior.currentlyFocusedElement &&
        navigationBehavior.currentlyFocusedElement.prop('tabindex', -1);
        targetElement && targetElement.prop('tabindex', 0);
        targetElement.focus();
        navigationBehavior.setInitialTabIndex();
        this.view.currentTabPosition = 2;
      }
    }

  });
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  function getClassName(options, property, context) {
    var className = getOption(options, property, context);
    if (className) {
      className += ' csui-expanded';
    } else {
      className = 'csui-expanded';
    }
    return className;
  }

  return ExpandingBehavior;

});
