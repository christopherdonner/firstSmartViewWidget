csui.define('csui/utils/contexts/factories/factory',['csui/lib/marionette'], function (Marionette) {

  // These class is usually consumed under names ObjectFactory, ModelFactory or CollectionFactory,
  // depending on the descendant object (see Context.getObject for more information)
  var Factory = Marionette.Controller.extend({

    constructor: function Factory(context, options) {
      this.context = context;
      this.options = options || {};
    },

    // Descendants must set a string ID, which will uniquely identify the model in the context
    propertyPrefix: null

  });

  return Factory;

});

csui.define('csui/utils/contexts/factories/connector',['module', 'csui/lib/underscore', 'csui/utils/contexts/factories/factory',
  'csui/utils/connector'
], function (module, _, ObjectFactory, Connector) {

  var ConnectorFactory = ObjectFactory.extend({

    propertyPrefix: 'connector',

    constructor: function ConnectorFactory(context, options) {
      ObjectFactory.prototype.constructor.apply(this, arguments);

      var connector = this.options.connector || {};
      if (!(connector instanceof Connector)) {
        var config = module.config(),
            // The single connection object is used to share authentication
            // among contexts if stored in config; it cannot be cloned
            // TODO: Clone the connection. Modifying the global configuration
            // makes it accessible globally and sensive data easier to steal.
            connection = connector.connection || config.connection || {};
        // The connection object can be merged from multiple sources, which
        // may define connection and authentication parameters separately
        _.defaults(connection, connector.connection, config.connection);
        connector = new Connector(_.defaults({
          connection: connection
        }, connector, config));
      }
      this.property = connector;
    }

  });

  return ConnectorFactory;

});

csui.define('csui/utils/contexts/factories/next.node',[
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var NextNodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'nextNode',

    constructor: function NextNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var nextNode = this.options.nextNode || {},
          config   = module.config();
      if (prefetch) {
        this.initialResponse = nextNode.initialResponse || config.initialResponse;
      }
      if (!(nextNode instanceof Backbone.Model)) {
        var connector       = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              // Do not waste server resources; it returns all it can by default
              fields: {
                properties: [],
                'versions.element(0)': ['mime_type', 'owner_id']
              },
              // Command enabling for shortcuts needs the original node info
              expand: {
                properties: ['original_id']
              },
              // Command enabling needs permitted actions
              commands: commands.getAllSignatures()
            }, config.options, nextNode.options);
        // Next node can be fetshed just like node; keep their defaults in sync
        nextNode = new NodeModel(nextNode.attributes || config.attributes,
            creationOptions);
      }
      this.property = nextNode;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return NextNodeModelFactory;
});

csui.define('csui/utils/contexts/factories/search.query.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var SearchQueryModel = Backbone.Model.extend({

    constructor: function SearchQueryModel(attributes, options) {
      SearchQueryModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchQueryModel.__super__.toJSON.apply(this, arguments);
    }

  });

  var SearchQueryModelFactory = ModelFactory.extend({

    propertyPrefix: 'searchQuery',

    constructor: function SearchQueryModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var searchQuery = this.options.searchQuery || {};
      if (!(searchQuery instanceof Backbone.Model)) {
        var config = module.config();
        searchQuery = new SearchQueryModel(searchQuery.models, _.extend({},
            searchQuery.options, config.options));
      }
      this.property = searchQuery;
    }

  });

  return SearchQueryModelFactory;

});


csui.define('css!csui/controls/tile/behaviors/impl/perfect.scrolling',[],function(){});
csui.define('csui/controls/tile/behaviors/perfect.scrolling.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/base', 'csui/lib/perfect-scrollbar',
  'css!csui/controls/tile/behaviors/impl/perfect.scrolling'
], function (module, _, $, Marionette, base) {
  'use strict';

  // Default static options for the behaviour object
  var config = module.config();
  _.defaults(config, {
    usePerfectScrollbar: false
  });
  // TODO: Remove this, as soon as we don't need to test.
  if (/\bperfectScrollbar[^=]/.test(location.search) ||
      /\bperfectScrollbar=true\b/.test(location.search)) {
    config.usePerfectScrollbar = true;
  }

  // Default options for the perfect scrollbar plugin to be created with
  var defaultPluginOptions = {
    minScrollbarLength: 32,
    stopPropagationOnClick: false
  };

  var PerfectScrollingRegion = Marionette.Region.extend({
    constructor: function PerfectScrollingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
      // Set when before:swapOut is triggered and reset when its finishing
      // counterpart is triggered to optimize the event handlers for view
      // swapping in the region
      this._swapping = false;

      // Support scrollbar updates on populating and emptying regions
      this
          .listenTo(this, 'before:swapOut', function () {
            this._swapping = true;
          })
          .listenTo(this, 'swapOut', function () {
            this._swapping = false;
          })
          .listenTo(this, 'show', function () {
            this._requestScrollbarUpdate();
          })
          .listenTo(this, 'empty', function () {
            if (!this._swapping) {
              this._requestScrollbarUpdate();
            }
          });
    },

    _requestScrollbarUpdate: function () {
      // {this.region}.{owning region manager}.{owning layout view}
      this._parent._parent.trigger('update:scrollbar');
    }
  });

  var PerfectScrollingBehavior = Marionette.Behavior.extend({
    defaults: {
      contentParent: null
    },

    constructor: function PerfectScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.listenTo(view, 'render', this._applyClasses);

      if (this._useScrollbar() && this._usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        // Increase when before:render and before:render:collection events
        // are triggered and decrease, when their finishing counterparts are
        // triggered to optimize the event handlers for single view adding
        // or removal
        this._renderState = 0;

        this
        // Bubbling from a child view with ParentScrollbarUpdatingBehavior
        // and window resizing (if the view resizes itself by CSS only)
            .listenToOnce(view, 'render', function () {
              this.view.$el.on('csui:update:scrollbar.' + view.cid,
                  _.bind(this._updateScrollbarFromPropagation, this));
              if (updateOnWindowResize !== false) {
                $(window).bind('resize.' + view.cid, _.bind(this._updateScrollbar, this));
              }
            })
            .listenToOnce(view, 'before:destroy', function () {
              this.view.$el.off('csui:update:scrollbar.' + view.cid);
              if (updateOnWindowResize !== false) {
                $(window).unbind('resize.' + view.cid);
              }
            })
            // Maintain the rendering state for the events triggered between
            // before:render and render
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
              // console.log('Perfect scrollbar expects render event',
              //     Object.getPrototypeOf(this.view).constructor.name);
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
            })
            // Create and destroy the perfect scrollbar plugin
            .listenTo(view, 'dom:refresh', this._ensureScrollbar)
            .listenTo(view, 'ensure:scrollbar', this._ensureScrollbar)
            .listenTo(view, 'before:render', this._destroyScrollbar)
            .listenTo(view, 'before:destroy', this._destroyScrollbar)
            // Listen to requests for an explicit scrollbar update
            .listenTo(view, 'update:scrollbar', this._refreshScrollbar)
            // Delay listening to the collection events; the collection may
            // not be present in the view or its options yet
            .listenToOnce(view, 'before:render', function () {
              // Support optimized adding and removing child views
              // in CollectionView, which does not call render
              if (view instanceof Marionette.CollectionView && view.collection) {
                this
                    .listenTo(view.collection, 'reset', function () {
                      this._resetTriggered = true;
                      // console.log('Perfect scrollbar expects reset event processed',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                    })
                    .listenTo(view, 'before:render:collection', function () {
                      ++this._renderState;
                      // console.log('Perfect scrollbar expects render:collection event',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                    })
                    .listenTo(view, 'render:collection', function () {
                      this._resetTriggered = false;
                      --this._renderState;
                      // console.log('Perfect scrollbar received render:collection event',
                      //     Object.getPrototypeOf(this.view).constructor.name);
                      // If the collection was re-rendered after catching the
                      // 'reset' event, single child view updates were skipped
                      if (!this._renderState) {
                        // console.log('Perfect scrollbar got update from children reset');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      // If the collection was re-rendered after catching the
                      // 'reset' event, no child view updates were performed
                      if (this._resetTriggered || !this._renderState) {
                        // console.log('Perfect scrollbar got update from children emptied');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      // If a child view was added alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._renderState) {
                        // console.log('Perfect scrollbar got update from child add');
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      // If a child view was removed alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._resetTriggered && !this._renderState) {
                        // console.log('Perfect scrollbar got update from child remove');
                        this._updateScrollbar();
                      }
                    });
              }
            });
      }
    },

    _applyClasses: function () {
      // console.log('Perfect scrollbar got render in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      var classes;
      this._contentParent = this._getContentParent();
      if (this._useScrollbar()) {
        if (this._usePerfectScrollbar()) {
          classes = 'csui-perfect-scrolling';
        } else {
          var suppressScrollX = getOption.call(this, 'suppressScrollX'),
              suppressScrollY = getOption.call(this, 'suppressScrollY');
          classes = 'csui-normal-scrolling';
          if (suppressScrollX) {
            classes += ' csui-no-scroll-x';
          }
          if (suppressScrollY) {
            classes += ' csui-no-scroll-y';
          }
        }
      } else {
        classes = 'csui-no-scrolling';
      }
      this._contentParent.addClass(classes);
    },

    _ensureScrollbar: function () {
      // obtain content parent from options if it is available.
      this._contentParent = !!this._contentParent ? this._contentParent : this._getContentParent();
      // console.log('Perfect scrollbar got dom:refresh in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (!this._contentParent) {
        throw new Error('The "dom:refresh"" event was triggered earlier ' +
                        'than the "render" event in view ' + this.view.cid +
                        '(' + Object.getPrototypeOf(this.view).constructor.name + ')');
      }
      if (this._perfectScrollbar) {
        //if (!this._contentParent.data('perfect-scrollbar')) { // 'ps-id' for 0.6.7
        //  throw new Error('Uninitialized perfect-scrollbar in view ' + this.view.cid +
        //                  '(' + Object.getPrototypeOf(this.view).constructor.name + ')');
        //}
        this._contentParent.perfectScrollbar('update');
      } else {
        var options = _.reduce(['suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
          'scrollYMarginOffset', 'maxScrollbarLength', 'minScrollbarLength'
        ], function (result, property) {
          result[property] = getOption.call(this, property);
          return result;
        }, {}, this);
        _.defaults(options, defaultPluginOptions);
        this._contentParent.perfectScrollbar(options);
        this._perfectScrollbar = true;

        //Keep focus on scroll rail if focus was removed due to an inline click event.
        this._setClickEventFocus();
      }
    },

    _setClickEventFocus: function () {
      var yRail = this._contentParent.find('.ps-scrollbar-y-rail');
      var xRail = this._contentParent.find('.ps-scrollbar-x-rail');

      //For chrome only, when you click within a rail to scroll, a mouseleave event is
      //triggered removing focus and hover from the rail. To maintain hover status, a
      //class is added to the scroll rail
      if (base.isChrome()) {
        this._setClickEventRailFocus(yRail);
        this._setClickEventRailFocus(xRail);
      }
      //For FF and IE, when you click to drag a scrollbar, a mouseleave event is
      //triggered removing focus and hover from the rail. To maintain hover status, a
      //class is added to the scroll rail
      else {
        var yScrollBar = this._contentParent.find('.ps-scrollbar-y');
        var xScrollBar = this._contentParent.find('.ps-scrollbar-x');
        this._setClickEventBarFocus(yScrollBar, yRail);
        this._setClickEventBarFocus(xScrollBar, xRail);
      }
    },

    _setClickEventBarFocus: function (xyBar, xyRail) {
      var self = this;
      xyBar.bind('mousedown', function (e) {
        self.addXYFocus = true;
        xyRail.addClass('binf-focus');
      });
      xyRail.bind('mouseout', function (e) {
        if (!self.addXYFocus) {
          xyRail.removeClass('binf-focus');
          xyRail.blur();
        }
        self.addXYFocus = false;
      });
    },

    _setClickEventRailFocus: function (xyRail) {
      var self = this;
      if (xyRail.length > 0) {
        xyRail.bind('mouseup', function (e) {
          $(this).addClass('binf-focus');
          self.addXYFocus = true;
        });
        xyRail.bind('mouseleave', function (e) {
          if (!self.addXYFocus) {
            $(this).removeClass('binf-focus');
          }
          self.addXYFocus = false;
        });
      }
    },

    _refreshScrollbar: function () {
      // console.log('Perfect scrollbar was refreshed in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._contentParent && this._perfectScrollbar) {
        // Workaround for broken views, which re-render their content
        // but do not trigger the render event, like table view.
        if (!(this._contentParent.find('.ps-scrollbar-y-rail').length ||
            this._contentParent.find('.ps-scrollbar-x-rail').length)) {
          this._destroyScrollbar();
          this._ensureScrollbar();
        } else {
          this._updateScrollbar();
        }
      }
    },

    _updateScrollbar: function () {
      // console.log('Perfect scrollbar got update in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('update');
      }
    },

    _updateScrollbarFromPropagation: function (event) {
      // console.log('Perfect scrollbar got update from a child in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      event.stopPropagation();
      this._updateScrollbar();
    },

    _destroyScrollbar: function () {
      // console.log('Perfect scrollbar got destroy or re-render in',
      //     Object.getPrototypeOf(this.view).constructor.name);
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('destroy');
        this._contentParent.find('.ps-scrollbar-y-rail').off();
        this._contentParent.find('.ps-scrollbar-x-rail').off();
        this._perfectScrollbar = false;
      }
    },

    _getContentParent: function () {
      var contentParent = getOption.call(this, 'contentParent');
      if (contentParent) {
        if (contentParent.insertAfter) { // check for a jQuery object
          return contentParent;
        }
        if (_.isElement(contentParent)) { // check for a HTML element
          return $(contentParent);
        }
        return this.view.$(contentParent); // DOM selector
      }
      return this.view.$el; // use the view root element by default
    },

    _useScrollbar: function () {
      var scrollingDisabled = getOption.call(this, 'scrollingDisabled') ||
                              getOption.call(this, 'scrollingDisabled', this.view.options);
      return !scrollingDisabled;
    },

    _usePerfectScrollbar: function () {
      return PerfectScrollingBehavior.usePerfectScrollbar();
    }
  }, {
    // Support showing and emptying regions in LayoutView,
    // which does not call render
    Region: PerfectScrollingRegion,

    usePerfectScrollbar: function () {
      return config.usePerfectScrollbar &&
             !(base.isTouchBrowser() || base.isIE11() || base.isEdge());
    }
  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return PerfectScrollingBehavior;
});

// Lists explicit locale mappings and fallbacks

csui.define('csui/controls/globalmessage/impl/progresspanel/impl/nls/progresspanel.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/globalmessage/impl/progresspanel/impl/nls/root/progresspanel.lang',{
  // Upload
  BytesOfSize: '{0} of {1}',
  UploadingItems: 'Uploading {0} items',
  UploadingOneItem: 'Uploading item',
  UploadingSomeItems: 'Uploading {0} items',
  UploadOneItemSuccessMessage: "1 item succeeded to upload.",
  UploadSomeItemsSuccessMessage: "{0} items succeeded to upload.",
  UploadManyItemsSuccessMessage: "{0} items succeeded to upload.",
  UploadOneItemFailMessage: "1 item failed to upload.",
  UploadSomeItemsFailMessage: "{0} items failed to upload.",
  UploadManyItemsFailMessage: "{0} items failed to upload.",
  UploadSomeItemsFailMessage2: "{2} items failed to upload.",   // {2} !!
  UploadManyItemsFailMessage2: "{2} items failed to upload.",   // {2} !!

  // states
  State_pending: 'Waiting',
  State_processing: 'Processing',
  State_resolved: 'Done',
  State_rejected: 'Failed',
  State_aborted: 'Canceled',
  StateAction_pending: 'Waiting',
  StateAction_processing: 'Cancel',
  StateAction_resolved: 'Done',
  StateAction_rejected: 'Done',
  StateAction_aborted: 'Done',
  Cancel: 'Cancel',
  CancelAria: 'Cancel upload of {0} item',
  StateAction_all_pending: 'Waiting for upload of all items',
  StateAction_all_processing: 'Cancel upload of all items',
  StateAction_all_resolved: 'All items uploaded',
  StateAction_all_rejected: 'All items rejected to upload',
  StateAction_all_aborted: 'All items aborted to upload',
  Expand: 'Expand',
  ExpandAria: 'Expand the view of detailed item upload states',
  Collapse: 'Collapse',
  CollapseAria: 'Collapse the view of detailed item upload states',
  Close: 'Close',
  CloseAria: 'Close the progress panel'
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "binf-hidden ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-header\">\r\n  <div class=\"csui-progressrow csui-height-target\">\r\n    <div class=\"csui-names-progress\">\r\n      <div class=\"csui-names csui-progresscell\">\r\n        <div class=\"csui-header-icon csui-icon binf-hidden\"></div>\r\n        <div class=\"csui-title\" tabindex=\"-1\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.progressTitleId || (depth0 != null ? depth0.progressTitleId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"progressTitleId","hash":{}}) : helper)))
    + "\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\r\n        </div>\r\n      </div>\r\n      <div class=\"csui-progress csui-progresscell\"  tabindex=\"0\">\r\n        <div class=\"csui-progress-dynamic binf-hidden\" aria-hidden=\"true\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"binf-progress\">\r\n              <div class=\"binf-progress-bar\" role=\"progressbar\" aria-valuenow=\""
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "\"\r\n                   aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:"
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "%\">\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"csui-percent\"></div>\r\n        </div>\r\n        <div class=\"csui-progress-static\" aria-hidden=\"true\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"csui-progress-static-pending\">"
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-processing binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-resolved binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-rejected binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_rejected || (depth0 != null ? depth0.state_rejected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_rejected","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-aborted binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "</div>\r\n          </div>\r\n          <div class=\"csui-percent\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-states-actions\">\r\n      <div class=\"csui-stateaction csui-progresscell\">\r\n        <button type=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.stateaction_all_pending || (depth0 != null ? depth0.stateaction_all_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_all_pending","hash":{}}) : helper)))
    + "\"\r\n                class=\"csui-stateaction-pending\r\n        csui-icon-like-btn binf-btn binf-btn-default\">"
    + this.escapeExpression(((helper = (helper = helpers.stateaction_pending || (depth0 != null ? depth0.stateaction_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_pending","hash":{}}) : helper)))
    + "</button>\r\n        <button type=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.stateaction_all_processing || (depth0 != null ? depth0.stateaction_all_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_all_processing","hash":{}}) : helper)))
    + "\"\r\n                class=\"csui-stateaction-processing csui-icon-like-binf-btn binf-hidden binf-btn binf-btn-default\">\r\n            "
    + this.escapeExpression(((helper = (helper = helpers.stateaction_processing || (depth0 != null ? depth0.stateaction_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stateaction_processing","hash":{}}) : helper)))
    + "</button>\r\n      </div>\r\n      <div class=\"csui-expand csui-progresscell\">\r\n        <button type=\"button\" class=\"csui-expand-down csui-button-icon icon-expandArrowDown binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandAria || (depth0 != null ? depth0.expandAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expand || (depth0 != null ? depth0.expand : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expand","hash":{}}) : helper)))
    + "\" aria-haspopup=\"true\" aria-expanded=\"false\"/>\r\n        <button type=\"button\" class=\"csui-expand-up binf-hidden csui-button-icon icon-expandArrowUp binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.collapseAria || (depth0 != null ? depth0.collapseAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"collapseAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.collapse || (depth0 != null ? depth0.collapse : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"collapse","hash":{}}) : helper)))
    + "\" aria-haspopup=\"true\" aria-expanded=\"true\"/>\r\n      </div>\r\n      <div class=\"csui-close csui-progresscell "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.processing : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n        <button type=\"button\" class=\"csui-action-close csui-icon binf-btn binf-btn-default\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeAria || (depth0 != null ? depth0.closeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.close || (depth0 != null ? depth0.close : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"close","hash":{}}) : helper)))
    + "\" />\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class=\"csui-items-wrapper\">\r\n  <div class=\"csui-items\" role=\"list\">\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_progresspanel_impl_progresspanel', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/progresspanel/impl/progressbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"csui-progressbar csui-progressrow\" style=\"height:48px;\">\r\n    <div class=\"csui-name-status\" role=\"listitem\">\r\n      <div class=\"csui-names-progress \">\r\n        <div class=\"csui-names csui-progresscell\">\r\n          <div class=\"csui-name csui-progresscell\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n            "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n          </div>\r\n        </div>\r\n        <div class=\"csui-states-actions\">\r\n          <div class=\"csui-stateaction csui-progresscell\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCancel : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "            <div\r\n                class=\"csui-stateaction-resolved binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-success\" />\r\n            <div\r\n                class=\"csui-stateaction-rejected binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-error\" />\r\n            <div class=\"csui-stateaction-aborted binf-hidden\" />\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "              <button type=\"button\" class=\"csui-stateaction-pending binf-btn binf-btn-default icon csui-icon\r\n            circle_delete\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n              <button type=\"button\" class=\"csui-stateaction-processing binf-hidden binf-btn binf-btn-default icon\r\n            csui-icon circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"csui-name-status\" role=\"listitem\">\r\n    <div class=\"csui-names-progress\">\r\n      <div class=\"csui-names csui-progresscell\">\r\n        <div class=\"csui-type "
    + this.escapeExpression(((helper = (helper = helpers.type_icon_class || (depth0 != null ? depth0.type_icon_class : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type_icon_class","hash":{}}) : helper)))
    + "\" />\r\n        <div class=\"csui-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n        </div>\r\n      </div>\r\n      <div class=\"csui-progress csui-progresscell\" tabindex=\"0\">\r\n        <div class=\"csui-progress-dynamic binf-hidden\" aria-hidden=\"true\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"csui-progress-text\"></div>\r\n            <div class=\"binf-progress\">\r\n              <div class=\"binf-progress-bar\" role=\"progressbar\" aria-valuenow=\""
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "\"\r\n                   aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:"
    + this.escapeExpression(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"percentage","hash":{}}) : helper)))
    + "%\" ></div>\r\n            </div>\r\n          </div>\r\n          <div class=\"csui-percent\"></div>\r\n        </div>\r\n        <div class=\"csui-progress-static\"  aria-hidden=\"true\">\r\n          <div class=\"csui-progress-textbar\">\r\n            <div class=\"csui-progress-static-pending\">"
    + this.escapeExpression(((helper = (helper = helpers.state_pending || (depth0 != null ? depth0.state_pending : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_pending","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-processing binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_processing || (depth0 != null ? depth0.state_processing : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_processing","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-resolved binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_resolved || (depth0 != null ? depth0.state_resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_resolved","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-rejected binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_rejected || (depth0 != null ? depth0.state_rejected : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_rejected","hash":{}}) : helper)))
    + "</div>\r\n            <div class=\"csui-progress-static-aborted binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.state_aborted || (depth0 != null ? depth0.state_aborted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"state_aborted","hash":{}}) : helper)))
    + "</div>\r\n          </div>\r\n          <div class=\"csui-percent\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-states-actions\">\r\n      <div class=\"csui-stateaction csui-progresscell\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCancel : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <div\r\n            class=\"csui-stateaction-resolved binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-success\" />\r\n        <div\r\n            class=\"csui-stateaction-rejected binf-hidden icon csui-icon csui-icon-like-btn csui-icon-notification-error\" />\r\n        <div class=\"csui-stateaction-aborted binf-hidden\" />\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"csui-error\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{}}) : helper)))
    + "\">\r\n    "
    + this.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{}}) : helper)))
    + "\r\n  </div></div>\r\n\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "          <button type=\"button\" class=\"csui-stateaction-pending binf-btn binf-btn-default icon csui-icon\r\n            circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n          <button type=\"button\" class=\"csui-stateaction-processing binf-hidden binf-btn binf-btn-default icon\r\n            csui-icon circle_delete\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancelAria || (depth0 != null ? depth0.cancelAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancelAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" />\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.commandName : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "")
    + "\r\n\r\n";
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_progresspanel_impl_progressbar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/globalmessage/impl/progresspanel/impl/progresspanel',[],function(){});

csui.define('css!csui/controls/globalmessage/globalmessage_icons',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('csui/controls/globalmessage/impl/progresspanel/progresspanel.view',[
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
    // update progress indicator
    if (info.dynamic === undefined ? info.state === "processing" : info.dynamic) {
      var progressBar = elem.find(".binf-progress-bar");
      this.options.messageHelper.switchField(elem, ".csui-progress", "dynamic",
          ["static", "dynamic"]);
      // update progressbar
      var bytesOfSize = _.str.sformat(lang.BytesOfSize,
          Base.getReadableFileSizeString(info.count),
          Base.getReadableFileSizeString(info.total));
      elem.find(".csui-progress-text").text(bytesOfSize);
      progressBar.attr("aria-valuenow", info.percentage);
      progressBar.css("width", _.str.sformat("{0}%", info.percentage));

      // update percent field
      elem.find(".csui-progress-dynamic .csui-percent").text(
          _.str.sformat("{0}%", info.percentage));
      elem.find('.csui-progress').attr('aria-label',
          _.str.sformat("{0} {1}%", info.label, info.percentage));

    } else {
      this.options.messageHelper.switchField(elem, ".csui-progress", "static",
          ["static", "dynamic"]);
      // update state field
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

    // update action field
    this.options.messageHelper.switchField(elem, ".csui-stateaction", info.state,
        BarStateValues);
  };

  var ProgressBarView = Marionette.ItemView.extend({

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function ProgressBarView(options) {

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.ItemView.prototype.constructor.call(this, options);

      // TODO: Make the progressbar a reusable component; do not
      // misuse the file-upload-progressbar for other scenarios.
      // For upload, the model has the MIME type set from the file
      // object available. For copy, delete and move commnds
      // the model does not have it set and the node is complete
      // by fetching it from the server.
      var model = this.model;
      if (!!model.node && model.node.get('mime_type') === undefined) {
        model.node.set({
          container: false,
          type: 144,
          mime_type: model.get('mime_type') || model.get('type')
        }, {silent: true});
      }

      // Whenever properties of the model change, re-render the view
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
      // 100% will be reached, when the file gets uploaded, but then
      // the server will start saving the document.  Do not show the
      // end-user 100%, when they still need to wait.
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

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
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

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.CompositeView.prototype.constructor.call(this, options);

      // Whenever properties of the model change, re-render the view
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

      // update title
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

      // update collapse/expand
      if (!this.stateExpandCollapse) {
        // only on initial rendering collapse/expand and take state from template
        var arrow = this.ui.header.find(".csui-expand").find(":not(.binf-hidden)");
        if (arrow.hasClass("csui-expand-up")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-expand-down")) {
          this.doCollapse(false);
        }
      }

      // and for better layout possibilities, mark empty panel
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
      // 100% will be reached, when the file gets uploaded, but then
      // the server will start saving the document.  Do not show the
      // end-user 100%, when they still need to wait.
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

    // Outermost parent element should contain a unique widget-specific class
    className: 'csui-progresspanel',

    childView: ProgressBarView,
    childViewContainer: ".csui-items",
    childViewOptions: function () {
      return _.extend(this.options, {
        enableCancel: this.options.enableCancel,
        messageHelper: this.options.messageHelper
      });
    },

    // Template method rendering the HTML for the view
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
        // TODO: DOM refresh will remove focusable of progress element by setting tabindex -1
        // self.trigger('dom:refresh');
        // event to ensure perfect scrollbar after 'dom:refresh' event is commented out above
        self.trigger('ensure:scrollbar');
      });
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      // Set focus to close button if visible. Otherwise, first focusable element
      this.currentlyFocusedElement().focus();
    },

    currentlyFocusedElement: function () {
      return this.ui.header.find('.csui-progress');
    },

    doClose: function () {
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          // Set focus back to origin view only when progress failed.
          // Otherwise, Success message will be showing and it will take care of preserving focus.
          if (self.isProgressFailed()) {
            // Set focus back to Origin element which trigger the alert
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

// Lists explicit locale mappings and fallbacks

csui.define('csui/controls/globalmessage/impl/nls/globalmessage.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/globalmessage/impl/nls/root/globalmessage.lang',{
  FewerDetails: "Fewer details",
  MoreDetails: "More details...",
  GotoLocationLinkLabel: "Go to location",
  CloseDialog: "Close",
  closeDialogAria: "Close message dialog"
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/globalmessage/impl/messagedialog',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-message-link-div\">\r\n    <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.link_url || (depth0 != null ? depth0.link_url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"link_url","hash":{}}) : helper)))
    + "\" class=\"csui-message-link\">"
    + this.escapeExpression(((helper = (helper = helpers.link_label || (depth0 != null ? depth0.link_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"link_label","hash":{}}) : helper)))
    + "</a>\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-details-wrapper\">\r\n  <div id=\"csui-message-details\" class=\"csui-details csui-minheight\">\r\n    <div class=\"csui-text binf-hidden\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.detailsId || (depth0 != null ? depth0.detailsId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"detailsId","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.details_text || (depth0 != null ? depth0.details_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"details_text","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-action csui-message-details-heightsource\">\r\n      <a href=\"javascript:void(0);\" class=\"csui-action-moredetails\">"
    + this.escapeExpression(((helper = (helper = helpers.action_moredetails || (depth0 != null ? depth0.action_moredetails : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"action_moredetails","hash":{}}) : helper)))
    + "</a>\r\n      <a href=\"javascript:void(0);\" class=\"csui-action-fewerdetails binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.action_fewerdetails || (depth0 != null ? depth0.action_fewerdetails : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"action_fewerdetails","hash":{}}) : helper)))
    + "</a>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-header csui-height-target\">\r\n    <div class=\"csui-state\">\r\n        <span class=\"csui-state-icon csui-icon\"></span>\r\n    </div>\r\n    <div class=\"csui-text\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.headerId || (depth0 != null ? depth0.headerId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerId","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.header_text || (depth0 != null ? depth0.header_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header_text","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.header_text || (depth0 != null ? depth0.header_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header_text","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-action\">\r\n        <button type=\"button\" class=\"csui-action-close binf-btn binf-btn-default csui-icon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.closeDialog || (depth0 != null ? depth0.closeDialog : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeDialog","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeDialogAria || (depth0 != null ? depth0.closeDialogAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeDialogAria","hash":{}}) : helper)))
    + "\"/>\r\n    </div>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message_with_link : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.details_text : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_globalmessage_impl_messagedialog', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/globalmessage/impl/messagedialog',[],function(){});
csui.define('csui/controls/globalmessage/impl/messagedialog.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'i18n',
  'i18n!csui/controls/globalmessage/impl/nls/globalmessage.lang',
  'hbs!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (_, $, Marionette, i18n, lang, template, css) {
  'use strict';

  var messageClassMap = {
    info: "csui-info",
    success: "csui-success",
    success_with_link: "csui-success-with-link",
    warning: "csui-warning",
    error: "csui-error",
    processing: "csui-processing",
    none: "csui-none"
  };

  var stateIconClassMap = {
    info: "csui-icon-notification-information-white",
    success: "csui-icon-notification-success-white",
    success_with_link: "csui-icon-notification-success-white",
    warning: "csui-icon-notification-warning-white",
    error: "csui-icon-notification-error-white",
    processing: null,
    none: null
  };

  var closeIconClassMap = {
    info: "csui-icon-dismiss-white",
    success: "csui-icon-dismiss-white",
    success_with_link: "csui-icon-dismiss-white",
    warning: "csui-icon-dismiss-white",
    error: "csui-icon-dismiss-white",
    processing: null,
    none: "csui-icon-dismiss"
  };

  var className = "csui-messagepanel";

  var View = Marionette.ItemView.extend({

    constructor: function MessageDialog(options) {
      this.css = css;
      options.info || (options.info = "info");
      this.className = className + " " + messageClassMap[options.info];

      if (options.context && options.nextNodeModelFactory) {
        this._nextNode = options.context.getModel(options.nextNodeModelFactory);
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    className: className + " " + messageClassMap["info"],
    template: template,

    ui: {
      closeAction: '.csui-header .csui-action-close',
      collapseAction: '.csui-details .csui-action-fewerdetails',
      expandAction: '.csui-details .csui-action-moredetails',
      stateIcon: '.csui-state-icon',
      closeIcon: '.csui-action-close',
      messageLink: '.csui-message-link'
    },

    events: {
      'click @ui.closeAction': 'doClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand',
      'click @ui.messageLink': 'onClickLink',
      'focusout @ui.closeIcon': 'replaceDummyBackImg'
    },

    doResize: function () {
      var header = this.$el.find(".csui-header");
      var details = this.$el.find(".csui-details");
      details.width(header.width());
      if (this.options.sizeToParentContainer) {
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        var translateX = (parentWidth - width) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    },

    doCollapse: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "moredetails",
          ["moredetails", "fewerdetails"]);
      var panel = _.extend({csuiAfterHide: function () { details.css("width", ""); }},
          this);
      this.options.messageHelper.collapsePanel(panel, details, detailsText, animated);
      this.stateExpandCollapse = "collapsed";
    },

    doExpand: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "fewerdetails",
          ["moredetails", "fewerdetails"]);
      details.css("width", this.$el.find(".csui-header").width());
      this.options.messageHelper.expandPanel(this, details, detailsText, animated);
      this.stateExpandCollapse = "expanded";
    },

    doShow: function (relatedView, parentView) {
      var existingDialogs = parentView.$el.find('.csui-global-message.position-show');
      if (existingDialogs.length) {
        var latestDialog        = existingDialogs.last().find('.csui-header'),
            existingDialogCount = existingDialogs.length,
            currentDialogHeader = this.$el.find('.csui-header');
        currentDialogHeader.css({
          'top': 4 * existingDialogCount + 'px',
          'margin': '0 ' + (-8 * existingDialogCount) + 'px'
        });
        var currentDialogDetailsWrapper = this.$el.find('.csui-details-wrapper');
        if (currentDialogDetailsWrapper.length) {
          currentDialogDetailsWrapper.css({
            'margin-right': (-8 * existingDialogCount) + (-5) + 'px',
            'margin-left': (-8 * existingDialogCount) + (-5) + 'px'
          });
        }
      }
      if (this.options.info === "success") {
        var self = this;
        var panel = _.extend({
          csuiAfterShow: function () {
            self.doResize();
            self._setTimeout();
          }
        }, this);
        this.options.messageHelper.showPanel(panel, relatedView, parentView);
      } else {
        this.options.messageHelper.showPanel(this, relatedView, parentView);
      }
      this.doResize();

      // Fire message show to make this message dialog tabbale
      this.$el.trigger('globalmessage.shown', this);
      this.$el.find('.csui-action-close').focus();
    },

    doClose: function () {
      this._clearTimeout();
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          // Set focus back to Origin element which trigger the alert
          self.trigger('escaped:focus');
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    _setTimeout: function () {
      var self = this;
      if (!this.options.enablePermanentHeaderMessages) {
        // at least the fixed timeout can be deactivated, to comply with BITV 2.2.1a, configurable time limits
        this.options.timeout = window.setTimeout(function () {
          self.doClose();
        }, 5000);
      }
    },

    _clearTimeout: function () {
      if (this.options.timeout) {
        window.clearTimeout(this.options.timeout);
        this.options.timeout = undefined;
      }
    },

    headerId: undefined,
    detailsId: undefined,

    templateHelpers: function () {
      var closeAria = lang.closeDialogAria;
      if (!this.headerId) {
        this.headerId = _.uniqueId('header');
      }
      if (!this.detailsId) {
        this.detailsId = this.options.details ? _.uniqueId('details') : undefined;
      }

      var info = {
        header_text: this.options.message,
        headerId: this.headerId,
        details_text: this.options.details,
        detailsId: this.detailsId,
        action_moredetails: lang.MoreDetails,
        action_fewerdetails: lang.FewerDetails,
        closeDialog: lang.CloseDialog,
        closeDialogAria: closeAria
      };

      if (this.options.link_url && this.options.targetFolder) {
        info = _.extend(info, {
          message_with_link: true,
          link_label: lang.GotoLocationLinkLabel,
          link_url: this.options.link_url
        });
      }

      return info;
    },

    onClickLink: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.doClose();
      if (this.options.targetFolder && this._nextNode) {
        this._nextNode.set('id', this.options.targetFolder.get('id'));
      }
    },

    onRender: function () {
      // Set proper role and related fields
      this.$el.attr('role', 'alertdialog');
      this.$el.attr('aria-labelledby', this.headerId);
      if (this.detailsId) {
        this.$el.attr('aria-describedby', this.detailsId);
      }

      // Apply the right state icon
      var stateClass = stateIconClassMap[this.options.info];
      if (stateClass) {
        this.ui.stateIcon.addClass(stateClass);
      } else {
        this.$el.addClass('csui-no-icon');
      }

      // Apply the right close icon
      var closeClass = closeIconClassMap[this.options.info];
      if (closeClass) {
        this.ui.closeIcon.addClass(closeClass);
      }

      // Update collapse/expand
      if (!this.stateExpandCollapse) {
        // only on initial rendering collapse/expand and take state from template
        var arrow = this.$el.find(".csui-details .csui-action").find(
            ":not(.binf-hidden)");
        if (arrow.hasClass("csui-action-fewerdetails")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-action-moredetails")) {
          this.doCollapse(false);
        }
      }
    },

    replaceDummyBackImg: function(){
      this.ui.closeIcon.addClass('csui-action-close-replace-dummy');
    }

  });

  return View;

});

csui.define('csui/controls/globalmessage/impl/custom.wrapper.view',[
  'csui/lib/backbone', 'csui/lib/marionette',
  'css!csui/controls/globalmessage/impl/messagedialog',
], function (Backbone, Marionette) {
  'use strict';

  var CustomWrapperView = Marionette.ItemView.extend({

    constructor: function CustomWrapperView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      var contentView = this.getOption('contentView');
      if (!(contentView instanceof Backbone.View)) {
        contentView = contentView.call(this);
      }
      this.view = contentView;

      this.listenTo(contentView, 'destroy', this.destroy);
      this.region = new Marionette.Region({el: this.el});
    },

    className: 'csui-messagepanel',

    template: false,

    onRender: function () {
      this.region.show(this.view);
    },

    onDestroy: function () {
      this.region.empty();
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
    }

  });

  return CustomWrapperView;

});

csui.define('csui/controls/globalmessage/globalmessage',['module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/messagehelper',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'csui/controls/globalmessage/impl/messagedialog.view',
  'csui/controls/globalmessage/impl/custom.wrapper.view'
], function ( module, _, $, Backbone, MessageHelper, ProgressPanelView,
    MessageView, CustomWrapperView) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    enablePermanentHeaderMessages: false
  });

  var messageHelper = new MessageHelper(),
      globals = {},
      hasDefaultRegion;

  var GlobalMessage = {

    setMessageRegionView: function (messageRegionView, options) {
      this._cleanupPreviousMessageRegion();
      // Global messages span over the entire view height without these options
      options = _.defaults({}, options, {
        useClass: true,
        sizeToParentContainer: true
      });
      options.classes && (globals.classNames = options.classes);
      globals.relatedView = options.useClass ? undefined : messageRegionView;
      //Size to parent container instead of browser view port. This is needed for cases where the
      //global messaging and progress bar are to display within a widget.
      globals.sizeToParentContainer = options.sizeToParentContainer;
      globals.messageRegionView = messageRegionView;
      if (globals.messageRegionView && globals.fileUploadCollection &&
          globals.progressPanel) {
        globals.progressPanel = this._makeProgressPanel();
      }
    },

    setFileUploadCollection: function (fileUploadCollection) {
      globals.fileUploadCollection = fileUploadCollection;
      if (globals.progressPanel) {
        if (globals.fileUploadCollection) {
          globals.progressPanel = this._makeProgressPanel();
        } else {
          this.hideFileUploadProgress();
        }
      }
    },

    hideFileUploadProgress: function () {
      if (globals.progressPanel) {
        globals.progressPanel.doClose();
        globals.progressPanel.destroy();
        globals.progressPanel = undefined;
      }
    },

    showFileUploadProgress: function (fileUploadCollection, options) {
      if (fileUploadCollection) {
        if (globals.fileUploadCollection !== fileUploadCollection) {
          this.hideFileUploadProgress();
        }
        globals.fileUploadCollection = fileUploadCollection;
      }
      if (!globals.progressPanel || fileUploadCollection) {
        globals.progressPanel = this._makeProgressPanel(options);
      }
      if (globals.progressPanel) {
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }
    },

    showPermissionApplyingProgress: function (permissionAppliedCollection, options) {
      if(permissionAppliedCollection)
      {
        globals.permissionAppliedCollection = permissionAppliedCollection;
        globals.progressPanel =  this.__makePermissionProgressPanel(options);
      }

      if (!globals.progressPanel || permissionAppliedCollection) {
        globals.progressPanel = this._makeProgressPanel(options);
      }
      if (globals.progressPanel) {
        globals.progressPanel.doShow(globals.relativeView, globals.messageRegionView);
      }


    },

    /* Shows an error message in the global message location.
      @Params:
        - info - the type of the message:
          - "info" (default)
          - "success"
          - "success_with_link"
          - "warning"
          - "error"
          - "processing"
          - "none"
        - text - the message text
        - details - a detailed message text
        - options - object containing other options
     */
    showMessage: function (info, text, details, options) {
      return this._showMessageView(MessageView,
          _.extend ({
            info: info,
            message: text,
            details: details,
            messageHelper: messageHelper,
            sizeToParentContainer: globals.sizeToParentContainer,
            enablePermanentHeaderMessages: config.enablePermanentHeaderMessages
          }, options)
      );
    },

    showCustomView: function (customView) {
      return this._showMessageView(CustomWrapperView, {
        contentView: customView,
        messageHelper: messageHelper
      });
    },

    _showMessageView: function (View, options) {
      this._ensureMessageRegion();
      var messageView = messageHelper.activatePanel(
          messageHelper.createPanel(globals, View, options),
          globals.relatedView, globals.messageRegionView);
      this._addEventHandlers(messageView);
      return messageView;
    },

    _makeProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.fileUploadCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
          messageHelper.createPanel(globals, ProgressPanelView, options,
              globals.progressPanel),
          globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    __makePermissionProgressPanel: function (options) {
      options || (options = {});
      _.defaults(options, {
        collection: globals.permissionAppliedCollection,
        sizeToParentContainer: globals.sizeToParentContainer,
        messageHelper: messageHelper
      });
      this._ensureMessageRegion();
      var progressPanel = messageHelper.activatePanel(
          messageHelper.createPanel(globals, ProgressPanelView, options,
              globals.progressPanel),
          globals.relatedView, globals.messageRegionView, globals.progressPanel);
      this._addEventHandlers(progressPanel);
      return progressPanel;
    },

    _addEventHandlers: function (view) {
      // should listen to resize of region (only), but as this does not fire
      // we have to listen to window as well :-(.
      var resizeHandler = function () {
        messageHelper.resizePanel(view, globals.relatedView);
      };
      $(window).on('resize', resizeHandler);
      view.listenTo(globals.messageRegionView, 'resize', resizeHandler);
      view.once('before:destroy', function () {
        $(window).off('resize', resizeHandler);
        view.stopListening(globals.messageRegionView, 'resize', resizeHandler);
      });
    },

    _ensureMessageRegion: function () {
      if (globals.messageRegionView) {
        return;
      }

      // Reserve a view as big as the screen for high panels like
      // the progress panel.  No width - this is no modal backdrop.
      var modalContainer = $.fn.binf_modal.getDefaultContainer(),
          messageContainer = $('<div>', {
            'style': 'position:absolute; top: 0; left: 0; width: 0; height: 100vh;'
          }).appendTo(modalContainer);
      globals.messageRegionView = new Backbone.View({el: messageContainer});
      hasDefaultRegion = true;
    },

    _cleanupPreviousMessageRegion: function () {
      if (hasDefaultRegion) {
        globals.messageRegionView.remove();
        hasDefaultRegion = false;
      }
      if (globals.progressPanel) {
        globals.progressPanel.destroy();
      }
      globals = {};
    }

  };

  return GlobalMessage;

});

csui.define('csui/behaviors/default.action/impl/command',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage', 
  'csui/utils/commandhelper'
], function ( _, $, Backbone, commands, GlobalMessage, CommandHelper) {
  'use strict';

  function CommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
  }

  _.extend(CommandController.prototype, {

    executeAction: function (action, status, options) {
      var signature = action.get("signature"),
          command = this.commands.findWhere({signature: signature});

      if (!command) {
        throw new Error('Invalid command: ' + signature);
      }

      var promises = command.execute(status, options);
      if (!_.isArray(promises)) {
        promises = [promises];
      }
      return $.when
          .apply($, promises)
          .fail(function (error) {
            if (error) {
              if(!CommandHelper.showOfflineMessage(error)) {
                GlobalMessage.showMessage('error', error.message);
              }
            }
          });
    }
  });

  CommandController.extend = Backbone.View.extend;

  return CommandController;

});

csui.define('csui/behaviors/default.action/impl/defaultaction',['csui/lib/underscore', 'csui/behaviors/default.action/impl/command',
  'csui/models/nodes', 'csui/utils/defaultactionitems'
], function (_, CommandController, NodeCollection, defaultActionItems) {
  'use strict';

  var DefaultActionController = CommandController.extend({

    constructor: function DefaultActionController(options) {
      CommandController.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.actionItems = options.actionItems || defaultActionItems;
    },

    executeAction: function (node, options) {
      // Apply the default action always to the shortcut target;
      // the original node reference must be expanded.
      var fakedActions;
      if (node.original && node.original.get('id') > 0) {
        fakedActions = this._fakeActions(node.original);
        // Do not switch to original for generations. Commands have to
        // handle them themselves, until we support them properly.
        if (node.get('type') === 1) {
          node = node.original;
        }
      }
      var action = this.getAction(node),
          status = {nodes: new NodeCollection([node])};
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return action && CommandController.prototype.executeAction.call(
              this, action, status, options);
    },

    getAction: function (node) {
      // Check the default action always against the shortcut or generation
      // target; the original node reference must be expanded.
      // TODO: Support for Generations (type 2) has not yet been added in
      // the mobile app, so they are disabled for now. This is why we
      // currently do not enter the if clause if node is a Generation
      // and window.csui.mobile is true.
      var type = node.get('type'),
          fakedActions;
      if ((type === 1 || ((!window.csui || !window.csui.mobile) && type === 2))
          && node.original && node.original.get('id') > 0) {
        node = node.original;
        fakedActions = this._fakeActions(node);
      }
      var status = {nodes: new NodeCollection([node])},
          // Do not search for the first action, which is assigned
          // to the object and its command is enabled; as soon as
          // the first action for the object is found, the result
          // of its command enabling is returned.
          // TODO: Reconsider using the first enabled command again.
          // Disabling a node shoudl be done by a special feature
          // and not by disabling all default actions.
          enabled = false,
          action = this.actionItems.find(function (actionItem) {
            if (actionItem.enabled(node)) {
              var command = this.commands.findWhere({
                signature: actionItem.get("signature")
              });
              enabled = command && command.enabled(status);
              // Stop enumeration after the first action was found,
              // which can handle the specified node
              return true;
            }
          }, this);
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return enabled && action;
    },

    hasAction: function (node) {
      return !!this.getAction(node);
    },

    // Core REST API does not provide permitted actions for shortcut
    // originals. We always allow clicks on them and let the user
    // watch how the operation fails, when they have no permission.

    _fakeActions: function (node) {
      if (!node.actions.length) {
        var actions = _.map(
            this.actionItems.getAllCommandSignatures(this.commands),
            function (signature) {
              return {signature: signature};
            });
        node.actions.reset(actions, {silent: true});
        return true;
      }
    },

    _resetFakedActions: function (node) {
      node.actions.reset([], {silent: true});
    }

  });

  DefaultActionController.version = "1.0";

  return DefaultActionController;

});

// Loads widgets and exposes a promise with the result status on the view
csui.define('csui/behaviors/default.action/default.action.behavior',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/url', 'csui/utils/log',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/utils/node.links/node.links'
], function (module, _, $, Backbone, Marionette, Url, log,
    NextNodeModelFactory, SearchQueryModelFactory, DefaultActionController,
    nodeLinks) {
  'use strict';

  log = log(module.id);

  var DefaultActionBehavior = Marionette.Behavior.extend({
    constructor: function DefaultActionBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      var context = view.options.context;
      this.view = view;
      this._nextNode = context && context.getModel(NextNodeModelFactory);
      this._searchQuery = context && context.getModel(SearchQueryModelFactory);
      view.defaultActionController = this.options.defaultActionController ||
                                     new DefaultActionController();
    },

    onExecuteDefaultAction: function (node) {
      // Support triggering by the `triggers` object, where the view is
      // passed by Marionette as the first parameter and there are no options
      if (node instanceof Backbone.View) {
        node = node.model;
      }
      var action = this.view.defaultActionController.getAction(node);
      if (action) {
        this.view.defaultActionController.executeAction(node, {
          context: this.view.options.context,
          originatingView: this.view
        });
      } else {
        log.can('WARN') && log.warn('No default action was enabled for {0}.',
            JSON.stringify(_.pick(node.attributes, 'name', 'id', 'type'))) &&
        console.warn(log.last);
      }
    }
  }, {
    // TODO: Deprecate this method.
    getDefaultActionNodeUrl: function (node) {
      var url = nodeLinks.getUrl(node),
          hash = url.lastIndexOf('#');
      // This disallows using the hash part, when the slash-based routing is enabled.
      // But it shoudl be no problem, because this method is not used in new scenaros
      // any more and it didn't offer such contract forn the older ones.
      if (hash >= 0) {
        return url.substr(hash);
      }
      return url;
    }
  });

  return DefaultActionBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/error/impl/error',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-suggestion\">"
    + this.escapeExpression(((helper = (helper = helpers.suggestion || (depth0 != null ? depth0.suggestion : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"suggestion","hash":{}}) : helper)))
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-error-icon-div\">\r\n  <div class=\"csui-error-icon-parent\">\r\n    <div class=\"csui-error-icon notification_error\"></div>\r\n  </div>\r\n\r\n</div>\r\n<div class=\"csui-message\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.suggestion : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_error_impl_error', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/error/impl/error',[],function(){});
csui.define('csui/controls/error/error.view',[
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/error/impl/error',
  'css!csui/controls/error/impl/error'
], function ($, Marionette, template) {
  'use strict';

  var ErrorView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-error content-tile';
      if (this.options.low) {
        className += ' csui-low';
      }
      return className;
    },

    template: template,

    modelEvents: {
      change: 'render'
    },

    ui: {
      messageArea: '.csui-message'
    },

    events: {
      "mouseenter": 'showPopover',
      "mouseleave": 'hidePopover'
    },

    constructor: function ErrorView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onShow: function () {
      if (this.options.model.get('title')) {
        var that = this;
        this.$el.closest('.csui-disabled').removeClass('csui-disabled');
        this.ui.messageArea.binf_popover({
          content: this.options.model.get('title'),
          html: true,
          placement: function () {
            var popOverSource = that.ui.messageArea,
                maxWidth      = popOverSource.width(),
                maxHeight     = popOverSource.height(),
                offset        = popOverSource.offset(),
                window_left   = offset.left,
                window_top    = offset.top,
                window_right  = (($(window).width()) - (window_left + popOverSource.outerWidth(true))),
                window_bottom = (($(window).height()) - (window_top + popOverSource.outerHeight(true)));
            if (window_right > maxWidth) {
              return "right";
            } else if (window_left > maxWidth) {
              return "left";
            } else if (window_bottom > maxHeight) {
              return "bottom";
            } else {
              return "top";
            }
          }
        });
      }
    },

    showPopover: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.messageArea.binf_popover('show');
    },

    hidePopover: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.messageArea.binf_popover('hide');
    }

  });

  return ErrorView;

});

csui.define('csui/widgets/error/error.view',[
  'csui/lib/underscore','csui/lib/backbone', 'csui/controls/error/error.view'
], function (_, Backbone, ErrorControlView) {
  'use strict';

  var ErrorWidgetView = ErrorControlView.extend({

    className: function () {
      var cvclass = ErrorControlView.prototype.className;
      if( _.isFunction(cvclass)) {
        cvclass = cvclass.call(this);
      }
      return 'csui-error-widget ' + cvclass;
    },

    constructor: function ErrorWidgetView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          message: options.data.message,
          suggestion: options.data.suggestion
        });
      }

      ErrorControlView.prototype.constructor.call(this, options);
    }

  });

  return ErrorWidgetView;

});

csui.define('csui/behaviors/widget.container/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/behaviors/widget.container/impl/nls/root/lang',{

  loadingWidgetFailedMessage: '"{0}" failed to load.',
  loadingWidgetFailedSuggestion: 'Please try again later or contact support.'

});


// Loads widgets and exposes a promise with the result status on the view
csui.define('csui/behaviors/widget.container/widget.container.behavior',['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/widgets/error/error.view',
  'csui/utils/log', 'i18n!csui/behaviors/widget.container/impl/nls/lang',
  'csui/lib/jquery.when.all'
], function (require, _, $, Marionette, ErrorView, log, lang) {
  'use strict';

  var WidgetContainerBehavior = Marionette.Behavior.extend({

    constructor: function WidgetContainerBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this.view.widgetsResolved = this._resolveWidgets();
    },

    _resolveWidgets: function () {
      var promises = [];
      if (!this.view.enumerateWidgets) {
        throw new Marionette.Error({
          name: 'UndefinedEnumerateWidgets',
          message: 'Undefined enumerateWidgets method'
        });
      }
      this.view.enumerateWidgets(_.bind(function (widget) {
        promises.push(WidgetContainerBehavior.resolveWidget(widget));
      }, this));
      return $.whenAll.apply($, promises);
    },

  }, {

    getErrorWidget: function (widget, error) {
      return {
        type: 'csui/widgets/error',
        options: {
          message: _.str.sformat(lang.loadingWidgetFailedMessage, widget.type),
          suggestion: lang.loadingWidgetFailedSuggestion
        },
        view: ErrorView,
        error: error
      };
    },

    resolveWidget: function (widget) {
      if (!widget.view) {
        var promise = WidgetContainerBehavior._loadWidget(widget.type)
            .then(function (Widget) {
              widget.view = Widget;
              // TODO: Remove the deprecated property
              widget['class'] = Widget;
            }, function (error) {
              log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
              && console.warn(log.last);
              log.warn('Occurred ' + log.getStackTrace()) && console.warn(log.last);
              _.extend(widget, WidgetContainerBehavior.getErrorWidget(widget, error));
            });
        return promise;
      }
      return $.Deferred().resolve().promise();
    },

    _loadWidget: function (name) {
      var deferred  = $.Deferred(),
          path,
          lastSlash = name.lastIndexOf('/');
      // Enable widget names without the module path for the core widgets;
      // compatibility for early perspectives, which did not use full paths
      if (lastSlash < 0) {
        path = 'csui/widgets/' + name;
      } else {
        path = name;
        name = name.substring(lastSlash + 1);
      }
      require([path + '/' + name + '.view'],
          function (Widget) {
            deferred.resolve(Widget);
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }

  });

  return WidgetContainerBehavior;

});

csui.define('csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',['csui/lib/underscore', 'csui/lib/marionette'
], function (_, Marionette) {
  'use strict';

  var ViewEventsPropagationMixin = {

    propagateEventsToViews: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._propagateEventToViews, this, views));
    },

    cancelEventsToViewsPropagation: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._cancelEventToViewsPropagation, this, views));
    },

    _propagateEventToViews: function (views, name) {
      _.each(views, function (view) {
        //console.log('Propagating', name,
        //    'from', Object.getPrototypeOf(this).constructor.name,
        //    'to', Object.getPrototypeOf(view).constructor.name);
        //var parentView = this;
        var childView = view;
        view.listenTo(this, name, function () {
          //console.log('Triggering', name,
          //    'from', Object.getPrototypeOf(parentView).constructor.name,
          //    'to', Object.getPrototypeOf(childView).constructor.name);
          // Check if the view has already triggered render and show events
          // and if the view element has been added to the document.
          if (childView._isShown && childView._isRendered &&
              Marionette.isNodeAttached(childView.el)) {
            var parameters = Array.prototype.slice.call(arguments);
            parameters.unshift(childView, name);
            Marionette.triggerMethodOn.apply(Marionette, parameters);
          }
          // context provided to be able to stop listening
        }, this);
      }, this);
    },

    _cancelEventToViewsPropagation: function (views, name) {
      _.each(views, function (view) {
        //console.log('Cancelling propagation', name,
        //    'from', Object.getPrototypeOf(this).constructor.name,
        //    'to', Object.getPrototypeOf(view).constructor.name);
        // context provided to identify this origin as registrator
        view.stopListening(this, name, undefined, this);
      }, this);
    },

    _eventsToPropagateToViews: ['dom:refresh']

  };

  return ViewEventsPropagationMixin;

});

csui.define('csui/controls/grid/grid.view',['require', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin'
], function (require, _, Backbone, Marionette, ViewEventsPropagationMixin) {

  var ColumnView = Marionette.ItemView.extend({

    className: function () {
      var classNames = [];
      if (!!this.model.get('className')) {
        // Apply additional classes from model
        classNames.push(this.model.get('className'));
      }
      this._addSizeClasses(classNames);
      // TODO: Decide if we need it or not.  Or if we want just moves=pushes+pulls.
      // Experimental features for testing: you can define offsets, pulls and pushes
      // together with sizes for a grid column.  They will convert to binf-col-offset-*,
      // binf-col-push-* and binf-col-pull classes respectively.
      this._addOffsetClasses(classNames);
      this._addPullClasses(classNames);
      this._addPushClasses(classNames);
      this._addHeightClasses(classNames);
      return _.unique(classNames).join(' ');
    },

    attributes: function () {
      var tmpAttributes;

      if (this.model.get('widget') !== undefined) {
        var widgetType = this.model.get('widget').type;
        var lastSlash = widgetType.lastIndexOf('/');
        if (lastSlash > 0) {
          widgetType = widgetType.substring(lastSlash + 1);
        }
        // FIXME: use full path for widget type

        tmpAttributes = {
          'data-csui-widget_type': widgetType,
          'data-csui-cell_address': this.model.get('widget').cellAddress
        };
      }
      else {
        tmpAttributes = {};
      }

      return tmpAttributes;
    },

    constructor: function ColumnView(options) {
      if (!!options.cellBehaviours) {
        this.behaviors = _.extend(options.cellBehaviours, this.behaviors);
      }
      this._init(options);
    },

    _init: function (options) {
      Marionette.ItemView.prototype.constructor.call(this, _.extend({template: false}, options));
      if (this.collection) {
        this._createRows();
      } else {
        this._createCell();
        this._registerModelEvents();
      }
      this.propagateEventsToViews(this.cell || this.rows);
    },

    _registerModelEvents: function () {
      this.listenTo(this.model, 'change:widget', this._updateWidget);
      this.listenTo(this.model, 'change:sizes', this._updateSizes);
      this.listenTo(this.model, 'change:heights', this._updateSizes);
    },

    _updateSizes: function () {
      var className = _.result(this, 'className');
      this.$el.attr('class', className);
    },

    /**
     * Replace and re-render cell with new widget
     */
    _updateWidget: function (newWidget) {
      newWidget.cellAddress = this.model.get('widget').cellAddress;

      // Create Cell for new widget
      this._createCell();

      // Update Attributes
      var attrs = _.result(this, 'attributes');
      if (this.id) { attrs.id = _.result(this, 'id'); }
      if (this.className) { attrs['class'] = _.result(this, 'className');}
      this.$el.attr(attrs);

      // Finally, render
      this.render();
    },

    onRender: function () {
      this._renderContent();
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _addSizeClasses: function (classNames) {
      var sizes = this.model.get('sizes');
      if (sizes) {
        sizes.xs != null && classNames.push('binf-col-xs-' + sizes.xs);
        sizes.sm != null && classNames.push('binf-col-sm-' + sizes.sm);
        sizes.md != null && classNames.push('binf-col-md-' + sizes.md);
        sizes.lg != null && classNames.push('binf-col-lg-' + sizes.lg);
        sizes.xl != null && classNames.push('binf-col-xl-' + sizes.xl);
        sizes.xxl != null && classNames.push('binf-col-xxl-' + sizes.xxl);
      }
    },

    _addOffsetClasses: function (classNames) {
      var offset = this.model.get('offsets');
      if (offset) {
        offset.xs != null && classNames.push('binf-col-xs-offset-' + offset.xs);
        offset.sm != null && classNames.push('binf-col-sm-offset-' + offset.sm);
        offset.md != null && classNames.push('binf-col-md-offset-' + offset.md);
        offset.lg != null && classNames.push('binf-col-lg-offset-' + offset.lg);
        offset.xl != null && classNames.push('binf-col-xl-offset-' + offset.xl);
        offset.xxl != null && classNames.push('binf-col-xxl-offset-' + offset.xxl);
      }
    },

    _addPullClasses: function (classNames) {
      var pulls = this.model.get('pulls');
      if (pulls) {
        pulls.xs != null && classNames.push('binf-col-xs-pull-' + pulls.xs);
        pulls.sm != null && classNames.push('binf-col-sm-pull-' + pulls.sm);
        pulls.md != null && classNames.push('binf-col-md-pull-' + pulls.md);
        pulls.lg != null && classNames.push('binf-col-lg-pull-' + pulls.lg);
        pulls.xl != null && classNames.push('binf-col-xl-pull-' + pulls.xl);
        pulls.xxl != null && classNames.push('binf-col-xxl-pull-' + pulls.xxl);
      }
    },

    _addPushClasses: function (classNames) {
      var pushes = this.model.get('pushes');
      if (pushes) {
        pushes.xs != null && classNames.push('binf-col-xs-push-' + pushes.xs);
        pushes.sm != null && classNames.push('binf-col-sm-push-' + pushes.sm);
        pushes.md != null && classNames.push('binf-col-md-push-' + pushes.md);
        pushes.lg != null && classNames.push('binf-col-lg-push-' + pushes.lg);
        pushes.xl != null && classNames.push('binf-col-xl-push-' + pushes.xl);
        pushes.xxl != null && classNames.push('binf-col-xxl-push-' + pushes.xxl);
      }
    },

    _addHeightClasses: function (classNames) {
      var heights = this.model.get('heights');
      if (heights) {
        heights.xs != null && classNames.push('row-xs-' + heights.xs);
        heights.sm != null && classNames.push('row-sm-' + heights.sm);
        heights.md != null && classNames.push('row-md-' + heights.md);
        heights.lg != null && classNames.push('row-lg-' + heights.lg);
        heights.xl != null && classNames.push('row-xl-' + heights.xl);
        heights.xxl != null && classNames.push('row-xxl-' + heights.xxl);
      }
    },

    _createRows: function () {
      this.rows = new RowsView({
        el: this.el,
        grid: this.options.grid,
        collection: this.collection
      });
    },

    _createCell: function () {
      var CellView        = this._getCellView(),
          cellViewOptions = this._getCellViewOptions(),
          fullOptions     = _.extend({model: this.model}, cellViewOptions);
      this.cell = new CellView(fullOptions);
    },

    _getCellView: function () {
      var cellView = this.options.grid.getOption('cellView');
      if (cellView && !(cellView.prototype instanceof Backbone.View)) {
        cellView = cellView.call(this.options.grid, this.model);
      }
      if (!cellView) {
        throw new Marionette.Error({
          name: 'NoCellViewError',
          message: 'A "cellView" must be specified'
        });
      }
      return cellView;
    },

    _getCellViewOptions: function () {
      var cellViewOptions = this.options.grid.getOption('cellViewOptions');
      if (_.isFunction(cellViewOptions)) {
        cellViewOptions = cellViewOptions.call(this.options.grid, this.model);
      }
      return cellViewOptions;
    },

    _renderContent: function () {
      if (this.cell) {
        this.cell.render();
        Marionette.triggerMethodOn(this.cell, 'before:show');
        this.$el
            .html('')
            .append(this.cell.el);
        Marionette.triggerMethodOn(this.cell, 'show');
      } else {
        // If the grid is nested, nest also the height setting container class
        if (this.options.grid.$el.hasClass('grid-rows')) {
          this.$el.addClass('grid-rows');
        }
        this.rows.render();
      }
    },

    _destroyContent: function () {
      this.cell && this.cell.destroy();
      this.rows && this.rows.destroy();
    }

  });

  _.extend(ColumnView.prototype, ViewEventsPropagationMixin);

  var RowView = Marionette.CollectionView.extend({

    className: 'binf-row',

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.rows,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function RowView(options) {
      if (!!options.rowBehaviours) {
        this.behaviors = _.extend(options.rowBehaviours, this.behaviors);
      }
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    }

  });

  _.extend(RowView.prototype, ViewEventsPropagationMixin);

  var RowsView = Marionette.CollectionView.extend({

    childView: RowView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.columns,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function RowsView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
      // FIXME: implement stopListening in ViewEventsPropagationMixin on 'remove:child'
    }

  });

  _.extend(RowsView.prototype, ViewEventsPropagationMixin);

  var GridRowView = RowView.extend({

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function GridRowView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return new Backbone.Collection(options.columns);
    }

  });

  var GridView = RowsView.extend({

    className: 'cs-grid binf-container-fluid',

    constructor: function GridView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowsView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return this._convertRows(options.rows, 'grid0');
    },

    _convertRows: function (rows, addressPrefix) {
      rows = new Backbone.Collection(rows);
      rows.each(function (row, rowIndex) {
        var columns = row.get('columns');
        row.cellAddress = addressPrefix + ':r' + rowIndex;
        row.columns = this._convertColumns(columns, row.cellAddress);
      }, this);
      return rows;
    },

    _convertColumns: function (columns, addressPrefix) {
      columns = new Backbone.Collection(columns);
      columns.each(function (column, colIndex) {
        var rows = column.get('rows');
        column.cellAddress = addressPrefix + ':c' + colIndex;
        if (column.get('widget') !== undefined) {
          column.get('widget').cellAddress = column.cellAddress;
        }
        if (rows) {
          column.rows = this._convertRows(rows, column.cellAddress);
        }
      }, this);
      return columns;
    }

  }, {

    RowView: GridRowView,
    CellView: ColumnView

  });

  return GridView;

});

csui.define('csui/controls/node-type.icon/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/node-type.icon/impl/nls/root/lang',{

  shortcutTypeLabel: 'Shortcut to {0}',
  nodeTypeUnknown: 'Unknown'

});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/node-type.icon/node-type.icon',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <span class=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<span class=\""
    + this.escapeExpression(((helper = (helper = helpers.mainClassName || (depth0 != null ? depth0.mainClassName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mainClassName","hash":{}}) : helper)))
    + "\"></span>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.overlayClassNames : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_node-type.icon_node-type.icon', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/node-type.icon/node-type.icon.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/nodesprites',
  'i18n!csui/controls/node-type.icon/impl/nls/lang',
  'hbs!csui/controls/node-type.icon/node-type.icon'
], function (_, $, Backbone, Marionette, nodeSpriteCollection,
    lang, template) {
  'use strict';

  var NodeTypeIconModel = Backbone.Model.extend({

    constructor: function NodeTypeIconModel(attributes, options) {
      this.node = options.node;
      attributes = this._getAttributesFromNode();

      NodeTypeIconModel.__super__.constructor.call(this, attributes, options);

      this
          .listenTo(this.node, 'change:id', this._updateModelFromNode)
          .listenTo(this.node, 'change:type', this._updateModelFromNode);
    },

    _getAttributesFromNode: function () {
      var node              = this.node,
          original          = node.original,
          exactNodeSprite   = nodeSpriteCollection.findByNode(node) || {},
          exactClassName    = exactNodeSprite.get('className'),
          mainClassName     = exactClassName,
          overlayClassNames = [];
      var mimeTypeFromNodeSprite;
      if (exactNodeSprite.attributes) {
        mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
      }
      // prefer the title mapped by mimetype entries in nodeSpriteCollection
      var title = mimeTypeFromNodeSprite || node.get("type_name") || node.get("type");

      // If the node is shortcut, find the icon data for the original node
      // and add append an overlay CSS class for a small arrow icon.

      // Note: For MicroPost(Comments and Replies), do not consider
      // original node, show their respective icon

      // Note2: since the RestAPI at the moment does not return the document version, showing the
      // latest document mime-type icon with the shortcut overlay is incorrect.  Use the
      // generation icon  for now.  When the RestAPI and UI supports Generation, switch this to
      // generation-overlay.

      if (original && original.get('id') && node.get("type") !== 1281 && node.get("type") !== 2) {
        var originalNodeSprite = nodeSpriteCollection.findByNode(original) || {};
        mainClassName = originalNodeSprite.get('className');
        overlayClassNames.push('csui-icon csui-icon-shortcut-overlay');
        title = _.str.sformat(lang.shortcutTypeLabel,
            originalNodeSprite.get('mimeType') || original.get("type_name") ||
            lang.nodeTypeUnknown);
      }

      return {
        className: exactClassName,
        mainClassName: mainClassName,
        overlayClassNames: overlayClassNames,
        title: title
      };
    },

    _updateModelFromNode: function () {
      var attributes = this._getAttributesFromNode();
      this.clear({silent: true});
      this.set(attributes);
    }

  });

  var NodeTypeIconView = Marionette.ItemView.extend({

    tagName: 'span',

    attributes: function () {
      var title = this.model.get('title');
      return {
        'class': 'csui-icon-group',
        'title': title,
        'aria-label': title
      };
    },

    template: template,

    constructor: function NodeTypeIconView(options) {
      options || (options = {});
      if (!options.model) {
        this.ownModel = true;
        options.model = new NodeTypeIconModel(undefined, {node: options.node});
      }

      NodeTypeIconView.__super__.constructor.call(this, options);

      // Passing the el to the ctor prevents creating an own el, including
      // setting its attributes.  The caller must ensure the right tag.
      if (options.el) {
        $(options.el).attr(_.result(this, 'attributes'));
      }

      this.listenTo(this.model, 'change', this.render);
    },
    onDestroy: function(){
      if (this.ownModel){
        this.model.stopListening();
      }
    }

  });

  return NodeTypeIconView;

});

csui.define('csui/controls/progressblocker/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/progressblocker/impl/nls/root/lang',{
  loadingText: "Loading data, please wait."
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/progressblocker/impl/blocker',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"outer-border\">\r\n  <div class=\"loader\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.loadingText || (depth0 != null ? depth0.loadingText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"loadingText","hash":{}}) : helper)))
    + "\">\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_progressblocker_impl_blocker', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/progressblocker/impl/blocker',[],function(){});
csui.define('csui/controls/progressblocker/blocker',[
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
      // guard against multiple enabling calls
      if (this.counter) {
        ++this.counter;
      } else {
        this.counter = 1;
        if (this.disableTimeout) {
          clearTimeout(this.disableTimeout);
          this.disableTimeout = undefined;
        } else {
          // delay the actual display by the configured time period
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
      // guard against multiple disabling calls
      if (this.counter > 1) {
        --this.counter;
      } else if (this.counter === 0) {
        log.debug('Blocking view has been already disabled by {0} ({1}).',
            log.getObjectName(this.parentView), this.parentView.cid)
        && console.log(log.last);
      } else {
        this.counter = 0;
        // if the showing delay hasn't ended yet just cancel the display
        if (this.enableTimeout) {
          clearTimeout(this.enableTimeout);
          this.enableTimeout = undefined;
          releaseBlockingViews(this);
        } else {
          // delay the actual hiding in case another showing should come quickly
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
      // The outermost view, which usually means the first view, should win
      if (!globalBlockingView) {
        detachableBlockingView = !!detachable;
        globalBlockingView = this;
        this.$el.addClass('csui-global');
      }
    },

    _getGlobalBlockingView: function () {
      // If this view is the global view, return false; otherwise and endless recursion
      // would occur constantly delegating the operation to the global view
      if (globalBlockingView && globalBlockingView !== this &&
          // Join the global blocking view, if using just the global one was forced,
          // or if the global one is enabled; otherwise let the local one work
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

csui.define('csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',['csui/lib/underscore', 'csui/lib/marionette'
], function (_, Marionette) {
  'use strict';

  var LayoutViewEventsPropagationMixin = {

    propagateEventsToRegions: function () {
      _.each(this._eventsToPropagateToRegions,
          _.bind(this._propagateEventToRegions, this));
    },

    _propagateEventToRegions: function (name) {
      //console.log('Propagating', name,
      //    'within', Object.getPrototypeOf(this).constructor.name);
      this.listenTo(this, name, function () {
        var regions;
        if (this.regionManager) {
          regions = this.regionManager.getRegions();
        } else {
          regions = this.getRegions();
        }

        _.each(regions, function (region) {
          var view = region.currentView;
          // Check if the region contains a view, if the view has already
          // triggered render and show events and if the view element has
          // been added to the document.
          if (view && view._isShown && view._isRendered &&
              Marionette.isNodeAttached(view.el)) {
            //console.log('Triggering', name,
            //    'from', Object.getPrototypeOf(this).constructor.name,
            //    'to', Object.getPrototypeOf(region.currentView).constructor.name);
            var parameters = Array.prototype.slice.call(arguments);
            parameters.unshift(region.currentView, name);
            Marionette.triggerMethodOn.apply(Marionette, parameters);
          }
        }, this);
      });
    },

    _eventsToPropagateToRegions: ['dom:refresh']

  };

  return LayoutViewEventsPropagationMixin;

});

csui.define('csui/controls/mixins/global.alert/global.alert.mixin',[], function () {
  'use strict';
  var GlobalAlertMixin = {
    prepareForGlobalAlert: function () {
      this.listenTo(this, 'global.alert.inprogress', this.handleAlertInProgress);
      this.listenTo(this, 'global.alert.completed', this.handleAlertComplete);
    },

    handleAlertInProgress: function () {
      if (this.currentlyFocusedElement !== this.disableCurrentFocusElementHandler) {
        this.originalCurrentlyFocusedElement = this.currentlyFocusedElement;
      }
      this.currentlyFocusedElement = this.disableCurrentFocusElementHandler;
    },

    disableCurrentFocusElementHandler: function () {
      // console.log('Disabled current focus for ', this.constructor.name);
    },

    handleAlertComplete: function () {
      if (this.originalCurrentlyFocusedElement != null) {
        // console.log('Rolling back to original currentlyFocusedElement.', this.constructor.name);
        this.currentlyFocusedElement = this.originalCurrentlyFocusedElement;
        this.originalCurrentlyFocusedElement = undefined;
      }
    }
  };
  return GlobalAlertMixin;
});
csui.define('csui/controls/tile/behaviors/blocking.behavior',['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/progressblocker/blocker'
], function (_, Marionette, BlockingView) {
  'use strict';

  var BlockingBehavior = Marionette.Behavior.extend({

    constructor: function BlockingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      var blockingParentView = getOption.call(this, 'blockingParentView', options);
      if (blockingParentView) {
        BlockingView.delegate(view, blockingParentView);
      } else {
        BlockingView.imbue(view);
      }

      if (this.collection) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
          // TODO: Find a better workaround for model.destroy relaying request
          // event to the collection but not the sync and error events
            .listenTo(view.collection, "destroy", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
      if (view.model) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, options) {
    options = this.options || options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return BlockingBehavior;

});

csui.define('csui/controls/tile/behaviors/infinite.scrolling.behavior',['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette'
], function (require, $, _, Marionette) {
  "use strict";

  var InfiniteScrollingBehavior = Marionette.Behavior.extend({

    defaults: {
      content: null,
      contentParent: null,
      fetchMoreItemsThreshold: 95
    },

    constructor: function ScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._bindScrollingEvents);
      this.listenTo(view, 'before:destroy', this._unbindScrollingEvents);
    },

    _bindScrollingEvents: function () {
      var contentParent = getOption.call(this, 'contentParent');
      this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;
      this._contentParent.on('scroll.' + this.view.cid, _.bind(this._checkScrollPosition, this));
      var content = getOption.call(this, 'content');
      this._content = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() : this.view.$el;
    },

    _checkScrollPosition: function () {
      var fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold');
      var contentH;
      if (this._content.length === 1) {
        contentH = this._content.height();
      } else {
        contentH = _.reduce(this._content, function (sum, el) {return sum + $(el).height()}, 0);
      }
      var scrollableHeight     = contentH - this._contentParent.height(),
          scrollablePercentage = this._contentParent.scrollTop() * 100 / scrollableHeight;
      if (scrollablePercentage >= fetchMoreItemsThreshold) {
        this._checkScrollPositionFetch();
      }
    },

    _checkScrollPositionFetch: function () {
      var collection = this.view.collection;
      if (collection.length < collection.totalCount && !collection.fetching &&
          collection.skipCount < collection.length) {
        // console.log('fetching from', collection.length);
        var self = this;
        this.view.trigger('before:collection:scroll:fetch');
        collection.setSkip(collection.length, false);
        collection.fetch({
          reset: false,
          remove: false,
          merge: false,
          success: function () {
            self.view.trigger('collection:scroll:fetch');
          }
        });
      }
    },

    _unbindScrollingEvents: function () {
      if (this._contentParent) {
        this._contentParent.off('scroll.' + this.view.cid);
      }
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return InfiniteScrollingBehavior;

});

csui.define('csui/controls/tile/behaviors/parent.scrollbar.updating.behavior',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function (_, $, Marionette, PerfectScrollingBehavior) {
  'use strict';

  var ParentScrollbarUpdatingRegion = Marionette.Region.extend({

    constructor: function ParentScrollbarUpdatingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
      // Set when before:swapOut is triggered and reset when its finishing
      // counterpart is triggered to optimize the event handlers for view
      // swapping in the region
      this._swapping = false;
      
      // Support scrollbar updates on populating and emptying regions
      this
          .listenTo(this, 'before:swapOut', function () {
            this._swapping = true;
          })
          .listenTo(this, 'swapOut', function () {
            this._swapping = false;
          })
          .listenTo(this, 'show', function () {
            this._requestScrollbarUpdate();
          })
          .listenTo(this, 'empty', function () {
            if (!this._swapping) {
              this._requestScrollbarUpdate();
            }
          });
    },

    _requestScrollbarUpdate: function () {
      // There is no connection from the current view in the region to the layout
      // view, which could be used for event triggering.  Use DOM event bubbling
      // as a workaround to reach the parent views.
      // {this.region}.{owning region manager}.{owning layout view}
      triggerScrollbarUpdate(this._parent._parent);
    }

  });

  var ParentScrollbarUpdatingBehavior = Marionette.Behavior.extend({

    constructor: function ParentScrollbarUpdatingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      if (PerfectScrollingBehavior.usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        // Increase when before:render and before:render:collection events
        // are triggered and decrease, when their finishing counterparts are
        // triggered to optimize the event handlers for single view adding
        // or removal
        this._renderState = 0;
        
        this
        // Maintain the rendering state for the events triggered between
        // before:render and render
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
              this._requestScrollbarUpdate();
            })
            // Listen to requests for an explicit scrollbar update
            .listenTo(view, 'update:scrollbar', this._requestScrollbarUpdate)
            // Delay listening to the collection events; the collection may
            // not be present in the view or its options yet
            .listenToOnce(view, 'before:render', function () {
              if (updateOnWindowResize) {
                $(window).bind('resize.' + view.cid, _.bind(this._updateScrollbar, this));
                this.listenToOnce(view, 'before:destroy', function () {
                  $(window).unbind('resize.' + view.cid);
                });
              }
              // Support optimized adding and removing child views
              // in CollectionView, which does not call render
              if (view instanceof Marionette.CollectionView && view.collection) {
                this
                    .listenTo(view.collection, 'reset', function () {
                      this._resetTriggered = true;
                    })
                    .listenTo(view, 'before:render:collection', function () {
                      ++this._renderState;
                    })
                    .listenTo(view, 'render:collection', function () {
                      this._resetTriggered = false;
                      --this._renderState;
                      // If the collection was re-rendered after catching the
                      // 'reset' event, single child view updates were skipped
                      if (!this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      // If the collection was re-rendered after catching the
                      // 'reset' event, no child view updates were performed
                      if (this._resetTriggered || !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      // If a child view was added alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      // If a child view was removed alone, otside the 'reset' event
                      // handler and render() method call, request the update
                      if (!this._resetTriggered && !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    });
              }
            });
      }
    },

    _requestScrollbarUpdate: function () {
      // ChildView should proxy all events to its parent with the 'childview:'
      // prefix, but this concept supports only CollectionView.  Use DOM event
      // bubbling as a workaround to reach the parent views.
      triggerScrollbarUpdate(this.view);
    }

  }, {

    // Support showing and emptying regions in LayoutView,
    // which does not call render
    Region: ParentScrollbarUpdatingRegion

  });

  function triggerScrollbarUpdate(view) {
    // console.log('Updating parent scrollbar requested in',
    //     Object.getPrototypeOf(view).constructor.name);
    $.event.trigger('csui:update:scrollbar', {view: view}, view.el, false);
  }

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ParentScrollbarUpdatingBehavior;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tile/behaviors/impl/searching.behavior',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<form class=\"search-box binf-hidden\">\r\n  <input class=\"search\" type=\"search\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.searchPlaceholder || (depth0 != null ? depth0.searchPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchPlaceholder","hash":{}}) : helper)))
    + "\" style=\"display: none\">\r\n  <span class=\"clearer csui-icon formfield_clear\"></span>\r\n</form><span class=\"icon icon-search\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchIconTitle || (depth0 != null ? depth0.searchIconTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchIconTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.searchIconAria || (depth0 != null ? depth0.searchIconAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchIconAria","hash":{}}) : helper)))
    + "\" role=\"button\"></span>\r\n";
}});
Handlebars.registerPartial('csui_controls_tile_behaviors_impl_searching.behavior', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tile/behaviors/searching.behavior',['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tile/behaviors/impl/searching.behavior',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (_, Marionette, template) {
  "use strict";

  var SearchingBehavior = Marionette.Behavior.extend({

    defaults: {
      searchPlaceholder: 'Type to filter',
      headerTitle: '.tile-title',
      searchButton: '.tile-controls'
    },

    ui: function () {
      var headerTitle = getOption.call(this, 'headerTitle');
      return {
        headerTitle: headerTitle,
        searchBox: '.search-box',
        searchInput: '.search',
        clearer: '.clearer'
      };
    },

    triggers: {
      'click .icon-search': 'toggle:search'
    },

    constructor: function SearchingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderSearchButton);
      this.listenTo(view, 'toggle:search', this._toggleSearching);
    },

    _renderSearchButton: function () {
      var searchButtonSelector = getOption.call(this, 'searchButton'),
          searchButton         = this.view.$(searchButtonSelector),
          searchPlaceholder    = getOption.call(this, 'searchPlaceholder'),
          iconTitle = getOption.call(this, 'searchIconTitle'),
          searchIconTitle = iconTitle ? iconTitle : 'Search',
          iconAria = getOption.call(this, 'searchIconAria'),
          searchIconAria = iconAria ? iconAria : searchIconTitle,
          data                 = {
            searchPlaceholder: searchPlaceholder,
            searchIconTitle: searchIconTitle,
            searchIconAria: searchIconAria
          };
      searchButton.html(template(data));
      this.view._bindUIElements.call(this);
    },

    _toggleSearching: function () {
      var self = this;
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);
      this.ui.headerTitle.toggle('fade');
      this.ui.searchBox.removeClass('binf-hidden');
      this.ui.searchInput.toggle('blind', {direction: 'right'}, 200, function () {
        if (self.ui.searchInput.is(":visible")) {
          self.ui.searchInput.focus();
        }
      });
    }

  });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return SearchingBehavior;

});

csui.define('csui/pages/start/impl/perspective.router',['module', 'require', 'csui/lib/underscore'
], function (module, require, _) {
  'use strict';

  // TODO: Deprecate this module, use PerspectiveRouting

  var config = _.extend({
    developmentPage: false
  }, module.config());

  function PerspectiveRouter(options) {
    csui.require(['csui/pages/start/perspective.routing'], function (PrespectiveRouting) {
      var routing = new PrespectiveRouting(options);
    });
  }

  PerspectiveRouter.routesWithSlashes = function () {
    // Append the client application paths to the "server" page path, when
    // we run on the server; append the client application paths in back of
    // the hash, when we run on a development HTML page
    return /\/app(?:\/.*)?$/.test(location.pathname) || !config.developmentPage;
  };

  return PerspectiveRouter;

});

csui.define('csui/pages/start/impl/perspective.factory',['require', 'csui/lib/underscore', 'csui/lib/jquery'
], function (require, _, $) {

  function PerspectiveFactory(options) {
    this.options = options || {};
  }

  _.extend(PerspectiveFactory.prototype, {

    createPerspective: function (model) {
      var self = this;
      return this._loadPerspective(model.get('type'))
          .then(function (PerspectiveView) {
            return new PerspectiveView(_.extend({
              context: self.options.context
            }, model.get('options')));
          });
    },

    _loadPerspective: function (type) {
      var deferred = $.Deferred(),
          path,
          lastSlash = type.lastIndexOf('/');
      // Enable perspective types without the module path for the core perspectives;
      // compatibility for early perspectives, which did not use the full paths
      if (lastSlash < 0) {
        path = 'csui/perspectives/' + type;
      } else {
        path = type;
        type = type.substring(lastSlash + 1);
      }
      require([path + '/' + type + '.perspective.view'],
          function (PerspectiveView) {
            deferred.resolve(PerspectiveView);
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }

  });

  return PerspectiveFactory;

});

csui.define('csui/pages/start/impl/perspective.panel/perspective.animator',['module', 'csui/lib/underscore', 'csui/lib/jquery'],
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
      // Flush the DOM redraw to separate hiding of the
      // blocking view from the perspective change animation
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
        // Do not let the browser "optimize away" the transition
        // after appending by accessing some DOM property which
        // needs the element rendered.
        .redraw()
        .removeClass('cs-on-stage-right');
      return deferred.promise();
    },

    showPerspective: function (perspectiveView) {
      var deferred = $.Deferred();

      perspectiveView.$el
        .one(this._transitionEnd(), deferred.resolve)
        // Do not let the browser "optimize away" the transition
        // after appending by accessing some DOM property which
        // needs the element rendered.
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



csui.define('css!csui/pages/start/impl/perspective.panel/perspective.panel',[],function(){});
csui.define('csui/pages/start/impl/perspective.panel/perspective.panel.view',['require', 'module', 'csui/lib/jquery',
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
    // May improve smoothness of animation, if some widgets render asynchronously
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
      // Context change start with requesting the perspective and then
      // either by chaging it and rebuilding the context, or just by re-fetching
      // the context, of the perspective does not change.  Use the
      // perspective request for blocking and context sync, which comes always
      // at last, for unblocking.
      if (config.progressWheel) {
        this.listenTo(context, 'request:perspective', this.blockActions)
            .listenTo(context, 'error:perspective', this.unblockActions)
            .listenTo(context, 'sync', this.unblockActions)
            .listenTo(context, 'error', this.unblockActions);
        // If waiting for data loading can be interrupted and the perspective
        // shown, unblock the perspective view, so that the global blocking
        // view gets disabled and widgets, which finished loading, can be used.
        if (config.limitTimeToWaitForData) {
          this.listenTo(context, 'request', function () {
            var self = this;
            setTimeout(function () {
              // If data have not been loaded yet, allow the user to use
              // at least the widgets, which data are available already
              // TODO: Find a better way; this decrements the counmter
              // by one more, than just on the request/sync events
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

    /**
     * Serialize perspective configuration and Trigger back to save perspective
     */
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
        // If we caught unload event earlier and now we change to another
        // perspective, let's assume, that page unloading was cancelled
        pageUnloading = false;
        this.perspectiveFactory.createPerspective(perspective)
            .done(function (perspectiveView) {
              perspectiveView.widgetsResolved.always(function () {
                context.clear();
                // Prevent failed widgets to be slided to the perspective
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
              // Prevent error box about perspective failure showing up
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
        // Maximize not allowed in Edit Perspective mode
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
          // Generic waiting until the widgets and other components
          // re-render their contents after they received fresh data
          // would be complicated.
          _.delay(function () {
            // Prevent widgets showing errors to be slided to the perspective
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
              // Prevent error box about context failure showing up, if the
              // current action has been aborted and other page gets loaded
              if (!pageUnloading) {
                if (window.csui && window.csui.mobile) {
                  // LPAD-59873: (this code is only run in mobile and doesn't affect smart UI) On mobile, we would like to
                  // render the perspective upon error code 500. We do this because we would still like to use the app even
                  // if we don't have access to certain shortcut tile widgets on the home page
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

    /**
     * Perspective show / transition for enter, exit from edit mode
     */
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
        // Switching in / out of Edit mode, no swap animation required.
        this._showPerspectiveForEditMode(perspectiveView, perspective);
        deferred.resolve(perspectiveView);
        return;
      }

      // Setting a fixed size to the perspective panel solves two
      // problems, which cause disturbance in the transition:
      //
      // * Scrollbar appears on the page, when the old perspective is still
      //   visible, if the new perspective is taller than the viewport and
      //   the old one was not.
      //
      // * Safari on on iOS 9 zooms out, when the new perspective is added
      //   to the perspective panel, so that both perspectives can be seen
      //   anz zooms in again, when the old perspective is destroyed.
      // Suppress the scrollbar only if the current perspective
      // did not need it
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

    //This function will check for the number of widgets in current perspective, if the
    // perspective contains only nodestable view widget then show it in maxmized mode
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
      csui.require(['csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage('error', error.message);
      });
    },

    _showModalError: function (error, options) {
      csui.require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.message, options);
      });
    }
  });

  return PerspectivePanelView;
});

/**
 * Behaviour applied to draggable item, works along with dnd.container.behaviour.js
 */
csui.define('csui/behaviors/drag.drop/dnd.item.behaviour',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (_, $, Marionette, Backbone) {

  var DragAndDropItemBehaviour = Marionette.Behavior.extend({
    constructor: function DragAndDropItemBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this._registerListeners();
    },

    _registerListeners: function () {
      this.listenTo(this.view, 'render', this._initDnD);
    },

    _initDnD: function () {
      this.$el.addClass('csui-draggable-item');
      this.$el.attr('data-csui-draggable-item', this.view.model.cid);
    }
  });

  return DragAndDropItemBehaviour;
});
csui.define('csui/behaviors/drag.drop/dnd.container.behaviour',['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (require, i18n, _, $, Marionette, Backbone) {

  var DragAndDropContainerBehaviour = Marionette.Behavior.extend({

    defaults: {
      placeholder: undefined, // a class or function. Undefined represents close of original element
      handle: undefined, // Restricts sort start click to the specified element.
      draggableItem: '.csui-draggable-item',
      disableDraggable: '.csui-draggable-item-disable',
      over: false,
      receive: false
    },

    constructor: function DragAndDropContainerBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(this.view, 'render', this._initSorting);
    },

    _getPlaceholder: function (currentItem) {
      var placeholder = this.options.placeholder;
      if (!placeholder || _.isString(placeholder)) {
        var className = placeholder;
        placeholder = function () {
          var nodeName = currentItem[0].nodeName.toLowerCase(),
              element  = $("<" + nodeName + ">");

          element.addClass("ui-sortable-placeholder")
              .addClass(className || currentItem[0].className)
              .removeClass("ui-sortable-helper");
          return element;
        };
      }
      return placeholder.call(this, currentItem);
    },

    _initSorting: function () {
      var self = this;
      this.view.$el.addClass('csui-dnd-container');
      this.$el.sortable({
        items: this.options.draggableItem,
        cancel: this.options.disableDraggable,
        handle: this.options.handle,
        placeholder: {
          element: this._getPlaceholder.bind(this),
          update: function () {}
        },
        start: this._onSortStart.bind(this),
        stop: this._onSortStop.bind(this),
        over: this.options.over,
        receive: this.options.receive
      });
    },

    _onSortStart: function (event, ui) {
      this.$el.addClass('csui-drag-start');
    },

    /**
     * Update respective Backbone colleciton on DOM changes
     */
    _onSortStop: function (event, ui) {
      this.$el.removeClass('csui-drag-start');
      var dragItemId = ui.item.attr('data-csui-draggable-item');
      var model = this.view.collection.get(dragItemId);
      var modelIndex = this.view.collection.indexOf(model);
      var updatedIndex = this.$el.find('[data-csui-draggable-item=' + dragItemId + ']').index();
      if (modelIndex === updatedIndex) {
        // DOM placement not changes.. no collection update required.
        return;
      }
      this.view.collection.remove(model, {silent: true});
      this.view.collection.add(model, {at: updatedIndex, silent: true});
    }
  });

  return DragAndDropContainerBehaviour;
});
csui.define('csui/perspectives/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
  
csui.define('csui/perspectives/impl/nls/root/lang',{
  invalidWidgetOptions: 'Some widgets have options that require values before the perspective can be saved. Please click on each of the highlighted widgets and check for any required options that have missing values.'
});

csui.define(
    'csui/perspectives/mixins/perspective.edit.mixin',['require', 'csui/lib/underscore', 'csui/lib/jquery', "csui/utils/log",
      'i18n!csui/perspectives/impl/nls/lang', 'csui/models/node/node.model',
      'csui/models/widget/widget.model'],
    function (require, _, $, log, lang, NodeModel, WidgetModel) {
      'use strict';
      /**
       * Mix provides supported functionality required for Perspective Inline Editing
       */
      var PerspectiveEditMixin = {
        mixin: function (prototype) {
          return _.extend(prototype, {

            /**
             * Get prepare for perspective edit. Add required event listeners
             */
            prepareForEditMode: function () {
              this.listenTo(this, 'update:widget:options',
                  function (widgetView, isValid, options) {
                    var widget = widgetView.model.get('widget');
                    if (widget.type === 'csui/perspective.manage/widgets/perspective.widget') {
                      widget = widget.options;
                    }
                    widget.options = options;
                    widgetView.model.set('hasValidOptions', isValid, {
                      silent: true
                    });
                  });
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

            /**
             * Serialize widget options
             */
            serializeWidget: function (model) {
              var deferred = $.Deferred();
              if (model.get('hasValidOptions') !== false) {
                // Has valid form options
                var widget  = model.get('widget'),
                    kind    = widget.kind,
                    type    = widget.type,
                    cid     = widget.cid,
                    options = widget.options;
                if (type === 'csui/perspective.manage/widgets/perspective.widget') {
                  type = options.widget.id;
                  options = options.options;
                }
                deferred.resolve({
                  widget: {
                    type: type,
                    kind: kind,
                    options: options,
                    c_id: cid
                  }
                });
              } else {
                // Invalid options form
                deferred.reject({
                  error: lang.invalidWidgetOptions
                });
              }
              return deferred.promise();
            },
            /**
             * Execute callbacks if any, once for each widget type in current perspective
             */
            executeCallbacks: function (models, perspectiveModel) {
              this.perspectiveWidgets = models;
              var deferred = $.Deferred();
              this.loadCallbacks(models).then(_.bind(function (widgetsWithCallback) {
                var promises = _.map(widgetsWithCallback,
                    _.bind(function (widgetWithCallback) {
                      return this.initializeWidget(widgetWithCallback, perspectiveModel);
                    }, this));
                $.whenAll.apply($, promises)
                    .then(function () {
                      deferred.resolve();
                    });
              }, this));
              return deferred.promise();
            },

            loadCallbacks: function (models) {
              var self     = this,
                  deferred = $.Deferred(),
                  promises = _.chain(models)
                      .groupBy(function (model) {
                        return model.widget.type;
                      })
                      .map(function (widgetType) {
                        var deferredEach = $.Deferred();
                        self._resolveWidget(widgetType[0].widget).done(function (widgetModel) {
                          var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                                               false,
                              widgetCallback = widgetManifest ? widgetManifest.callback : false;
                          if (widgetCallback) {
                            require([widgetCallback], function (callback) {
                              if (callback && _.isFunction(callback)) {
                                widgetModel.type = widgetModel.id;
                                deferredEach.resolve(_.extend(widgetModel, new callback()));
                              } else {
                                deferredEach.reject();
                              }
                            }, function (error) {
                              log.warn('Failed to load callback. {0}', error);
                              deferredEach.reject(error);
                            });
                          } else {
                            deferredEach.resolve();
                          }
                        });
                        return deferredEach.promise();
                      })
                      .compact()
                      .value();
              $.whenAll.apply($, promises)
                  .then(function (results) {
                    deferred.resolve(_.compact(results));
                  });
              return deferred.promise();
            },

            initializeWidget: function (widgetWithCallback, perspectiveModel) {
              var deferred   = $.Deferred(),
                  widgets    = _.filter(this.perspectiveWidgets, function (widget) {
                    return widget.widget.type === widgetWithCallback.type;
                  }),
                  mode       = perspectiveModel.get('id') ? 'update' :
                               'create',
                  settings   = {
                    priority: parseInt(perspectiveModel.get('priority')) || undefined,
                    title: perspectiveModel.get('title') || '',
                    overrideType: perspectiveModel.get('overrideType'),
                    scope: perspectiveModel.get('scope') || '',
                    containerType: parseInt(perspectiveModel.get('containerType')) ||
                                   undefined,
                    perspectiveParentId: parseInt(perspectiveModel.get('override_id')) ||
                                         parseInt(perspectiveModel.get('perspectivesVolId')) ||
                                         undefined,
                    overrideObjId: parseInt(perspectiveModel.get('node')) || undefined,
                    assetContainerId: perspectiveModel.get('assetContainerId') || undefined
                  },
                  parameters = {
                    mode: mode,
                    widgets: widgets,
                    settings: settings,
                    connector: perspectiveModel.connector
                  };
              if (mode == 'update') {
                //TODO implement getPreviousWidgets for all perspectives other than flow perspective
                var previousPerspectiveWidgets = this.getPreviousWidgets &&
                                                 this.getPreviousWidgets(perspectiveModel);
                parameters.previousWidgets = _.filter(previousPerspectiveWidgets,
                    function (widget) {
                      return widget.widget.type === widgetWithCallback.type;
                    });
              }
              var callbackPromise = this.getHiddenWidgetOptions(widgetWithCallback, parameters),
                  that            = this;
              $.when(callbackPromise)
                  .done(_.bind(function (responseParameters) {
                    //TODO refactor the execution of retrieving and validating new widget options
                    /*var responseWidgets = (_.has(responseParameters, 'widgets')) ?
                                               responseParameters.widgets : [];

                        // iterate the returned widgets array to get new options
                        _.each(responseWidgets, _.bind(function (item) {
                          if (_.has(item, 'newOptions') && _.isObject(item.newOptions)) {
                            //TODO refactor with appropriate attributes
                            var existingObjPath = 'perspective' +
                                                  this.convertJSONPointerToPath(item.widgetBaseLocation),
                                existingObj     = this.getDeepProperty(perspectiveModel,
                                    existingObjPath);

                            // options before changes
                            item.oldOptions = _.deepClone(item.widget.options);
                            // iterate the widget options and remove any bogus properties that have not been defined in the widget's manifest
                            _.each(item.newOptions, function (value, key) {
                              var manifest=widgetWithCallback.get('manifest');
                              if (!_.has(manifest.schema.properties, key) ||
                                  !_.has(manifest.options.fields[key], 'hidden') ||
                                  !manifest.options.fields[key].hidden) {
                                delete(item.newOptions[key]);
                              }
                            });
                            // update the options
                            _.deepExtend(existingObj, item.newOptions);
                          }
                      }, this));*/
                    deferred.resolve();
                  }, this))
                  .fail(function (error) {
                    deferred.reject(error);
                  });
              return deferred.promise();
            },

            getHiddenWidgetOptions: function (widgetWithCallback, parameters) {
              var deferredOptions        = $.Deferred(),
                  deferredContainer      = $.Deferred(),
                  widgetPromises         = [],
                  errors                 = [],
                  ensureContainerPromise = deferredContainer.promise(), // note: no response argument - i.e. an empty promise
                  useOverrideContainer   = false;

              // check that the callback object is valid
              if (!widgetWithCallback || !_.has(widgetWithCallback, 'defineWidgetOptionsCommon') ||
                  !_.has(widgetWithCallback, 'defineWidgetOptionsEach')) {
                deferredOptions.reject();
                return deferredOptions.promise();
              }

              // the callback should have an ensureContainer() function that returns a promise
              if (_.has(widgetWithCallback, 'ensureContainer') &&
                  _.isFunction(widgetWithCallback.ensureContainer)) {
                // call ensureContainer() function to create a container in the assets volume
                if (widgetWithCallback.ensureContainer(parameters)) {
                  ensureContainerPromise = this.ensureContainer(parameters);
                } else {
                  useOverrideContainer = true;
                }
              } else {
                useOverrideContainer = true;
              }

              if (useOverrideContainer) {
                // no need to call ensureContainer(), so resolve with an empty promise
                deferredContainer.resolve();
              }

              $.when(ensureContainerPromise).done(function (response) {
                // when asset container is known to exist

                if (!_.has(parameters.settings, 'assetContainerId') ||
                    _.isUndefined(parameters.settings.assetContainerId)) {
                  // the assetContainerId is the id of where the asset will be added. e.g. either in the Perspective Assets Volume, or the container that the perspective overrides
                  var id = (response) ? response.id : parameters.settings.overrideObjId, // no response if ensureContainer was an empty promise
                      ac = {assetContainerId: id};

                  _.extend(parameters.settings, ac); // the containerId is required by the callback
                  // _.extend(PMan.perspective.perspectiveOut, ac);
                }

                var promiseBefore = widgetWithCallback.defineWidgetOptionsCommon(parameters);

                // check callback returns something that looks like a promise
                if (!promiseBefore || typeof promiseBefore != 'object' ||
                    !_.has(promiseBefore, 'state')) {
                  // looks like the callback didn't return a promise, so reject the deferred and return from this function immediately
                  deferredOptions.reject();
                  return deferredOptions.promise();
                }

                // when common options have been processed
                $.when(promiseBefore).done(function (commonOptions) {
                  if (_.has(parameters, 'widgets') && _.isArray(parameters.widgets)) {

                    _.each(parameters.widgets, function (item, index) {
                      // first add any common option properties

                      if (!_.has(item, 'newOptions')) {
                        item.newOptions = {};
                      }

                      _.extend(item.newOptions, commonOptions);

                      // next apply any widget-specific options
                      widgetPromises.push(widgetWithCallback.defineWidgetOptionsEach(item,
                          parameters));
                      $.when(widgetPromises[index])
                          .done(function (newOptions) {
                            _.extend(item.newOptions, newOptions);
                          })
                          .fail(function (errorMsg) {
                            errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                          });
                    });

                    // when all widgets have been processed
                    $.when.apply(this, widgetPromises)
                        .done(function () {
                          // all done
                          deferredOptions.resolve(parameters);
                        })
                        .fail(function (errorMsg) {
                          errors.push(errorMsg);
                          deferredOptions.reject(errors); // errors array returned to perspective manager
                        });
                  }

                })
                    .fail(function (errorMsg) {
                      errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                      deferredOptions.reject(errors);
                    });
              })
                  .fail(function (error) {
                    deferredContainer.reject(error);
                    // Also reject the deferredOptions promise so the error is reported
                    deferredOptions.reject([error]);
                  });

              return deferredOptions.promise();
            },

            ensureContainer: function (parameters) {
              // ensures that a container exists for perspective assets created by callbacks.

              var deferredContainer = $.Deferred();

              function uniqueId() {
                // using a timestamp alone does not guard against 2 users near-simultaneously attempting to create an asset container with the same name, whereas combination of timestamp and ~16 digit random suffix makes it practically impossible (1 in 1e+32)
                return _.now() + Math.random().toString().substring(2);
              }

              //TODO: update scenario: need to identify if an assetcontainer exists and what it's ID is (it might not, if e.g. the perspective didn't previously contain a wiki tile)
              if (_.has(parameters.settings, 'assetContainerId') &&
                  !isNaN(parseInt(parameters.settings.assetContainerId))) {
                // assetContainerId already exists, nothing to do
                // this is the case if there are more than one wiki tiles
                deferredContainer.resolve(false);
              } else {
                this.perspectiveAssetsVolume = new NodeModel(
                    {
                      id: 'volume',
                      type: 954
                    },
                    {
                      connector: parameters.connector
                    });
                this.perspectiveAssetsVolume.fetch().then(_.bind(function () {
                  var collectOptions = parameters.connector.extendAjaxOptions({
                    url: parameters.connector.connection.url + '/nodes',
                    type: 'POST',
                    data: {
                      type: 955,
                      parent_id: this.perspectiveAssetsVolume.get('id'),
                      name: 'assets_' + uniqueId()
                    },
                    success: function (response) {
                      deferredContainer.resolve(response);

                    },
                    error: function (error) {
                      deferredContainer.reject(error);
                    }
                  });

                  $.ajax(collectOptions).done(function (resp) {
                    deferredContainer.resolve(resp);
                  }).fail(function (resp) {
                    deferredContainer.reject(resp);
                  });
                }, this));
              }

              return deferredContainer.promise();
            }

            /*convertJSONPointerToPath: function (jpath) {
              // converts JSONPointer path notation to standard JS dotted/bracketed notation
              if (jpath) {
                var path = jpath.split('/');
                path = path.reduce(function (memo, item) {
                  if (Number(item)) {
                    return memo + '[' + item + ']';
                  } else {
                    return memo + '.' + item;
                  }
                });
                return path;
              }
            },

            getDeepProperty: function (obj, path) {
              // gets properties deep within an object, by passing in a path string 'key' in dotted form e.g. 'foo.bar.thing'
              var keys  = path.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./,
                      '').split('.'),
                  value = false;

              for (var i = 0, n = keys.length; i < n; i++) {
                var property = keys[i];
                if (property in obj) {
                  obj = obj[property];
                } else {
                  return;
                }
              }
              return obj;

            }*/

          });
        }
      };

      return PerspectiveEditMixin;
    });
csui.define('csui/perspectives/flow/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
  
csui.define('csui/perspectives/flow/impl/nls/root/lang',{
    tileLabel: 'Single Width',
    headerLabel: 'Double Width',
    fullpageLabel: 'Full Page'
  });
  


csui.define('css!csui/perspectives/flow/impl/flow.perspective',[],function(){});
// Loads widgets and renders them in a single row of grid cells
csui.define('csui/perspectives/flow/flow.perspective.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',

  'csui/controls/grid/grid.view', 'csui/utils/log',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/drag.drop/dnd.item.behaviour',
  'csui/behaviors/drag.drop/dnd.container.behaviour',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'i18n!csui/perspectives/flow/impl/nls/lang',
  'css!csui/perspectives/flow/impl/flow.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, GridView,
    log, WidgetContainerBehavior, DnDItemBehaviour, DnDContainerBehaviour, PerspectiveEditMixin,
    lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        },
        heights: {
          xs: 'full'
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      },
      widetile: {
        widths: {
          xs: 12,
          lg: 6
        }
      },
      tile: {
        widths: {
          xs: 12,
          sm: 6,
          md: 4,
          xl: 3
        }
      }
    }
  });

  var FlowPerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-flow-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

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
        // widgets in the grid should create their own model instead
        // of using the grid cell model
        model: undefined
      };
    },

    constructor: function FlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (options.perspectiveMode === 'edit') {
        this._prepareOptionsForEditMode(options);
        this.prepareForEditMode();
      }
      if (!options.collection) {
        var extWidgets = _.chain(config)
            .pick(function (value, key) {
              return key.indexOf('-widgets') >= 0;
            })
            .values()
            .flatten();

        if (extWidgets && extWidgets._wrapped && extWidgets._wrapped.length > 0) {
          options.widgets = _.filter(options.widgets, function (widget) {
            return _.contains(extWidgets._wrapped, widget.type);
          });
        }

        options.collection = this._createCollection(options);
      }
      GridView.prototype.constructor.call(this, options);
      if (options.perspectiveMode === 'edit') {
        this._registerEditEvents();
      }
    },

    /**
     * Add a empty placeholder at the end for new widgets to drop in edit mode
     */
    _prepareOptionsForEditMode: function (options) {
      options.widgets || (options.widgets = []);
      options.widgets.push({
        kind: 'tile',
        type: 'csui/perspective.manage/widgets/perspective.placeholder',
        className: 'csui-draggable-item-disable'
      });

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this
        },
        DnDItemBehaviour: { // For DnD widget
          behaviorClass: DnDItemBehaviour
        }
      };

      this._createDnDPlaceholderWidget();

      options.rowBehaviours = {
        DnDContainerBehaviour: {
          behaviorClass: DnDContainerBehaviour,
          placeholder: this._getDnDPlaceholder.bind(this),
          handle: '.csui-pman-widget-masking', // Limit re-ordering to mask (avoids callout popover),
          over: _.bind(function (event, ui) {
            var placeholderWidget = this._getDnDPlaceholder(ui.helper);
            var placeholder = ui.placeholder;
            // Update DnD placeholder with widget styles
            placeholder.attr('class', placeholderWidget.attr('class'));
            placeholder.html(placeholderWidget.html());
            placeholder.css('visibility', 'visible');
            // FIXME: Remove transfer data to placeholder. Instead set data to ui.item
            placeholder.data('pman.widget', ui.helper.data('pman.widget'));
          }, this),
          receive: _.bind(function (event, ui) {
            var newWidget = ui.placeholder.data('pman.widget'),
                index     = ui.item.index(); // this.$el.find('.binf-row >div').index(ui.item);

            var widget = {
              type: 'csui/perspective.manage/widgets/perspective.widget',
              kind: newWidget.get('manifest').kind,
              options: {
                options: {}, // To be used and filled by callout form
                widget: newWidget
              },
              view: this.pespectiveWidgetView
            };
            var self = this;
            var widgetUpdates = self._prepareGridCell(widget, index);
            var cells = self.collection.at(0).columns;
            cells.add(widgetUpdates, {at: index});
            ui.sender.sortable("cancel");
          }, this)
        }
      };
    },

    /**
     * Create a empty placeholder widget to be used to show as DnD watermark placeholder
     */
    _createDnDPlaceholderWidget: function () {
      var self              = this,
          placeholderWidget = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder',
          };
      this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
        self.dndPlaceholderCell = new GridView.CellView({
          grid: self,
          model: new Backbone.Model(self._createCell(placeholderWidget, resolvedWidget, 0))
        });
        self.dndPlaceholderCell.render();
      });

      this._resolveWidget({
        type: 'csui/perspective.manage/widgets/perspective.widget'
      }).done(function (resolvedWidget) {
        self.pespectiveWidgetView = resolvedWidget.get('view');
      });
    },

    /**
     * Prepare placeholder watermark for widget currently dropping
     */
    _getDnDPlaceholder: function (dragEl) {
      var widget = dragEl.data('pman.widget');
      if (!!widget) {
        var kind = widget.attributes.manifest.kind;
        if (!kind) {
          kind = config.defaultWidgetKind;
        }
        var sizes = config.widgetSizes[kind];
        // Update watermark widget with current droping widget sizes
        this.dndPlaceholderCell.model.set({
          sizes: sizes.widths,
          heights: sizes.heights
        });
      }
      return this.dndPlaceholderCell.$el;
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var cells = self.collection.at(0).columns;
        var model = widgetView.model;
        cells.remove(model);
      });

      this.listenTo(this, 'update:widget:size', function (widgetView, kind) {
        var sizes  = config.widgetSizes[kind],
            widget = widgetView.model.get('widget');
        widget.kind = kind;
        widgetView.model.set({
          sizes: sizes.widths,
          heights: sizes.heights,
          widget: widget
        });
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        // 'getPManPlaceholderWidget' Provided by pman.config.behaviour
        return;
      }
      var self = this;
      var cells = this.collection.at(0).columns;
      // Load new widget
      this._resolveWidget(widgetToReplace).done(function () {
        // Replace current widget with new widget
        if (currentWidget.model.get('widget').type !== self.getPManPlaceholderWidget().type) {
          // Preserve widget kind if dropping on existing widget
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = self._prepareGridCell(widgetToReplace,
            cells.indexOf(currentWidget.model));
        currentWidget.model.set(widgetUpdates);
        // Check if has any placeholders, otherwise add new placeholder widget
        var placeholderWidget = self.getPManPlaceholderWidget(),
            hasPlaceholders   = cells.filter(function (w) {
                  return w.get('widget').type === placeholderWidget.type;
                }).length > 0;
        if (!hasPlaceholders) {
          // Create a placeholder wiget to be able to drop new widgets
          self._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
            var newCell = self._createCell(placeholderWidget, resolvedWidget, cells.length);
            cells.add(newCell);
          });
        }
      });
    },

    _createCollection: function (options) {
      var rows = new Backbone.Collection();
      var uniqueWidgets = _.chain(options.widgets)
          .pluck('type')
          .unique()
          .map(function (id) {
            return {id: id};
          })
          .value();

      var resolvedWidgets = new WidgetCollection(uniqueWidgets);
      var self = this;

      this.widgetsResolved = resolvedWidgets
          .fetch()
          .then(function () {
            var firstRow = rows.add({});
            firstRow.columns = self._createColumns(options.widgets, resolvedWidgets);
          });
      return rows;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      var columns = _.map(widgets, function (widget, columnIndex) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return this._createCell(widget, resolvedWidget, columnIndex);
      }.bind(this));
      return new Backbone.Collection(columns);
    },

    _prepareGridCell: function (widgetConfig, columnIndex) {
      var kind = widgetConfig.kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        className: widgetConfig.className,
        widget: {
          cellAddress: 'grid0:r0:c' + columnIndex,
          type: widgetConfig.type,
          options: widgetConfig.options,
          view: widgetConfig.view,
          kind: kind
        }
      };
    },

    _createCell: function (widget, resolvedWidget, columnIndex) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (widgetView) {
        widget.view = widgetView;
        return this._prepareGridCell(widget, columnIndex);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      var sizes = config.widgetSizes[config.defaultWidgetKind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },

    /**
     * Returns supported widgets sizes(kinds) for given widget
     */
    getSupportedWidgetSizes: function (manifest, widget) {
      return _.map(manifest.supportedKinds, function (suppKind) {
        return {
          kind: suppKind,
          label: lang[suppKind + 'Label'],
          selected: widget.model.get('widget').kind === suppKind
        };
      });
    },

    serializePerspective: function (perspectiveModel) {
      var self         = this,
          deferred     = $.Deferred(),
          cells        = this.collection.at(0).columns,
          widgetModels = cells.filter(function (cell) {
            return cell.get('widget').type !==
                   'csui/perspective.manage/widgets/perspective.placeholder';
          });

      var widgetPromises = widgetModels.map(self.serializeWidget);
      $.whenAll.apply($, widgetPromises).done(function (results) {
        self.executeCallbacks(results, perspectiveModel).done(function () {
          deferred.resolve({
            type: 'flow',
            options: {
              widgets: _.map(results, function (result) {return result.widget;})
            }
          });
        }).fail(function (results) {
          // TODO Group errors
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }, this).fail(function (results) {
        // TODO Group errors
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });
      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.get('perspective'),
          previousWidgets = perspective &&
                            perspective.options ?
                            perspective.options.widgets :
          {};
      previousWidgets = _.map(previousWidgets, function (widget) {
        return {widget: widget};
      });
      return previousWidgets;
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  // TODO add mixin dynamically for edit mode only
  PerspectiveEditMixin.mixin(FlowPerspectiveView.prototype);
  return FlowPerspectiveView;

});

// Loads widgets and renders them in a grid
csui.define('csui/perspectives/grid/grid.perspective.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/grid/grid.view', 'csui/behaviors/widget.container/widget.container.behavior'
], function (module, _, $, Marionette, GridView, WidgetContainerBehavior) {

  var config = module.config();

  var GridPerspectiveView = GridView.extend({

    className: function () {
      var className = 'cs-perspective cs-grid-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
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

    constructor: function GridPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      var rows = options.rows;
      if (rows && rows.length > 0 && config.supportedWidgets) {
        var columns = rows[0].columns;
        rows[0].columns = _.filter(columns, function (column) {
          return _.contains(config.supportedWidgets, column.widget.type);
        });

        if( columns.length > 1 && config.widgetSizes ){
          _.each(columns, function (column) {
            column.sizes = config.widgetSizes;
            column.heights = {};
          });
        }
      }
      GridView.prototype.constructor.call(this, options);
    },

    enumerateWidgets: function (callback) {
      this._enumerateWidgetRow(this.options.collection, callback);
    },

    _enumerateWidgetRow: function (rows, callback) {
      rows.each(function (row) {
        row.columns.each(function (column) {
          var widget = column.get('widget');
          widget && callback(widget);
          if (column.rows) {
            this._enumerateWidgetRow(column.rows, callback);
          }
        }, this);
      }, this);
    },
  
    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return GridPerspectiveView;

});

csui.define('csui/utils/contexts/factories/browsing.states',['module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/models/browsing.state/browsing.states'
], function (module, $, Backbone, CollectionFactory, BrowsingStateCollection) {
  'use strict';

  var BrowsingStateCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'browsingStates',

    constructor: function BrowsingStateCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var browsingStates = this.options.browsingStates || {};
      if (!(browsingStates instanceof Backbone.Collection)) {
        var config          = module.config(),
            creationOptions = $.extend({}, config.options, browsingStates.options);
        browsingStates = new BrowsingStateCollection(browsingStates.models, creationOptions);
      }
      this.property = browsingStates;
    }

  });

  return BrowsingStateCollectionFactory;

});

csui.define('csui/pages/start/perspective.router',['csui/lib/backbone', 'csui/utils/contexts/factories/browsing.states'
], function (Backbone, BrowsingStateCollectionFactory) {
  'use strict';

  var PerspectiveRouter = Backbone.Router.extend({

    constructor: function PerspectiveRouter(options) {
      Backbone.Router.prototype.constructor.apply(this, arguments);

      // Save common options for descended routers
      this.context = options.context;
      this._routeWithSlashes = options.routeWithSlashes;
      this.browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);

      // Allow this router to react, before another router routes
      this.listenTo(this, 'other:route', this.onOtherRoute);
    },

    execute: function (callback, args) {
      // Inform the routing container, that a router is about to route
      this.trigger('before:route', this);
      return Backbone.Router.prototype.execute.apply(this, arguments);
    },

    navigate: function navigate(fragment, options) {
      var urlIncludedQuery = options && options.urlIncludedQuery;
      // Preserve query (carries application settings) and hash parts (carries
      // inside-page location); perspective routers use path only
      if (this._routeWithSlashes && urlIncludedQuery !== true) {
        // clear the metadata query parameters if they were set from metadata perspective
        var query = location.search;
        this.browsingStates && (query = this.browsingStates.clearMetadataParamsInUrlQuery(query));
        fragment += query + location.hash;
      }

      this.trigger('before:route', this);
      return Backbone.Router.prototype.navigate.call(this, fragment, options);
    }

  });

  return PerspectiveRouter;

});

csui.define('csui/utils/contexts/factories/application.scope.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ApplicationScopeModel = Backbone.Model.extend({});

  var ApplicationScopeModelFactory = ModelFactory.extend({

    propertyPrefix: 'applicationScope',

    constructor: function ApplicationScopeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var applicationScope = this.options.applicationScope || {};
      if (!(applicationScope instanceof Backbone.Model)) {
        var config = module.config();
        applicationScope = new ApplicationScopeModel(applicationScope.models, _.extend({},
            applicationScope.options, config.options));
      }
      this.property = applicationScope;
    }

  });

  return ApplicationScopeModelFactory;

});

csui.define('csui/utils/contexts/factories/user',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory,
    AuthenticatedUserModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var UserModelFactory = ModelFactory.extend({
    propertyPrefix: 'user',

    constructor: function UserModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var user = this.options.authentication || this.options.user || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = user.initialResponse || config.initialResponse;
      }
      if (!(user instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options);
        user = new AuthenticatedUserModel(user.attributes || config.attributes,
            _.defaults({
              connector: connector
            }, user.options, config.options));
      }
      this.property = user;
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return UserModelFactory;
});

csui.define('csui/pages/start/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/pages/start/nls/root/lang',{
  UserTitle:   "OpenText Content Server",
  NodeTitle:   "{0}",
  SearchTitle: "Searching for \"{0}\""
});


csui.define('csui/pages/start/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/pages/start/impl/nls/root/lang',{
  UserLoadingTitle: "Loading current user...",
  NodeLoadingTitle: "Loading {0}...",
  Home: 'Home',
  mainNavigationAria: 'Main navigation',
  profileMenuTitle: 'Profile Menu',
  profileMenuAria: 'Profile Menu of {0}',
  profileImageAlt: 'Profile Menu of {0}'
});


csui.define('csui/pages/start/impl/landing.perspective.router',['csui/lib/underscore', 'csui/utils/base',
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/user', 'i18n!csui/pages/start/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang'
], function (_, base, PerspectiveRouter, ApplicationScopeModelFactory,
    UserModelFactory, publicLang, lang) {
  'use strict';

  var LandingPerspectiveRouter = PerspectiveRouter.extend({

    routes: {
      '*other': 'openLandingPerspective'
    },

    constructor: function LandingPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._updateHomeUrl);

      this.user = this.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change:id', this._updatePageTitle);
    },

    openLandingPerspective: function () {
      this._updatePageTitle();
      this.applicationScope.set('id', '');
    },

    _updateHomeUrl: function () {
      // Empty scope means landing page
      if (this.applicationScope.id) {
        return;
      }
      this.navigate('');
      this._updatePageTitle();
    },

    _updatePageTitle: function () {
      if (this.applicationScope.id === "") {
        document.title = !this.user.has('name') ? lang.UserLoadingTitle :
                         _.str.sformat(publicLang.UserTitle, base.formatMemberName(this.user));
      }
    }

  });

  return LandingPerspectiveRouter;

});


// Route hash-bang URLs to contextual object changes and the other way round
csui.define('csui/pages/start/perspective.routing',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/pages/start/impl/perspective.router',
  'csui/pages/start/impl/landing.perspective.router',
  // Load external routers working with perspective context
  'csui-ext!csui/pages/start/perspective.routing'
], function (module, _, Backbone, Url, PerspectiveRouter,
    LandingPerspectiveRouter, extraRouters) {
  'use strict';
  var instance,
      config = _.extend({
    developmentPage: !PerspectiveRouter.routesWithSlashes(),
    handlerUrlPathSuffix: '/app',
    rootUrlPath: null
  }, module.config());

  function PerspectiveRouting(options) {
    // Later added routers override the earlier ones;
    // put the landing page router to the front
    var Routers = _
            .chain(extraRouters)
            .flatten(true)
            .concat([LandingPerspectiveRouter])
            .unique()
            .reverse()
            .value(),
        routeWithSlashes = PerspectiveRouting.routesWithSlashes();
    this._routers = _.map(Routers, function (Router) {
      var router = new Router(_.extend({
        routeWithSlashes: routeWithSlashes
      }, options));
      router.on('before:route', _.bind(this._informOthers, this));
      return router;
    }, this);

    this._context = options.context;
    this._originalHistoryLength = history.length;
  }

  _.extend(PerspectiveRouting.prototype, Backbone.Events, {

    start: function () {
      // Start the client application URL router
      var historyOptions;
      if (PerspectiveRouting.routesWithSlashes()) {
        historyOptions = {
          pushState: true,
          // The application should configure root of their slash-based path.
          // Otherwise it will be inferred from the current location, which
          // will be handled as an OTCS CGI URL.
          root: config.rootUrlPath != null && config.rootUrlPath ||
                Url.combine(
                  new Url(new Url(location.pathname).getCgiScript()).getPath(),
                  config.handlerUrlPathSuffix)
        };
      } else {
        // The current location path is the default root. However, the
        // Backbone.history.atRoot() returns true, only if the root is
        // set explicitly.  Probably a Backbone bug.
        historyOptions = {
          root: location.pathname
        };
      }
      Backbone.history.start(historyOptions);
    },

    hasRouted: function () {
      return history.length > this._originalHistoryLength;
    },

    _informOthers: function (akceptor) {
      _.each(this._routers, function (router) {
        if (router !== akceptor) {
          router.trigger('other:route', router, akceptor);
        }
      });
    }
  });

  PerspectiveRouting.routesWithSlashes = PerspectiveRouter.routesWithSlashes;

  return {
    //The is made singleton as the "hasRouted()" functionality will be helpful for widgets
    //to verify whether to display back button or not (Eg:SearchResultsHeaderView)
    getInstance: function (options) {
      if (!instance) {
        instance = new PerspectiveRouting(options);
      }
      return instance;
    },
    routesWithSlashes: PerspectiveRouter.routesWithSlashes
  };
});

csui.define('csui/utils/contexts/factories/node',[
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model', 'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var NodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'node',

    constructor: function NodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var node = this.options.node || {},
          config = module.config();
      if (!(node instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              // Do not waste server resources; it returns all it can by default
              fields: {
                properties: []
              },
              // Command enabling for shortcuts needs the original node info
              expand: {
                properties: ['original_id']
              },
              // Command enabling needs permitted actions
              commands: commands.getAllSignatures()
            }, config.options, node.options);
        // Next node can be fetshed just like node; keep their defaults in sync
        node = new NodeModel(node.attributes || config.attributes,
            creationOptions);
      }
      this.property = node;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return NodeModelFactory;
});

csui.define('csui/pages/start/impl/node.perspective.router',[
  'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/next.node', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model', 'csui/utils/contexts/factories/browsing.states',
  'csui/utils/contexts/factories/application.scope.factory',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (_, PerspectiveRouter, NextNodeModelFactory, NodeModelFactory, NodeModel,
    BrowsingStateCollectionFactory, ApplicationScopeModelFactory, publicLang, lang) {
  'use strict';

  var NodePerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'nodes/:id': 'openNodePerspective',
      'nodes/:id/versions/:ver': 'openNodeVersionPerspective'
    },

    constructor: function NodePerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.nextNode = this.context.getModel(NextNodeModelFactory);
      this.listenTo(this.nextNode, 'change:id', this._updateNodeUrl);
      // As long as perspective context fetches nextNode directly, it is
      // easier to listen to its changes, than for the contextual node
      this.listenTo(this.nextNode, 'change:name', this._updatePageTitle);

      this.browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      this.listenTo(this.browsingStates, 'state:change', this._browsingStateUpdateUrl);
      this.listenTo(this.browsingStates, 'update:title', this._browsingStateUpdateTitle);
    },

    openNodePerspective: function (id, query) {
      var nodeId = id;
      if (NodeModel.usesIntegerId) {
        nodeId = parseInt(nodeId);
      }
      this._resetBrowsingData({node_id: nodeId}, query || '');
      this._openNodePerspective(nodeId);
    },

    openNodeVersionPerspective: function (id, version, query) {
      var nodeId = id;
      var versionNum = version;
      if (NodeModel.usesIntegerId) {
        nodeId = parseInt(nodeId);
        versionNum = parseInt(versionNum);
      }
      this._resetBrowsingData({node_id: nodeId, version_num: versionNum}, query || '');
      this._openNodePerspective(nodeId);
    },

    _openNodePerspective: function (id) {
      if (this.nextNode.get('id') === id) {
        // when id is same as nextNode's id, nextNode.set(id) event is not triggered
        this.nextNode.unset('id', {silent: true});
      }
      this.nextNode.set('id', id);
    },

    onOtherRoute: function () {
      this.nextNode.clear({silent: true});
      this._resetBrowsingData();
      this.url = undefined;
    },

    _resetBrowsingData: function (path, query) {
      this.browsingStates.resetAll({silent: true});
      this.url = {path: path, query: query};
    },

    _setBrowsingStates: function () {
      var nodeId = this.nextNode.get('id');
      this.url = this.url || {};
      this.url.path = this.url.path || {};
      this.url.path.node_id = nodeId;
      this.url.path.node_name = this._getNodeName();

      this.browsingStates.setBrowsingStates(this.url.path, this.url.query);
      this.url = undefined;
    },

    _updateNodeUrl: function () {
      var url = 'nodes/' + this.nextNode.get('id');

      // on nextNode change:id event coming from a different perspective route, query is not set
      if (this.url === undefined) {
        var urlUpdateMode = this.browsingStates.allowUrlUpdate;
        this.browsingStates.resetAll({silent: true});
        this._setBrowsingStates();
        if (urlUpdateMode) {
          // coming from metadata perspective, clear metadata params and preserve other query params
          url = this.browsingStates.getUrlPathWithQuery();
          this.navigate(url, {urlIncludedQuery: true});
        } else {
          // normal node routing mode
          this.navigate(url);
        }
      } else {
        // normal node routing mode including metadata
        this._setBrowsingStates();
        url = this.browsingStates.getUrlPathWithQuery();
        this.navigate(url, {urlIncludedQuery: true});
      }

      this._updatePageTitle();
    },

    _browsingStateUpdateUrl: function () {
      if (this.applicationScope.get('id') !== 'node' || !this.browsingStates.allowUrlUpdate) {
        return;
      }

      var url = '';
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      var nodeId = (path && path.node_id) || this.nextNode.get('id');
      if (nodeId !== undefined) {
        var currentNode = this.context.getObject(NodeModelFactory);
        if (currentNode && currentNode.get('id') !== nodeId) {
          currentNode.clear({silent: true});
          currentNode.fetched = false;
          currentNode.set('id', nodeId, {silent: true});
          // trigger event to update breadcrumbs
          this.context.trigger('current:folder:changed');
        }
        url = this.browsingStates.getUrlPathWithQuery();
      }
      this.navigate(url, {urlIncludedQuery: true});

      if (nodeId !== undefined) {
        this._updatePageTitle((path && path.node_name) || undefined);
      } else {
        // landing page or something else
        this._updatePageTitle(publicLang.UserTitle);
      }
    },

    _browsingStateUpdateTitle: function () {
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      (path && path.node_name) && this._updatePageTitle(path.node_name);
    },

    _updatePageTitle: function (title) {
      if (title && title.length > 0) {
        document.title = _.str.sformat(publicLang.NodeTitle, title);
        return;
      }
      var nodeName = this._getNodeName();
      document.title = _.str.sformat(publicLang.NodeTitle, nodeName);

      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      path && (path.node_name = nodeName);
    },

    _getNodeName: function () {
      var name = !this.nextNode.has('name') ?
                 _.str.sformat(lang.NodeLoadingTitle, this.nextNode.get('id')) :
                 this.nextNode.get('name');
      return name;
    }
  });

  return NodePerspectiveRouter;
});

csui.define('csui/pages/start/impl/search.perspective.router',[
  'module', 'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/search.query.factory',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (module, _, PerspectiveRouter, SearchQueryModelFactory, publicLang, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    showTitle: true
  });

  var SearchPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'search/*path': 'openSearchPerspective'
    },

    constructor: function SearchPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.searchQuery = this.context.getModel(SearchQueryModelFactory);
      this.listenTo(this.searchQuery, 'change', this._updateSearchUrl);
      this.listenTo(this.searchQuery, 'change', this._updatePageTitle);
    },

    openSearchPerspective: function (path) {
      // convert the path made of 'name/value' pairs to {name; value} map
      var name,
          parameters = _.reduce(path.split('/'), function (result, item) {
            if (name) {
              result[name] = item != null ? decodeURIComponent(item).trim() : '';
              name = undefined;
            } else {
              name = decodeURIComponent(item);
            }
            return result;
          }, {});
      this._updatePageTitle();

      // if context is coming from CVS then do 'silent:true' otherwise keep it false , to avoid
      // double call to _fetchSearchPerspective().
        this.searchQuery.set(parameters, {silent: !!this.searchQuery.get('query_id')});
    },

    onOtherRoute: function () {
      this.searchQuery.clear({silent: true});
    },

    _updateSearchUrl: function () {
      // format the path using the {name; value} map to 'name/value' pairs
      var url = this.routerURL(this.searchQuery);
      this.navigate(url);
      this._updatePageTitle();
    },

    _updatePageTitle: function () {
      if(config.showTitle) {
        document.title = _.str.sformat(publicLang.SearchTitle, this.searchQuery.get('where'));
      }
    },

    // Overriding this to pass the encoded url fragment to the 'openSearchPerspective' .
    // This is to ensure correct functionality even in the case of the search value containing '/' symbols.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        return param ? param : null;
      });
    }
  });

  SearchPerspectiveRouter.prototype.routerURL =  function(searchQuery){
    var url = _.reduce(searchQuery.attributes, function (result, value, name) {
      if (value) {
        result += '/' + encodeURIComponent(name) + '/' + encodeURIComponent(value);
      } else {
        result += '/' + encodeURIComponent(name) + '/' + '%20';
      }
      return result;
    }, 'search');
    return url;
  };

  return SearchPerspectiveRouter;
});

csui.define('csui/utils/classic.nodes/impl/core.classic.nodes',[],function () {
  'use strict';

  return [
    // Discussion
    {
      equals: {type: 215},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Discussion Topic or Reply
    {
      equals: {type: [130, 134]},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          show: 1,
          nexturl: location.href
        };
      }
    },
    // Task
    {
      equals: {type: 206},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTask',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Task List
    {
      equals: {type: 204},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskList',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Task Group
    {
      equals: {type: 205},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskGroup',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Milestone
    {
      equals: {type: 212},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseMilestone',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Channel
    {
      equals: {type: 207},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewChannel',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // News
    {
      equals: {type: 208},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewNews',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Poll
    {
      equals: {type: 218},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'OpenPoll',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Form
    {
      equals: {type: 223},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'EditForm',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // LiveReport
    {
      equals: {type: 299},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'RunReport',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    // Prospector
    {
      equals: {type: 384},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ProspectorBrowse',
          objId: node.get('id'),
          order: '-SCORE',
          summaries: 1,
          nexturl: location.href
        };
      }
    },
    // follow up
    {
      equals: {type: 31214},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'addresubmission',
          RS_FUNCTION: 'Edit',
          RSID: node.get('followup_id'),
          objId: node.get('location_id'),
          nexturl: location.href
        };
      }
    }
  ];
});

csui.define('csui/utils/content.helper',[
  'csui/utils/url', 'csui/models/version'
], function (Url, VersionModel) {
  'use strict';

  function getContentPageUrl (node) {
    var cgiUrl = new Url(node.connector.connection.url).getCgiScript();
    var urlQuery = {
      func: 'doc.fetchcsui',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel) {
      urlQuery.vernum = node.get('version_number');
    }
    return Url.appendQuery(cgiUrl, Url.combineQueryString(urlQuery));
  }

  return {
    getContentPageUrl: getContentPageUrl
  };
});

csui.define('csui/utils/handlebars/l10n',['csui/lib/handlebars', 'csui/utils/base'
], function (Handlebars, base) {

  Handlebars.registerHelper('csui-l10n', function (value) {
    return base.getClosestLocalizedString(value);
  });

  return Handlebars.helpers['csui-l10n'];

});

csui.define('csui/utils/impl/core.defaultactionitems',[
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/smart.nodes/smart.nodes'
], function (classicNodes, smartNodes) {
  'use strict';

  return [
    // Document and Generation
    // TODO: Move Drawing to its module
    {
      equals: {type: [144, 736, 2]},
      signature: 'Open',
      sequence: 10
    },
    // URL
    {
      type: 140,
      signature: 'Navigate',
      sequence: 30
    },
    // Saved Search Query
    {
      type: 258,
      signature: 'ExecuteSavedQuery',
      sequence: 30
    },
    // Nodes forced to be opened in Classic UI
    {
      signature: 'OpenSpecificClassicPage',
      sequence: 600,
      decides: function (node) {
        return classicNodes.isForced(node);
      }
    },
    // Nodes, which should have just their perspective open in Smart UI
    {
      signature: 'OpenSpecificNodePerspective',
      sequence: 800,
      decides: function (node) {
        return smartNodes.isSupported(node);
      }
    }
  ];
});

csui.define('csui/utils/node.links/impl/core.node.links',[
  'csui/utils/url'
], function (Url) {
  'use strict';

  return [
    {
      equals: {
        type: 140
      },
      getUrl: function (node) {
        return node.get('url');
      }
    },
    {
      equals: {
        type: 258
      },
      getUrl: function (node) {
        return Url.combine('search/query_id/', node.get('id'));
      }
    },
    {
      getUrl: function (node) {
        return Url.combine('nodes/', node.get('id'));
      }
    }
  ];
});

csui.define('csui/utils/open.authenticated.page',[
  'csui/lib/jquery', 'csui/utils/url'
], function ($, Url) {
  'use strict';

  function openAuthenticatedPage (connector, url, options) {
    options || (options = {});
    var content = options.window || (options.openInNewTab === false ?
        window : window.open('', '_blank'));
    var cgiUrl = new Url(connector.connection.url).getCgiScript();
    var ticket = connector.connection.session.ticket;

    $('<form>')
        .attr('method', "post")
        .attr('action', cgiUrl)
        .append($('<input>', {
          'name': 'func',
          'value': 'csui.authenticate',
          'type': 'hidden'
        }))
        .append($('<input>', {
          'name': 'otcsticket',
          'value': ticket,
          'type': 'hidden'
        }))
        .append($('<input>', {
          'name': 'nexturl',
          'value': url,
          'type': 'hidden'
        }))
        .appendTo(content.document.body)
        .submit();

    return $.Deferred().resolve().promise();
  }

  return openAuthenticatedPage;
});

csui.define('csui/utils/smart.nodes/impl/core.smart.nodes',[],function () {
  'use strict';

  return [
    // Containers - browse children by default
    {
      equals: {container: true},
      sequence: 1000
    }
  ];
});

csui.define('csui/models/node/node.addable.type.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.collection'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAddableTypeCollection) {

  var AddableTypeCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'addableTypes',

    constructor: function AddableTypeCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var addableTypes = this.options.addableTypes || {};
      if (!(addableTypes instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        addableTypes = new NodeAddableTypeCollection(addableTypes.models,
            _.defaults(
                {
                  // Prefer refreshing the entire collection after re-fetching it
                  // to improve rendering performance
                  autoreset: true
                },
                addableTypes.options,
                config.options,
                // node is intentionally listed at the end to give previous options preference
                {node: node}
            ));
      }
      this.property = addableTypes;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return AddableTypeCollectionFactory;

});

csui.define('csui/utils/contexts/context',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base', 'csui/utils/log'
], function (_, $, Backbone, Marionette, base, log) {
  'use strict';

  var Context = Marionette.Controller.extend({

    constructor: function Context(options) {
      this.cid = _.uniqueId('context');
      Marionette.Controller.prototype.constructor.apply(this, arguments);
      this._factories = {};
      // Prevent pre-set attributes to take part in unique object prefixes;
      // global options passed to all factories are only for initializing
      _.each(this.options.factories, function (object, key) {
        object.internal = true;
      });
    },

    // Offer an intuitive interface; when a model is needed, use getModel, when a collection
    // is needed, use getCollection, and when other object is needed, use getObject
    getModel: getObject,      // NodeModel, e.g.
    getCollection: getObject, // FavoriteCollection, e.g.
    getObject: getObject,     // Connector, e.g.

    // Offer an intuitive interface; when a model is needed, use hasModel, when a collection
    // is needed, use hasCollection, and when other object is needed, use hasObject
    hasModel: hasObject,      // NodeModel, e.g.
    hasCollection: hasObject, // FavoriteCollection, e.g.
    hasObject: hasObject,     // Connector, e.g.

    getFactory: function (Factory, options) {
      return this._getFactory(Factory, options, true);
    },

    clear: function (options) {
      log.info('Clearing the context started.') && console.log(log.last);
      this.triggerMethod('before:clear', this);
      if (options && options.all) {
        this._destroyAllFactories();
      } else {
        this._destroyNonPermanentFactories();
      }
      log.info('Clearing the context succeeded.') && console.log(log.last);
      this.triggerMethod('clear', this);
      return this;
    },

    fetch: function (options) {
      log.info('Fetching the context started.') && console.log(log.last);
      this.triggerMethod('request', this);
      this._destroyTemporaryFactories();
      var self = this,
          promises = _.chain(this._factories)
              .filter(function (factory) {
                return self._isFetchable(factory);
              })
              .map(function (factory) {
                var clonedOptions = options ? _.clone(options) : {};
                return factory.fetch(clonedOptions);
              })
              .compact()
              .value();
      return $.when
          .apply($, promises)
          .then(function () {
            log.info('Fetching the context succeeded.') && console.log(log.last);
            self.triggerMethod('sync', self);
          }, function (request, statusText, messageText) {
            var error = new base.Error(request);
            log.error('Fetching the context failed: {0}', error) &&
            console.error(log.last);
            self.triggerMethod('error', error);
            return $.Deferred().reject(error);
          });
    },

    _isFetchable: function (factory) {
      if (factory.options.detached) {
        return false;
      }
      if (factory.isFetchable) {
        return factory.isFetchable();
      }
      return !!factory.fetch;
    },

    _destroyTemporaryFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options.temporary) {
          factory.destroy();
        } else {
          return true;
        }
      }, this);
    },

    _destroyNonPermanentFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options && factory.options.permanent) {
          return true;
        } else {
          factory.destroy();
        }
      }, this);
    },

    _destroyAllFactories: function () {
      _.each(this._factories, function (factory) {
        factory.destroy();
      });
      this._factories = {};
    },

    _getPropertyName: function (Factory, options) {
      options || (options = {});
      // Pre-initializing the model with its type or id will make it unique in the context
      var attributes = options.attributes || {};

      // Stamp globally unique factory names by an artificial attribute
      if (options.unique) {
        attributes = _.extend({
          stamp: _.uniqueId()
        }, attributes);
      }
      return _.reduce(attributes, function (result, value, key) {
        if (value == null) {
          return result;
        }
        return result + '-' + key + '-' + value;
      }, Factory.prototype.propertyPrefix);
    },

    _getFactory: function (Factory, options, createIfNotFound) {
      // Support getting objects by the factory name, if the factory object
      // cannot be required as a dependency
      if (typeof Factory === 'string') {
        return this._factories[Factory];
      }
      options || (options = {});
      // Factories expect their options in a property named with their prefix; options for all
      // factories are together to allow passing options to nested factories
      var propertyPrefix = Factory.prototype.propertyPrefix,
          globalOptions = this.options.factories || {},
          objectOptions, nameOptions, factoryOptions;
      // Calls outside the factories can pass options.  Further calls to nested factories include
      // options from the context constructor already; do not extend the options in that case.
      if (options.internal) {
        objectOptions = options[propertyPrefix];
        // It is not possible to use the pre-initializing of the factory
        // properties for nested factories.  It works only on the first
        // level - for the caller outside the context constructor.
        if (objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          // Limit the parameters to the only object useful for the _getPropertyName
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      } else {
        // The caller outside the factories does not need to wrap the options in the factory
        // prefix key; we do it here for their convenience
        objectOptions = options[propertyPrefix];
        // If no factory options were passed in, let the context ctor options merge in
        if (objectOptions === undefined && !_.isEmpty(options)) {
          // Merge this factory options from context constructor with getObject arguments
          factoryOptions = _.omit(options,
              'detached', 'permanent', 'temporary', 'unique');
          if (!_.isEmpty(factoryOptions)) {
            options[propertyPrefix] = _.defaults(factoryOptions, globalOptions[propertyPrefix]);
          }
        }
        _.defaults(options, {
          internal: true
        }, globalOptions);
        // Prefer the attributes passed to the getObject method directly
        // to the attributes passed via the factory-specific options.
        // If the factory-specific options are a Backbone model, it is
        // the scenario pre-initializing the factory properties and the
        // explicit attributes are mandatory then.
        nameOptions = {
          attributes: options.attributes,
          unique: options.unique
        };
        if (!nameOptions.attributes && objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          // Limit the parameters to the only object useful for the _getPropertyName
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      }
      // The property name for the factory is computed just from its options
      var propertyName = this._getPropertyName(Factory, nameOptions),
          factory = this._factories[propertyName];
      if (!factory && createIfNotFound) {
        options.factoryName = propertyName;
        factory = new Factory(this, options);
        this._factories[propertyName] = factory;
      }
      return factory;
    }

  });

  function getObject(Factory, options) {
    var factory = this._getFactory(Factory, options, true);
    return factory.property;
  }

  function hasObject(Factory, options) {
    return !!this._getFactory(Factory, options, false);
  }

  return Context;

});

csui.define('csui/utils/contexts/context.plugin',[
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  function ContextPlugin(options) {
    this.context = options.context;
  }

  _.extend(ContextPlugin.prototype, Backbone.Events, {
    // Called when a factory is questioned if it is fetchable; it will be
    // considered fetchable, unless this method returns false
    isFetchable: function (factory) {}
  });

  ContextPlugin.extend = Backbone.Model.extend;

  return ContextPlugin;
});

csui.define('csui/utils/contexts/impl/node.opening.context',[
  'csui/utils/contexts/context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/node.links/node.links',
  'csui/utils/contexts/factories/user'
], function (Context, ConnectorFactory, NextNodeModelFactory,
    nodeLinks, UserModelFactory) {
  'use strict';

  // FIXME: Copied from node perspective context plugin.
  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var NodeOpeningContext = Context.extend({
    constructor: function NodeOpeningContext(options) {
      Context.prototype.constructor.apply(this, arguments);

      this.connector = this.getObject(ConnectorFactory, {
        permanent: true,
        detached: true
      });
      this.user = this.getModel(UserModelFactory, {
        permanent: true
      });
      this.nextNode = this.getModel(
          NextNodeModelFactory, {
            options: nodeOptions,
            permanent: true,
            detached: true
          })
          .on('change:id', this.onNextNodeChanged, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             // The user model should be fetched only at the beginning
             (factory.property !== this.user || !this.user.get('id'));
    },

    openNodePage: function (node) {
      this.triggerMethod('before:open:page', this, this.nextNode);
      window.open(nodeLinks.getUrl(node));
    }
  });

  return NodeOpeningContext;
});

csui.define('csui/utils/contexts/factories/previous.node',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, NodeModel) {
  'use strict';

  var PreviousNodeModelFactory = ModelFactory.extend({

    propertyPrefix: 'previousNode',

    constructor: function PreviousNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var connector = context.getObject(ConnectorFactory, options),
          config = module.config();
      this.property = new NodeModel(undefined,
          _.defaults({
            connector: connector
          }, config.options));
    }

  });

  return PreviousNodeModelFactory;

});


csui.define('csui/utils/contexts/browsing/browsing.context',[
  'require', 'csui/lib/underscore',
  'csui/utils/contexts/impl/node.opening.context',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/previous.node',
  'csui-ext!csui/utils/contexts/browsing/browsing.context'
], function (require, _, NodeOpeningContext, NodeModelFactory,
    PreviousNodeModelFactory, contextPlugins) {
  'use strict';

  // FIXME: Copied from node perspective context plugin.
  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var BrowsingContext = NodeOpeningContext.extend({
    constructor: function BrowsingContext(options) {
      NodeOpeningContext.prototype.constructor.apply(this, arguments);

      this.on('request', this._changeNode, this);

      this.previousNode = this.getModel(PreviousNodeModelFactory, {
        permanent: true,
        detached: true
      });
      this.node = this.getModel(NodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    _isFetchable: function (factory) {
      return NodeOpeningContext.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    onNextNodeChanged: function () {
      // Setting just node ID to nextNode will try to drill down;
      // non-containers are handled by opening a new window, but
      // need passing more node attributes to nextNode
      if (this.nextNode.get('container') !== false) {
        this.enterContainer();
      } else {
        this.openNewNodePage();
      }
    },

    openNewNodePage: function () {
      this.openNodePage(this.nextNode);
      this.nextNode.clear({silent: true});
    },

    enterContainer: function () {
      this.triggerMethod('before:enter:container', this, this.nextNode);
      this.nextNode
          .fetch()
          .then(function () {
            this._enteringContainer = true;
            return this.fetch();
          }.bind(this))
          .fail(function (error) {
            csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
              ModalAlert.showError(error.toString());
            });
          });
    },

    _changeNode: function () {
      if (this._enteringContainer) {
        this.previousNode.clear({silent: true});
        this.previousNode.set(this.node.attributes);
        this.node.clear({silent: true});
        this.node.set(this.nextNode.attributes);
        this.nextNode.clear({silent: true});
        this._enteringContainer = false;
      }
    },

    fetch: function () {
      var parameters = Array.prototype.slice.apply(arguments),
          self = this;

      function continueFetching () {
        NodeOpeningContext.prototype.fetch.apply(self, parameters);
      }

      if (!this._enteringContainer && this.node.isFetchable()) {
        this.triggerMethod('before:enter:container', this, this.node);
        return this.node
            .fetch()
            .then(continueFetching);
      }
      return continueFetching();
    }
  });

  return BrowsingContext;
});


csui.define('csui/utils/contexts/page/page.context',[
  'csui/lib/underscore', 'csui/utils/contexts/context',
  'csui-ext!csui/utils/contexts/page/page.context'
], function (_, Context, contextPlugins) {
  'use strict';

  var PageContext = Context.extend({
    constructor: function PageContext() {
      Context.prototype.constructor.apply(this, arguments);

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    }
  });

  return PageContext;
});


csui.define('csui/utils/contexts/portal/portal.context',[
  'csui/lib/underscore', 'csui/utils/contexts/impl/node.opening.context',
  'csui-ext!csui/utils/contexts/portal/portal.context'
], function (_, NodeOpeningContext, contextPlugins) {
  'use strict';

  var PortalContext = NodeOpeningContext.extend({
    constructor: function PortalContext(options) {
      NodeOpeningContext.prototype.constructor.apply(this, arguments);

      // Keep the same order as in perspective context
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    _isFetchable: function (factory) {
      return NodeOpeningContext.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    onNextNodeChanged: function () {
      this.openNewNodePage();
    },

    openNewNodePage: function () {
      this.openNodePage(this.nextNode);
      this.nextNode.clear({silent: true});
    }
  });

  return PortalContext;
});

csui.define('csui/utils/contexts/perspective/perspective.context.plugin',[
  'csui/utils/contexts/context.plugin'
], function (ContextPlugin) {
  'use strict';

  var PerspectiveContextPlugin = ContextPlugin.extend({
    // Called when the context is constructed, when the application is starting
    onCreate: function () {},

    // Called when the context is cleared, when a new perspective is loading
    onClear: function () {},

    // Called when the context is going to be re-fetched, because the current
    // perspective did not change
    onRefresh: function () {},
  });

  return PerspectiveContextPlugin;
});


csui.define('csui/utils/contexts/perspective/landing.perspectives',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/landing.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var UserPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function UserPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(UserPerspectiveModel.prototype);

  var UserPerspectiveCollection = Backbone.Collection.extend({

    model: UserPerspectiveModel,
    comparator: "sequence",

    constructor: function UserPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByUser: function (user) {
      return this.find(function (item) {
        return item.matchRules(user, item.attributes);
      });
    }

  });

  var userPerspectives = new UserPerspectiveCollection([
    {
      // default landing page
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/user.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    userPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return userPerspectives;

});

csui.define('csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',['csui/lib/underscore', 'csui/utils/log',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/landing.perspectives'
], function (_, log, UserModelFactory, ApplicationScopeModelFactory,
    PerspectiveContextPlugin, landingPerspectives) {
  'use strict';

  var LandingPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function LandingPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory)
          .on('change', this._fetchLandingPerspective, this);
      this.userFactory = this.context.getFactory(UserModelFactory);
      this.user = this.userFactory.property;
    },

    _fetchLandingPerspective: function () {
      // Empty scope means landing page
      if (this.applicationScope.id) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      // Use the factory to allow pre-fetching data from the page.
      this.userFactory.fetch({
        success: _.bind(this._changePerspective, this, this.user),
        error: _.bind(this.context.rejectPerspective, this.context)
      });
    },

    _changePerspective: function (sourceModel) {
      var perspectiveModule,
          perspective = landingPerspectives.findByUser(sourceModel);
      // Let override landing page on the client side
      if (_.isEmpty(sourceModel.get('perspective')) || perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }
      this.context.applyPerspective(sourceModel);
    }

  });

  return LandingPerspectiveContextPlugin;

});


csui.define('csui/utils/contexts/perspective/node.perspectives',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/node.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var NodePerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function NodePerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(NodePerspectiveModel.prototype);

  var NodePerspectiveCollection = Backbone.Collection.extend({

    model: NodePerspectiveModel,
    comparator: "sequence",

    constructor: function NodePerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var nodePerspectives = new NodePerspectiveCollection([
    {
      // saved search query
      equals: {type: 258},
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',
      sequence: 100
    },
    {
      // document
      equals: {type: 144},
      important: true,
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/document.overview.json',
      sequence: 100
    },
    {
      // node container
      equals: {container: true},
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/container.json',
      sequence: 1000
    },
    {
      // default node
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/metadata.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    nodePerspectives.add(_.flatten(extraPerspectives, true));
  }

  return nodePerspectives;

});

csui.define('csui/utils/contexts/perspective/impl/node.perspective.context.plugin',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/browsing.states',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/classic.nodes/classic.nodes'
], function (_, Backbone, log, NodeModelFactory,
    NextNodeModelFactory, PreviousNodeModelFactory,
    ApplicationScopeModelFactory, BrowsingStateCollectionFactory,
    PerspectiveContextPlugin, nodePerspectives, classicNodes) {
  'use strict';

  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var NodePerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function NodePerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);
      this.nextNodeFactory = this.context.getFactory(NextNodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });
      this.nextNode = this.nextNodeFactory.property
          .on('change:id', this._fetchNodePerspective, this);
      this.previousNode = this.context
          .getModel(PreviousNodeModelFactory, {
            permanent: true,
            detached: true
          });
      this.browsingStates = this.context
          .getCollection(BrowsingStateCollectionFactory, {
            permanent: true,
            detached: true
          });

      // Move the contextual node out of permanent factories; it cannot be
      // retained, because when the perspective switches, other models could
      // be listening on it and would waist a fetch, because their views are
      // going to be destroyed with the old perspective.
      this.node = this.context
          .getModel(NodeModelFactory, {
            options: nodeOptions
          });
    },

    onClear: function () {
      this._clearModels(true);
    },

    onRefresh: function () {
      this._clearModels(false);
    },

    isFetchable: function (factory) {
      // The contextual node is fetched by fetchPerspective already.
      return factory.property !== this.node;
    },

    _clearModels: function (recreateNode) {
      // Changes in node models could trigger re-fetching the temporary
      // models, which are cleared in fetch() first otherwise.
      this.previousNode.clear({silent: true});
      this.previousNode.set(this.node.attributes);
      if (recreateNode) {
        // Create a new node model to prevent triggering change events on the
        // previous one, which should be destroyed with the old perspective
        this.node = this.context
            .getModel(NodeModelFactory, {
              options: nodeOptions
            });
      }
      this.node.clear({silent: true});
      this.node.set(this.nextNode.attributes);
    },

    _fetchNodePerspective: function () {
      Backbone.trigger('closeToggleAction');
      // Compatibility with the early way how to go to the landing page
      var nextNodeId = this.nextNode.get('id');
      if (nextNodeId == null || nextNodeId <= 0) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      this.applicationScope.set('id', 'node');
      // Use the factory to allow pre-fetching data from the page.
      this.nextNodeFactory.fetch({
        success: _.bind(this._changePerspective, this, this.nextNode),
        error: _.bind(this.context.rejectPerspective, this.context)
      });
    },

    _changePerspective: function (sourceModel) {
      // Check if the node is forced to be opened in Classic UI
      var classicUrl = classicNodes.getUrl(sourceModel);
      if (classicUrl) {
        window.location.replace(classicUrl);
        return;
      }

      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var query = browsingState && browsingState.get('query');
      var perspectiveUrlOverride = query && query.perspective;
      if (perspectiveUrlOverride) {
        this.context.perspective.clear({silent: true});
        return this.context.overridePerspective(sourceModel,
            'json!csui/utils/contexts/perspective/impl/perspectives/' +
            perspectiveUrlOverride + '.json');
      }

      var perspectiveModule,
          perspective = nodePerspectives.findByNode(sourceModel);
      // Avoid opening a non-container in the children-browse perspective
      // and prefer important client-side perspectives too
      if (_.isEmpty(sourceModel.get('perspective')) || !sourceModel.get('container') ||
          perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }

      this.context.applyPerspective(sourceModel);
    }

  });

  return NodePerspectiveContextPlugin;

});


csui.define('csui/utils/contexts/perspective/search.perspectives',['module',
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external perspectives
  'csui-ext!csui/utils/contexts/perspective/search.perspectives'
], function (module, _, Backbone, RulesMatchingMixin, extraPerspectives) {

  var config = module.config();
  _.defaults(config, {
    perspectiveCollection:[{
      // default search
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/search.json',
      sequence: 10000
    }]
  });

  var SearchPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      module: null
    },

    constructor: function SearchPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(SearchPerspectiveModel.prototype);

  var SearchPerspectiveCollection = Backbone.Collection.extend({

    model: SearchPerspectiveModel,
    comparator: "sequence",

    constructor: function SearchPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByQuery: function (query) {
      return this.find(function (item) {
        return item.matchRules(query, item.attributes);
      });
    }

  });

  var searchPerspectives = new SearchPerspectiveCollection(config.perspectiveCollection);

  if (extraPerspectives) {
    searchPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return searchPerspectives;

});

csui.define('csui/utils/contexts/perspective/impl/search.perspective.context.plugin',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/search.perspectives'
], function (require, _, Backbone, log, SearchQueryModelFactory,
    ApplicationScopeModelFactory, PerspectiveContextPlugin,
    searchPerspectives) {
  'use strict';

  var SearchPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function SearchPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);
      this.searchQuery = this.context
          .getModel(SearchQueryModelFactory, {
            permanent: true,
            detached: true
          })
          .on('change', this._fetchSearchPerspective, this);
    },

    _fetchSearchPerspective: function () {
      var perspective = searchPerspectives.findByQuery(this.searchQuery);
      this.applicationScope.set('id', 'search'); // set application view state
      this.context.loadPerspective(perspective.get('module'));
    }

  });

  return SearchPerspectiveContextPlugin;

});

csui.define('csui/utils/contexts/perspective/perspective.guide',['csui/lib/underscore'], function (_) {

  function PerspectiveGuide() {
  }

  PerspectiveGuide.prototype = {
    isNew: function (oldPerspective, newPerspective) {
      //In case of widget maximize mode we are setting showWidgetInMaxMode attribute, we need to
      // omit this atrribute for perspective comparison
      return !_.isEqual(_.omit(oldPerspective, ['showWidgetInMaxMode', 'id']),
          _.omit(newPerspective, ['id']));
    }
  };

  return PerspectiveGuide;

});


csui.define('csui/utils/contexts/perspective/perspective.context',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/log', 'csui/utils/contexts/context',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',
  'csui/utils/contexts/perspective/perspective.guide',
  // Load external plugins to drivw perspective switches
  'csui-ext!csui/utils/contexts/perspective/perspective.context'
], function (require, _, $, Backbone, base, log, Context,
    UserModelFactory, ApplicationScopeModelFactory,
    LandingPerspectiveContextPlugin, PerspectiveGuide, contextPlugins) {
  'use strict';

  var PerspectiveContext = Context.extend({

    constructor: function PerspectiveContext() {
      Context.prototype.constructor.apply(this, arguments);

      _.defaults(this.options, {online: true});

      this.perspective = new Backbone.Model();
      this.perspectiveGuide = new PerspectiveGuide();

      // Automatically initialized context models
      this._applicationScope = this.getModel(ApplicationScopeModelFactory, {
        permanent: true,
        detached: true
      });

      if (this.options.online) {
        this._user = this.getModel(UserModelFactory, {
          options: {
            includeResources: ['perspective']
          },
          permanent: true
        });
      }

      // Keep the same order as for perspective routers
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .concat([LandingPerspectiveContextPlugin])
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    // TODO: Deprecate this function, force empty URL to route
    fetchPerspective: function () {
      var landingPerspectivePlugin = _.find(this._plugins, function (plugin) {
        return plugin instanceof LandingPerspectiveContextPlugin;
      });
      landingPerspectivePlugin._fetchLandingPerspective();
      return this;
    },

    _destroyNonPermanentFactories: function () {
      Context.prototype._destroyNonPermanentFactories.apply(this, arguments);
      _.invoke(this._plugins, 'onClear');
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             // The user model should be fetched only at the beginning
             (factory.property !== this._user || !this._user.get('id')) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    loadPerspective: function (perspectiveModule) {
      var deferred = $.Deferred(),
          self     = this;
      log.debug('Using perspective from "{0}".', perspectiveModule) &&
      console.log(log.last);
      this.triggerMethod('request:perspective', this.context);
      this.loadingPerspective = deferred.promise();
      require([perspectiveModule], function (perspective) {
        var wrapperModel = new Backbone.Model({perspective: perspective});
        self.loadingPerspective = false;
        self.applyPerspective(wrapperModel);
      }, function (error) {
        self.loadingPerspective = false;
        self.rejectPerspective(error);
      });
    },

    overridePerspective: function (sourceModel, perspectiveModule) {
      var self = this;
      log.debug('Overriding the perspective in {0} with "{1}".',
          log.getObjectName(sourceModel), perspectiveModule) &&
      console.log(log.last);
      return require([perspectiveModule], function (perspective) {
        sourceModel.set('perspective', perspective);
        self.applyPerspective(sourceModel);
      }, _.bind(this.rejectPerspective, this));
    },

    applyPerspective: function (sourceModel) {
      this.triggerMethod('sync:perspective', this, sourceModel);
      var newPerspective = sourceModel.get('perspective') || {};
      if (this.perspectiveGuide.isNew(this.perspective.attributes, newPerspective)) {
        this.triggerMethod('before:change:perspective', this, sourceModel);
        log.info('Perspective has changed') && console.log(log.last);
        this.perspective.clear();
        this.perspective.set(newPerspective);
        this.triggerMethod('change:perspective', this, sourceModel);
        // The context will be fetched by the owner, after it resolves the widgets
        // and renders them to get the context filled by models.
      } else {
        var self = this;
        log.info('Perspective has not changed') && console.log(log.last);
        this._destroyTemporaryFactories();
        _.invoke(this._plugins, 'onRefresh');
        // The current perspective stays, just the widgets may need refresh.
        this
            .fetch()
            .fail(function (error) {
              self.rejectPerspective(sourceModel, error);
            });
      }
    },

    rejectPerspective: function (sourceModel, error) {
      var self = this;

      if (!error) {
        error = sourceModel;
      }
      if (!(error instanceof Error)) {
        error = new base.Error(error);
      }
      this.triggerMethod('error:perspective', this, error);

      function informFailure() {
        self._informFailure(error)
            .then(function () {
              self.trigger('reject:perspective');
            });
      }

      if (sourceModel && sourceModel instanceof Backbone.Model) {
        //Set nextNode id to '-1' so a user can re-attempt to open it.
        sourceModel.set('id', -1, {silent: true});

        // trigger event to update breadcrumbs
        self.trigger('current:folder:changed', sourceModel);

        var errorPage = 'json!csui/utils/contexts/perspective/impl/perspectives/error.global.json';
        require([errorPage], function (perspective) {
          log.debug('Showing error page perspective for {0} with "{1}".',
              log.getObjectName(sourceModel), errorPage) &&
          console.log(log.last);

          sourceModel.set('perspective', perspective, {silent: true});
          sourceModel.set('serverError', error.toString(), {silent: true});

          self.applyPerspective(sourceModel);

        }, function () {
          informFailure();
        });
      } else {
        informFailure();
      }
    },

    _informFailure: function (error) {
      var errorHandled = false,
          deferred     = $.Deferred();

      //If offline is supported, then let the plugin handle the network error
      if (error.statusCode === 0) {
        errorHandled = _.find(this._plugins, function (plugin) {
          if (plugin.offlineErrorHandler) {
            return plugin.offlineErrorHandler(error);
          }
        });
      }

      if (!errorHandled) {
        csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.showError(error.toString())
              .always(deferred.resolve);
        });
      }
      return deferred.promise();
    }

  });

  return PerspectiveContext;

});

csui.define('csui/utils/contexts/factories/ancestors',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodeancestors'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAncestorCollection) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var AncestorCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'ancestors',

    constructor: function AncestorsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var ancestors = this.options.ancestors || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = ancestors.initialResponse || config.initialResponse;
      }
      if (!(ancestors instanceof Backbone.Collection)) {
        var node = context.getModel(NodeModelFactory, options);
        ancestors = new NodeAncestorCollection(ancestors.models,
          _.defaults({
            node: node
          }, ancestors.options, config.options));
      }
      this.property = ancestors;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return AncestorCollectionFactory;
});

csui.define('csui/utils/contexts/factories/children',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodechildren', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildrenCollection, allCommands) {
  'use strict';

  var ChildrenCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'children',

    constructor: function ChildrenCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
          config = module.config();
        children = new NodeChildrenCollection(children.models,
          _.defaults({
              // Prefer refreshing the entire table to rendering one row after another.
              autoreset: true,
              // Minimize the response information; the server adds information with
              // every update and UI would get slower
              fields: {
                properties: []
              },
              // Shortcut information needs to be resolved to support UI and actions.
              expand: {
                properties: ['original_id']
              },
              // Ask the server to check for permitted actions V2
              commands: commands.getAllSignatures()
            },
            config.options,
            children.options,
            // node is intentionally listed at the end to give previous options preference
            {node: node}
          ));
      }
      this.property = children;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return ChildrenCollectionFactory;

});

csui.define('csui/utils/contexts/factories/children2',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node.children2/node.children2', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildren2Collection, allCommands) {
  'use strict';

  var Children2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'children2',

    constructor: function Children2CollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children2 || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        children = new NodeChildren2Collection(children.models,
            _.defaults({
                  // Prefer refreshing the entire table to rendering one row after another.
                  autoreset: true,
                  // Minimize the response information; the server adds information with
                  // every update and UI would get slower
                  fields: {
                    properties: [],
                    'versions.element(0)': ['owner_id']
                  },
                  // Shortcut information needs to be resolved to support UI and actions.
                  expand: {
                    properties: ['original_id']
                  },
                  // Ask the server to check for permitted actions V2
                  commands: commands.getAllSignatures()
                },
                config.options,
                children.options,
                // node is intentionally listed at the end to give previous options preference
                {node: node}
            ));
      }
      this.property = children;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return Children2CollectionFactory;
});

csui.define('csui/utils/contexts/factories/columns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/children'
], function (module, _, Backbone, CollectionFactory, NodeChildrenFactory) {

  var ColumnCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'columns',

    constructor: function ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getModel(NodeChildrenFactory, options),
            config = module.config();
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return ColumnCollectionFactory;

});

csui.define('csui/utils/contexts/factories/columns2',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node', 'csui/models/node.columns2',
  'csui/utils/log'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeColumn2Collection, log) {
  'use strict';

  log = log(module.id);

  var Column2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'columns2',

    constructor: function Column2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns2 || {};
      if (!(columns instanceof Backbone.Collection)) {
        var node = columns.options && columns.options.node ||
                   context.getModel(NodeModelFactory, options);
        this.property = new NodeColumn2Collection();
        this.node = node;
        node.columns.on('reset', this._resetColumns, this);
        this._resetColumns();
      } else {
        this.property = columns;
      }
    },

    _resetColumns: function () {
      var node          = this.node,
          definitionMap = {},
          definitions   = node.definitions.map(function (definition) {
            definition = definition.toJSON();
            var key = definition.key;
            definition.column_key = key;
            switch (key) {
            case 'name':
              definition.default_action = true;
              definition.contextual_menu = false;
              definition.editable = true;
              definition.filter_key = key;
              break;
            case 'type':
              definition.default_action = true;
              break;
            case 'modify_date':
              definition.initialSortingDescending = true;
              break;
            }
            definitionMap[key] = definition;
            if (definition.sort_key) {
              definition.sort = true;
              delete definition.sort_key;
            }
            return definition;
          });
      node.columns.each(function (column, index) {
        var columnKey      = column.get('key'),
            formattedIndex = columnKey.lastIndexOf('_formatted'),
            order          = 500 + index,
            definition;
        // Update the real value-carrying column, which does not end with
        // "_formatted", if only the "_formatted" one is present and not
        // the real one. "_formatted"  columns should not be used, because
        // they do not provide the real value for sorting, filtering, saving
        // or other scenarios, where it is needed. Also the right formatting
        // is specified in Smart UI. "_formatted" columns are for AJAX calls
        // from Classic UI, because they for at according to its design.
        if (formattedIndex >= 0) {
          var realColumnKey = columnKey.substr(0, columnKey.length - 10);
          definition = definitionMap[realColumnKey];
          if (definition) {
            definition.definitions_order = order;
            return;
          }
        }
        definition = definitionMap[columnKey];
        if (definition) {
          definition.definitions_order = order;
        } else {
          log.warn('No definition found for the column "{0}".', columnKey);
        }
      });

      if (areDifferent(this.property, definitions)) {
        this.property.reset(definitions);
      }
    }
  });

  var columnProperties = [
    'description', 'key', 'multi_value', 'name', 'type', 'type_name'];

  function areDifferent(collection, objects) {
    return collection.length !== objects.length ||
           collection.some(function (model, index) {
             var expected = _.pick(objects[index], columnProperties),
                 actual = _.pick(model.attributes, columnProperties);
             return !_.isEqual(expected, actual);
           });
  }

  return Column2CollectionFactory;
});

csui.define('csui/models/authenticated.user.node.permission',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'csui/utils/contexts/factories/user'
], function (_, Backbone, Url, ExpandableMixin, ResourceMixin,
    IncludingAdditionalResourcesMixin, UserModelFactory) {
  'use strict';

  var AuthenticatedUserNodePermissionModel = Backbone.Model.extend({
    constructor: function AuthenticatedUserNodePermissionModel(attributes, options) {
      options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeExpandable(options);
      this.options= options;
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    url: function () {
      var selectedNodeId = this.node ? this.node.get('id') : this.options.node.get('id'),
          userId         = this.options.user.get('id');
      var apiBase = new Url(this.connector.connection.url).getApiBase('v2'),
          url     = Url.combine(apiBase, '/nodes/', selectedNodeId, '/permissions/effective/',
              userId);

      return url;
    },

    parse: function (response) {
      var permissions = response.results && response.results.data && response.results.data.permissions;
      if (permissions) {
        if (!this.node.get('container') && permissions.permissions.indexOf('add_items') !== -1) {
          permissions.permissions.splice(permissions.permissions.indexOf('add_items'), 1);
        }
      } else {
        permissions = {};
      }
      return permissions;
    },

    hasEditPermissionRights:function () {
      //Added check to provide edit rights to wiki pages(i.e. HTML widgets) only
      /*var nodeType = this.node ? this.node.get('type') : this.options.node.get('type');
      if(nodeType !== 5574) { //Wiki page type- 5574
        return false;
      }*/
      var permissons=this.get("permissions");
      return permissons && _.isArray(permissons) && _.contains(permissons,'edit_permissions');
    }
  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);
  ExpandableMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);
  ResourceMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);

  return AuthenticatedUserNodePermissionModel;
});

csui.define('csui/utils/contexts/factories/usernodepermission',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user.node.permission'
], function (module, _, $, Backbone, ModelFactory, UserModelFactory, ConnectorFactory,
    AuthenticatedUserNodePermissionModel) {
  'use strict';

  var UserNodePermissionModelFactory = ModelFactory.extend({
    propertyPrefix: 'userNodePermission',

    constructor: function UserNodePermissionModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var userNodePermission = this.options.userNodePermission || {},
          config = module.config();
      if (!(userNodePermission instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            user      = context.getModel(UserModelFactory);
        userNodePermission = new AuthenticatedUserNodePermissionModel(
            userNodePermission.attributes,
            _.defaults({
                  connector: connector,
                  user: user,
                  node: this.options.node
                }, userNodePermission.options, config.options
            )
        );
      }
      this.property = userNodePermission;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return UserNodePermissionModelFactory;
});

csui.define('csui/utils/contexts/factories/volume',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, NodeModelFactory, NodeModel) {

  var VolumeModelFactory = ModelFactory.extend({

    propertyPrefix: 'volume',

    constructor: function VolumeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var volume = this.options.volume || {};
      if (!(volume instanceof Backbone.Model)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config();

        // Make sure that the volume info is returned with the node info
        node.setExpand('properties', 'volume_id');

        // Create an empty node model to fill with the volume info
        // as soon as it is fetched with the node info
        volume = new NodeModel(
            _.extend({}, node.get('volume_id'), volume.attributes || config.attributes),
            _.extend({
              connector: node.connector
            }, volume.options, config.options));

        this.listenTo(node, 'change:volume_id', function () {
          volume.set(node.get('volume_id'));
        });
      }
      this.property = volume;
    }

  });

  return VolumeModelFactory;

});

csui.define('csui/models/widget/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/models/widget/nls/root/lang',{
  searchResults: "Search Results",

  ra_access_date_last: 'Last Accessed',
  ra_parent_id: 'Location',
  ra_size: 'Size',

  ma_type: "Type",
  ma_name: "Name",
  ma_location_name: "Location",
  ma_date_due: "Due Date",
  ma_priority: "Priority",
  ma_status: "Status",
  ma_from_user_name: "From",

  fav_parent_id: 'Location',
  fav_size: 'Size',

  owner: "Owner",
  created: "Created",
  createdBy: "Created by",
  modified: "Modified",
  size: "Size",
  type: "Type"

});


csui.define('csui/models/widget/favorites.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, lang) {
  'use strict';

  var FavoriteColumnModel = NodeChildrenColumnModel.extend({

    constructor: function FavoriteColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'fav_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var FavoriteColumnCollection = NodeChildrenColumnCollection.extend({

    model: FavoriteColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date' ||
            columnKey === 'parent_id' || columnKey == 'size') {
          column.sort = true;
        }
      });
      return columns;
    }

  });

  var FavoriteModel = NodeModel.extend({

    parse: function (response, options) {
      var fav, fav_version;
      if (response.data && response.data.properties) {
        fav = response.data.properties;
        fav_version = response.data.versions;
      } else {
        fav = response;
        fav_version = response.versions;
      }
      fav.short_name = fav.name; // fav.name.length > 20 ? fav.name.substr(0, 20) + '...' : fav.name;
      if (!fav.size) {
        if (fav.container) {
          fav.size = fav.container_size;
        } else if (fav_version) {
          fav.size = fav_version.file_size;
        }
      }
      if (!fav.mime_type && fav_version && fav_version.mime_type) {
        fav.mime_type = fav_version.mime_type;
      }
      return NodeModel.prototype.parse.call(this, response, options);
    }

  });

  var FavoriteCollection = Backbone.Collection.extend({

    model: FavoriteModel,

    constructor: function FavoriteCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);

      this.columns = new FavoriteColumnCollection();
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2'),
          query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery(),
              this.getBrowsableUrlQuery()
          );
      url = Url.combine(url, '/members/favorites');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      this.columns && this.columns.resetColumnsV2(response, this.options);
      return this.parseBrowsedItems(response, options);
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
    }

  });

  ClientSideBrowsableMixin.mixin(FavoriteCollection.prototype);
  BrowsableV2ResponseMixin.mixin(FavoriteCollection.prototype);
  ConnectableMixin.mixin(FavoriteCollection.prototype);
  FetchableMixin.mixin(FavoriteCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(FavoriteCollection.prototype);
  FieldsV2Mixin.mixin(FavoriteCollection.prototype);
  ExpandableV2Mixin.mixin(FavoriteCollection.prototype);
  CommandableV2Mixin.mixin(FavoriteCollection.prototype);

  return FavoriteCollection;

});

csui.define('csui/utils/contexts/factories/favorites',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/favorites.model', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, FavoritesCollection,
    commands) {
  'use strict';

  var FavoriteCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites',

    constructor: function FavoritesCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};
      if (!(favorites instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        favorites = new FavoritesCollection(favorites.models, _.extend(
            {connector: connector}, favorites.options, config.options,
            FavoritesCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = favorites;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // The latest version properties can be considered common properties
        // too (the MIME type is there, for example)
        fields: {
          properties: [],
          'versions.element(0)': []
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: ['metadata'],
        // Ask the server to check for permitted actions V2
        commands: commands.getAllSignatures()
      });
    }

  });

  return FavoriteCollectionFactory;

});

csui.define('csui/utils/contexts/factories/favoritescolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/favorites'
], function (module, _, Backbone, CollectionFactory, FavoriteCollectionFactory) {

  var FavoritesColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites_columns',

    constructor: function FavoritesColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(FavoriteCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return FavoritesColumnsCollectionFactory;

});

csui.define('csui/utils/contexts/factories/favorites2',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/models/favorites2', 'csui/utils/defaultactionitems',
  'csui/utils/commands', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorites2Collection, defaultActionItems, commands) {
  'use strict';

  var Favorite2CollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2',

    constructor: function Favorite2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};

      if (!(favorites instanceof Backbone.Collection)) {

        var connector = context.getObject(ConnectorFactory, options);
        var config = module.config();

        favorites = new Favorites2Collection(favorites.models,
            _.extend({
                connector: connector,
                autoreset: true
              },
              favorites.options,
              config.options,
              Favorite2CollectionFactory.getDefaultResourceScope()
            )
        );
      }
      this.property = favorites;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type','owner_id']
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id']
        },
        // no need for metadata to include, because column definitions are created fully client side
        includeResources: [],
        // Ask the server to check for permitted actions V2
        commands: commands.getAllSignatures()
      });
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id', 'container'],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['original_id', 'parent_id']
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: [],
        // Ask the server to check for permitted actions V2 - only default actions
        commands: commands.getAllSignatures(),
        defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands)
      });
    },

    getDefaultsOnlyResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': []
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id']
        },
        // no need for metadata to include, because column definitions are created fully client side
        includeResources: [],
        // Ask the server to check for permitted actions V2
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return Favorite2CollectionFactory;
});

csui.define('csui/utils/contexts/factories/favorite2groups',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/favorites2',
  'csui/models/favorite2groups', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorite2CollectionFactory, Favorite2GroupsCollection, commands) {
  'use strict';

  var Favorite2GroupsCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'favorites2groups',

    constructor: function Favorite2GroupsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favoriteGroups = this.options.favoriteGroups || {};

      if (!(favoriteGroups instanceof Backbone.Collection)) {

        var config = module.config();
        var connector = context.getObject(ConnectorFactory, options);
        var favorites = context.getCollection(Favorite2CollectionFactory, options);

        favoriteGroups = new Favorite2GroupsCollection(favoriteGroups.models,
            _.extend({
                  favorites: favorites,
                  connector: connector,
                  autoreset: true,
                  commands: commands.getAllSignatures()
                },
                favoriteGroups.options,
                config.options,
                Favorite2GroupsCollectionFactory.getDefaultResourceScope()
            )
        );
      }
      this.property = favoriteGroups;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  }, {
    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: []
        }
      });
    }
  });

  return Favorite2GroupsCollectionFactory;
});

csui.define('csui/utils/contexts/factories/favorite2columns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/favorites2'
], function (module, _, Backbone, CollectionFactory, Favorite2CollectionFactory) {

  var Favorite2ColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2_columns',

    constructor: function Favorite2ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(Favorite2CollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return Favorite2ColumnsCollectionFactory;
});

csui.define('csui/models/widget/myassignments.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, lang) {
  'use strict';

  var MyAssignmentColumnModel = NodeChildrenColumnModel.extend({

    constructor: function MyAssignmentColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'ma_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var MyAssignmentColumnCollection = NodeChildrenColumnCollection.extend({

    model: MyAssignmentColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'location_id' ||
            columnKey === 'date_due' || columnKey === 'priority' || columnKey === 'status' ||
            columnKey === 'from_user_name') {
          column.sort = true;
          if (columnKey === 'location_id') {
            column.sort_key = 'location_name';
          }
        }
      });
      return columns;
    },

    // private: convert v2 'metadata' to v1 'definitions' for backward code compatibility and
    //          reuse purpose
    getV2Columns: function (response) {

      // Note: from a long discussion with the server developer, use the common 'metadata' (or
      // called 'definitions' in v1) in the first element. Elements in the collection can have
      // different extended metadata (definitions).  If a business case arises that
      // extended definitions are needed, will discuss again with them and add that support.

      var definitions = (response.results && response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.assignments) || {};

      // TODO: the server is currently missing the metadata output for expanded fields.
      // Remove this temporary hard-coded code after the server properly outputs metadata.
      // Watch for LPAD-43411.
      if (!definitions.location_id_expand && definitions.name) {
        definitions.location_id_expand = _.clone(definitions.name);
        definitions.location_id_expand.key = 'location_id_expand';
        definitions.location_id_expand.name = 'Location';
      }
      if (!definitions.from_user_id_expand && definitions.name) {
        definitions.from_user_id_expand = _.clone(definitions.name);
        definitions.from_user_id_expand.key = 'from_user_id_expand';
        definitions.from_user_id_expand.name = 'From';
      }

      // client-side sub-field column
      if (!definitions.location_name && definitions.name) {
        definitions.location_name = _.clone(definitions.name);
        definitions.location_name.key = 'location_name';
        definitions.location_name.name = 'Location Name';
      }
      if (!definitions.from_user_name && definitions.name) {
        definitions.from_user_name = _.clone(definitions.name);
        definitions.from_user_name.key = 'from_user_name';
        definitions.from_user_name.name = 'From';
      }

      var columnKeys = _.keys(definitions);

      return this.getColumnModels(columnKeys, definitions);
    }

  });

  var MyAssignmentModel = NodeModel.extend({

    parse: function (response, options) {
      var assignments = response.data.assignments;
      assignments.short_name = assignments.name;

      var location_expand;
      if (assignments.location_id_expand) {
        location_expand = assignments.location_id_expand;
      } else if (assignments.workflow_subworkflow_id_expand) {
        location_expand = assignments.workflow_subworkflow_id_expand;
      } else if (assignments.workflow_id_expand) {
        // note: workflow_id should be the same as workflow_subworkflow_id, this case is a fallback
        location_expand = assignments.workflow_id_expand;
      } else if (assignments.workflow_subworkflow_task_id_expand) {
        location_expand = assignments.workflow_subworkflow_task_id_expand;
      }
      assignments.location_name = (location_expand && location_expand.name) || '';

      var from_user_id_expand = assignments.from_user_id_expand || {};
      var name = from_user_id_expand.first_name || '';
      name = name + ' ' + (from_user_id_expand.last_name || '');
      if (!name.length || (name.length === 1 && name === ' ')) {
        name = from_user_id_expand.name;
      }
      assignments.from_user_name = name;

      if (response.data && response.data.assignments) {
        response.data.properties = response.data.assignments;
      }

      var node = NodeModel.prototype.parse.call(this, response, options);
      return node;
    }

  });

  var MyAssignmentCollection = Backbone.Collection.extend({

    model: MyAssignmentModel,

    constructor: function MyAssignmentCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);

      this.columns = new MyAssignmentColumnCollection();
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2'),
          query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery()
          );
      url = Url.combine(url, '/members/assignments');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      // filter out pstage items
      response.results = _.filter(response.results, function (item) {
        return item.data.assignments.type != 398; //pstage
      });

      this.parseBrowsedState(response, options);
      this.columns && this.columns.resetColumnsV2(response, this.options);
      return this.parseBrowsedItems(response, options);
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
    }

  });

  ClientSideBrowsableMixin.mixin(MyAssignmentCollection.prototype);
  // when due_date is null, put the record at the bottom for ascending sort as PM and CWS request
  var originalCompareValues = MyAssignmentCollection.prototype._compareValues;
  MyAssignmentCollection.prototype._compareValues = function (property, left, right) {
    if (property.indexOf('date') >= 0) {
      if (left === null) {
        return 1;
      }
      if (right === null) {
        return -1;
      }
    }
    return originalCompareValues.apply(this, arguments);
  };

  BrowsableV2ResponseMixin.mixin(MyAssignmentCollection.prototype);
  ConnectableMixin.mixin(MyAssignmentCollection.prototype);
  FetchableMixin.mixin(MyAssignmentCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(MyAssignmentCollection.prototype);
  FieldsV2Mixin.mixin(MyAssignmentCollection.prototype);
  ExpandableV2Mixin.mixin(MyAssignmentCollection.prototype);
  CommandableV2Mixin.mixin(MyAssignmentCollection.prototype);

  return MyAssignmentCollection;

});

csui.define('csui/utils/contexts/factories/myassignments',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/myassignments.model',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, MyAssignmentCollection) {
  'use strict';

  var MyAssignmentCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments',

    constructor: function MyAssignmentCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var myassignments = this.options.myassignments || {};
      if (!(myassignments instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        myassignments = new MyAssignmentCollection(myassignments.models, _.extend(
            {connector: connector}, myassignments.options, config.options,
            MyAssignmentCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = myassignments;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function(){
      if (window.csui && window.csui.mobile) {
        return !this.property.fetched;
      }
      return true;
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // So far, all properties are includes in the assignments fields
        fields: {
          assignments: []
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: ['metadata']
      });
    }

  });

  return MyAssignmentCollectionFactory;

});

csui.define('csui/utils/contexts/factories/myassignmentscolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/myassignments'
], function (module, _, Backbone, CollectionFactory, MyAssignmentsCollectionFactory) {

  var MyAssignmentsColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments_columns',

    constructor: function MyAssignmentsColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(MyAssignmentsCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return MyAssignmentsColumnsCollectionFactory;

});

csui.define('csui/models/widget/recentlyaccessed/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url   = this.connector.connection.url.replace('/v1', '/v2'),
              query = Url.combineQueryString(
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getRequestedCommandsUrlQuery(),
                  this._getSubtypesUrlQuery()
              );
          url = Url.combine(url, '/members/accessed');
          return query ? url + '?' + query : url;
        },
    
        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          this.columns && this.columns.resetColumnsV2(response, this.options);
          return this.parseBrowsedItems(response, options);
        },
    
        _getSubtypesUrlQuery: function () {
          var where_types = "";
    
          if (this.options.recentlyAccessedSubtypes) {
            for (var i = 0; i < this.options.recentlyAccessedSubtypes.length; i++) {
              where_types = where_types.concat("where_type=", this.options.recentlyAccessedSubtypes[i],
                  "&");
            }
          }
          return where_types;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/recentlyaccessed.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/models/widget/recentlyaccessed/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin,
    DelayedCommandableV2Mixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, lang, ServerAdaptorMixin) {
  'use strict';

  var RecentlyAccessedColumnModel = NodeChildrenColumnModel.extend({

    constructor: function RecentlyAccessedColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'ra_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var RecentlyAccessedColumnCollection = NodeChildrenColumnCollection.extend({

    model: RecentlyAccessedColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'access_date_last' ||
            columnKey === 'modify_date' || columnKey === 'parent_id' || columnKey === 'size') {
          column.sort = true;
          if (columnKey === 'parent_id') {
            column.sort_key = 'parent_name';
          }
        }
      });
      return columns;
    },

    // private
    getV2Columns: function (response) {
      var definitions = (response.results &&
                         response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.properties) || {};

      // TODO: sadly the server is again missing the metadata output for access_date_last field.
      // Remove this temporary hard-coded code after the server properly outputs this metadata.
      if (!definitions.access_date_last && definitions.modify_date) {
        definitions.access_date_last = _.clone(definitions.modify_date);
        definitions.access_date_last.key = 'access_date_last';
        definitions.access_date_last.name = 'Last Accessed';
      }

      // client-side sub-field column
      if (!definitions.parent_name && definitions.name) {
        definitions.parent_name = _.clone(definitions.name);
        definitions.parent_name.key = 'parent_name';
        definitions.parent_name.name = 'Location Name';  // no i18n needed, server has it in EN
      }

      return NodeChildrenColumnCollection.prototype.getV2Columns.call(this, response);
    }

  });

  var RecentlyAccessedModel = NodeModel.extend({

    parse: function (response, options) {
      var ra, ra_version, ra_propertiesUser, ra_parentIdExpanded;
      if (response.data && response.data.properties) {
        ra = response.data.properties;
        ra_version = response.data.versions;
        ra_propertiesUser = response.data.properties_user;
        ra_parentIdExpanded = response.data.properties.parent_id_expand;
      } else {
        ra = response;
        ra_version = response.versions;
        ra_propertiesUser = response.properties_user;
        ra_parentIdExpanded = response.parent_id_expanded;
      }

      ra.short_name = ra.name; //ra.name.length > 20 ? ra.name.substr(0, 20) + '...' : ra.name;

      if (!ra.size) {
        if (ra.container) {
          ra.size = ra.container_size;
        } else if (ra_version) {
          ra.size = ra_version.file_size;
        }
      }

      if (!ra.mime_type && ra_version && ra_version.mime_type) {
        ra.mime_type = ra_version.mime_type;
      }

      if (!ra.access_date_last && ra_propertiesUser && ra_propertiesUser.access_date_last) {
        ra.access_date_last = ra_propertiesUser.access_date_last;
      }

      ra.parent_name = '';
      if (!ra.parent_name && ra_parentIdExpanded && ra_parentIdExpanded.name) {
        ra.parent_name = ra_parentIdExpanded.name;
      }

      return NodeModel.prototype.parse.call(this, response, options);
    }

  });

  var RecentlyAccessedCollection = Backbone.Collection.extend({

    model: RecentlyAccessedModel,

    constructor: function RecentlyAccessedCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands', 'recentlyAccessedSubtypes']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);

      this.columns = new RecentlyAccessedColumnCollection();
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options);
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.skipCount = this.skipCount;
      clone.topCount = this.topCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      clone.filters = _.deepClone(this.filters);
      clone.orderBy = this.orderBy;
      clone.expand = _.clone(this.expand);
      clone.includeActions = this.includeActions;
      clone.includeCommands = _.clone(this.includeCommands);
      clone.defaultActionCommands = _.clone(this.defaultActionCommands);
      clone.commands = _.clone(this.commands);
      //clone.delayRestCommands = this.delayRestCommands; //cloning of this attribute doesnot
      // required since to enable delayedRestCommands on new cloned collection

      return clone;
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    },

  });

  ClientSideBrowsableMixin.mixin(RecentlyAccessedCollection.prototype);
  BrowsableV2ResponseMixin.mixin(RecentlyAccessedCollection.prototype);
  ConnectableMixin.mixin(RecentlyAccessedCollection.prototype);
  FetchableMixin.mixin(RecentlyAccessedCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  FieldsV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  ExpandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  CommandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  DelayedCommandableV2Mixin.mixin(RecentlyAccessedCollection.prototype);
  ServerAdaptorMixin.mixin(RecentlyAccessedCollection.prototype);

  return RecentlyAccessedCollection;

});

csui.define('csui/utils/contexts/factories/recentlyaccessed',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/recentlyaccessed.model', 'csui/utils/commands',
  'csui/utils/defaultactionitems',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    RecentlyAccessedCollection, commands, defaultActionItems) {
  'use strict';

  var RecentlyAccessedCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed',

    constructor: function RecentlyAccessedCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var recentlyAccessed = this.options.recentlyaccessed || {};
      if (!(recentlyAccessed instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        recentlyAccessed = new RecentlyAccessedCollection(recentlyAccessed.models, _.extend(
            {connector: connector, recentlyAccessedSubtypes: config.recentlyAccessedSubtypes},
            recentlyAccessed.options, config.options,
            RecentlyAccessedCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = recentlyAccessed;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // The latest version properties can be considered common properties
        // too (the MIME type is there, for example)
        fields: {
          properties: [],
          'versions.element(0)': []
        },
        // Get property definitions to support table columns
        includeResources: ['metadata'],
        // Ask the server to check for permitted actions
        commands: commands.getAllSignatures()
      });
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id',
            'reserved'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['parent_id', 'reserved_user_id']
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: [],
        // Ask the server to check for permitted actions V2 - only default actions
        commands: commands.getAllSignatures(),
        defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return RecentlyAccessedCollectionFactory;

});

csui.define('csui/utils/contexts/factories/recentlyaccessedcolumns',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/recentlyaccessed'
], function (module, _, Backbone, CollectionFactory, RecentlyAccessedCollectionFactory) {

  var RecentlyAccessedColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed_columns',

    constructor: function RecentlyAccessedColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(RecentlyAccessedCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return RecentlyAccessedColumnsCollectionFactory;

});

csui.define('csui/utils/contexts/factories/member',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/member'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, MemberModel) {
  'use strict';

  var MemberModelFactory = ModelFactory.extend({

    propertyPrefix: 'member',

    constructor: function MemberModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var member = this.options.member || {};
      if (!(member instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        member = new MemberModel(member.attributes || config.attributes, _.defaults({
          connector: connector
        }, member.options, config.options));
      }
      this.property = member;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return MemberModelFactory;

});

csui.define('csui/models/widget/search.results/search.metadata/search.metadata.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var SearchMetadataMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSearchMetadataResponse: function (options) {
          return this;
        },

        parseSearchMetadataResponse: function (resp, options) {
          return resp;
        }
      });
    }
  };

  return SearchMetadataMixin;
});

csui.define('csui/models/widget/search.results/search.metadata/search.metadata.items',['csui/lib/underscore', "csui/lib/backbone",
  'i18n!csui/models/widget/nls/lang'
], function (_, Backbone, lang) {

  var metadataCollection = [
    {
      key: 'create_date',
      column_key: 'create_date',
      column_name: lang.created,
      column_type: 'date',
      search_index: 'OTCreateDate',
      sequence: 10
    },
    {
      key: 'create_user_display_name',
      column_key: 'create_user_display_name',
      column_name: lang.createdBy,
      search_index: 'OTCreatedByName',
      sequence: 20
    },
    {
      key: 'modify_date',
      column_key: 'modify_date',
      column_name: lang.modified,
      column_type: 'date',
      search_index: 'OTObjectDate',
      sequence: 30
    },
    {
      key: 'owner_display_name',
      column_key: 'owner_display_name',
      column_name: lang.owner,
      search_index: 'OTName',
      sequence: 40,
      permanentColumn: false
    },
    {
      key: 'mime_type_search',
      column_key: 'mime_type_search',
      column_name: lang.type,
      search_index: 'OTFileType',
      sequence: 50,
      permanentColumn: false
    },
    {
      key: 'size',
      column_key: 'size',
      column_name: lang.size,
      search_index: 'OTObjectSize',
      sequence: 60,
      permanentColumn: false
    }
  ];
  return metadataCollection;
});
csui.define('csui/models/widget/search.results/search.metadata/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/widget/search.results/search.metadata/search.metadata.items'
], function (_, $, Backbone, metadataCollection) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          var deferred = $.Deferred();
          options = _.defaults({parse: true}, options);
          this.trigger('request', this, {}, options);
          setTimeout(function () {
            options.success.call(options.context, metadataCollection, 'success', {});
            deferred.resolve();
          }.bind(this));
          return deferred.promise();
        },

        parse: function (response, options) {
          return this.parseSearchMetadataResponse(response, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.results/search.metadata/search.metadata.model',['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.results/search.metadata/search.metadata.mixin',
  'csui/models/widget/search.results/search.metadata/server.adaptor.mixin'
], function ($, _, Backbone, ConnectableMixin, FetchableMixin, SearchMetadataMixin,
    ServerAdaptorMixin) {
  "use strict";

  var SearchMetadataItemModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var SearchMetadataItemsCollection = Backbone.Collection.extend({

    model: SearchMetadataItemModel,
    comparator: "sequence",

    constructor: function SearchMetadataItemsCollection(attributes, options) {
      SearchMetadataItemsCollection.__super__.constructor.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeSearchMetadataResponse(options)
          .makeServerAdaptor(options);
    },

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new SearchMetadataItemsCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  ConnectableMixin.mixin(SearchMetadataItemsCollection.prototype);
  FetchableMixin.mixin(SearchMetadataItemsCollection.prototype);
  SearchMetadataMixin.mixin(SearchMetadataItemsCollection.prototype);
  ServerAdaptorMixin.mixin(SearchMetadataItemsCollection.prototype);

  return SearchMetadataItemsCollection;
});
csui.define('csui/utils/contexts/factories/search.metadata.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/models/widget/search.results/search.metadata/search.metadata.model'
], function (module, _, Backbone, CollectionFactory, SearchMetadataModel) {

  var SearchMetadataModelFactory = CollectionFactory.extend({

    propertyPrefix: 'searchMetadata',

    constructor: function SearchMetadataModelFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var metadata = this.options.metadata || {};
      if (!(metadata instanceof Backbone.Collection)) {
        var config = module.config();
        metadata = new SearchMetadataModel(metadata.models, _.extend({},
            metadata.options, config.options));
      }
      this.property = metadata;
    },
    isFetchable: function () {
      return !!this.options;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return SearchMetadataModelFactory;
});

csui.define('json!csui/utils/contexts/perspective/impl/perspectives/search.json',{
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
              "type": "csui/widgets/search.results",
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

csui.define('csui/models/widget/search.box/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.connector.connection.url, "searchbar?enterprise_slices=true");
        },

        parse: function (response, options) {
          var sliceLabels = response.options.fields.slice.optionLabels,
            sliceIds = response.schema.properties.slice.enum,
            returnData = {};
          returnData.slices = [];
          $.each(sliceIds, function (sliceIdx) {
            returnData.slices.push({
              sliceId: sliceIds[sliceIdx],
              sliceDisplayName: sliceLabels[sliceIdx]
            });
          });
          return returnData;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.box.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.box/server.adaptor.mixin'
], function (_, $, Backbone, Url, ConnectableMixin, FetchableMixin, ServerAdaptorMixin) {
  "use strict";

  var SearchBoxModel = Backbone.Model.extend({

    constructor: function SearchBoxModel(models, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, models, options);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    }
  });

  ConnectableMixin.mixin(SearchBoxModel.prototype);
  FetchableMixin.mixin(SearchBoxModel.prototype);
  ServerAdaptorMixin.mixin(SearchBoxModel.prototype);

  _.extend(SearchBoxModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    }

  });

  return SearchBoxModel;

});
csui.define('csui/utils/contexts/factories/search.box.factory',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.box.model'
], function (module, _, $, Backbone, CollectionFactory, ConnectorFactory,
    SearchBoxModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var SearchBoxFactory = CollectionFactory.extend({
    propertyPrefix: 'searchBox',

    constructor: function SearchBoxFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchBox = this.options.searchBox || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = searchBox.initialResponse || config.initialResponse;
      }
      if (!(searchBox instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options);
        searchBox = new SearchBoxModel(searchBox.attributes || config.attributes,
          _.defaults({
            connector: connector
          }, searchBox.options, config.options, {
            autofetch: true
          }));
      }
      this.property = searchBox;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return SearchBoxFactory;
});

csui.define('csui/temporary/activeviews/icons/icons',[],function () {
  'use strict';

  return [
    {
      // ActiveView
      equals: {type: 30309},
      className: 'csui-icon mime_active_view',
      // ActiveView has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    },
    {
      // web report
      equals:    {type: 30303},
      className: 'csui-icon mime_web_report',
      // Web Report has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence:  30
    }
  ];

});

csui.define('csui/temporary/appearances/icons/icons',[],function () {
  'use strict';

  return [
    {
      // Appearance
      equals: {type: 480},
      className: 'csui-icon mime_appearance',
      // Appearance has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    }
  ];

});


csui.define('css!csui/temporary/cop/icons/icons',[],function(){});
csui.define('csui/temporary/cop/icons/icons',['css!csui/temporary/cop/icons/icons'
], function () {
  'use strict';

  return [
    // Blog, FAQ, Forum, Wiki and their entries have a MIME type,
    // which would decide the icon otherwise; the MIME type icons
    // have the sequence number 50 in common
    {
      // blog
      equals:    {type: 356},
      className: 'csui-icon csui-temporary-cop-blog',
      sequence:  30
    },
    {
      // blog entry
      equals:    {type: 357},
      className: 'csui-icon mime_blog_entry',
      sequence:  30
    },
    {
      // collaborative place
      equals:    {type: 1257},
      className: 'csui-icon mime_collaborative_place',
      sequence:  30
    },
    {
      // faq
      equals:    {type: 123475},
      className: 'csui-icon mime_faq',
      sequence:  30
    },
    {
      // faq entry
      equals:    {type: 123476},
      className: 'csui-icon mime_faq_entry',
      sequence:  30
    },
    {
      // forum
      equals:    {type: 123469},
      className: 'csui-icon mime_forum',
      sequence:  30
    },
    {
      // forum topics and replies
      equals:    {type: 123470},
      className: 'csui-icon mime_forum_topics_replies',
      sequence:  30
    },
    {
      // topic
      equals:    {type: 130},
      className: 'csui-icon mime_topic',
      sequence:  30
    },
    {
      // wiki
      equals:    {type: 5573},
      className: 'csui-icon mime_wiki',
      sequence:  30
    },
    {
      // wiki page
      equals:    {type: 5574},
      className: 'csui-icon mime_wiki_page',
      sequence:  30
    },
    {
      // community
      equals:    {type: 3030202},
      className: 'csui-icon mime_community',
      sequence:  30
    }
  ];

});

csui.define('bundles/csui-data',[
  // Behaviours
  'csui/behaviors/default.action/default.action.behavior',
  // The controller using the commands is loaded dynamically
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/behaviors/widget.container/widget.container.behavior',

  // Controls
  'csui/controls/error/error.view',
  'csui/controls/globalmessage/globalmessage',
  'css!csui/controls/globalmessage/globalmessage_icons',
  'csui/controls/grid/grid.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'i18n!csui/controls/globalmessage/impl/nls/globalmessage.lang',

  // Control mixins
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/mixins/global.alert/global.alert.mixin',

  // Control behaviours
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/controls/tile/behaviors/parent.scrollbar.updating.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/tile/behaviors/searching.behavior',

  // Pages
  'csui/pages/start/impl/perspective.router',
  'csui/pages/start/impl/perspective.factory',
  'csui/pages/start/impl/perspective.panel/perspective.animator',
  'csui/pages/start/impl/perspective.panel/perspective.panel.view',
  'csui/perspectives/flow/flow.perspective.view',
  'csui/perspectives/grid/grid.perspective.view',
  'csui/perspectives/mixins/perspective.edit.mixin',

  // Routers
  'csui/pages/start/perspective.routing',
  'csui/pages/start/perspective.router',
  'csui/pages/start/impl/node.perspective.router',
  'csui/pages/start/impl/search.perspective.router',
  'i18n!csui/pages/start/impl/nls/lang',

  // Perspectives

  // Utilities
  'csui/utils/classic.nodes/impl/core.classic.nodes',
  'csui/utils/content.helper',
  'csui/utils/handlebars/l10n',
  'csui/utils/impl/core.defaultactionitems',
  'csui/utils/node.links/impl/core.node.links',
  'csui/utils/open.authenticated.page',
  'csui/utils/smart.nodes/impl/core.smart.nodes',

  // Contexts and factories
  'csui/models/node/node.addable.type.factory',
  'csui/utils/contexts/context',
  'csui/utils/contexts/context.plugin',
  'csui/utils/contexts/browsing/browsing.context',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/portal/portal.context',
  'csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',
  'csui/utils/contexts/perspective/impl/node.perspective.context.plugin',
  'csui/utils/contexts/perspective/impl/search.perspective.context.plugin',
  'csui/utils/contexts/perspective/landing.perspectives',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/perspective/perspective.guide',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/search.perspectives',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/browsing.states',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/factories/children2',
  'csui/utils/contexts/factories/columns',
  'csui/utils/contexts/factories/columns2',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/usernodepermission',
  'csui/utils/contexts/factories/volume',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/favoritescolumns',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/utils/contexts/factories/favorites',
  'csui/utils/contexts/factories/favorites2',
  'csui/utils/contexts/factories/favorite2columns',
  'csui/utils/contexts/factories/myassignmentscolumns',
  'csui/utils/contexts/factories/myassignments',
  'csui/utils/contexts/factories/recentlyaccessedcolumns',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/utils/contexts/factories/member',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.metadata.factory',

  // Client-side perspectives
  'json!csui/utils/contexts/perspective/impl/perspectives/search.json',

  // Application widgets

  // Application widgets manifests

  // TODO: Remove the need for this impl by implementing search results
  // for a saved template by a contextual node perspective
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.box.factory',

  // TODO: Remove this, as long as the module owners take over
  // the icons
  'csui/temporary/activeviews/icons/icons',
  'csui/temporary/appearances/icons/icons',
  'csui/temporary/cop/icons/icons',

  // TODO: Remove this module from public area. Localization has to
  // be private  for its module.
  'i18n!csui/models/widget/nls/lang'
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-data', true);
});

