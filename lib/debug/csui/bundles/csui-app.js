csui.define('csui/behaviors/dropdown.menu/dropdown.menu.behavior',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base'
], function ($, _, Marionette, base) {
  'use strict';

  var DropdownMenuBehavior = Marionette.Behavior.extend({

    ui: {
      dropdownMenu: '.binf-dropdown',
      dropdownMenuToggle: '.binf-dropdown-toggle'
    },

    events: {
      'show.binf.dropdown': 'onShowDropdownRefilterMenuItems',
      'keydown': 'onKeyInMenuView',
      'keyup': 'onKeyUpMenuView'
    },

    constructor: function DropdownMenuBehavior(options, view) {
      options = options || {};
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this.view.dropdownMenuBehavior = this;
    },

    onShowDropdownRefilterMenuItems: function () {
      this.view.options.collection.refilter && this.view.options.collection.refilter();
    },

    onKeyUpMenuView: function (event) {
      // Firefox: a known issue that Space key may not work correctly.
      // Our Bootstrap version is old. Link below discusses the problem and suggests moving to v4:
      //  https://github.com/twbs/bootstrap/issues/20303
      // Bootstrap v4 fix: https://github.com/twbs/bootstrap/issues/21159
      // Fix link: https://github.com/twbs/bootstrap/pull/21535
      // Code diff link: https://github.com/twbs/bootstrap/pull/21535/files
      // V4 dropdown code is too different to backport the fix.
      if (base.isFirefox()) {
        // We are still using the older Bootstrap code in our Binf.
        // Suppress extra event on Space keyup for Firefox (Chrome and IE11 don't fire extra event).
        if (event.keyCode === 32) {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      // Modal dialog view is listening to 'keyup' event, close the menu but not Modal dialog
      if (event.keyCode === 27) {
        this._closeMenu(event);
      }
    },

    onKeyInMenuView: function (event) {
      // note: arrow up/down is handled by Bootstrap dropdown::keydown() with role=menu
      switch (event.keyCode) {
      case 9: // tab
        this._closeMenu();  // just close menu and don't pass in event so that focus can move on
        break;
      case 13:  // enter
      case 32:  // space
        event.preventDefault();
        event.stopPropagation();
        $(event.target).click();
        break;
      case 27:  // escape
        // menu is checked for open and will be closed in the 'keyup' event method above
        if (this.$el.hasClass('binf-open') || this.ui.dropdownMenu.hasClass('binf-open')) {
          // if menu is open, stop the event so that parent views do not get this keydown event
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      }
    },

    _closeMenu: function (event) {
      if (this.$el.hasClass('binf-open') || this.ui.dropdownMenu.hasClass('binf-open')) {
        // the event is handled here for closing the menu, prevent default and stop propagating the
        // event to parents
        event && event.preventDefault();
        event && event.stopPropagation();
        this.ui.dropdownMenuToggle.binf_dropdown('toggle');
        this.ui.dropdownMenuToggle.focus();
      }
    }

  });

  return DropdownMenuBehavior;

});

// Expands the limited view by showing the full one in a modal dialog
csui.define('csui/behaviors/expanding/expanding.behavior',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette'
], function (require, _, Backbone, Marionette) {

  var ExpandingBehavior = Marionette.Behavior.extend({

    constructor: function ExpandingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      // The perspective begins to change with an animation before the
      // previous one is destroyed; the expanded view should be hidden
      // previous one is.
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        // The hiding animation finishes before the context is fetched
        // and the page is re-rendered.  If it becomes problem, use
        // destroyImmediately here.
        this.listenTo(context, 'request', destroyWithAnimation)
            .listenTo(context, 'request:perspective', destroyWithAnimation);
      }
    },

    onExpand: function () {
      // If the expanding event is triggered multiple times, it should be
      // handled just once by showing the expanded view; it is likely, that
      // the expanding button was clicked quickly twice
      if (this.expanded) {
        return;
      }
      // Do not use the later initialized this.dialog property; loading
      // the modules with the expanded view below may take some time.
      this.expanded = true;

      var self = this;
      // TODO: remove completeCollection and limiting behavior.  Both
      // client- and server-side browsable collections should provide
      // the same interface and use the according mixins.
      var collection = this.view.completeCollection ?
                       this.view.completeCollection.clone() :
                       this.view.collection.clone();

      // pass filter from the collapsed tile to the expanded table
      if (this.view.currentFilter !== undefined) {
        collection.setFilter(this.view.currentFilter, {fetch: false});
      }
      // close and clear the filter in the collapsed tile
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
        // If the module from the csui base cannot be loaded, something is so
        // rotten, that it does not make sense trying to load other module to
        // show the error message.
        // There will be more information on the browser console.
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

  // TODO: Expose this functionality and make it generic for functiona objects too.
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

csui.define('csui/behaviors/item.error/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/behaviors/item.error/impl/nls/root/lang',{
  itemCannotBeAccessed : 'Item cannot be accessed.'
});


csui.define('csui/behaviors/item.error/item.error.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/error/error.view',
  'i18n!csui/behaviors/item.error/impl/nls/lang'
], function (_, Backbone, Marionette, ErrorView, lang) {
  'use strict';

  var ItemErrorBehavior = Marionette.Behavior.extend({

    constructor: function ItemErrorBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the model is stored in the view
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;

      var errorView = this.getOption('errorView');
      if (_.isFunction(errorView) &&
          !(errorView.prototype instanceof Backbone.View)) {
        errorView = errorView.call(view);
      }
      errorView || (errorView = ErrorView);

      // Disable the view's template and content, if fetching the model
      // failed and the error should not be placed in part of the view
      var getTemplate = view.getTemplate,
          self = this;
      view.getTemplate = function () {
        if (model.error) {
          // A string selector would point to a part of the view's content
          // rendered using the view's template
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var errorRegion;
      this.listenTo(model, 'error', function () {
            // Re-render the view, if fetching the data failed
            view.render();
          })
          .listenTo(view, 'render', function () {
            // Render an inner error control, if fetching the data failed
            var error = model.error;
            if (error) {
              if (errorRegion) {
                errorRegion.empty();
              }
              errorRegion = getBehaviorOption.call(this, 'region');
              if (!errorRegion) {
                var el = getBehaviorOption.call(this, 'el') || view.el;
                if (typeof el === 'string') {
                  el = view.$(el);
                }
                errorRegion = new Marionette.Region({el: el});
              }
              errorRegion.show(new errorView(
                _.extend({
                  model: new Backbone.Model({
                    message: lang.itemCannotBeAccessed,
                    title: error.message
                  })
                }, getBehaviorOption.call(this, 'errorViewOptions'))
              ));
            }
          })
          .listenTo(view, 'before:destroy', function () {
            // Destroy the inner error control
            if (errorRegion) {
              errorRegion.empty();
            }
          });
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemErrorBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/behaviors/item.state/impl/item.state',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\r\n";
}});
Handlebars.registerPartial('csui_behaviors_item.state_impl_item.state', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/behaviors/item.state/item.state.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/behaviors/item.state/impl/item.state'
], function (_, Marionette, template) {
  'use strict';

  var ItemStateView = Marionette.ItemView.extend({

    className: 'csui-item-state',

    template: template,

    constructor: function ItemStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change:state', this.render)
          .listenTo(this, 'render', this._updateClasses);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), {
        // empty, loading, failed
        message: this.options.stateMessages[this.model.get('state')]
      });
    },

    _updateClasses: function () {
      this.$el
          .removeClass('csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.model.get('state'));
    }

  });

  return ItemStateView;
});

csui.define('csui/behaviors/item.state/item.state.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/item.state/item.state.view'
], function (_, Backbone, Marionette, ItemStateView) {
  'use strict';

  var ItemStateBehavior = Marionette.Behavior.extend({

    constructor: function ItemStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the model is stored in the view
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;
      this.listenTo(model, 'request', this._fetchingCollectionStarted)
          .listenTo(model, 'sync', this._fetchingCollectionSucceeded)
          .listenTo(model, 'error', this._fetchingCollectionFailed);

      this.itemState = new Backbone.Model({
        state: model.fetching ? 'loading' :
               model.error ? 'failed' : 'loaded'
      });

      var stateView = this.getOption('stateView');
      if (_.isFunction(stateView) &&
          !(stateView.prototype instanceof Backbone.View)) {
        stateView = stateView.call(view);
      }
      this.stateView = stateView || ItemStateView;

      // Disable the view's template and content, if fetching the model
      // failed and the error should not be placed in part of the view
      var getTemplate = view.getTemplate,
          self = this;
      view.getTemplate = function () {
        if (!model.fetched) {
          // A string selector would point to a part of the view's content
          // rendered using the view's template
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var stateRegion;
      this.listenTo(view, 'render', function () {
            if (!model.fetched) {
              if (stateRegion) {
                stateRegion.empty();
              }
              stateRegion = getBehaviorOption.call(this, 'region');
              if (!stateRegion) {
                var el = getBehaviorOption.call(this, 'el') || view.el;
                if (typeof el === 'string') {
                  el = view.$(el);
                }
                stateRegion = new Marionette.Region({el: el});
              }
              stateRegion.show(new this.stateView(
                  _.extend({
                    model: this.itemState,
                    stateMessages: getBehaviorOption.call(this, 'stateMessages') || {}
                  }, getBehaviorOption.call(this, 'stateViewOptions'))
              ));
            }
          })
          .listenTo(view, 'before:destroy', function () {
            // Destroy the inner error control
            if (stateRegion) {
              stateRegion.empty();
            }
          });
    },

    _fetchingCollectionStarted: function () {
      this.itemState.set('state', 'loading');
      this.view.render();
      this.view.blockWithoutIndicator && this.view.blockWithoutIndicator();
    },

    _fetchingCollectionSucceeded: function (model) {
      this.itemState.set('state', 'loaded');
      this.view.unblockActions && this.view.unblockActions();
    },

    _fetchingCollectionFailed: function () {
      this.itemState.set('state', 'failed');
      this.view.unblockActions && this.view.unblockActions();
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemStateBehavior;
});

// Limits the rendered collection length with a More link to expand it
csui.define('csui/behaviors/limiting/limiting.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, Backbone, Marionette) {
  "use strict";

  var LimitingBehavior = Marionette.Behavior.extend({

    defaults: {
      limit: 6,
      filterByProperty: 'name'
    },

    collectionEvents: {'reset': 'enableMoreLink'},

    events: {
      'click .cs-more': 'onMoreLinkClick',
      'click .tile-expand': 'onMoreLinkClick',
    },

    ui: {moreLink: '.cs-more'},

    constructor: function LimitingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
    },

    // Initialize is called after the constructor of the parent view, which
    // assigns the collection and which we need here.  The collection
    // assignment cannot be delayed till the before:render is triggered.
    initialize: function (options, view) {
      if (view.options.limited !== false) {
        var completeCollection = view.collection,
            completeCollectionOptions;
        if (!completeCollection) {
          completeCollection = this.getOption('completeCollection');
          if (!(completeCollection instanceof Backbone.Collection)) {
            completeCollectionOptions = this.getOption('completeCollectionOptions');
            if (completeCollection.prototype instanceof Backbone.Collection) {
              completeCollection = new completeCollection(undefined, completeCollectionOptions);
            } else {
              completeCollection = completeCollection.call(view);
              if (!(completeCollection instanceof Backbone.Collection)) {
                completeCollection = new completeCollection(undefined, completeCollectionOptions);
              }
            }
          }
        }
        if (view.options.orderBy) {
          completeCollection.setOrder(view.options.orderBy, false);
        }

        this.listenTo(completeCollection, 'sync', _.bind(function (object) {
          if (object instanceof Backbone.Collection) {
            this.synchronizeCollections();
          }
        }, this));
        this.listenTo(completeCollection, 'reset', this.enableMoreLink);
        view.completeCollection = completeCollection;
        var ViewCollection = Backbone.Collection.extend(
            completeCollection ? {model: completeCollection.model} : {}
        );
        view.collection = new ViewCollection();
        this.listenTo(view, 'change:filterValue', this.synchronizeCollections);
      }
    },

    synchronizeCollections: function () {
      var models;
      // search has value
      if (this.view.options.filterValue && this.view.options.filterValue.length > 0) {
        var keywords = this.view.options.filterValue.toLowerCase().split(' ');
        var filterByProperty = getOption(this.options, 'filterByProperty', this.view);

        this.view.currentFilter = {};
        this.view.currentFilter[filterByProperty] = this.view.options.filterValue.toLowerCase();

        models = this.view.completeCollection.filter(function (item) {
          var name = item.get(filterByProperty),
              isMatch;
          if (name) {
            // FIXME: Apply collation rules
            name = name.trim().toLowerCase();
            isMatch = _.reduce(keywords, function (result, keyword) {
              return result && name.indexOf(keyword) >= 0;
            }, true);
          }
          return isMatch;
        });
      } else {
        // no filtering
        this.view.currentFilter = undefined;
        models = this.view.completeCollection.models;
      }
      this.view.collection.reset(models);
    },

    enableMoreLink: function () {
      var limit  = getOption(this.options, 'limit', this.view),
          enable = this.view.completeCollection &&
                   this.view.completeCollection.length > limit;
      this.ui.moreLink[enable ? 'removeClass' : 'addClass']('binf-hidden');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      // TODO this is actually required to make the expanding behaviour work!?
      this.view.triggerMethod('expand');
    }

  });

  // TODO: Expose this functionality and make it generic for functional objects too.
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return LimitingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/breadcrumbs/impl/breadcrumb/impl/breadcrumb',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{}}) : helper)))
    + "\" class=\"binf-dropdown-toggle csui-subcrumb csui-acc-focusable\"\r\n     data-binf-toggle=\"dropdown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.subcrumbTooltip || (depth0 != null ? depth0.subcrumbTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subcrumbTooltip","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n  <ul class=\"binf-dropdown-menu\" role=\"menu\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.subcrumbs : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </ul>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inactive : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    return "        <li role=\"menuitem\"><a data-id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "        <li role=\"menuitem\"><a class='csui-breadcrumb csui-acc-focusable' href=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.url : depth0), depth0))
    + "\"\r\n               data-id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.inactive : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(10, data, 0)})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "    "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "    <a class='csui-breadcrumb csui-acc-focusable' href=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{}}) : helper)))
    + "\" data-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"\r\n       title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasSubCrumbs : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_breadcrumbs_impl_breadcrumb_impl_breadcrumb', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/root/lang',{
  subcrumbTooltip: 'Show full path',
  breadcrumbAria: 'Breadcrumb'

});


csui.define('csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/breadcrumbs/impl/breadcrumb/impl/breadcrumb',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang'
], function (_, $, Marionette, nodeLinks, template, lang) {
  'use strict';

  var BreadcrumbItemView = Marionette.ItemView.extend({
    tagName: 'li',

    template: template,

    modelEvents: {
      change: 'render'
    },

    events: {
      'click a.csui-breadcrumb': 'onClickLink'
    },

    onClickLink: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var model = this.model;
      if (model.get('subcrumbs').length > 0) {
        var id = $(e.target).data('id');
        model = this._getModel(id);
      }
      this.triggerMethod('click:ancestor', model);
    },

    className: function () {
      var cname,
          // Constructor of this object has not been finished yet;
          // subcrumbs as an array have not been ensured yet
          subCrumbs = this.model.get('subcrumbs');

      if (this.options.isLastChild) {
        cname = 'binf-active';
      } else if (subCrumbs && subCrumbs.length > 0) {
        cname = 'binf-dropdown';
      } else {
        cname = 'tail';
      }

      return cname;
    },

    templateHelpers: function () {
      // If the ancestor points to a real node, which is connected
      // to a server, set href of the link to the open the container
      // perspective of the ancestor
      function getAncestorUrl(crumb) {
        return crumb.get('id') > 0 && (crumb.connector || crumb.collection.connector) &&
               nodeLinks.getUrl(crumb) || '#';
      }

      var options   = this.options,
          subCrumbs = _.map(this.model.get('subcrumbs'), function (crumb) {
            return _.extend(crumb.toJSON(), {url: getAncestorUrl(crumb)});
          });
      return {
        inactive: this.model.get('inactive') || options.isLastChild,
        hasSubCrumbs: subCrumbs.length > 0,
        subcrumbs: subCrumbs,
        name: this.model.attributes.displayName || this.model.attributes.name_formatted ||
              this.model.attributes.name,
        url: getAncestorUrl(this.model),
        subcrumbTooltip: lang.subcrumbTooltip
      };
    },

    onRender: function () {
      if (this.options.isLastChild) {
        this.$el.attr("aria-current", "page");
      }
      // TODO the inactive/informational last element is counted by the screenreader but can not be reached
    },

    constructor: function BreadcrumbItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      // Make using the view-model easier in this view
      if (!this.model.has('subcrumbs')) {
        this.model.set('subcrumbs', [], {silent: true});
      }
    },

    _getModel: function (id) {
      var subCrumbs = this.model.get('subcrumbs'),
          model     = null;

      for (var i = 0; i < subCrumbs.length; i++) {
        if (subCrumbs[i].get('id') === id) {
          model = subCrumbs[i];
          break;
        }
      }
      return model;
    }
  });

  return BreadcrumbItemView;
});

csui.define('csui/controls/breadcrumbs/breadcrumbs.view',[
 'csui/lib/underscore',
 'csui/lib/jquery',
 'csui/lib/backbone',
 'csui/lib/marionette',
 'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',
 'csui/utils/contexts/factories/next.node',
 'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (
  _,
  $,
  Backbone,
  Marionette,
  BreadCrumbItemView,
  NextNodeModelFactory,
  TabableRegionBehavior) {

  var BreadCrumbCollectionView = Marionette.CollectionView.extend({

    tagName: 'ol',

    className: 'binf-breadcrumb',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    childView: BreadCrumbItemView,

    childViewOptions: function(model, index) {
      return {
        childIndex: index,
        isLastChild: index == (model.get("showAsLink") ? this.collection.size() :
                               this.collection.size() - 1)
      };
    },

    constructor: function BreadcrumbCollectionView(options) {
      options || (options = {});
      this.completeCollection = options.collection;
      options.collection = new Backbone.Collection();

      Marionette.CollectionView.call(this, options);
    },

    initialize: function(options) {
      this.listenTo(this.completeCollection, 'sync', this.synchronizeCollections);

      var context = this.options.context;
      this._nextNode = options.node || context.getModel(NextNodeModelFactory);
      this.stop = this.options.stop || {};
      this.options.noOfItemsToShow = parseInt(this.options.noOfItemsToShow, 10);
      this._startSubCrumbs = 1;
      this._subCrumbsLength = 0;

      this.accLastBreadcrumbElementFocused = true;
      this.accNthBreadcrumbElementFocused = 0;

      this.resizeTimer = undefined;
      $(window).bind('resize', {view: this}, this._onWindowResize);
    },

    _onWindowResize: function(event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function() {
          self._adjustToFit();
        }, 200);
      }
    },

    events: {'keydown': 'onKeyInView'},

    _breadcrumbSelector: 'a.csui-acc-focusable:visible',

    isTabable: function() {
      if (this.collection.models.length > 1) {
        return true;
      }
      return false;
    },

    currentlyFocusedElement: function() {
      if (this.isTabable()) {
        if (this.accLastBreadcrumbElementFocused) {
          return this.$(this._breadcrumbSelector + ':last');
        } else {
          var breadcrumbElements = this.$(this._breadcrumbSelector);
          return $(breadcrumbElements[this.accNthBreadcrumbElementFocused]);
        }
      } else {
        return $();
      }
    },

    onKeyInView: function(event) {
      var allBreadcrumbElements;

      switch (event.keyCode) {
      case 37:
      case 38:
        // left arrow key
        // up arrow key

        allBreadcrumbElements = this.$(this._breadcrumbSelector);
        if (this.accLastBreadcrumbElementFocused) {
          if (allBreadcrumbElements.length > 1) {
            this.accLastBreadcrumbElementFocused = false;
            this.accNthBreadcrumbElementFocused = allBreadcrumbElements.length - 2;
          }
        } else {
          if (this.accNthBreadcrumbElementFocused > 0) {
            this.accNthBreadcrumbElementFocused--;
          }
        }
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().focus();

        break;
      case 39:
      case 40:
        // right arrow key
        // down arrow key

        if (!this.accLastBreadcrumbElementFocused) {
          allBreadcrumbElements = this.$(this._breadcrumbSelector);
          if (this.accNthBreadcrumbElementFocused < allBreadcrumbElements.length - 1) {
            this.accNthBreadcrumbElementFocused++;
            this.trigger('changed:focus', this);
            this.currentlyFocusedElement().focus();
          }
        }
        break;
      }
    },

    updateCompleteCollection: function(collection) {
      this.stopListening(this.completeCollection, 'sync');
      this.completeCollection = collection;
      this.listenTo(this.completeCollection, 'sync', this.synchronizeCollections);

      // This ensures compatibility with the first version, which fetched
      // the collection on its own. But only the owner knows the collection's
      // life cycle and can perform the initial fetch or otherwise populate it.
      if (this.options.fetchOnCollectionUpdate !== false) {
        // TODO: Deprecate this option and issue a warning here.
        if (this.completeCollection.isFetchable()) {
          this.completeCollection.fetch();
        } else {
          this.collection.reset([]);
        }
      }
    },

    synchronizeCollections: function() {
      var excerpt = this.completeCollection.last(this.completeCollection.size()) || [];
      this._removeAcestorsFromStopPoint(excerpt, this.stop.id);
      this._removeAcestorsToNumItemsToShow(excerpt);
      this._subCrumbsLength = 0;
      this._refreshBreadCrumbsDisplay();
      this._adjustToFit();
      this.trigger('after:synchronized');
    },

    _refreshBreadCrumbsDisplay: function() {
      var subCrumbs,
          subCrumbsMenu,
          displayArr = this.completeCollection.last(this.completeCollection.size()) || [];
      this._removeAcestorsFromStopPoint(displayArr, this.stop.id);
      this._removeAcestorsToNumItemsToShow(displayArr);
      if (this._subCrumbsLength > 0) {
        subCrumbs = _.range(this._startSubCrumbs, this._startSubCrumbs + this._subCrumbsLength).map(
          function(rangeVal) {
            return displayArr[rangeVal];
          }
        );
        subCrumbsMenu = {
          id: -1,
          name: '...',
          subcrumbs: subCrumbs
        };
        displayArr.splice(this._startSubCrumbs, this._subCrumbsLength, subCrumbsMenu);
      }
      this.collection.reset(displayArr);
    },

    refresh: function() {
      this._adjustToFit();
    },

    _adjustToFit: function() {
      var maxDisplayWidth = this._getMaxDisplayWidth();
      if (this._getDisplayWidth() > maxDisplayWidth) {
        this._shrinkToFit(maxDisplayWidth);
      }
      else if (this._getDisplayWidth() < maxDisplayWidth) {
        this._expandToFit(maxDisplayWidth);
      }
      var tabEvent = $.Event('tab:content:field:changed');
      this.trigger(tabEvent);
    },

    _shrinkToFit: function(maxDisplayWidth) {
      var shrinkableItems = this.collection.size() - this._startSubCrumbs - 1;
      if (maxDisplayWidth > 0) {
        if (shrinkableItems > 0 && this._getDisplayWidth() > maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(1);
          this._shrinkToFit(maxDisplayWidth);
        }
      }
    },

    _expandToFit: function(maxDisplayWidth) {
      var shrinkableItems = this.collection.size() - this._startSubCrumbs - 1;
      if (maxDisplayWidth > 0) {
        if (this._subCrumbsLength > 0 && this._getDisplayWidth() < maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(-1);
          this._expandToFit(maxDisplayWidth);
        }
        else if (shrinkableItems > 0 && this._getDisplayWidth() > maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(1);
        }
      }
    },

    _adjustSubCrumbsLengthBy: function(amt) {
      this._subCrumbsLength += amt;
      this._subCrumbsLength = Math.min(this._subCrumbsLength,
          this.completeCollection.size() - this._startSubCrumbs);
      this._refreshBreadCrumbsDisplay();
    },

    _getMaxDisplayWidth: function() {
      return (this.$el.outerWidth() * 0.9);
    },

    _getDisplayWidth: function() {
      return _.reduce(this.$el.find(">li"), function(width, elem) {
        return (width + $(elem).outerWidth());
      }, 0);
    },

    childEvents: {
      'click:ancestor': 'onClickAncestor'
    },

    onClickAncestor: function (model, node) {
      var args = {node: node};
      this.trigger('before:defaultAction', args);
      if (!args.cancel) {
        var nodeId = node.get('id');
        if (this._nextNode.get('id') === nodeId) {
          // when id is same as nextNode's id, nextNode.set(id) event is not triggered
          this._nextNode.unset('id', {silent: true});
        }
        this._nextNode.set('id', nodeId);
      }

      this.$el.trigger('setCurrentTabFocus');
    },

    hide: function(hideBreadcrumb) {
      if (hideBreadcrumb) {
        this.$el.hide();
      }
      else {
        this.$el.show();
      }
      return true;
    },

    hideSubCrumbs: function() {
      var $subCrumb = this.$el.find('li.binf-dropdown');
      if ($subCrumb && $subCrumb.hasClass('binf-open')) {
        this.$el.find('.csui-subcrumb').click();
      }
    },

    updateStopId: function(newId) {
      this.stop.id = newId;
    },

    _removeAcestorsFromStopPoint: function(collection, stopId) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].get('id') === stopId) {
          collection.splice(0, i);
          break;
        }
      }
    },

    _removeAcestorsToNumItemsToShow: function(collection) {
      if (this.options.noOfItemsToShow && this.options.noOfItemsToShow >= 0) {
        var limit = (this.options.noOfItemsToShow >= collection.length) ? 0 :
                    collection.length - this.options.noOfItemsToShow;
        collection.splice(0, limit);
      }
    },

    onBeforeDestroy: function() {
      $(window).unbind('resize', this._onWindowResize);
    }

  });

  return BreadCrumbCollectionView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.links',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.links', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.link',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" data-binf-toggle=\"tab\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</a>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.link', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tab.panel/impl/tab.link.view',['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tab.panel/impl/tab.link',
  'csui/lib/binf/js/binf',
  'csui/utils/handlebars/l10n' // support {{csui-l10n ...}}
], function (_, Marionette, tabLinkTemplate) {
  'use strict';

  var TabLinkView = Marionette.ItemView.extend({

    tagName: 'li',

    className: function () {
      return this._isOptionActiveTab() ? 'binf-active' : '';
    },

    attributes: function () {
      var uniqueTabId = this.model.get('uniqueTabId');
      var title = this.model.get('title');
      var attrs = {
        id: 'tablink-' + uniqueTabId,
        role: 'tab',
        'aria-controls': uniqueTabId
      };
      this._isOptionActiveTab() && _.extend(attrs, {'aria-selected': 'true'});
      return attrs;
    },

    template: tabLinkTemplate,

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab'
    },

    ui: {
      link: '>a'
    },

    constructor: function TabLinkView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    _isOptionActiveTab: function () {
      var active = false;
      var activeTabIndex = 0;
      if (this.options.activeTab && this.options.activeTab.get('tabIndex') !== undefined) {
        activeTabIndex = this.options.activeTab.get('tabIndex');
      }
      // in case of -1: set to 0; otherwise, Backbone.collection.at would return the last model.
      activeTabIndex = Math.max(0, activeTabIndex);
      this.model === this.model.collection.at(activeTabIndex) && (active = true);
      return active;
    },

    activate: function () {
      this.$el.removeClass("binf-active").removeAttr('aria-selected');
      this.ui.link.binf_tab('show');
    },

    isActive: function () {
      return this.$el.hasClass('binf-active');
    },

    onShowingTab: function (event) {
      this.triggerMethod('before:activate:tab', this);
    },

    onShownTab: function (event) {
      var index = this.model.collection.indexOf(this.model);
      this.options.activeTab && this.options.activeTab.set('tabIndex', index);
      this.triggerMethod('activate:tab', this);
    }

  });

  return TabLinkView;

});

csui.define('csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function (module, _, $, log) {
  'use strict';

  var KeyboardBehaviorMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        // start <integer> : starting index
        // optional reverseDirection <boolean>: true/false
        _findNextFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = start;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return -1;
          }

          if (tabElemId < 0 || tabElemId >= elemsLength) {
            return tabElemId;
          }

          var $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          while (this.closestTabable($currentElem) === false) {
            tabElemId = reverseDirection === true ? tabElemId - 1 : tabElemId + 1;
            if (tabElemId < 0 || tabElemId >= elemsLength) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          }
          return tabElemId;
        },

        // This function has a valid check on top of the _findNextFocusableElementIndex() call.
        // If the element is no longer valid, refresh the tabable element lists.
        _findNextValidFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = this._findNextFocusableElementIndex (start, reverseDirection);
          /* TODO: revisit this algorithm ...
          if (tabElemId >= 0 && tabElemId < this.keyboardBehavior.tabableElements.length) {
            // does the view contain target element?
            var $elem = $(this.keyboardBehavior.tabableElements[tabElemId]);
            if (this.$el.find($elem).length === 0 && this.keyboardBehavior.refreshTabableElements) {
              this.keyboardBehavior.refreshTabableElements(this);
              tabElemId = this._findNextFocusableElementIndex (start, reverseDirection);
            }
          }
          */
          return tabElemId;
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          var tabElemId;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return;
          }
          // first element
          tabElemId = 0;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
          // last element
          tabElemId = this.keyboardBehavior.tabableElements.length - 1;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId, true);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
        },

        currentlyFocusedElement: function (event) {
          return this.currentlyFocusedElementInternal(event);
        },

        currentlyFocusedElementInternal: function (event) {
          // log.debug(this.constructor.name + '::currentlyFocusedElement ') && console.log(log.last);

          this._setFirstAndLastFocusable(event);

          var tabElemId = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var reverseDirection = event && event.shiftKey;
            tabElemId = event.elementCursor || (reverseDirection ? elemsLength - 1 : 0);

            // tab is being activated, return the tab to the global tabable behavior
            if (this.options.tabPanel && this.options.tabPanel.activatingTab) {
              var curPos = this.currentTabPosition;
              if (curPos >= 0 && curPos < elemsLength) {
                tabElemId = curPos;
              }
            }

            // only focus on editable and focusable field
            tabElemId = this._findNextValidFocusableElementIndex (tabElemId, reverseDirection);
          }

          if (tabElemId >= 0 && tabElemId < elemsLength) {
            this.currentTabPosition = tabElemId;
            var $elem = $(this.keyboardBehavior.tabableElements[tabElemId]);
            // tabLink can be invisible, autoScroll until it is visible
            this._autoScrollUntilElemIsVisible && this._autoScrollUntilElemIsVisible($elem);
            return $elem;
          } else {
            return undefined;
          }
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {
          // log.debug(this.constructor.name + '::_accSetFocusToPreviousOrNextElement. previous: ' +
          //           previous) && console.log(log.last);

          var newTabbedElement = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            if (this.currentTabPosition < 0) {
              newTabbedElement = 0;
            } else {
              if (previous) {
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }
              // only focus on editable and focusable field
              newTabbedElement = this._findNextValidFocusableElementIndex (newTabbedElement,
                  previous);
            }
          }
          if (newTabbedElement >= 0 && newTabbedElement !== this.currentTabPosition) {
            this.currentTabPosition = newTabbedElement;
            return $(this.keyboardBehavior.tabableElements[newTabbedElement]);
          }
          this.currentTabPosition = -1;
          return undefined;
        },

        containTargetElement: function (event) {
          // does the view contain target element?
          var contain = this.$el.find(event.target).length > 0 ? true : false;
          // try to determine the position accurately
          if (contain) {
            var pos, elem;
            for (pos = 0; pos < this.keyboardBehavior.tabableElements.length; pos++) {
              elem = this.keyboardBehavior.tabableElements[pos];
              // fallback: match the parent container for nested alpaca form field
              if ($(elem).parents('.alpaca-control').find(event.target).length > 0) {
                this.currentTabPosition = pos;
              }
              // accurate case
              // note: FireFox removed isSameNode in some versions
              if (elem.isSameNode && elem.isSameNode(event.target)) {
                this.currentTabPosition = pos;
                break;
              } else if (elem === event.target) {
                this.currentTabPosition = pos;
                break;
              }
            }
          }
          return contain;
        },

        numberOfTabableElements: function (event) {
          return this.keyboardBehavior.tabableElements.length;
        },

        closestTabable: function ($el) {
          var tabable = true;
          var $currentElem = $el;
          // note: for efficiency, only traverse up to 10 ancestors including itself
          var i;
          for (i = 0; i < 10; i++) {
            if ($currentElem &&
                ($currentElem.attr("data-cstabindex") === "-1" || $currentElem.attr("disabled"))) {
              tabable = false;
              break;
            }
            $currentElem = $currentElem.parent();
          }
          return tabable;
        }

      });
    }
  };

  return KeyboardBehaviorMixin;

});

csui.define('csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, base, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabLinksKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // first element
            var $elem = $(this.keyboardBehavior.tabableElements[0]).prop('tabindex', '0');
            // last element: for tabLinks, the last element could be the add button, so search
            // for the last a[href] and set it focusable too
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            if ($elem.is('a')) {
              $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              $elem.prop('tabindex', '0');
              while (!$elem.is('a') && lastElemIndex > 0) {
                lastElemIndex--;
                $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              }
              $elem.prop('tabindex', '0');
            }
          }
        },

        // Automatically scroll until the tabLink $elem is visible.
        // Note: this function stores a Deferred in $elem.csuiPromise that can be used
        // for ansynchronous check to unset 'skipAutoScroll' and run subsequent code.
        _autoScrollUntilElemIsVisible: function ($elem) {
          var $tabLink = $elem;
          // if $elem is the tablink delete icon, get the sibbling tablink element for scrolling
          if ($tabLink && $tabLink.hasClass('cs-delete-icon')) {
            $tabLink = $elem.parent().parent().find('.cs-tablink');
          }

          if ($tabLink && $tabLink.is('a') && $tabLink.hasClass('cs-tablink')) {
            var tabPanel = this.options && this.options.tabPanel;
            var tabID = $tabLink.attr('href');
            tabID[0] === '#' && (tabID = tabID.substr(1));
            if (tabPanel && tabPanel._isTablinkVisibleInParents($tabLink) === false) {
              var tabIndex = tabPanel._findTabIndexByID ? tabPanel._findTabIndexByID(tabID) : -1;
              if (tabIndex >= 0) {
                var deferred = $.Deferred();
                tabPanel.skipAutoScroll = true;  // unset this after the deferred is done
                $tabLink.csuiPromise = deferred.promise();
                var options = {animationOff: true};
                tabPanel._autoScrollTabTo && tabPanel._autoScrollTabTo(tabIndex, options)
                    .done(function () {
                      tabPanel.skipAutoScroll = false;
                      deferred.resolve();
                    });
              }
            }
          }
        },

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }

          this.keyboardBehavior.keyboardActionDeleteTabPosition = undefined;
          var self = this;
          var _focusOnTabContent = function (e) {
            var hrefElem = self.keyboardBehavior.tabableElements[self.currentTabPosition];
            var $hrefElem = hrefElem && $(hrefElem);
            if ($hrefElem && $hrefElem.is(":focus")) {
              e.preventDefault();
              e.stopPropagation();
              var tabPanel = self.options && self.options.tabPanel;
              tabPanel && (tabPanel.skipAutoScroll = true);
              if ($hrefElem.hasClass('cs-delete-icon')) {
                // when focus is on the delete icon: move back two positions
                self.keyboardBehavior.keyboardActionDeleteTabPosition = self.currentTabPosition - 2;
              }
              // trigger the click event
              $hrefElem.click();
              // focus is on tablink (not delete icon): move to the first focusable field
              if (self.keyboardBehavior.keyboardActionDeleteTabPosition === undefined) {
                setTimeout(function () {
                  // let tabContents know to focus on 1st editable field of activating tabContent
                  var href = $hrefElem.attr('href');
                  var focusEvent = $.Event('tab:content:focus', {tabId: href});
                  self.$el.trigger(focusEvent);
                  tabPanel && (tabPanel.skipAutoScroll = false);
                }, 100);
              }
            }
          };

          if (event.keyCode === 9) {  // tab
            // log.debug('TabLinksKeyboardBehavior::onKeyInView ' + view.constructor.name) &&
            // console.log(log.last);

            var leftScroll = event.shiftKey;
            var $elem = this._accSetFocusToPreviousOrNextElement(leftScroll);

            // if the scroll-to element is a tab, auto-scroll for it to be visible
            this._autoScrollUntilElemIsVisible($elem);

            ret = $elem;
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space key(32) or enter key(13)
            _focusOnTabContent.call(this, event);
          } else if (event.keyCode === 46) {
            // delete key
            var hrefElem = this.keyboardBehavior.tabableElements[this.currentTabPosition];
            if (hrefElem && $(hrefElem).is(":focus")) {
              event.preventDefault();
              event.stopPropagation();
              // when focus is on the tablink: move back one position
              this.keyboardBehavior.keyboardActionDeleteTabPosition = this.currentTabPosition - 1;

              // let tabLinks know to delete the tab
              var href = $(hrefElem).attr('href');
              var deleteEvent = $.Event('tab:link:delete', {tabId: href});
              this.$el.trigger(deleteEvent);
            }
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      // tab can be hidden, so don't filter by ':visible'
      this.tabableElements = view.$el.find('a[href], *[tabindex], *[data-cstabindex]');
      // remove elements with data-cstabindex=-1
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if ($(this.tabableElements[i]).attr('data-cstabindex') === '-1') {
          this.tabableElements.splice(i, 1);
        }
      }

      this.view.currentTabPosition = -1;
      // if delete a tab by keyboard, put focus on the previous tab afterwards
      if (this.keyboardActionDeleteTabPosition !== undefined) {
        var $elem = $(this.tabableElements[this.keyboardActionDeleteTabPosition]);
        if ($elem && $elem.length > 0) {
          this.view.currentTabPosition = this.keyboardActionDeleteTabPosition;
          // if the scroll-to element is a tab, auto-scroll for it to be visible
          this.view._autoScrollUntilElemIsVisible($elem);
          $elem.focus();
        }
        this.keyboardActionDeleteTabPosition = undefined;
      }

      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabLinksKeyboardBehavior::refreshTabableElements ' + view.constructor.name +
      //           ': found ' + this.tabableElements.length + ' tabable elements') &&
      // console.log(log.last);
    }

  });

  return TabLinksKeyboardBehavior;

});

// Renders s tab panel made of links and content
csui.define('csui/controls/tab.panel/impl/tab.links.view',['csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base',
  'hbs!csui/controls/tab.panel/impl/tab.links',
  'csui/controls/tab.panel/impl/tab.link.view',
  'csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, Marionette, base, tabLinksTemplate, TabLinkView,
    TabLinksKeyboardBehavior) {
  'use strict';

  var TabLinkCollectionView = Marionette.CompositeView.extend({

    className: function () {
      var ret = 'tab-links';
      if (this.options.mode === 'spy') {
        ret += ' scrollspy';
      }
      return ret;
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.tabType
      };
    },

    childView: TabLinkView,
    childViewContainer: function () {
      return '>.' + this.tabType;
    },

    behaviors: {
      TabLinksKeyboardBehavior: {
        behaviorClass: TabLinksKeyboardBehavior
      }
    },

    constructor: function TabLinkCollectionView(options) {
      this.tabType = options.tabType || 'binf-nav-tabs';
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.activeTab, 'change:tabIndex', this._updateActiveTab);
    },

    onChildviewActivateTab: function (childView) {
      // clear the aria-selected on the previous tabLink and set it on the activated tabLink
      this.children.each(function (view) {
        if (view.el.hasAttribute('aria-selected') !== undefined) {
          view.$el.removeAttr('aria-selected');
        }
      });
      childView.$el.attr('aria-selected', 'true');
    },

    _updateActiveTab: function () {
      var tabIndex = this.options.activeTab.get('tabIndex'),
          linkView = this.children.findByIndex(tabIndex);
      if (linkView) {
        if (tabIndex === linkView._index) {
          if (!linkView.isActive()) {
            linkView.activate();
          }
        }
      } else {
        // Set the currently active tab index to the activeTab model
        // to overwrite the wrong value which sombody set there
        tabIndex = 0;
        this.children.find(function (linkView, index) {
          if (linkView.isActive()) {
            tabIndex = index;
            return true;
          }
        });
        this.options.activeTab.set('tabIndex', tabIndex);
      }
    },

    // Options: {
    //  - levels <integer> : search up to number of levels.  Default: 3.
    //  - percentX <integer> : X visibility percentage.  Default: 100%.
    //  - percentY <integer> : Y visibility percentage.  Default: 100%.
    // }
    _isTablinkVisibleInParents: function ($el, options) {
      var levels = options && options.levels || 3;
      var percentX = options && options.percentX || 100;
      var percentY = options && options.percentY || 100;
      return base.isElementVisibleInParents($el, levels, percentX, percentY);
    },

    // base class method: leave empty!
    deleteTabById: function (tabId) {
      // don't add anything here. The method is meant to be overriden.
      return;
    }

  });

  return TabLinkCollectionView;

});

csui.define('csui/controls/tab.panel/impl/tab.content.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, log, ViewEventsPropagationMixin) {
  'use strict';

  var TabContentView = Marionette.View.extend({

    constructor: function TabContentView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.contentRegion = new Marionette.Region({el: this.el});
      // Tab content creation cannot be delayed if scrollspy is used or if this
      // is tab is active immediately and thus does not get the activation event
      if (!this.options.delayTabContent || this.options.mode === 'spy' ||
          this._isActive()) {
        this._createContent(options);
      } else {
        this.listenTo(this.options.tabPanel, 'before:activate:tab', this._ensureContent);
      }
    },

    className: function () {
      var classes = '';
      if (!this.options.mode) {
        classes = 'binf-tab-pane binf-fade';
        if (this._isActive()) {
          classes += ' binf-in binf-active';
        }
      }
      return classes;
    },

    attributes: function () {
      var uTabId = this.model.get('uniqueTabId');
      if (!uTabId) {
        log.warn('Missing unique tab ID in the TabPanel UI component. Please report.')
        && console.warn(log.last);
      }
      return {
        role: 'tabpanel',
        id: uTabId,
        'aria-labelledby': 'tablink-' + uTabId
      };
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderContent();
      this.triggerMethod('render', this);
      return this;
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _isActive: function () {
      var activeTabIndex = Math.max(0, this.options.activeTab.get('tabIndex'));
      return this.model === this.model.collection.at(activeTabIndex);
    },

    _ensureContent: function (tabContent, tabPane, tabLink) {
      if (tabPane === this) {
        if (!this.content) {
          this._createContent(this.options);
          if (this._isRendered) {
            this.render();
          }
        }
      }
    },

    _createContent: function (options) {
      var ContentView        = this._getContentView(),
          contentViewOptions = this._getContentViewOptions(),
          fullOptions        = _.extend({
                model: this.model,
                containerCollection: options.containerCollection,
                index: options.index
              },
              contentViewOptions);
      this.content = new ContentView(fullOptions);
      this.propagateEventsToViews(this.content);
    },

    _getContentView: function () {
      var contentView = this.model.get("contentView") ||
                        this.options.tabPanel.getOption('contentView');
      if (contentView && !(contentView.prototype instanceof Backbone.View)) {
        contentView = contentView.call(this.options.tabPanel, this.model);
      }
      if (!contentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      return contentView;
    },

    _getContentViewOptions: function () {
      var contentViewOptions = this.options.tabPanel.getOption('contentViewOptions');
      if (_.isFunction(contentViewOptions)) {
        contentViewOptions = contentViewOptions.call(this.options.tabPanel,
            this.model);
      }
      return contentViewOptions;
    },

    _renderContent: function () {
      if (this.content) {
        this.contentRegion.show(this.content);
      }
    },

    _destroyContent: function () {
      if (this.content) {
        this.cancelEventsToViewsPropagation(this.content);
        this.contentRegion.reset();
        this.content = undefined;
      }
    }

  });

  _.extend(TabContentView.prototype, ViewEventsPropagationMixin);

  return TabContentView;

});

csui.define('csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabContentKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        this.alreadyRefreshedTabableElements = false;
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'render', function () {
        // must listen to async render of forms in children, to get all tabable elements
        view.children && view.children.each(function (child) {
          child.content && self.listenTo(child.content, 'render', function () {
            this.alreadyRefreshedTabableElements = false;
            self.refreshTabableElements(view);
          });
        });
        // jQuery event (removed in destroy)
        view.$el.bind('tab:content:field:changed', function () {
          this.alreadyRefreshedTabableElements = false;
          if (this.keyboardAction) {
            // triggered by keyboard
            self.refreshTabableElementsAndSetFocus(view);
          } else {
            // triggered by mouse
            self.refreshTabableElements(view);
          }
          this.keyboardAction = false;
        });
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.alreadyRefreshedTabableElements !== true) {
            this.keyboardBehavior.refreshTabableElements(this);
          }
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }
          var elem, elemsLength, focusPos;
          elemsLength = this.keyboardBehavior.tabableElements.length;
          focusPos = 0;
          if (event.keyCode === 9) {  // tab

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            if (focusPos >= 0 && focusPos < elemsLength) {
              this.currentTabPosition = focusPos;
            }

            // event.shiftKey: shift tab -> activate previous region
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space key(32) or enter key(13)
            var $elem = $(this.keyboardBehavior.tabableElements[this.currentTabPosition]);
            if ($elem && $elem.is(':focus') && $elem.hasClass('binf-hidden') === false &&
                $elem.closest('.cs-field-write').length === 0) {
              event.preventDefault();
              event.stopPropagation();
              this.keyboardBehavior.keyboardAction = true;  // triggered by keyboard, not mouse
              // trigger the click event
              $elem.click();
            }

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            var foundFocusable = focusPos >= 0 && focusPos < elemsLength;
            if (foundFocusable) {
              this.currentTabPosition = focusPos;
            }

            $elem = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
            if ($elem !== undefined) {
              $elem.prop("tabindex", "0");
            }

            if (!!event.activeTabContent && !!event.activeTabContent.alpaca &&
                event.activeTabContent.alpaca.data.type === 140 && foundFocusable) {
              var urlelem = this.keyboardBehavior.tabableElements[focusPos];
              urlelem.click();

            }

          }
          return ret;
        }

      });
    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.unbind('tab:content:field:changed');
    },

    refreshTabableElements: function (view) {
      this.tabableElements = view.options.searchTabContentForTabableElements ?
                             view.$el.find(view.options.tabContentAccSelectors).filter(':visible') :
          [];

      // remove elements with data-cstabindex=-1
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if (view.closestTabable && view.closestTabable($(this.tabableElements[i])) === false) {
          this.tabableElements.splice(i, 1);
        }
      }
      this.view.currentTabPosition = -1;
      this.alreadyRefreshedTabableElements = true;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabContentKeyboardBehavior::refreshTabableElements ' + view.constructor.name +
      //           ': found ' + this.tabableElements.length + ' tabable elements') &&
      // console.log(log.last);
    },

    refreshTabableElementsAndSetFocus: function (view) {
      // after the content is changed, refresh the elements and try best to keep the same focus
      var currentTabPos = this.view.currentTabPosition;
      this.refreshTabableElements(view);
      $(this.tabableElements[currentTabPos]).prop("tabindex", "0");
      $(this.tabableElements[currentTabPos]).focus();
      this.view.currentTabPosition = currentTabPos;
    },

    updateCurrentTabPosition: function () {
      var i;
      for (i = 0; i < this.tabableElements.length; i++) {
        if ($(this.tabableElements[i]).is(':focus')) {
          this.view.currentTabPosition = i;
          break;
        }
      }
    }

  });

  return TabContentKeyboardBehavior;

});

csui.define('csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  // This behavior is a proxy to delegate tab contents keyboard navigation to the child view.

  var TabContentProxyKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentProxyKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      _.extend(view, {

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView._setFirstAndLastFocusable) {
            event.activeTabContent.childTabPanelView._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.currentlyFocusedElement) {
            return event.activeTabContent.childTabPanelView.currentlyFocusedElement(event);
          }
          return undefined;
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {
          if (this.tabPanel && this.tabPanel.activeTabContent &&
              this.tabPanel.activeTabContent.childTabPanelView &&
              this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement) {
            return this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement(
                previous);
          }
          return undefined;
        },

        containTargetElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.containTargetElement) {
            return event.activeTabContent.childTabPanelView.containTargetElement(event);
          }
          return false;
        },

        onKeyInView: function (event) {
          // let the child view handle the keypress
          if (event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.onKeyInView) {
            return event.activeTabContent.childTabPanelView.onKeyInView(event);
          }
          return undefined;
        },

        numberOfTabableElements: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.numberOfTabableElements) {
            return event.activeTabContent.childTabPanelView.numberOfTabableElements(event);
          }
          return 0;
        }

      });
    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      // log.debug('TabContentProxyKeyboardBehavior::refreshTabableElements ' + view.constructor.name)
      // && console.log(log.last);

      view.tabPanel = tabPanel;
      if (tabPanel && tabPanel.activeTabContent && tabPanel.activeTabContent.childTabPanelView) {
        var childTabPanel = tabPanel.activeTabContent.childTabPanelView;
        childTabPanel.refreshTabableElements && childTabPanel.refreshTabableElements(childTabPanel);
        var e = {activeTabLink: tabPanel.activeTabLink, activeTabContent: tabPanel.activeTabContent};
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }
    }

  });

  return TabContentProxyKeyboardBehavior;

});

csui.define('csui/controls/tab.panel/impl/tab.contents.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tab.panel/impl/tab.content.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, TabContentView, ViewEventsPropagationMixin,
    TabContentKeyboardBehavior, TabContentProxyKeyboardBehavior) {
  "use strict";

  var TabContentCollectionView = Marionette.CollectionView.extend({

    className: 'binf-tab-content',

    childView: TabContentView,
    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },

    // add behaviors here
    behaviors: {},

    defaults: {
      implementTabContentsDefaultKeyboardHandling: true,
      tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                              ' select:not([disabled]), textarea:not([disabled]),' +
                              ' button:not([disabled]), iframe, object, embed,' +
                              ' *[tabindex], *[data-cstabindex], *[contenteditable]'
    },

    constructor: function TabContentCollectionView(options) {
      _.defaults(options, this.defaults);
      if (options.implementTabContentsDefaultKeyboardHandling) {
        this.behaviors = _.extend({
          TabContentKeyboardBehavior: {
            behaviorClass: TabContentKeyboardBehavior
          }
        }, this.behaviors);
      } else if (options.implementTabContentsDefaultKeyboardHandling === false) {
        // in order to use proxy behavior, childTabPanelView must be defined and have keyboard behavior
        this.behaviors = _.extend({
          TabContentProxyKeyboardBehavior: {
            behaviorClass: TabContentProxyKeyboardBehavior
          }
        }, this.behaviors);
      }

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

      // Only react to child add/remove event after the view is rendered and before destroyed.
      // Otherwise, don't waste time and performance to set the last tab event on every add/remove
      // before the view is fully rendered or when the view is being destroyed.
      this.reactToChildEvent = false;

      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    },

    onBeforeDestroy: function () {
      // Note: during debug find that child views are destroyed before this method is called.
      // Just leave it here for now so other developer can be aware that this is not needed
      // and don't waste time to add it.
      this.reactToChildEvent = false;
    },

    onRender: function () {
      this.reactToChildEvent = true;
      this._setLastTabCssClass();
      if (this.options.mode === 'spy') {
        var targetSelector = '.tab-links.scrollspy';
        // make the ScrollSpy's target selector unique to the particular TabPanel so that ScrollSpy
        // code does not cause scrolling in other TabPanel
        if (this.options && this.options.tabPanel && this.options.tabPanel.$el) {
          var id = this.options.tabPanel.$el.attr('id');
          if (id !== undefined) {
            targetSelector = '#' + id + ' ' + targetSelector;
          }
        }
        this.$el.binf_scrollspy({target: targetSelector});
      }
    },

    onReorder: function () {
      this._setLastTabCssClass();
    },

    onAddChild: function (childView) {
      this._setLastTabCssClass();
    },

    onRemoveChild: function (childView) {
      this._setLastTabCssClass();
    },

    _setLastTabCssClass: function () {
      if (this.reactToChildEvent !== true) {
        return;
      }

      var cssClass = 'last-tab-panel';

      // find and remove the last tab css class
      this.children.each(function (view) {
        if (view.$el.hasClass(cssClass)) {
          view.$el.removeClass(cssClass);
        }
      });

      // add the last tab css class to the last *visible* tab, first tab is not needed
      if (this.children.length > 1) {
        // Use collection to find the last model because the collection is sorted by title (not
        // views collection).
        var lastChildView = this.getLastVisibleChild(this.collection.length - 1);
        lastChildView && lastChildView.$el.addClass(cssClass);
      }
    },

    // recursively find-out the last visible tab content element.
    getLastVisibleChild: function (index) {
      var lastModel = this.collection.at(index);
      if (lastModel) {
        var lastChildView = this.children.findByModel(lastModel);
        if (lastChildView && !lastChildView.$el.hasClass('binf-hidden')) {
          return lastChildView;
        } else {
          return this.getLastVisibleChild(index - 1);
        }
      }
      return;
    },

    getTabContentFirstFocusableELement: function (tabId) {
      var ret;
      if (tabId === undefined || this.options.searchTabContentForTabableElements !== true) {
        return ret;
      }

      // focus on 1st editable field of activating tabContent
      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabPane = this.children.findByModel(model);
        var tabContent = tabPane.content;
        var tabElemId = 0;
        var elems = tabContent.$el.find(this.options.tabContentAccSelectors).filter(':visible');
        if (elems.length > 0) {
          var $currentElem = $(elems[tabElemId]);
          while (this.closestTabable && this.closestTabable($currentElem) === false) {
            tabElemId++;
            if (tabElemId >= elems.length) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(elems[tabElemId]);
          }
          if (tabElemId >= 0 && tabElemId < elems.length) {
            ret = $currentElem;
          }
        }
      }
      return ret;
    }

  });

  _.extend(TabContentCollectionView.prototype, ViewEventsPropagationMixin);

  return TabContentCollectionView;

});

csui.define('csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', "csui/utils/base",
  'csui/lib/marionette'
], function (module, _, $, log, base, Marionette) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabPanelKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabPanelKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      view.currentTabPosition = options.currentTabPosition || 0;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'render', function () {
        self.refreshTabableElements(view);

        // if tab content is rendered later such as with Alpaca form rendering,
        // then watch for this custom event and refresh tabable elements again
        // jQuery event (removed in destroy)
        view.$el.bind('tab:content:render', function () {
          self.refreshTabableElements(view);
        });
      });
      this.listenTo(view, 'activate:tab', function (tabContent, tabPane, tabLink) {
        var tabLinkHref = tabLink && tabLink.$el.find('>a')[0];
        if (tabLinkHref) {
          var event = {target: tabLinkHref};
          var tabLinks = this.tabableElements[this.tabLinksIndex];
          if (tabLinks && tabLinks.containTargetElement && tabLinks.containTargetElement(event)) {
            var tabContents = this.tabableElements[this.tabContentIndex];
            if (tabContents && tabContents.options.searchTabContentForTabableElements !== true) {
              var $elem = $(tabLinks.keyboardBehavior.tabableElements[tabLinks.currentTabPosition]);
              // overcome dom:refresh that triggers the global tabable behavior sets focus elsewhere
              setTimeout(_.bind(function () {
                this.view._focusOnElement($elem);
              }, this), 500);
            }
          }
        }
      });

      _.extend(view, {

        // When TabPanelView is not used for form rendering, there is no content rendered event.
        // Thus, check and refresh tabable elements if needed in case the view render event was
        // called before animation is done or the view is still loading, not fully visible.
        _checkAndRefreshTabableElements: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // only need to check the tabLinks, tabContents can be empty
            var tabLinks = this.keyboardBehavior.tabableElements[this.keyboardBehavior.tabLinksIndex];
            if (tabLinks.numberOfTabableElements && tabLinks.numberOfTabableElements(event) === 0) {
              tabLinks.keyboardBehavior.refreshTabableElements(tabLinks);
            }
          }
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            // first element
            var elem = this.keyboardBehavior.tabableElements[0];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
            // last element
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            elem = this.keyboardBehavior.tabableElements[lastElemIndex];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {
          // log.debug('TabPanelKeyboardBehavior::currentlyFocusedElement ' +
          //           this.constructor.name) && console.log(log.last);

          var e = _.extend(
              {activeTabLink: this.activeTabLink, activeTabContent: this.activeTabContent},
              event);

          this._checkAndRefreshTabableElements(e);
          this._setFirstAndLastFocusable(e);

          var $focusElem;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var curPos = this.currentTabPosition;
            if (curPos < 0 || curPos > elemsLength - 1) {
              curPos = this.currentTabPosition = e.shiftKey ? elemsLength - 1 : 0;
            }
            // on ShiftTab: use last element
            e.shiftKey && (curPos = this.currentTabPosition = elemsLength - 1);
            var elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.currentlyFocusedElement) {
              $focusElem = elem.currentlyFocusedElement(e);
              if ($focusElem !== undefined) {
                $focusElem.prop("tabindex", "0");
                // The form field at the bottom may not be visitble, and the global TabablesBehavior
                // has a check base.isVisibleInWindowViewport(elToFocus) on line 198 that
                // ignores the region.
                // So as a workaround as usual to the limitation of the weak code elsewhere without
                // touching it, handle it here.  Set the focus on the form field element so that it
                // would scroll into the view and become visible.
                if (this.currentTabPosition === this.tabContentIndex) {
                  self.skipAutoScroll = true;
                  this._focusOnElement($focusElem);
                  self.skipAutoScroll = false;
                }
              }
            }
          }
          return $focusElem;
        },

        accActivateTabableRegion: function (shiftTab) {
          if (shiftTab) {
            this.currentTabPosition = -1;
          }
          var $focusElem = this.currentlyFocusedElement({shiftKey: shiftTab});
          this._focusOnElement($focusElem);
        },

        _focusOnElement: function ($elem) {
          if ($elem && $elem instanceof $) {
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = true);
            $elem.focus();
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = false);
          }
        },

        _moveTo: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();
          // this.trigger('changed:focus', this);
          var self = this;
          if ($elem.csuiPromise) {
            $elem.csuiPromise.done(function () {
              $elem.prop("tabindex", "0");
              self._focusOnElement($elem);
              setTimeout(function () {
                self.skipAutoScroll = false;
              }, 600);
            });
          } else {
            $elem.prop("tabindex", "0");
            self._focusOnElement($elem);
            setTimeout(function () {
              self.skipAutoScroll = false;
            }, 600);
          }
        },

        onKeyInView: function (event) {
          // handle tab, space, enter, delete only
          if (event.keyCode !== 9 && event.keyCode !== 32 && event.keyCode !== 13 &&
              event.keyCode !== 46) {
            return;
          }

          event.activeTabLink = this.activeTabLink;
          event.activeTabContent = this.activeTabContent;

          var elem, $focusingElem;
          var curPos = this.currentTabPosition;
          var elemsLength = this.keyboardBehavior.tabableElements.length;

          // if the focus is already in the region, find the view containing currently focused element
          var focusPos = 0;
          while (focusPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[focusPos];
            if (elem && elem.containTargetElement && elem.containTargetElement(event)) {
              // if the region contains target elememt but has no tabable element, just return and
              // let the global Tabable behavior handle the keypress
              if (elem.numberOfTabableElements() === 0) {
                this.currentTabPosition = -1;
                return;
              }
              break;
            }
            focusPos++;
          }
          if (focusPos >= 0 && focusPos < elemsLength) {
            curPos = this.currentTabPosition = focusPos;
          }

          // let the child view handle the keypress first
          if (curPos >= 0 && curPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.onKeyInView) {
              // skip autoScroll if the focusing area is TabLink (index = 0)
              curPos === 0 && (this.skipAutoScroll = true);
              $focusingElem = elem.onKeyInView(event);
              if ($focusingElem !== undefined) {
                this._moveTo(event, $focusingElem);
                return;
              }
            }
          }

          // if the child did not handle the keypress
          if (event.keyCode === 9) {  // tab
            if (curPos >= 0 && curPos < elemsLength) {
              // log.debug('TabPanelKeyboardBehavior::onKeyInView ' + this.constructor.name) &&
              // console.log(log.last);

              var newTabbedElement = -1;
              if (event.shiftKey) {  // shift tab -> activate previous region
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }

              // check and move to a region with focusable element
              while (newTabbedElement >= 0 && newTabbedElement < elemsLength) {
                elem = this.keyboardBehavior.tabableElements[newTabbedElement];
                if (elem.currentlyFocusedElement) {
                  $focusingElem = elem.currentlyFocusedElement(event);
                  if ($focusingElem !== undefined) {
                    break;
                  }
                }
                // move to the next one to check
                if (event.shiftKey) {  // shift tab -> activate previous region
                  newTabbedElement = newTabbedElement - 1;
                } else {
                  newTabbedElement = newTabbedElement + 1;
                }
              }

              if (newTabbedElement >= 0 && newTabbedElement < elemsLength &&
                  newTabbedElement !== this.currentTabPosition) {
                // skip autoScroll if the focusing area is TabLink
                newTabbedElement === this.tabLinksIndex && (this.skipAutoScroll = true);
                this.currentTabPosition = newTabbedElement;
                this._moveTo(event, $focusingElem);
              } else {
                // FireFox quirky: need to blur
                // for versions,activity tab $(event.target) is not working in IE.
                if (base.isMSBrowser()) {
                  $(event.srcElement).blur();
                } else {
                  $(event.target).blur();
                }
                this.currentTabPosition = -1;
              }
            }
          }
        }
      });

    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.unbind('tab:content:render');
    },

    refreshTabableElements: function (view) {
      // log.debug('TabPanelKeyboardBehavior::refreshTabableElements ' + view.constructor.name) &&
      // console.log(log.last);

      view.tabLinks.triggerMethod('refresh:tabable:elements', view);
      view.tabContent.triggerMethod('refresh:tabable:elements', view);

      // tabLinks
      this.tabLinksIndex = 0;
      this.tabableElements[this.tabLinksIndex] = view.tabLinks;

      // tabContentHeader if defined
      this.tabContentHeaderIndex = -1;
      if (view.tabContentHeader) {
        this.tabContentHeaderIndex = 1;
        this.tabableElements[this.tabContentHeaderIndex] = view.tabContentHeader;
      }

      // tabContent
      this.tabContentIndex = view.tabContentHeader ? 2 : 1;
      this.tabableElements[this.tabContentIndex] = view.tabContent;

      this.view.currentTabPosition = -1;
      this.view.triggerMethod("refresh:tabindexes");
    }

  });

  return TabPanelKeyboardBehavior;

});
// Renders tab panel made of links and content
csui.define('csui/controls/tab.panel/tab.panel.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/impl/tab.links.view',
  'csui/controls/tab.panel/impl/tab.contents.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/models/version',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/controls/form/pub.sub',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, base, TabLinkCollectionView,
    TabContentCollectionView, ViewEventsPropagationMixin, VersionModel,
    TabableRegionBehavior, TabPanelKeyboardBehavior, NonEmptyingRegion, PubSub) {
  'use strict';

  var TabPanelView = Marionette.View.extend({

    className: 'cs-tabpanel tab-panel',
    attributes: function () {
      var id = this.id || _.uniqueId('cs-tab');
      var attrs = {id: id, role: 'tabpanel'};
      return attrs;
    },

    events: {"keydown": "onKeyInView"},

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        notSetFocus: true,
        initialActivationWeight: 100
      },
      TabPanelKeyboardBehavior: {
        behaviorClass: TabPanelKeyboardBehavior
      }
    },

    constructor: function TabPanelView(options) {
      options || (options = {});
      options.tabPanel = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      // generate unique internal Tab ID
      this._generateUniqueTabId(options);
      if (options.node) {
        var initialPanel = options.node.get('initialPanel');
        if (initialPanel) {
          var initialTabIndex = options.collection.findIndex({name: initialPanel});
          if (initialTabIndex >= 0 && initialTabIndex < options.collection.length) {
            var initialPanelModel = options.collection.at(initialTabIndex);
            options.activeTab = new Backbone.Model(initialPanelModel.attributes);
            options.activeTab.set('tabIndex', initialTabIndex);
            options.selectedTab = new Backbone.Model(initialPanelModel.attributes);
          }
        }
      }
      if (!options.activeTab) {
        options.activeTab = new Backbone.Model({tabIndex: 0});
      }

      Marionette.View.prototype.constructor.apply(this, arguments);

      this.linksRegion = new NonEmptyingRegion({el: this.el});
      this.contentRegion = new NonEmptyingRegion({el: this.el});

      // Fix the active tab index if it exceeds the tab count
      this.activeTab = options.activeTab;
      var tabIndex = this.activeTab.get('tabIndex');
      if (tabIndex >= this.collection.length) {
        this.activeTab.set('tabIndex', this.collection.length - 1);
      }

      // scenarios such as Properties page: the categories tabs are asynchorously loaded later
      this.listenTo(this.collection, 'reset', this._generateUniqueTabId);
      // scenarios such as Properties page: add a new category or RM inserts their tabs
      this.listenTo(this.collection, 'add', this._setModelUniqueTabId);

      this.listenTo(this, 'activate:tab', this._scrollToActiveTab);
      this.listenTo(this, 'before:destroy', this._destroyContent);
    },

    _scrollToActiveTab: function (tabContent, tabPane, tabLink) {
      this.activeTabLink = tabLink;
      this.activeTabContent = tabContent;
      if (this.options.mode) {
        var href           = tabLink.$el.find('>a').attr('href'),
            extraTopOffset = this.getOption('extraScrollTopOffset') || 0;
        href[0] === '#' && (href = href.substr(1));
        var hrefElems = this.$el.find("div[id='" + href + "']");
        if (hrefElems.length > 0) {
          var tabPosTop = hrefElems[0].offsetTop + extraTopOffset;
          if (this.options.mode === 'spy') {
            // Update scrollspy with newly created tab
            var scrollspy = this.tabContent.$el.data('binf.scrollspy');
            scrollspy && scrollspy.refresh();
          }
          this.tabContent.$el.animate({
            scrollTop: tabPosTop
          }, 300);

          // change the title of sticky header.
          var newTabHeaderText = tabLink.$el.find(".cs-tablink-text").html(),
              pubsubPostFix    = (this.options.node instanceof VersionModel ? 'v' : 'p') +
                                 this.options.node.get('id'),
              objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                 pubsubPostFix;

          PubSub.trigger(objPubSubId, newTabHeaderText);
        }
      }
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._destroyContent();
      this._renderContent();
      this._bindingToEvents();
      this.triggerMethod('render', this);
      return this;
    },

    _renderContent: function () {
      // Initialize the tab link and content sub-views
      var TabLinkCollectionViewClass = this.options.TabLinkCollectionViewClass ||
                                       TabLinkCollectionView;
      this.tabLinks = new TabLinkCollectionViewClass(this.options);
      var TabContentCollectionViewClass = this.options.TabContentCollectionViewClass ||
                                          TabContentCollectionView;
      this.tabContent = new TabContentCollectionViewClass(this.options);
      this.propagateEventsToViews(this.tabLinks, this.tabContent);
      this.linksRegion.show(this.tabLinks);
      this.contentRegion.show(this.tabContent);

      // Propagate the tab activating event to the listeners outside
      var self = this;
      this.listenTo(this.tabLinks, 'childview:before:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            // when the tab is activating by mouse click for example,
            // let the _autoScrolling know not to scroll
            this.activatingTab = true;
            this.triggerMethod('before:activate:tab', tabContent, tabPane, tabLink);
          });
      this.listenTo(this.tabLinks, 'childview:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            // give this a bit more time than _autoScrolling's timeout
            setTimeout(function () {
              self.activatingTab = false;
            }, 600);
            this.triggerMethod('activate:tab', tabContent, tabPane, tabLink);
            // Trigger the dom:show event once more.  Some operations can be
            // performedonly when the view is both in DOM and visible.
            tabContent.triggerMethod('dom:refresh');
          });

      var tabIndex = 0;
      if (this.activeTab && this.activeTab.get('tabIndex') >= 0 &&
          this.activeTab.get('tabIndex') < this.collection.length) {
        tabIndex = this.activeTab.get('tabIndex');
      }
      this.activeTabLink = this.tabLinks.children.findByIndex(tabIndex);
      // Tab control can be empty
      if (this.activeTabLink) {
        this.activeTabContent = this.tabContent.children.findByIndex(tabIndex).content;
      }
    },

    _destroyContent: function () {
      this.$el.unbind('tab:content:focus');
      this.$el.unbind('tab:link:delete');
      if (this.tabLinks) {
        this.cancelEventsToViewsPropagation(this.tabLinks, this.tabContent);
        this.stopListening(this.tabLinks)
            .stopListening(this.tabContent);
        this.linksRegion.empty();
        this.contentRegion.empty();
      }
    },

    _bindingToEvents: function () {
      var self = this;
      this.$el.bind('tab:content:focus',
          function (event) {
            var $elem = self.tabContent.getTabContentFirstFocusableELement(event.tabId);
            if ($elem) {
              self.currentTabPosition = this.keyboardBehavior ?
                                        this.keyboardBehavior.tabContentIndex : -1;
              self._moveTo && self._moveTo(event, $elem);
              self.tabContent.keyboardBehavior &&
              self.tabContent.keyboardBehavior.updateCurrentTabPosition();
            }
          });
      this.$el.bind('tab:link:delete',
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.tabLinks.deleteTabById(event.tabId);
          });
    },

    _convertCollection: function (options) {
      var tabs = new Backbone.Collection(options.tabs);
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      return tabs;
    },

    _generateUniqueTabId: function (options) {
      // This method ensures unique internal tab ID for each tablink-tabcontent pair in entire page.
      // Cannot use model's 'id' as tab ID because it can be duplicated if the same model is being
      // used in multiple places on the page.
      var collection = options instanceof Backbone.Collection ? options :
                       (options.collection || this.collection);
      if (collection) {
        collection.each(_.bind(function (tab) {
          this._setModelUniqueTabId(tab);
        }, this));
      }
    },

    _setModelUniqueTabId: function (model) {
      model && model.set('uniqueTabId', _.uniqueId('cstab-uid-'), {silent: true});
    },

    _isTablinkVisibleInParents: function ($el, options) {
      return this.tabLinks._isTablinkVisibleInParents($el, options);
    }

  });

  _.extend(TabPanelView.prototype, ViewEventsPropagationMixin);

  return TabPanelView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.links.ext',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div class=\"left-toolbar\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <div class=\"right-toolbar\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"tab-links-bar\">\r\n  <span class=\"fadeout\"></span>\r\n  <ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.links.ext', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.link.ext',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"cs-icon-required category_required\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.required_tooltip || (depth0 != null ? depth0.required_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"required_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"cs-tablink-delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.delete_tooltip || (depth0 != null ? depth0.delete_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"delete_tooltip","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.delete_icon || (depth0 != null ? depth0.delete_icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"delete_icon","hash":{}}) : helper)))
    + " cs-delete-icon\" role=\"button\"\r\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.removeable : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.deleteCategoryAria || (depth0 != null ? depth0.deleteCategoryAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"deleteCategoryAria","hash":{}}) : helper)))
    + "\"></span>\r\n  </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "data-cstabindex=\"0\"";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" class=\"cs-tablink\" data-binf-toggle=\"tab\" title=\""
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.required : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <span class=\"cs-tablink-text\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</span>\r\n</a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.allow_delete : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.link.ext', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tab.panel/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/tab.panel/impl/nls/root/lang',{
  deleteTooltip: 'Delete',
  deleteCategoryAria: 'Delete {0}',
  gotoNextTooltip: 'Show next tab',
  gotoPreviousTooltip: 'Show previous tab',
  requiredTooltip: 'Required',
  showMore: 'Show more'
});


csui.define('csui/controls/tab.panel/impl/tab.link.ext.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/controls/tab.panel/impl/tab.link.ext',
  'i18n!csui/controls/tab.panel/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function (_, TabLinkView, tabLinkTemplate, lang) {
  "use strict";

  var TabLinkViewExt = TabLinkView.extend({

    template: tabLinkTemplate,
    templateHelpers: function () {
      return {
        required_tooltip: lang.requiredTooltip,
        delete_icon: this.options.delete_icon || 'circle_delete',
        delete_tooltip: this.options.delete_tooltip || lang.deleteTooltip,
        deleteCategoryAria: _.str.sformat(lang.deleteCategoryAria, this.model.get('title'))
      };
    },

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab',
      'focus .cs-delete-icon': 'onFocusDeleteIcon',
      'blur .cs-delete-icon': 'onBlurDeleteIcon',
      'click .cs-tablink-delete': 'onDelete'
    },

    ui: {
      link: '>a',
      deleteIcon: '.cs-delete-icon',
      deleteIconParent: '.cs-tablink-delete'
    },

    constructor: function TabLinkViewExt(options) {
      this.options = options || {};
      TabLinkView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'action:updated', function () {
        this._setRemoveable();
      });
    },

    onRender: function () {
      this._setRemoveable();
    },

    _setRemoveable: function () {
      if (!!this.model.get('removeable')) {
        this.ui.deleteIcon.addClass('removeable');
        this.ui.deleteIcon.attr('data-cstabindex', '0');
        this.ui.deleteIconParent.removeClass('binf-hidden');
      } else {
        this.ui.deleteIcon.removeClass('removeable');
        this.ui.deleteIcon.removeAttr('data-cstabindex');
        this.ui.deleteIconParent.addClass('binf-hidden');
      }
    },

    onFocusDeleteIcon: function () {
      this.ui.deleteIconParent.addClass('focused');
    },

    onBlurDeleteIcon: function () {
      this.ui.deleteIconParent.removeClass('focused');
    },

    onDelete: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.deleteCurrentTab();
    },

    deleteCurrentTab: function () {
      //
      // Technical note on the 'allow_delete' and 'removeable':
      // 1) Why there are two, not just one?
      //    Answer: 'allow_delete' is for the View to create with or  without the delete icon
      //            element.
      // 2) What 'removeable' is for and why have it?
      //    Answer: 'removeable' is the Model state to determine if the delete icon should be
      //             active and visible or not. In some scenarios, the Model commands are
      //             delayed fetched.  The 'removeable' attribute would be updated asynchronously.
      //             At the intialization the value would be false, but could be true/false later.
      // The code combines both values and also uses CSS to show/hide the icon on mouse hover
      // or touch focus on mobile device without additional JavaScript code.
      // Thoughts were put into it.  Otherwise, the simple one attribute was an obvious easy choice
      // that everyone would go for it first.
      //
      if (this.model.get('allow_delete') === true && this.model.get('removeable') === true) {
        this.triggerMethod('delete:tab');
      }
    }

  });

  return TabLinkViewExt;

});

csui.define('csui/controls/tab.panel/tab.links.ext.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.links.view',
  'hbs!csui/controls/tab.panel/impl/tab.links.ext',
  'csui/controls/tab.panel/impl/tab.link.ext.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin) {
  "use strict";

  var TabLinkCollectionViewExt = TabLinkCollectionView.extend({

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.options.tabType || 'binf-nav-tabs',
        toolbar: this.options.toolbar ? true : false
      };
    },

    events: {
      'click .left-toolbar': 'onToolbarClicked',
      'click .right-toolbar': 'onToolbarClicked'
    },

    childView: TabLinkViewExt,
    childViewContainer: function () {
      return '.tab-links-bar >.' + this.tabType;
    },
    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    constructor: function TabLinkCollectionViewExt(options) {
      this.options = options || {};
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'metadata:schema:updated', function (model) {
        // Re-Render model specific tab to reflect model changes - ex: required
        this.children.findByModel(model).render();
      }, this);
    },

    onToolbarClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    deleteTabById: function (tabId) {
      var ret = false;
      if (tabId === undefined) {
        return ret;
      }

      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabLink = this.children.findByModel(model);
        if (tabLink) {
          tabLink.deleteCurrentTab();
          ret = true;
        }
      }
      return ret;
    }

  });

  _.extend(TabLinkCollectionViewExt.prototype, ViewEventsPropagationMixin);

  return TabLinkCollectionViewExt;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/behaviors/impl/expanding.behavior',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"cs-more tile-expand\">\r\n  <div class=\"icon circular icon-tileExpand\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expandIconTitle || (depth0 != null ? depth0.expandIconTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandIconTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandIconAria || (depth0 != null ? depth0.expandIconAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandIconAria","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_behaviors_impl_expanding.behavior', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tile/behaviors/expanding.behavior',['require', 'csui/lib/underscore', 'csui/lib/backbone',
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
      // The perspective begins to change with an animation before the
      // previous one is destroyed; the expanded view should be hidden
      // previous one is.
      var destroyWithAnimation = _.bind(this._destroyExpandedView, this, false),
          destroyImmediately   = _.bind(this._destroyExpandedView, this, true),
          context              = view.options && view.options.context;
      this.listenTo(this, 'before:destroy', destroyWithAnimation);
      if (context) {
        // The hiding animation finishes before the context is fetched
        // and the page is re-rendered.  If it becomes problem, use
        // destroyImmediately here.
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

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ExpandingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/impl/tile',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"tile-type-icon\">\r\n      <span class=\"icon title-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></span>\r\n    </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageUrl : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"tile-type-image "
    + this.escapeExpression(((helper = (helper = helpers.imageClass || (depth0 != null ? depth0.imageClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageClass","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"tile-type-icon tile-type-icon-img\"><img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUrl","hash":{}}) : helper)))
    + "\" alt=\"\" aria-hidden=\"true\"></span>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"tile-header\">\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n  <div class=\"tile-title\" >\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n\r\n  <div class=\"tile-controls\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>\r\n\r\n</div>\r\n\r\n<div class=\"tile-content\"></div>\r\n\r\n<div class=\"tile-footer\"></div>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_impl_tile', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/tile/impl/tile',[],function(){});
csui.define('csui/controls/tile/tile.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/controls/tile/impl/tile',
  /* FIXME: Merge this with the list control */
  'css!csui/controls/list/impl/list',
  'css!csui/controls/tile/impl/tile'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template) {

  var TileView = Marionette.LayoutView.extend({

    className: 'cs-tile cs-list tile content-tile',

    template: template,

    regions: {
      headerControls: '.tile-controls',
      content: '.tile-content',
      footer: '.tile-footer'
    },

    constructor: function TileView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._renderContentView);
    },

    serializeData: function () {
      return _.reduce(['icon', 'imageUrl', 'imageClass', 'title'],
          function (result, property) {
            result[property] = getOption.call(this, property);
            return result;
          }, {}, this);
    },

    _renderContentView: function () {
      var ContentView = getOption.call(this, 'contentView');
      if (!ContentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      var contentViewOptions = getOption.call(this, 'contentViewOptions');
      this.contentView = new ContentView(contentViewOptions);
      this.propagateEventsToViews(this.contentView);
      this.content.show(this.contentView);
    }

  });

  _.extend(TileView.prototype, ViewEventsPropagationMixin);

  // TODO: Expose this functionality and make it generic for other views too
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) && !(value.prototype instanceof Backbone.View) ?
           value.call(this) : value;
  }

  return TileView;

});

csui.define('csui/controls/iconpreload/icon.preload.view',["csui/lib/underscore",
  "csui/lib/jquery",
  "csui/utils/log",
  "csui/utils/base",
  "csui/lib/marionette",
  "csui/utils/non-emptying.region/non-emptying.region",
  "csui/lib/binf/js/binf"
], function (_, $, log, base, Marionette, NonEmptyingRegion) {
  'use strict';

  var IconPreloadView = Marionette.ItemView.extend({
    id: "csui-icon-preload",
    template: false,
    onRender: function () {
      this._preloadIcons();
    },
    constructor: function IconPreloadView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    _preloadIcons: function () {
      var that  = this,
          icons = [
            'icon-toolbar-copy',
            'icon-toolbarAdd',
            'icon-toolbarFilter',
            'icon-toolbar-share',
            'icon-toolbar-download',
            'icon-toolbar-metadata',
            'icon-toolbar-shortcut',
            'icon-toolbar-add-version',
            'icon-toolbar-copy',
            'icon-toolbar-delete',
            'icon-toolbar-edit',
            'icon-toolbar-more',
            'icon-toolbar-move',
            'icon-toolbar-rename',
            'icon-toolbar-reserve',
            'icon-toolbar-unreserve',
            'icon-publish_status',
            'icon-waiting_for_approval_status',
            'icon-in_draft_status',
            'icon-socialFav',
            'icon-socialFavOpen',
            'icon-reserved_other',
            'icon-reserved_other_mo',
            'icon-reserved_other_md',
            'icon-reserved_self',
            'icon-reserved_self_mo',
            'icon-reserved_self_md',
            'icon-toolbar-permissions'
          ];
      _.each(icons, function (icon) {
        that.$el.append('<span class="csui-icon ' + icon +
                        '" style="position:fixed;top:-100px;left:-100px;"></span>');
      });
    }
  });
  IconPreloadView.ensureOnThePage = function () {
    if (base.isIE11()) {
      if (!$("#csui-icon-preload").length) {
        var iconPreloadView = new IconPreloadView(),
            binfContainer   = $.fn.binf_modal.getDefaultContainer(),
            region          = new NonEmptyingRegion({el: binfContainer});
        region.show(iconPreloadView);
      }
    }
  };
  return IconPreloadView;
});
csui.define('csui/widgets/html.editor/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/html.editor/impl/nls/root/lang',{
  ConfirmQuestionMessage: 'Are you sure to leave this page?',
  ConfirmQuestionTitle: 'Cancel edits?',
  CancelConfirmMessage: 'Are you sure you want to cancel?',
  cancelTitle: "Cancel",
  cancelAria: "Cancel edit",
  saveTitle: "Save",
  saveAria: "Save contents",
  moreActionsAria: "{0} actions menu",
  PageDefaultContent: 'your content goes here',
  noWikiPageFound: 'This content no longer exists',
  RestoreDialogMessage: "You have unsaved changes. Do you want to restore changes and continue" +
                        " editing?",
  RestoreDiaglogTitle: "Restore changes",
  reservedBy: 'Reserved by {0}\n{1}',
  more: 'more',
  properties: 'Properties',
  permissions: 'View permissions',
  Edit: 'Edit',
  unreserve: 'Unreserve',
  Continue: 'Continue',
  Discard: 'Discard',
  insertContentServerLink: 'Insert Content Server Link',
  contentServerLink: 'Content Server Link',
  versionDifferenceConfirmMessage: 'Another user has saved an alternate version of this' +
                                   ' page. Do you still want to add a new version?',
  versionDifferenceConfirmTitle: 'Intermediate version added',
  brokenLinkMessage: "Sorry, the item you requested could not be accessed. Either it does not" +
                     " exist, or you do not have permission to access it. If you were sent a" +
                     " link to this item, please contact the sender for assistance.",
  goToTooltip: "go to {0}",
  previewUnavailable: "Preview Unavailable",
  cannotFindObject: "Cannot find object"
});

csui.define('csui/controls/rich.text.editor/impl/rich.text.util',["csui/lib/underscore", "csui/lib/jquery", "csui/utils/url", 'csui/models/node/node.model',
  'csui/utils/base', 'csui/utils/commands', 'i18n!csui/widgets/html.editor/impl/nls/lang',
  'csui/utils/log'
], function (_, $, Url, NodeModel, base, commands, lang, log) {

  var RichTextEditorUtils = {
    isEmptyContentElement: function (el) {
      return $.trim($(el).text());
    },

    checkDomain: function (view, event) {

      var domainUrl = view.connector.connection.url,
          link      = event.target.href;
      //checks the similarity of links after the domain name.
      view.options.isSameDomain = link.search(new RegExp(domainUrl.split('/api')[0], 'i')) !== -1;
      return view.options.isSameDomain;
    },

    getUrl: function (view, event) {
      var deferred = $.Deferred();
      if (!!event.target.href) {
        var smartLink    = event.target.href.match(/^.*\/app\/(.+)$/i),
            absolute     = new Url(event.target.href).isAbsolute(),
            isSameDomain = absolute ? this.checkDomain(view, event) : true,
            wikiUrl      = event.target.href.match(/^.*\/wiki\/(.+)$/i),
            nodeUrl      = event.target.href.match(/^.*\/open\/(.+)$/i) ||
                           event.target.href.match(/^.*\/nodes\/(.+)$/i),
            objid        = event.target.href.match(/^.*objId\=(.+)$/i), id,
            self         = this;
        if (!smartLink && isSameDomain) { // classic urls of same domain
          if (wikiUrl || objid) { //  urls containing "wiki" or "objId" words
            self.renderLinks({
              event: event,
              connector: view.connector,
              callingViewInstance: view
            }).done(function () {
              deferred.resolve();
            });
          } else if (nodeUrl) { // classic url containing open or nodes of samedomain
            id = nodeUrl[1];
            this.updateLink(event, id);
            deferred.resolve();
          }
          else { // classic url of samedomain that doesnt contain  wiki or nodes or objid or not proper
            deferred.resolve();
          }
        } else {  // smart url or (or) and different domain url
          deferred.resolve();
        }

      }
      return deferred.promise();
    },

    renderLinks: function (args) {
      var node, deferred = $.Deferred();
      var target = !!args.event.target.href ? $(args.event.target) :
                   $(args.event.target).parents('a'),
          that   = args.callingViewInstance,
          self   = this;
      args.event.target = target[0];
      if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i) ||
          !!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)\/(.+)$/i);
          node = parseInt(node[1]);
          self._getWikiPageId(args, node, args.event.target.href).done(function (res, node) {
            self.id = res;
            if (!!node) {
              self.updateLink(args.event, node.id);
            } else {
              log.info(lang.brokenLinkMessage);
            }
            deferred.resolve();
          });
        } else if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)$/i);
          node = parseInt(node[1]);
          self.updateLink(args.event, node);
          deferred.resolve();
        }

      }
      else if (!!args.event.target.href.match(/^.*objId\=(.+)$/)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        var objIdIndex = args.event.target.href.match(/^.*objId\=(.+)$/)[1];
        if (objIdIndex !== -1) {
          node = this.getNewNodeModel({
            attributes: {
              id: parseInt(objIdIndex)
            },
            connector: args.connector
          });
          self.updateLink(args.event, node.attributes.id);
        }
        deferred.resolve();
      }
      return deferred.promise();
    },

    getNewNodeModel: function (options) {
      return new NodeModel(options.attributes, {
        connector: options.connector,
        commands: commands.getAllSignatures(),
        fields: options.fields || {},
        expand: options.expand || {}
      });
    },

    updateLink: function (el, nodeId) {
      var cslinkPattern = /^.*\/(cs\.\w{3}|livelink\.\w{3}|llisapi\.\w{3}|llisapi|cs|livelink).*$/,
          id            = !!nodeId && nodeId,
          cslink        = el.target.href.match(cslinkPattern),
          newHref       = !!cslink && cslink.length && el.target.href.substring(0,
              el.target.href.indexOf("/".concat(cslink[1])) + "/".concat(cslink[1]).length);
      el.target.href = !!newHref && newHref.length ?
                       newHref.concat("/app/nodes/", id) : el.target.href;
    },

    _getWikiPageId: function (self, wikiId, targetHref) {
      var $wikiPageName  = decodeURIComponent(targetHref.substring(
          targetHref.lastIndexOf("/") + 1, targetHref.length)),
          dfd            = $.Deferred(),
          connector      = self.connector,
          collectOptions = connector.extendAjaxOptions({
            url: this._getWikiContainerUrl(self, wikiId),
            type: 'GET'
          });

      $.ajax(collectOptions).done(function (resp) {
        resp.targetWikiPageNode = resp.results.find(function (element) {
          if (element.name === $wikiPageName) {
            return element;
          }
        });
        if (!!resp.targetWikiPageNode && !!resp.targetWikiPageNode.id) {
          dfd.resolve(resp.targetWikiPageNode.id, resp.targetWikiPageNode);
        } else {
          dfd.resolve(-1);
        }
      }).fail(function (resp) {
        dfd.reject(resp);
      });
      return dfd.promise();
    },

    _getWikiContainerUrl: function (self, wikiContainerId) {
      return self.connector.connection.url.replace('/v1', '/v2') + '/wiki/' + wikiContainerId +
             "/wikipages";
    },

    _getNicknameId: function (self, nickName) {
      var deferred       = $.Deferred(),
          collectOptions = self.connector.extendAjaxOptions({
            url: self.connector.connection.url.replace("/api/v1", "/api/v2") +
                 "/wiki/nickname/" + nickName + "?actions=open",
            requestType: "nickname",
            view: this,
            type: "GET"
          });
      nickName && $.ajax(collectOptions).done(function (response) {
        deferred.resolve(response);
      }).fail(function(){
        deferred.reject();
      });
      return deferred.promise();
    }
  };
  return RichTextEditorUtils;

});

csui.define('css!csui/widgets/html.editor/impl/html.editor',[],function(){});

csui.define('css!csui/lib/ckeditor/plugins/cssyntaxhighlight/styles/shCoreDefault',[],function(){});
csui.define('csui/controls/rich.text.editor/rich.text.editor',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/ckeditor/ckeditor',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'css!csui/widgets/html.editor/impl/html.editor',
      'css!csui/lib/ckeditor/plugins/cssyntaxhighlight/styles/shCoreDefault'
    ],
    function ($, _, Backbone, ckeditor, RichTextEditorUtils) {
      'use strict';

      var getCSSName = function (part) {
        // code from ckeditor to get the stylesheet name based on the browser type.
        var uas = window.CKEDITOR.skin['ua_' + part],
            env = window.CKEDITOR.env;
        if (uas) {
          uas = uas.split(',').sort(function (a, b) {
            return a > b ? -1 : 1;
          });
          for (var i = 0, ua; i < uas.length; i++) {
            ua = uas[i];

            if (env.ie) {
              if ((ua.replace(/^ie/, '') == env.version) || (env.quirks && ua == 'iequirks')) {
                ua = 'ie';
              }
            }

            if (env[ua]) {
              part += '_' + uas[i];
              break;
            }
          }
        }
        return part + '.css';
      };

      var getRichTextEditor = function (config) {
        config = config || {};
        _.each(ckeditor.instances, function (ckInstance) {
          ckInstance.destroy();
        });

        var csuiDefaults = {
          custcsuiimage_imageExtensions: 'gif|jpeg|jpg|png',
          skin: 'otskin',
          format_tags: 'p;h1;h2;h3;h4;h5',
          allowedContent: true,
          disableAutoInline: true,
          autoHideToolbar: false,
          title: false,
          cs_syntaxhighlight_hideGutter: true,
          enterMode: ckeditor.ENTER_P,
          extraPlugins: 'filebrowser,find,panelbutton,colorbutton,font,selectall,smiley,dialog,' +
                        'sourcedialog,print,preview,justify,save,cancel,cssyntaxhighlight,cslink',
          toolbar: [
            ['Undo', 'Redo', '-', 'Font', 'FontSize', '-', 'Styles', 'Format', 'TextColor'],
            '/',
            ['Bold', 'Italic', 'Blockquote', '-', 'Replace', '-', 'NumberedList',
              'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
              'JustifyRight', '-', 'Link', 'cslink', '-', 'Image', 'Table', 'Sourcedialog']
          ]
        };

        if (config.externalPlugins) {
          if (!_.isArray(config.externalPlugins)) {
            throw TypeError('externalPlugins must be array type');
          } else {
            if (config.externalPluginsBasePath &&
                typeof config.externalPluginsBasePath === 'string') {
              if (config.externalPluginsBasePath.charAt(
                      config.externalPluginsBasePath.length - 1) !== '/') {
                config.externalPluginsBasePath += '/';
              }
              var extraPlugins = [];
              config.externalPlugins.map(function (pluginName) {
                ckeditor.plugins.addExternal(pluginName,
                    config.externalPluginsBasePath + pluginName + '/', 'plugin.js');
                extraPlugins.push(pluginName);
              });
              // delete to avoid conflicts if any
              delete config.externalPlugins;
              delete config.externalPluginsBasePath;
              extraPlugins = extraPlugins.join();
              if (!!config.extraPlugins) {
                if (config.extraPlugins.length) {
                  extraPlugins = config.externalPlugins + ',' + extraPlugins;
                }
                config.extraPlugins = extraPlugins;
              } else {
                csuiDefaults.extraPlugins += ',' + extraPlugins;
              }
            } else {
              throw Error('externalPluginsBasePath option missing or is not a string');
            }
          }
        }

        config = _.defaults(config, csuiDefaults, ckeditor.config);
        ckeditor.config = config;
        ckeditor.on("dialogDefinition", function (event) {
          var dialogName = event.data.name,
              dialogDefinition = event.data.definition;

          // add one unique classname for all ckeditor dialogs.
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-control-dialog');
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-dialog-' + dialogName);

          if (dialogName == 'link') {
            //if upload dialog has to be enabled pass the value true to config.linkShowUploadTab
            if (!config.linkShowUploadTab) {
              var uploadTab = dialogDefinition.getContents('upload');
              uploadTab.hidden = true;
            }
          }
        });
        // FIX ME: find best way to remove stylesheets from head and script
        // remove existing stylesheet, for now don't remove script src.
        // @ESOC-Kaveri: 
        //     - for march update, let's go with this workaround, created jira LPAD- to address it properly for june update.
        //     - once other module's specs finalized, then look and feel will be same
        var skin   = config.skin.split(','),	//skin[0] = skin name, skin[1] = skin path
            dialog = getCSSName('dialog'),
            editor = getCSSName('editor');
        $('head link[href*="ckeditor/skins/' + skin[0] + '/' + editor +
          '"], head link[href*="ckeditor/skins/' + skin[0] + '/' + dialog + '"]').remove();
        // for now it is mandatory to provide the path of skin name to remove conflicts of css
        window.CKEDITOR.document.appendStyleSheet(skin[1] + editor);
        window.CKEDITOR.document.appendStyleSheet(skin[1] + dialog);
        return ckeditor;
      };

      var getRichTextEditorUtils = function getRichTextEditorUtils() {
        return RichTextEditorUtils;
      };

      var isEmptyContent = function (content) {
        // as there are only three entermode in ckeditor DIV, P, BR. checking for them, along with the any empty spaces.
        return !!content &&
               content.getData().replace(/<\/div>|<div>|<\/p>|<p>|&nbsp;|<br \/>|\s/g, '');
      };

      return {
        getRichTextEditor: getRichTextEditor,
        getRichTextEditorUtils: getRichTextEditorUtils,
        isEmptyContent: isEmptyContent
      };
    });
csui.define('csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base'], function (_, $, base) {
  'use strict';

  //
  // Mixin for a modal View to trap keyboard navigation.
  //
  // Note: for completeness, also do the following in your View code
  // - capture the in-focus element before opening your modal view
  // - set focus on the first focusable element after your modal is shown after animation
  // - set focus back to the prior in-focus element after closing your modal view
  //
  var ModalKeyboardNavigationMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {

        _rebuildFocusableElements: function () {
          this.focusableElements = base.findFocusables(this._focusHolder);
        },

        /**
         * Calling this on DOM changes will allow re-building of focusable elements
         */
        refreshFocusEngage: function () {
          this._rebuildFocusableElements();
        },

        /**
         * Maintains the tab focus on the provided element to trap KN
         */
        _maintainTabFocus: function (modalElement) {
          this._focusHolder = modalElement;
          this._rebuildFocusableElements();

          var self = this;
          modalElement.keydown(function (e) {
            var currentIndex   = self.focusableElements.index(e.target),
                focusableCount = self.focusableElements.length,
                cancelEvent    = false;
            if (currentIndex === -1) {
              // Unknown element. Element could be created after engage.
              // Calling 'dom:refresh' is recommended on DOM changes 
              return;
            }
            if (e.keyCode === 9) {
              if (!e.shiftKey && currentIndex === focusableCount - 1) {
                // Tab on last focusable element
                self.focusableElements[0].focus();
                cancelEvent = true;
              } else if (e.shiftKey && currentIndex === 0) {
                // Shift tab on first focusable element
                self.focusableElements[focusableCount - 1].focus();
                cancelEvent = true;
              }
            }
            cancelEvent && e.preventDefault();
            e.stopPropagation();
          });

          this.listenTo(this, 'dom:refresh', function () {
            this.refreshFocusEngage();
          });

          var disengage = function disengage() {
            modalElement.off('keydown');
          };
          return {
            disengage: disengage
          };
        },

        // Params:
        // - modalElement : optional; the modal element. Default is the view's el.
        engageModalKeyboardFocusOnOpen: function (modalElement) {
          this._allyHandles || (this._allyHandles = []);
          modalElement = $(modalElement || this.el);

          // make sure Tab key (also Shift-Tab) controlled focus is trapped within tabsequence
          this._allyHandles.push(this._maintainTabFocus(modalElement));
        },

        disengageModalKeyboardFocusOnClose: function () {
          if (this._allyHandles) {
            while (this._allyHandles.length > 0) {
              // ally handles have a common API method disengage()
              this._allyHandles.pop().disengage();
            }
          }
        },

        hasEngagedModalKeyboardFocus: function () {
          return this._allyHandles && this._allyHandles.length;
        }
      });
    }
  };

  return ModalKeyboardNavigationMixin;
});
csui.define('csui/controls/tab.panel/tab.links.ext.scroll.mixin',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/version',
  'i18n!csui/controls/tab.panel/impl/nls/lang', 'csui/controls/form/pub.sub'
], function (_, $, Backbone, VersionModel, lang, PubSub) {

  //
  // TabLinks Mixin is to provide the additional tab overflow scrolling functionality to the
  // TabLinksExtView object.
  // Define the following in the main Tab Panel View constructor:
  // - this.options = {
  //     toolbar: true,
  //   }
  // Add this mixin to your main Tab View implementation and make the appropriate calls.
  // Also add your own css styling to achieve the correct entity location and layout.
  // For detailed example, see 'src/widgets/metadata/impl/metadata.properties.view.js'.
  //
  var TabLinksScrollMixin = {

    _initializeToolbars: function (options) {
      options = options || {};
      this.tabsSelector = $(this.$el.find('.tab-links .tab-links-bar')[0]).find('> ul li');
      this.tablinksToolbar = $(this.$el.find('.tab-links .tab-links-bar')[0]);

      var tooltip;
      this.leftToolbar = $(this.$el.find('.tab-links .left-toolbar')[0]);
      if (this.leftToolbar && this.leftToolbar.find('>div.goto_previous_div').length === 0) {
        tooltip = options.gotoPreviousTooltip || lang.gotoPreviousTooltip;
        this.leftToolbar.append(
            "<div class='goto_previous_div' title='" + tooltip +
            "'><span class='icon goto_previous_page'></span></div>"
        );
        this.gotoPreviousPage = $(this.$el.find('.tab-links .goto_previous_div')[0]);
        this.gotoPreviousPage.on('click', _.bind(this._gotoPreviousTabClick, this));
      }
      this._hideLeftToolbar();

      this.rightToolbar = $(this.$el.find('.tab-links .right-toolbar')[0]);
      if (this.rightToolbar && this.rightToolbar.find('>div.goto_next_div').length === 0) {
        tooltip = options.gotoNextTooltip || lang.gotoNextTooltip;
        this.rightToolbar.append(
            "<div class='goto_next_div' title='" + tooltip +
            "'><span class='icon goto_next_page'></span></div>"
        );
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
        this.gotoNextPage.on('click', _.bind(this._gotoNextTabClick, this));
      } else {
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
      }
      this.gotoNextPage && this.gotoNextPage.hide();
    },

    _listenToTabEvent: function () {
      var i;
      var tabs = this.$el.find(this.tabsSelector);
      for (i = 0; i < tabs.length; i++) {
        this._listenToTabIdEvent(i, tabs);
      }
    },

    _listenToTabIdEvent: function (index, iTabs) {
      var self = this;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;

      $(tabs[index]).off('activate.binf.scrollspy')
          .on('activate.binf.scrollspy', function () {
            var tabID    = $(this).find('a').attr('href'),
                tabIndex = 0;
            if (tabID) {
              tabID[0] === '#' && (tabID = tabID.substr(1));
              tabIndex = self._findTabIndexByID(tabID);
              if (!!self.tabContentHeader) {
                var newTabHeaderText = $(tabs).parent().find(
                    "li.binf-active .cs-tablink-text").html(),
                    pubsubPostFix    = (self.options.node instanceof VersionModel ? 'v' : 'p') +
                                       self.options.node.get('id'),
                    objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                       pubsubPostFix;

                PubSub.trigger(objPubSubId, newTabHeaderText);
              }
            }
            // remove aria-selected on the previous tabLink and set it on the active tabLink
            tabs.removeAttr('aria-selected');
            $(tabs[index]).attr('aria-selected', 'true');
            // skip scrolling for faster performance
            if (self.activatingTab === true || self.skipAutoScroll === true ||
                (self.scrollspyActivatingTab === true && self.scrollspyActivatingTabId ===
                 tabIndex)) {
              return;
            }
            if (tabID) {
              if (tabIndex >= 0 && !self._isTablinkVisibleInParents($(tabs[tabIndex]))) {
                // while scrolling, skip extra scrollspy events on the same tab
                self.scrollspyActivatingTab = true;
                self.scrollspyActivatingTabId = tabIndex;
                self._autoScrollTabTo(tabIndex)
                    .done(function () {
                      self.scrollspyActivatingTab = false;
                      self.scrollspyActivatingTabId = -1;
                    });
              }
            }
          });
    },

    _beginTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          // as soon as see first visible tab, there is no beginning hidden tab
          if (tabVisible) {
            break;
          }
          // tab is not visible and must not be hidden by the 'Only required fields' switch
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _trailingTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          // as soon as see first visible tab, there is no trailing hidden tab
          if (tabVisible) {
            break;
          }
          // tab is not visible and must not be hidden by the 'Only required fields' switch
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _findTabIndexByID: function (tabID) {
      var tabIndex = -1;
      var tabs = this.$el.find(this.tabsSelector);
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var href = $(tabs[i]).find('>a').attr('href');
          href[0] === '#' && (href = href.substr(1));
          if (tabID === href) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _firstVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _lastVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _showLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.show();
      this.tablinksToolbar && this.tablinksToolbar.addClass("with-left-toolbar");
    },

    _hideLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.hide();
      this.tablinksToolbar && this.tablinksToolbar.removeClass("with-left-toolbar");
    },

    _hideTabLinkByRequiredSwitch: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.addClass('binf-hidden hidden-by-switch');
        this._hideTab($tab);
        // keyboard navigation support
        $tab.find('a').attr('data-cstabindex', '-1');
        var tabDeleteIcon = $tab.find('.cs-delete-icon');
        if (tabDeleteIcon.attr('data-cstabindex') !== undefined) {
          tabDeleteIcon.attr('data-cstabindex', '-1');
        }
      }
    },

    _showTabLinkByRequiredSwitch: function ($tab, removeable) {
      if ($tab && $tab instanceof $) {
        $tab.removeClass('binf-hidden hidden-by-switch');
        this._showTab($tab);
        // keyboard navigation support
        $tab.find('a').removeAttr('data-cstabindex');
        removeable === true && $tab.find('.cs-delete-icon').attr('data-cstabindex', '0');
      }
    },

    _hideTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'clip');
        $tab.hide();
      }
    },

    _showTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'ellipsis');
        $tab.show();
      }
    },

    _showLastTab: function (iTabs) {
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      var i;
      for (i = tabs.length - 1; i >= 0; i--) {
        var $tab = $(tabs[i]);
        if (!this._isTablinkVisibleInParents($tab) && !($tab.hasClass('hidden-by-switch'))) {
          this._showTab($tab);
          break;
        }
      }
    },

    _enableToolbarState: function (iTabs) {
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        this._beginTabHidden(tabs) ? this._showLeftToolbar() : this._hideLeftToolbar();
        this.gotoNextPage && this.gotoNextPage.toggle(this._trailingTabHidden(tabs));
      }
    },

    _gotoPreviousTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      this._gotoPreviousTab({event: event});
    },

    _gotoNextTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      var deferred = $.Deferred();
      var tabs = this.$el.find(this.tabsSelector);
      var visibleIndex = this._lastVisibleTabIndex(tabs);

      // scroll until the next tab is visible (sometimes 2 or more tabs)
      if (visibleIndex >= 0 && visibleIndex < tabs.length) {
        // find the next hidden tab (exclude the ones hidden by 'See required only' switch)
        var i, nextIndex = -1;
        for (i = visibleIndex + 1; i < tabs.length; i++) {
          var $tab = $(tabs[i]);
          if (!($tab.hasClass('hidden-by-switch')) && !this._isTablinkVisibleInParents($tab)) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex >= 0 && nextIndex < tabs.length) {
          return this._gotoNextTab({tabs: tabs, visibleTabIndex: nextIndex});
        }
      }
      return $.Deferred().resolve();
    },

    // Params:
    // - options <object>: {
    //     event <event>: optional event
    //     tabs <elements>: optional tabs for performance without lookup
    //     visibleTabIndex <integer>: optional for the tab index to scroll until it is visible
    //     deferred <jQuery Deferred>: optional for asynchronous
    //     animationOff <boolean>: true/false
    //   }
    // Return: jQuery Deferred
    _gotoPreviousTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.$el.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        // find the visible tab
        var $tab2 = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab2)) {
          if (i === 0) {
            this._hideLeftToolbar();
          }

          // find the previous hidden tab (exclude the ones hidden by 'See required only' switch)
          var j;
          for (j = i - 1; j >= 0; j--) {
            var $tab1 = $(tabs[j]);
            if ($tab1 && !this._isTablinkVisibleInParents($tab1) &&
                !($tab1.hasClass('hidden-by-switch'))) {
              // find the real width to animate
              $tab1.css('visibility', 'binf-hidden');
              $tab1.css('width', '');
              $tab1.show();
              var width = $tab1.width();
              $tab1.css('text-overflow', 'clip');
              $tab1.width(0);
              $tab1.css('visibility', '');

              defBeingHandled = true;
              var duration = options.animationOff === true ? 0 : 'fast';
              $tab1.animate({"width": "+=" + width}, duration,
                  _.bind(function () {
                    $tab1.css('width', '');
                    $tab1.css('text-overflow', 'ellipsis');
                    var recurse = false;
                    if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                        visibleTabIndex <= lastTabIndex) {
                      if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                        recurse = true;
                      }
                    }
                    if (recurse) {
                      var opts = {tabs: tabs, deferred: deferred};
                      options.event && (opts.event = options.event);
                      (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                      (options.animationOff !== undefined) &&
                      (opts.animationOff = options.animationOff);
                      this._gotoPreviousTab(opts);
                    } else {
                      this._enableToolbarState(tabs);
                      this.autoScrollingLastTab = false;
                      deferred.resolve();
                    }
                  }, this));

              break;  // j loop
            }
          }
          break;  // i loop
        }
        // exception case when there is no visible tab found: show the last tab
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },

    // Params:
    // - options <object>: {
    //     event <event>: optional event
    //     tabs <elements>: optional tabs for performance without lookup
    //     visibleTabIndex <integer>: optional for the tab index to scroll until it is visible
    //     deferred <jQuery Deferred>: optional for asynchronous
    //     animationOff <boolean>: true/false
    //   }
    // Return: jQuery Deferred
    _gotoNextTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.$el.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        var $tab = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab)) {
          if (this.leftToolbar.is(':hidden')) {
            this._showLeftToolbar();
          }

          if ($tab) {
            defBeingHandled = true;
            var duration = options.animationOff === true ? 0 : 'fast';
            $tab.animate({"width": "-=" + $tab.width()}, duration,
                _.bind(function () {
                  $tab.hide();
                  $tab.css('width', '');
                  var recurse = false;
                  if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                      visibleTabIndex <= lastTabIndex) {
                    if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                      recurse = true;
                    }
                  }
                  if (recurse) {
                    var opts = {tabs: tabs, deferred: deferred};
                    options.event && (opts.event = options.event);
                    (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                    (options.animationOff !== undefined) &&
                    (opts.animationOff = options.animationOff);
                    this._gotoNextTab(opts);
                  } else {
                    this._enableToolbarState(tabs);
                    this.autoScrollingLastTab = false;
                    deferred.resolve();
                  }
                }, this));
          }
          break;
        }
        // exception case when there is no visible tab found: show the last tab
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },

    _autoScrollLastTab: function () {
      this.autoScrollingLastTab = true;
      var tabs = this.$el.find(this.tabsSelector);
      var deferred = this._gotoNextTab({tabs: tabs, visibleTabIndex: tabs.length - 1});
      deferred.done(_.bind(function () {
        this.autoScrollingLastTab = false;
      }, this));
      return deferred;
    },

    _autoScrollFirstTabAsync: function ($tab0, tabs, iteration, iDeferred) {
      var iter = iteration === undefined ? 0 : iteration;
      if (iter < 0 && iter >= tabs.length) {
        if (iDeferred) {
          iDeferred.resolve();
          return;
        } else {
          return $.Deferred().resolve();
        }
      }

      var deferred = iDeferred ? iDeferred : $.Deferred();
      this._gotoPreviousTab({tabs: tabs}).done(_.bind(function () {
        if (this._isTablinkVisibleInParents($tab0)) {
          deferred.resolve();
        } else {
          iter++;
          this._autoScrollFirstTabAsync($tab0, tabs, iter, deferred);
        }
      }, this));

      if (iDeferred === undefined) {
        return deferred;
      }
    },

    _autoScrollFirstTab: function () {
      var deferred = $.Deferred();
      this.autoScrollingLastTab = true;
      var tabs = this.$el.find(this.tabsSelector);
      var $tab0 = $(tabs[0]);
      if (!this._isTablinkVisibleInParents($tab0) && tabs.length > 0) {
        this._autoScrollFirstTabAsync($tab0, tabs).done(_.bind(function () {
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }, this));
      } else {
        this.autoScrollingLastTab = false;
      }
      return deferred.promise();
    },

    _autoScrollTabTo: function (index, options) {
      options || (options = {});
      var tabs = this.$el.find(this.tabsSelector);
      var scrollOptions = _.extend({visibleTabIndex: index}, options, {tabs: tabs});
      var firstVisibleIndex = this._firstVisibleTabIndex(tabs);
      var lastVisibleIndex = this._lastVisibleTabIndex(tabs);

      if (firstVisibleIndex >= 0 && firstVisibleIndex < tabs.length &&
          lastVisibleIndex >= 0 && lastVisibleIndex < tabs.length &&
          index >= 0 && index < tabs.length) {
        this.autoScrollingLastTab = true;
        var deferred;
        if (index < firstVisibleIndex) {
          deferred = this._gotoPreviousTab(scrollOptions);
        } else if (index > lastVisibleIndex) {
          deferred = this._gotoNextTab(scrollOptions);
        } else {
          this.autoScrollingLastTab = false;
          return $.Deferred().resolve();
        }
        deferred.done(_.bind(function () {
          this.autoScrollingLastTab = false;
        }, this));
        return deferred;
      } else {
        return $.Deferred().resolve();
      }
    },

    _autoScrolling: function () {
      if (this.autoScrollingLastTab || this.activatingTab === true ||
          this.skipAutoScroll === true) {
        return $.Deferred().resolve();
      }

      var i, iActive = -1;
      var tabs = this.$el.find(this.tabsSelector);
      var tabHidden = false;
      for (i = 0; i < tabs.length; i++) {
        var $tab = $(tabs[i]);
        if (iActive === -1 && $tab.hasClass('binf-active')) {
          if (this._isTablinkVisibleInParents($tab) === false) {
            tabHidden = true;
          }
          iActive = i;
          break;
        }
      }

      if (tabHidden) {
        return this._autoScrollTabTo(iActive);
      }
      return $.Deferred().resolve();
    }

  };

  return TabLinksScrollMixin;

});


/* START_TEMPLATE */
csui.define('hbs!csui/dialogs/modal.alert/impl/modal.alert',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  class=\"binf-modal-dialog binf-modal-"
    + this.escapeExpression(((helper = (helper = helpers.dialogSize || (depth0 != null ? depth0.dialogSize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dialogSize","hash":{}}) : helper)))
    + "\"\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  class=\"binf-modal-dialog\"\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "       aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgTitleId || (depth0 != null ? depth0.dlgTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgTitleId","hash":{}}) : helper)))
    + "\"\r\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "       aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgMsgId || (depth0 != null ? depth0.dlgMsgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgMsgId","hash":{}}) : helper)))
    + "\"\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div class=\"binf-modal-header "
    + this.escapeExpression(((helper = (helper = helpers.headerClass || (depth0 != null ? depth0.headerClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerClass","hash":{}}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitleCloseButton : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <h4 class=\"binf-modal-title\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitleIcon : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <span class=\"title-text\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgTitleId || (depth0 != null ? depth0.dlgTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgTitleId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n        </h4>\r\n      </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "          <button type=\"button\" class=\"binf-close\" data-binf-dismiss=\"modal\"\r\n                  aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeButtonAria || (depth0 != null ? depth0.closeButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeButtonAria","hash":{}}) : helper)))
    + "\" tabindex=\"0\">\r\n            <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.titleCloseIcon || (depth0 != null ? depth0.titleCloseIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleCloseIcon","hash":{}}) : helper)))
    + "\"></span>\r\n          </button>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "            <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.titleIcon || (depth0 != null ? depth0.titleIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleIcon","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"binf-modal-body\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.dlgMsgId || (depth0 != null ? depth0.dlgMsgId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dlgMsgId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</div>\r\n";
},"16":function(depth0,helpers,partials,data) {
    return "    <div class=\"binf-modal-footer\">\r\n";
},"18":function(depth0,helpers,partials,data) {
    return "    <div class=\"binf-modal-footer csui-no-body\">\r\n";
},"20":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"binf-btn binf-btn-primary csui-yes csui-default\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelYes : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelYes : stack1), depth0))
    + "</button>\r\n";
},"22":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"binf-btn binf-btn-default csui-no\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelNo : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelNo : stack1), depth0))
    + "</button>\r\n";
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button class=\"binf-btn binf-btn-default csui-cancel\" tabindex=\"0\"\r\n              data-binf-dismiss=\"modal\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelCancel : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.labelCancel : stack1), depth0))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div role=\"alertdialog\"\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.dialogSize : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showHeader : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n  <div class=\"binf-modal-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showHeader : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.program(18, data, 0)})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showYes : stack1),{"name":"if","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showNo : stack1),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.showCancel : stack1),{"name":"if","hash":{},"fn":this.program(24, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n  </div>\r\n  </div>\r\n\r\n";
}});
Handlebars.registerPartial('csui_dialogs_modal.alert_impl_modal.alert', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/dialogs/modal.alert/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/dialogs/modal.alert/impl/nls/root/lang',{
  YesButtonLabel: "Yes",
  NoButtonLabel: "No",
  OkButtonLabel: "OK",
  CancelButtonLabel: "Cancel",
  CloseButtonLabel: "Close",
  CloseButtonAria: "Close dialog",
  DefaultWarningTitle: "Warning",
  DefaultInfoTitle: "Information",
  DefaultErrorTitle: "Error",
  DefaultSuccessTitle: "Success",
  DefaultMessageTitle: "Message",
  DefaultQuestionTitle: "Question"
});



csui.define('css!csui/dialogs/modal.alert/impl/modal.alert',[],function(){});
csui.define('csui/dialogs/modal.alert/modal.alert',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'hbs!csui/dialogs/modal.alert/impl/modal.alert',
  'i18n!csui/dialogs/modal.alert/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/lib/binf/js/binf',
  'css!csui/dialogs/modal.alert/impl/modal.alert',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (module, _, $, Marionette, log, base, template, lang, TabKeyBehavior) {

  log = log(module.id);

  var ModalAlertView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-alert cs-dialog binf-modal binf-fade';
      if (this.options.modalClass) {
        className += ' ' + this.options.modalClass;
      }
      return className;
    },

    template: template,

    ui: {
      defaultButton: '.binf-modal-footer > .csui-default'
    },

    triggers: {
      'click .csui-yes': 'click:yes',
      'click .csui-no': 'click:no'
    },

    events: {
      'shown.binf.modal': 'onShown',
      'hide.binf.modal': 'onHiding',
      'hidden.binf.modal': 'onHidden',
      'keydown': 'onKeyDown'
    },
    behaviors: {
      TabKeyBehavior: {
        behaviorClass: TabKeyBehavior,
        recursiveNavigation: true
      }
    },

    constructor: function ModalAlertView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      options = this.options;
      // Make keys like 'labelYes' from 'Yes' to be able to merge them into options.buttons
      var buttonLabels = _.reduce(ModalAlertView.buttonLabels, function (result, value, key) {
        result['label' + key] = value;
        return result;
      }, {});
      // Show just the close button if no buttons were specified; ensure all button labels
      options.buttons = _.defaults({}, _.isEmpty(options.buttons) ?
                                       ModalAlertView.buttons.Close :
                                       options.buttons, buttonLabels);
      // Show an information alert if no styling was specified
      _.defaults(options, ModalAlertView.defaultOptions.Information, {
        // Center vertically by default
        centerVertically: true,
        // If an empty title was provided, turn off the dialog header
        showHeader: options.title !== ''
      });
      this._deferred = $.Deferred();
    },

    templateHelpers: function () {
      var templateVals = _(this.options).clone();
      templateVals.dlgTitleId = _.uniqueId('dlgTitle'); //
      templateVals.dlgMsgId = _.uniqueId('dlgMsg');
      return templateVals;
    },

    show: function () {
      this.render();
      this.$el.attr('tabindex', 0);
      if (this.options.centerVertically) {
        this.centerVertically();
      }
      this.$el.binf_modal('show');
      this.triggerMethod('show');
      var promise = this._deferred.promise(),
          self    = this;
      // TODO: Added only for testing purposes.  How to make modal alert
      // testable without this on the public interface?
      promise.close = function () {
        self.$el.binf_modal('hide');
        return promise;
      };
      return promise;
    },

    centerVertically: function () {
      var $clone;
      var top;

      // add clone of modalAlert to document
      $clone = this.$el.clone();
      $clone.css('display', 'block');
      $clone.appendTo($.fn.binf_modal.getDefaultContainer());

      // calculate top of centered position
      top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
      top = top > 0 ? top : 0;

      $clone.remove();

      // set top of modalAlert
      this.$el.find('.binf-modal-content').css("margin-top", top);
    },

    onShown: function () {
      this._deferred.notify({state: 'shown'});
      this._setTabFocus(false);
    },

    onHiding: function () {
      this._deferred.notify({state: 'hiding'});
    },

    onHidden: function (event) {
      this.destroy();
      // Trigger callbacks and promises when the hiding animation ended
      if (this.options.callback) {
        this.options.callback(this._result);
      }
      if (this._result) {
        this._deferred.resolve(this._result);
      } else {
        this._deferred.reject(this._result);
      }
    },

    onKeyDown: function (event) {
      var keyCode = event.keyCode;
      switch (keyCode) {
      case 13:
        // Click the default button by Enter if no sub-control is focused
        if (event.target === this.el) {
          this.ui.defaultButton.click();
        }
        else {
          $(event.target).click();
        }
        break;
          //Tab
      case 9:
        return this._setTabFocus(event.shiftKey);
      }
    },

    onClickYes: function () {
      this._result = true;
    },

    onClickNo: function () {
      this._result = false;
    },
    _setTabFocus: function (tabShift) {
      var tabElements = this.$('*[tabindex=0]'),
          lastIndex   = tabElements.length - 1,
          i           = this._getStartIndex(lastIndex, tabShift, tabElements);
      if (lastIndex > -1) {
        var activeIndex = ( this.activeIndex !== undefined ) ? this.activeIndex :
                          (tabShift ? 0 : lastIndex);
        do {
          var $tabElem = $(tabElements[i]);
          if (base.isVisibleInWindowViewport($tabElem)) {
            this.activeIndex = i;
            $tabElem.focus();
            break;
          }
          if (tabShift) {
            i = (i === 0) ? lastIndex : i - 1;
          }
          else {
            i = ( i === lastIndex) ? 0 : i + 1;
          }
        }
        while (i != activeIndex);
      }
      return false;
    },
    _getStartIndex: function (lastIndex, tabShift) {
      var startIndex  = 0,
          activeIndex = this.activeIndex;
      if (tabShift) {
        startIndex = lastIndex;
        if (activeIndex !== undefined && activeIndex > 0) {
          startIndex = this.activeIndex - 1;
        }
      }
      else {
        if (activeIndex !== undefined && activeIndex < lastIndex) {
          startIndex = activeIndex + 1;
        }
      }
      return startIndex;
    }

  }, {

    defaultOptions: {
      Success: {
        title: lang.DefaultSuccessTitle,
        titleIcon: 'csui-icon-notification-success-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'success-header'
      },
      Information: {
        title: lang.DefaultInfoTitle,
        titleIcon: 'csui-icon-notification-information-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'info-header'
      },
      Warning: {
        title: lang.DefaultWarningTitle,
        titleIcon: 'csui-icon-notification-warning-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'warning-header'
      },
      Error: {
        title: lang.DefaultErrorTitle,
        titleIcon: 'csui-icon-notification-error-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'error-header'
      },
      Message: {
        title: lang.DefaultMessageTitle,
        titleIcon: '',
        showTitleIcon: false,
        titleCloseIcon: 'csui-icon-dismiss',
        showTitleCloseButton: false,
        headerClass: 'message-header'
      },
      Question: {
        title: lang.DefaultQuestionTitle,
        titleIcon: 'csui-icon-notification-confirmation-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'question-header'
      }
    },

    buttons: {
      YesNoCancel: {
        showYes: true,
        showNo: true,
        showCancel: true
      },
      YesNo: {
        showYes: true,
        showNo: true,
        showCancel: false
      },
      OkCancel: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: true
      },
      Ok: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: false
      },
      Cancel: {
        showYes: false,
        showNo: false,
        showCancel: true
      },
      Close: {
        showYes: false,
        showNo: false,
        showCancel: true,
        labelCancel: lang.CloseButtonLabel
      }
    },

    buttonLabels: {
      Yes: lang.YesButtonLabel,
      No: lang.NoButtonLabel,
      Ok: lang.OkButtonLabel,
      Cancel: lang.CancelButtonLabel,
      Close: lang.CloseButtonLabel
    },

    showSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showInfo: function (callback, message, title, options) {
      // log.warn('The method \'showInfo\' has been deprecated and will be removed.' +
      //          '  Use \'showInformation\' instead.') && console.warn(log.last);
      // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      this.showInformation.apply(this, arguments);
    },

    showInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    confirmSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmInfo: function (callback, message, title, options) {
      // FIXME: Remove this method.
      log.warn('The method \'configInfo\' has been deprecated and will be removed.' +
               '  Use \'configInformation\' instead.') && console.warn(log.last);
      log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      this.confirmInformation.apply(this, arguments);
    },

    confirmInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmQuestion: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Question,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    _makeOptions: function (parameters, defaultOptions, defaultButtons) {
      var callback = parameters[0],
          message  = parameters[1],
          title    = parameters[2],
          options  = parameters[3];
      // If callback was not provided as the first parameter, shift the others
      if (typeof callback !== 'function') {
        options = title;
        title = message;
        message = callback;
        callback = undefined;
      }
      if (typeof message === 'object') {
        // If only options object was passed in, use it
        options = _.clone(message);
      } else if (typeof title === 'object') {
        // If options object was passed in after the message, use it
        options = _.defaults({message: message}, title);
      } else {
        // If options object was passed in after the message and title, use it
        options = _.defaults({
          message: message,
          title: title
        }, options);
      }
      options.buttons = _.defaults({}, options.buttons, defaultButtons);
      options.callback = callback;
      defaultOptions.closeButtonAria = lang.CloseButtonAria;
      return _.defaults(options, defaultOptions);
    },

    _show: function (options) {
      var alert = new ModalAlertView(options);
      return alert.show();
    }

  });

  return ModalAlertView;

});

/*! jQuery Mockjax
 * A Plugin providing simple and flexible mocking of ajax requests and responses
 * 
 * Version: 2.2.1
 * Home: https://github.com/jakerella/jquery-mockjax
 * Copyright (c) 2016 Jordan Kasper, formerly appendTo;
 * NOTE: This repository was taken over by Jordan Kasper (@jakerella) October, 2014
 * 
 * Dual licensed under the MIT or GPL licenses.
 * http://opensource.org/licenses/MIT OR http://www.gnu.org/licenses/gpl-2.0.html
 */

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file
// * Use requirejs module settings for initialization
// * Add publishHandlers temporarily for compatibility

// [OT] Declare a csui module
csui.define('csui/lib/jquery.mockjax',['module', 'csui/lib/jquery'], function(module, $) {
	'use strict';

	var _ajax = $.ajax,
		mockHandlers = [],
		mockedAjaxCalls = [],
		unmockedAjaxCalls = [],
		CALLBACK_REGEX = /=\?(&|$)/,
		jsc = (new Date()).getTime(),
		DEFAULT_RESPONSE_TIME = 500;

	// Parse the given XML string.
	function parseXML(xml) {
		if ( window.DOMParser === undefined && window.ActiveXObject ) {
			window.DOMParser = function() { };
			DOMParser.prototype.parseFromString = function( xmlString ) {
				var doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML( xmlString );
				return doc;
			};
		}

		try {
			var xmlDoc = ( new DOMParser() ).parseFromString( xml, 'text/xml' );
			if ( $.isXMLDoc( xmlDoc ) ) {
				var err = $('parsererror', xmlDoc);
				if ( err.length === 1 ) {
					throw new Error('Error: ' + $(xmlDoc).text() );
				}
			} else {
				throw new Error('Unable to parse XML');
			}
			return xmlDoc;
		} catch( e ) {
			var msg = ( e.name === undefined ? e : e.name + ': ' + e.message );
			$(document).trigger('xmlParseError', [ msg ]);
			return undefined;
		}
	}

	// Check if the data field on the mock handler and the request match. This
	// can be used to restrict a mock handler to being used only when a certain
	// set of data is passed to it.
	function isMockDataEqual( mock, live ) {
		logger.debug( mock, ['Checking mock data against request data', mock, live] );
		var identical = true;

		if ( $.isFunction(mock) ) {
			return !!mock(live);
		}

		// Test for situations where the data is a querystring (not an object)
		if (typeof live === 'string') {
			// Querystring may be a regex
			if ($.isFunction( mock.test )) {
				return mock.test(live);
			} else if (typeof mock === 'object') {
				live = getQueryParams(live);
			} else {
				return mock === live;
			}
		}

		$.each(mock, function(k) {
			if ( live[k] === undefined ) {
				identical = false;
				return identical;
			} else {
				if ( typeof live[k] === 'object' && live[k] !== null ) {
					if ( identical && $.isArray( live[k] ) ) {
						identical = $.isArray( mock[k] ) && live[k].length === mock[k].length;
					}
					identical = identical && isMockDataEqual(mock[k], live[k]);
				} else {
					if ( mock[k] && $.isFunction( mock[k].test ) ) {
						identical = identical && mock[k].test(live[k]);
					} else {
						identical = identical && ( mock[k] === live[k] );
					}
				}
			}
		});

		return identical;
	}

	function getQueryParams(queryString) {
		var i, l, param, tmp,
			paramsObj = {},
			params = String(queryString).split(/&/);

		for (i=0, l=params.length; i<l; ++i) {
			param = params[i];
			try {
				param = decodeURIComponent(param.replace(/\+/g, ' '));
				param = param.split(/=/);
			} catch(e) {
				// Can't parse this one, so let it go?
				continue;
			}

			if (paramsObj[param[0]]) {
				// this is an array query param (more than one entry in query)
				if (!paramsObj[param[0]].splice) {
					// if not already an array, make it one
					tmp = paramsObj[param[0]];
					paramsObj[param[0]] = [];
					paramsObj[param[0]].push(tmp);
				}
				paramsObj[param[0]].push(param[1]);
			} else {
				paramsObj[param[0]] = param[1];
			}
		}

		logger.debug( null, ['Getting query params from string', queryString, paramsObj] );

		return paramsObj;
	}

	// See if a mock handler property matches the default settings
	function isDefaultSetting(handler, property) {
		return handler[property] === $.mockjaxSettings[property];
	}

	// Check the given handler should mock the given request
	function getMockForRequest( handler, requestSettings ) {
		// If the mock was registered with a function, let the function decide if we
		// want to mock this request
		if ( $.isFunction(handler) ) {
			return handler( requestSettings );
		}

		// Inspect the URL of the request and check if the mock handler's url
		// matches the url for this ajax request
		if ( $.isFunction(handler.url.test) ) {
			// The user provided a regex for the url, test it
			if ( !handler.url.test( requestSettings.url ) ) {
				return null;
			}
		} else {

			// Apply namespace prefix to the mock handler's url.
			var namespace = handler.namespace || $.mockjaxSettings.namespace;
			if (!!namespace) {
				var namespacedUrl = [namespace, handler.url].join('/');
				namespacedUrl = namespacedUrl.replace(/(\/+)/g, '/');
				handler.url = namespacedUrl;
			}

			// Look for a simple wildcard '*' or a direct URL match
			var star = handler.url.indexOf('*');
			if (handler.url !== requestSettings.url && star === -1 ||
					!new RegExp(handler.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.+')).test(requestSettings.url)) {
				return null;
			}
		}

		// Inspect the request headers submitted
		if ( handler.requestHeaders ) {
			//No expectation for headers, do not mock this request
			if (requestSettings.headers === undefined) {
				return null;
			} else {
				var headersMismatch = false;
				$.each(handler.requestHeaders, function(key, value) {
					var v = requestSettings.headers[key];
					if(v !== value) {
						headersMismatch = true;
						return false;
					}
				});
				//Headers do not match, do not mock this request
				if (headersMismatch) {
					return null;
				}
			}
		}

		// Inspect the data submitted in the request (either POST body or GET query string)
		if ( handler.data ) {
			if ( !requestSettings.data || !isMockDataEqual(handler.data, requestSettings.data) ) {
				// They're not identical, do not mock this request
				return null;
			}
		}
		// Inspect the request type
		if ( handler && handler.type &&
				handler.type.toLowerCase() !== requestSettings.type.toLowerCase() ) {
			// The request type doesn't match (GET vs. POST)
			return null;
		}

		return handler;
	}

	function isPosNum(value) {
		return typeof value === 'number' && value >= 0;
	}

	function parseResponseTimeOpt(responseTime) {
		if ($.isArray(responseTime) && responseTime.length === 2) {
			var min = responseTime[0];
			var max = responseTime[1];
			if(isPosNum(min) && isPosNum(max)) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
		} else if(isPosNum(responseTime)) {
			return responseTime;
		}
		return DEFAULT_RESPONSE_TIME;
	}

	// Process the xhr objects send operation
	function _xhrSend(mockHandler, requestSettings, origSettings) {
		logger.debug( mockHandler, ['Sending fake XHR request', mockHandler, requestSettings, origSettings] );

		// This is a substitute for < 1.4 which lacks $.proxy
		var process = (function(that) {
			return function() {
				return (function() {
					// The request has returned
					this.status = mockHandler.status;
					this.statusText = mockHandler.statusText;
					this.readyState	= 1;

					var finishRequest = function () {
						this.readyState	= 4;

						var onReady;
						// Copy over our mock to our xhr object before passing control back to
						// jQuery's onreadystatechange callback
						if ( requestSettings.dataType === 'json' && ( typeof mockHandler.responseText === 'object' ) ) {
							this.responseText = JSON.stringify(mockHandler.responseText);
						} else if ( requestSettings.dataType === 'xml' ) {
							if ( typeof mockHandler.responseXML === 'string' ) {
								this.responseXML = parseXML(mockHandler.responseXML);
								//in jQuery 1.9.1+, responseXML is processed differently and relies on responseText
								this.responseText = mockHandler.responseXML;
							} else {
								this.responseXML = mockHandler.responseXML;
							}
						} else if (typeof mockHandler.responseText === 'object' && mockHandler.responseText !== null) {
							// since jQuery 1.9 responseText type has to match contentType
							mockHandler.contentType = 'application/json';
							this.responseText = JSON.stringify(mockHandler.responseText);
						} else {
							this.responseText = mockHandler.responseText;
						}
						if( typeof mockHandler.status === 'number' || typeof mockHandler.status === 'string' ) {
							this.status = mockHandler.status;
						}
						if( typeof mockHandler.statusText === 'string') {
							this.statusText = mockHandler.statusText;
						}
						// jQuery 2.0 renamed onreadystatechange to onload
						onReady = this.onload || this.onreadystatechange;

						// jQuery < 1.4 doesn't have onreadystate change for xhr
						if ( $.isFunction( onReady ) ) {
							if( mockHandler.isTimeout) {
								this.status = -1;
							}
							onReady.call( this, mockHandler.isTimeout ? 'timeout' : undefined );
						} else if ( mockHandler.isTimeout ) {
							// Fix for 1.3.2 timeout to keep success from firing.
							this.status = -1;
						}
					};

					// We have an executable function, call it to give
					// the mock handler a chance to update it's data
					if ( $.isFunction(mockHandler.response) ) {
						// Wait for it to finish
						if ( mockHandler.response.length === 2 ) {
							mockHandler.response(origSettings, function () {
								finishRequest.call(that);
							});
							return;
						} else {
							mockHandler.response(origSettings);
						}
					}

					finishRequest.call(that);
				}).apply(that);
			};
		})(this);

		if ( mockHandler.proxy ) {
			logger.info( mockHandler, ['Retrieving proxy file: ' + mockHandler.proxy, mockHandler] );
			// We're proxying this request and loading in an external file instead
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				async: requestSettings.async,
				dataType: requestSettings.dataType === 'script' ? 'text/plain' : requestSettings.dataType,
				complete: function(xhr) {
					// Fix for bug #105
					// jQuery will convert the text to XML for us, and if we use the actual responseXML here
					// then some other things don't happen, resulting in no data given to the 'success' cb
					mockHandler.responseXML = mockHandler.responseText = xhr.responseText;

					// Don't override the handler status/statusText if it's specified by the config
					if (isDefaultSetting(mockHandler, 'status')) {
						mockHandler.status = xhr.status;
					}
					if (isDefaultSetting(mockHandler, 'statusText')) {
						mockHandler.statusText = xhr.statusText;
					}

					if ( requestSettings.async === false ) {
						// TODO: Blocking delay
						process();
					} else {
						this.responseTimer = setTimeout(process, parseResponseTimeOpt(mockHandler.responseTime));
					}
				}
			});
		} else {
			// type === 'POST' || 'GET' || 'DELETE'
			if ( requestSettings.async === false ) {
				// TODO: Blocking delay
				process();
			} else {
				this.responseTimer = setTimeout(process, parseResponseTimeOpt(mockHandler.responseTime));
			}
		}

	}

	// Construct a mocked XHR Object
	function xhr(mockHandler, requestSettings, origSettings, origHandler) {
		logger.debug( mockHandler, ['Creating new mock XHR object', mockHandler, requestSettings, origSettings, origHandler] );

		// Extend with our default mockjax settings
		mockHandler = $.extend(true, {}, $.mockjaxSettings, mockHandler);

		if (typeof mockHandler.headers === 'undefined') {
			mockHandler.headers = {};
		}
		if (typeof requestSettings.headers === 'undefined') {
			requestSettings.headers = {};
		}
		if ( mockHandler.contentType ) {
			mockHandler.headers['content-type'] = mockHandler.contentType;
		}

		return {
			status: mockHandler.status,
			statusText: mockHandler.statusText,
			readyState: 1,
			open: function() { },
			send: function() {
				origHandler.fired = true;
				_xhrSend.call(this, mockHandler, requestSettings, origSettings);
			},
			abort: function() {
				clearTimeout(this.responseTimer);
			},
			setRequestHeader: function(header, value) {
				requestSettings.headers[header] = value;
			},
			getResponseHeader: function(header) {
				// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
				if ( mockHandler.headers && mockHandler.headers[header] ) {
					// Return arbitrary headers
					return mockHandler.headers[header];
				} else if ( header.toLowerCase() === 'last-modified' ) {
					return mockHandler.lastModified || (new Date()).toString();
				} else if ( header.toLowerCase() === 'etag' ) {
					return mockHandler.etag || '';
				} else if ( header.toLowerCase() === 'content-type' ) {
					return mockHandler.contentType || 'text/plain';
				}
			},
			getAllResponseHeaders: function() {
				var headers = '';
				// since jQuery 1.9 responseText type has to match contentType
				if (mockHandler.contentType) {
					mockHandler.headers['Content-Type'] = mockHandler.contentType;
				}
				$.each(mockHandler.headers, function(k, v) {
					headers += k + ': ' + v + '\n';
				});
				return headers;
			}
		};
	}

	// Process a JSONP mock request.
	function processJsonpMock( requestSettings, mockHandler, origSettings ) {
		// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
		// because there isn't an easy hook for the cross domain script tag of jsonp

		processJsonpUrl( requestSettings );

		requestSettings.dataType = 'json';
		if(requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
			createJsonpCallback(requestSettings, mockHandler, origSettings);

			// We need to make sure
			// that a JSONP style response is executed properly

			var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
				parts = rurl.exec( requestSettings.url ),
				remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

			requestSettings.dataType = 'script';
			if(requestSettings.type.toUpperCase() === 'GET' && remote ) {
				var newMockReturn = processJsonpRequest( requestSettings, mockHandler, origSettings );

				// Check if we are supposed to return a Deferred back to the mock call, or just
				// signal success
				if(newMockReturn) {
					return newMockReturn;
				} else {
					return true;
				}
			}
		}
		return null;
	}

	// Append the required callback parameter to the end of the request URL, for a JSONP request
	function processJsonpUrl( requestSettings ) {
		if ( requestSettings.type.toUpperCase() === 'GET' ) {
			if ( !CALLBACK_REGEX.test( requestSettings.url ) ) {
				requestSettings.url += (/\?/.test( requestSettings.url ) ? '&' : '?') +
					(requestSettings.jsonp || 'callback') + '=?';
			}
		} else if ( !requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data) ) {
			requestSettings.data = (requestSettings.data ? requestSettings.data + '&' : '') + (requestSettings.jsonp || 'callback') + '=?';
		}
	}

	// Process a JSONP request by evaluating the mocked response text
	function processJsonpRequest( requestSettings, mockHandler, origSettings ) {
		logger.debug( mockHandler, ['Performing JSONP request', mockHandler, requestSettings, origSettings] );

		// Synthesize the mock request for adding a script tag
		var callbackContext = origSettings && origSettings.context || requestSettings,
			// If we are running under jQuery 1.5+, return a deferred object
			newMock = ($.Deferred) ? (new $.Deferred()) : null;

		// If the response handler on the moock is a function, call it
		if ( mockHandler.response && $.isFunction(mockHandler.response) ) {

			mockHandler.response(origSettings);


		} else if ( typeof mockHandler.responseText === 'object' ) {
			// Evaluate the responseText javascript in a global context
			$.globalEval( '(' + JSON.stringify( mockHandler.responseText ) + ')');

		} else if (mockHandler.proxy) {
			logger.info( mockHandler, ['Performing JSONP proxy request: ' + mockHandler.proxy, mockHandler] );

			// This handles the unique case where we have a remote URL, but want to proxy the JSONP
			// response to another file (not the same URL as the mock matching)
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				dataType: requestSettings.dataType === 'script' ? 'text/plain' : requestSettings.dataType,
				complete: function(xhr) {
					$.globalEval( '(' + xhr.responseText + ')');
					completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock );
				}
			});

			return newMock;

		} else {
			$.globalEval( '(' +
				((typeof mockHandler.responseText === 'string') ?
					('"' + mockHandler.responseText + '"') : mockHandler.responseText) +
			')');
		}

		completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock );

		return newMock;
	}

	function completeJsonpCall( requestSettings, mockHandler, callbackContext, newMock ) {
		var json;

		// Successful response
		setTimeout(function() {
			jsonpSuccess( requestSettings, callbackContext, mockHandler );
			jsonpComplete( requestSettings, callbackContext );

			if ( newMock ) {
				try {
					json = $.parseJSON( mockHandler.responseText );
				} catch (err) { /* just checking... */ }

				newMock.resolveWith( callbackContext, [json || mockHandler.responseText] );
				logger.log( mockHandler, ['JSONP mock call complete', mockHandler, newMock] );
			}
		}, parseResponseTimeOpt( mockHandler.responseTime ));
	}


	// Create the required JSONP callback function for the request
	function createJsonpCallback( requestSettings, mockHandler, origSettings ) {
		var callbackContext = origSettings && origSettings.context || requestSettings;
		var jsonp = (typeof requestSettings.jsonpCallback === 'string' && requestSettings.jsonpCallback) || ('jsonp' + jsc++);

		// Replace the =? sequence both in the query string and the data
		if ( requestSettings.data ) {
			requestSettings.data = (requestSettings.data + '').replace(CALLBACK_REGEX, '=' + jsonp + '$1');
		}

		requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, '=' + jsonp + '$1');


		// Handle JSONP-style loading
		window[ jsonp ] = window[ jsonp ] || function() {
			jsonpSuccess( requestSettings, callbackContext, mockHandler );
			jsonpComplete( requestSettings, callbackContext );
			// Garbage collect
			window[ jsonp ] = undefined;

			try {
				delete window[ jsonp ];
			} catch(e) {}
		};
		requestSettings.jsonpCallback = jsonp;
	}

	// The JSONP request was successful
	function jsonpSuccess(requestSettings, callbackContext, mockHandler) {
		// If a local callback was specified, fire it and pass it the data
		if ( requestSettings.success ) {
			requestSettings.success.call( callbackContext, mockHandler.responseText || '', 'success', {} );
		}

		// Fire the global callback
		if ( requestSettings.global ) {
			(requestSettings.context ? $(requestSettings.context) : $.event).trigger('ajaxSuccess', [{}, requestSettings]);
		}
	}

	// The JSONP request was completed
	function jsonpComplete(requestSettings, callbackContext) {
		if ( requestSettings.complete ) {
			requestSettings.complete.call( callbackContext, {
				statusText: 'success',
				status: 200
			} , 'success' );
		}

		// The request was completed
		if ( requestSettings.global ) {
			(requestSettings.context ? $(requestSettings.context) : $.event).trigger('ajaxComplete', [{}, requestSettings]);
		}

		// Handle the global AJAX counter
		if ( requestSettings.global && ! --$.active ) {
			$.event.trigger( 'ajaxStop' );
		}
	}


	// The core $.ajax replacement.
	function handleAjax( url, origSettings ) {
		var mockRequest, requestSettings, mockHandler, overrideCallback;

		logger.debug( null, ['Ajax call intercepted', url, origSettings] );

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === 'object' ) {
			origSettings = url;
			url = undefined;
		} else {
			// work around to support 1.5 signature
			origSettings = origSettings || {};
			origSettings.url = url || origSettings.url;
		}

		// Extend the original settings for the request
		requestSettings = $.ajaxSetup({}, origSettings);
		requestSettings.type = requestSettings.method = requestSettings.method || requestSettings.type;

		// Generic function to override callback methods for use with
		// callback options (onAfterSuccess, onAfterError, onAfterComplete)
		overrideCallback = function(action, mockHandler) {
			var origHandler = origSettings[action.toLowerCase()];
			return function() {
				if ( $.isFunction(origHandler) ) {
					origHandler.apply(this, [].slice.call(arguments));
				}
				mockHandler['onAfter' + action]();
			};
		};

		// Iterate over our mock handlers (in registration order) until we find
		// one that is willing to intercept the request
		for(var k = 0; k < mockHandlers.length; k++) {
			if ( !mockHandlers[k] ) {
				continue;
			}

			mockHandler = getMockForRequest( mockHandlers[k], requestSettings );
			if(!mockHandler) {
				logger.debug( mockHandlers[k], ['Mock does not match request', url, requestSettings] );
				// No valid mock found for this request
				continue;
			}

			if ($.mockjaxSettings.retainAjaxCalls) {
				mockedAjaxCalls.push(requestSettings);
			}

			// If logging is enabled, log the mock to the console
			logger.info( mockHandler, [
				'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url,
				$.ajaxSetup({}, requestSettings)
			] );


			if ( requestSettings.dataType && requestSettings.dataType.toUpperCase() === 'JSONP' ) {
				if ((mockRequest = processJsonpMock( requestSettings, mockHandler, origSettings ))) {
					// This mock will handle the JSONP request
					return mockRequest;
				}
			}

			// We are mocking, so there will be no cross domain request, however, jQuery
			// aggressively pursues this if the domains don't match, so we need to
			// explicitly disallow it. (See #136)
			origSettings.crossDomain = false;

			// Removed to fix #54 - keep the mocking data object intact
			//mockHandler.data = requestSettings.data;

			mockHandler.cache = requestSettings.cache;
			mockHandler.timeout = requestSettings.timeout;
			mockHandler.global = requestSettings.global;

			// In the case of a timeout, we just need to ensure
			// an actual jQuery timeout (That is, our reponse won't)
			// return faster than the timeout setting.
			if ( mockHandler.isTimeout ) {
				if ( mockHandler.responseTime > 1 ) {
					origSettings.timeout = mockHandler.responseTime - 1;
				} else {
					mockHandler.responseTime = 2;
					origSettings.timeout = 1;
				}
			}

			// Set up onAfter[X] callback functions
			if ( $.isFunction( mockHandler.onAfterSuccess ) ) {
				origSettings.success = overrideCallback('Success', mockHandler);
			}
			if ( $.isFunction( mockHandler.onAfterError ) ) {
				origSettings.error = overrideCallback('Error', mockHandler);
			}
			if ( $.isFunction( mockHandler.onAfterComplete ) ) {
				origSettings.complete = overrideCallback('Complete', mockHandler);
			}

			copyUrlParameters(mockHandler, origSettings);

			/* jshint loopfunc:true */
			(function(mockHandler, requestSettings, origSettings, origHandler) {

				mockRequest = _ajax.call($, $.extend(true, {}, origSettings, {
					// Mock the XHR object
					xhr: function() { return xhr( mockHandler, requestSettings, origSettings, origHandler ); }
				}));
			})(mockHandler, requestSettings, origSettings, mockHandlers[k]);
			/* jshint loopfunc:false */

			return mockRequest;
		}

		// We don't have a mock request
		logger.log( null, ['No mock matched to request', url, origSettings] );
		if ($.mockjaxSettings.retainAjaxCalls) {
			unmockedAjaxCalls.push(origSettings);
		}
		if($.mockjaxSettings.throwUnmocked === true) {
			throw new Error('AJAX not mocked: ' + origSettings.url);
		}
		else { // trigger a normal request
			return _ajax.apply($, [origSettings]);
		}
	}

	/**
	* Copies URL parameter values if they were captured by a regular expression
	* @param {Object} mockHandler
	* @param {Object} origSettings
	*/
	function copyUrlParameters(mockHandler, origSettings) {
		//parameters aren't captured if the URL isn't a RegExp
		if (!(mockHandler.url instanceof RegExp)) {
			return;
		}
		//if no URL params were defined on the handler, don't attempt a capture
		if (!mockHandler.hasOwnProperty('urlParams')) {
			return;
		}
		var captures = mockHandler.url.exec(origSettings.url);
		//the whole RegExp match is always the first value in the capture results
		if (captures.length === 1) {
			return;
		}
		captures.shift();
		//use handler params as keys and capture resuts as values
		var i = 0,
		capturesLength = captures.length,
		paramsLength = mockHandler.urlParams.length,
		//in case the number of params specified is less than actual captures
		maxIterations = Math.min(capturesLength, paramsLength),
		paramValues = {};
		for (i; i < maxIterations; i++) {
			var key = mockHandler.urlParams[i];
			paramValues[key] = captures[i];
		}
		origSettings.urlParams = paramValues;
	}

	/**
	 * Clears handlers that mock given url
	 * @param url
	 * @returns {Array}
	 */
	function clearByUrl(url) {
		var i, len,
			handler,
			results = [],
			match=url instanceof RegExp ?
				function(testUrl) { return url.test(testUrl); } :
				function(testUrl) { return url === testUrl; };
		for (i=0, len=mockHandlers.length; i<len; i++) {
			handler = mockHandlers[i];
			if (!match(handler.url)) {
				results.push(handler);
			} else {
				logger.log( handler, [
					'Clearing mock: ' + (handler && handler.url),
					handler
				] );
			}
		}
		return results;
	}


	// Public

	$.extend({
		ajax: handleAjax
	});

	var logger = {
		_log: function logger( mockHandler, args, level ) {
			var loggerLevel = $.mockjaxSettings.logging;
			if (mockHandler && typeof mockHandler.logging !== 'undefined') {
				loggerLevel = mockHandler.logging;
			}
			level = ( level === 0 ) ? level : ( level || logLevels.LOG );
			args = (args.splice) ? args : [ args ];

			// Is logging turned off for this mock or mockjax as a whole?
			// Or is this log message above the desired log level?
			if ( loggerLevel === false || loggerLevel < level ) {
				return;
			}

			if ( $.mockjaxSettings.log ) {
				return $.mockjaxSettings.log( mockHandler, args[1] || args[0] );
			} else if ( $.mockjaxSettings.logger && $.mockjaxSettings.logger[$.mockjaxSettings.logLevelMethods[level]] ) {
				return $.mockjaxSettings.logger[$.mockjaxSettings.logLevelMethods[level]].apply( $.mockjaxSettings.logger, args );
			}
		},
		/**
		 * Convenience method for logging a DEBUG level message
		 * @param  {Object} m  The mock handler in question
		 * @param  {Array|String|Object} a  The items to log
		 * @return {?}  Will return whatever the $.mockjaxSettings.logger method for this level would return (generally 'undefined')
		 */
		debug: function(m,a) { return logger._log(m,a,logLevels.DEBUG); },
		/**
		 * @see logger.debug
		 */
		log: function(m,a) { return logger._log(m,a,logLevels.LOG); },
		/**
		 * @see logger.debug
		 */
		info: function(m,a) { return logger._log(m,a,logLevels.INFO); },
		/**
		 * @see logger.debug
		 */
		warn: function(m,a) { return logger._log(m,a,logLevels.WARN); },
		/**
		 * @see logger.debug
		 */
		error: function(m,a) { return logger._log(m,a,logLevels.ERROR); }
	};

	var logLevels = {
		DEBUG: 4,
		LOG: 3,
		INFO: 2,
		WARN: 1,
		ERROR: 0
	};

	/**
	 * Default settings for mockjax. Some of these are used for defaults of
	 * individual mock handlers, and some are for the library as a whole.
	 * For individual mock handler settings, please see the README on the repo:
	 * https://github.com/jakerella/jquery-mockjax#api-methods
	 *
	 * @type {Object}
	 */
	$.mockjaxSettings = {
		log:				null, // this is only here for historical purposes... use $.mockjaxSettings.logger
		logger:				window.console,
		logging:			2,
		logLevelMethods:	['error', 'warn', 'info', 'log', 'debug'],
		namespace:			null,
		status:				200,
		statusText:			'OK',
		responseTime:		DEFAULT_RESPONSE_TIME,
		isTimeout:			false,
		throwUnmocked:		false,
		retainAjaxCalls:	true,
		contentType:		'text/plain',
		response:			'',
		responseText:		'',
		responseXML:		'',
		proxy:				'',
		proxyType:			'GET',

		lastModified:		null,
		etag:				'',
		headers:			{
								etag: 'IJF@H#@923uf8023hFO@I#H#',
								'content-type' : 'text/plain'
							}
	};

	/**
	 * Create a new mock Ajax handler. When a mock handler is matched during a
	 * $.ajax() call this library will intercept that request and fake a response
	 * using the data and methods in the mock. You can see all settings in the
	 * README of the main repository:
	 * https://github.com/jakerella/jquery-mockjax#api-methods
	 *
	 * @param  {Object} settings The mock handelr settings: https://github.com/jakerella/jquery-mockjax#api-methods
	 * @return {Number}		  The id (index) of the mock handler suitable for clearing (see $.mockjax.clear())
	 */
	$.mockjax = function(settings) {
		// Multiple mocks.
		if ( $.isArray(settings) ) {
			return $.map(settings, function(s) {
				return $.mockjax(s);
			});
		}

		var i = mockHandlers.length;
		mockHandlers[i] = settings;
		logger.log( settings, ['Created new mock handler', settings] );
		return i;
	};

	$.mockjax._logger = logger;

	/**
	 * Remove an Ajax mock from those held in memory. This will prevent any
	 * future Ajax request mocking for matched requests.
	 * NOTE: Clearing a mock will not prevent the resolution of in progress requests
	 *
	 * @param  {Number|String|RegExp} i  OPTIONAL The mock to clear. If not provided, all mocks are cleared,
	 *                                   if a number it is the index in the in-memory cache. If a string or
	 *                                   RegExp, find a mock that matches that URL and clear it.
	 * @return {void}
	 */
	$.mockjax.clear = function(i) {
		if ( typeof i === 'string' || i instanceof RegExp) {
			mockHandlers = clearByUrl(i);
		} else if ( i || i === 0 ) {
			logger.log( mockHandlers[i], [
				'Clearing mock: ' + (mockHandlers[i] && mockHandlers[i].url),
				mockHandlers[i]
			] );
			mockHandlers[i] = null;
		} else {
			logger.log( null, 'Clearing all mocks' );
			mockHandlers = [];
		}
		mockedAjaxCalls = [];
		unmockedAjaxCalls = [];
	};

	/**
	 * By default all Ajax requests performed after loading Mockjax are recorded
	 * so that we can see which requests were mocked and which were not. This
	 * method allows the developer to clear those retained requests.
	 *
	 * @return {void}
	 */
	$.mockjax.clearRetainedAjaxCalls = function() {
		mockedAjaxCalls = [];
		unmockedAjaxCalls = [];
		logger.debug( null, 'Cleared retained ajax calls' );
	};

	/**
	 * Retrive the mock handler with the given id (index).
	 *
	 * @param  {Number} i  The id (index) to retrieve
	 * @return {Object}	The mock handler settings
	 */
	$.mockjax.handler = function(i) {
		if ( arguments.length === 1 ) {
			return mockHandlers[i];
		}
	};

	/**
	 * Retrieve all Ajax calls that have been mocked by this library during the
	 * current session (in other words, only since you last loaded this file).
	 *
	 * @return {Array}  The mocked Ajax calls (request settings)
	 */
	$.mockjax.mockedAjaxCalls = function() {
		return mockedAjaxCalls;
	};

	/**
	 * Return all mock handlers that have NOT been matched against Ajax requests
	 *
	 * @return {Array}  The mock handlers
	 */
	$.mockjax.unfiredHandlers = function() {
		var results = [];
		for (var i=0, len=mockHandlers.length; i<len; i++) {
			var handler = mockHandlers[i];
			if (handler !== null && !handler.fired) {
				results.push(handler);
			}
		}
		return results;
	};

	/**
	 * Retrieve all Ajax calls that have NOT been mocked by this library during
	 * the current session (in other words, only since you last loaded this file).
	 *
	 * @return {Array}  The mocked Ajax calls (request settings)
	 */
	$.mockjax.unmockedAjaxCalls = function() {
		return unmockedAjaxCalls;
	};

	// [OT] TODO: Remove this as soon as it is disused
	$.mockjax.publishHandlers = function(){
		for (var i=0, len=mockHandlers.length; i<len; i++) {
			var handler = mockHandlers[i];
			if (handler !== null) {
			 // var response = handler.response || handler.responseText;
			  var message = 'Handler ' + handler.name + ':\nurl' + handler.url;
			  console.log( message);
			}
		}
	};

	// [OT] Initialize mockjx using require.config module settings
	$.extend(true, $.mockjaxSettings, module.config().settings);

	return $.mockjax;

});

/*!
 * jQuery Simulate v0.0.1 - simulate browser mouse and keyboard events
 * https://github.com/jquery/jquery-simulate
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Sun Dec 9 12:15:33 2012 -0500
 */

csui.define('csui/lib/jquery.simulate',['module', 'csui/lib/jquery'
], function (module, jQuery) {


    ;
    (function ($, undefined) {
        "use strict";

        var rkeyEvent = /^key/,
            rmouseEvent = /^(?:mouse|contextmenu)|click/,
            rdocument = /\[object (?:HTML)?Document\]/;

        function isDocument(ele) {
            return rdocument.test(Object.prototype.toString.call(ele));
        }

        function windowOfDocument(doc) {
            for (var i = 0; i < window.frames.length; i += 1) {
                if (window.frames[i] && window.frames[i].document === doc) {
                    return window.frames[i];
                }
            }
            return window;
        }

        $.fn.simulate = function (type, options) {
            return this.each(function () {
                new $.simulate(this, type, options);
            });
        };

        $.simulate = function (elem, type, options) {
            var method = $.camelCase("simulate-" + type);

            this.target = elem;
            this.options = options || {};

            if (this[method]) {
                this[method]();
            } else {
                this.simulateEvent(elem, type, this.options);
            }
        };

        $.extend($.simulate, {

            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            },

            buttonCode: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            }
        });

        $.extend($.simulate.prototype, {

            simulateEvent: function (elem, type, options) {
                var event = this.createEvent(type, options);
                this.dispatchEvent(elem, type, event, options);
            },

            createEvent: function (type, options) {
                if (rkeyEvent.test(type)) {
                    return this.keyEvent(type, options);
                }

                if (rmouseEvent.test(type)) {
                    return this.mouseEvent(type, options);
                }
            },

            mouseEvent: function (type, options) {
                var event,
                    eventDoc,
                    doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document),
                    docEle,
                    body;


                options = $.extend({
                    bubbles: true,
                    cancelable: (type !== "mousemove"),
                    view: windowOfDocument(doc),
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 1,
                    clientY: 1,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: undefined
                }, options);


                if (doc.createEvent) {
                    event = doc.createEvent("MouseEvents");
                    event.initMouseEvent(type, options.bubbles, options.cancelable,
                        options.view, options.detail,
                        options.screenX, options.screenY, options.clientX, options.clientY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                        options.button, options.relatedTarget || doc.body.parentNode);

                    // IE 9+ creates events with pageX and pageY set to 0.
                    // Trying to modify the properties throws an error,
                    // so we define getters to return the correct values.
                    if (event.pageX === 0 && event.pageY === 0 && Object.defineProperty) {
                        eventDoc = isDocument(event.relatedTarget) ? event.relatedTarget : (event.relatedTarget.ownerDocument || document);
                        docEle = eventDoc.documentElement;
                        body = eventDoc.body;

                        Object.defineProperty(event, "pageX", {
                            get: function () {
                                return options.clientX +
                                    ( docEle && docEle.scrollLeft || body && body.scrollLeft || 0 ) -
                                    ( docEle && docEle.clientLeft || body && body.clientLeft || 0 );
                            }
                        });
                        Object.defineProperty(event, "pageY", {
                            get: function () {
                                return options.clientY +
                                    ( docEle && docEle.scrollTop || body && body.scrollTop || 0 ) -
                                    ( docEle && docEle.clientTop || body && body.clientTop || 0 );
                            }
                        });
                    }
                } else if (doc.createEventObject) {
                    event = doc.createEventObject();
                    $.extend(event, options);
                    // standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
                    // old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
                    // so we actually need to map the standard back to oldIE
                    event.button = {
                            0: 1,
                            1: 4,
                            2: 2
                        }[event.button] || event.button;
                }

                return event;
            },

            keyEvent: function (type, options) {
                var event, doc;
                options = $.extend({
                    bubbles: true,
                    cancelable: true,
                    view: windowOfDocument(doc),
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    keyCode: 0,
                    charCode: undefined
                }, options);

                doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document);
                if (doc.createEvent) {
                    try {
                        event = doc.createEvent("KeyEvents");
                        event.initKeyEvent(type, options.bubbles, options.cancelable, options.view,
                            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                            options.keyCode, options.charCode);
                        // initKeyEvent throws an exception in WebKit
                        // see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
                        // and also https://bugs.webkit.org/show_bug.cgi?id=13368
                        // fall back to a generic event until we decide to implement initKeyboardEvent
                    } catch (err) {
                        event = doc.createEvent("Events");
                        event.initEvent(type, options.bubbles, options.cancelable);
                        $.extend(event, {
                            view: options.view,
                            ctrlKey: options.ctrlKey,
                            altKey: options.altKey,
                            shiftKey: options.shiftKey,
                            metaKey: options.metaKey,
                            keyCode: options.keyCode,
                            charCode: options.charCode
                        });
                    }
                } else if (doc.createEventObject) {
                    event = doc.createEventObject();
                    $.extend(event, options);
                }

                if (!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) || (({}).toString.call(window.opera) === "[object Opera]")) {
                    event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
                    event.charCode = undefined;
                }

                return event;
            },

            dispatchEvent: function (elem, type, event, options) {
                if (options.jQueryTrigger === true) {
                    $(elem).trigger($.extend({}, event, options, {type: type}));
                }
                else if (elem.dispatchEvent) {
                    elem.dispatchEvent(event);
                } else if (elem.fireEvent) {
                    elem.fireEvent("on" + type, event);
                }
            },

            simulateFocus: function () {
                var focusinEvent,
                    triggered = false,
                    $element = $(this.target);

                function trigger() {
                    triggered = true;
                }

                $element.bind("focus", trigger);
                $element[0].focus();

                if (!triggered) {
                    focusinEvent = $.Event("focusin");
                    focusinEvent.preventDefault();
                    $element.trigger(focusinEvent);
                    $element.triggerHandler("focus");
                }
                $element.unbind("focus", trigger);
            },

            simulateBlur: function () {
                var focusoutEvent,
                    triggered = false,
                    $element = $(this.target);

                function trigger() {
                    triggered = true;
                }

                $element.bind("blur", trigger);
                $element[0].blur();

                // blur events are async in IE
                setTimeout(function () {
                    // IE won't let the blur occur if the window is inactive
                    if ($element[0].ownerDocument.activeElement === $element[0]) {
                        $element[0].ownerDocument.body.focus();
                    }

                    // Firefox won't trigger events if the window is inactive
                    // IE doesn't trigger events if we had to manually focus the body
                    if (!triggered) {
                        focusoutEvent = $.Event("focusout");
                        focusoutEvent.preventDefault();
                        $element.trigger(focusoutEvent);
                        $element.triggerHandler("blur");
                    }
                    $element.unbind("blur", trigger);
                }, 1);
            }
        });


        /** complex events **/

        function findCenter(elem) {
            var offset,
                $document,
                $elem = $(elem);

            if (isDocument($elem[0])) {
                $document = $elem;
                offset = {left: 0, top: 0};
            }
            else {
                $document = $($elem[0].ownerDocument || document);
                offset = $elem.offset();
            }

            return {
                x: offset.left + $elem.outerWidth() / 2 - $document.scrollLeft(),
                y: offset.top + $elem.outerHeight() / 2 - $document.scrollTop()
            };
        }

        function findCorner(elem) {
            var offset,
                $document,
                $elem = $(elem);

            if (isDocument($elem[0])) {
                $document = $elem;
                offset = {left: 0, top: 0};
            }
            else {
                $document = $($elem[0].ownerDocument || document);
                offset = $elem.offset();
            }

            return {
                x: offset.left - document.scrollLeft(),
                y: offset.top - document.scrollTop()
            };
        }

        $.extend($.simulate.prototype, {
            simulateDrag: function () {
                var i = 0,
                    target = this.target,
                    options = this.options,
                    center = options.handle === "corner" ? findCorner(target) : findCenter(target),
                    x = Math.floor(center.x),
                    y = Math.floor(center.y),
                    coord = {clientX: x, clientY: y},
                    dx = options.dx || ( options.x !== undefined ? options.x - x : 0 ),
                    dy = options.dy || ( options.y !== undefined ? options.y - y : 0 ),
                    moves = options.moves || 3;

                this.simulateEvent(target, "mousedown", coord);

                for (; i < moves; i++) {
                    x += dx / moves;
                    y += dy / moves;

                    coord = {
                        clientX: Math.round(x),
                        clientY: Math.round(y)
                    };

                    this.simulateEvent(target.ownerDocument, "mousemove", coord);
                }

                if ($.contains(document, target)) {
                    this.simulateEvent(target, "mouseup", coord);
                    this.simulateEvent(target, "click", coord);
                } else {
                    this.simulateEvent(document, "mouseup", coord);
                }
            }
        });

    })(jQuery);

});

csui.define('csui/models/expandable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function ExpandableModel(ParentModel) {
    var prototype = {

      makeExpandable: function (options) {
        // log.warn('Module "csui/models/expandable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/expandable/expandable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        var expand = options && options.expand;
        if (typeof expand === 'string') {
          expand = expand.split(',');
        }
        this.expand = expand || [];
        return this;
      },

      setExpand: function (name) {
        if (!_.isArray(name)) {
          name = name.split(",");
        }
        _.each(name, function (name) {
          if (!_.contains(this.expand, name)) {
            this.expand.push(name);
          }
        }, this);
      },

      resetExpand: function (name) {
        if (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            var index = _.indexOf(this.expand, name);
            if (index >= 0) {
              this.expand.splice(index, 1);
            }
          }, this);
        } else {
          this.expand = [];
        }
      },

      getExpandableResourcesUrlQuery: function () {
        return {expand: this.expand};
      }

    };
    prototype.Expandable = _.clone(prototype);

    return prototype;
  }

  return ExpandableModel;

});


csui.define('css!csui/widgets/navigation.header/impl/navigation.header.controls',[],function(){});
csui.define('csui/widgets/navigation.header/navigation.header.controls',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'css!csui/widgets/navigation.header/impl/navigation.header.controls'
], function (module, _, Backbone) {
  'use strict';

  var config = module.config();

  var logo = new Backbone.Model(_.extend({
    location: 'center'
  }, config.logo));

  var leftSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/help/help.view',
      sequence: 100,
      parentClassName: 'csui-help'
    },
    {
      id: 'csui/widgets/navigation.header/controls/home/home.view',
      sequence: 200,
      parentClassName: 'csui-home-item'
    },
    {
      id: 'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
      sequence: 300,
      parentClassName: 'tile-breadcrumb'
    }
  ], {
    comparator: 'sequence'
  });

  var rightSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/search/search.view',
      sequence: 100,
      parentClassName: 'csui-search'
    },
    {
      id: 'csui/widgets/navigation.header/controls/favorites/favorites.view',
      sequence: 200,
      parentClassName: 'csui-favorites'
    },
    {
      id: 'csui/widgets/navigation.header/controls/user.profile/user.profile.view',
      sequence: 300,
      parentClassName: 'csui-profile'
    }
  ], {
    comparator: 'sequence'
  });

  var masks = _.reduce(_.values(config.masks || {}), function (result, mask) {
    return {
      blacklist: result.blacklist.concat(mask.blacklist || []),
      whitelist: result.whitelist.concat(mask.whitelist || [])
    };
  }, {
    blacklist: [],
    whitelist: []
  });
  masks = {
    blacklist: _.unique(masks.blacklist),
    whitelist: _.unique(masks.whitelist)
  };

  function filterComponentByMask(component) {
    return !_.contains(masks.blacklist, component.id) &&
           (!masks.whitelist.length ||
            _.contains(masks.whitelist, component.id));
  }

  leftSide.remove(leftSide.reject(filterComponentByMask));
  rightSide.remove(rightSide.reject(filterComponentByMask));

  return {
    logo: logo,
    leftSide: leftSide,
    rightSide: rightSide
  };
});


/* START_TEMPLATE */
csui.define('hbs!csui/pages/start/impl/navigationheader/impl/navigationheader',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-global-message\"></div>\r\n<nav class=\"csui-navbar binf-navbar binf-navbar-default zero-gutter\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.mainNavigationAria || (depth0 != null ? depth0.mainNavigationAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mainNavigationAria","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"binf-container-fluid\" role=\"menubar\">\r\n    <span class=\"binf-navbar-brand binf-collapse binf-navbar-collapse\">\r\n      <span class=\"csui-logo binf-hidden-xs\">\r\n        <span class=\"csui-logo-image\"></span>\r\n      </span>\r\n    </span>\r\n    <div class=\"binf-nav binf-navbar-nav binf-navbar-left\"></div>\r\n    <div class=\"binf-nav binf-navbar-nav binf-navbar-right\" ></div>\r\n    <div class=\"binf-nav binf-navbar-nav csui-navbar-message\"></div>\r\n  </div>\r\n</nav>\r\n";
}});
Handlebars.registerPartial('csui_pages_start_impl_navigationheader_impl_navigationheader', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/pages/start/impl/navigationheader/impl/navigationheader',[],function(){});
csui.define('csui/pages/start/impl/navigationheader/navigationheader.view',[
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/navigation.header/navigation.header.controls',
  'hbs!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'csui/lib/jquery.when.all'
], function (require, _, $, Backbone, Marionette, GlobalMessage,
    LayoutViewEventsPropagationMixin, controls, template, lang) {
  'use strict';

  var NavigationHeaderView = Marionette.LayoutView.extend({
    template: template,

    regions: {
      messageRegion: '.csui-navbar-message'
    },

    ui: {
      branding: '.binf-navbar-brand',
      logo: '.csui-logo',
      left: '.binf-navbar-left',
      right: '.binf-navbar-right'
    },

    templateHelpers: function() {
      return {
        mainNavigationAria: lang.mainNavigationAria
      };
    },

    constructor: function NavigationHeaderView(options) {
      Marionette.LayoutView.call(this, options);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var context = this.options.context,
          self = this;

      GlobalMessage.setMessageRegionView(this, {classes: "csui-global-message"});

      var logoLocation = controls.logo.get('location');
      if (logoLocation === 'none') {
        this.ui.logo.addClass('binf-hidden');
      } else {
        this.ui.branding.addClass('csui-logo-' + logoLocation);
      }

      this._resolveComponents()
          .done(function () {
            self.trigger('before:render:controls', self);
            controls.leftSide.each(createControls.bind(self, self.ui.left));
            controls.rightSide.each(createControls.bind(self, self.ui.right));
            self.trigger('render:controls', self);
          });

      function createControls(target, control) {
        var View = control.get('view');
        if (View) {
          var el = $('<div>').addClass(control.get('parentClassName'))
                            .appendTo(target).attr('role', 'menuitem'),
              region = self.addRegion(_.uniqueId('csui:navigation.header.control'), {selector: el}),
              view = new View({
                context: context,
                parentView: self
              });
          region.show(view);
        }
      }
    },

    _resolveComponents: function () {
      if (this._controlsResolved) {
        return this._controlsResolved;
      }

      function resolveControl(name) {
        var deferred = $.Deferred();
        require([name], deferred.resolve, deferred.reject);
        return deferred.promise();
      }

      var allComponents = controls.leftSide.models.concat(controls.rightSide.models),
          promises = allComponents.map(function (control) {
                                    return resolveControl(control.id);
                                  }),
          deferred = $.Deferred();
      $.whenAll.apply($, promises)
               .always(function (views) {
                 views.forEach(function (view, index) {
                   allComponents[index].set('view', view);
                 });
                 deferred.resolve();
               });
      this._controlsResolved = deferred.promise();
      return this._controlsResolved;
    }
  });

  _.extend(NavigationHeaderView.prototype, LayoutViewEventsPropagationMixin);

  return NavigationHeaderView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-row\">\r\n  <div class=\"binf-item binf-col-xs-12\">\r\n    <div class=\"breadcrumb-inner breadcrumb-inner-header\" role=\"navigation\"\r\n         aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.breadcrumbAria || (depth0 != null ? depth0.breadcrumbAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"breadcrumbAria","hash":{}}) : helper)))
    + "\"></div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_breadcrumbspanel_impl_breadcrumbspanel', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',[],function(){});
csui.define('csui/controls/breadcrumbspanel/breadcrumbspanel.view',['csui/lib/marionette', 'csui/utils/contexts/factories/ancestors',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',
  'css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel'
], function (Marionette, AncestorCollectionFactory, BreadcrumbsView,
    BreadcrumbsPanelTemplate, lang) {
  'use strict';

  var BreadcrumbsPanelView = Marionette.LayoutView.extend({

    attributes: {id: 'breadcrumb-wrap'},

    className: 'binf-container-fluid',

    template: BreadcrumbsPanelTemplate,

    ui: {
      tileBreadcrumb: '.tile-breadcrumb',
      breadcrumbsWrap: '#breadcrumb-wrap'
    },

    regions: {
      breadcrumbsInner: '.breadcrumb-inner'
    },

    templateHelpers: function () {
      return {
        breadcrumbAria: lang.breadcrumbAria
      };
    },

    constructor: function BreadcrumbsPanelView(options) {
      Marionette.LayoutView.apply(this, arguments);

      this.listenTo(this.options.context, 'request', this._contextFetching);
      this.listenTo(this.options.context, 'current:folder:changed', this._currentFolderChanged);
    },

    _getAncestors: function () {
      var ancestors = this.options.context.getCollection(AncestorCollectionFactory);
      if (this.ancestors !== ancestors) {
        if (this.ancestors) {
          this.stopListening(this.ancestors, 'sync', this.breadcrumbsChanged);
        }
        this.listenTo(ancestors, 'sync', this.breadcrumbsChanged);
        this.ancestors = ancestors;
      }
      return ancestors;
    },

    _contextFetching: function () {
      // Node ancestors are not permanent in the context; when the context
      // is going to be fetched, ask for the current collection and pass it
      // to the breadcrumb control to synchronize its view-model with it.
      var ancestors = this._getAncestors();
      if (this.breadcrumbs && ancestors !== this.breadcrumbs.completeCollection) {
        this.breadcrumbs.updateCompleteCollection(ancestors);
      }
    },

    _currentFolderChanged: function (node) {
      // Check, if this view has been rendered.
      if (this.ancestors) {
        // Check, if the current contexts support node ancestors.
        if (this.ancestors.isFetchable()) {
          // Check, if the event was triggered by renaming a node.
          if (node) {
            var ancestor = this.ancestors.findWhere({id: node.get('id')});
            if (ancestor) {
              ancestor.set('name', node.get('name'));
            } else {
              // Empty the ancestors, if the upcoming scenario does not support it.
              this.ancestors.reset([]);
              if (this.breadcrumbs) {
                this.breadcrumbs.updateCompleteCollection(this.ancestors);
                this.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
              }
            }
          } else {
            // Compatibility with the original event, which wastes a server call.
            this.ancestors.fetch();
          }
        } else {
          // Empty the ancestors, if the upcoming scenario does not support it.
          this.ancestors.reset([]);
        }
      }
    },

    breadcrumbsChanged: function () {
      this.triggerMethod('change:breadcrumbs', {
        isBreadcrumbsEmpty: this.ancestors.size() === 0
      });
    },

    onRender: function () {
      this.breadcrumbs = new BreadcrumbsView({
        context: this.options.context,
        collection: this._getAncestors(),
        fetchOnCollectionUpdate: false
      });
      this.breadcrumbsInner.show(this.breadcrumbs);
    },

    hideBreadcrumbs: function () {
      if (this.breadcrumbs) {
        this.breadcrumbs.hideSubCrumbs();
      }
      this.$el.removeClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable:not", this);
      // the tabable region reacts to the isVisible state, so we use an explicit hide to prevent it from still being tabable
      this.$el.hide();
    },

    showBreadcrumbs: function () {
      this.$el.addClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable", this);
      this.$el.show();
      this.breadcrumbs && this.breadcrumbs.triggerMethod("refresh:tabindexes");
    },

    isTabable: function () {
      if (this.breadcrumbs) {
        return this.ancestors.size() > 1;
      } else {
        return false;
      }
    }

  });

  return BreadcrumbsPanelView;
});


csui.define('css!csui/pages/start/impl/start.page',[],function(){});
// Places navigation bar and the perspective pane to the page body
csui.define('csui/pages/start/start.page.view',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone', 'csui/utils/namedlocalstorage',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/connector', 'csui/utils/contexts/factories/user',
  'csui/pages/start/perspective.routing', 'csui/utils/base',
  'csui/pages/start/impl/navigationheader/navigationheader.view',
  'csui/controls/breadcrumbspanel/breadcrumbspanel.view',
  'csui/pages/start/impl/perspective.panel/perspective.panel.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/non-attaching.region/non-attaching.region',
  'csui/utils/page.leaving.blocker', 'csui/controls/iconpreload/icon.preload.view',
  'csui/lib/radio', 'css!csui/pages/start/impl/start.page'
], function (module, _, $, Marionette, Backbone, NamedLocalStorage,
    PerspectiveContext, ConnectorFactory, UserModelFactory, PerspectiveRouting,
    base, NavigationHeaderView, BreadcrumbsPanelView, PerspectivePanelView,
    ViewEventsPropagationMixin, TabablesBehavior, TabableRegionBehavior, NonEmptyingRegion,
    NonAttachingRegion, PageLeavingBlocker, IconPreloadView, Radio) {

  var config = _.extend({
    signInPageUrl: 'signin.html',
    redirectToSignInPage: !PerspectiveRouting.routesWithSlashes()
  }, module.config());

  var StartPageView = Marionette.ItemView.extend({

    template: false,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior
      }
    },

    constructor: function StartPageView(options) {
      options || (options = {});
      options.el = document.body;

      Marionette.View.prototype.constructor.call(this, options);

      // Create application context for this page
      var context   = new PerspectiveContext(),
          connector = context.getObject(ConnectorFactory);

      // Check if the page has authentication information
      // Use Basic Authentication (known credentials)
      if (!connector.connection.credentials &&
          // Use pre-authenticated session (session.ticket)
          !connector.authenticator.isAuthenticated() &&
          // Try pre-authenticated session from session storage
          !connector.authenticator.syncStorage().isAuthenticated()) {
        this._navigateToSignIn();
        return;
      }

      // If some call fails with an expired session, redirect to sign-in
      connector.authenticator.on('loggedOut', function (args) {
        // User's intentional logging out is followed by a redirect to the
        // logout page; do not change the location here too.
        if (args.reason !== 'logged-out') {
          this._navigateToSignIn();
        }
      }, this);

      // Create child views
      this.navigationHeader = new NavigationHeaderView({
        context: context,
        signInPageUrl: this.options.signInPageUrl
      });

      this.context = context;

      this.listenTo(this.navigationHeader, 'show:breadcrumbs', this.onShowBreadcrumbs);
      this.listenTo(this.navigationHeader, 'hide:breadcrumbs', this.onHideBreadcrumbs);
      this.listenTo(this.navigationHeader, 'change:breadcrumbs',
          this.onChangeBreadcrumbs);
      this.listenTo(Backbone, 'show:breadcrumbsoverride', this.onOverrideShowBreadcrumb);
      this.overrideShowBreadcrumb = false;
      this.isBreadcrumbsEmpty = true;
      this.breadcrumbsChannel = Radio.channel('csui:breadcrumbs');
      this.breadcrumbsPanel = new BreadcrumbsPanelView({
        context: context
      });
      this.listenTo(this.breadcrumbsPanel, 'change:breadcrumbs',
          this.onChangeBreadcrumbs);

      this.user = context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change', this.updateUserPreferences);

      this.perspectivePanel = new PerspectivePanelView({
        context: context
      });

      this.propagateEventsToViews(this.navigationHeader, this.breadcrumbsPanel,
          this.perspectivePanel);

      var routing = PerspectiveRouting.getInstance({
        context: context
      });
      // Initialize URL routing and fetch the first perspective
      routing.start();

      // Namespace for binf widgets
      this.$el.addClass('binf-widgets');

      // Enable styling workarounds for Safari on iPad.  We might want to
      // put them to a separate CSS file loaded dynamically, instead of
      // having them in the same file identified by this class, if the size
      // of the workaround styles grows too much.
      if (base.isAppleMobile()) {
        this.$el.addClass('csui-on-ipad');
      }

      // Workaround for the back-forward cache in Safari, which ignores the
      // no-store cache control flag and loads the page from cache, when the
      // back button is clicked.  As long as logging out does not invalidate
      // the LLCookie/OTCSTicket and we write the ticket to the /app, going
      // back would allow the logged-out user working with the REST API again.
      //
      // http://madhatted.com/2013/6/16/you-do-not-understand-browser-history
      // http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/
      $(window).unload(function () {});

      this.resizeTimer = undefined;
      $(window).bind('resize', {view: this}, this._onWindowResize);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._toggleBreadcrumbsVisibility();
        }, 200);
      }
    },

    onRender: function () {
      if (this._redirecting) {
        return this;
      }

      IconPreloadView.ensureOnThePage();

      this._appendView(this.navigationHeader);
      $(this.$el.children()[0]).attr('role', 'banner');
      this._appendView(this.breadcrumbsPanel);
      this._appendView(this.perspectivePanel);
      $(this.$el.children()[2]).attr('role', 'main');

      // Do not send showing events before triggering the first render event
      setTimeout(_.bind(function () {
        var bodyRegion = new NonAttachingRegion({el: this.el});
        bodyRegion.show(this, {render: false});
      }, this));

      // Listen to global message show event to make it tababable.
      // Note: Doing it from here since messagepanel.view is bundled with csui-data
      this.$el.bind('globalmessage.shown', function (event, view) {
        var messageTabable = new TabableRegionBehavior(view.options, view);
      });
    },

    onBeforeDestroy: function () {
      this.navigationHeader && this.navigationHeader.destroy();
      this.breadcrumbsPanel && this.breadcrumbsPanel.destroy();
      this.perspectivePanel && this.perspectivePanel.destroy();
    },

    updateUserPreferences: function () {
      var userName = this.user.get('name');
      this.userPreferences = userName ? new NamedLocalStorage(
          'userPreferences:' + userName) : undefined;
      if (this._isRendered) {
        this._toggleBreadcrumbsVisibility();
      }
    },

    onShowBreadcrumbs: function () {
      this.setPrefBreadcrumbsVisible(true);
      this._toggleBreadcrumbsVisibility();
    },

    onHideBreadcrumbs: function () {
      this.setPrefBreadcrumbsVisible(false);
      this._toggleBreadcrumbsVisibility();
    },

    onChangeBreadcrumbs: function (e) {
      if (this.isBreadcrumbsEmpty != e.isBreadcrumbsEmpty) {
        this.isBreadcrumbsEmpty = e.isBreadcrumbsEmpty;
        this._toggleBreadcrumbsVisibility();
      }
    },

    setPrefBreadcrumbsVisible: function (prefVisible) {
      this.userPreferences.set('breadcrumbs-visible', prefVisible);
    },

    onOverrideShowBreadcrumb: function () {
      this.overrideShowBreadcrumb = !this.overrideShowBreadcrumb;
    },

    _isPrefBreadcrumbsVisible: function () {
      var breadcrumbsVisible;

      if (this.userPreferences === undefined) {
        breadcrumbsVisible = true;
      }
      else {
        breadcrumbsVisible = this.userPreferences.get('breadcrumbs-visible');
        if (breadcrumbsVisible === undefined) {
          breadcrumbsVisible = true;
        }
      }

      return breadcrumbsVisible;
    },

    _isScreenNarrow: function () {
      return ($(window).width() <= 992);
    },

    _toggleBreadcrumbsVisibility: function () {
      if (this.isBreadcrumbsEmpty) {
        this.breadcrumbsChannel.request('hide:handle');
        this.breadcrumbsPanel.hideBreadcrumbs();
        $("body").removeClass("csui-breadcrumbs-visible");
      }
      else {
        // Breadcrumbs is always visible on narrow screens less than 993px
        if (this._isScreenNarrow() ||
            (this._isPrefBreadcrumbsVisible() && !this.overrideShowBreadcrumb)) {
          this.breadcrumbsChannel.request('arrow:up');
          this.breadcrumbsPanel.showBreadcrumbs();
          $("body").addClass("csui-breadcrumbs-visible");
        }
        else {
          this.breadcrumbsChannel.request('arrow:down');
          this.breadcrumbsPanel.hideBreadcrumbs();
          $("body").removeClass("csui-breadcrumbs-visible");
        }
      }
    },

    _appendView: function (view) {
      var region = new NonEmptyingRegion({el: this.el});
      region.show(view);
    },

    _navigateToSignIn: function () {
      // The development HTML pages do not use OTDS login page
      if (!config.redirectToSignInPage) {
        // If the session expires or is not available, reload the /app page;
        // authentication should be performed by the server redirecting to
        // the OTDS login page
        PageLeavingBlocker.forceDisable();
        location.reload();
      } else {
        var signInPageUrl = this.options.signInPageUrl || config.signInPageUrl,
            query         = location.search;
        query += query ? '&' : '?';
        query += 'nextUrl=' + encodeURIComponent(location.pathname);
        location.href = signInPageUrl + query + location.hash;
      }
      // The REST of the view rendering continues, until the context
      // is switched, and the page would quickly show its content
      // before the location change finally kicks in.
      // before the location change finally kicks in.
      this._redirecting = true;
    }

  });

  _.extend(StartPageView.prototype, ViewEventsPropagationMixin);

  return StartPageView;

});

csui.define('csui/widgets/navigation.header/controls/help/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/help/impl/nls/root/localized.strings',{
  HelpIconTitle: 'Help',
  HelpIconAria: 'Help pages'
});


csui.define('csui/lib/othelp',['module'], function(module) {
/* (c) Copyright Open Text Corporation 2016. Version 16.4.0.46 */ 
var OTHHUrlBuilder=function(t){var u="product",A="version",w="http://docsapi.opentext.com/mapperpi",y={tboolean:"touch bookmarks toc bookmarkEntries sectionNumbers caseSensitive highContrast".split(" "),nameValuePair:{find:["anyWord","allWords","exactWord"],search:["allModules","document","section","page"],sort:["match","divisions"]},tstring:"query"};Array.isArray||(Array.isArray=function(a){return a instanceof Array});"undefined"==typeof String.prototype.endsWith&&(String.prototype.endsWith=function(a){return this.lastIndexOf(a)==
this.length-a.length});"undefined"==typeof debug&&(debug=!1);"undefined"==typeof trace&&(trace=!1);t&&(u=t.product||u,A=t.version||A,w=t.urlRoot||w);try{console||(console={error:function(){},log:function(){},warn:function(){}})}catch(a){console={error:function(){},log:function(){},warn:function(){}}}return{buildHelpUrl:function(a,b,c){if(!a||!b)return console.error("Please specify 'locale' and 'context'"),"";if("string"==typeof a&&0>a.indexOf(",")&&"string"==typeof b)return this._.generateSixParam(a,
b,c);var d=null,d="string"==typeof a&&-1<a.indexOf(",")?a.split(","):"string"==typeof a?[a]:a;return this._.generateComplexParam(d,b,c)},optionConstants:y,_:{generateComplexParam:function(a,b,c){var d,f=[],p,m,g=[],e=null,e=!1,n=[],l=[],h,q,t,u,k,z,r,v,x;if(!a||!b)return console.error("Missing parameter!, Please specify 'locale', and 'context', not:",a,b,c),"";if("object"!=typeof a||"object"!=typeof b||c&&"object"!=typeof c)return console.error("Invalid parameter!:",a,b,c,"are not objects. Parameter order should be ([],{},{})"),
"";q=c?c.tenant:null;t=c?c.type||"ofh1":"ofh1";u=function(a,b){if(a){z=!1;for(r in b)z|=b[r]==a;z||b.push(a)}};d="";for(h in b.documents)k=b.documents[h],k.active&&!0===k.active&&(e&&delete k.active,e=!0),!0===k.exclude&&f.push(k),this.fixApp(k),u(k.version,l),k.err||n.push(k);if("object"==typeof c&&c.options){debug&&console.log("Complex params options: ",c.options);e={find:1,search:10,sort:100};k=0;v=1;for(h in y.tboolean)r=y.tboolean[h],r=c.options[r],"boolean"==typeof r&&(k+=r?v:0),v*=2;k=k.toString(16);
"0"!=k&&(d+=2>k.length?"0"+k:k);k=0;for(h in c.options)if(r=y.nameValuePair[h])for(v=c.options[h],x=0;x<r.length;x++)if(r[x]==v){k+=(x+1)*e[h];break}0<k&&121!=k&&(k=k.toString(16),d+=(0===d.length?"00":"")+(2>k.length?"0"+k:k));"string"==typeof c.options.query&&(d+="S"+encodeURI(c.options.query));c.options.flags&&(p=(""+c.options.flags).replace(/[^a-zA-Z0-9]/g,""));if(c.options.custom)for(k in m="",c.options.custom)0<=",ml,t,o,f,key,type,".indexOf(","+k+",")||(r=""+k.replace(/[^a-zA-Z0-9]/g,"")+"="+
encodeURIComponent(c.options.custom[k]),m+="&"+r)}debug&&console.log("Complex params: ",q,t,JSON.stringify(n),d);c=w+"?ml=";c+=this.altArray(a);1==l.length&&(c=c+","+l[0]);for(h=0;h<n.length;h++)e=n[h].module,n[h].version&&(e+=n[h].version),n[h].release&&(e+="-"+n[h].release),n[h].help&&(e+="-"+n[h].help),n[h].docType&&(e+="-"+n[h].docType),n[h].locale&&(e+="-"+n[h].locale),n[h].PageID&&(e+="."+n[h].PageID),n[h].exclude&&(e+="_"),n[h].active&&(e+="~"),u(e,g);debug&&(console.log("Complex params: ",
l,c,JSON.stringify(f)),console.log("Compressable: ",JSON.stringify(g)));e=this.compress({docs:g,preserve:b.preserve,locale:a},a[0]);debug&&console.log("Compressed:",e);q&&(e+="&t="+encodeURIComponent(q));d&&(0<parseInt(d,16)||0<=d.indexOf("S"))&&(e+="&o="+d);p&&(e+="&f="+p);m&&(e+=m);a=this.generateKey();return w+"?type="+t+"&ml="+(e+("&key="+a))},compress:function(a,b){var c=a.locale,d,f;d=null;var p=[],m,g="NotAPossibleValue",e=g,n=!0,l=g,h=!0,q;c||(c=b);c&&null!==c||(c="en");d=a.docs;!0!==a.preserve&&
(d=d.sort());f=this.altArray(c);p=[];m=null;e=g="NotAPossibleValue";n=!0;l=g;h=!0;for(q in d)m=this.parseRevnum(d[q]),p.push(m),n&&e!=m.help&&(e==g?e=m.help:e!=m.help&&(n=!1)),h&&l!=m.release&&(l==g?l=m.release:l!=m.release&&(h=!1));2>d.length&&(h=n=!1);h&&null!==l&&(f=f+"-"+l.toUpperCase());n&&null!==e&&(f+="-",f+=e);e=g=q=null;for(m in p){d=p[m];null===q||q!=d.product?(f+="$",q=d.product,g=e=null,f+=q):f+=",";l=d.version;h||null===d.release||d.release&&(l+="-"+d.release.toUpperCase());if(null===
g||g!=l)f+=l,g=l,e=null;l="";d.docType&&(l+=d.docType);null!==d.locale&&c!=d.locale&&(l+="-",l+=d.locale);null!==d.PageID&&0<d.PageID.length&&(l+=".",l+=window.encodeURIComponent(d.PageID));if(null===e||e!=l)null!==e&&","!=f.substring(f.length-1)&&(f+=","),e=l,n||null===d.help||(f+=d.help,f+="-"),f+=e;null!==d.flag&&(f+=d.flag)}return f},fixApp:function(a){var b=null,c;if(a){a.version||(b=this.parseRevnum(a.module),a.module=b.product,a.version=b.version&&0<b.version.length?b.version:"0",a.release=
b.release&&0<b.release.length?b.release:null,a.docType=b.docType,a.help=b.help,a.err=b.err);"v"==a.version[0]&&(a.version=a.version.substring(1));if(-1<a.module.indexOf("-")){b=a.module.split(/(?=-)/);b[0]=b[0].split(/\d+$/)[0];a.module=b[0]+a.version;for(c=1;c<b.length;c++)a.module+=b[c];b=this.parseRevnum(a.module);a.module=b.product;a.version=b.version;a.release=b.release;a.docType=b.docType;a.help=b.help;a.err=b.err}b||(b=this.parseRevnum(a.module));a.locale=b.locale&&0<b.locale.length&&!a.locale?
b.locale:a.locale;a.PageID=b.PageID&&0<b.PageID.length&&!a.topic?b.PageID:a.topic;a.module=a.module.split(/\d+$/)[0]}},generateSixParam:function(a,b,c){var d=null,f=null,p=null,m=null,g;c&&(d=c.product,f=c.version,p=c.module,m=c.type);"string"==typeof m&&0===m.length&&(m=null);c=this.generateKey();d=d||u;f=f||A;g=w;"string"!=typeof p&&"string"!=typeof m&&0<g.indexOf("mapperpi")&&(g=g.substring(0,g.length-2));g=g+"?"+("product="+encodeURIComponent(d));g+="&version="+encodeURIComponent(f);g+="&locale="+
encodeURIComponent(a);g+="&context="+encodeURIComponent(b);if("string"==typeof p&&"string"==typeof m)g+="&module="+encodeURIComponent(p),g+="&type="+encodeURIComponent(m);else if(!p&&m||!m&&p)return console.error("'module' and 'type' need to be either BOTH or NEITHER defined"),"";g+="&key="+c;debug&&console.log(g);return g},generateKey:function(){var a=this.generatePassPhrase();return this.encryptByDES("Vignette",a)},parseRevnum:function(a){var b=null,c;if(b=a.match(/^([a-zA-Z]+)(\d+(-\d+\w*)?)((-[a-z])?)(-[a-z]+)?(-[_a-z]+)?(-\d+)?(\.([a-zA-Z0-9#.\_\-]+))?([\_\~])?$/i)){a=
b[2];b[3]&&"-"==b[3][0]&&(a=a.substring(0,a.length-b[3].length));b={product:b[1],version:a,release:b[3],help:b[4],docType:b[6],locale:b[7],revision:b[8],PageID:b[10],flag:b[11]};for(c in b)b[c]&&"-"==b[c][0]?b[c]=b[c].substring(1):b[c]||(b[c]=null);null!==b.PageID&&null===b.flag&&b.PageID.endsWith("_")&&(b.flag="_",b.PageID=b.PageID.substring(0,b.PageID.length-1))}else b={product:a,version:null,release:null,help:null,docType:null,locale:null,revision:null,PageID:null,flag:null,err:!0};return b},generatePassPhrase:function(){var a=
new Date,b=a.getFullYear(),c=a.getMonth(),a=a.getDate(),d=""+c,f=""+a;10>c&&(d="0"+d);10>a&&(f="0"+f);return b+d+f},encryptByDES:function(a,b){var c;c=CryptoJS.enc.Utf8.parse(b);var d=CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse("ruhulio!").toString(CryptoJS.enc.Hex));trace&&(console.log(CryptoJS.enc.Utf8.stringify(c),CryptoJS.enc.Hex.stringify(c)),console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(b).toString(CryptoJS.enc.Hex))));c=CryptoJS.DES.encrypt(a,c,{iv:d,mode:CryptoJS.mode.CBC,
padding:CryptoJS.pad.Pkcs7});trace&&(console.log("encrypted.toString()  -> base64(ciphertext)  :",c.toString()),console.log("base64(ciphertext)    <- encrypted.toString():",c.ciphertext.toString(CryptoJS.enc.Base64)),console.log("ciphertext.toString() -> ciphertext hex      :",c.ciphertext.toString()));return c.ciphertext.toString()},altArray:function(a){var b="",c,d;if(Array.isArray(a)){for(c=0;c<a.length;c++)d=a[c],b=0===c%2?b+d.toLowerCase():b+d.toUpperCase();return b}return a}}}};

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,l){var d={},n=d.lib={},p=function(){},s=n.Base={extend:function(a){p.prototype=this;var c=new p;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=n.WordArray=s.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,m=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var t=0;t<a;t++)c[f+t>>>2]|=(m[t>>>2]>>>24-8*(t%4)&255)<<24-8*((f+t)%4);else if(65535<m.length)for(t=0;t<a;t+=4)c[f+t>>>2]=m[t>>>2];else c.push.apply(c,m);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=s.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],m=0;m<a;m+=4)c.push(4294967296*u.random()|0);return new q.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++){var t=c[f>>>2]>>>24-8*(f%4)&255;m.push((t>>>4).toString(16));m.push((t&15).toString(16))}return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f+=2)m[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new q.init(m,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++)m.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f++)m[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(m,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
r=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,m=c.words,f=c.sigBytes,t=this.blockSize,b=f/(4*t),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*t;f=u.min(4*a,f);if(a){for(var e=0;e<a;e+=t)this._doProcessBlock(m,e);e=m.splice(0,a);c.sigBytes-=f}return new q.init(e,f)},clone:function(){var a=s.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});n.Hasher=r.extend({cfg:s.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,m){return(new a.init(m)).finalize(c)}},_createHmacHelper:function(a){return function(c,m){return(new e.HMAC.init(a,
m)).finalize(c)}}});var e=d.algo={};return d}(Math);
(function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words,l=d.sigBytes,s=this._map;d.clamp();d=[];for(var q=0;q<l;q+=3)for(var w=(n[q>>>2]>>>24-8*(q%4)&255)<<16|(n[q+1>>>2]>>>24-8*((q+1)%4)&255)<<8|n[q+2>>>2]>>>24-8*((q+2)%4)&255,v=0;4>v&&q+0.75*v<l;v++)d.push(s.charAt(w>>>6*(3-v)&63));if(n=s.charAt(64))for(;d.length%4;)d.push(n);return d.join("")},parse:function(d){var n=d.length,p=this._map,s=p.charAt(64);s&&(s=d.indexOf(s),-1!=s&&(n=s));for(var s=[],q=0,w=0;w<
n;w++)if(w%4){var v=p.indexOf(d.charAt(w-1))<<2*(w%4),b=p.indexOf(d.charAt(w))>>>6-2*(w%4);s[q>>>2]|=(v|b)<<24-8*(q%4);q++}return l.create(s,q)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function l(b,e,a,c,m,f,t){b=b+(e&a|~e&c)+m+t;return(b<<f|b>>>32-f)+e}function d(b,e,a,c,m,f,t){b=b+(e&c|a&~c)+m+t;return(b<<f|b>>>32-f)+e}function n(b,e,a,c,m,f,t){b=b+(e^a^c)+m+t;return(b<<f|b>>>32-f)+e}function p(b,e,a,c,m,f,t){b=b+(a^(e|~c))+m+t;return(b<<f|b>>>32-f)+e}for(var s=CryptoJS,q=s.lib,w=q.WordArray,v=q.Hasher,q=s.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;q=q.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(r,e){for(var a=0;16>a;a++){var c=e+a,m=r[c];r[c]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360}var a=this._hash.words,c=r[e+0],m=r[e+1],f=r[e+2],t=r[e+3],y=r[e+4],q=r[e+5],s=r[e+6],w=r[e+7],v=r[e+8],u=r[e+9],x=r[e+10],z=r[e+11],A=r[e+12],B=r[e+13],C=r[e+14],D=r[e+15],g=a[0],h=a[1],j=a[2],k=a[3],g=l(g,h,j,k,c,7,b[0]),k=l(k,g,h,j,m,12,b[1]),j=l(j,k,g,h,f,17,b[2]),h=l(h,j,k,g,t,22,b[3]),g=l(g,h,j,k,y,7,b[4]),k=l(k,g,h,j,q,12,b[5]),j=l(j,k,g,h,s,17,b[6]),h=l(h,j,k,g,w,22,b[7]),
g=l(g,h,j,k,v,7,b[8]),k=l(k,g,h,j,u,12,b[9]),j=l(j,k,g,h,x,17,b[10]),h=l(h,j,k,g,z,22,b[11]),g=l(g,h,j,k,A,7,b[12]),k=l(k,g,h,j,B,12,b[13]),j=l(j,k,g,h,C,17,b[14]),h=l(h,j,k,g,D,22,b[15]),g=d(g,h,j,k,m,5,b[16]),k=d(k,g,h,j,s,9,b[17]),j=d(j,k,g,h,z,14,b[18]),h=d(h,j,k,g,c,20,b[19]),g=d(g,h,j,k,q,5,b[20]),k=d(k,g,h,j,x,9,b[21]),j=d(j,k,g,h,D,14,b[22]),h=d(h,j,k,g,y,20,b[23]),g=d(g,h,j,k,u,5,b[24]),k=d(k,g,h,j,C,9,b[25]),j=d(j,k,g,h,t,14,b[26]),h=d(h,j,k,g,v,20,b[27]),g=d(g,h,j,k,B,5,b[28]),k=d(k,g,
h,j,f,9,b[29]),j=d(j,k,g,h,w,14,b[30]),h=d(h,j,k,g,A,20,b[31]),g=n(g,h,j,k,q,4,b[32]),k=n(k,g,h,j,v,11,b[33]),j=n(j,k,g,h,z,16,b[34]),h=n(h,j,k,g,C,23,b[35]),g=n(g,h,j,k,m,4,b[36]),k=n(k,g,h,j,y,11,b[37]),j=n(j,k,g,h,w,16,b[38]),h=n(h,j,k,g,x,23,b[39]),g=n(g,h,j,k,B,4,b[40]),k=n(k,g,h,j,c,11,b[41]),j=n(j,k,g,h,t,16,b[42]),h=n(h,j,k,g,s,23,b[43]),g=n(g,h,j,k,u,4,b[44]),k=n(k,g,h,j,A,11,b[45]),j=n(j,k,g,h,D,16,b[46]),h=n(h,j,k,g,f,23,b[47]),g=p(g,h,j,k,c,6,b[48]),k=p(k,g,h,j,w,10,b[49]),j=p(j,k,g,h,
C,15,b[50]),h=p(h,j,k,g,q,21,b[51]),g=p(g,h,j,k,A,6,b[52]),k=p(k,g,h,j,t,10,b[53]),j=p(j,k,g,h,x,15,b[54]),h=p(h,j,k,g,m,21,b[55]),g=p(g,h,j,k,v,6,b[56]),k=p(k,g,h,j,D,10,b[57]),j=p(j,k,g,h,s,15,b[58]),h=p(h,j,k,g,B,21,b[59]),g=p(g,h,j,k,y,6,b[60]),k=p(k,g,h,j,z,10,b[61]),j=p(j,k,g,h,f,15,b[62]),h=p(h,j,k,g,u,21,b[63]);a[0]=a[0]+g|0;a[1]=a[1]+h|0;a[2]=a[2]+j|0;a[3]=a[3]+k|0},_doFinalize:function(){var b=this._data,e=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;e[c>>>5]|=128<<24-c%32;var m=u.floor(a/
4294967296);e[(c+64>>>9<<4)+15]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360;e[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(e.length+1);this._process();b=this._hash;e=b.words;for(a=0;4>a;a++)c=e[a],e[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});s.MD5=v._createHelper(q);s.HmacMD5=v._createHmacHelper(q)})(Math);
(function(){var u=CryptoJS,l=u.lib,d=l.Base,n=l.WordArray,l=u.algo,p=l.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:l.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,l){for(var p=this.cfg,v=p.hasher.create(),b=n.create(),u=b.words,r=p.keySize,p=p.iterations;u.length<r;){e&&v.update(e);var e=v.update(d).finalize(l);v.reset();for(var a=1;a<p;a++)e=v.finalize(e),v.reset();b.concat(e)}b.sigBytes=4*r;return b}});u.EvpKDF=function(d,l,n){return p.create(n).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var l=CryptoJS,d=l.lib,n=d.Base,p=d.WordArray,s=d.BufferedBlockAlgorithm,q=l.enc.Base64,w=l.algo.EvpKDF,v=d.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(m,a){return this.create(this._ENC_XFORM_MODE,m,a)},createDecryptor:function(m,a){return this.create(this._DEC_XFORM_MODE,m,a)},init:function(m,a,b){this.cfg=this.cfg.extend(b);this._xformMode=m;this._key=a;this.reset()},reset:function(){s.reset.call(this);this._doReset()},process:function(a){this._append(a);return this._process()},
finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(m){return{encrypt:function(f,b,e){return("string"==typeof b?c:a).encrypt(m,f,b,e)},decrypt:function(f,b,e){return("string"==typeof b?c:a).decrypt(m,f,b,e)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=l.mode={},x=function(a,f,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var e=0;e<b;e++)a[f+e]^=
c[e]},r=(d.BlockCipherMode=n.extend({createEncryptor:function(a,f){return this.Encryptor.create(a,f)},createDecryptor:function(a,f){return this.Decryptor.create(a,f)},init:function(a,f){this._cipher=a;this._iv=f}})).extend();r.Encryptor=r.extend({processBlock:function(a,f){var b=this._cipher,c=b.blockSize;x.call(this,a,f,c);b.encryptBlock(a,f);this._prevBlock=a.slice(f,f+c)}});r.Decryptor=r.extend({processBlock:function(a,b){var c=this._cipher,e=c.blockSize,d=a.slice(b,b+e);c.decryptBlock(a,b);x.call(this,
a,b,e);this._prevBlock=d}});b=b.CBC=r;r=(l.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,e=c<<24|c<<16|c<<8|c,d=[],l=0;l<c;l+=4)d.push(e);c=p.create(d,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:r}),reset:function(){v.reset.call(this);var a=this.cfg,c=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=a.createEncryptor;else b=a.createDecryptor,this._minBufferSize=1;this._mode=b.call(a,
this,c&&c.words)},_doProcessBlock:function(a,c){this._mode.processBlock(a,c)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var c=this._process(!0)}else c=this._process(!0),a.unpad(c);return c},blockSize:4});var e=d.CipherParams=n.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(l.format={}).OpenSSL={stringify:function(a){var c=a.ciphertext;a=a.salt;return(a?p.create([1398893684,
1701076831]).concat(a).concat(c):c).toString(q)},parse:function(a){a=q.parse(a);var c=a.words;if(1398893684==c[0]&&1701076831==c[1]){var b=p.create(c.slice(2,4));c.splice(0,4);a.sigBytes-=16}return e.create({ciphertext:a,salt:b})}},a=d.SerializableCipher=n.extend({cfg:n.extend({format:b}),encrypt:function(a,c,b,d){d=this.cfg.extend(d);var l=a.createEncryptor(b,d);c=l.finalize(c);l=l.cfg;return e.create({ciphertext:c,key:b,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,c,b,e){e=this.cfg.extend(e);c=this._parse(c,e.format);return a.createDecryptor(b,e).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a,this):a}}),l=(l.kdf={}).OpenSSL={execute:function(a,c,b,d){d||(d=p.random(8));a=w.create({keySize:c+b}).compute(a,d);b=p.create(a.words.slice(c),4*b);a.sigBytes=4*c;return e.create({key:a,iv:b,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:l}),encrypt:function(c,b,e,d){d=this.cfg.extend(d);e=d.kdf.execute(e,
c.keySize,c.ivSize);d.iv=e.iv;c=a.encrypt.call(this,c,b,e.key,d);c.mixIn(e);return c},decrypt:function(c,b,e,d){d=this.cfg.extend(d);b=this._parse(b,d.format);e=d.kdf.execute(e,c.keySize,c.ivSize,b.salt);d.iv=e.iv;return a.decrypt.call(this,c,b,e.key,d)}})}();
(function(){function u(b,a){var c=(this._lBlock>>>b^this._rBlock)&a;this._rBlock^=c;this._lBlock^=c<<b}function l(b,a){var c=(this._rBlock>>>b^this._lBlock)&a;this._lBlock^=c;this._rBlock^=c<<b}var d=CryptoJS,n=d.lib,p=n.WordArray,n=n.BlockCipher,s=d.algo,q=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],w=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,
55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],v=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],b=[{"0":8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,
2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,
1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{"0":1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,
75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,
276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{"0":260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,
14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,
17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{"0":2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,
98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,
1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{"0":128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,
10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,
83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{"0":268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,
2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{"0":1048576,
16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,
496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{"0":134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,
2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,
2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],x=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],r=s.DES=n.extend({_doReset:function(){for(var b=this._key.words,a=[],c=0;56>c;c++){var d=q[c]-1;a[c]=b[d>>>5]>>>31-d%32&1}b=this._subKeys=[];for(d=0;16>d;d++){for(var f=b[d]=[],l=v[d],c=0;24>c;c++)f[c/6|0]|=a[(w[c]-1+l)%28]<<31-c%6,f[4+(c/6|0)]|=a[28+(w[c+24]-1+l)%28]<<31-c%6;f[0]=f[0]<<1|f[0]>>>31;for(c=1;7>c;c++)f[c]>>>=
4*(c-1)+3;f[7]=f[7]<<5|f[7]>>>27}a=this._invSubKeys=[];for(c=0;16>c;c++)a[c]=b[15-c]},encryptBlock:function(b,a){this._doCryptBlock(b,a,this._subKeys)},decryptBlock:function(b,a){this._doCryptBlock(b,a,this._invSubKeys)},_doCryptBlock:function(e,a,c){this._lBlock=e[a];this._rBlock=e[a+1];u.call(this,4,252645135);u.call(this,16,65535);l.call(this,2,858993459);l.call(this,8,16711935);u.call(this,1,1431655765);for(var d=0;16>d;d++){for(var f=c[d],n=this._lBlock,p=this._rBlock,q=0,r=0;8>r;r++)q|=b[r][((p^
f[r])&x[r])>>>0];this._lBlock=p;this._rBlock=n^q}c=this._lBlock;this._lBlock=this._rBlock;this._rBlock=c;u.call(this,1,1431655765);l.call(this,8,16711935);l.call(this,2,858993459);u.call(this,16,65535);u.call(this,4,252645135);e[a]=this._lBlock;e[a+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});d.DES=n._createHelper(r);s=s.TripleDES=n.extend({_doReset:function(){var b=this._key.words;this._des1=r.createEncryptor(p.create(b.slice(0,2)));this._des2=r.createEncryptor(p.create(b.slice(2,4)));this._des3=
r.createEncryptor(p.create(b.slice(4,6)))},encryptBlock:function(b,a){this._des1.encryptBlock(b,a);this._des2.decryptBlock(b,a);this._des3.encryptBlock(b,a)},decryptBlock:function(b,a){this._des3.decryptBlock(b,a);this._des2.encryptBlock(b,a);this._des1.decryptBlock(b,a)},keySize:6,ivSize:2,blockSize:2});d.TripleDES=n._createHelper(s)})();

return OTHHUrlBuilder;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/help/impl/help',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"icon-help\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_help_impl_help', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/navigation.header/controls/help/help.view',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/help/impl/nls/localized.strings',
  'i18n', 'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/server.module/server.module.collection', 'csui/lib/othelp',
  'hbs!csui/widgets/navigation.header/controls/help/impl/help'
], function (module, _, $, Marionette, localizedStrings, i18n, TabableRegionBehavior,
    ServerModuleCollection, OTHHUrlBuilder, template) {
  'use strict';

  // Read configuration from the original place for compatibility.
  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/pages/start/impl/navigationheader/navigationheader.view'] || {};
  _.extend(config, module.config());
  config.help || (config.help = {});
  _.defaults(config.help, {
    language: i18n.settings.locale.replace(/[-_]\w+$/, ''),
    preserve: true
  });

  //Make sure the value provide by CS is not an empty string.
  //The othhURLBuilder does not account for empty strings, only
  //undefined values.
  if (config.help.urlRoot === '') {
    config.help.urlRoot = undefined;
  }
  if (config.help.tenant === '') {
    config.help.tenant = undefined;
  }
  if (config.help.type === '') {
    config.help.type = undefined;
  }

  var HelpView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#',
      title: localizedStrings.HelpIconTitle,
      'aria-label': localizedStrings.HelpIconAria
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HelpIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 50
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HelpView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(this, 'click:help', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.click(function () {
        self.triggerMethod('click:help');
      });
      this.$el.keydown(function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:help');
        }
      });
    },

    _onClick: function () {
      var serverModules = new ServerModuleCollection();

      serverModules
          .fetch()
          .then(function () {
            var modulesWithHelp;
            var urlBuilder;
            var documentsOptions;
            var helpURL;
            var browserTab;

            modulesWithHelp = serverModules.filter(function (serverModule) {
              return !!serverModule.get('helpDocId');
            });

            urlBuilder = new OTHHUrlBuilder({
              urlRoot: config.help.urlRoot
            });

            documentsOptions = {
              preserve: config.help.preserve,
              documents: []
            };
            _.each(modulesWithHelp, function (serverModule, index) {
              var currmodule = serverModule.get('helpDocId');
              documentsOptions.documents.push({
                module: currmodule,
                active: (index === 0),
                topic: (currmodule.indexOf('cssui') === 0 ? 'sui-overview-bg' : undefined)
              });
            });

            helpURL = urlBuilder.buildHelpUrl(config.help.language,
                documentsOptions, {
                  tenant: config.help.tenant,
                  type: config.help.type,
                  options: { search: 'allModules' }
            });

            browserTab = window.open(helpURL, '_blank');
            browserTab.focus();
	}, function (error) {
		console.error(error);
	});
    }
  });

  return HelpView;
});

csui.define('csui/widgets/navigation.header/controls/home/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/home/impl/nls/root/localized.strings',{
  HomeIconTitle: 'Home',
  HomeIconAria: 'Home page'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/home/impl/home',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-icon-home\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_home_impl_home', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/navigation.header/controls/home/home.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/home/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/application.scope.factory',
  'hbs!csui/widgets/navigation.header/controls/home/impl/home'
], function(_, $, Marionette, localizedStrings, TabableRegionBehavior,
    ApplicationScopeModelFactory, template) {
  'use strict';

  var HomeView = Marionette.ItemView.extend({
    tagName: 'a',

    className: 'csui-home binf-hidden',

    attributes: {
      href: '#',
      title: localizedStrings.HomeIconTitle,
      'aria-label': localizedStrings.HomeIconAria
    },

    ui: {
      homeButton: '.csui-icon-home'
    },

    events: {
      'click .csui-icon-home': 'onClickHomeIcon'
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HomeIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HomeView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(options.context, 'sync error', this._toggleVisibility);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this, 'click:home', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.click(function () {
        self.triggerMethod('click:home');
      });
      this.$el.keydown(function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:home');
        }
      });

    },

    onClickHomeIcon:function(e){
      e.preventDefault();
    },

    _toggleVisibility: function () {
      if (this._isRendered) {
        // Detect the user landing page.
        if (!this.applicationScope.id) {
          this.$el.addClass('binf-hidden');
        } else {
          this.$el.removeClass('binf-hidden');
        }
      }
    },

    _onClick: function () {
      this.applicationScope.set('id', '');
    }
  });

  return HomeView;
});

csui.define('csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/root/localized.strings',{
  ShowBreadcrumbs: 'Show Breadcrumbs',
  HideBreadcrumbs: 'Hide Breadcrumbs'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"javascript:;\" class=\"caret-show-breadcrumb\" style=\"display: none;\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbsAria || (depth0 != null ? depth0.showBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbsAria","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"csui-button-icon icon-expandArrowDown\"></span>\r\n</a>\r\n<a href=\"javascript:;\" class=\"caret-hide-breadcrumb\" style=\"display: none;\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbsAria || (depth0 != null ? depth0.hideBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbsAria","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"csui-button-icon icon-expandArrowUp\"></span>\r\n</a>\r\n<button type=\"button\" class=\"binf-btn binf-btn-default btn-show-breadcrumb\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbsAria || (depth0 != null ? depth0.showBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbsAria","hash":{}}) : helper)))
    + "\" style=\"display: none;\" aria-pressed=\"false\">\r\n    <span class=\"csui-button-icon icon-expandArrowDown\"></span> "
    + this.escapeExpression(((helper = (helper = helpers.showBreadcrumbs || (depth0 != null ? depth0.showBreadcrumbs : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showBreadcrumbs","hash":{}}) : helper)))
    + "\r\n</button>\r\n<button type=\"button\" class=\"binf-btn binf-btn-default btn-hide-breadcrumb\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbsAria || (depth0 != null ? depth0.hideBreadcrumbsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbsAria","hash":{}}) : helper)))
    + "\" style=\"display: none;\" aria-pressed=\"true\">\r\n    <span class=\"csui-button-icon icon-expandArrowUp\"></span> "
    + this.escapeExpression(((helper = (helper = helpers.hideBreadcrumbs || (depth0 != null ? depth0.hideBreadcrumbs : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideBreadcrumbs","hash":{}}) : helper)))
    + "\r\n</button>\r\n";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_breadcrumbs_impl_breadcrumbs', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node', 'csui/lib/radio',
  'hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior,
    ApplicationScopeModelFactory, NextNodeModelFactory, Radio, template) {
  'use strict';

  var BreadcrumbsView = Marionette.ItemView.extend({
    tagName: 'div',

    className: 'breadcrumbs-handle',

    ui: {
      caretShowBreadcrumbs: '.caret-show-breadcrumb',
      btnShowBreadcrumbs: '.btn-show-breadcrumb',
      caretHideBreadcrumbs: '.caret-hide-breadcrumb',
      btnHideBreadcrumbs: '.btn-hide-breadcrumb'
    },

    serializeData: function () {
      return {
        showBreadcrumbs: localizedStrings.ShowBreadcrumbs,
        showBreadcrumbsAria: localizedStrings.ShowBreadcrumbs,
        hideBreadcrumbs: localizedStrings.HideBreadcrumbs,
        hideBreadcrumbsAria: localizedStrings.HideBreadcrumbs,
      };
    },

    template: template,

    triggers: {
      'mouseenter .caret-show-breadcrumb .icon-expandArrowDown': 'mouseenter:caret:show:breadcrumbs',
      'mouseleave .btn-show-breadcrumb': 'mouseleave:btn:show:breadcrumbs',
      'click .caret-show-breadcrumb, .btn-show-breadcrumb': 'click:show:breadcrumbs',
      'mouseenter .caret-hide-breadcrumb .icon-expandArrowUp': 'mouseenter:caret:hide:breadcrumbs',
      'mouseleave .btn-hide-breadcrumb': 'mouseleave:btn:hide:breadcrumbs',
      'click .caret-hide-breadcrumb, .btn-hide-breadcrumb': 'click:hide:breadcrumbs'
    },

    events: {
      'focus': 'onFocus',
      'blur': 'onBlur',
      'keydown': 'onKeyInView'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (this.isBreadcrumbsHandleVisible()) {
        return this.$el;
      }
      return undefined;
    },

    constructor: function BreadcrumbsView(options) {
      Marionette.ItemView.call(this, options);

      this.ignoreNextMouseleave = false;
      this.ignoreFocusBlur = false;

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._showOrHideBreadcrumb)
          .listenTo(this, 'show:breadcrumbs', this.onShowBreadcrumbs)
          .listenTo(this, 'hide:breadcrumbs', this.onHideBreadcrumbs)
          .listenTo(this, 'before:destroy', this._stopReplying);
      this._startReplying();
    },

    _startReplying: function () {
      this.breadcrumbsChannel = Radio.channel('csui:breadcrumbs');
      this.breadcrumbsChannel.reply('hide:handle', this.hideBreadcrumbsHandle.bind(this))
                             .reply('arrow:up', this.showBreadcrumbsUpArrow.bind(this))
                             .reply('arrow:down', this.showBreadcrumbsDownArrow.bind(this));
    },

    _stopReplying: function () {
      this.breadcrumbsChannel.stopReplying();
    },

    _showOrHideBreadcrumb: function () {
      var hasNode = this.nextNode && this.nextNode.get('id') !== undefined;
      if (!hasNode) {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      }
    },

    onHideBreadcrumbs: function () {
      this.options.parentView.trigger('hide:breadcrumbs');
    },

    onShowBreadcrumbs: function () {
      this.options.parentView.trigger('show:breadcrumbs');
    },

    onFocus: function () {
      if (!this.ignoreFocusBlur) {
        if (this.breadcrumbVisible) {
          this.onMouseenterCaretHideBreadcrumbs();
        } else {
          this.onMouseenterCaretShowBreadcrumbs();
        }
      }
    },

    onBlur: function () {
      if (!this.ignoreFocusBlur) {
        if (this.breadcrumbVisible) {
          this.onMouseleaveBtnHideBreadcrumbs();
        } else {
          this.onMouseleaveBtnShowBreadcrumbs();
        }
      }
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:
        // tab
        this.ignoreFocusBlur = false;
        break;
      case 13:
      case 32:
        // enter or space key
        this.ignoreFocusBlur = false;
        if (this.breadcrumbVisible) {
          this.trigger('hide:breadcrumbs');
        } else {
          this.trigger('show:breadcrumbs');
        }
        break;
      }
    },

    onClickHideBreadcrumbs: function () {
      this.ignoreNextMouseleave = true;
      this.trigger('hide:breadcrumbs');
    },

    onClickShowBreadcrumbs: function () {
      this.ignoreNextMouseleave = true;
      this.trigger('show:breadcrumbs');
    },

    onMouseenterCaretShowBreadcrumbs: function () {
      this.ignoreFocusBlur = true;
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.btnHideBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'block'});
    },

    onMouseleaveBtnShowBreadcrumbs: function () {
      this.ignoreFocusBlur = false;
      if (!this.ignoreNextMouseleave) {
        this.ui.btnShowBreadcrumbs.css({display: 'none'});
        this.ui.btnHideBreadcrumbs.css({display: 'none'});
        this.ui.caretHideBreadcrumbs.css({display: 'none'});
        this.ui.caretShowBreadcrumbs.css({display: 'block'});
      }
      else {
        this.ignoreNextMouseleave = false;
      }
    },

    onMouseenterCaretHideBreadcrumbs: function () {
      this.ignoreFocusBlur = true;
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'none'});
      this.ui.btnHideBreadcrumbs.css({display: 'block'});
    },

    onMouseleaveBtnHideBreadcrumbs: function () {
      this.ignoreFocusBlur = false;
      if (!this.ignoreNextMouseleave) {
        this.ui.btnHideBreadcrumbs.css({display: 'none'});
        this.ui.btnShowBreadcrumbs.css({display: 'none'});
        this.ui.caretShowBreadcrumbs.css({display: 'none'});
        this.ui.caretHideBreadcrumbs.css({display: 'block'});
      }
      else {
        this.ignoreNextMouseleave = false;
      }
    },

    isBreadcrumbsHandleVisible: function () {
      return this.ui.btnHideBreadcrumbs.css('display') !== 'none' ||
             this.ui.caretHideBreadcrumbs.css('display') !== 'none' ||
             this.ui.btnShowBreadcrumbs.css('display') !== 'none' ||
             this.ui.caretShowBreadcrumbs.css('display') !== 'none';
    },

    hideBreadcrumbsHandle: function () {
      this.ui.btnHideBreadcrumbs.css({display: 'none'});
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'none'});
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.triggerMethod("refresh:tabindexes");
    },

    showBreadcrumbsUpArrow: function () {
      this.breadcrumbVisible = true;
      this.hideBreadcrumbsHandle();
      this.ui.caretHideBreadcrumbs.css({display: 'block'});
      this.triggerMethod("refresh:tabindexes");
    },

    showBreadcrumbsDownArrow: function () {
      this.breadcrumbVisible = false;
      this.hideBreadcrumbsHandle();
      this.ui.caretShowBreadcrumbs.css({display: 'block'});
      this.triggerMethod("refresh:tabindexes");
    }
  });

  return BreadcrumbsView;
});

csui.define('csui/widgets/search.box/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.box/impl/nls/root/lang',{
  placeholder: 'Search',
  clearerTitle: 'Clear keywords',
  searchBoxTitle: 'Enter your search term',
  searchOptionsTitle: 'Show search options',
  searchFromHere: 'Search from here',
  searchIconTitle: 'Search',
  searchIconAria: 'Search in Content Server',
  searchOptionsSelect: 'Select: ',
  startSearch: 'Start search',
  searchLandmarkAria: 'Global content search'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.box',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <button type=\"button\" class=\"icon-expandArrowDown csui-search-box-slice-popover\"\r\n              data-binf-toggle=\"popover\" data-placement=\"bottom\"\r\n              title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchOptionsTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchOptionsTitle : stack1), depth0))
    + "\"\r\n              aria-haspopup=\"true\" aria-expanded=\"false\"></button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "        <div class=\"csui-search-options-dropdown\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"search-bar\" style=\"display: none;\" role=\"dialog\">\r\n  <div class=\"search-bar-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showOptionsDropDown : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    <div class=\"csui-search-input-container\">\r\n      <input type=\"search\" class=\"csui-input\" placeholder=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"\r\n             title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBoxTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBoxTitle : stack1), depth0))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showOptionsDropDown : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n    <span class=\"csui-clearer formfield_clear\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.clearerTitle : stack1), depth0))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.clearerTitle : stack1), depth0))
    + "\" role=\"button\"></span>\r\n  </div>\r\n</div>\r\n<div role=\"search\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchLandmarkAria : stack1), depth0))
    + "\">\r\n  <a href=\"javascript:void(0);\"\r\n     class=\"icon icon-global-search icon-header-search csui-header-search-icon csui-acc-focusable\"\r\n     title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchIconTitle : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchIconAria : stack1), depth0))
    + "\"\r\n     aria-expanded=\"false\"></a>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.box', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.slices.popover',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "    <div class=\"csui-search-popover-row\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.select : depth0), depth0))
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceDisplayName : depth0), depth0))
    + "\" tabindex=\"-1\">\r\n      <div class=\"csui-search-popover-row-body\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\">\r\n        <div class=\"csui-search-popover-checked\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\"\r\n             id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\" aria-hidden=\"true\"></div>\r\n        <div class=\"csui-search-popover-label\" data-sliceid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceId : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sliceDisplayName : depth0), depth0))
    + "</div>\r\n      </div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-search-slice-container\">\r\n  <div class=\"csui-search-slice-container-first\"></div>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.slices : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"csui-search-slice-container-last\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.slices.popover', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.box/impl/search.slice.dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-selected-checkbox csui-slice-checkbox csui-checkbox-primary\">\r\n  <input type=\"checkbox\" "
    + this.escapeExpression(((helper = (helper = helpers.checked || (depth0 != null ? depth0.checked : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checked","hash":{}}) : helper)))
    + " class=\"csui-searchbox-option\" name=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeId : depth0), depth0))
    + "\" id=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeIdSO : depth0), depth0))
    + "\"\r\n         value=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeId : depth0), depth0))
    + "\">\r\n  <label class=\"csui-search-slice-name csui-selectlabel\" for=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeIdSO : depth0), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.fromHere : depth0), depth0))
    + " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeName : depth0), depth0))
    + "\">\r\n          <span class=\"cs-ellipsis\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.fromHere : depth0), depth0))
    + " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.nodeName : depth0), depth0))
    + "</span>\r\n  </label>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.box_impl_search.slice.dropdown', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.box/impl/search.box',[],function(){});
csui.define('csui/widgets/search.box/search.box.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/node/node.model', 'csui/utils/contexts/factories/search.box.factory',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/widgets/search.box/impl/nls/lang',
  'csui/utils/namedsessionstorage',
  'hbs!csui/widgets/search.box/impl/search.box',
  'hbs!csui/widgets/search.box/impl/search.slices.popover',
  'hbs!csui/widgets/search.box/impl/search.slice.dropdown', 'i18n',
  'css!csui/widgets/search.box/impl/search.box',
  'csui/lib/jquery.ui/js/jquery-ui', 'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, NodeModel, SearchBoxFactory,
    SearchQueryModelFactory, TabableRegionBehavior, lang, NamedSessionStorage, template,
    SlicePopOverTemplate, SliceDropDownTemplate, i18n) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showOptionsDropDown: true,
    showSearchInput: false,
    showInput: false,
    inputValue: '',
    slice: '',
    nodeId: '',
    nodeName: '',
    searchFromHere: true,
    customSearchIconClass: "icon-header-search",
    customSearchIconNoHoverClass: "icon-header-search-nohover",
    customSearchIconEnabledClass: "icon-header-search_enabled"
  });

  var SearchBoxView = Marionette.ItemView.extend({
    className: 'csui-search-box',
    template: template,
    templateHelpers: function () {
      var messages = {
        showOptionsDropDown: this.options.data.showOptionsDropDown,
        placeholder: this.options.data.placeholder || lang.placeholder,
        clearerTitle: lang.clearerTitle,
        searchIconTitle: lang.searchIconTitle,
        searchIconAria: lang.searchIconAria,
        searchBoxTitle: lang.searchBoxTitle,
        searchOptionsTitle: lang.searchOptionsTitle,
        searchOptionsSelect: lang.searchOptionsSelect,
        startSearch: lang.startSearch,
        searchLandmarkAria: lang.searchLandmarkAria
      };
      return {
        messages: messages
      };
    },
    slicePopOverTemplate: SlicePopOverTemplate,
    sliceDropDownTemplate: SliceDropDownTemplate,
    namedSessionStorage: new NamedSessionStorage(),
    ui: {
      input: '.csui-input',
      clearer: '.csui-clearer',
      searchIcon: '.csui-header-search-icon',
      downCaret: '.csui-search-box-slice-popover'
    },
    events: {
      'click @ui.searchIcon': 'searchIconClicked',
      'keydown .csui-header-search-icon': 'searchIconKeyPressed',
      'click @ui.input': 'hidePopover',
      'keydown @ui.input': 'inputTyped',
      'paste @ui.input': 'inputChanged',
      'change @ui.input': 'inputChanged',
      'click @ui.clearer': 'clearerClicked',
      'keydown @ui.clearer': 'keyDownOnClear',
      'click .csui-search-popover-row': 'setSlices',
      'click .csui-searchbox-option': 'selectSearchOption',
      'click .csui-search-box-slice-popover': 'prepareSlicepopover',
      'focusout .csui-search-box-slice-popover': 'focusOutSlicePopover',
      'keydown .csui-search-box-slice-popover': 'accessibility',
      'keydown .csui-search-popover-row': 'accessibility',
      'focusout @ui.input': 'hideSearchOptionsDropDown',
      'focusout .csui-search-popover-row': 'focusOutSlicePopoverRow',
      'mouseup .csui-search-popover-row': 'togglePopover',
      'touchend .csui-search-popover-row': 'togglePopover',
      'focusout .csui-searchbox-option': 'hideSearchOptionsDropDown',
      'mouseleave .csui-search-options-dropdown': 'hideSearchOptionsDropDown'
    },

    currentlyFocusedElement: 'a.csui-acc-focusable',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function SearchBoxView(options) {
      options || (options = {});
      options.data = _.defaults({}, options.data, config);
      this.direction = i18n.settings.rtl ? 'left' : 'right';

      var context = options.context;
      if (!options.model) {
        options.model = context.getModel(SearchQueryModelFactory);
      }

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'change:where', this._updateInput);
      if (this.options.data.showOptionsDropDown) {
        // Enable pre-fetching from /app, which sets the initial
        // response via the context model factory.
        this.searchBoxFactory = context.getFactory(SearchBoxFactory);
        this.searchboxModel = this.searchBoxFactory.property;
        this.listenTo(context, 'sync:perspective', this._perspectiveSynced);
        this.listenTo(context, 'sync', this._dataSynced);
        this.listenTo(this.searchboxModel, "change", this.prepareSlicepopover);
        this.listenTo(this.searchboxModel, "change", this.prepareOptionsdropdown);
        this.listenTo(this.searchboxModel, "change", this.searchIconToggle);
      }
      if (!!this.model.get("where") || this.options.data.showSearchInput) {
        $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      }
      $(document).on('keydown', this, this._shortcutToQuery);
    },

    _shortcutToQuery: function (event) {
      // CTRL+F3: shortcut to Query/Search
      if (event.ctrlKey && event.keyCode == 114) {
        var self = event.data;
        if (self.isSearchInputVisible()) {
          self.ui.input.focus();
        } else {
          self.searchIconClicked();
        }
      }
    },

    onBeforeDestroy: function () {
      $(document).off('keydown', this._shortcutToQuery);
    },

    isSearchbarVisible: function () {
      return this.$('.search-bar').is(':visible');
    },

    isSearchInputVisible: function () {
      return this.$('.csui-input').is(':visible');
    },

    focusOutSlicePopover: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
      }
      this.toggleIcon(event);
    },

    focusOutSlicePopoverRow: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        if (event.relatedTarget &&
            !event.relatedTarget.classList.contains("csui-search-box-slice-popover")) {
          this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
        }
      }
    },

    _perspectiveSynced: function (context, perspectiveSource) {
      if (perspectiveSource instanceof NodeModel &&
          perspectiveSource.get('container')) {
        this.searchboxModel.nodeId = perspectiveSource.get('id');
        this.searchboxModel.nodeName = perspectiveSource.get('name');
        this.namedSessionStorage.set(this.searchboxModel.nodeId, this.searchboxModel.nodeName);
        this.searchboxModel.trigger("change");
      } else {
        this.searchboxModel.nodeId = undefined;
        this.searchboxModel.nodeName = undefined;
        this.searchboxModel.trigger("change");
      }
    },

    _dataSynced: function (context, perspectiveSource) {
      if (!this.searchboxModel.fetched) {
        this.searchBoxFactory.fetch();
      }
    },

    onRender: function (event) {
      if (this.options.data.showSearchInput) {
        this.$el.find(".search-bar").show();
        this.searchIconToggle();
      }
      var value = this.options.data.inputValue || this.model.get('where');
      this.slice = this.options.data.slice || this.model.get('slice');
      if (value) {
        this._setInputValue(value);
        this.$el.find(".search-bar").show();
      }
      if (this.options.data.showInput || value) {
        this.triggerMethod('before:show:input', this);
        this.ui.input.show();
        this.triggerMethod('show:input', this);
      }

      if (event && event.data) {
        this.$el.find('.csui-search-box .csui-header-search-icon').removeClass(
            event.data.options.data.customSearchIconEnabledClass).addClass(
            event.data.options.data.customSearchIconClass);
      }

    },

    prepareSlicepopover: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (this.searchboxModel.attributes.slices) {
          for (var slice in this.searchboxModel.attributes.slices) {
            if (this.searchboxModel.attributes.slices.hasOwnProperty(slice)) {
              this.searchboxModel.attributes.slices[slice].select = lang.searchOptionsSelect;
            }
          }
          this.$el.find('.csui-search-box-slice-popover').binf_popover({
            content: this.slicePopOverTemplate(this.searchboxModel.attributes),
            html: true
          });
          var titleVal = this.$el.find('.csui-search-box-slice-popover').attr(
              'data-original-title');
          if (!titleVal) { // TODO why is this needed to get a stable title?
            titleVal = lang.searchOptionsTitle;
          }
          this.$el.find('.csui-search-box-slice-popover').attr('title', titleVal);
          if (this.slice) {
            this._setSliceValue(this.slice);
          }
        }
        if ($('.search-bar').is(':visible')) {
          $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        }
      }
      this.toggleIcon(e); //toggle the 'downcart' based on if popover is open or not.

    },

    toggleIcon: function (e, isToggle) {
      if (!!e && e.type === "click" && this.ui.downCaret.hasClass('dropup') ||
          (!!e && e.type === "focusout" &&
           this.$(".binf-popover").find(e.relatedTarget).length === 0) || !!isToggle) {//handle click and focusout.
        this.ui.downCaret.removeClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'false');
      } else if ($('.search-bar-content .binf-popover').is(":visible")) {
        this.ui.downCaret.addClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'true');
      }
    },

    accessibility: function (event) {
      var e     = this.$el.find('.csui-search-slice-container'),
          elms  = e.children('.csui-search-popover-row'),
          index = elms.index(elms.filter('.active'));

      if (event.keyCode === 13 && $(elms[index]).hasClass('active')) {
        $(elms[index]).trigger('click');
        this.togglePopover(event);
      } else if (event.keyCode === 32 &&
                 this.$el.find(document.activeElement).is('.csui-search-box-slice-popover')) {
        event.preventDefault();
        this.ui.downCaret.trigger('click');
      } else if (event.keyCode === 9 || event.keyCode === 27) {
        $('.csui-search-box-slice-popover').binf_popover('hide');
        this.ui.downCaret.focus();
        this.toggleIcon(event, true);
      } else {
        if (event.keyCode === 38 || event.keyCode === 40) {
          $(elms).removeClass('active');
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.downCaret.focus();
          } else {
            $(elms[index]).addClass('active').focus();
          }
        }
      }

    },

    togglePopover: function (event) {
      var that = this;
      setTimeout(function () {
        var canHidePopover         = that.$el.find(document.activeElement).is(
            '.csui-search-popover-row,.csui-search-box-slice-popover'),
            canSetFocusOnDownCaret = (event.keyCode === 13 || event.type === 'mouseup' ||
                                      event.type === 'touchend');
        if (canHidePopover || canSetFocusOnDownCaret) {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        if (canSetFocusOnDownCaret) {
          that.ui.downCaret.focus();
        }
      }, 100);
      this.toggleIcon(event, true); //always show drop-down icon. therefore, send "true" flag.
    },

    hidePopover: function (event) {
      if (this.options.data.showOptionsDropDown) {
        if ($('.csui-search-box-slice-popover').css("display") === "block") {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        this.showOptionsDropdown(event);
      }
    },

    resetPageDefaults: function (event) {
      this.model.resetDefaults = true;
    },

    searchIconKeyPressed: function (event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        this.searchIconClicked(event);
      }
    },

    searchIconClicked: function (event) {
      this.ui.searchIcon.attr('aria-expanded', 'true');
      // TODO: Need to handle click events on csui controls.
      $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      this.resetPageDefaults(event);
      if (this.options.data.showOptionsDropDown) {
        this.searchboxModel.nodeId !== undefined ?
        (this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere) :
        "";
      }
      if ($('.search-bar').is(':visible')) {
        var value = this.ui.input.val().trim();
        if (!!value) {
          this._setInputValue(value);
          $(event.currentTarget).attr("title", lang.startSearch);
          this.trigger("hide:breadcrumbspanel");
        }
        var searchOption = "",
            _selOption   = this.$el.find(".csui-searchbox-option:checked");
        if (this.options.data.showOptionsDropDown) {
          if (!!_selOption) {
            searchOption = _selOption.val();
          }
        } else {
          searchOption = this.options.data.nodeId;
        }

        if (!!history.state && !!history.state.search) {
          this.previousState = history.state.search;
        }
        if (!!value) {
          this._setSearchQuery(value, this.options.sliceString, searchOption, event);
          this._updateInput();
          if (!this.options.data.searchFromHere) {
            this.destroyOptionspopover();
          }
          this.options.data.searchFromHere = true;
        }
        if (!!this.previousState) {
          this.model["prevSearchState"] = this.previousState;
        }
      } else {
        var that = this;
        $('.search-bar').show('blind', {direction: this.direction}, '200', function () {
          that.ui.input.focus();
          that.ui.input.prop('tabindex', 0);
          that.ui.downCaret.prop('tabindex', 0);
        });
        this._updateInput();
        $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        if (this.options.data.showOptionsDropDown) {
          this.prepareSlicepopover();
        }
        if (this.model.attributes.where === "") {
          event.currentTarget.title = "";
          $(event.currentTarget).addClass(this.options.data.customSearchIconNoHoverClass);
        }
      }

    },

    _setSliceValue: function (sliceVal) {
      if ($('[id^="popover"]').css("display") === "block") {
        if (!!sliceVal && sliceVal !== "{}") {
          this.$el.find("#" + sliceVal.substring(1, sliceVal.length - 1)).addClass(
              "icon-listview-checkmark");
        }
      }
    },

    inputTyped: function (event) {
      var value = this.ui.input.val().trim();
      if (event.which === 13) {
        event.preventDefault();
        event.stopPropagation();
        this._setInputValue(value);
        if (!!value) {
          this.searchIconClicked(event);
        }
        if (this.previousValue != value) {
          this.previousValue = value;
        }
      }
      else {
        if (event.which === 40 && $('.csui-search-options-dropdown').is(':visible')) {
          this.$el.find('.csui-searchbox-option').focus();
        }
        else {
          this.inputChanged(event);
        }
      }
    },

    inputChanged: function (event) {
      var value = this.ui.input.val();
      this.ui.clearer.prop('tabindex', value !== '' ? 0 : -1);
      this.searchIconToggle();
      this.ui.clearer.toggle(!!value.length);
      if (this.options.data.showOptionsDropDown) {
        this.showOptionsDropdown(event);
      }
    },

    showOptionsDropdown: function (event) {
      if (this.options.data.showOptionsDropDown) {
        var _e = event || window.event;
        if (this.searchboxModel.nodeId && _e.keyCode !== 27) {
          this.$el.find('.csui-search-options-dropdown').show();
          this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere;
        }
      }
    },

    prepareOptionsdropdown: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (!this.searchboxModel.nodeId && this.model.get('location_id1')) {
          this.searchboxModel.nodeId = this.model.get('location_id1');
          if (!!this.namedSessionStorage.get(this.searchboxModel.nodeId)) {
            this.searchboxModel.nodeName = this.namedSessionStorage.get(this.searchboxModel.nodeId);
          }
        }
        if (this.searchboxModel.nodeId) {
          this.searchOptions = {};
          this.searchOptions.nodeId = this.searchboxModel.nodeId;
          this.searchOptions.nodeIdSO = _.uniqueId('csui-so-' + this.searchboxModel.nodeId);
          if (!this.searchboxModel.nodeName && this.options.data.nodeName) {
            this.searchboxModel.nodeName = this.options.data.nodeName;
          }
          if (this.searchboxModel.nodeName) {
            this.searchOptions.nodeName = " (" + this.searchboxModel.nodeName + ")";
          }
          this.searchOptions.select = lang.searchOptionsSelect;
          this.searchOptions.fromHere = lang.searchFromHere;
          this.searchOptions.checked = this.options.data.searchFromHere ? 'checked' : '';
          var content = this.sliceDropDownTemplate(this.searchOptions);
          this.$el.find('.csui-search-options-dropdown').html(content);
          this.hideSearchOptionsDropDown();
        } else {
          this.destroyOptionspopover();
        }
      }
    },

    destroyOptionspopover: function (e) {
      // if node is not available destroy the search options dropdown
      this.$el.find('.csui-search-options-dropdown').html("");
      this.$el.find('.csui-search-options-dropdown').hide();
    },

    selectSearchOption: function (e) {
      var _selEle = this.$el.find(".csui-searchbox-option:checked");
      if (_selEle.length > 0) {
        this.options.data.searchFromHere = true;
      } else {
        this.options.data.searchFromHere = false;
      }
    },

    hideSearchOptionsDropDown: function () {
      var that = this;
      setTimeout(function () {
        if (that.$el.find('.csui-searchbox-option')[0] === document.activeElement) {
          return false;
        } else if (that.options.data.showOptionsDropDown) {
          var self = that;
          if (that.popoverTimer) {
            clearTimeout(that.popoverTimer);
          }
          that.popoverTimer = setTimeout(function () {
            self.showSearchOptionDropDown();
          }, 800);
          return true;
        }
      }, 100);
    },

    showSearchOptionDropDown: function () {
      if (this.options.data.showOptionsDropDown) {
        if (!$('.csui-search-options-dropdown').is(":hover")) {
          $('.csui-search-options-dropdown').hide();
        } else {
          if (this.popoverTimer) {
            clearTimeout(this.popoverTimer);
          }
        }
      }
    },

    keyDownOnClear: function (event) {
      if (event.keyCode === 13) {
        this.clearerClicked(event);
      }
    },
    clearerClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this._setInputValue('');
      this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
          this.options.data.customSearchIconClass);
      this.hidePopover(event);
      this.ui.input.focus();
    },

    _setSearchQuery: function (value, sliceString, searchOption, event) {
      this.model.clear({silent: true});
      var params = {};
      if (!!sliceString) {
        params['slice'] = sliceString;
      }
      if (!!searchOption) {
        params['location_id1'] = searchOption;
      }
      if (value) {
        params['where'] = value;
      }
      this.model.set(params);
      this.hidePopover(event);
    },

    setSlices: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var sliceId           = $(e.target).data("sliceid"),
          _checkedEle       = this.$el.find(".csui-search-popover-checked"),
          _toggleCurrentEle = this.$el.find(".icon-listview-checkmark"),
          _isCurrentEle     = _toggleCurrentEle.length > 0 &&
                              _toggleCurrentEle.attr("id") === $(e.target).data("sliceid") + "";
      this.options.sliceString = "";
      $(_checkedEle).removeClass("icon-listview-checkmark");
      if (!_isCurrentEle) {
        $("#" + sliceId).addClass("icon-listview-checkmark");
        this.options.sliceString = "{" + sliceId + "}";
      }
      this.slice = this.options.sliceString;
    },

    _hideSearchBar: function (event) {
      var _e  = event || window.event,
          ele = $('.search-bar');
      if (ele.is(':visible')) {
        if ((_e.type === 'keydown' && (_e.keyCode === 27 || _e.which === 27) &&
             !$('.search-bar-content .binf-popover').is(":visible")) ||
            (!$(_e.target).closest(ele).length &&
            _e.type === 'click') && !$(_e.target).closest('.csui-header-search-icon').length &&
            !$(_e.target).closest('.esoc-activityfeed-invisiblebutton').length) {
          $(this).find("." + event.data.options.data.customSearchIconNoHoverClass).removeClass(
              event.data.options.data.customSearchIconNoHoverClass);
          $(this).find('.csui-input').val('');
          $(this).find(ele).hide('blind', {direction: event.data.direction}, '200', function () {
            $(".binf-navbar-brand").addClass("binf-navbar-collapse");
          });
          $(this).find('.csui-search-box-slice-popover').binf_popover('hide');
          $(this).find('.csui-search-box .csui-header-search-icon')[0].title = lang.searchIconTitle;
          $($(this).find('.csui-search-box .csui-header-search-icon')[0]).attr("aria-expanded",
              'false');
          event.data.slice = event.data.model.get('slice');
          event.data.options.data.searchFromHere = true;
          $(this).find('.csui-search-options-dropdown').hide();
          $(this).find('.csui-search-box .csui-header-search-icon').removeClass(
              event.data.options.data.customSearchIconEnabledClass).addClass(
              event.data.options.data.customSearchIconClass);

          $(document).unbind('click.' + this.cid + ' keydown.' + this.cid);

          var view = event.data;
          view.trigger("hide:searchbar");
          $('.csui-search-box-slice-popover').prop('tabindex', -1);
          $('.csui-input').prop('tabindex', -1);

        }
      }
    },
    _updateInput: function () {
      if (this._isRendered) {
        var value = this.model.get('where') || '';
        this._setInputValue(value);
      }
    },
    _setInputValue: function (value) {
      this.ui.input.val(value);
      this.ui.clearer.toggle(!!value.length);
      this.searchIconToggle();
      if (this.options.data.showOptionsDropDown) {
        this.options.data.nodeName = this.searchboxModel.nodeName;
      }
    },
    searchIconToggle: function () {
      var value = this.ui.input.val().trim();
      if (!!value) {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconClass).addClass(
            this.options.data.customSearchIconEnabledClass);
        this.ui.input.addClass("csui-input-focus");
        $(this.ui.searchIcon).attr("title", lang.startSearch);
        $(this.ui.searchIcon).removeClass(this.options.data.customSearchIconNoHoverClass);
      } else {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
            this.options.data.customSearchIconClass);
        this.ui.input.removeClass("csui-input-focus");
        if ($('.search-bar').is(':visible')) {
          $(this.ui.searchIcon).attr("title", lang.searchBoxTitle).addClass(
              this.options.data.customSearchIconNoHoverClass);
        }
      }
    }

  });

  return SearchBoxView;

});

csui.define('csui/widgets/navigation.header/controls/search/search.view',[
  'csui/widgets/search.box/search.box.view',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/controls/globalmessage/globalmessage'
], function (SearchBoxView, SearchQueryModelFactory, GlobalMessage) {
  'use strict';

  var SearchView = SearchBoxView.extend({
    constructor: function SearchView(options) {
      SearchBoxView.call(this, options);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.listenTo(this.searchQuery, 'change', this._updateBreadcrumbs);
    },

    onRender: function () {
      var resizetrigger = function () { GlobalMessage.trigger('resize'); };
      this.listenTo(this, 'hide:input', resizetrigger);
      this.listenTo(this, 'show:input', resizetrigger);
      this.listenTo(this, 'hide:breadcrumbspanel', function () {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      });
    },

    _updateBreadcrumbs: function () {
      if (this.searchQuery.get('query_id')) {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      }
    }
  });

  return SearchView;
});

csui.define('csui/widgets/navigation.header/controls/favorites/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/controls/favorites/impl/nls/root/localized.strings',{
  FavoritesIconTitle: 'Favorites',
  FavoritesTitleAria: 'Content Server Favorites'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/favorites/impl/favorites',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-favorites-icon-container\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.favoritesTitleAria || (depth0 != null ? depth0.favoritesTitleAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"favoritesTitleAria","hash":{}}) : helper)))
    + "\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n  <span class=\"csui-icon-favorites favorite_header_icon\"></span>\r\n</div>\r\n<div class=\"csui-favorites-view-container\"></div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_favorites_impl_favorites', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/favorites/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/favorites/impl/nls/root/lang',{
  dialogTitle: 'Favorites',
  searchPlaceholder: 'Search Favorites',
  searchAria: 'Search for favorites',
  expandAria: 'Expand the Favorites widget',
  emptyGroupDefaultText: 'This group is empty.',
  emptyListText: 'There are no items to display.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.',
  emptyGroupText: 'Adding content to your Favorites list makes it a breeze to find.',
  deleteGroupConfirmatonTitle: 'Delete group',
  deleteGroupConfirmatonText: 'Are you sure you want to delete this group? All the favored items' +
                              ' in this group will also be deleted.',
  deleteGroupButtonLabel: 'Delete',
  deleteGroupButtonAria: 'Delete favorite group',
  editGroupButtonLabel: 'Edit',
  editGroupButtonAria: 'Edit favorite group name',
  errorFavoritesSaveFailed: 'Saving favorites failed.',
  errorFavoriteGroupSaveFailed: 'Saving favorites group failed.',
  favoriteColumnNameTitle: 'Favorite name',
  favoritesGroupAria: '{0}, Favorites Group',
  favoritesEmptyGroupAria: '{0}, Empty Favorites Group',
  favoriteGroupsNavAria: 'Favorites Groups',
  fav_ungrouped: 'Ungrouped',
  fav_ungroupedAria: 'Ungrouped favorites',
  groupAdd: 'Add group',
  groupAddButtonTitle: 'Add a new favorites group',
  groupHint1: 'To personalize the Favorites tile, you can push your favorite group to the top.',
  groupHint2: 'You can also re-order items within the groups, so that your most favorite items appear at the top of the Favorites tile.',
  addFav: 'Add Favorite',
  removeFav: 'Remove Favorite',
  updateFavoriteFailTitle: 'Update Favorite',
  updateFavoriteFailMessage: 'Failed to update favorite for node "{0}". \n\n{1}',
  addFavoriteNameLabel: 'Favorite name',
  addFavoriteNamePlaceHolder: 'Enter name',
  addFavoriteGroupLabel: 'Group',
  addFavoriteAddButtonLabel: 'Add',
  addFavoriteCancelButtonLabel: 'Cancel',
  addFavoriteCancelButtonAria: 'Cancel editing favorite group name',
  nameErrorMaxLengthExceed: 'Name cannot be longer than 248 characters.',
  nameErrorContainSemiColon: 'Name cannot contain a colon.',
  startEditMode: 'Edit',
  endEditMode: 'Done'
});



csui.define('css!csui/widgets/favorites/impl/favorites.view',[],function(){});
// Shows a list of links to favorite nodes
csui.define('csui/widgets/favorites/favorites.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/favorites2', 'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/listitem/simpletreelistitem.view',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view', 'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorites2', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'css!csui/widgets/favorites/impl/favorites.view'
], function ($, _, Backbone, Marionette,
    Favorite2CollectionFactory, ListView, StandardListItem, SimpleTreeListView,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    Favorite2GroupsCollectionFactory, Favorite2Collection,
    NodeTypeIconView, BlockingView, lang) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var FavoritesView = ListView.extend({

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria
        // "hideSearch: true" could be used to get get rid of the search option
      };
    },

    events: {
      'click .tile-expand': 'onMoreLinkClick'
    },

    behaviors: {
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/favorites/impl/favorites2.table.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: 'icon-tileCollapse',
        dialogClassName: 'favorites'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    getChildView: function (item) {
      if (this.showFlatList) {
        return StandardListItem;
      } else {
        return SimpleTreeListView;
      }
    },

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          if (this instanceof StandardListItem) {
            return {
              name: this.model.get('favorite_name'),
              enableIcon: true,
              showInlineActionBar: this.showInlineActionBar
            };
          } else {
            var ariaName;
            var name = this.model.get('name');
            if (this.model.childrenCollection && this.model.childrenCollection.length === 0) {
              ariaName = _.str.sformat(lang.favoritesEmptyGroupAria, name);
            } else {
              ariaName = _.str.sformat(lang.favoritesGroupAria, name);
            }
            return {
              icon: 'mime_fav_group32',
              name: name,
              ariaName: ariaName,
              expand: this.model.searchMode
            };
          }
        },

        childViewTemplateHelpers: function () {
          return {
            icon: this.model.get('icon'),
            name: this.model.get('favorite_name'),
            text: lang.emptyGroupDefaultText,
            showInlineActionBar: this.showInlineActionBar
          };
        },
        checkDefaultAction: true,
        context: this.context,
        //Set these values inorder to disaply Inline Actions
        toolbarData: this.toolbarData

      };
    },

    childEvents: {
      'click:item': '_onClickItem',  // event for flat list
      'click:tree:item': '_onClickTreeItem',
      'click:tree:header': '_onClickTreeHeader',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    constructor: function FavoritesView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'favorite_name asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-favourites';

      this.completeCollection = options.collection ||
                                options.context.getCollection(
                                    Favorite2GroupsCollectionFactory,
                                    {detached: true, permanent: true}
                                );
      var limitedRS = Favorite2CollectionFactory.getLimitedResourceScope();
      this.completeCollection.favorites.setResourceScope(limitedRS);

      var ViewCollection = Backbone.Collection.extend({
        model: this.completeCollection.model
      });
      options.collection = new ViewCollection();
      this.showInlineActionBar = !accessibleTable &&
        (options.showInlineActionBar === false ? options.showInlineActionBar : true);

      ListView.prototype.constructor.apply(this, arguments);

      BlockingView.imbue(this);

      // TODO: Set up collection parameters here to get the best performance;
      // set up both this.completeCollection and this.completeCollection.favorites
      // Node: must listen for sync to update when new model was successfully saved, otherwise
      // it would show up empty.
      this.listenTo(this.completeCollection, 'update sync',
          _.bind(this._synchronizeCollections, this));

      this._synchronizeCollections();

      this.listenTo(this, 'render', this._onRender);
      this.listenTo(this, 'change:filterValue', this._synchronizeCollections);

      if (this.showInlineActionBar) {
        options.tileViewToolbarItems = 'csui/widgets/favorites/tileview.toolbaritems';
        this.context = options.context;
        this.toolbarData = {
          toolbaritems: options.tileViewToolbarItems,
          collection: this.completeCollection.favorites
        };
      }
    },

    _onRender: function () {
      this.$el.addClass('cs-favorites');
      this.completeCollection.ensureFetched();
      this.$el.on('keydown', _.bind(this.onKeyDown, this));
      // the parent view is always rendered first with its current collection
      this._updateAccAttributes();
    },

    _updateAccAttributes: function () {
      // remove existing attributes first
      this.$el.find('.tile-content').removeAttr('role aria-expanded');
      this.$el.find('.tile-content > .binf-list-group').removeAttr('role');

      // set attributes
      this.$el.find('.tile-content')
          .attr('aria-label', this.options.data.title || lang.dialogTitle);
      if (this.showFlatList) {  // flat list
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'listbox');
      } else {  // tree list
        this.$el.find('.tile-content')
            .attr('role', 'tree')
            .attr('aria-expanded', 'true');
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'group');
      }
    },

    onRenderCollection: function () {
      // the collection can optionally be synced later, needs to update accessibility attributes
      this._updateAccAttributes();
    },

    onRenderItem: function (childView) {
      if (this.showFlatList) {
        childView._nodeIconView = new NodeTypeIconView({
          el: childView.$('.csui-type-icon').get(0),
          node: childView.model
        });
        childView._nodeIconView.render();
      }
      if (this.showFlatList) {
        childView.$el.attr('role', 'option');
      } // for tree view the role is set in the simpletreelistitem
    },

    onBeforeDestroyItem: function (childView) {
      if (this.showFlatList && childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    _onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    _onClickTreeItem: function (target, src) {
      this.triggerMethod('execute:defaultAction', src.model);
    },

    _onClickTreeHeader: function (target) {
      // tree list view expands or collapses, update the scrollbar
      this.trigger('update:scrollbar');
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('expand');
    },

    _synchronizeCollections: function () {
      var self = this;
      var connector = this.completeCollection.connector;
      var firstGroup = this.completeCollection.at(0);
      var favoritesCollection;
      var filterObj = {};
      filterObj['favorite_name'] = this.options.filterValue;

      if (this.completeCollection.length === 1 && firstGroup.get('tab_id') === -1) {

        // there is only the Unsorted group (tab_id = -1), show a flat list as UX requested
        this.showFlatList = true;
        favoritesCollection = new Favorite2Collection(undefined, {connector: connector});
        favoritesCollection.reset(firstGroup.favorites && firstGroup.favorites.models || []);
        favoritesCollection.setFilter(filterObj);
        // if not searching or search still has empty value, set it to all models
        if (!self.options.filterValue || self.options.filterValue.length === 0) {
          self.collection.reset(favoritesCollection.models);
        } else {
          // setFilter is now asynchronous, listen to sync event to update the collection
          self.listenTo(favoritesCollection, 'sync', function () {
            self.collection.reset(favoritesCollection.models);
          });
        }

      } else {

        // show favorite groups and items in a tree list
        self.showFlatList = false;
        var searchMode = this.isSearchOpen();
        var groups = new Backbone.Collection();
        var promises = [];

        _.each(this.completeCollection.models, function (group) {
          favoritesCollection = new Favorite2Collection(undefined, {connector: connector});
          favoritesCollection.reset(group.favorites.models);
          favoritesCollection.setFilter(filterObj);

          var groupModel = new Backbone.Model(group.attributes);
          groupModel.childrenCollection = favoritesCollection;
          groupModel.searchMode = searchMode;
          // flatten the unsorted Favorites group
          (groupModel.get('tab_id') === -1) && groupModel.set('flatten', true);
          groups.add(groupModel);

          // searching with some non-empty string, wait for the setFilter() asynchronous call
          if (self.options.filterValue && self.options.filterValue.length > 0) {
            var deferred = $.Deferred();
            promises.push(deferred.promise());
            // setFilter is now asynchronous, listen to sync event to update the collection
            self.listenTo(favoritesCollection, 'sync', function () {
              // UX specs: don't show empty groups during search
              if (groupModel.childrenCollection.length === 0) {
                groups.remove(groupModel);
              }
              deferred.resolve();
            });
          }

        });

        // searching with some non-empty string, wait for all promises done then set collection
        if (self.options.filterValue && self.options.filterValue.length > 0) {
          $.when.apply($, promises).then(function () {
            self.collection.reset(groups.models);
          });
        } else {
          // set models to collection when not in the progress of searching or empty string search
          self.collection.reset(groups.models);
        }

      }
    },

    // Override the ListView::getElementByIndex method.
    // Return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index, event) {
      if (this.showFlatList) {
        return ListView.prototype.getElementByIndex.call(this, index);
      }

      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var childView = this.children.findByIndex(index);
      if (childView && childView.currentlyFocusedElement) {
        return childView.currentlyFocusedElement(event);
      } else {
        return null;
      }
    }

  });

  return FavoritesView;

});


csui.define('css!csui/widgets/navigation.header/controls/favorites/impl/favorites',[],function(){});
csui.define('csui/widgets/navigation.header/controls/favorites/favorites.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/favorites/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/navigation.header/controls/favorites/impl/favorites',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/favorites/favorites.view', 'csui/utils/contexts/factories/favorites2',
  'css!csui/widgets/navigation.header/controls/favorites/impl/favorites'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior, template,
    LayoutViewEventsPropagationMixin, FavoritesView) {
  'use strict';

  var FavoritesButtonView = Marionette.LayoutView.extend({
    className: 'csui-favorites-view',

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.FavoritesIconTitle,
        favoritesTitleAria: localizedStrings.FavoritesTitleAria
      };
    },

    regions: {
      favoritesViewContainerRegion: '.csui-favorites-view-container'
    },

    ui: {
      favoritesButtonContainer: '.csui-favorites-icon-container',
      favoritesViewContainer: '.csui-favorites-view-container'
    },

    events: {
      'keydown': 'onKeyInView',
      'mouseenter .csui-favorites-view-container': 'onMouseEnterFavoritesView',
      'mouseenter .csui-favorites-icon-container': 'onMouseEnterFavoritesView',
      'mouseleave .csui-favorites-view-container': 'onMouseLeaveFavoritesView',
      'mouseleave .csui-favorites-icon-container': 'onMouseLeaveFavoritesView',
      'mouseenter .clicked-no-hover': 'onMouseEnterClickedNoHoverItem',
      'focus .csui-favorites-icon-container': 'onFocusButton',
      'blur .csui-favorites-icon-container': 'onBlurButton',
      'blur .csui-favorites-view-container': 'onBlurFavoritesViewContainer',
      'click .csui-favorites-icon-container': 'onClickFavoritesIcon'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var $favoriteItems = this.ui.favoritesViewContainer.find(
          '.content-tile .tile-content .binf-list-group-item');
      if (event.shiftKey && $favoriteItems.length > 0) {
        return this.favoritesView._focusList();
      } else {
        return this.ui.favoritesButtonContainer;
      }
    },

    constructor: function FavoritesButtonView(options) {
      Marionette.LayoutView.call(this, options);

      this.propagateEventsToRegions();
    },

    onBeforeDestroy: function () {
      this.favoritesView && this.favoritesView.destroy();
    },

    onRender: function () {
      this.ui.favoritesViewContainer.addClass('binf-hidden');
    },

    onFocusButton: function () {
      this.$el.find('.csui-icon-favorites').addClass('fav_header42_mo');
    },

    onBlurButton: function () {
      this.$el.find('.csui-icon-favorites').removeClass('fav_header42_mo');
      if (this.favoritesViewInFocus !== true &&
          document.activeElement !== this.ui.favoritesButtonContainer[0]) {
        this._hideFavoritesView();
      }
    },

    onBlurFavoritesViewContainer: function () {
      if (this.favoritesViewInFocus !== true && this.keyboardAction !== true) {
        this._hideFavoritesView();
      }
    },

    onMouseEnterFavoritesView: function () {
      this.favoritesViewInFocus = true;
    },

    onMouseLeaveFavoritesView: function () {
      this.favoritesViewInFocus = false;
    },

    onMouseEnterClickedNoHoverItem: function (event) {
      event && event.target && $(event.target).removeClass('clicked-no-hover');
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:  // tab
        var favoritesButtonInFocus = this.ui.favoritesButtonContainer.is(':focus');
        if (favoritesButtonInFocus && event.shiftKey !== true &&
            !this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          // move to the favorites list
          this._focusOnFavoriteList(event);
        } else if (!favoritesButtonInFocus && event.shiftKey) {
          // move to the favorites button
          event.preventDefault();
          event.stopPropagation();
          this._focusOnFavoriteButton();
        } else {
          this._hideFavoritesView();
        }
        break;
      case 13:  // enter
      case 32:  // space
        this.triggerMethod('click:favorites:icon', event);
        if (!this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          this._focusOnFavoriteList(event);
        }
        break;
      case 40:  // arrow down
        if (!this.favoritesView || this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          this.triggerMethod('click:favorites:icon', event);
          this._focusOnFavoriteList(event);
        } else if (this.favoritesViewInFocus !== true) {
          this._focusOnFavoriteList(event);
        }
        break;
      case 27:  // escape
        this._focusOnFavoriteButton();
        this._hideFavoritesView();
        break;
      }
    },

    _focusOnFavoriteButton: function () {
      this.ui.favoritesButtonContainer.focus();
      this.favoritesViewInFocus = false;
    },

    _focusOnFavoriteList: function (event) {
      var $favorites     = this.ui.favoritesViewContainer.find(
          '> .content-tile > .tile-content > .binf-list-group'),
          $favoriteItems = this.favoritesView.showFlatList ?
                           $favorites.find('> .binf-list-group-item') :
                           $favorites.find('> .cs-simpletreelistitem');
      if ($favoriteItems.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.favoritesViewInFocus = true;
        this.favoritesView._moveTo(event, this.favoritesView._focusList());
      }
    },

    _toggleFavoritesView: function () {
      if (this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
        this._showFavoritesView();
      } else {
        this._hideFavoritesView();
      }
    },

    _showFavoritesView: function () {
      this.ui.favoritesViewContainer.removeClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'true');
      this.$el.addClass('showing-favorites-view');
      this.favoritesViewContainerRegion.show(this.favoritesView);
    },

    _hideFavoritesView: function () {
      this.favoritesViewInFocus = false;
      this.ui.favoritesViewContainer.addClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'false');
      this.$el.removeClass('showing-favorites-view');
    },

    onClickFavoritesIcon: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var toggleDropdown = $('.binf-open>.binf-dropdown-toggle');
      if (toggleDropdown.length > 0) {
        toggleDropdown.binf_dropdown('toggle');
      }
      this._ensureFavoritesView();
      this._toggleFavoritesView();
      this._focusOnFavoriteButton();
    },

    _ensureFavoritesView: function () {
      if (!this.favoritesView) {
        var self = this;
        var options = _.extend(this.options, {showInlineActionBar: false});
        this.favoritesView = new FavoritesView(options);
        this.listenTo(this.favoritesView, 'childview:click:tree:item', function (target, src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView, 'childview:click:item', function (src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView,
            'before:keyboard:change:focus childview:before:keyboard:change:focus', function () {
              self.keyboardAction = true;
            });
        this.listenTo(this.favoritesView,
            'after:keyboard:change:focus childview:after:keyboard:change:focus', function () {
              self.keyboardAction = false;
            });
      }
    }
  });

  _.extend(FavoritesButtonView.prototype, LayoutViewEventsPropagationMixin);

  return FavoritesButtonView;
});

csui.define('csui/widgets/navigation.header/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/navigation.header/impl/nls/root/lang',{
  profileMenuItemLabel: 'Profile',
  switchToClassicMenuItemLabel: 'Classic View',
  signOutMenuItemLabel: 'Sign out',
  EditPerspective: "Edit page",
  CreatePerspective: "Edit page"
});



csui.define('csui/widgets/navigation.header/profile.menuitems',['csui/lib/underscore',
  'i18n!csui/widgets/navigation.header/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items from the previous module location
  'csui-ext!csui/widgets/navigation.header/profile.menuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';

  var menuItems = {
    profileMenu: new ToolItemsFactory({
        profile: [
          {signature: 'UserProfile', name: lang.profileMenuItemLabel}
        ],
        others: [
          {signature: 'SwitchToClassic', name: lang.switchToClassicMenuItemLabel},
          {signature: 'EditPerspective', name: lang.EditPerspective},
          {signature: 'CreatePerspective', name: lang.CreatePerspective}
       ],
        signout: [
          {signature: 'SignOut', name: lang.signOutMenuItemLabel}
        ]
      },
      {
        maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
        dropDownIcon: 'icon icon-expandArrowDown'
      }
    )
  };

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = menuItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return menuItems;
});

csui.define('csui/widgets/navigation.header/profile.menuitems.mask',[
  'module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  var ProfileMenuItemsMask = ToolItemMask.extend({

    constructor: function ProfileMenuItemsMask() {
      var config = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      // Enable restoring the mask to its initial state
      this.storeMask();
    }

  });

  return ProfileMenuItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#\" data-binf-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" aria-haspopup=\"true\"\r\n   class=\"binf-dropdown-toggle nav-profile csui-navbar-icons csui-acc-focusable\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.profileMenuTitle || (depth0 != null ? depth0.profileMenuTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileMenuTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.profileMenuAria || (depth0 != null ? depth0.profileMenuAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileMenuAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"csui-profile-default-image image_user_placeholder\">"
    + this.escapeExpression(((helper = (helper = helpers.initials || (depth0 != null ? depth0.initials : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initials","hash":{}}) : helper)))
    + "</span>\r\n  <img class=\"csui-profile-image binf-img-circle binf-hidden\" role=\"presentation\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.profileImageAlt || (depth0 != null ? depth0.profileImageAlt : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"profileImageAlt","hash":{}}) : helper)))
    + "\" src=\""
    + this.escapeExpression(((helper = (helper = helpers.imgSrc || (depth0 != null ? depth0.imgSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imgSrc","hash":{}}) : helper)))
    + "\">\r\n</a>\r\n<ul class=\"binf-dropdown-menu csui-profile-dropdown\" role=\"menu\"></ul>";
}});
Handlebars.registerPartial('csui_widgets_navigation.header_controls_user.profile_impl_user.profile', t);
return t;
});
/* END_TEMPLATE */
;


csui.define('css!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',[],function(){});
csui.define('csui/widgets/navigation.header/controls/user.profile/user.profile.view',[
  'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/url',
  'csui/utils/base', 'csui/utils/commands',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolitem.view',
  'csui/widgets/navigation.header/profile.menuitems',
  'csui/widgets/navigation.header/profile.menuitems.mask',
  'csui/utils/user.avatar.color',
  'csui/controls/globalmessage/globalmessage',
  'hbs!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui-ext!csui/widgets/navigation.header/controls/user.profile/user.profile.view',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/widgets/navigation.header/controls/user.profile/impl/user.profile',
  'csui/lib/jquery.binary.ajax'
], function (require, _, $, Backbone, Marionette, Url, base,
    commands, ConnectorFactory, UserModelFactory, TabableRegionBehavior,
    FilteredToolItemsCollection, ToolItemView, menuItems, MenuItemsMask, UserAvatarColor,
    GlobalMessage, template, menuHandlers, lang) {
  'use strict';

  var ProfileView = Marionette.CompositeView.extend({
    classname: 'binf-dropdown',

    template: template,

    templateHelpers: function () {
      var username = base.formatMemberName(this.model);

      return {
        profileMenuTitle: lang.profileMenuTitle,
        profileMenuAria: _.str.sformat(lang.profileMenuAria, username),
        profileImageAlt: _.str.sformat(lang.profileImageAlt, username),
        // a 1x1 transparent gif, to avoid an empty src tag
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        initials: this.options.model.attributes.initials
      };
    },

    serializeData: function () {
      return {
        items: this.collection.toJSON()
      };
    },

    childView: ToolItemView,

    childViewContainer: '> .csui-profile-dropdown',

    ui: {
      userProfileMenu: '> .csui-profile-dropdown',
      userProfileMenuHandle: '> a',
      personalizedImage: '.csui-profile-image',
      defaultImage: '.csui-profile-default-image',
      profileDropdownToggler: '> .nav-profile'
    },

    events: {
      'keydown @ui.profileDropdownToggler': '_showDropdown',
      'keydown @ui.userProfileMenu': '_showDropdown',
      'focusout @ui.profileDropdownToggler': '_toggleDropdown',
      'focusout @ui.userProfileMenu': '_toggleDropdown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: '> .csui-acc-focusable',

    constructor: function ProfileView(options) {
      options || (options = {});
      this._ensureModels(options);

      Marionette.CompositeView.prototype.constructor.call(this, options);

      this.connector = this.options.context.getModel(ConnectorFactory);
      this.listenTo(this.model, 'change', this._refreshUser)
          .listenTo(options.context, 'sync error', this._refreshActions)
          .listenTo(this, 'render', this._displayUser)
          .listenTo(this, 'destroy', this._releasePhotoUrl)
          .listenTo(this, 'childview:toolitem:action', this._triggerMenuItemAction)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },

    _ensureModels: function (options) {
      var context = options.context,
          user    = context.getModel(UserModelFactory);

      this.username = "ensured";

      this.staticMenuItems = menuItems.profileMenu.collection.toJSON();
      options.model = user;

      options.collection = new FilteredToolItemsCollection(
          menuItems.profileMenu, {
            status: {context: context},
            commands: commands,
            mask: new MenuItemsMask()
          });
    },

    _refreshUser: function () {
      // Properties is being destroyed on changing the context node. Both destroyer
      // and a sub-view refreshed are listening on node changes. Although listening
      // is stopped during the destruction, already registered handlers will be
      // triggered nevertheless.
      if (this._isRendered && !this.isDestroyed) {
        this.render();
      }
    },

    _refreshActions: function () {
      // Properties is being destroyed on changing the context node. Both destroyer
      // and a sub-view refreshed are listening on node changes. Although listening
      // is stopped during the destruction, already registered handlers will be
      // triggered nevertheless.
      if (this._isRendered && !this.isDestroyed) {
        if (menuHandlers) {
          var options  = {context: this.options.context},
              promises = _.chain(menuHandlers)
                  .flatten(true)
                  .map(function (menuHandler) {
                    return menuHandler(options);
                  })
                  .value(),
              self     = this;
          $.whenAll
              .apply($, promises)
              .always(function (dynamicMenuItems) {
                var mask = new MenuItemsMask();
                dynamicMenuItems = _.chain(dynamicMenuItems)
                    .flatten()
                    .pluck('profileMenu')
                    .flatten()
                    .value();
                dynamicMenuItems = self.staticMenuItems.concat(dynamicMenuItems);
                dynamicMenuItems = mask.maskItems(dynamicMenuItems);
                menuItems.profileMenu.reset(dynamicMenuItems);
              });
        } else {
          this.collection.refilter();
        }
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      // close the dropdown menu before triggering the event
      this.ui.profileDropdownToggler.binf_dropdown('toggle');
      this._executeAction(args.toolItem);
    },

    _executeAction: function (toolItem) {
      var signature = toolItem.get('signature'),
          command   = commands.findWhere({signature: signature}),
          context   = this.options.context,
          status    = {
            context: context,
            toolItem: toolItem,
            data: toolItem.get('commandData')
          },
          self      = this;
      if (command && command.enabled(status)) {
        this.$el.addClass('binf-disabled');
        command.execute(status)
            .done(function (item) {
              // TODO: Add success reporting; do no build the sentence
              // from separate verbs and subjects; the command has to
              // return the full sentence
            })
            .fail(function (error) {
              if (error) {
                error = new base.Error(error);
                GlobalMessage.showMessage('error', error.message,
                    error.errorDetails);
              }
            })
            .always(function () {
              self.$el.removeClass('binf-disabled');
            });
      }
    },

    _displayUser: function () {
      if (this.model.get('id')) {
        this._displayProfileImage();
        this._assignUserColor();
      }
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      if (photoUrl) {
        var getPhotoOptions = this.connector.extendAjaxOptions({
          url: photoUrl,
          dataType: 'binary'
        });
        $.ajax(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this._showPersonalizedImage(response);
              } else {
                this._showDefaultImage();
              }
            }, this));
      } else {
        this._showDefaultImage();
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          photoPath  = this.model.get('photo_url');
      // If the URL does not contain the cache-busting parameter derived from
      // the picture's latest change, there was a problem retrieving it.  It
      // does not make sense to try it once more from the client side, waste
      // time and server resources and litter the log by 404 errors.
      if (photoPath && photoPath.indexOf('?') > 0) {
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _showPersonalizedImage: function (imageContent) {
      this._releasePhotoUrl();
      this._photoUrl = URL.createObjectURL(imageContent);
      this.ui.defaultImage.addClass('binf-hidden');
      this.ui.personalizedImage.attr('src', this._photoUrl)
          .removeClass('binf-hidden');
      // after coming from keyboard once update the profile put focus to the resp. image.
      this.$el.parents().find('.esoc-userprofile-pic-actions img').length &&
      this.$el.parents().find('.esoc-userprofile-pic-actions img').focus();
    },

    _showDefaultImage: function (imageContent) {
      this._releasePhotoUrl();
      this.ui.personalizedImage.addClass('binf-hidden');
      this.ui.defaultImage[0].innerText = this.options.model.attributes.initials;
      this.ui.defaultImage.removeClass('binf-hidden');
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').length &&
      this.$el.parents().find(' span.esoc-full-profile-avatar-cursor').focus();
    },

    _releasePhotoUrl: function () {
      if (this._photoUrl) {
        URL.revokeObjectURL(this._photoUrl);
        this._photoUrl = undefined;
      }
    },

    _closeToggle: function () {
      if (this.$el.hasClass('binf-open')) {
        this.ui.userProfileMenuHandle.click();
      }
    },

    _showDropdown: function (event) {
      var elms          = this.ui.userProfileMenu.find('> li > a'),
          index         = 0,
          activeElement = this.$el.find(document.activeElement);
      if (activeElement.length > 0) {
        index = elms.index(activeElement[0]);
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.profileDropdownToggler.focus();
          } else {
            $(elms[index]).focus();
          }
        } else if (event.keyCode === 27 &&
                   $(activeElement).closest('ul').is('.csui-profile-dropdown')) {
          event.stopPropagation();
          this.ui.profileDropdownToggler.trigger('click').focus();
        } else if (event.keyCode === 32) {
          event.preventDefault();
          event.stopPropagation();
          $(activeElement).click();
        }
      }
    },

    _toggleDropdown: function (event) {
      var that = this;
      setTimeout(function () {
        if (!!document.activeElement.offsetParent &&
            !document.activeElement.offsetParent.classList.contains(
                'csui-profile-dropdown') &&
            document.activeElement !== that.ui.profileDropdownToggler[0] &&
            that.ui.userProfileMenu.is(':visible')) {
          $(that.ui.profileDropdownToggler).click();
        }
      }, 100);
    },

    _assignUserColor: function () {
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      this.ui.defaultImage.css("background", userbackgroundcolor);
    }
  });

  return ProfileView;
});

// Base for perspectives placing widgets to named grid cells - zones
csui.define('csui/perspectives/zone/zone.perspective.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/perspectives/mixins/perspective.edit.mixin'
], function (_, $, Backbone, Marionette, GridView, WidgetContainerBehavior, PerspectiveEditMixin) {

  var ZonePerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-zone-perspective grid-rows ',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // widgets in the grid should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    constructor: function ZonePerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      options.collection.each(function (row, rowIndex) {
        row.columns.each(function (column, colIndex) {
          column.get('widget').cellAddress = 'grid0:r' + rowIndex + ':c' + colIndex;
        });
      });
      if (options.perspectiveMode === 'edit') {
        this.prepareForEditMode();
      }
      GridView.prototype.constructor.call(this, options);
    },

    _createCollection: function (options) {
      var rows       = new Backbone.Collection(),
          layoutName = this._getLayoutName(options);
      if (layoutName) {
        var zoneLayouts = getOption.call(this, 'zoneLayouts'),
            zoneLayout  = zoneLayouts[layoutName];
        if (zoneLayout) {
          var row     = rows.add({}),
              columns = _.map(zoneLayout.zoneOrder, function (zone) {
                return _.defaults({
                  widget: options[zone]
                }, zoneLayout.zoneSizes[zone]);
              });
          row.columns = new Backbone.Collection(columns);
        } else {
          throw new Marionette.Error({
            name: 'InvalidLayoutContentError',
            message: 'Missing widget in the important perspective zone'
          });
        }
      }
      return rows;
    },

    /**
     * Calculates and returns layout to use based on the options configured
     */
    _getLayoutName: function (options) {
      var zoneNames = getOption.call(this, 'zoneNames');
      return _.reduce(zoneNames, function (result, zone) {
        if (options[zone] && !_.isEmpty(options[zone])) {
          result && (result += '-');
          result += zone;
        }
        return result;
      }, '');
    },

    enumerateWidgets: function (callback) {
      var zoneNames = getOption.call(this, 'zoneNames');
      _.each(zoneNames, function (zone) {
        var zoneContent = this.options[zone];
        if (!_.isEmpty(zoneContent)) {
          var widget = this.options[zone];
          widget && callback(widget);
        }
      }, this);
    },

    /**
     * Serilize Zone options to save 
     */
    serializeOptions: function () {
      var self        = this,
          deferred    = $.Deferred(),
          layoutName  = this._getLayoutName(this.options),
          zoneLayouts = getOption.call(this, 'zoneLayouts'),
          zoneLayout  = zoneLayouts[layoutName],
          cells       = this.collection.at(0).columns;
      var widgetPromises = _.map(zoneLayout.zoneOrder, function (zone, index) {
        if (cells.at(index).get('widget').type ===
            'csui/perspective.manage/widgets/perspective.placeholder') {
          // Placeholder, no widget placed on this zone. Hence empty options
          return $.Deferred().resolve({
            zone: zone,
            config: {widget: {}}
          });
        }
        // Resolve and Serialize widget options
        return self.serializeWidget(cells.at(index)).then(function (result) {
          return {
            zone: zone,
            config: result
          };
        });
      });

      $.whenAll.apply($, widgetPromises).done(function (results) {
        var zoneOptions = _.reduce(results, function (zoneOptions, result) {
          zoneOptions[result.zone] = result.config.widget;
          return zoneOptions;
        }, {});
        // Resolve promise with options
        deferred.resolve(zoneOptions);
      }).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });

      return deferred.promise();
    }

  });

  // TODO: Expose this functionality and make it generic for other views too
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) ? value.call(this) : value;
  }

  // TODO add mixin dynamically for edit mode only
  PerspectiveEditMixin.mixin(ZonePerspectiveView.prototype);

  return ZonePerspectiveView;

});

// Loads widgets and renders them in a left-center-right zone layout
csui.define('csui/perspectives/left-center-right/left-center-right.perspective.view',['require', 'module', 'csui/lib/underscore', 'csui/perspectives/zone/zone.perspective.view',
  'csui/behaviors/widget.container/widget.container.behavior'
], function (require, module, _, ZonePerspectiveView, WidgetContainerBehavior) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['left', 'center', 'right'],
    zoneLayouts: {
      'center': {
        zoneOrder: ['center'],
        zoneSizes: {
          center: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left': {
        zoneOrder: ['left'],
        zoneSizes: {
          left: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'right': {
        zoneOrder: ['right'],
        zoneSizes: {
          right: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center': {
        zoneOrder: ['center', 'left'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            "pulls": {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            "pushes": {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'center-right': {
        zoneOrder: ['center', 'right'],
        zoneSizes: {
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-right': {
        zoneOrder: ['left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center-right': {
        zoneOrder: ['center', 'left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            "pulls": {
              "lg": 6,
              "xl": 6
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "sm": 12,
              "md": 12,
              "lg": 6,
              "xl": 6
            },
            "pushes": {
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var LeftCenterRightPerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className       = 'cs-left-center-right-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,

    constructor: function LeftCenterRightPerspectiveView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
      if (!!options && options.perspectiveMode === 'edit') {
        this._registerEditEvents();
      }
    },

    /**
     * Fill placeholders in empty zones
     */
    _prepareForEditMode: function (options) {
      if (!options.left || _.isEmpty(options.left.type)) {
        options.left = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.center || _.isEmpty(options.center.type)) {
        options.center = {
          kind: 'fullpage',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.right || _.isEmpty(options.right.type)) {
        options.right = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this
        }
      };
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widget) {
        if (self.getPManPlaceholderWidget) { // Provided by pman.config.behaviour
          var newWidget = self.getPManPlaceholderWidget();
          WidgetContainerBehavior.resolveWidget(newWidget).done(function () {
            widget.model.set('widget', newWidget);
          });
        }
      });
      this.listenTo(this, 'replace:widget', function (widgetView, widgetToReplace) {
        WidgetContainerBehavior.resolveWidget(widgetToReplace).done(function () {
          widgetView.model.set('widget', widgetToReplace);
        });
      }.bind(this));
    },

    /**
     * Serializes the widget configuration to save the perspective.
     */
    serializePerspective: function () {
      var optionsPromise = this.serializeOptions();
      return optionsPromise.then(function (options) {
        return {
          type: 'left-center-right',
          options: options
        };
      });
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return LeftCenterRightPerspectiveView;

});

// Loads a widget and renders it in a full-page zone layout
csui.define('csui/perspectives/single/single.perspective.view',['module', 'csui/lib/underscore', 'csui/perspectives/zone/zone.perspective.view'
], function (module, _, ZonePerspectiveView) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['widget'],
    zoneLayouts: {
      'widget': {
        zoneOrder: ['widget'],
        zoneSizes: {
          widget: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var SinglePerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className = 'cs-single-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,

    constructor: function SinglePerspectiveView(options) {
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
    }

  });

  return SinglePerspectiveView;

});

csui.define('csui/utils/contexts/factories/active.tab.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ActiveTabModel = Backbone.Model.extend({

    defaults: {
      tabIndex: 0
    }

  });

  var ActiveTabModelFactory = ModelFactory.extend({

    propertyPrefix: 'activeTab',

    constructor: function ActiveTabModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var activeTab = this.options.activeTab || {};
      if (!(activeTab instanceof Backbone.Model)) {
        var config = module.config();
        activeTab = new ActiveTabModel(activeTab.models, _.extend({},
            activeTab.options, config.options));
      }
      this.property = activeTab;
    }

  });

  return ActiveTabModelFactory;

});

csui.define('csui/perspectives/tabbed/behaviors/tab.extensions.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region',
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var TabExtensionsBehavior = Marionette.Behavior.extend({

    constructor: function TabExtensionsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this.renderExtension);
      this.listenTo(view, 'before:destroy', this.destroyExtension);
      this.listenTo(view, 'dom:refresh', this.refreshTab);
    },

    renderExtension: function () {
      var options                    = this.view.options,
          tabBarExtensionViewClass   = options.tabBarExtensionViewClass,
          tabBarExtensionViewOptions = options.tabBarExtensionViewOptions;
      if (!!tabBarExtensionViewClass) {
        if (typeof (tabBarExtensionViewClass) === "function") {
          this.tabBarExtensionView = new tabBarExtensionViewClass(tabBarExtensionViewOptions);
          this.tabBarExtensionView.$el.addClass("tab-extension");
          this.tabBarExtensionsRegion = new NonEmptyingRegion({
            el: this.view.el,
            prependChild: true
          });
          this.tabBarExtensionsRegion.show(this.tabBarExtensionView);
        }
      }
      this.view._initializeToolbars();
    },

    refreshTab: function () {
      if (!!this.tabBarExtensionsRegion) {
        // When there are extensions, tablinks width should be reduced.
        var currentTabIndex   = this.view.activeTab && this.view.activeTab.get("tabIndex"),
            extensionOnTabBar = true;
        if (!this.view.options.enableExtensionOnFirstTab && currentTabIndex == 0) {
          extensionOnTabBar = false;
        }
        //TODO: need to check alternate solution instead-of applying dynamic inline css.
        if (extensionOnTabBar) {
          var bufferWidth   = 0.4, // Adding some buffer as outerWidth ignores the decimal part
              extWidth      = this.tabBarExtensionsRegion.currentView.$el.outerWidth(true) +
                              bufferWidth,
              tabLinksWidth = "calc(100% - " + extWidth + "px)";
          this.view.tabLinks.$el.width(tabLinksWidth);
        } else {
          this.view.tabLinks.$el.width("100%");
        }
      }
      this.view._enableToolbarState();
    },

    destroyExtension: function () {
      if (!!this.tabBarExtensionsRegion) {
        this.tabBarExtensionsRegion.empty();
      }
    }
  });

  return TabExtensionsBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed/impl/tabbed.perspective',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"cs-header\"></div>\r\n<div class=\"cs-content\"></div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed_impl_tabbed.perspective', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspectives/tabbed/impl/tabbed.perspective',[],function(){});
csui.define('csui/perspectives/tabbed/tabbed.perspective.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (_, $, Marionette, TabPanelView, GridView, WidgetContainerBehavior,
    LayoutViewEventsPropagationMixin, ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, perspectiveTemplate) {
  'use strict';

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // Widgets in the tab panel should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView() {
      GridView.RowView.prototype.constructor.apply(this, arguments);
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        // Perspective can fetch all data, only if all widgets
        // are created; including on non-activated tabes
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarExtensionViewClass: options.tabBarExtensionViewClass,
        tabBarExtensionViewOptions: options.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: options.enableExtensionOnFirstTab
      });
      if (options.tabs) {
        _.each(options.tabs, function (tab, tabIndex) {
          _.each(tab.columns, function (col, columnIndex) {
            col.widget.cellAddress = 'tab' + tabIndex + ':r0:c' + columnIndex;
          });
        });
      }
      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior,
        }
      }, this.behaviors);

      $(window).bind('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }

  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  var TabbedPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid',
    template: perspectiveTemplate,

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);

      Marionette.LayoutView.prototype.constructor.call(this, options);

      // The current tab may be wanted to be remembered when the perspective
      // is switched again.  The following model from the context does it.
      //this.activeTab = this.options.context.getModel(ActiveTabModelFactory);

      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.navigationHeader = this._createWidget(this.options.header.widget);
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarExtensionViewClass: this.navigationHeader.tabBarExtensionView,
        tabBarExtensionViewOptions: this.navigationHeader.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: this.navigationHeader.enableExtensionOnFirstTab
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._updateToggleHeaderState);
      this.headerRegion.show(this.navigationHeader);
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    enumerateWidgets: function (callback) {
      var widget = this.options && this.options.header && this.options.header.widget;
      widget && callback(widget);
      _.each(this.options.tabs, function (tab) {
        _.each(tab.columns || [], function (column) {
          column.widget && callback(column.widget);
        });
      });
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      // If this handler is triggered by before:activate:tab, the activeTab
      // model has not been updated yet
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
    },

    // TODO: Make a common method for this or remove it,
    // if all browsers support it.
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _supportMaximizeWidget: true

  });

  _.extend(TabbedPerspectiveView.prototype, LayoutViewEventsPropagationMixin);

  return TabbedPerspectiveView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div class=\"left-toolbar\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <div class=\"right-toolbar\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"tab-links-bar\">\r\n  <span class=\"fadeout\"></span>\r\n  <ul class=\"binf-nav "
    + this.escapeExpression(((helper = (helper = helpers.tab_type || (depth0 != null ? depth0.tab_type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tab_type","hash":{}}) : helper)))
    + "\" role=\"tablist\"></ul>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolbar : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"csui-pman-add-newtab\">\r\n  <button class=\"icon icon-toolbarAdd\" title=\"Add tab\"></button>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed-flow_impl_edit.perspective_tab.links', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" class=\"cs-tablink\" data-binf-toggle=\"tab\" title=\""
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "\">\r\n  <span class=\"cs-tablink-text\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"csui-l10n","hash":{}}))
    + "</span>\r\n  <input class=\"csui-pman-editinput binf-hidden\" tabindex=\"-1\">\r\n</a>\r\n<div class=\"cs-tablink-delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeTab || (depth0 != null ? depth0.removeTab : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeTab","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon circle_delete cs-delete-icon\" role=\"button\" data-cstabindex=\"0\"></span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspectives_tabbed-flow_impl_edit.perspective_tab.link', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/perspectives/tabbed-flow/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspectives/tabbed-flow/impl/nls/root/lang',{
  deleteConfirmTitle: 'Remove Tab',
  deleteConfirmMsg: 'Are you sure, you want to remove Tab?',
  removeTab: 'Remove Tab',
  newTabTitle: 'Tab',
  newTabInput: 'Add tab label'
});



csui.define('css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',[],function(){});
csui.define('csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
], function (_, TabLinkView, tabLinkTemplate, lang) {
  var EditPerspectiveTabLink = TabLinkView.extend({
    template: tabLinkTemplate,

    templateHelpers: function () {
      return {
        removeTab: lang.removeTab
      };
    },

    className: function () {
      return this._isOptionActiveTab() ? 'pman-edit-tab binf-active' : 'pman-edit-tab';
    },

    events: function () {
      return _.extend(TabLinkView.prototype.events, {
        'click @ui.link': '_onShowTab',
        'dblclick @ui.tabLink': '_onTabClick',
        'keyup @ui.editInput': '_onInputKeydown',
        'focusout @ui.editInput': '_onInputFocusOut',
        'click @ui.tabRemove': '_onTabRemove'
      });
    },

    ui: function () {
      return _.extend(TabLinkView.prototype.ui, {
        'editInput': '.csui-pman-editinput',
        'tabLink': '.cs-tablink-text',
        'tabRemove': '.cs-delete-icon'
      });
    },

    _onShowTab: function (event) {
      //prevent activating new tab with no title
      if (!this.model.get('title')) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _onTabRemove: function () {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.deleteConfirmMsg, lang.deleteConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self._doRemoveTab();
              }
            });
      });
    },

    _doRemoveTab: function () {
      if (!this.model.get('title')) {
        this.trigger('enable:addTab');
      }
      this.trigger('remove:tab', this.model);
    },

    _onTabClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._editTab();
    },

    _editTab: function () {
      var text;
      if (this.ui.tabLink.text()) {
        text = this.ui.tabLink.text();
        this.ui.editInput.val(text);
      }
      else {
        text = lang.newTabInput;
        this.ui.editInput.attr('placeholder', lang.newTabInput);
      }
      this._adjustInputWidth(text);
      this._setEdit(true);
    },

    _adjustInputWidth: function (text) {
      this.ui.editInput.css('width', ( ((text.length + 1) * 8) + 5 + 'px'));
    },

    _setEdit: function (isEdit) {
      if (isEdit) {
        this.ui.tabLink.addClass('binf-hidden');
        this.ui.editInput.removeClass('binf-hidden');
        this.ui.editInput.focus();
      } else {
        this.ui.tabLink.removeClass('binf-hidden');
        this.ui.editInput.addClass('binf-hidden');
      }
    },

    _onInputFocusOut: function () {
      if (!this.model.get('title')) {
        this._doRemoveTab();
        return;
      }
      this._setEdit(false);
      this.trigger('enable:addTab');
    },

    _onInputKeydown: function (event) {
      var value = event.target.value;
      this._adjustInputWidth(value);
      if ((!value || value.length === 0) && (event.which == 13 || event.which == 27)) {
        this._doRemoveTab();
        return;
      }
      switch (event.which) {
      case 13:
        this._setTabTitle(value);
        break;
      case 27:
        this._setEdit(false);
        break;
      }
    },

    _setTabTitle: function (newTitle) {
      this.ui.tabLink.text(newTitle);
      this.model.set('title', newTitle);
      this._setEdit(false);
    },

    onShow: function () {
      if (!this.model.get('title')) {
        this.trigger('disable:addTab');
        this._editTab();
      }
    },

    constructor: function EditPerspectiveTabLink() {
      TabLinkView.prototype.constructor.apply(this, arguments);
    }
  });
  return EditPerspectiveTabLink;
});

csui.define('css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',[],function(){});
csui.define('csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links.view',['csui/lib/underscore', 'csui/controls/tab.panel/tab.links.ext.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin, lang) {

  var EditPerspectiveTabLinks = TabLinkCollectionView.extend({
    template: tabLinksTemplate,

    childView: TabLinkViewExt,

    childViewContainer: function () {
      return '.' + this.tabType;
    },

    ui: {
      'addNewTab': '.csui-pman-add-newtab'
    },

    events: {
      'click @ui.addNewTab': '_onAddNewTab'
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    childEvents: {
      'remove:tab': '_onRemoveTab',
      'enable:addTab': 'enableAddTab',
      'disable:addTab': 'disableAddTab'
    },

    constructor: function EditPerspectiveTabLinks() {
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
    },

    _onRemoveTab: function (tabView) {
      var isDeletingActive = tabView.isActive(),
          tabIndex         = this.collection.indexOf(tabView.model);
      this.collection.remove(tabView.model);
      if (!isDeletingActive) {
        return;
      }
      if (tabIndex >= this.collection.length) {
        tabIndex = this.collection.length - 1;
      }
      if (tabIndex < 0) {
        // No Tabs left
        return;
      }
      var tabToActivate = this.collection.at(tabIndex);
      this.children.findByModel(tabToActivate).activate();
    },

    _onAddNewTab: function () {
      if (this.ui.addNewTab.hasClass("csui-pman-disable-newtab")) {
        return;
      }
      var newTab = {
        title: ""
      };
      this.options.tabPanel.collection.add(newTab);
    },

    enableAddTab: function () {
      this.ui.addNewTab.removeClass("csui-pman-disable-newtab");
    },

    disableAddTab: function () {
      this.ui.addNewTab.addClass("csui-pman-disable-newtab");
    }
  });
  return EditPerspectiveTabLinks;
});
csui.define('csui/perspectives/tabbed-flow/tabbed-flow.perspective.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',
  'csui/models/widget/widget.model',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'csui/utils/log',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links.view',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, WidgetModel,
    TabPanelView, GridView, WidgetContainerBehavior, LayoutViewEventsPropagationMixin,
    ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, log, EditPerspectiveTabLinks,
    perspectiveTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        }
      },
      tile: {
        widths: {
          md: 6,
          xl: 4
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      }
    }
  });

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        // Widgets in the tab panel should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      GridView.RowView.prototype.constructor.apply(this, arguments);
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode();
        this._registerEditEvents();
      }
    },

    _prepareForEditMode: function (options) {
      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this,
          perspectiveSelector: '.perspective-editing .cs-perspective #' + options.tabId
        }
      };
    },

    _initEditMode: function () {
      var self         = this,
          placeholderW = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder'
          };
      TabbedFlowPerspectiveView._resolveWidget(placeholderW).done(function (resolvedWidget) {
        var newCell = TabbedFlowPerspectiveView._createCell(placeholderW, resolvedWidget);
        self.options.collection.add(newCell);
      });
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var model = widgetView.model;
        self.collection.remove(model);
        // TODO Add a new placeholder when all cells removed
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        // 'getPManPlaceholderWidget' Provided by pman.config.behaviour
        return;
      }
      var self = this;
      // Load new widget
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        // update current widget with new widget
        if (currentWidget.model.get('widget').type !== self.getPManPlaceholderWidget().type) {
          // Preserve widget kind if dropping on existing widget
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = TabbedFlowPerspectiveView._prepareCell(widgetToReplace);
        currentWidget.model.set(widgetUpdates);
        // Check if last widget of flow is replacing, then add new placeholder widget
        var placeholderWidget = self.getPManPlaceholderWidget(),
            cells             = self.collection,
            hasPlaceholders   = cells.filter(function (w) {
                  return w.get('widget').type === placeholderWidget.type;
                }).length > 0;
        if (!hasPlaceholders) {
          // Create a placeholder wiget to be able to drop new widgets
          TabbedFlowPerspectiveView._resolveWidget(placeholderWidget).done(
              function (resolvedWidget) {
                var newCell = TabbedFlowPerspectiveView._createCell(placeholderWidget,
                    resolvedWidget, cells.length);
                cells.add(newCell);
              });
        }
      });
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns'),
        perspectiveMode: this.options.perspectiveMode,
        tabId: model.get('uniqueTabId')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        // Perspective can fetch all data, only if all widgets
        // are created; including on non-activated tabes
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarExtensionViewClass: options.tabBarExtensionViewClass,
        tabBarExtensionViewOptions: options.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: options.enableExtensionOnFirstTab
      });
      if (options.perspectiveMode === 'edit') {
        _.extend(options, {
          TabLinkCollectionViewClass: EditPerspectiveTabLinks
        });
      }

      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior,
        }
      }, this.behaviors);

      $(window).bind('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    render: function () {
      TabPanelView.prototype.render.apply(this);
      this.listenTo(this.collection, 'change reset remove', _.bind(function (event) {
        this._enableToolbarState();
      }, this));
      this.listenTo(this.collection, 'add', _.bind(function (event) {
        // this._enableToolbarState();
        this._autoScrollLastTab();
      }, this));
      return this;
    },

    onDomRefresh: function () {
      this._enableToolbarState();
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }
  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  /**
   * Header view to hold Navigation header of the Tabbed perspective.
   */
  var HeaderView = Marionette.ItemView.extend({
    className: 'cs-tabbed-perspective-header',
    constructor: function HeaderView(options) {
      options || (options = {});
      if (!options.header) {
        options.header = {};
      }
      if (options.perspectiveMode === 'edit') {
        var PerspectiveWidgetConfigBehaviour = require(
            'csui/perspective.manage/behaviours/pman.widget.config.behaviour');
        this.behaviors = _.extend({
          PerspectiveWidgetConfig: {
            behaviorClass: PerspectiveWidgetConfigBehaviour,
            perspectiveView: this
          }
        }, this.behaviors);
      }
      Marionette.ItemView.call(this, _.extend({template: false}, options));
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode(options);
        this._registerEditEvents();
      }
    },

    _initEditMode: function (options) {
      if (!this.options.header.widget && this.getPManPlaceholderWidget) {
        this._handleReplaceWidget(this, this.getPManPlaceholderWidget());
      }
    },

    _ensureRegion: function () {
      if (!this.headerContainer) {
        this.headerContainer = new Marionette.Region({
          el: this.el
        });
      }
      return this.headerContainer;
    },

    onRender: function () {
      if (!!this.options.header.widget) {
        this.navigationHeader = this._createWidget(this.options.header.widget);
        var region = this._ensureRegion();
        region.show(this.navigationHeader);
      }
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        if (self.getPManPlaceholderWidget) {
          var placeholder = self.getPManPlaceholderWidget();
          TabbedFlowPerspectiveView._resolveWidget(placeholder).done(function () {
            self._replaceWidget(placeholder);
          });
        }
      });
      this.listenTo(this, 'replace:widget', this._handleReplaceWidget);
    },

    _replaceWidget: function (widgetToReplace) {
      this.options.header.widget = widgetToReplace;
      this.render();
    },

    _handleReplaceWidget: function (currentWidget, widgetToReplace) {
      var self = this;
      // Load new widget
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        // Replace current widget with new widget
        self._replaceWidget(widgetToReplace);
      });
    },

    /**
     * Provide header widget configuration to perspective manager
     */
    getPManWidgetConfig: function () {
      return this.options.header.widget;
    }
  });

  var TabbedFlowPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid cs-tabbed-flow-perspective',
    template: perspectiveTemplate,

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedFlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // The current tab may be wanted to be remembered when the perspective
      // is switched again.  The following model from the context does it.
      //this.activeTab = this.options.context.getModel(ActiveTabModelFactory);

      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.headerView = new HeaderView(this.options);
      this.headerRegion.show(this.headerView);
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarExtensionViewClass: this.headerView.navigationHeader.tabBarExtensionView,
        tabBarExtensionViewOptions: this.headerView.navigationHeader.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: this.headerView.navigationHeader.enableExtensionOnFirstTab
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._updateToggleHeaderState);
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      if (this.options.perspectiveMode === 'edit') {
        // Ignore Tab header update for edit perspective mode.
        return;
      }
      // If this handler is triggered by before:activate:tab, the activeTab
      // model has not been updated yet
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
    },

    // TODO: Make a common method for this or remove it,
    // if all browsers support it.
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _createCollection: function (options) {
      var tabs            = new Backbone.Collection(options.tabs),
          uniqueWidgets   = _.chain(options.tabs)
              .map(function (tab) {
                return tab.widgets;
              })
              .flatten()
              .pluck('type')
              .unique()
              .map(function (id) {
                return {id: id};
              })
              .value(),
          headerWidget    = options.header && options.header.widget,
          resolvedWidgets = new WidgetCollection(uniqueWidgets),
          self            = this;
      if (headerWidget) {
        resolvedWidgets.add({id: headerWidget.type});
      }
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      this.widgetsResolved = resolvedWidgets
          .fetch()
          .then(function () {
            if (headerWidget) {
              var resolvedWidget = resolvedWidgets.get(headerWidget.type),
                  widgetView     = resolvedWidget.get('view');
              if (widgetView) {
                _.extend(headerWidget, {view: widgetView});
              } else {
                var error = resolvedWidget.get('error');
                log.warn('Loading widget "{0}" failed. {1}', headerWidget.type, error)
                && console.warn(log.last);
                _.extend(headerWidget, WidgetContainerBehavior.getErrorWidget(
                    headerWidget, error));
              }
            }
            tabs.each(function (tab) {
              tab.set('columns', self._createColumns(tab.get('widgets'), resolvedWidgets));
            });
          });
      return tabs;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      return _.map(widgets, function (widget) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return TabbedFlowPerspectiveView._createCell(widget, resolvedWidget);
      }.bind(this));
    },

  }, {

    _prepareCell: function (widgetConfig) {
      if (!widgetConfig.kind) {
        widgetConfig.kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[widgetConfig.kind] || {};
      return {
        sizes: sizes.widths,
        widget: {
          type: widgetConfig.type,
          options: widgetConfig.options,
          view: widgetConfig.view
        }
      };
    },

    _createCell: function (widget, resolvedWidget) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind] || {};
      if (widgetView) {
        widget.view = widgetView;
        return TabbedFlowPerspectiveView._prepareCell(widget);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      return {
        sizes: config.widgetSizes[config.defaultWidgetKind].widths,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },

    _resolveWidget: function (widget) {
      var deferred = $.Deferred();
      var widgetModel = new WidgetModel({id: widget.type});
      widgetModel.fetch().then(function () {
        widget.view = widgetModel.get('view');
        deferred.resolve(widgetModel);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },
  });

  _.extend(TabbedFlowPerspectiveView.prototype, LayoutViewEventsPropagationMixin);

  return TabbedFlowPerspectiveView;

});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/error.global.json',{
  "type": "grid",
  "options": {
    "rows": [
      {
        "columns": [
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "csui/widgets/error.global",
              "options": {
              }
            }
          }
        ]
      }
    ]
  }
}
);


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/error.global/impl/error.global',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class='server-error-message-wrapper'>\r\n          <div class='server-error-message horizontal-center-align'>\r\n            <span class='csui-acc-focusable' tabindex=0>"
    + this.escapeExpression(((helper = (helper = helpers.serverError || (depth0 != null ? depth0.serverError : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"serverError","hash":{}}) : helper)))
    + "</span>\r\n          </div>\r\n        </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='main-area-container'>\r\n  <div class='main-area-group'>\r\n    <div class='error-message-area'>\r\n      <div class='error-message-wrapper'>\r\n        <div class='error-message horizontal-center-align'>\r\n          <span class='csui-acc-focusable' tabindex=0>"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n      </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.serverError : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n\r\n    <div class='navigation-area horizontal-center-align'>\r\n      <div class='navigation-control-container'>\r\n        <div class='go-back-button circle-border horizontal-center-align' tabindex=0\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "' class='csui-acc-focusable'>\r\n            <span class='icon icon-back'></span>\r\n        </div>\r\n        <div class='go-back-text button-text horizontal-center-align'\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.backTooltip || (depth0 != null ? depth0.backTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTooltip","hash":{}}) : helper)))
    + "'>\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.backText || (depth0 != null ? depth0.backText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backText","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n      </div>\r\n      <div class='navigation-control-container'>\r\n        <div class='go-home-button circle-border horizontal-center-align' tabindex=0\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "' class='csui-acc-focusable'>\r\n            <span class='icon icon-home'></span>\r\n        </div>\r\n        <div class='go-home-text button-text horizontal-center-align'\r\n          title='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "' aria-label='"
    + this.escapeExpression(((helper = (helper = helpers.homeTooltip || (depth0 != null ? depth0.homeTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeTooltip","hash":{}}) : helper)))
    + "'>\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.homeText || (depth0 != null ? depth0.homeText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"homeText","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_error.global_impl_error.global', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/error.global/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/error.global/impl/nls/root/lang',{

  errorMessage: 'There was a problem serving the requested page.',
  backText: 'Go back',
  backTooltip: 'Navigate back to previous URL',
  homeText: 'Home',
  homeTooltip: 'Navigate to landing page'

});



csui.define('css!csui/widgets/error.global/impl/error.global',[],function(){});
csui.define('csui/widgets/error.global/error.global.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/application.scope.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/error.global/impl/error.global',
  'i18n!csui/widgets/error.global/impl/nls/lang',
  'css!csui/widgets/error.global/impl/error.global'
], function (_, $, Marionette, base, NodeModelFactory, ApplicationScopeModelFactory,
    TabableRegionBehavior, template, lang) {

  var GlobalErrorView = Marionette.ItemView.extend({

    className: 'csui-global-error',

    template: template,
    templateHelpers: function () {
      return {
        errorMessage: lang.errorMessage,
        backText: lang.backText,
        backTooltip: lang.backTooltip,
        homeText: lang.homeText,
        homeTooltip: lang.homeTooltip
      };
    },

    TabableRegion: {
      behaviorClass: TabableRegionBehavior,
      initialActivationWeight: 100
    },

    ui: {
      errorMessage: '.error-message > span'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .go-home-button': 'onClickHome',
      'click .go-home-text': 'onClickHome',
      'click .go-back-button': 'onClickBack',
      'click .go-back-text': 'onClickBack'
    },

    constructor: function GlobalErrorView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (options.context) {
        if (!this.model) {
          this.model = options.context.getModel(NodeModelFactory, options);
        }
        this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      }

      // IE11 fails to update CSS center styling correctly on window resize
      if (base.isIE11()) {
        var self = this;
        var resizeHandler = function () {
          self.render();
        };
        $(window).bind('resize', resizeHandler);
        this.once('before:destroy', function () {
          $(window).unbind('resize', resizeHandler);
        });
      }
    },

    currentlyFocusedElement: function (event) {
      return this.ui.errorMessage;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        $(event.target).click();
      }
    },

    onClickHome: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.applicationScope && this.applicationScope.set('id', '');
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.history.back();
    }

  });

  return GlobalErrorView;
});

csui.define('csui/widgets/myassignments/myassignments.columns',["csui/lib/backbone"], function (Backbone) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // Fixed (system) columns have sequence number < 100, dynamic columns
  // have sequence number > 1000

  var MyAssignmentsTableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'location_id',
      sequence: 30
    },
    {
      key: 'date_due',
      sequence: 40
    },
    {
      key: 'priority',
      sequence: 50
    },
    {
      key: 'status',
      sequence: 60
    },
    {
      key: 'from_user_name',
      sequence: 70
    }
  ]);

  return MyAssignmentsTableColumns;

});

csui.define('csui/widgets/myassignments/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/myassignments/impl/nls/root/lang',{
  dialogTitle: 'My Assignments',
  searchPlaceholder: 'Search My Assignments',
  searchAria: 'Search for assignments',
  expandAria: 'Expand the My Assignments widget',
  emptyListText: 'No results found.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.'
  // Note: column titles are defined on the module
  // Note: use the exact 'column_key' for the client-side column titles
});



csui.define('css!csui/widgets/myassignments/impl/myassignments',[],function(){});
// Shows a list of links to current user's assignments
csui.define('csui/widgets/myassignments/myassignments.view',['csui/lib/underscore',
  'csui/utils/base',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstateful.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/myassignments',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  'css!csui/widgets/myassignments/impl/myassignments'
], function (_, base, Marionette, ListView, ExpandedListitem, LimitingBehavior,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    MyAssignmentCollectionFactory, NodeTypeIconView, BlockingView, lang) {
  'use strict';

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var MyAssignmentsView = ListView.extend({

    constructor: function MyAssignmentsView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'date_due asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-assignments';
      ListView.prototype.constructor.apply(this, arguments);
      BlockingView.imbue(this);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria
      };
    },

    childView: ExpandedListitem,

    childViewOptions: {
      templateHelpers: function () {

        var dueDate = this.model.get('date_due');
        var dateValue = new Date(dueDate);
        var currentDate = new Date();
        var infoState = dateValue < currentDate ? 'Warning' : 'Success';
        var info = base.formatFriendlyDate(dueDate);
        var description = this.model.get('description');
        var type_name = this.model.get('type_name');
        type_name || (type_name = "Workflow");
        description || (description = type_name);

        return {
          name: this.model.get('short_name'),
          enableIcon: true,
          description: description,
          info: info,
          infoState: infoState,
          type: type_name
        };
      },
      checkDefaultAction: true
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var collection = this.options.collection ||
                           this.options.context.getCollection(MyAssignmentCollectionFactory);
          // Limit the scope of the response
          collection.excludeResources();
          collection.resetFields();
          collection.setFields({
            assignments: ['date_due', 'description', 'id', 'name', 'type', 'type_name',
              'location_id', 'followup_id', 'workflow_id', 'workflow_open_in_smart_ui',
              'workflow_subworkflow_id', 'workflow_subworkflow_task_id']
          });
          collection.resetExpand();
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/myassignments/impl/myassignmentstable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'assignments'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-assignments');
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    }

  });

  return MyAssignmentsView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/placeholder/impl/placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\r\n";
}});
Handlebars.registerPartial('csui_widgets_placeholder_impl_placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/placeholder/impl/placeholder',[],function(){});
csui.define('csui/widgets/placeholder/placeholder.view',['csui/lib/backbone', 'csui/lib/marionette',
  'hbs!./impl/placeholder', 'css!./impl/placeholder'
], function (Backbone, Marionette, placeholderTemplate) {

  var PlaceholderView = Marionette.ItemView.extend({

    className: 'cs-placeholder tile',
    template: placeholderTemplate,

    constructor: function PlaceholderView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          label: options.data.label,
          bgcolor: options.data.bgcolor,
          color: options.data.color
        });
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      this.$el.css({
        color: this.model.get('color'),
        backgroundColor: this.model.get('bgcolor')
      });
    }

  });

  return PlaceholderView;
});

csui.define('csui/widgets/recentlyaccessed/recentlyaccessed.columns',["csui/lib/backbone"], function (Backbone) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // Fixed (system) columns have sequence number < 100, dynamic columns
  // have sequence number > 1000

  var RecentlyAccessedTableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'reserved',
      sequence: 30,
      noTitleInHeader: true // don't display a column header
    },
    {
      key: 'parent_id',
      sequence: 40
    },
    {
      key: 'access_date_last',
      sequence: 50
    },
    {
      key: 'size',
      sequence: 60
    },
    {
      key: 'modify_date',
      sequence: 70
    },
    {
      key: 'favorite',
      sequence: 910,
      noTitleInHeader: true, // don't display a column header
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return RecentlyAccessedTableColumns;

});

csui.define('csui/widgets/recentlyaccessed/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/recentlyaccessed/impl/nls/root/lang',{
  dialogTitle: 'Recently Accessed',
  searchPlaceholder: 'Search Recently Accessed',
  searchAria: 'Search for recently accessed objects',
  expandAria: 'Expand the Recently Accessed widget',
  emptyListText: 'There are no items to display.',
  loadingListText: 'Loading results...',
  failedListText: 'Loading results failed.',
  // Note: use the exact 'column_key' for the client-side column titles
  access_date_last: 'Last Accessed',
  parent_id: 'Location'
});



csui.define('css!csui/widgets/recentlyaccessed/impl/recentlyaccessed',[],function(){});
// Shows a list of links to current user's recently accessed nodes
csui.define('csui/widgets/recentlyaccessed/recentlyaccessed.view',['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view', 'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/base',
  'css!csui/widgets/recentlyaccessed/impl/recentlyaccessed'
], function (_, Marionette, ListView, ListItemStandard,
    LimitingBehavior, ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    RecentlyAccessedCollectionFactory, NodeTypeIconView, BlockingView,
    defaultActionItems, commands, lang, GlobalMessage, base) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var RecentlyAccessedView = ListView.extend({

    constructor: function RecentlyAccessedView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'access_date_last desc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-recentlyaccessed';

      options.tileViewToolbarItems = 'csui/widgets/recentlyaccessed/tileview.toolbaritems';
      this.context = options.context;
      this.showInlineActionBar = !accessibleTable;
      ListView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria
      };
    },

    childView: ListItemStandard,

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          return {
            name: this.model.get('short_name'),
            enableIcon: true,
            showInlineActionBar: !accessibleTable
          };
        },
        context: this.context,
        checkDefaultAction: true,
        //Set these values inorder to disaply Inline Actions
        toolbarData: {
          toolbaritems: this.options.tileViewToolbarItems,
          collection: this.completeCollection
        }
      };
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var collection = this.options.collection ||
                           this.options.context.getCollection(RecentlyAccessedCollectionFactory);
          var limitedRS = RecentlyAccessedCollectionFactory.getLimitedResourceScope();
          collection.setResourceScope(limitedRS);
          collection.setEnabledDelayRestCommands(true);
          collection.setEnabledLazyActionCommands(false); //dont fetch lazy actions for recently
          // accessed tile view
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/recentlyaccessed/impl/recentlyaccessedtable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'recentlyaccessed'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-recentlyaccessed');

      if (this.completeCollection.delayedActions) {
        this.listenTo(this.completeCollection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    }

  });

  return RecentlyAccessedView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcut/impl/shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-header\">\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.short_name || (depth0 != null ? depth0.short_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"short_name","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"tile-icon\">\r\n  <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcut_impl_shortcut', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/shortcut/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcut/impl/nls/root/lang',{
  loadingText: 'Loading...'
});



csui.define('css!csui/widgets/shortcut/impl/shortcut',[],function(){});
// Shows the Shortcut widget of a specific node
csui.define('csui/widgets/shortcut/shortcut.view',[
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node', 'csui/utils/node.links/node.links',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'hbs!csui/widgets/shortcut/impl/shortcut',
  'i18n!csui/widgets/shortcut/impl/nls/lang',
  'css!csui/widgets/shortcut/impl/shortcut',
], function (Backbone, Marionette, DefaultActionBehavior, TabableRegionBehavior,
    ItemErrorBehavior, NodeModelFactory, nodeLinks, defaultActionItems, commands,
    shortcutTemplate, lang) {
  'use strict';

  //
  // Constructor options:
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - background: css background class
  //
  var ShortcutView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#'
    },

    className: function () {
      var background = this.options.data.background || 'cs-tile-background-default';
      return 'cs-shortcut tile ' + background;
    },

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:link'
    },

    template: shortcutTemplate,

    templateHelpers: function () {
      var name, short_name, first_space;
      if (this.model.fetched) {
        name = this.model.get('name') || '';
        short_name = name.length > 38 ? name.substr(0, 38) + '...' : name;
        first_space = short_name.indexOf(' ');
        if (short_name.length >= 20 && (first_space < 0 || first_space > 20)) {
          short_name = short_name.substr(0, 18) + '...';
        }
      } else {
        short_name = lang.loadingText;
      }
      return {
        short_name: short_name,
        icon: this.options.data.icon || "icon-folder",
        title: this.model.get('name')
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ItemError: {
        behaviorClass: ItemErrorBehavior
      }
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {
      return this.$el;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod("click:link");
      }
    },

    constructor: function ShortcutView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: {
            id: options.data.id || 'volume',
            type: options.data.type
          }
        });
      }

      Marionette.ItemView.prototype.constructor.call(this, options);

      // Limit the scope of the response
      this.model.excludeResources();
      this.model.resetFields();
      this.model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type'],
        'versions.element(0)': ['mime_type']
      });
      this.model.resetExpand();
      this.model.setExpand({
        properties: ['original_id']
      });
      this.model.resetCommands();
      this.model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },

    onRender: function () {
      var disabled = !this.model.fetched ||
                     !this.defaultActionController.hasAction(this.model);
      this.$el[disabled ? 'addClass' : 'removeClass']('csui-disabled');
      this.$el.attr('href', nodeLinks.getUrl(this.model) || '#');
    },

    onClickLink: function () {
      this.triggerMethod('execute:defaultAction', this.model);
    }
  });

  return ShortcutView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details\">\r\n    <div class=\"tile-icon\">\r\n        <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n    </div>\r\n\r\n    <div class=\"tile-title\">\r\n        <h2 class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</h2>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_small.shortcut', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details\">\r\n    <div class=\"tile-icon\">\r\n        <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n    </div>\r\n\r\n    <div class=\"tile-title\">\r\n        <h2 class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</h2>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_medium.shortcut', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-header\">\r\n    <div class=\"tile-title\">\r\n        <h2 class=\"csui-heading\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.shortcutAria || (depth0 != null ? depth0.shortcutAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortcutAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</h2>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"tile-icon\">\r\n    <div class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcut_impl_large.shortcut', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/shortcuts/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcuts/impl/nls/root/lang',{
  loadingText: 'Loading...',
  shortcutPrefixAria: 'Shortcut to'
});



csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',[],function(){});

csui.define('css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',[],function(){});
// Shows the Shortcuts widget of specific nodes
csui.define('csui/widgets/shortcuts/impl/shortcut/shortcut.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut'
], function (
  _,
  $,
  Backbone,
  Marionette,
  DefaultActionBehavior,
  ItemErrorBehavior,
  NodeModelFactory,
  defaultActionItems,
  commands,
  smallShortcutTemplate,
  mediumShortcutTemplate,
  largeShortcutTemplate,
  lang) {
  
  'use strict';
  
  //
  // Constructor options:
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - theme: css theme class
  //
  var ShortcutView = Marionette.ItemView.extend({
  
    constructor: function MiniShortcutView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.data.icon = options.data.icon || 'icon-folder';
      options.data.theme = options.data.theme || 'csui-shortcut-theme-grey-shade1';
      options.data.layout = options.data.layout || 'small';

      options.model = options.context.getModel(NodeModelFactory, {
        attributes: {
          id: options.data.id || 'volume',
          type: options.data.type
        }
      });

      Marionette.ItemView.prototype.constructor.call(this, options);
  
      // Limit the scope of the response
      this.model.excludeResources();
      this.model.resetFields();
      this.model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type'],
        'versions.element(0)': ['mime_type']
      });
      this.model.resetExpand();
      this.model.setExpand({
        properties: ['original_id']
      });
      this.model.resetCommands();
      this.model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },

    tagName: 'a',

    className: function() {
      var classArr = [];

      classArr.push('csui-shortcut-item');
      classArr.push('csui-acc-focusable');
      classArr.push(this.options.data.theme);
      classArr.push('csui-' + this.options.data.layout);

      return classArr.join(' ');
    },

    getTemplate: function() {
      var template;

      if (this.options.data.layout === 'small') {
        template = smallShortcutTemplate;
      }
      else if (this.options.data.layout === 'medium') {
        template = mediumShortcutTemplate;
      }
      else {
        template = largeShortcutTemplate;
      }

      return template;
    },

    templateHelpers: function() {
      var favName = this.model.fetched ? this.model.get('name') : lang.loadingText;
      return {
        icon: this.options.data.icon,
        name: favName,
        shortcutAria: lang.shortcutPrefixAria + " " + favName
      };
    },

    onRender: function() {
      this.$el.attr('role', 'menuitem');
      if (this.model.fetched && this.defaultActionController.hasAction(this.model)) {
        this.$el.removeClass('csui-disabled');
      }
      else {
        this.$el.addClass('csui-disabled');
      }

      if (this.model.error) {
        this.$el.addClass('csui-failed');
      }
      else {
        this.$el.removeClass('csui-failed');
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ItemError: {
        behaviorClass: ItemErrorBehavior,
        errorViewOptions: function () {
          return {
            low: this.options.data.layout === 'small'
          };
        }
      }
    },

    modelEvents: {
      change: 'render'
    },

    events: {
      'click': 'onClicked'
    },

    onClicked: function() {
      this.triggerMethod('execute:defaultAction', this.model);
    }

  });

  return ShortcutView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/shortcuts/impl/shortcuts',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-shortcut-region csui-region-"
    + this.escapeExpression(((helper = (helper = helpers.layout || (depth0 != null ? depth0.layout : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"layout","hash":{},"data":data}) : helper)))
    + " shortcut-region-"
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" ></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars.registerPartial('csui_widgets_shortcuts_impl_shortcuts', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/shortcuts/impl/shortcuts',[],function(){});
// Shows the Shortcuts widget of specific nodes
csui.define('csui/widgets/shortcuts/shortcuts.view',[
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "csui/widgets/shortcuts/impl/shortcut/shortcut.view",
  "hbs!csui/widgets/shortcuts/impl/shortcuts",
  "css!csui/widgets/shortcuts/impl/shortcuts"
], function (
  _,
  $,
  Backbone,
  Marionette,
  TabableRegionBehavior,
  MiniShortcutView,
  shortcutsTemplate) {
  
  'use strict';

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];
  
  //
  // Constructor options:
  // - node.id: The object (node) ID.  Either node.id or node.type is mandatory.
  // - node.type: The object type for known volumes (e.g. type=141 for Enterprise Workspace)
  // - icon: css icon class
  // - shortcutTheme: css theme class
  //
  var ShortcutsView = Marionette.LayoutView.extend({
  
    constructor: function ShortcutsView(options) {
      options || (options = {});
      options.data || (options.data = {shortcutItems:[]});
    
      Marionette.LayoutView.prototype.constructor.call(this, options);
    
      this._setupItems();
      this._currentShortcutIndex = 0;
    },
  
    _setupItems: function() {
      var self = this;
    
      // maximum of 4 items
      self._items = _.map(_.first(this.options.data.shortcutItems, 4), function(item, index, arr) {
        var theme = self._getShortcutTheme(index, arr.length);
        var layout;
        
        if (self.options.data.shortcutItems.length === 1) {
          layout = "large";
        }
        else if (self.options.data.shortcutItems.length === 2) {
          layout = "medium";
        }
        else {
          layout = "small";
        }

        return {
          id: (item.id || item.lauchButtonID),
          type: item.type,
          layout: layout,
          shortcutView: self._getShortcutView((item.id || item.launchButtonID), item.type, self.options.context, layout, theme)
        };
      });
    },

    tagName: 'div',

    className: "csui-shortcut-container tile",

    regions: {
      "shortcut0": ".shortcut-region-0",
      "shortcut1": ".shortcut-region-1",
      "shortcut2": ".shortcut-region-2",
      "shortcut3": ".shortcut-region-3"
    },

    _getShortcutTheme: function(itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme : "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        itemIndex += (4 - numberOfItems);
        theme += "-" + THEME_SUFFIX[itemIndex];
      }

      return theme;
    },

    _getShortcutView: function(id, type, context, layout, theme) {
      return new MiniShortcutView({
        data: {
          id: id,
          type: type,
          theme: theme,
          layout: layout
        },
        context: context
      });
    },

    template: shortcutsTemplate,

    templateHelpers: function() {
      return {
        items: this._items
      };
    },

    onRender: function () {
      var self = this;

      this.$el.attr('role', 'menu');

      _.each(this._items, function(item, index) {
        self.getRegion("shortcut" + index).show(item.shortcutView);
      });
    },
    
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function() {
      return this._items[this._currentShortcutIndex].shortcutView.$el;
    },

    onKeyInView: function(event) {
      if (event.keyCode === 38) {
        this._selectPreviousShortcut();
      }
      else if (event.keyCode === 40) {
        this._selectNextShortcut();
      }
      else if (event.keyCode === 32 || event.keyCode === 13) {
        this.currentlyFocusedElement().click();
      }
    },
    
    _selectNextShortcut: function() {
      var index = Math.min(this._currentShortcutIndex + 1, this._items.length - 1);
      this._selectShortcut(index);
    },
    
    _selectPreviousShortcut: function() {
      var index = Math.max(this._currentShortcutIndex - 1, 0);
      this._selectShortcut(index);
    },
    
    _selectShortcut: function(index) {
      if (index !== this._currentShortcutIndex) {
        this._currentShortcutIndex = index;
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().focus();
      }
    }
    
  });
  
  return ShortcutsView;

});

csui.define('csui/widgets/welcome.placeholder/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/welcome.placeholder/impl/nls/root/lang',{
  greetingWithName: 'Hello {0}',
  greetingWithoutName: 'Hello',
  greetingMorning: 'Good morning, {0}!',
  greetingAfternoon: 'Good afternoon, {0}!',
  greetingEvening: 'Good evening, {0}!',
  videoLabel: 'Smart UI introduction video',
  videoSrc: '//sunnyside.vidavee.com/opentext/rest/file/GetFileAsset/191B9D509053D8BF4B3901CDE6941A13/cs-smart-ui.mp4',
  videoPoster: '//sunnyside.vidavee.com/opentext/rest/file/GetFileThumbnail/191B9D509053D8BF4B3901CDE6941A13/thumbnail.jpg',
  message: 'As a foundational technology in the Digital Workplace, OpenText Content Suite 16 will pave the way to personal productivity, seamless collaboration, and integration with business processes.'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n  <div class=\"binf-modal-dialog\">\r\n    <div class=\"binf-modal-content csui-video\">\r\n      <video  preload=\"none\"\r\n             poster=\""
    + this.escapeExpression(((helper = (helper = helpers.videoPoster || (depth0 != null ? depth0.videoPoster : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoPoster","hash":{}}) : helper)))
    + "\"\r\n             controls=\"controls\">\r\n        <source\r\n          src=\""
    + this.escapeExpression(((helper = (helper = helpers.videoSrc || (depth0 != null ? depth0.videoSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoSrc","hash":{}}) : helper)))
    + "\"\r\n          type=\"video/mp4\">\r\n        </source>\r\n      </video>\r\n\r\n    </div>\r\n  </div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_welcome.placeholder_impl_welcome.video_welcome.video', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',[],function(){});
csui.define('csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', "csui/utils/url", 'csui/utils/contexts/factories/node',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'css!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, base, Url, NodeModelFactory, lang,
  TabablesBehavior, TabableRegionBehavior, template) {

  var WelcomeVideo = Marionette.ItemView.extend({

    _dataDefaults:{
      videoSrc: lang.videoSrc,
      videoPoster: lang.videoPoster
    },

    className: 'cs-dialog welcome-video binf-modal binf-fade',

    template: template,

    events: {
      'hide.binf.modal': 'onDestroy',
      'hidden.binf.modal': 'onDestroy',
      'keydown video' : 'onKeyDown',
      'shown.binf.modal': 'onShown'
    },

    templateHelpers: function(){
      var optionsData = this.options.data;
      return {
        videoSrc: optionsData.videoSrc,
        videoPoster: optionsData.videoPoster
      };
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function WelcomeVideo(options) {
      options || (options = {});
      options.data || (options.data = {});
      _.each(this._dataDefaults, function(value,key){
        var serverValue = options.data[key];
        if (!serverValue){
          options.data[key] = value;
        }
      });
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.connection = options.context.getModel(NodeModelFactory).connector.connection;
    },

    onKeyDown: function(event) {
      if(event.keyCode === 27) {
        this.destroy();
      }
    },

    onDestroy: function(){
      TabablesBehavior.popTabableHandler();
      this.$el.remove();
    },


    show: function () {
      this.render();
      if (base.isAppleMobile()){
        this.$el.addClass('mobile');
      }
      this.$el.binf_modal('show');
    },

    onShown: function () {
    this.$('video').focus();
   }



  });

  return WelcomeVideo;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/welcome.placeholder/impl/welcome.placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <button class=\"csui-videoButton\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.videoLabel || (depth0 != null ? depth0.videoLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"videoLabel","hash":{}}) : helper)))
    + "\"></button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-message\">\r\n    <p title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "\r\n<div class=\"csui-hero-tile\">\r\n  <div class=\"csui-greeting\">"
    + this.escapeExpression(((helper = (helper = helpers.greeting || (depth0 != null ? depth0.greeting : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"greeting","hash":{}}) : helper)))
    + "</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.includeVideo : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.includeMessage : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_welcome.placeholder_impl_welcome.placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/welcome.placeholder/impl/welcome.placeholder',[],function(){});
csui.define('csui/widgets/welcome.placeholder/welcome.placeholder.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video.view',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  'hbs!csui/widgets/welcome.placeholder/impl/welcome.placeholder',
  'css!csui/widgets/welcome.placeholder/impl/welcome.placeholder'
], function ($,
    _,
    Marionette,
    base,
    UserModelFactory,
    TabableRegionBehavior,
    WelcomeVideo,
    lang,
    placeholderTemplate) {

  var WelcomeView = Marionette.ItemView.extend({

    _dataDefaults: {
      includeMessage: true,
      includeVideo: true,
      message: lang.message
    },

    className: 'tile hero',

    template: placeholderTemplate,

    ui: {
      welcomeMessageContainer: '> .csui-hero-tile .csui-message',
      welcomeMessage: '> .csui-hero-tile .csui-message > p'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    triggers: {
      'click .csui-hero-tile': 'show:video'
    },

    templateHelpers: function () {
      var optionsData = this.options.data,
          firstName   = this.user.get('first_name'),
          date        = new Date(),
          hour        = date.getHours(),
          greeting    = hour < 12 ? lang.greetingMorning :
                        hour < 18 ? lang.greetingAfternoon : lang.greetingEvening;

      // TODO the no-firstname-case will fail with some localized language files, where the expected format , {0} was not kept by translators.
      greeting = firstName ? _.str.sformat(greeting, firstName) : greeting.replace(/, |\{0\}/g, '');
      return {
        videoSrc: optionsData.videoSrc,
        videoPoster: optionsData.videoPoster,
        includeMessage: optionsData.includeMessage,
        includeVideo: optionsData.includeVideo,
        greeting: greeting,
        message: optionsData.message,
        videoLabel: lang.videoLabel
      };
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {
      return this.$el;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space(32) or enter(13)
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod("show:video");
      }
    },

    constructor: function WelcomeView(options) {
      options || (options = {});
      options.data || (options.data = {});
      _.each(this._dataDefaults, function(value,key){
        var serverValue = options.data[key];
        if (serverValue == null || serverValue === ''){
          options.data[key] = value;
        }
      });
      Marionette.ItemView.call(this, options);
      this.user = options.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change', this._displayUsername);
      $(window).bind("resize.app", this.render);
      this.listenTo(this, 'dom:refresh', this._setTextEllipse);
    },

    onRender: function() {
      var helpers = this.templateHelpers();
      if (helpers.includeVideo) {
        this.$el.attr('aria-label', helpers.greeting + " " + helpers.videoLabel);
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.render);
    },

    onShowVideo: function () {
      var welcomeVideo = new WelcomeVideo(this.options);
      welcomeVideo.show();
    },

    _setTextEllipse: function () {
      var welcomeMessage  = this.ui.welcomeMessage,
          containerHeight = this.ui.welcomeMessageContainer.height(),
          lineHeight      = parseInt(welcomeMessage.css('line-height'), 10) + 2;

      if (lineHeight < containerHeight) {
        while (welcomeMessage.outerHeight() > containerHeight) {
          var text = welcomeMessage.text();
          var shortenedText = text.replace(/\W*\s(\S)*$/, '...');
          if (shortenedText.length < text.length) {
            welcomeMessage.text(shortenedText);
          } else {
            break;
          }
        }
        this.ui.welcomeMessageContainer.removeClass('binf-hidden');
      }
      else {
        this.ui.welcomeMessageContainer.addClass('binf-hidden');
      }
    }
  });

  return WelcomeView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <div id=\"cs-link-content\" class=\"cs-link-content\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div id=\"cs-link-image\" class=\"cs-link-image\">"
    + ((stack1 = ((helper = (helper = helpers.LinkPreviewImage || (depth0 != null ? depth0.LinkPreviewImage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"LinkPreviewImage","hash":{}}) : helper))) != null ? stack1 : "")
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div id=\"cs-link\" class=\"cs-link\">\r\n  <div class=\"cs-link-popoverhead\">\r\n    <div id=\"cs-link-heading\" class=\"cs-link-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.LinkHeading || (depth0 != null ? depth0.LinkHeading : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"LinkHeading","hash":{}}) : helper)))
    + "</div>\r\n    <div id=\"cs-link-expand\" class=\"cs-link-expand cs-link-expand-icon\"></div>\r\n  </div>\r\n  <div class=\"cs-link-preview-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPreviewContent : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isLinkPreviewImage : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_cslink.preview_cslink.preview', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',[],function(){});
csui.define(
    'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
      'csui/behaviors/default.action/default.action.behavior',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'csui/models/node/node.model', 'csui/utils/commands', 'csui/utils/url',
      'hbs!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'css!csui/widgets/html.editor/impl/cslink.preview/cslink.preview'
    ], function ($, _, Backbone, Marionette, DefaultActionBehavior, Utils, NodeModel,
        commands, Url, linkTemplate, lang) {

      var CSLinkPreview = Marionette.ItemView.extend({
        template: linkTemplate,
        className: 'cs-link',
        behaviors: {
          DefaultAction: {
            behaviorClass: DefaultActionBehavior
          }
        },
        subTypeName: 'wiki',
        constructor: function CSLinkPreview(options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.call(this, options);
          this.options = options;
          this.subTypeName = options.subTypeName || this.subTypeName;
          this.modelFetched = false;
          this.linkPreviewContent = null;
          this.linkPreviewImage = null;
          var that = this;
          this._obtainId().done(function () {
            that._executeProcess();
          });
        },

        _obtainId: function () {
          this.id = this.options.objId || -1;
          var targetEle  = this.options.targetEle,
              targetHref = targetEle.href || targetEle.closest('a').href;
          var hrefMatcher = targetHref.match(/^.*\/open\/(.+)$/i) ||
                            targetHref.match(/^.*\/nodes\/(.+)$/i),
              deferred    = $.Deferred(),
              that        = this,
              canResolve  = true;

          if (this.options.isSameDomain) {  // if link is of same domain
            if (!!hrefMatcher) {  // if the links contain nodes
              if (isNaN(parseInt(hrefMatcher[1]))) {    // if nodeid in link is not a number
                canResolve = false;
                var nickName = this.options.targetEle.href &&
                               this.options.targetEle.href.substring(
                                   this.options.targetEle.href.lastIndexOf("/") + 1,
                                   this.options.targetEle.href.length),
                    node;
                Utils._getNicknameId(that.options, nickName).done(function (response) {
                  node = Utils.getNewNodeModel({}, {connector: that.options.connector});
                  node.attributes = node.parse(response);
                  node = Utils.getNewNodeModel({attributes: node.attributes},
                      {connector: that.options.connector});
                  that.model = node;
                  that.id = that.model.get("id");
                  deferred.resolve();
                }).fail(function(){
                  $(that.options.targetEle).attr("title", lang.cannotFindObject);
                });
              } else {   // if nodeid is a number
                this.id = hrefMatcher[1];
              }
            }
          }
          if (!!canResolve) {
            deferred.resolve();
          }
          return deferred.promise();
        },

        _executeProcess: function () {
          if (this.id !== -1) {
            this.model = new NodeModel({
              id: this.id
            }, {
              connector: this.options.connector,
              commands: commands.getAllSignatures(),
              fields: this.options.fields || {},
              expand: this.options.expand || {}
            });

            this.model.fetch().fail(_.bind(function () {
              $(this.options.targetEle).attr("title", lang.cannotFindObject);
            }, this));
            this.listenTo(this.model, 'sync', function (e) {
              this.linkHeading = this.model.attributes.name;
              var that    = this,
                  promise = this._getContent();
              promise.done(function (res) {
                if (that.model.get('type') === 5574) {
                  that._callbackExecuteProcess(res);
                }
                else {
                  $(that.options.targetEle).attr("title",
                      _.str.sformat(lang.goToTooltip, that.model.get("name")));
                }
              });
            });
          }
          else {
            $(this.options.targetEle).attr("title", lang.previewUnavailable);
          }
        },

        _getContent: function () {
          var deferred       = $.Deferred(),
              connector      = this.options.connector,
              collectOptions = connector.extendAjaxOptions({
                url: this._getUrl(),
                type: 'GET'
              });

          $.ajax(collectOptions).done(function (resp) {
            deferred.resolve(resp);
          }).fail(function (resp) {
            deferred.reject(resp);
          });
          return deferred.promise();
        },

        _getUrl: function () {
          return this.options.connector.connection.url.replace('/v1', '/v2') + '/' +
                 this.subTypeName +
                 '/' + this.id + "/previewcontent";
        },

        _callbackExecuteProcess: function (res) {
          this.modelFetched = true;
          this.linkPreviewImage = res.results.data.firstImage;
          this.linkPreviewContent = res.results.data.previewContent;
          var content = $("<div>" + this.linkPreviewContent + "</div>").find("*").text().trim();
          this.isEmptyContent = (content === "" || content === lang.pageDefaultContent);
          if (!this.isDestroyed) {
            $(this.options.targetEle).attr({"title":"","data-binf-original-title":""});
            if ((this.linkPreviewContent !== null && !this.isEmptyContent) ||
                this.linkPreviewImage !== null) {
              this.render();
              $(this.options.targetEle).binf_popover('show');
              if (this.linkPreviewContent !== null && !this.isEmptyContent) {
                $('.cs-link-content').html(this.linkPreviewContent);
              }
              else {
                $('.cs-link-preview-content').addClass('cs-link-image-only');
              }
              this.eventHandlers();
            } else {
              $(this.options.targetEle).attr("title",
                  _.str.sformat(lang.goToTooltip, this.model.get("name")));
            }
          }
        },

        onDestroy: function () {
          this.hidePopover();
        },
        eventHandlers: function () {
          var that = this;
          $('.cs-link-popover').on("mouseleave", function (e) {
            if ($("#" + e.target.id).attr("aria-describedby") !==
                $(that.options.targetEle).attr("aria-describedby")) {
              that.hidePopover();
            }
          });
          $('.cs-link-expand').on('click', function (e) {
            that.expandLinkView();
          });
        },
        hidePopover: function () {
          $(this.options.targetEle).binf_popover('hide');
          $(this.options.targetEle).binf_popover('destroy');
        },
        expandLinkView: function () {
          this.triggerMethod("execute:defaultAction", this.model);
        },
        onRender: function () {
          var that = this;
          if (this.modelFetched) {
            var targetEle = this.options.targetEle;
            var contentparams = {
                  "LinkHeading": this.linkHeading,
                  "isLinkPreviewImage": this.linkPreviewImage !== null ? true : false,
                  "LinkPreviewImage": this.linkPreviewImage,
                  "isPreviewContent": !this.isEmptyContent,
                  "linkPreviewContent": this.linkPreviewContent
                },
                content       = this.template(contentparams);

            $(targetEle).binf_popover({
              html: true,
              trigger: "manual",
              content: content,
              container: $.fn.binf_modal.getDefaultContainer(),
              placement: function (context) {
                $(context).addClass("cs-link-popover");
                var _tempElement = $('<div/>')
                    .attr("style", "display:none")
                    .addClass("cs-link-popover binf-popover cs-link-popover-temp-div")
                    .append(linkTemplate);
                $(targetEle).append(_tempElement);
                if (that.linkPreviewImage === null ||
                    (that.linkPreviewContent === null || that.isEmptyContent)) {
                  $(context).addClass('cs-link-preview-width');
                }
                var popOverMaxHeight = $(".cs-link-popover-temp-div").height() + 40,
                    popOverMaxWidth  = $(".cs-link-popover-temp-div").width() + 40;
                _tempElement.remove();
                var popOverSource = $(targetEle),
                    offset        = popOverSource.offset(),
                    window_left   = offset.left,
                    window_top    = offset.top,
                    window_right  = (($(window).width()) -
                                     (window_left + popOverSource.outerWidth())),
                    window_bottom = (($(window).height()) -
                                     (window_top + popOverSource.outerHeight(true)));
                if (window_bottom > popOverMaxHeight) {
                  that.popoverPosition = "bottom";
                  return "bottom";
                } else if (window_top > popOverMaxHeight) {
                  that.popoverPosition = "top";
                  return "top";
                } else if (window_right > popOverMaxWidth) {
                  that.popoverPosition = "right";
                  return "right";
                } else if (window_left > popOverMaxWidth) {
                  that.popoverPosition = "left";
                  return "left";
                } else {
                  that.popoverPosition = "auto";
                  return "auto";
                }
              }
            });
          }
          $("*").one('scroll', function () {
            that.destroy();
          });
          $(this.options.targetEle).one("remove", function () {
            that.destroy();
          });
          // hide the popover on mouseleave of target element
          $(this.options.targetEle).off("mouseleave").on("mouseleave", function (e) {
            setTimeout(function () {
              if ($(".cs-link-popover:hover").length === 0) {
                that.destroy();
              }
            }, 10);
          });
        }
      });
      return CSLinkPreview;
    });

csui.define('csui/widgets/html.editor/impl/html.editor.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model'
], function (_, $, Backbone, Url, NodeModel) {
  "use strict";

  var HtmlEditorModel = NodeModel.extend({

    constructor: function HtmlEditorModel(options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, options);
      //this.options.connector.assignTo(this);
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  _.extend(HtmlEditorModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      var url = Url.combine(this.options.connector.connection.url,
          "nodes/" + this.options.id + "/content");
      return url;
    },

    parse: function (response) {
      return {
        'data': response,
        'oldData': response //old Data required on cancel after updating data with autosaved
      };
    }
  });

  return HtmlEditorModel;

});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='csui-richtext-message-wrapper'>\r\n  <div id=\"csui-richtext-content-body-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" class=\"csui-richtext-message\"\r\n       contentEditable=\"false\" placeholder = \""
    + this.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder","hash":{}}) : helper)))
    + "\">\r\n    "
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"data","hash":{}}) : helper))) != null ? stack1 : "")
    + "\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"binf-dropdown\">\r\n    <a tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\" class=\"binf-dropdown-toggle csui-html-editor-control\"\r\n       href=\"#\" data-binf-toggle=\"dropdown\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.moreActionsAria || (depth0 != null ? depth0.moreActionsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"moreActionsAria","hash":{}}) : helper)))
    + "\"\r\n       aria-expanded=\"false\">\r\n      <span class=\"csui-icon "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " "
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\">\r\n      </span>\r\n    </a>\r\n    <ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " csui-html-editor-reserved-icon ";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-icon csui-html-editor-reserved-readonly "
    + this.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconClass","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)))
    + "\">\r\n    </span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.haveEditPermission : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_dropdown.menu_dropdown.menu', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.option',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionName","hash":{}}) : helper)))
    + "\">\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionName","hash":{}}) : helper)))
    + "\r\n</a>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_dropdown.menu_dropdown.option', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
      'csui/lib/marionette', 'csui/models/nodes', 'csui/utils/commands',
      'csui/utils/contexts/factories/member',
      'csui/utils/base',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.option'],
    function (module, _, $, Backbone, Marionette, NodeCollection, commands,
        MemberModelFactory, base, lang, TemplateDropdownMenu, TemplateDropdownOption) {
      'use strict';

      var DropdownOption = Marionette.ItemView.extend({
        tagName: 'li',
        template: TemplateDropdownOption,
        events: {
          'click a': '_executeAction',
          'keyup a': 'onKeyUp'
        },
        templateHelpers: function () {
          return {
            actionName: lang[this.model.get('signature') || this.model.get('name')]
          };
        },
        constructor: function (options) {
          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },
        _executeAction: function () {
          if (this.options.openForEdit) {
            this.options.openForEdit();
          } else {
            var self = this;
            this.options.command.execute(this.options.status).always(function () {
              self.trigger('csui.command.executed', this);  // this contains promise object
            });
          }
        },

        onKeyUp: function (event) {
          if ([13, 32].indexOf(event.keyCode) !== -1) { // enter, space
            this._executeAction();
          }
        }
      });

      var DropdownMenuView = Marionette.CompositeView.extend({
        className: "csui-html-editor-dropdown",
        template: TemplateDropdownMenu,
        childView: DropdownOption,
        childViewContainer: "ul.binf-dropdown-menu",
        childEvents: {
          'csui.command.executed': 'afterCommandExecution'
        },
        ui: {
          'dropdownMenu': '.binf-dropdown-menu'
        },
        childViewOptions: function (actionModel) {
          var signature = !!actionModel.get('openForEdit') ? 'HTMLEdit' :
                          actionModel.get('signature');
          //from restapi actionModel getting all small
          //but command signature is first cap in actual
          //signature = signature.charAt(0).toUpperCase() + signature.substring(1);
          var options = {
            status: this.status,
            node: this.options.node
          };
          if (signature === 'HTMLEdit') {
            options.openForEdit = this.options.openForEdit;
          } else {
            if (signature === 'properties') {
              //signature of properties command starts with Capital char
              //deviation from other this.model signature.
              signature = "Properties";
            } else if (['reserve', 'unreserve'].indexOf(signature) !== -1) {
              if (signature === 'unreserve') {
                signature = "Unreserve";
              } else {
                signature = "Reserve";
              }
              signature += 'Doc';
            }
            options.command = commands.get(signature);
          }
        
        
          return options;
        },
        templateHelpers: function () {
          var helpers = {
            haveEditPermission: this.haveEditPermissions,
            tooltip: lang.more,
            iconClass: 'icon-html-edit-toolbar-more',
            reserved: this.node.get('reserved'),
            moreActionsAria: _.str.sformat(lang.moreActionsAria,
                !!this.parentView.options.title ? this.parentView.options.title : '')
          };
          if (helpers.reserved) {
            var selfReserved = this.node.get('reserved_user_id') === this.user.get(
                    'id');
            if (!selfReserved) {
              helpers.tooltip = _.str.sformat(lang.reservedBy, this.node.get('reserved_user_id'),
                  base.formatExactDate((
                      this.node.get('reserved_date'))));
            }
            helpers.iconClass = selfReserved ? 'icon-html-editor-reserved-owned' :
                                'icon-html-editor-reserved_other';
          }
          return helpers;
        },

        constructor: function DropdownMenuView(options) {
          this.parentView = options.parentView;
          this.node = options.node;
          this.user = options.user;
          this.haveEditPermissions = !!(options.node.actions.get('reserve') || options.node.actions
              .get('unreserve'));
          options.collection = this.buildCollection();
          Marionette.CompositeView.prototype.constructor.apply(this, arguments);
          this.listenTo(this.options.node, 'change', this.updateActionCollection);
          this.status = {
            context: this.options.context,
            container: this.options.node,
            nodes: new NodeCollection([this.options.node])
          };
          if (this.node.get('reserved') &&
              this.node.get('reserved_user_id') !== this.user.get('id')) {
            this.reservedByUserModel = this.options.context.getModel(MemberModelFactory, {
              attributes: {
                id: this.node.get('reserved_user_id')
              }
            });
          }
        },

        buildCollection: function () {
          // it should be better if we manipulate the collection rather than creating new
          // but for now let it be this way
          var collection = new Backbone.Collection();
          if (this.haveEditPermissions) {
            if (!this.node.get('reserved') ||
                this.node.get('reserved_user_id') === this.user.get('id')) {
              collection.add(new Backbone.Model({
                openForEdit: true,
                name: 'Edit'
              }));
            }
            var action, supportedActions = ['properties', 'permissions', 'unreserve'],
                self                     = this;
            supportedActions.map(function (action) {
              action = self.node.actions.get(action);
              action && collection.add(action);
            });
          }
          return collection;
        },

        updateActionCollection: function () {
          this.haveEditPermissions = !!(this.options.node.actions.get('reserve') ||
                                        this.options.node.actions.get('unreserve'));
          this.collection = this.buildCollection();
          this.render();
        },

        afterCommandExecution: function (childView, promise) {
          promise.fail(_.bind(function () {
            // add fail callbacks here
            if (childView.model.get('name') === 'Unreserve') {
              // concurrent scenerio where unreserve is shown
              // but item has been unreserved already
              this.node.fetch();
            }
          }, this));
        },
        adjustDropdownMenu: function () {
          if (document.dir === 'rtl') {
            return false;
          }
          this.ui.dropdownMenu.removeClass("csui-html-editor-floating-dd-menu");
          var dropdownLeftOffset   = this.ui.dropdownMenu.offset().left,
              dropdownWidth        = this.ui.dropdownMenu.outerWidth(),
              originatingViewWidth = document.body.scrollWidth,
              ddMenuOverlaps       = dropdownLeftOffset + (2 * dropdownWidth) <=
                                     originatingViewWidth;
          if (ddMenuOverlaps) {
            this.ui.dropdownMenu.addClass("csui-html-editor-floating-dd-menu");
          }
        },
        onRender: function () {
          var dropDown = this.$el.find('.binf-dropdown');
          dropDown.bind('binf.dropdown.before.show', _.bind(function () {
            dropDown.bind('binf.dropdown.after.show', this.adjustDropdownMenu.bind(this));
            $(window).bind('resize.html.editor.dropdown.menu', this.adjustDropdownMenu.bind(
                this));
          }, this));
          dropDown.bind('hide.binf.dropdown', _.bind(function () {
            dropDown.unbind('binf.dropdown.after.show');
            $(window).unbind('resize.html.editor.dropdown.menu');
          }));
          if (!!this.reservedByUserModel && !this.reservedByUserModel.fetched) {
            this.reservedByUserModel.fetch().done(_.bind(function (response) {
              this.$el.find('.binf-dropdown-toggle.csui-html-editor-control,' +
                            ' .csui-html-editor-reserved-readonly').attr('title',
                  _.str.sformat(lang.reservedBy, response.data.display_name,
                      base.formatExactDate((
                          this.node.get('reserved_date')))));
            }, this));
          }
        }
      });
      return DropdownMenuView;
    });


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/edit.icon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-rich-text-edit-icon-wrapper csui-rich-text-edit-icon-wrapper-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n  <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.editLable || (depth0 != null ? depth0.editLable : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"editLable","hash":{}}) : helper)))
    + "\" class=\"icon icon-edit icon-edit-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\"></span>\r\n</span>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_edit.icon', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor.action.buttons',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-html-editor-action-buttons\">\r\n  <button type=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.saveLabel || (depth0 != null ? depth0.saveLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveLabel","hash":{}}) : helper)))
    + "\" role=\"button\" data-cstabindex=\"-1\" tabindex=\"-1\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveAria || (depth0 != null ? depth0.saveAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveAria","hash":{}}) : helper)))
    + "\"\r\n          class=\"icon circular csui-html-edit-icon csui-html-edit-save\"></button>\r\n  <button type=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelLabel || (depth0 != null ? depth0.cancelLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelLabel","hash":{}}) : helper)))
    + "\" role=\"button\" data-cstabindex=\"-1\" tabindex=\"-1\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\"\r\n          class=\"icon circular csui-html-edit-icon csui-html-edit-cancel\"></button>\r\n</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor.action.buttons', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/impl/html.editor.content.view',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/url',
  'csui/utils/base',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/user',
  'csui/widgets/html.editor/impl/html.editor.model',
  'hbs!csui/widgets/html.editor/impl/html.editor', 'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/progressblocker/blocker',
  'csui/controls/error/error.view',
  'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',
  'csui/controls/rich.text.editor/rich.text.editor',
  'csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/node.links/node.links',
  'i18n!csui/widgets/html.editor/impl/nls/lang',
  'hbs!csui/widgets/html.editor/impl/edit.icon',
  'hbs!csui/widgets/html.editor/impl/html.editor.action.buttons',
  'css!csui/widgets/html.editor/impl/html.editor'
], function ($, _, Backbone, Marionette, ConnectorFactory, Url, base, NodeModel, UserModelFactory,
    HtmlEditorModel, htmlEditorTemplate, ModalAlert,
    BlockingView, ErrorView,
    LinkPreview, RichTextEditor, DropdownMenu, GlobalMessage, NodeLinks, lang, template,
    htmlEditorButtonsTemplate) {

  'use strict';
  var HtmlEditorContentView = Marionette.ItemView.extend({

    className: 'csui-html-editor-wrapper',

    modelEvents: {
      'change': 'render',
      'error': 'render'
    },

    ui: {
      richText: '.csui-richtext-message'
    },

    events: {
      'mouseenter .csui-richtext-message[contenteditable="false"] a': '_showPreview',
      'focusin .csui-richtext-message[contenteditable="true"]': '_actionButtonsPositionInEdge',
      'focusin .csui-richtext-message[contenteditable="false"] a': '_updateUrl',
      'keyup': '_validateState'
    },

    getTemplate: function () {
      return this.model.error ? false : htmlEditorTemplate;
    },

    templateHelpers: function () {
      return {
        'placeholder': lang.PageDefaultContent,
        'id': this.model.get('id'),
        'data': this.model.get('data')
      };
    },

    constructor: function HtmlEditorContentView(options) {
      options || (options = {});
      options.id = options.wikiPageId;
      options = _.extend(options, (options.data = {}));
      this.parentView = options.parentView;
      this.ui.richTextEle = '#csui-richtext-content-body' + options.id;
      BlockingView.imbue(this);
      this.context = options.context;
      this.connector = this.context.getObject(ConnectorFactory);
      //wiki page node model
      this.node = new NodeModel({
        id: options.id
      }, {
        connector: this.connector,
        expand: {
          properties: ['original_id', 'parent_id'], //parent_id -> we need image_folder_id
        },
        commands: ['permissions', 'properties', 'reserve', 'unreserve',
          'addcategory']
      });
      this.user = this.context.getModel(UserModelFactory);
      if (!options.model) {
        //model for html content
        options.model = new HtmlEditorModel({
          connector: this.connector,
          context: this.context,
          id: options.id
        });
        var url = Url.combine(this.connector.connection.url,
            "nodes/" + options.id + "/content");
        options.model.fetch({
          url: url,
          success: options.model.fetchSuccess,
          error: options.model.fetchError,
          dataType: "text"
        }).done(_.bind(function (htmlContent) {
          //fetch the latest version
          this._getLatestVersion().done(_.bind(function () {
            this.oldVersion = this.model.get('version');
          }, this));
        }, this));
      }

      options.richTextElementId = 'csui-richtext-content-body-' + options.id;

      Marionette.ItemView.prototype.constructor.call(this, options);

      this._errorRegion = new Marionette.Region({
        el: this.el
      });

      this.listenTo(this.model, 'sync', _.bind(function () {
        if (!this.model.error) {
          this.user.ensureFetched().done(this._renderActionsDropdown.bind(this));
        }
      }, this));

      this.mode = 'read';
      //RichText Util class That contain utility methods
      this.utils = RichTextEditor.getRichTextEditorUtils();
      this.enableSaveButton = false;
    },

    onRender: function () {
      var error = this.model.error;
      this.$el[error ? 'addClass' : 'removeClass']('csui-disabled');
      // If fetching the node failed, render error widget over this one.
      if (error) {
        this._errorRegion.show(new ErrorView({
          model: new Backbone.Model({
            message: lang.noWikiPageFound
          })
        }));
      }
      this.$el.addClass(this.options.header ? '' : 'csui-html-editor-no-header');
      this.filterHtmlContent();
      this.refreshTabableElements();
    },

    /**
     * This method filters below obsolete data from html content.
     * Attributes:
     *  border, cellspacing, cellpadding from table element.
     * Elements:
     *  big.
     */
    filterHtmlContent: function () {
      this.$el.find('table').each(function (index, table) {
        $(table).css({
          'border': table.getAttribute('border') + 'px solid',
          'borderSpacing': table.getAttribute('cellspacing') + 'px',
          'text-align': table.getAttribute('align')
        }).removeAttr('cellpadding cellspacing border align');
        $(table).find('th,td').css('padding', table.getAttribute('cellpadding') + 'px');
      });
      this.$el.find('big').each(function (index, bigEle) {
        //TODO: add attributes if any.
        $(bigEle).replaceWith('<span class="csui-big">' + $(bigEle).html() + '</span>');
      });
    },

    refreshTabableElements: function () {
      if (this.mode === 'read') {
        this.tabableElements = this.$el.find('a').toArray();
      } else {
        this.tabableElements = [];
        this.tabableElements.push(this.editorInstance.element.$);
        this.tabableElements = this.tabableElements.concat(
            $('#cke_' + this.options.richTextElementId +
              ' .csui-html-editor-action-buttons > button:not([disabled])').toArray());
      }
      this.currentlyFocusedElementIndex = -1;
    },

    moveTab: function (event) {
      this.currentlyFocusedElementIndex = this.tabableElements.indexOf(event.target);
       // if element is not tabable then return false. (for eg. - 'cs-link-dialog').
      if(this.currentlyFocusedElementIndex === -1) {
        return false;
      }
      var currentFocus  = $(this.tabableElements[this.currentlyFocusedElementIndex]),
          resetTabIndex = false;
      if (event.keyCode === 9) {
        if (event.shiftKey) {
          if (this.currentlyFocusedElementIndex > 0) {
            this.currentlyFocusedElementIndex -= 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        } else {
          if (this.currentlyFocusedElementIndex < this.tabableElements.length - 1) {
            this.currentlyFocusedElementIndex += 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).prop('tabindex', 0).focus();
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        }
        if (resetTabIndex) {
          if (this.mode === 'write') {
            if (event.shiftKey) {
              this.currentlyFocusedElementIndex = this.tabableElements.length - 1;
            } else {
              this.currentlyFocusedElementIndex = 0;
            }
            $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
          } else {
            currentFocus.bind('focusout', _.bind(function () {
              currentFocus.unbind('focusout');
              this.currentlyFocusedElementIndex = -1;
            }, this));
          }
        }
        if (this.mode === 'write') {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    },

    _showPreview: function (event) {
      this.utils.getUrl(this, event).done(_.bind(function () { 
        this.options.targetEle = event.target;
        this.options.connector = this.connector; 
        var linkPreview = new LinkPreview(this.options);
        linkPreview.render();
      }, this));

    },

    _updateUrl: function (event) {
      this.utils.getUrl(this, event);
    },

    _renderActionsDropdown: function () {
      this.node.fetch().done(_.bind(function (response) {
        this.dropdownMenu = new DropdownMenu({
          openForEdit: this._openForEdit.bind(this),
          node: this.node,
          user: this.user,
          context: this.options.context,
          parentView: this
        });
        new Marionette.Region({
          el: this.parentView.$el.find(".tile-controls")
        }).show(this.dropdownMenu);

        this.grandParentEle = this.$el.closest('.csui-html-editor-grand-parent');

        this.listenTo(this.dropdownMenu, 'render', _.bind(function () {
          this.refreshTabableElements();
          this.trigger('refresh:tabindexes');
        }, this));

        this.editIconEle = this.parentView.$el.find(".tile-controls");
        if (!!this.options.header) {
          var tileHeaderEleTitle = this.options.titlefield || '';
          this.editIconEle.closest('.tile-header').attr({
            'title': tileHeaderEleTitle,
            'aria-label': tileHeaderEleTitle
          });
        }
      }, this));
    },

    editModeAccessibility: function () {
      $(document).on('keydown.html.editor', _.bind(function (event) {
        if (!$.contains($('#cke_' + this.options.richTextElementId +
                          '.csui-rich-text-editor-toolbar .cke_inner')[0], event.target)) {
          if (event.keyCode === 9) {
            this.moveTab(event);
          } else if ([13, 32].indexOf(event.keyCode) !== -1 &&
                     $(event.target).hasClass('csui-html-edit-icon')) {
            $(event.target).click();
            event.preventDefault();
          }
        }
      }, this));
    },

    removeEditModeAccessibility: function () {
      $(document).off('keydown.html.editor');
    },

    _openForEdit: function () {
      this.editModeAccessibility();
      this.blockActions();
      this._getLatestVersion().done(_.bind(function () {
        this._toggleReserve(true).done(_.bind(function () {
          if (this.oldVersion === this.model.get('version')) {
            this._getLatestContent().done(_.bind(function () {
              this._editContent();
            }, this));

          } else {
            //Mean while new version get added, inform same to user through modal dialog
            ModalAlert.confirmQuestion(_.bind(function (result) {

              if (result) {
                //dontGetLatestcontent
                this._editContent();
                this.enableSaveButton = true;
              } else {
                //GetTheLatestContent
                this._getLatestContent().done(_.bind(function () {
                  this._editContent();
                  this.oldVersion = this.model.get('version');
                  this.enableSaveButton = false;
                }, this));
              }

              this.alreadyTriggered = true;

            }, this), lang.versionDifferenceConfirmMessage, lang.versionDifferenceConfirmTitle);

          }
        }, this)).fail(this.unblockActions.bind(this));
      }, this)).fail(this.unblockActions.bind(this));
      if (base.isAppleMobile()) {
        this.$el.find(".csui-richtext-message").attr("contenteditable", true).focus();
      }
    },

    _editContent: function () {
      var self            = this,
          url             = this.connector.connection.url,
          ckeditorConfig  = {
            'skin': 'otskin,' + this.connector.connection.supportPath +
                    '/csui/lib/ckeditor/skins/otskin/',
            'custcsuiimage_imageExtensions': 'gif|jpeg|jpg|png',
            'filebrowserUploadUrl': url.substring(0, url.indexOf('api')),
            'floatingWrapper': this.grandParentEle,
            'extraPlugins': 'csfloatingspace,filebrowser,custimage,custcsuiimage,find,panelbutton,colorbutton,' +
                            'font,selectall,smiley,dialog,sourcedialog,print,preview,justify,' +
                            'save,cancel,cssyntaxhighlight,cslink',
            'removePlugins': 'image,floatingspace',
            'cancel': {
              label: 'Cancel',
              onCancel: function (e) {
                self.blockActions();
                var contentDiv       = self.editorInstance,
                    isContentChanged = e.getData().length ?
                                       contentDiv.checkDirty() :
                                       self.model.get('data') !== lang.PageDefaultContent;

                if (isContentChanged) {
                  ModalAlert.confirmQuestion(function (result) {
                    if (result) {
                      self._getLatestVersion().done(function () {
                        if (self.oldVersion !== self.model.get('version')) {
                          self._getLatestContent().done(_.bind(function () {
                            self.oldVersion = this.model.get('version');
                            e.setData(self.model.get('oldData'));
                          }, self));
                        } else {
                          e.setData(self.model.get('oldData'));
                        }
                        self.trigger('updateScrollbar');
                        destroyCKEditor(e);
                        self.autoSaved && self.deleteAutoSavedContent({
                          connector: self.connector,
                          wikiId: self.node.get('parent_id'),
                          pageId: self.model.get('id')
                        });
                        self._toggleReserve();
                      });
                    } else {
                      $(self.options.richTextElementId).focus();
                      self.unblockActions();
                    }
                  }, lang.CancelConfirmMessage, lang.cancelTitle);
                } else {
                  self._getLatestVersion().done(function () {
                    if (self.oldVersion !== self.model.get('version')) {
                      self._getLatestContent().done(_.bind(function () {
                        self.oldVersion = this.model.get('version');
                        e.setData(self.model.get('oldData'));
                      }, self));
                    } else {
                      e.setData(self.model.get('oldData'));
                    }
                    destroyCKEditor(e);
                    self._toggleReserve();
                  });


                }

              }
            },
            'save': {
              label: 'Save',
              url: self.connector.connection.url + '/nodes/' + self.options.id,
              type: "PUT",
              useJSON: false,
              ticket: self.connector.connection.session.ticket,
              postData: function (editor) {
                return {
                  TextField: editor.getData()
                };
              },
              onSave: function (editor) {
                self.blockActions();
                self._getLatestVersion().done(function () {
                  if (!!self.alreadyTriggered || self.oldVersion === self.model.get('version')) {
                    self.enableSaveButton = false;
                    self.alreadyTriggered = false;
                    self._saveContent(editor);
                  } else {
                    ModalAlert.confirmQuestion(function (result) {
                          if (result) {
                            self.enableSaveButton = false;
                            self._saveContent(editor);
                          } else {

                            $(self.options.richTextElementId).focus();
                            self.unblockActions();
                          }
                        }, lang.versionDifferenceConfirmMessage,
                        lang.versionDifferenceConfirmTitle);
                  }
                });
              },
              onSuccess: function (editor, data) {
                //upon success, reset the model with latest data.
                self.model.set({
                  'data': editor.getData(),
                  'oldData': editor.getData()
                });
                self._getLatestVersion().done(function () {
                  self.oldVersion = self.model.get('version');
                  destroyCKEditor(editor);
                });

              },
              onFailure: function (editor, status, request) {
                destroyCKEditor(editor);
                self.render();
                self.trigger('updateScrollbar');
              }
            },
            'image': {
              url: self.connector.connection.url.replace("/api/v1", "")
            },
            'addimage': {
              url: function () {
                return url + "/nodes";
              },
              imageBrowseEnabled: function () {
                return self.node.get('parent_id_expand').imagebrowseenabled;
              },
              parent_id: self.node.get('parent_id_expand').image_folder_id,
              type: "POST",
              documentType: 144,
              ticket: self.connector.connection.session.ticket
            }
          },
          ckeditor        = RichTextEditor.getRichTextEditor(ckeditorConfig),
          destroyCKEditor = function (CKEditor) {
            $(".csui-rich-text-mask").remove();
            $(".csui-html-editor-zindex").removeClass('csui-html-editor-zindex');
            $("#csui-richtext-sharedspace").remove();
            $(".cui-rich-editor-widget-wrapper").removeAttr('style');
            self.editIconEle.removeClass('binf-hidden');
            self.$el.find(".csui-richtext-message").attr("contenteditable", false);
            CKEditor.destroy();
            self.unblockActions();
            self._unbindEvents();
            self.parentView.$el.find(".csui-html-editor-action-buttons").remove();
            $(window).unbind('resize');
            self.removeEditModeAccessibility();
            self.mode = 'read';
            self.refreshTabableElements();
            $('.csui-html-editor-zero-zindex').removeClass('csui-html-editor-zero-zindex');
          };

      var $rteEle = self.$("#" + this.options.richTextElementId);
      $rteEle.attr("contenteditable", true);

      this.editIconEle.addClass('binf-hidden');
      var rteMask          = document.createElement('div'),
          rteBodyMask      = document.createElement('div'),
          defaultContainer = $.fn.binf_modal.getDefaultContainer();

      rteMask.className = 'csui-rich-text-mask';
      rteBodyMask.className = 'csui-rich-text-mask csui-rich-text-body-mask';

      self.grandParentEle.before(rteMask);
      $(defaultContainer).append(rteBodyMask);

      if (base.isMSBrowser()) {
        // breadcrumb's z-index is more than the perspective container, so let's degrade it's z-index.
        !!$('#breadcrumb-wrap') &&
        $('#breadcrumb-wrap').addClass('csui-html-editor-zero-zindex');
      }

      var $rteMask     = $(rteMask),
          $rteBodyMask = $(rteBodyMask),
          // tile view with header, tile-header height is 70px, and it's padding-top is 10px, so reduce it.
          $maskOfffset = this.grandParentEle.find('.csui-html-editor-no-header').length > 0 ?
                         5 :
                         80,
          resetMasking = function () {
            $rteEle.closest('.ps-container').scrollTop(0);
            $rteBodyMask.css("height", "0px");
            $rteMask.css("top", "0px");

            var rteMaskTop        = ($rteEle.offset().top - $(rteMask).offset().top -
                                     $maskOfffset),
                rteBodyMaskHeight = $rteEle.offset().top - $maskOfffset;

            rteBodyMaskHeight = rteMaskTop < 0 ? rteBodyMaskHeight + -rteMaskTop :
                                rteBodyMaskHeight;
            rteMaskTop = rteMaskTop < 0 ? 0 : rteMaskTop;

            $rteBodyMask.css("height", rteBodyMaskHeight + "px");
            $rteMask.css({
              "height": document.body.scrollHeight - rteBodyMask.offsetHeight,
              "top": rteMaskTop
            });

            $(rteMask).parent().addClass('csui-html-editor-zindex');
          };

      resetMasking();
      $(window).bind('resize', resetMasking);
      $('.csui-richtext-message').bind('change', resetMasking);

      window.onbeforeunload = function (e) {
        return false;
      };

      csui.require(['csui/dialogs/node.picker/node.picker'], function (NodePicker) {
        ckeditor.config.csLink = {
          lang: {
            insertContentServerLink: lang.insertContentServerLink
          },
          nodeLink: NodeLinks,
          nodePicker: function () {
            return new NodePicker({
              connector: self.connector,
              dialogTitle: lang.contentServerLink,
              context: self.options.context,
              resolveShortcuts: true,
              resultOriginalNode: false,
              currentUser: self.options.context.getModel(UserModelFactory)
            });
          },
          enableSaveButton: function () {
            self._enableSaveButton();
          }
        };
      });

      self.editorInstance = ckeditor.inline(this.options.richTextElementId, {
        toolbar: [
          ['Undo', 'Redo', '-', 'FontSize', '-', 'Styles', 'Format', 'TextColor', '-', 'Bold',
            'Italic'],
          '/',
          ['Replace', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
            'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Link', 'cslink', '-',
            'addImage', 'Table', 'Sourcedialog']
        ]
      });

      ckeditor.once('instanceReady', function (event) {
        if (self.ui.richText.text().trim() === lang.PageDefaultContent) {
          self.ui.richText.empty();
        }
        self.mode = 'write';
        $("#cke_" + self.options.richTextElementId).addClass(
            'csui-rich-text-editor-toolbar');
        self.unblockActions();
        self._appendActionButtons();
        event.editor.focus();
        self.$el.find('.csui-richtext-message').focus();
        self.editorInstance.on('change', _.throttle(function () {
          self._autoSaveContent(ckeditor);
        }, self.options.autosaveInterval, {
          leading: false
        }));
        self.editorInstance.on('change', function () {
          self._validateState();
        });
        self._actionButtonsPosition();
        self._actionButtonsPositionInEdge();
        self.refreshTabableElements();

        if (!!self.autoSaved) {
          self.deleteAutoSavedContent({
            connector: self.connector,
            wikiId: self.node.get('parent_id'),
            pageId: self.model.get('id')
          });
        }
      });

    },

    _saveContent: function (editor) {
      editor.config.save.request.send(editor.config.save.json);
      this.autoSaved && this.deleteAutoSavedContent({
        connector: this.connector,
        wikiId: this.node.get('parent_id'),
        pageId: this.model.get('id')
      });
      this._toggleReserve();
    },

    _disableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = true;
      }

    },
    _enableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = false;
      }

    },

    _toggleReserve: function (toEditMode) {
      var deferred = $.Deferred();
      if (!!toEditMode && this.node.get('reserved')) {
        if (this.node.get('reserved_user_id') === this.user.get('id')) {
          // no need to reserve again if current user has reserved
          deferred.resolve();
          return deferred;
        }
      }
      var contentUrl = this.connector.connection.url + '/nodes/' + this.node.get('id'),
          self       = this,
          formData   = new FormData();
      if (!!toEditMode) {
        !this.node.get('reserved') && formData.append('reserved_user_id', this.user.get('id'));
      } else {
        this.node.get('reserved') && formData.append('reserved_user_id', null);
      }
      this.updateAjaxCall({
        url: contentUrl,
        connector: this.connector,
        data: formData,
        type: 'PUT'
      }).done(function () {
        deferred.resolve();
      }).fail(function (xhr) {
        //GlobalMessage.showMessage("error", xhr.responseJSON.errorDetail);
        deferred.reject();
      }).always(function () {
        // refreshing node actions for concurrent case
        self.node.fetch();
      });
      return deferred;
    },

    _autoSaveContent: function (ckeditor) {
      var contentDiv = this.editorInstance;
      if (!!contentDiv && contentDiv.checkDirty()) {
        contentDiv.resetDirty();
        var source   = contentDiv.getData(),
            formData = new FormData();
        formData.append("wikiId", this.node.get('parent_id'));
        formData.append("pageId", this.model.get('id'));
        formData.append("source", source);

        this.updateAjaxCall({
          connector: this.connector,
          url: this.connector.connection.url.replace('api/v1', 'api/v2') +
               "/wiki/autosave",
          type: "POST",
          data: formData,
          view: this
        });
        this.autoSaved = true;
      }
    },

    _getLatestContent: function () {
      var ajaxParams = {
        "url": this.connector.connection.url.replace('/api/v1', '/api/v2') + "/wiki/" +
               this.model.get('id') + "/autosave",
        "type": "GET",
        "requestType": "getContent",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _getLatestVersion: function () {
      var ajaxParams = {
        "url": this.connector.connection.url.replace('/api/v1', '/api/v2') + "/nodes/" +
               this.model.get('id'),
        "type": "GET",
        "requestType": "versions-reserve",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _validateState: function () {
      this.utils = this.utils || RichTextEditor.getRichTextEditorUtils();
   
          // as there are only three entermode in ckeditor DIV, P, BR. checking for them, along with the any empty spaces.
        var  editorText=  RichTextEditor.isEmptyContent(this.editorInstance);
  
       if (!!this.editorInstance && this.editorInstance.checkDirty() &&
          !(editorText === lang.PageDefaultContent || editorText.length === 0)) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },
    /**
     * this method adds action buttons (save and cancel) to html editor view.
     *
     * @private
     */
    _appendActionButtons: function () {
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id),
          data    = {
            'saveLabel': lang.saveTitle,
            'cancelLabel': lang.cancelTitle,
            'cancelAria': lang.cancelAria,
            'saveAria': lang.saveAria
          };

      toolbar.append(htmlEditorButtonsTemplate(data));

      toolbar.find(".csui-html-edit-save").on("click", _.bind(function () {
        this.editorInstance.execCommand('save');
      }, this));

      toolbar.find(".csui-html-edit-cancel").on("click", _.bind(function () {
        this.editorInstance.execCommand('cancel');
      }, this));
    },

    _actionButtonsPosition: function () {
      if (!!this.enableSaveButton) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },

    _actionButtonsPositionInEdge: function () {
      // only for edge browser actions buttons are mis-aligned, handling it here.
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id);
      if (base.isEdge() && toolbar.attr("style").indexOf('right') !== -1) {
        toolbar.find('.cke_inner').css('float', 'right');
      }
    },

    _unbindEvents: function () {
      window.onbeforeunload = null;
    },

    updateAjaxCall: function (args) {
      var deferred    = $.Deferred(),
          url         = args.url,
          data        = args.data,
          type        = args.type,
          connector   = args.connector,
          self        = args.view,
          requestType = args.requestType;
      $.ajax(connector.extendAjaxOptions({
        url: url,
        type: type,
        data: data,
        contentType: false,
        crossDomain: true,
        processData: false,
        success: function (response, status, jXHR) {
          switch (requestType) {
          case "getContent":
            if (!!response.results.data.autoSaved) {
              self.autoSaved = true;
              ModalAlert.confirmQuestion(function (result) {
                    var content = response.results.data.content;
                    if (result) {
                      content = response.results.data.autoSaved;
                      self.enableSaveButton = true;
                    } else {
                      self.enableSaveButton = false;
                    }
                    self.model.set({
                      'data': content,

                    });
                    deferred.resolve();
                  }, lang.RestoreDialogMessage, lang.RestoreDiaglogTitle,
                  ModalAlert.buttonLabels.Yes = lang.Continue,
                  ModalAlert.buttonLabels.No = lang.Discard);
            } else {
              self.model.set({
                'data': response.results.data.content,
                'oldData': response.results.data.content
              });
              deferred.resolve();
            }
            break;
          case 'versions-reserve':
            self.model.attributes.version = response.results.data.versions.length;
            self.node.set({
              'reserved': response.results.data.properties.reserved,
              'reserved_user_id': response.results.data.properties.reserved_user_id
            });

            deferred.resolve();
            break;
          default:
            deferred.resolve(response);
          }
        },
        error: function (xhr, status, text) {
          deferred.reject(xhr);
        }
      }));
      return deferred.promise();
    },

    deleteAutoSavedContent: function (args) {
      if (this.autoSaved) {
        args.type = "DELETE";
        args.url = args.connector.connection.url.replace('/api/v1', '/api/v2') + "/wiki/" +
                   args.wikiId + "/autosave/" + args.pageId;
        this.updateAjaxCall(args);
        this.autoSaved = false;
      }
      window.clearInterval(this.intervalId);
    }
  });

  return HtmlEditorContentView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/html.editor/impl/html.editor.wrapper.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-html-editor-tile-controls tile-controls\"></div>\r\n<div class=\"csui-html-editor-wrapper-parent cui-rich-editor-widget-wrapper\r\ncsui-html-editor-wrapper-parent-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\">\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_html.editor_impl_html.editor.wrapper.template', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/html.editor/html.editor.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/tile/tile.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/html.editor/impl/html.editor.content.view',
  'hbs!csui/widgets/html.editor/impl/html.editor.wrapper.template',
  'i18n!csui/widgets/html.editor/impl/nls/lang'
], function (_, $, Handlebars, Marionette, TileView, PerfectScrollingBehavior,
    TabableRegionBehavior, HtmlEditorContentView, template, lang) {

  var HtmlEditorTileView = TileView.extend({

    constructor: function HtmlEditorTileView(options) {
      options || (options = {});
      options.icon = 'cs-wiki-icon-wiki';
      this.context = options.context;
      options.id = 'csui-html-tile-wrapper-' + options.wikiPageId;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },

    contentView: HtmlEditorContentView,
    contentViewOptions: function () {
      _.extend(this.options, {parentView: this});
    },

    onShow: function () {
      this.$el.addClass(
          'cui-rich-editor-widget-wrapper cui-rich-editor-widget-wrapper-' +
          this.options.wikiPageId);
    }

  });

  var HtmlEditorWidgetView = Marionette.CompositeView.extend({
    tagName: 'div',

    className: 'csui-html-editor-grand-parent',

    templateHelpers: function () {
      return {};
    },

    template: template,

    ui: {
      editIcon: '.tile-controls'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    constructor: function HtmlEditorWidgetView(options) {
      options = options || {};
      options.data || (options.data = {});
      _.extend(options, options.data);
      options.wikiPageId = options.wikipageid || options.id;
      options.id = "csui-html-editor-grand-parent-" + options.wikiPageId;
      options.title = options.titlefield || options.title;
      options.header = !!options.title;
      options.scrollableParent = !!options.header ? '.tile-content' :
                                 '.csui-html-editor-wrapper-parent';
      this.context = options.context;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: function () {
          return this.options.scrollableParent;
        },
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (!!this.htmlEditorContentView.dropdownMenu &&
          !this.htmlEditorContentView.dropdownMenu.haveEditPermissions) {
        return this.htmlEditorContentView.$el.find('a:first');
      } else {
        return this.$el.find('.csui-html-editor-dropdown .csui-html-editor-control');
      }
    },

    onKeyInView: function (event) {
      if (this.htmlEditorContentView.mode === 'read') {
        this.htmlEditorContentView.moveTab(event);
      }
    },

    onRender: function (e) {
      var _htmlView;
      this.options.autosaveInterval = 60000;
      if (this.options.header === undefined || this.options.header) { // with header
        _htmlView = new HtmlEditorTileView(this.options);
        this.listenToOnce(_htmlView, 'show', _.bind(function () {
          this.htmlEditorContentView = _htmlView.getChildView('content');
        }, this));
      } else { // without header
        this.options.parentView = this;
        _htmlView = new HtmlEditorContentView(this.options);
        this.htmlEditorContentView = _htmlView;
      }

      new Marionette.Region({
        el: this.$el.find(".csui-html-editor-wrapper-parent")
      }).show(_htmlView);
      this._triggerView = this;

      this
          .listenTo(this.htmlEditorContentView, 'refresh:tabindexes', _.bind(function () {
            this.trigger('refresh:tabindexes');
          }, this))
          .listenTo(this.htmlEditorContentView, 'updateScrollbar', _.bind(function () {
            this.trigger('dom:refresh');
          }, this));
    }
  });
  return HtmlEditorWidgetView;
});


csui.define('json!csui/widgets/error.global/error.global.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {
      "serverError": {
        "title": "{{serverErrorTitle}}",
        "description": "{{serverErrorDescription}}",
        "type": "string"
      }
    }
  },
  "options": {
  }
}
);


csui.define('json!csui/widgets/favorites/favorites.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  },
  "actions": [
    {
      "toolItems": "csui/widgets/favorites/toolbaritems",
      "toolItemMasks": "csui/widgets/favorites/toolbaritems.masks",
      "toolbars": [
        {
          "id": "tableHeaderToolbar",
          "title": "{{tableHeaderToolbarTitle}}",
          "description": "{{tableHeaderToolbarDescription}}"
        },
        {
          "id": "inlineActionbar",
          "title": "{{inlineActionbarTitle}}",
          "description": "{{inlineActionbarDescription}}"
        }
      ]
    }
  ]
}
);


csui.define('json!csui/widgets/myassignments/myassignments.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);


csui.define('json!csui/widgets/placeholder/placeholder.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "supportedKinds": ["tile", "header", "fullpage"],
  "schema": {
    "type": "object",
    "properties": {
      "label": {
        "title": "{{labelTitle}}",
        "description": "{{labelDescription}}",
        "type": "string"
      },
      "color": {
        "title": "{{foregroundColorTitle}}",
        "description": "{{foregroundColorDescription}}",
        "type": "string"
      },
      "bgcolor": {
        "title": "{{backgroundColorTitle}}",
        "description": "{{backgroundColorDescription}}",
        "type": "string"
      }
    }
  }
}
);


csui.define('json!csui/widgets/recentlyaccessed/recentlyaccessed.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  },
  "actions": [
    {
      "toolItems": "csui/widgets/recentlyaccessed/toolbaritems",
      "toolItemMasks": "csui/widgets/recentlyaccessed/toolbaritems.masks",
      "toolbars": [
        {
          "id": "tableHeaderToolbar",
          "title": "{{tableHeaderToolbarTitle}}",
          "description": "{{tableHeaderToolbarDescription}}"
        },
        {
          "id": "inlineActionbar",
          "title": "{{inlineActionbarTitle}}",
          "description": "{{inlineActionbarDescription}}"
        }
      ]
    }
  ]
}
);


csui.define('json!csui/widgets/shortcut/shortcut.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      },
      "type": {
        "title": "{{typeTitle}}",
        "description": "{{typeDescription}}",
        "type": "integer",
        "enum": [141, 142, 133],
        "default": 141
      },
      "background": {
        "title": "{{backgroundTitle}}",
        "description": "{{backgroundDescription}}",
        "type": "string",
        "enum": [
          "cs-tile-background1",
          "cs-tile-background2",
          "cs-tile-background3"
        ]
      }
    },
    "oneOf": [{
      "required": ["id"]
    }, {
      "required": ["type"]
    }]
  },
  "options": {
    "fields": {
      "id": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": []
          }
        }
      },
      "type": {
        "type": "select",
        "optionLabels": [
          "{{typeEnterpriseVolume}}",
          "{{typePersonalVolume}}",
          "{{typeCategoryVolume}}"
        ]
      },
      "background": {
        "type": "select",
        "optionLabels": [
          "{{backgroundGrey}}",
          "{{backgroundGreen}}",
          "{{backgroundOrange}}"
        ]
      }
    }
  }
}
);


csui.define('json!csui/widgets/shortcuts/shortcuts.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "shortcutTheme": {
        "title": "{{shortcutThemeTitle}}",
        "description": "{{shortcutThemeDescription}}",
        "type": "string",
        "enum": [
          "csui-shortcut-theme-stone1",
          "csui-shortcut-theme-stone2",
          "csui-shortcut-theme-teal1",
          "csui-shortcut-theme-teal2",
          "csui-shortcut-theme-pink1",
          "csui-shortcut-theme-pink2",
          "csui-shortcut-theme-indigo1",
          "csui-shortcut-theme-indigo2"
        ]
      },
      "shortcutItems": {
        "title": "{{shortcutItemsTitle}}",
        "description": "{{shortcutItemsDescription}}",
        "type": "array",
        "minItems": 1,
        "maxItems": 4,
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "title": "{{idTitle}}",
              "description": "{{idDescription}}",
              "type": "integer"
            },
            "type": {
              "title": "{{typeTitle}}",
              "description": "{{typeDescription}}",
              "type": "integer",
              "enum": [141, 142, 133],
              "default": 141
            }
          },
          "oneOf": [{
            "required": ["id"]
          }, {
            "required": ["type"]
          }]
        }
      }
    }
  },
  "options": {
    "fields": {
      "shortcutItems": {
        "items": {
          "fields": {
            "id": {
              "type": "otcs_node_picker",
              "type_control": {
                "parameters": {
                  "select_types": []
                }
              }
            },
            "type": {
              "type": "select",
              "optionLabels": [
                "{{typeEnterpriseVolume}}",
                "{{typePersonalVolume}}",
                "{{typeCategoryVolume}}"
              ]
            }
          }
        }
      },
      "shortcutTheme": {
        "type": "select",
        "optionLabels": [
          "{{shortcutThemeStone1}}",
          "{{shortcutThemeStone2}}",
          "{{shortcutThemeTeal1}}",
          "{{shortcutThemeTeal2}}",
          "{{shortcutThemePink1}}",
          "{{shortcutThemePink2}}",
          "{{shortcutThemeIndigo1}}",
          "{{shortcutThemeIndigo2}}"
        ]
      }
    }
  }
}
);


csui.define('json!csui/widgets/welcome.placeholder/welcome.placeholder.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "header",
  "schema": {
    "type": "object",
    "properties": {
      "message": {
        "title": "{{messageTitle}}",
        "description": "{{messageDescription}}",
        "type": "string"
      },
      "videoPoster": {
        "title": "{{videoPosterTitle}}",
        "description": "{{videoPosterDescription}}",
        "type": "string"
      },
      "videoSrc": {
        "title": "{{videoSourceTitle}}",
        "description": "{{videoSourceDescription}}",
        "type": "string"
      }
    }
  }
}
);


csui.define('json!csui/widgets/html.editor/html.editor.manifest.json',{
	"$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
	"title": "{{title}}",
	"description": "{{description}}",
	"kind": "tile",
	"supportedKinds": ["tile", "header", "fullpage"],
	"schema": {
		"type": "object",
		"properties": {
			"titlefield": {
				"title": "{{titleLabel}}",
				"description": "{{titleDesc}}",
				"type": "string",
				"default": ""
			},
			"wikicontainerid": {
				"title": "{{wikiContainerID}}",
				"description": "{{wikiContainerIDDesc}}",
				"type": "integer"
			},
			"wikitemplateid": {
				"title": "{{wikiTemplateID}}",
				"description": "{{wikiTemplateIDDesc}}",
				"type": "integer"
			},
			"wikiid": {
				"title": "{{wikiContainerID}}",
				"description": "{{wikiContainerIDDesc}}",
				"type": "integer"
			},
			"wikipageid": {
				"title": "{{wikiTemplateID}}",
				"description": "{{wikiTemplateIDDesc}}",
				"type": "integer"
			}
		}
	},
	"options": {
		"fields": {
			"wikicontainerid": {
				"type": "otcs_node_picker",
				"type_control": {
					"parameters": {
						"select_types": [
							5573
						]
					}
				}
			},
			"wikitemplateid": {
				"type": "otcs_node_picker",
				"type_control": {
					"parameters": {
						"select_types": [
							5574
						],
						"startLocation": "csui/dialogs/node.picker/start.locations/perspective.assets.volume"
					}
				}
			},
			"wikipageid": {
				"type": "otcs_node_picker",
				"hidden": true,
				"type_control": {
					"parameters": {
						"select_types": [
							5574
						]
					}
				}
			},
			"wikiid": {
				"type": "otcs_node_picker",
				"hidden": true,
				"type_control": {
					"parameters": {
						"select_types": [
							5573
						]
					}
				}
			},
			"width": {
				"type": "select",
				"optionLabels": [
					"{{default}}",
					"{{full}}",
					"{{half}}",
					"{{quarter}}"
				]
			}
		}
	},
	"callback": "wiki/callbacks/wikiHookCallback"
}
);

csui.define('csui/widgets/favorites/impl/nls/favorites.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/favorites/impl/nls/root/favorites.manifest',{
  "title": "Favorites",
  "description": "Shows favorite objects of the current user.",
  "tableHeaderToolbarTitle": "Table Header Toolbar",
  "tableHeaderToolbarDescription": "Toolbar, which is activated in the table header, once a table row is selected.",
  "inlineActionbarTitle": "Inline Action Bar",
  "inlineActionbarDescription": "Toolbar, which is displayed inside a table row, when the mouse cursor is moving above it."
});

csui.define('csui/widgets/myassignments/impl/nls/myassignments.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/myassignments/impl/nls/root/myassignments.manifest',{
  "title": "My Assignments",
  "description": "Shows personal assignments of the current user."
});

csui.define('csui/widgets/placeholder/impl/nls/placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/placeholder/impl/nls/root/placeholder.manifest',{
  "widgetTitle": "Placeholder",
  "widgetDescription": "Shows a colorful tile taking the space instead of a real widget.",
  "labelTitle": "Label",
  "labelDescription": "Label of the tile",
  "foregroundColorTitle": "Foreground color",
  "foregroundColorDescription": "Color for the label of the tile",
  "backgroundColorTitle": "Background color",
  "backgroundColorDescription": "Color for the background of the tile"
});


csui.define('csui/widgets/recentlyaccessed/impl/nls/recentlyaccessed.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/recentlyaccessed/impl/nls/root/recentlyaccessed.manifest',{
  "title": "Recently Accessed",
  "description": "Shows documents accessed recently by the current user.",
  "tableHeaderToolbarTitle": "Table Header Toolbar",
  "tableHeaderToolbarDescription": "Toolbar, which is activated in the table header, once a table row is selected.",
  "inlineActionbarTitle": "Inline Action Bar",
  "inlineActionbarDescription": "Toolbar, which is displayed inside a table row, when the mouse cursor is moving above it."
});


csui.define('csui/widgets/shortcut/impl/nls/shortcut.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcut/impl/nls/root/shortcut.manifest',{
  "widgetTitle": "Single Shortcut",
  "widgetDescription": "Tile representing a hyperlink to an object; it navigates to its page when clicked",
  "idTitle": "Target object",
  "idDescription": "An object to open by this shortcut",
  "typeTitle": "Volume fallback",
  "typeDescription": "Sub-type number of a global volume to open by this shortcut if no object has been selected",
  "backgroundTitle": "Background",
  "backgroundDescription": "Styling of the background below the shortcut tile",
  "typeEnterpriseVolume": "Enterprise",
  "typePersonalVolume": "Personal",
  "typeCategoryVolume": "Categories",
  "backgroundGrey": "Grey",
  "backgroundGreen": "Green",
  "backgroundOrange": "Orange"
});


csui.define('csui/widgets/shortcuts/impl/nls/shortcuts.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/shortcuts/impl/nls/root/shortcuts.manifest',{
  "widgetTitle": "Shortcut Group",
  "widgetDescription": "Tile representing a hyperlink to an object; it navigates to its page when clicked",
  "shortcutItemsTitle": "Shortcut Items",
  "shortcutItemsDescription": "Shortcut Items description",
  "idTitle": "Target object",
  "idDescription": "An object to open by this shortcut",
  "typeTitle": "Volume fallback",
  "typeDescription": "Sub-type number of a global volume to open by this shortcut if no object has been selected",
  "shortcutThemeTitle": "Theme",
  "shortcutThemeDescription": "Styling of the shortcuts",
  "typeEnterpriseVolume": "Enterprise",
  "typePersonalVolume": "Personal",
  "typeCategoryVolume": "Categories",
  "shortcutThemeStone1": "Stone Group 1",
  "shortcutThemeStone2": "Stone Group 2",
  "shortcutThemeTeal1": "Teal Group 1",
  "shortcutThemeTeal2": "Teal Group 2",
  "shortcutThemePink1": "Pink Group 1",
  "shortcutThemePink2": "Pink Group 2",
  "shortcutThemeIndigo1": "Indigo Group 1",
  "shortcutThemeIndigo2": "Indigo Group 2"
});


csui.define('csui/widgets/welcome.placeholder/impl/nls/welcome.placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/welcome.placeholder/impl/nls/root/welcome.placeholder.manifest',{
  "widgetTitle": "Welcome Header",
  "widgetDescription": "Shows a wide widget with initial information for the user home page.",
  "messageTitle": "Display message",
  "messageDescription": "Message to be displayed at the bottom of the tile",
  "videoPosterTitle": "Video thumbnail",
  "videoPosterDescription": "Web address of the poster to show when the video is not playing",
  "videoSourceTitle": "Video location",
  "videoSourceDescription": "Web address of the video to play"
});


csui.define('csui/widgets/html.editor/impl/nls/html.editor.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/html.editor/impl/nls/root/html.editor.manifest',{
	'title': 'HTML Tile',
	'description': 'Returns the HTML output of an object and inserts it into a tile.',
	'widthLabel': 'Width',
	'widthDesc': 'The maximum width on the largest screen-size.',
	'default': 'Default',
	'full': 'Full',
	'half': 'Half',
	'quarter': 'Quarter',
	'titleLabel': 'Title',
	'titleDesc': 'Title for the tile',
	'objIdLabel': 'Object ID',
	'objIdDesc': 'Object ID for which we have to render and allow users to edit rich text content.',
	'wikiContainerID': 'Target wiki for HTML Content (optional)',
	'wikiTemplateID': 'Template wiki page (optional)',
	'wikiContainerIDDesc': 'If not specified, a target wiki will be created automatically in perspective asset volume',
	'wikiTemplateIDDesc': 'If not specified, a target wiki template will be pointed automatically from perspective asset folder'
});


csui.define('bundles/csui-app',[
  // Behaviours
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/behaviors/item.state/item.state.behavior',
  'csui/behaviors/item.state/item.state.view',
  'csui/behaviors/limiting/limiting.behavior',
  // Controls
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/impl/tab.contents.view',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  // Used in tab.link.dropdown.view from csui-forms
  'csui/controls/tab.panel/impl/tab.link.view',
  // Used in tab.links.ext.view from csui-forms
  'csui/controls/tab.panel/impl/tab.links.view',
  'csui/controls/tile/behaviors/expanding.behavior',
  'csui/controls/tile/tile.view',
  'csui/controls/iconpreload/icon.preload.view',
  'csui/controls/rich.text.editor/rich.text.editor',

  // Control mixins
  'csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',

  // Control behaviours

  // Dialogs
  'csui/dialogs/modal.alert/modal.alert',

  // 3rd-party libraries

  // TODO: Remove this as long as we mock only for testing purposes;
  // currently we do it a lot to present our features and we need
  // the mockjax in the production output
  'csui/lib/jquery.mockjax',
  'csui/lib/jquery.simulate',

  // Models
  'csui/models/expandable',

  // Model mixins

  // Pages
  'csui/pages/start/start.page.view',

  // Navigation Header
  'csui/widgets/navigation.header/controls/help/help.view',
  'csui/widgets/navigation.header/controls/home/home.view',
  'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
  'csui/widgets/navigation.header/controls/search/search.view',
  'csui/widgets/navigation.header/controls/favorites/favorites.view',
  'csui/widgets/navigation.header/controls/user.profile/user.profile.view',

  // Routers

  // Perspectives
  'csui/perspectives/left-center-right/left-center-right.perspective.view',
  'csui/perspectives/single/single.perspective.view',
  'csui/perspectives/tabbed/tabbed.perspective.view',
  'csui/perspectives/tabbed-flow/tabbed-flow.perspective.view',

  // Utilities

  // Commands

  // Contexts and factories
  // Client-side perspectives
  'json!csui/utils/contexts/perspective/impl/perspectives/error.global.json',

  // Application widgets
  'csui/widgets/error.global/error.global.view',
  'csui/widgets/favorites/favorites.view',
  'csui/widgets/myassignments/myassignments.columns',
  'csui/widgets/myassignments/myassignments.view',
  'csui/widgets/navigation.header/profile.menuitems',
  'csui/widgets/navigation.header/profile.menuitems.mask',
  'csui/widgets/placeholder/placeholder.view',
  'csui/widgets/recentlyaccessed/recentlyaccessed.columns',
  'csui/widgets/recentlyaccessed/recentlyaccessed.view',
  'csui/widgets/search.box/search.box.view',
  'csui/widgets/shortcut/shortcut.view',
  'csui/widgets/shortcuts/shortcuts.view',
  'csui/widgets/welcome.placeholder/welcome.placeholder.view',

  'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',
  'csui/widgets/html.editor/html.editor.view',

  // Application widgets manifests
  'json!csui/widgets/error.global/error.global.manifest.json',
  'json!csui/widgets/favorites/favorites.manifest.json',
  'json!csui/widgets/myassignments/myassignments.manifest.json',
  'json!csui/widgets/placeholder/placeholder.manifest.json',
  'json!csui/widgets/recentlyaccessed/recentlyaccessed.manifest.json',
  'json!csui/widgets/shortcut/shortcut.manifest.json',
  'json!csui/widgets/shortcuts/shortcuts.manifest.json',
  'json!csui/widgets/welcome.placeholder/welcome.placeholder.manifest.json',

  'json!csui/widgets/html.editor/html.editor.manifest.json',

  'i18n!csui/widgets/favorites/impl/nls/favorites.manifest',
  'i18n!csui/widgets/myassignments/impl/nls/myassignments.manifest',
  'i18n!csui/widgets/placeholder/impl/nls/placeholder.manifest',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/recentlyaccessed.manifest',
  'i18n!csui/widgets/shortcut/impl/nls/shortcut.manifest',
  'i18n!csui/widgets/shortcuts/impl/nls/shortcuts.manifest',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/welcome.placeholder.manifest',

  'i18n!csui/widgets/html.editor/impl/nls/html.editor.manifest',

  // Shared for favoritestable from csui-browse
  'i18n!csui/widgets/favorites/impl/nls/lang',
  // Shared for myassignmentstable from csui-browse
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  // Shared for recentlyaccessedtable from csui-browse
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  //Shared for metadataproperties from cs-metadata
  'i18n!csui/controls/tab.panel/impl/nls/lang'
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-app', true);
});

