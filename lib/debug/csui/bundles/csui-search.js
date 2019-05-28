// Shows a form
csui.define('csui/widgets/search.custom/impl/form.view',['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/form.view'
], function (module, $, _, Marionette, Alpaca, FormView) {

  var CustomSearchFormView = FormView.extend({
    constructor: function CustomSearchFormView(options) {
      this.options = options || {};
      FormView.prototype.constructor.call(this, _.extend(options, {custom: {adjustHeight: true}}));
      this.jQuery = $;
      var that = this;
      //Custom Flatten the array object of set categories
      this.customFlatten = function (x, result, prefix) {
        if (_.isObject(x)) {
          _.each(x, function (v, k) {
            that.customFlatten(v, result, k);
          });
        } else {
          if (/^(anydate|anyvalue)/i.test(x)) {
            x = "";
          }
          result[prefix] = x;
        }
        return result;
      };

      this.customFilter = function () {
        var that        = this,
            result      = [],
            flattenData = that.customFlatten(that.objectList(that.getValues()), {});
        if (_.isObject(flattenData)) {
          _.each(flattenData, function (v, k) {
            if (that.customEndsWith(k, '_DFrom') || that.customEndsWith(k, '_DFor') ||
                that.customEndsWith(k, '_DTo')) {
              var original_k = k.substr(0, k.lastIndexOf('_'));
              if (!v && !!flattenData[original_k]) {
                flattenData[original_k] = "";
              }
            }
            if (v) {
              result.push(v);
            }
          });
        }
        return result;
      };

      this.customEndsWith = function (string, substring) {
        return string.indexOf(substring, string.length - substring.length) !== -1;
      };

      this.objectList = function (data) {
        var list = [];
        _.each(data, function (item) {
          if (_.isObject(item)) {
            list.push(item);
          }
        });
        return _.flatten(list);
      };

      this.$el.on("keydown", function (event) {

        if (event.keyCode === 13 &&
            (event.target.type === "text" || event.target.type === 'search') &&
            event.target.value.trim() !== "") {
          //handling typeahead field (userfield)
          if ($(event.target).is('input.typeahead') &&
              $(event.target).siblings('.typeahead.scroll-container:visible').length !== 0) {
            return;
          }
          that.triggerSearch(event);
        } else if (event.keyCode === 13 &&
                   that.jQuery(".binf-dropdown-menu").parent(".binf-open").length >= 1) {
          event.stopImmediatePropagation();
        } else if (event.keyCode === 13) {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                  "csui-search-form-submit-disabled");
            } else {
              that.triggerSearch(event);
            }
          } else {
            that.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
                "csui-search-form-submit-disabled");
          }
        }
      });

      this.$el.on("keyup", function (event) {
        if (event.target.type === "text") {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                  "csui-search-form-submit-disabled");
            }
          } else {
            that.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
                "csui-search-form-submit-disabled");
          }
        }
      });
    },

    triggerSearch: function (event) {
      var that = this;
      setTimeout(function (event) {
        if (!that.jQuery(".csui-custom-search-form-submit").hasClass("binf-disabled")) {
          that.$el.closest('.csui-custom-view-search').find(
              '.csui-custom-search-form-submit').click();
        }
      }, 50);
    },

    updateRenderedForm: function () {
      return false;
    },

    onRenderForm: function () {
      this.options.customView.triggerMethod("render:form");
    },

    onChangeField: function (event) {
      var defaultValues = this.customFilter();
      if (defaultValues.length === 0) {
        this.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
            "csui-search-form-submit-disabled");
      } else {
        this.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
            "csui-search-form-submit-disabled");
      }
      if (window.event && (window.event.keyCode === 13 || window.event.which === 13)) {
        if (!!event.value) {
          this.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
              "csui-search-form-submit-disabled");
          this.options.customView.triggerMethod("field:updated");
        } else {
          if (!!defaultValues && defaultValues.length === 0) {
            this.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                "csui-search-form-submit-disabled");
          } else if (defaultValues && defaultValues.length !== 0) {
            this.options.customView.triggerMethod("field:updated");
          }
        }
      }
    }
  });
  return CustomSearchFormView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearchform',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isSetType : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper;

  return "      <div class=\"binf-col-md-12 cs-form-singlecolumn cs-form-set\"\r\n           id=\"csfSingleCol_"
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].modelId : depths[2]), depth0))
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n";
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper;

  return "      <div class=\"binf-col-md-12 cs-form-doublecolumn\"\r\n           id=\"csfLeftCol_"
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].modelId : depths[2]), depth0))
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"binf-row\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"useData":true,"useDepths":true});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearchform', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearch.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-custom-search-formitems\"></div>";
}});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearch.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.custom/impl/search.customFormView',['csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/widgets/search.custom/impl/form.view',
  'hbs!csui/widgets/search.custom/impl/customsearchform',
  'hbs!csui/widgets/search.custom/impl/customsearch.item'
], function (Marionette, _, $, base, CustomSearchFormView, CustomSearchTemplate,
    CustomSearchItemTemplate) {

  var CustomSearchAttrItemView = Marionette.ItemView.extend({
    tag: 'div',
    className: "customsearch-attr-container",
    constructor: function CustomSearchAttrItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.on('error', this.errorHandle, this);
    },
    template: CustomSearchItemTemplate,
    onRender: function (e) {
      var _searchCustomFormViewEle = new Marionette.Region({
            el: this.$el.find('.csui-custom-search-formitems')
          }),
          formView                 = new CustomSearchFormView({
            context: this.options.context,
            model: this.model,
            layoutMode: 'singleCol',
            mode: 'create',
            customView: this,
            templateId: this.model.attributes.data.templateId
          });
      _searchCustomFormViewEle.show(formView);
      this.formView = formView;
    },
    onRenderForm: function () {
      this.options.objectView.triggerMethod("render:form");
      return;
    }
  });

  return CustomSearchAttrItemView;

});

csui.define('csui/widgets/search.custom/impl/search.customview.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {
  var SearchCustomModel = Backbone.Model.extend({

    constructor: function SearchCustomModel(attributes, options) {
      options || (options = {});
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = options;
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  ConnectableMixin.mixin(SearchCustomModel.prototype);
  FetchableMixin.mixin(SearchCustomModel.prototype);
  _.extend(SearchCustomModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      return Url.combine(this.connector.connection.url,
          'nodes/' + this.options.nodeId + '/customviewsearchforms');
    },

    parse: function (response, options) {
      response.name = response.text;
      return response;
    }
  });

  return SearchCustomModel;
});




csui.define('csui/widgets/search.custom/impl/search.customview.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/widgets/search.custom/impl/search.customview.model'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, SearchCustomModel) {

  var SearchCustomViewFactory = ModelFactory.extend({

    propertyPrefix: 'customSearch',

    constructor: function SearchCustomViewFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var customSearch = this.options.customSearch || {};
      if (!(customSearch instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        customSearch = new SearchCustomModel(customSearch.attributes || config.attributes, _.defaults({
          connector: connector,
          nodeId: options.customQuery.nodeId
        }, customSearch.options, config.options));
      }
      this.property = customSearch;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return SearchCustomViewFactory;

});

csui.define('csui/widgets/search.custom/impl/search.customquery.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {
  var SearchCustomModel = Backbone.Model.extend({

    constructor: function SearchCustomModel(models, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, models, options);
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  ConnectableMixin.mixin(SearchCustomModel.prototype);
  FetchableMixin.mixin(SearchCustomModel.prototype);

  _.extend(SearchCustomModel.prototype, {

    isFetchable: function () {
      return this.options.node.isFetchable();
    },

    url: function () {
      return Url.combine(this.connector.connection.url,
          'searchqueries/' + this.options.savedSearchQueryId);
    },

    parse: function (response, options) {
      response.name = response.text;
      return response;
    }
  });

  return SearchCustomModel;
});




csui.define('csui/widgets/search.custom/impl/search.customquery.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/search.custom/impl/search.customview.factory',
  'csui/widgets/search.custom/impl/search.customquery.model',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, CollectionFactory, CustomViewFactory,
    SearchCustomQueryCollection, ConnectorFactory) {

  var CustomQueryCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'customQuery',
    widgetID: '',

    constructor: function CustomQueryCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);
      this.options.customQuery = this.options[this.widgetID] || {};

      var customQuery = this.options.customQuery || {};
      if (!(customQuery instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        customQuery = new SearchCustomQueryCollection(customQuery.models, _.extend({
          savedSearchQueryId: options.customQuery.savedSearchQueryId,
          connector: connector
        }, customQuery.options, config.options));
      }
      this.property = customQuery;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CustomQueryCollectionFactory;

});

csui.define('csui/widgets/search.custom/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.custom/impl/nls/root/lang',{
  searchButtonMessage: "Search",
  title: "Custom View Search"
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearch.main',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-saved-search-form\" id=\"csui-saved-search-form\"></div>\r\n<div class=\"csui-saved-search-submit-container\">\r\n  <button class=\"binf-btn binf-btn-primary csui-custom-search-form-submit\"\r\n          id=\"csui-custom-search-form-submit\" value=\"Search\"> "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.search : stack1), depth0))
    + " </button>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearch.main', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.custom/impl/search.custom',[],function(){});
csui.define('csui/widgets/search.custom/impl/search.object.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/widgets/search.custom/impl/search.customFormView',
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/widgets/search.custom/impl/search.customquery.factory',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'i18n!csui/widgets/search.custom/impl/nls/lang',
  'hbs!csui/widgets/search.custom/impl/customsearch.main',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/contexts/factories/next.node',
  'css!csui/widgets/search.custom/impl/search.custom.css'
], function (_, $, Marionette, Backbone, SearchCustomFormView, BlockingBehavior,
    SearchQueryModelFactory, SearchCustomQueryFactory, FetchableMixin, lang, SearchObjectTemplate,
    PerfectScrollingBehavior, NextNodeModelFactory) {

  var SearchObjectView = Marionette.CompositeView.extend({
    className: "csui-custom-view-search",

    templateHelpers: function () {
      var messages = {
        search: lang.searchButtonMessage
      };
      return {
        messages: messages
      };
    },
    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".csui-saved-search-form",
        scrollYMarginOffset: 15
      }
    },
    constructor: function SearchObjectView(options) {
      options = options || {};
      options.data || (options.data = {});
      this.context = options.context;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      SearchCustomQueryFactory.prototype.propertyPrefix = options.data.savedSearchQueryId ||
                                                          options.savedSearchQueryId;
      SearchCustomQueryFactory.prototype.widgetID = options.data.savedSearchQueryId ||
                                                    options.savedSearchQueryId;
      this.model = options.context.getCollection(SearchCustomQueryFactory, options);
      this.listenTo(this.model, "sync", this.render);
      FetchableMixin.mixin(SearchCustomQueryFactory);
      var that             = this,
          _updateScrollBar = function () {
            setTimeout(function () {
              that.triggerMethod('update:scrollbar', this);
            }, 500);
          };
      this.$el.on({
        "show.binf.dropdown": _updateScrollBar,
        "hide.binf.dropdown": _updateScrollBar,
        "change input": _updateScrollBar,
        "dp.show": _updateScrollBar
      });

    },
    template: SearchObjectTemplate,
    events: {
      "click #csui-custom-search-form-submit": "loadCustomSearch"
    },
    onRender: function (e) {
      if (this.model.attributes && this.model.attributes.data) {
        if (!!this.options.parentView) {
          if (!!this.model.get("schema").title) {
            this.options.parentView.options.title = this.model.get("schema").title;
          } else {
            //consider title from server in below precedence
            //1. From server, 2. Widget options, 3. lang bundles
            this.options.parentView.options.title = (!!this.options.parentView.options.data &&
                                                     !!this.options.parentView.options.data.title) ?
                                                    this.options.parentView.options.data.title :
                                                    (this.options.parentView.options.title ||
                                                     lang.title);
          }
          this.trigger("change:title");
        } else {
          var schemaSearchTitle = !!this.model.get("schema").title ?
                                  this.model.get("schema").title : lang.title;
          if (!!this.options.titleElement) {
            this.options.titleElement.html(schemaSearchTitle);
            this.options.titleElement.attr("title", schemaSearchTitle);
          }
        }
        if (this.options.customValues) {
          this.updateCustomSearch(this.options.customValues.updatedValues,
              this.options.customValues.attributes, this.model.get("data"));
        }
        this.options.objectView = this;
        var _searchCustomFormView = new SearchCustomFormView(_.extend(this.options,
            {model: this.model}));
        var _searchCustomFormViewEle = new Marionette.Region({
          el: this.$el.find('#csui-saved-search-form')
        });
        _searchCustomFormViewEle.show(_searchCustomFormView);
        this.customFormView = _searchCustomFormView;
        //Until user enters any value the search button should be in disable mode
        var defaultValues = _.filter(_.flatten(_.map(this.model.get("data"), _.values)),
            function (val) {return val; });
        if (!!defaultValues && defaultValues.length === 0) {
          this.$(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
              "csui-search-form-submit-disabled");
        } else {
          this.$(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
              "csui-search-form-submit-disabled");
        }
      }
    },

    onRenderForm: function () {
      this.triggerMethod("dom:refresh");
      return;
    },
    onFieldUpdated: function () {
      this.loadCustomSearch();
    },

    updateCustomSearch: function (updatedFormValues, updatedValues, dataModel) {
      if (!!updatedFormValues) {
        this.model.attributes.data = _.extend(this.model.attributes.data, updatedFormValues);
      } else if (!!updatedValues) {
        var self               = this,
            cloneUpdatedValues = updatedValues;
        _.each(dataModel, function (dataVal, dataKey) {
          if (dataVal instanceof Object) {
            _.each(dataVal, function (cVal, cKey) {
              if (cVal instanceof Object) {
                _.each(cVal, function (cV, cK) {
                  if (!!cloneUpdatedValues[cK]) {
                    cVal[cK] = cloneUpdatedValues[cK];
                    delete cloneUpdatedValues[cK];
                  }
                });
              } else if (!!cloneUpdatedValues[cKey]) {
                dataVal[cKey] = cloneUpdatedValues[cKey];
                delete cloneUpdatedValues[cKey];
              }
            });
          }
        });
        //Add remaining values to model
        _.each(cloneUpdatedValues, function (val, key) {
          if (key !== "query_id") {
            var keyTokens = (key.indexOf("__") !== -1) ? key.split('__') : undefined,
                tempObj   = {};
            if (!!keyTokens) {
              var parentAttr = (keyTokens[0].indexOf("_") !== -1) ? key.split('_') : undefined;
              if (!!parentAttr) {
                tempObj[key] = val;
                var parentObj = this.model.attributes.data[parentAttr[0]];
                parentObj[keyTokens[0]] = _.extend(parentObj[keyTokens[0]], tempObj);
              } else {
                tempObj[key] = val;
                this.model.attributes.data[keyTokens[0]] = _.extend(
                    this.model.attributes.data[keyTokens[0]],
                    tempObj);
              }
            } else {
              var keyToken = (key.indexOf("_") !== -1) ? key.split('_') : undefined;
              tempObj[key] = val;
              this.model.attributes.data[keyToken[0]] = _.extend(
                  this.model.attributes.data[keyToken[0]],
                  tempObj);
            }
          }
        }, this);
      }
    },

    loadCustomSearch: function () {
      var defaultValues = this.customFormView.formView.customFilter();
      if (!!defaultValues && defaultValues.length !== 0) {
        if (this.$(".csui-custom-search-form-submit").hasClass("binf-disabled")) {
          this.$(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
              "csui-search-form-submit-disabled");
        }
        this.updatedFormValues = this.customFormView.formView.getValues();
        this.queryModel = this.options.query || this.context.getModel(SearchQueryModelFactory);
        this.nextNode = this.context.getModel(NextNodeModelFactory);
        if (!this.options.query && _.isEmpty(this.queryModel.attributes) &&
            _.isEmpty(this.nextNode.attributes)) {
          history.pushState({"search": {name: undefined, id: undefined}}, "", location.href);
        }
        this.queryModel.clear({silent: true});
        this.queryModel.updatedValues = this.updatedFormValues;
        var params = {};
        _.each(this.updatedFormValues, function (curChild) {
          if (curChild instanceof Object) {
            _.each(curChild, function (childValue, childKey) {
                  if (childValue instanceof Object) {
                    _.each(childValue, function (val, key) {
                      params[key] = val;
                    });
                  } else {
                    params[childKey] = childValue;
                  }
                }
            );
          }
        });
        params['query_id'] = this.model.get("data").templateId;
        this.resetPageDefaults();
        this.queryModel.set(params);
      } else {
        this.$(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
            "csui-search-form-submit-disabled");
      }
    },

    resetPageDefaults: function () {
      this.queryModel.resetDefaults = true;
    }
  });
  return SearchObjectView;
});

csui.define('csui/widgets/search.custom/search.custom.view',[
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/controls/tile/tile.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/widgets/search.custom/impl/search.object.view',
  'i18n!csui/widgets/search.custom/impl/nls/lang'
], function (_, Handlebars, Marionette, $, TileView, DefaultActionBehavior,
    SearchCustomObjectView, lang) {

  var CustomSearchWidgetView = TileView.extend({
    constructor: function CustomSearchWidgetView(options) {
      options || (options = {});
      options.title = options.title || lang.title;
      options.icon = options.titleBarIcon || 'title-customviewsearch';
      this.context = options.context;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },
    contentView: SearchCustomObjectView,
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    onShow: function () {
      this.$el.find('.tile-title .csui-heading').html('');
      this.listenTo(this.contentView, "change:title", this.updateTitle);
    },
    updateTitle: function () {
      this.$el.find('.tile-title .csui-heading').html(this.options.title);
      this.$el.find('.tile-title').attr("title", this.options.title);
      this.$el.find('.tile-controls').attr("title", this.options.title);
    }
  });
  return CustomSearchWidgetView;
});

csui.define('csui/widgets/search.results/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/impl/nls/root/lang',{
  loadingSearchResultMessage: "Loading search results...",
  noSearchResultMessage: "No results found",
  searchQueryKeyboardShortcut:  "Press Ctrl+F3 to go to the Search Query box",
  suggestionKeyword: "Suggestions:",
  searchSuggestion1: "Make sure all words are spelled correctly.",
  searchSuggestion2: "Try different keywords.",
  searchSuggestion3: "Try more general keywords.",
  searchSuggestion4: "Try broadening or removing the location restriction.",
  failedSearchResultMessage: "Loading search results failed.",
  owner: "Owner",
  created: "Created",
  createdBy: "Created by",
  modified: "Modified",
  size: "Size",
  type: "Type",
  items: "Items",
  searchResults: "Search Results",
  clearAll: "Clear all",
  about: "About",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  relevance: "Relevance",
  name: "Name",
  creationDate: "CreationDate",
  showMore: "Show more",
  showMoreAria: "Show more metadata",
  showLess: "Show less",
  showLessAria: "Show less metadata",
  selectAll: "Select all results on current page.",
  selectAllAria: 'Select all results on current page',
  selectItem: 'Select {0}',
  selectItemAria: 'Select {0}. When selected an action bar of options can be reached per shift-tab',
  searchBackTooltip: 'Go back',
  searchBackTooltipTo: 'to',
  searchBackToHome: 'Home',
  versionLabel: 'v',
  versionSeparator: '.',
  filter: 'Filter',
  filterExpandAria: 'Show filter panel ',
  filterCollapseAria: 'Hide filter panel ',
  customSearchTab: 'Search',
  searchFilterTab: 'Refine by',
  mimeTypeAria: 'type {0}',
  itemBreadcrumbAria: 'Breadcrumb {0}',
  formatForNone: "{0} items",
  formatForOne: "{0} item",
  formatForTwo: "{0} items",
  formatForFive: "{0} items"
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <span class=\"csui-search-facet-filter-parent\">\r\n      <span class=\"csui-search-filter icon icon-toolbarFilter\" role=\"button\"\r\n            aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.filterAria : stack1), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTooltip : stack1), depth0))
    + "\"\r\n            tabindex=\"0\" aria-expanded=\"false\"></span>\r\n    </span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-search-header\">\r\n   <span class=\"csui-search-arrow-back-parent\">\r\n   <span class=\"icon arrow_back cs-go-back\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBackTooltip : stack1), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBackTooltip : stack1), depth0))
    + "\" tabindex=\"0\" role=\"button\"></span>\r\n   </span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.enableSearchFilter : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"csui-search-header-title\"></div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results.header', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results.header.title',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-search-header-title-container csui-fadeout\">\r\n  <h2 id=\"resultsTitle\" class=\"csui-results-title\"></h2>\r\n  <div id=\"customSearchTitle\" class=\"csui-custom-search-title\"></div>\r\n</div>\r\n<span id=\"headerCount\" class=\"headerCount\"></span>\r\n<span id=\"searchHeaderCountLive\" role=\"status\" class=\"binf-sr-only\" aria-live=\"polite\"></span>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results.header.title', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/nls/root/lang',{
  aboutNHits: "About {0} hits",
  ToolbarItemReserve: "Reserve",
  ToolbarItemUnreserve: "Unreserve"
});



csui.define('css!csui/widgets/search.results/impl/search.results',[],function(){});
csui.define('csui/widgets/search.results/impl/search.results.header.title.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/impl/search.results.header.title',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, Marionette, template, publicLang, lang) {
  'use strict';

  var TitleView = Marionette.ItemView.extend({

    template: template,

    constructor: function TitleView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      resultTitle: '#resultsTitle',
      customSearchTitle: '#customSearchTitle',
      headerCount: '#headerCount',
      searchHeaderCountLive: '#searchHeaderCountLive'
    },

    _assignTotalItemElem: function () {
      this.count = this.options.count || 0;
      var countTxt     = _.str.sformat(publicLang.aboutNHits, this.count),
          countTxtAria = "";
      if (this.count !== 0) {
        countTxtAria = countTxt;
      } else {
        countTxtAria = lang.noSearchResultMessage;
      }
      this.ui.headerCount.empty();
      this.ui.headerCount.append(countTxt);

      // with aria-live for the screen reader
      this.countTextAria = lang.searchResults + ": " + countTxtAria + ". " +
                           lang.searchQueryKeyboardShortcut;
      this.ui.searchHeaderCountLive.text(this.countTextAria);

      return true;
    },

    _updateSearchResultsTitle: function () {
      var searchHeaderTitle, tooltipText;
      if (!!this.options.useCustomTitle && !!this.title) {
        this.ui.customSearchTitle.text(this.title);
        tooltipText = lang.searchResults + ': ' + this.title;
        searchHeaderTitle = lang.searchResults + ': ';
      } else {
        searchHeaderTitle = this.options.searchHeaderTitle || lang.searchResults;
        tooltipText = searchHeaderTitle;
      }
      this.ui.resultTitle.text(searchHeaderTitle);
      this.ui.resultTitle.parent().attr("title", tooltipText);
    },

    setCustomSearchTitle: function (title) {
      this.title = '"' + title + '"';
      this.ui.customSearchTitle.text(title);
      var resultsTitle = lang.searchResults + ': ';
      this.ui.resultTitle.text(resultsTitle);
      this.ui.resultTitle.parent().attr("title", resultsTitle + this.title);
    },

    onRender: function () {
      this._assignTotalItemElem();
      this._updateSearchResultsTitle();
    }

  });

  return TitleView;
});

csui.define('csui/widgets/search.results/impl/search.results.header.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/namedsessionstorage',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/pages/start/perspective.routing',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/search.results.header',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/widgets/search.results/impl/search.results.header.title.view',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Marionette, PreviousNodeModelFactory, NextNodeModelFactory,
    NamedSessionStorage, SearchQueryModelFactory, PerspectiveRouting,
    TabableRegionBehavior, lang, headerTemplate,
    ApplicationScopeModelFactory, TitleView) {
  "use strict";

  var SearchHeaderView = Marionette.ItemView.extend({
    className: "csui-search-results-header",
    template: headerTemplate,
    templateHelpers: function () {
      var messages = {
        searchResults: lang.searchResults,
        clearAll: lang.clearAll,
        about: lang.about,
        searchBackTooltip: lang.searchBackTooltip,
        searchFilterTooltip: lang.filter,
        filterAria: lang.filterExpandAria,
        enableSearchFilter: this.options.enableFacetFilter
      };
      return {
        messages: messages
      };
    },
    ui: {
      back: '.cs-go-back',
      parent: '.csui-search-arrow-back-parent',
      filter: '.csui-search-filter',
      filterParent: '.csui-search-facet-filter-parent',
      resultTitle: '.csui-results-title',
      searchHeaderTitle: '.csui-search-header-title'
    },
    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.parent': 'onClickBack',
      'keypress @ui.back': 'onClickBack',
      'click @ui.filter': 'onClickFilter',
      'keypress @ui.filter': 'onClickFilter',
      'click @ui.filterParent': 'onClickFilter'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]).hasClass('csui-acc-focusable-active') ? this.ui.filter :
               $(tabElements[0]);
      }
    },
    namedSessionStorage: new NamedSessionStorage(),
    constructor: function SearchHeaderView(options) {
      options || (options = {});
      Marionette.View.prototype.constructor.apply(this, arguments); // apply (modified) options to this
      if (this.collection) {
        this.listenTo(this.collection, 'reset', this.render) // render after reset of collection
            .listenTo(this.collection, 'remove', this._collectionItemRemoved);
      }
      // Use a local clone to remember the node, which may have been visited
      // before the page with this widget got open; the original previousNode
      // gets reset with every perspective change
      this.previousNode = options.context.getModel(PreviousNodeModelFactory).clone();
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      if (this.applicationScope.previous('id') === "") { /* Previous page is Home Page */
        if (this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) {
          /* Clear previous node info from sessionStorage as previous page is home page */
          this.namedSessionStorage.remove("previousNodeName");
          this.namedSessionStorage.remove("previousNodeId");
        }
      }
    },
    initialize: function () {
      this.titleView = this.options.titleView || new TitleView({});
    },
    onRender: function () {
      _.extend(this.titleView.options, {
        count: this.collection.totalCount,
        searchHeaderTitle: this.collection.searching ?
                           this.collection.searching.result_title : lang.searchResults
      });

      this.titleView.render();

      Marionette.triggerMethodOn(this.titleView, 'before:show', this.titleView, this);
      this.ui.searchHeaderTitle.append(this.titleView.el);
      Marionette.triggerMethodOn(this.titleView, 'show', this.titleView, this);

      if (this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
      }

      this.rendered = true;
      this.$el.show();
      // This checks the whole browser history, since the page has been loaded;
      // not just the history in the window, since the Smart UI has appeared there.
      // Making the page behave differently, when opened in the browser directly
      // and when navigating to it from some link is a bad practice.  UI breaks
      // the principle, that the URL shows a resource in the same way.  *If you
      // reload the page - it is just hitting F5 - the artificial state built
      // among the internal navigation gets lost anyway*.  It is better to leave
      // the browser history on the browser and its handling on the browser and
      // its buttons and not trying to "help the user" by duplicating the
      // functionality like this.
      if (this.options.enableBackButton) {
        this.ui.back.attr('title', this.options.backButtonToolTip);
        this.ui.back.attr('aria-label', this.options.backButtonToolTip);
      } else if (PerspectiveRouting.getInstance(this.options).hasRouted() || history.state ||
                 this.previousNode.get('id') ||
                 (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        // In integration scenario we cannot depend on history.state to show back button.
        //So providing a option to show backbutton based on option
        this._setBackButtonTitle();
      } else {
        this.ui.back.hide();
        this.ui.parent.hide();
      }
    },
    onBeforeDestroy: function () {
      this.titleView.destroy();
    },

    _setBackButtonTitle: function () {
      var name;
      if (this.searchQuery.attributes.location_id1 === undefined && !this.previousNode.get('id') &&
          !(this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        name = lang.searchBackToHome;
        this.namedSessionStorage = null;
      }
      else {
        if (this.previousNode.get('id')) {
          name = this.previousNode.get('name');
          this.namedSessionStorage.set("previousNodeName", this.previousNode.get('name'));
          this.namedSessionStorage.set("previousNodeId", this.previousNode.get('id'));
        }
        else {
          name = this.namedSessionStorage.get("previousNodeName");
        }
      }
      this.ui.back.attr('title', lang.searchBackTooltip + " " + lang.searchBackTooltipTo +
                                 " '" + name + "'");
      this.ui.back.attr('aria-label', lang.searchBackTooltip + " " + lang.searchBackTooltipTo +
                                 " '" + name + "'");
    },

    setCustomSearchTitle: function (title) {
      !!this.titleView.setCustomSearchTitle &&
      this.titleView.setCustomSearchTitle(title);
    },
    _collectionItemRemoved: function () {
      var originalCount = this.collection.totalCount;
      this.collection.totalCount = --this.totalCount;
      this.render();
      this.collection.totalCount = originalCount;
    },
    onClickBack: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableBackButton) {
          event.stopPropagation();
          //To notify the caller about back button navigation
          //as we dont have previousNode in integration scenario
          this.trigger("go:back");
        } else if (this.previousNode.get('id') ||
                   (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
          this.nextNode.set('id', this.namedSessionStorage.get("previousNodeId"));
        } else {
          this.applicationScope.set('id', '');
        }
      }
    },

    onClickFilter: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableFacetFilter) {
          event.stopPropagation();
          this.trigger("toggle:filter", this.options.originatingView);
          this.trigger("focus:filter", this.options.originatingView);
        }
      }
    }
  });

  return SearchHeaderView;

});

csui.define('csui/widgets/search.results/controls/sorting/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/controls/sorting/impl/nls/root/localized.strings',{
  sortBy: 'Sort by...',
  sortByThis: 'Sort by {0}',
  sortOptionsAria: 'Sort options',
  ascending: '{0}: Click to sort ascending',
  descending: '{0}: Click to sort descending'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/controls/sorting/impl/sort.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-search-sort-options \">\r\n    <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-btn-default binf-dropdown-toggle\"\r\n            data-binf-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.sortButtonAria || (depth0 != null ? depth0.sortButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sortButtonAria","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"cs-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n      <span class=\"cs-icon icon-caret-down\"></span>\r\n    </button>\r\n    <ul class=\"binf-dropdown-menu\" role=\"menu\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.listAria || (depth0 != null ? depth0.listAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"listAria","hash":{}}) : helper)))
    + "\"></ul>\r\n  </div>\r\n  <a href=\"javascript:void(0);\" id=\"search-sort-btn\" class=\"cs-icon icon-sortArrowDown\"></a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.sortEnable : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_search.results_controls_sorting_impl_sort.menu', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/controls/sorting/sort.menu.view',['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'i18n!csui/widgets/search.results/controls/sorting/impl/nls/localized.strings',
  'hbs!csui/widgets/search.results/controls/sorting/impl/sort.menu',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/binf/js/binf'
], function (module, require, $, _, Backbone, Marionette, log, lang, template,
    PerfectScrollingBehavior, TabableRegionBehavior) {

  var SearchSortingView = Marionette.ItemView.extend({

    className: 'cs-sort-links',
    template: template,
    templateHelpers: function () {
      var messages = {
        sortBy: lang.sortBy
      };
      var selectedTitle = this.selected.get('title') ? this.selected.get('title') :
                          this.constants.DEFAULT_SORT;
      return {
        messages: messages,
        sortEnable: !!this.collection.sorting,
        id: _.uniqueId('sortButton'),
        sortButtonAria: lang.sortOptionsAria,
        listAria: lang.sortOptionsAria
      };
    },

    constants: {
      SORT_ASC: "asc",
      SORT_DESC: "desc",
      DEFAULT_SORT: "relevance"
    },

    events: {
      'click .binf-dropdown-menu > li > a': 'onSortOptionClick',
      'click #search-sort-btn': 'onSortOrderClick',
      "keydown": "onKeyInView"
    },

    ui: {
      toggle: '>.csui-search-sort-options>.binf-dropdown-toggle',
      selectedLabel: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-label',
      selectedIcon: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-icon',
      sortOrderBtn: '#search-sort-btn'
    },

    constructor: function SearchSortingView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);

      this.config = this.options.config || {};

      this.selected = new Backbone.Model();
      if (this.collection) {
        this.collection.setOrder(this.options.orderBy, false);
        this.listenTo(this.collection, 'reset', this.render); // render after reset of collection
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
    },

    onRender: function () {
      this.ui.toggle.binf_dropdown();
      this.ui.sortOrderBtn.hide();
      if (this.collection.sorting !== undefined) {
        if (this.collection.sorting.sort) {
          this._setSelection(this.collection.sorting.links[this.collection.sorting.sort]);
          this._addDropdownItems(this.collection.sorting.links, this.collection.sorting.sort[0]);
          this.ui.sortOrderBtn.show();
        } else {
          this._setSelection(this.collection.sorting.links[this.constants.DEFAULT_SORT]);
          this._addDropdownItems(this.collection.sorting.links, "");
          this.$el.find(".binf-dropdown-menu > :first-child").addClass("binf-active");
          this.$el.find(".binf-dropdown-menu > :first-child .cs-icon").addClass("icon-listview-checkmark");
          this.ui.sortOrderBtn.hide();
        }
        this.ui.selectedLabel.text(this.selected.get('title'));
        if (this.selected.get("order") === this.constants.SORT_ASC) {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
          this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
          var titleD = _.str.sformat(lang.descending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleD).attr('aria-label', titleD);
        } else {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
          this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
          var titleA = _.str.sformat(lang.ascending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleA).attr('aria-label', titleA);
        }
      }
    },
    onKeyInView: function (event) {
      // Watch for tab key
      if (event.keyCode === 9) {
        !!this.$el.find('.binf-open') && this.$el.find('.binf-open').removeClass('binf-open');
      }

    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.binf-dropdown-menu',
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        if (this.orderClicked) {
          return this.ui.sortOrderBtn;
        } else {
          return $(tabElements[0]);
        }
      }
    },

    _setSelection: function (model) {
      var sortObj = {};
      if (this.collection.sorting.sort) {
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_DESC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/desc_/g, '');
          sortObj.order = this.constants.SORT_DESC;
        }
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_ASC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/asc_/g, '');
          sortObj.order = this.constants.SORT_ASC;
        }
      } else {
        sortObj.id = "";
        sortObj.order = this.constants.SORT_DESC;
      }
      sortObj.title = _.str.trim((model && model.name) ? this.trimSortOptionName(model.name) :
                                 "empty");
      var titleVal = _.str.sformat(lang.sortByThis, sortObj.title);
      this.$el.find('.csui-search-sort-options 	.binf-dropdown-toggle').attr('title', titleVal);
      this.selected.set(sortObj);
    },

    _updateSelection: function () {
      this.ui.selectedLabel.text(this.selected.get('title'));
    },

    _refreshSelection: function (model) {
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model);
      }
    },

    resetCollection: function (filter, autoFetch) {
      this.collection.setOrder(filter, true);
    },

    sortPage: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var orderBy = [];
      if (e.currentTarget.id !== "") {
        orderBy.push(e.currentTarget.id + " " + this.constants.SORT_DESC);
      } else {
        orderBy.push(e.currentTarget.id);
      }
      this.resetCollection(orderBy.join(), true);
    },

    _addDropdownItems: function (sorting, activeOption) {
      var jqUl = this.$el.find('.binf-dropdown-menu'),
          self = this;
      if (sorting[this.constants.DEFAULT_SORT]) {
        jqUl.append(
            '<li role="presentation"><a role="menuitem" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
            self.trimSortOptionName(sorting[self.constants.DEFAULT_SORT].name) + '">' +
            self.trimSortOptionName(sorting[self.constants.DEFAULT_SORT].name) +
            '</span></a></li>');
        delete sorting[self.constants.DEFAULT_SORT];
      }

      for (var sort in sorting) {
        if (sort.search("asc_") === 0) {
          delete sorting[sort];
        } else {
          if (activeOption.split(/_(.+)/, 2)[1] === sort.split(/_(.+)/, 2)[1]) {
            jqUl.append('<li role="presentation" class="binf-active"><a role="menuitem" id="' +
                        sort.replace(/desc_/g, '') +
                        '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon icon-listview-checkmark"></span><span class="cs-label" title="' +
                        self.trimSortOptionName(sorting[sort].name) + '">' +
                        self.trimSortOptionName(sorting[sort].name) + '</span></a></li>');
          } else {
            jqUl.append('<li role="presentation"><a role="menuitem" id="' +
                        sort.replace(/desc_/g, '') +
                        '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
                        self.trimSortOptionName(sorting[sort].name) + '">' +
                        self.trimSortOptionName(sorting[sort].name) + '</span></a></li>');
          }
        }
      }
    },

    activate: function (element) {
      if (this.$el.find("li").hasClass("binf-active") === true) {
        this.$el.find("li").removeClass("binf-active");
        this.$el.find("li .cs-icon").removeClass("icon-listview-checkmark");
      }
      $(element.parentElement).addClass("binf-active");
      $(element).find("span.cs-icon").addClass("icon-listview-checkmark");
    },

    resetSelection: function (id, name) {
      var sortObj = {};
      sortObj.id = id;
      sortObj.title = _.str.trim(name);
      sortObj.order = this.constants.SORT_DESC;
      this.selected.set(sortObj);
    },

    onSortOptionClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.sortOrderBtn.hide();
      this.orderClicked = false;
      this.activate(event.currentTarget);
      this.resetSelection(event.currentTarget.id, event.currentTarget.children[1].innerHTML);
      this.sortPage(event);
      this.ui.toggle.binf_dropdown('toggle');
    },

    onSortOrderClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.orderClicked = true;
      var orderBy = [];
      if (this.ui.sortOrderBtn.hasClass("icon-sortArrowDown")) {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
        this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
        orderBy.push(this.selected.id + " " + this.constants.SORT_ASC);
      } else {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
        this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
        orderBy.push(this.selected.id + " " + this.constants.SORT_DESC);
      }
      this.collection.setOrder(orderBy.join(), true);
    },

    trimSortOptionName: function (name) {
      return name.replace(/\(([;\s\w\"\=\,\:\.\/\~\{\}\?\!\-\%\&\#\$\^\(\)]*?)\)/g, "");
    }

  });

  return SearchSortingView;
});



csui.define('csui/widgets/search.results/impl/toolbaritems',['csui/lib/underscore', "module",
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/search.results/impl/toolbaritems'
], function (_, module, extraToolItems) {

  // TODO: Deprecate this module

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      // TODO: log a deprecation warning
    });
  }

  return extraToolItems;

});

csui.define('csui/widgets/search.results/toolbaritems',[
  'csui/lib/underscore',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/search.results/toolbaritems',
  // Load extra tool items from the previous module location
  'csui/widgets/search.results/impl/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, extraToolItems,
             oldExtraToolItems) {
  'use strict';

  // Keep the keys in sync with csui/widgets/search.results/toolbaritems.masks
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
        filter: [
          {signature: "Filter", name: lang.ToolbarItemFilter, icon: "icon icon-toolbarFilter"}
        ]
      },
      {
        addTrailingDivider: false
      }),
    otherToolbar: new ToolItemsFactory({
        info: [
          {
            signature: "Properties",
            name: lang.ToolbarItemInfo,
            icon: "icon icon-toolbar-metadata"
          }
        ],
        share: [
          {signature: "CopyLink", name: lang.ToolbarItemCopyLink},
          {
            signature: 'Share',
            name: lang.ToolbarItemShare,
            flyout: 'share',
            group: 'share'
          },
          {
            signature: 'EmailLink',
            name: lang.ToolbarItemEmailLink,
            flyout: 'share',
            promoted: true,
            group: 'share'
          }
        ],
        edit: [
          {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
          {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
          {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
          {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
        ],
        main: [
          {signature: "permissions", name: lang.ToolbarItemPermissions},
          {signature: "Download", name: lang.ToolbarItemDownload},
          {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
          {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
          {signature: "Copy", name: lang.ToolbarItemCopy},
          {signature: "Move", name: lang.ToolbarItemMove},
          {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
          {signature: "Delete", name: lang.ToolbarItemDelete}
        ]
      },
      {
        maxItemsShown: 5,
        dropDownText: lang.ToolbarItemMore,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false,
        lazyActions:true
      }),
    inlineToolbar: new ToolItemsFactory({
        info: [
          {
            signature: "Properties", name: lang.ToolbarItemInfo,
            icon: "icon icon-toolbar-metadata"
          }
        ],
        share: [
          {
            signature: "CopyLink", name: lang.ToolbarItemCopyLink,
            icon: "icon icon-toolbar-copylink"
          }
        ],
        edit: [
          {signature: "Edit", name: lang.ToolbarItemEdit, icon: "icon icon-toolbar-edit"}
        ],
        other: [
          {signature: "permissions", name: lang.ToolbarItemPermissions, icon: "icon icon-toolbar-permissions"},
          {
            signature: "Download", name: lang.ToolbarItemDownload,
            icon: "icon icon-toolbar-download"
          },
          {
            signature: "ReserveDoc", name: publicLang.ToolbarItemReserve,
            icon: "icon icon-toolbar-reserve"
          },
          {
            signature: "UnreserveDoc",
            name: publicLang.ToolbarItemUnreserve,
            icon: "icon icon-toolbar-unreserve"
          },
          {signature: "Copy", name: lang.ToolbarItemCopy, icon: "icon icon-toolbar-copy"},
          {signature: "Move", name: lang.ToolbarItemMove, icon: "icon icon-toolbar-move"},
          {
            signature: "AddVersion",
            name: lang.ToolbarItemAddVersion,
            icon: "icon icon-toolbar-add-version"
          },
          {signature: "Delete", name: lang.ToolbarItemDelete, icon: "icon icon-toolbar-delete"}
        ]
      },
      {
        maxItemsShown: 6,
        dropDownText: lang.ToolbarItemMore,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false
      }),
    versionToolItems : ['properties', 'open', 'download', 'delete']
  };

  if (oldExtraToolItems) {
    addExtraToolItems(oldExtraToolItems);
  }

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
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

  return toolbarItems;
});

csui.define('csui/widgets/search.results/toolbaritems.masks',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  // Keep the keys in sync with csui/widgets/search.results/toolbaritems
  var toolbars = ['otherToolbar', 'inlineToolbar'];

  function ToolbarItemsMasks() {
    var config = module.config(),
        globalMask = new GlobalMenuItemsMask();
    // Create and populate masks for every toolbar
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      var mask = new ToolItemMask(globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        source = source[toolbar];
        if (source) {
          mask.extendMask(source);
        }
      });
      // Enable restoring the mask to its initial state
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/controls/expandall/impl/expandall',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-search-expandall-wrapper\">\r\n  <div class=\"csui-search-expandall-text\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "</div>\r\n  <button class=\"csui-search-header-expand-all icon-expandArrowDown\"\r\n     aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "\" aria-pressed=\"false\"></button>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_controls_expandall_impl_expandall', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.results/controls/expandall/impl/expandall',[],function(){});
csui.define('csui/widgets/search.results/controls/expandall/expandall.view',['csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/controls/expandall/impl/expandall',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/controls/expandall/impl/expandall'
], function ($, Marionette, template, lang) {

  var expandAllView = Marionette.ItemView.extend({

    template: template,
    templateHelpers: function () {
      var messages = {
        expandAll: lang.expandAll
      };
      return {
        messages: messages
      };
    },

    events: {
      'click .icon-expandArrowDown, .icon-expandArrowUp': 'expandAll'
    },

    ui: {
      expandAllSelector: '.csui-search-header-expand-all'
    },

    expandAll: function (event) {
      if (this.collection.length > 0) {
        var that = this;
        if (this.ui.expandAllSelector[0].classList.contains(this.options._eleCollapse)) {
          $(".csui-search-expandall-text").html(lang.expandAll);
          $(".csui-expand-all").removeClass("csui-collapse-all");
          this.ui.expandAllSelector.removeClass(this.options._eleCollapse).addClass(
              this.options._eleExpand).attr('title', lang.expandAll).attr('aria-pressed', 'false');
          this.options.view.$el.find("." + this.options._eleCollapse).each(function (e) {
            $(this).trigger('click');
          });
          if (this.options.view.options.layoutView) {
            this.options.view.options.layoutView.updateScrollbar();
          }
        } else {
          $(".csui-search-expandall-text").html(lang.collapseAll);
          $(".csui-expand-all").addClass("csui-collapse-all");
          this.ui.expandAllSelector.removeClass(this.options._eleExpand).addClass(
              this.options._eleCollapse).attr('title', lang.collapseAll).attr('aria-pressed', 'true');
          this.options.view.$el.find("." + this.options._eleExpand).each(function (e) {
            if (!$(this)[0].classList.contains(that.options._eleCollapse)) {
              $(this).trigger('click');
            }
          });
        }
        event.preventDefault();
        event.stopPropagation();
      }
    },

    pageChange: function () {
      if (this.ui.expandAllSelector[0].classList.contains(this.options._eleCollapse)) {
        this.ui.expandAllSelector.removeClass(this.options._eleCollapse).addClass(
            this.options._eleExpand);
        $(".csui-search-expandall-text").html(lang.expandAll);
      }
    }

  });

  return expandAllView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/metadata/search.metadata',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-search-metadata binf-col-lg-4 binf-col-md-4 binf-col-sm-4\r\n                    binf-col-xs-4\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</span>\r\n<span class=\"csui-search-metadata-spacer binf-col-lg-1 binf-col-md-1 binf-col-sm-1\r\n     binf-col-xs-1\"></span>\r\n<span class=\"searchDetails binf-col-lg-7 binf-col-md-7 binf-col-sm-7\r\n                    binf-col-xs-7\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltipText || (depth0 != null ? depth0.tooltipText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltipText","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "</span>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_metadata_search.metadata', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/impl/metadata/search.metadata.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/metadata/search.metadata',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, base, lang, itemTemplate) {
  "use strict";

  var SearchMetadataItemView = Marionette.ItemView.extend({
    className: "csui-search-item-details binf-col-lg-12",
    template: itemTemplate,
    templateHelpers: function () {
      var displayCount = 0;
      if (this.options.searchItemModel.get("description").length > 0 ||
          this.options.searchItemModel.get("summary").length > 0) {
        displayCount = 3;
      } else {
        displayCount = 2;
      }
      if (this._index < displayCount) {
        if (this._index < 2) {
          this.$el.addClass("csui-search-result-item-tobe-hide");
        }
      } else {
        this.$el.addClass(
            "csui-search-hidden-items truncated-" + this.options.rowId);
      }
      this.$el.attr('role', 'listitem');
      var data = this.getValueData();
      return {
        label: this.model.get("column_name"),
        value: data.formattedValue,
        tooltipText: data.value
      };
    },
    getValueData: function () {
      var model          = this.options.searchItemModel,
          column         = this.model.get("key"),
          columnType     = this.model.get("column_type"),
          value          = model.get(column),
          formattedValue = value;
      if (column === 'size') {
        var type = model.get('type');
        formattedValue = model.get(column + "_formatted");
        if (value === null) {
          return '';
        }
        if (model.get('container') && type !== 202 && type !== 899) {
          value = formattedValue = base.formatMessage(value, lang);
        } else if (type === 144 || type === 749 || type === 736 || type === 30309) {
          formattedValue = base.formatFriendlyFileSize(value);
          value = base.formatExactFileSize(value);
        }
      }
      if (columnType === 'date') {
        value = formattedValue = base.formatExactDateTime(value);
      }
      return {
        value: value,
        formattedValue: formattedValue
      };
    }
  });

  var SearchMetadataCollectionView = Marionette.CollectionView.extend({
    className: "csui-search-items-metadata",
    childView: SearchMetadataItemView,
    ui: {
      fieldsToBeHiddenOnHover: '.csui-search-result-item-tobe-hide'
    },
    childViewOptions: function () {
      return {
        rowId: this.options.rowId,
        searchItemModel: this.model
      };
    },
    filter: function (child, index, collection) {
      if (child.get('key') === 'size') {
        return (this.model.get(child.get('key')) &&
                this.model.get(child.get('key') + "_formatted") !== "");
      } else {
        return (this.model.get(child.get('key')) && this.model.get(child.get('key')) !== "");
      }
    },
    onRender: function () {
      var collection = this.collection;
      this.bindUIElements();
    }
  });

  return SearchMetadataCollectionView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"csui-search-left-panel-tabs\">\r\n            <ul>\r\n              <li class=\"csui-tab csui-search-custom-tab\">\r\n                <a title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.customSearchTab : stack1), depth0))
    + "\" tabindex=\"0\">\r\n                  <span>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.customSearchTab : stack1), depth0))
    + "</span>\r\n                </a>\r\n              </li>\r\n              <li class=\"csui-tab csui-search-facet-tab\">\r\n                <a title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTab : stack1), depth0))
    + "\" tabindex=\"0\">\r\n                  <span>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTab : stack1), depth0))
    + "</span>\r\n                </a>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "            <div class=\"csui-search-results-custom\">\r\n              <div id=\"csui-search-custom-container\"></div>\r\n            </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- TODO: need to apply localization -->\r\n<div id=\"header\"></div>\r\n<div class=\"binf-container-fluid\">\r\n  <div class=\"csui-facet-table-container\">\r\n    <div class=\"csui-search-left-panel csui-popover-panel csui-is-hidden\">\r\n      <div class=\"csui-popover-panel-container\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.enableCustomSearch : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <div class=\"csui-search-left-panel-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.enableCustomSearch : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <div id=\"facetview\" class=\"csui-facetview\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-search-results-body binf-col-lg-12 binf-col-md-12 binf-col-xs-12\">\r\n      <div id=\"csui-search-custom-results\">\r\n        <div class=\"csui-search-results-content binf-col-lg-12 binf-col-md-12\">\r\n          <div id=\"facetbarview\"></div>\r\n          <div\r\n              class=\"csui-search-tool-container binf-hidden binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n            <div\r\n                class=\"csui-search-header-left-actions binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n              <div class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n                <div id=\"selectAllCheckBox\" class=\"csui-select-all csui-search-item-check\"></div>\r\n                <div id=\"toolbar\"\r\n                     class=\"csui-search-toolbar binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n              </div>\r\n            </div>\r\n            <div class=\"csui-search-header-right-actions\">\r\n              <div class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n                <div\r\n                    class=\"csui-search-sorting binf-col-lg-6 binf-col-md-6 binf-col-sm-6 binf-col-xs-6\"\r\n                    id=\"csui-search-sort\"></div>\r\n                <div class=\"csui-expand-all binf-col-lg-6 binf-col-md-6 binf-col-sm-6 binf-col-xs-6\"\r\n                     id=\"expandAllArrow\"></div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div id=\"results\" tabindex=\"-1\"\r\n               class=\"csui-result-list binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n          <div\r\n              class=\"csui-search-row-divider binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n        </div>\r\n\r\n        <div id=\"pagination\"\r\n             class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.result',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.xif || (depth0 && depth0.xif) || helpers.helperMissing).call(depth0,"this.search_result_metadata.current_version === false || this\r\n                .search_result_metadata.version_type ==='minor' ",{"name":"xif","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.versions : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <div class=\"csui-search-results-version csui-search-item-version-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\">\r\n                      <a href=\"javascript:void(0);\" class=\"csui-search-version-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.versionLabel : stack1), depth0))
    + " "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.versions : depth0)) != null ? stack1.version_number_name : stack1), depth0))
    + "\r\n                      </a>\r\n                    </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "            <div class=\"csui-search-item-breadcrumb csui-search-item-breadcrumb-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n            <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    return "";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "              "
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "\r\n";
},"11":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-item-action-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "-"
    + this.escapeExpression(((helper = (helper = helpers.version_id || (depth0 != null ? depth0.version_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"version_id","hash":{}}) : helper)))
    + " csui-search-item-inline-actions\"></div>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-item-action-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + " csui-search-item-inline-actions\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-search-item-row-wrapper csui-search-item-complete-row binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n  <div class=\"csui-search-item-row binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <h3 class=\"csui-search-item-hide-h3\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</h3>\r\n    <div class=\"csui-search-item-check\"></div>\r\n    <div class=\"csui-search-item-icon "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.inactiveclass : stack1), depth0))
    + "\">\r\n      <span class=\"csui-type-icon\"></span>\r\n    </div>\r\n    <div class=\"csui-search-col2 binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n      <div class=\"csui-search-item-left-panel binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n        <div class=\"csui-search-item\">\r\n          <div class=\"\">\r\n            <div class=\"csui-search-item-name \">\r\n              <a href="
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.mimeTypeAria || (depth0 != null ? depth0.mimeTypeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mimeTypeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"\r\n                 class=\"csui-search-item-link "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.inactiveclass : stack1), depth0))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.search_result_metadata : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "              <div class=\"csui-icon csui-search-results-reservation csui-search-item-reservation\r\n                  csui-search-item-reservation-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"csui-search-item-content-wrapper binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.enableBreadcrumb : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <p class=\"csui-search-item-desc csui-overflow-description binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.summary : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0)})) != null ? stack1 : "")
    + "          </p>\r\n        </div>\r\n        <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12\r\n        binf-col-xs-12 csui-search-row-spacer-divider\"></div>\r\n      </div>\r\n      <div class=\"csui-search-item-center-panel binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n      <div class=\"csui-search-item-right-panel\">\r\n        <div class=\"csui-search-item-control-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + " binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n          <div class=\"csui-search-toolbar-container binf-hidden binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.version_id : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(13, data, 0)})) != null ? stack1 : "")
    + "          </div>\r\n          <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n          <div role=\"list\" class=\"csui-search-item-details-wrapper binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-search-item-action-panel csui-search-item-action-panel-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\">\r\n      <div class=\"csui-search-item-fav search-fav-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.result', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.empty',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-no-result-message-wrapper\">\r\n    <p class=\"csui-no-result-message\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n    <div class=\"csui-display-hide\">\r\n        <ul class=\"csui-search-suggestion-list\">\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion1 || (depth0 != null ? depth0.searchSuggestion1 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion1","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion2 || (depth0 != null ? depth0.searchSuggestion2 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion2","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion3 || (depth0 != null ? depth0.searchSuggestion3 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion3","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion4 || (depth0 != null ? depth0.searchSuggestion4 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion4","hash":{}}) : helper)))
    + "</li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.empty', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/search.results.view',[
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/search.results/impl/search.results.header.view',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks',
  'csui/controls/table/cells/favorite/favorite.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/widgets/search.results/controls/expandall/expandall.view',
  'csui/controls/table/cells/reservation/reservation.view',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/widgets/search.results/impl/metadata/search.metadata.view',
  'csui/controls/globalmessage/globalmessage',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/models/nodeancestors',
  'csui/utils/contexts/factories/node',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/utils/commands/properties',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!csui/widgets/search.results/impl/search.results',
  'hbs!csui/widgets/search.results/impl/search.result',
  'hbs!csui/widgets/search.results/impl/search.empty',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/utils/node.links/node.links',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover'

], function (module, _, $, Backbone, Marionette, base, SearchQueryModelFactory,
    SearchResultsCollectionFactory, LayoutViewEventsPropagationMixin, HeaderView,
    TableToolbarView, PaginationView, SortingView, BlockingView, toolbarItems,
    ToolbarItemsMasks, FavoritesView, CheckboxView, ExpandAllView,
    Reservation, SearchObjectView, SearchMetadataFactory, SearchMetadataView, GlobalMessage,
    lang, TableActionBarView, NodeSpriteCollection, NodeTypeIconView, BreadcrumbsView,
    NodeAncestorCollection, NodeModelFactory, NodeModel, NodeCollection, PropertiesCommand,
    DefaultActionBehavior, PerfectScrollingBehavior, ToolbarCommandController, layoutTemplate,
    itemTemplate, emptyTemplate, defaultActionItems, commands, ModalAlert,
    FacetPanelView, FacetBarView, nodeLinks) {
  'use strict';
  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true
  }, module.config());

  var NoSearchResultView = Marionette.ItemView.extend({

    className: 'csui-empty',
    template: emptyTemplate,

    constructor: function NoSearchResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }

  });

  var SearchResultItemView = Marionette.LayoutView.extend({

    className: 'binf-list-group-item binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: itemTemplate,

    regions: {
      favRegion: ".csui-search-item-fav",
      selectionRegion: ".csui-search-item-check",
      searchMetadataRegion: ".csui-search-item-details-wrapper",
      breadcrumbRegion: ".csui-search-item-breadcrumb",
      reservationRegion: ".csui-search-item-reservation"
    },

    ui: {
      descriptionField: '.csui-overflow-description',
      modifiedByField: '.csui-search-modified-by',
      metadataDetails: '.csui-search-item-details',
      inlineToolbarContainer: '.csui-search-toolbar-container',
      inlineToolbar: '.csui-search-item-row'
    },

    events: {
      'click .csui-search-item-link': 'openSearchItem',
      'click .csui-search-version-label': 'openVersionHistory',
      'click .icon-expandArrowUp': 'showMetadataInfo',
      'click .icon-expandArrowDown': 'hideMetadataInfo'
    },

    templateHelpers: function () {

      var defaultActionController = this.options.defaultActionController,
          checkModelHasAction     = defaultActionController.hasAction.bind(defaultActionController),
          inActiveClass           = checkModelHasAction(this.model) ? "" :
                                    "csui-search-no-default-action",
          messages                = {
            created: lang.created,
            createdby: lang.createdBy,
            modified: lang.modified,
            owner: lang.owner,
            type: lang.type,
            items: lang.items,
            showMore: lang.showMore, // where does this show up
            showLess: lang.showLess,
            versionLabel: lang.versionLabel,
            versionSeparator: lang.versionSeparator,
            inactiveclass: inActiveClass,
            enableBreadcrumb: config.enableBreadcrumb
          },
          defaultActionUrl        = nodeLinks.getUrl(this.model),
          parent                  = this.model.attributes.ancestors &&
                                    this.model.attributes.ancestors.length > 0 ?
                                    this.model.attributes.ancestors.slice(-1)[0] : undefined,
          parentName              = parent && parent.attributes ? parent.attributes.name :
                                    undefined;

      return {
        showOwner: this.model.attributes.hasOwnProperty('owner_user_id'), // LPAD-61022: hide owner, if not set in response
        messages: messages,
        defaultActionUrl: defaultActionUrl,
        cid: this.cid,
        itemBreadcrumb: _.str.sformat(lang.itemBreadcrumbAria, parentName),
        mimeTypeAria: _.str.sformat(lang.mimeTypeAria, this.model.get('mime_type_search'))
      };
    },

    openSearchItem: function (event) {
      event.preventDefault();
      this.trigger("click:item", this.model);
    },

    constructor: function SearchResultItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.model.attributes.mime_type = !!this.model.attributes.mime_type ?
                                        this.model.attributes.mime_type :
                                        (this.model.attributes.versions ?
                                         this.model.attributes.versions.mime_type : "");
      _.extend(this.model.attributes, {
        collection_id: this.model.cid,
        // TODO: Share the better type name used by NodeTypeIconView
        mime_type_search: NodeSpriteCollection.findTypeByNode(this.model)
      });

      this._rowStates = options.rowStates;
      this.addOwnerDisplayName();
      this.addCreatedUserDisplayName();

      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          this._selectionChanged
      );

      this.listenTo(this.model, 'change', function () {
        // Ignore the sole 'change:csuiDelayedActionsRetrieved' event and not re-render every row
        // for all rows in the collection.  This has performance impact and flickering effect.
        // Only the TableActionToolbar should be re-rendered, and it is already done by itself
        // with delayedActions event listening.
        if (_.size(this.model.changed) === 1 &&
            _.has(this.model.changed, 'csuiDelayedActionsRetrieved')) {
          return;
        }
        this.render();
        this.updateItemdetails();
      });

      if (base.isAppleMobile() === false) {
        this.$el.on('mouseenter.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverStart, this));
        this.$el.on('mouseleave.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverEnd, this));
      }
    },

    _hoverStart: function () {
      this.showInlineActions();
    },

    _hoverEnd: function () {
      this.hideInlineActions();
    },

    _selectionChanged: function (rowStatesModel) {
      var previous = rowStatesModel.previous(SearchResultsView.RowStatesSelectedRows);
      var changed = rowStatesModel.changed[SearchResultsView.RowStatesSelectedRows];

      var deselected = _.difference(previous, changed);
      var selected = _.difference(changed, previous);

      var id = this.model.get('id');

      if (_.contains(deselected, id)) {
        this._checkboxView.setChecked(false);
        this.ui.inlineToolbar.removeClass('selected');
      }
      if (_.contains(selected, id)) {
        this._checkboxView.setChecked(true);
        this.ui.inlineToolbar.addClass('selected');

        this.hideInlineActions(); // hide if a item was selected by checkbox
      }
    },

    initActionViews: function (options) {
      this.favView = new FavoritesView({
        tagName: 'div',
        focusable: true,
        model: options.model,
        context: options.context,
        tableView: options.tableView
      });

      var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      var checked = _.contains(selectedModelIds, this.model.get('id'));
      var checkboxTitle = _.str.sformat(lang.selectItem, options.model.get('name'));
      var checkboxAriaLabel = _.str.sformat(lang.selectItemAria, options.model.get('name'));

      var selectable = options.model.get('selectable') !== false;
      this._checkboxView = new CheckboxView({
        checked: checked ? 'true' : 'false',
        disabled: !selectable,
        ariaLabel: checkboxAriaLabel,
        title: checkboxTitle
      });

      this.listenTo(this._checkboxView.model, 'change:checked', function (event) {
        this._markAsSelected(event.changed.checked === 'true');
      });

      this.reservation = new Reservation({
        tagName: 'div',
        model: options.model,
        context: options.context
      });

      //options.models = SearchMetadataItems;
      options.connector = options.model.connector;
      this.searchMetadataView = new SearchMetadataView({
        rowId: this.cid,
        collection: this.options.metadata,
        model: this.model
      });
      if (!!config.enableBreadcrumb) {
        this.addBreadcrumbs(options);
      }
    },

    _markAsSelected: function (select) {
      var newSelectedModelIds;
      var modelId = this.model.get('id');
      var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      if (select) {
        if (!_.contains(selectedModelIds, modelId)) {
          newSelectedModelIds = selectedModelIds.concat([modelId]);
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      } else {
        if (_.contains(selectedModelIds, modelId)) {
          newSelectedModelIds = _.without(selectedModelIds, modelId);
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      }
    },

    addBreadcrumbs: function (options) {
      var ancestors = new NodeAncestorCollection(
          options.model.attributes.ancestors, {
            node: options.model, autofetch: false
          });
      this.breadcrumbsView = new BreadcrumbsView({
        context: options.context,
        collection: ancestors
        // TODO: Use {fetchOnCollectionUpdate: false} to prevent
        // the control from an extra fetching of the collection.
      });
      this.breadcrumbsView.synchronizeCollections();
      return true;
    },

    onRender: function (e) {
      this.initActionViews(this.options);
      this.reservationRegion.show(this.reservation);
      if (!!this.model.get("search_result_metadata") &&
          (this.model.get("search_result_metadata").current_version !== false &&
          this.model.get("search_result_metadata").version_type !== "minor") &&
          this.model.get('favorite') !== undefined) { // LPAD-61021) {
        this.favRegion.show(this.favView);
      }
      if (!!config.enableBreadcrumb) {
        this.breadcrumbRegion.show(this.breadcrumbsView);
        this.$el.find('ol.binf-breadcrumb').attr('aria-label',
            this.templateHelpers().itemBreadcrumb);
      }
      this.selectionRegion.show(this._checkboxView);
      this.searchMetadataRegion.show(this.searchMetadataView);

      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      var summ = this.model.get('summary');
      if (summ.length > 0) {
        summ = summ.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        var hhRegEx = /&lt;HH&gt;/gi;
        var hhEndRegEx = /&lt;\/HH&gt;/gi;
        summ.replace(hhRegEx, '<span class="csui-summary-hh">');
        var modded = summ.replace(hhRegEx, '<span class="csui-summary-hh">');
        modded = modded.replace(hhEndRegEx, '</span>');
        this.$el.find('.csui-search-item-desc').html(modded);
      }
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      if (this.$el && base.isAppleMobile() === false) {
        this.$el.off('mouseenter.' + this.cid, '.csui-search-item-row', this._hoverStart);
        this.$el.off('mouseleave.' + this.cid, '.csui-search-item-row', this._hoverEnd);
      }
    },

    onShow: function (e) {
      this.updateItemdetails(e);
    },

    updateItemdetails: function (e) {
      var self           = this,
          isOverflown    = this.isTextOverflown(this.ui.descriptionField[0]),
          hasDescription = this.hasDescriptionText(this.ui.descriptionField[0]); // for few objects it could be summary.

      if (isOverflown) {
        var _ellipsisEle = $("<span/>", {
          "class": "csui-overflow-ellipsis",
          "html": "&#133;"
        });
        $(this.ui.descriptionField).append(_ellipsisEle);
      }

      if (!!config.enableBreadcrumb && this.breadcrumbsView) {
        this.breadcrumbsView.refresh();
      }

      this.$el.find('.truncated-' + this.cid).hide();

      this.$el.find('.csui-search-item-fav.search-fav-' + this.cid)
          .after(
              '<button class="search-results-item-expand icon-expandArrowDown" title="' +
              lang.showMore + '" aria-expanded="false" aria-label="' + lang.showMoreAria +
              '"></button>')
          .next().on('click', function () {
        $(this).toggleClass('icon-expandArrowUp');
        $('.truncated-' + self.cid).toggle();
        if (this.classList.contains("icon-expandArrowUp")) {
          $(this).removeClass('icon-expandArrowDown').addClass('icon-expandArrowUp').attr('title',
              lang.showLess).attr('aria-expanded', 'true');
          self.ui.descriptionField.addClass("csui-search-item-desc-height").find(
              ".csui-overflow-ellipsis").hide();
        } else {
          $(this).removeClass('icon-expandArrowUp').addClass('icon-expandArrowDown').attr('title',
              lang.showMore).attr('aria-expanded', 'false');
          self.ui.descriptionField.removeClass("csui-search-item-desc-height").find(
              ".csui-overflow-ellipsis").show();
        }
      });

      if (!hasDescription) {   //when there is no description or summary, hide description field and 'Modified' metadata property
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
    },

    addOwnerDisplayName: function () {
      var ownerDisplayName = "";
      if (!!this.model.attributes.owner_user_id_expand) {
        ownerDisplayName = this.getDisplayName(this.model.attributes.owner_user_id_expand);
      }
      _.extend(this.model.attributes, {
        owner_display_name: ownerDisplayName
      });
    },

    addCreatedUserDisplayName: function () {
      var createUserDisplayName = "";
      if (!!this.model.attributes.create_user_id_expand) {
        createUserDisplayName = this.getDisplayName(this.model.attributes.create_user_id_expand);
      }
      _.extend(this.model.attributes, {
        create_user_display_name: createUserDisplayName
      });
    },

    getDisplayName: function (userInfo) {
      var displayName = !!userInfo.name_formatted ? userInfo.name_formatted : userInfo.name;
      return displayName;
    },

    hasDescriptionText: function (el) {
      return (el && el.textContent.trim().length > 0);
    },

    isTextOverflown: function (el) {
      var isOverflowing = false;
      if (!!el && el.style) {
        var curOverflow = el.style.overflow;
        if (!curOverflow || curOverflow === "visible") {
          el.style.overflow = "hidden";
        }
        isOverflowing = el.clientWidth < el.scrollWidth
                        || el.clientHeight < el.scrollHeight;
        el.style.overflow = curOverflow;
      }
      return isOverflowing;
    },

    showInlineActions: function () {
      if (this.ui.inlineToolbarContainer.find('.csui-table-actionbar').length === 0) {
        if (this._rowStates.get(SearchResultsView.RowStatesSelectedRows).length > 0) {
          // no inline bar if items are selected by checkbox
          return;
        }

        this.searchMetadataView &&
        this.searchMetadataView.ui.fieldsToBeHiddenOnHover.addClass("binf-hidden");
        if (this.$el.find(".icon-expandArrowDown").length > 0) {
          this.ui.modifiedByField.addClass("binf-hidden");
        }

        this.ui.inlineToolbarContainer.removeClass("binf-hidden");

        var versionId   = this.model.attributes.version_id ?
                          "-" + this.model.attributes.version_id :
                          "",
            selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
        var args = {
          sender: this,
          target: selectedRow,
          node: this.model
        };
        this.trigger("enterSearchRow", args);
      }
    },

    hideInlineActions: function () {
      this.ui.inlineToolbarContainer.addClass("binf-hidden");
      this.ui.metadataDetails.removeClass("binf-hidden");
      this.searchMetadataView &&
      this.searchMetadataView.ui.fieldsToBeHiddenOnHover.removeClass("binf-hidden");
      if (this.$el.find(".icon-expandArrowDown").length > 0) {
        var descLength = this.ui.descriptionField.html().trim().length;
        if (descLength <= 0) {
          this.ui.descriptionField.addClass("binf-hidden");
          this.ui.modifiedByField.addClass("binf-hidden");
        }
      }

      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      var args = {
        sender: this,
        target: selectedRow,
        node: []
      };
      this.trigger("leaveSearchRow", args);
    },

    openVersionHistory: function (event) {
      var self         = this,
          args         = {},
          selectedNode = [];
      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      selectedNode = this.model;
      args = {
        sender: self,
        target: selectedRow,
        node: selectedNode
      };
      self.trigger("openVersionHistory", args);
    },

    showMetadataInfo: function (event) {
      this.ui.descriptionField.removeClass("binf-hidden");
      this.ui.modifiedByField.removeClass("binf-hidden");
      event.preventDefault();
      event.stopPropagation();
    },

    hideMetadataInfo: function (event) {
      var descLength = this.ui.descriptionField.html().trim().length;
      if (descLength <= 0) {
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
      event.preventDefault();
      event.stopPropagation();
    }
  });

  var SearchResultListView = Marionette.CollectionView.extend({

    className: 'binf-list-group',

    childView: SearchResultItemView,
    childViewOptions: function () {
      return {
        context: this.options.context,
        tableView: this.options.layoutView,
        defaultActionController: this.defaultActionController,
        metadata: this.options.metadata,
        rowStates: this._rowStates
      };
    },

    emptyView: NoSearchResultView,
    emptyViewOptions: function () {
      return {
        model: this.emptyModel
      };
    },

    behaviors: {

      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    constructor: function SearchResultListView(options) {
      options || (options = {});
      this.context = options.context;
      this._rowStates = options.rowStates;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

      BlockingView.delegate(this, options.layoutView);

      this.collection.layoutView = options.layoutView;
      this.emptyModel = new Backbone.Model({
        message: lang.noSearchResultMessage,
        suggestionKeyword: lang.suggestionKeyword,
        searchSuggestion1: lang.searchSuggestion1,
        searchSuggestion2: lang.searchSuggestion2,
        searchSuggestion3: lang.searchSuggestion3,
        searchSuggestion4: lang.searchSuggestion4
      });
      this.listenTo(this.collection, 'request', function () {
        this.emptyModel.set('message', lang.loadingSearchResultMessage);
      });
      this.listenTo(this.collection, 'sync', function () {
        this.emptyModel.set('message', lang.noSearchResultMessage);
        this.$el.find(".csui-no-result-message-wrapper").show();
        var tabElements = this.options.layoutView.facetView &&
                          this.options.layoutView.facetView.$('.csui-facet');
        if (tabElements && tabElements.length) {
          tabElements.prop('tabindex', 0);
        }
      });
      this.listenTo(this.collection, 'error', function () {
        this.emptyModel.set('message', lang.failedSearchResultMessage);
      });
      this.listenTo(this, 'dom:refresh', this._refreshDom);
    },

    collectionEvents: {'reset': 'updateLayoutView'},

    updateLayoutView: function () {
      this.collection.layoutView.expandAllView.pageChange();
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onScrollTop: function () {
      $('.binf-list-group').scrollTop(0);
    },

    _refreshDom: function () {
      this.$el.addClass("list-group-height");
      this.onScrollTop();
    }
  });

  var SearchResultsView = Marionette.LayoutView.extend({

    className: 'csui-search-results binf-panel binf-panel-default',
    template: layoutTemplate,
    templateHelpers: function () {
      var messages = {
        customSearchTab: lang.customSearchTab,
        searchFilterTab: lang.searchFilterTab,
        enableCustomSearch: this.enableCustomSearch
      };
      return {
        messages: messages
      };
    },

    ui: {
      toolBarContainer: '.csui-search-tool-container',
      customSearchContainer: '.csui-search-results-custom',
      facetView: '#facetview',
      customViewTab: '.csui-search-custom-tab',
      facetViewTab: '.csui-search-facet-tab',
      searchResultsContent: '.csui-search-results-content',
      searchResultsBody: ".csui-search-results-body",
      searchSidePanel: ".csui-search-left-panel"
    },

    events: {
      'click @ui.customViewTab': 'openCustomView',
      'click @ui.facetViewTab': 'openFacetView',
      'keypress @ui.customViewTab': 'openCustomView',
      'keypress @ui.facetViewTab': 'openFacetView'
    },

    regions: {
      headerRegion: '#header',
      toolbarRegion: '#toolbar',
      resultsRegion: '#results',
      paginationRegion: '#pagination',
      selectAllRegion: '#selectAllCheckBox',
      expandAllRegion: '#expandAllArrow',
      sortingRegion: '#csui-search-sort',
      customSearchRegion: '#csui-search-custom-container',
      facetBarRegion: '#facetbarview',
      facetRegion: '#facetview'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-result-list',
        suppressScrollX: true,
        // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    constructor: function SearchResultsView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.pageSize || (options.pageSize = 10);

      options.toolbarItems || (options.toolbarItems = toolbarItems);
      options.toolbarItemsMasks || (options.toolbarItemsMasks = new ToolbarItemsMasks());

      this.context = options.context;
      if (!options.query) {
        options.query = this.context.getModel(SearchQueryModelFactory);
      }

      if (options.collection) {
        // If the collection was passed from outside and might be of a limited scope
        if (!options.collection.fetched) {
          // Store the scope to restore later and cancel limiting the scope of the response
          this._originalScope = options.collection.getResourceScope();
        }
      } else {
        options.collection = this.context.getModel(SearchResultsCollectionFactory, options);
      }
      if (!options.collection.fetched) {
        // Ask the server to check for permitted actions V2 - only default actions
        options.collection.setResourceScope(
            SearchResultsCollectionFactory.getDefaultResourceScope());
        options.collection.setDefaultActionCommands(
            defaultActionItems.getAllCommandSignatures(commands));
        options.collection.setEnabledDelayRestCommands(true);
        if (options.collection.delayedActions) {
          this.listenTo(options.collection.delayedActions, 'error',
              function (collection, request, options) {
                var error = new base.Error(request);
                GlobalMessage.showMessage('error', error.message);
              });
        }
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this._rowStates = new Backbone.Model();
      this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);

      this.metadata = options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, options);
      this.query = options.query;
      this.collection.setLimit(0, options.pageSize, false);
      this._toggleCustomSearch();

      this.commandController = new ToolbarCommandController({commands: commands});
      // this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
      this.listenTo(this.commandController, 'after:execute:command', this._toolbarCommandExecuted);

      this.setSearchHeader();
      var self = this;
      this.listenTo(this.headerView, "go:back", function () {
        self.trigger("go:back");
      });
      this.listenTo(this.headerView, "toggle:filter", this._completeFilterCommand);
      this.listenTo(this.headerView, "focus:filter", this._focusFilter);

      this.facetFilters = this.collection.searchFacets;
      this._setToolBar();
      this.setResultView();
      this.setPagination();
      this.setSelectAllView();
      this.setSortingView();
      this.setExpandAllView();
      this.setInlineActionBarEvents();
      this._setFacetBarView();
      if (this.enableCustomSearch) {
        this.setCustomSearchView();
        this.listenTo(this.customSearchView, "change:title", this.updateHeaderTitle);
      }

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      // Refresh the search results whenever the search query changes
      // on the same perspective
      this.listenTo(this.query, 'change', function () {
        this._updatePanels();
        if (this.collection.isFetchable()) {
          this.facetFilters.clearFilter();
          this.paginationView.nodeChange();
          this.collection.fetch({
            error: _.bind(this.onSearchResultsFailed, this, options)
          });

          this._removeAllSelections();
          this.expandAllView.pageChange();
          this.resetScrollToTop();
        }
      });
      this.listenTo(this.options.context, 'request', this.blockActions)
          .listenTo(this.options.context, 'sync', this.unblockActions)
          .listenTo(this.options.context, 'error', this.unblockActions)
          .listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockSearchResultsAction)
          .listenTo(this.collection, "sync", this.updateActionToolBar)
          .listenTo(this.collection, "error", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "sync", this.updateScrollbar)
          .listenTo(this.collection, "sync", this._removeAllSelections)
          .listenTo(this.collection, "sync", this._focusOnFirstSearchResultElement)
          .listenTo(this.collection, "new:page", this.resetScrollToTop);

      !base.isMozilla() && this.propagateEventsToRegions();
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
      if (this.enableCustomSearch) {
        this.listenToOnce(this, 'dom:refresh', _.bind(function () {
          if (this.$el.width() > 1023) {
            this.ui.searchSidePanel.addClass('csui-is-visible');
            this.ui.searchResultsBody.addClass('csui-search-results-body-right');
          } else {
            this.ui.searchSidePanel.addClass("search-side-panel-overlay");
            this.ui.searchSidePanel.addClass("search-side-panel-auto");
          }
        }, this));
      }
    },

    // don't call this before command is finished
    _removeAllSelections: function () {
      this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);
    },

    _focusFilter: function (view) {
      !!view && view.headerView.ui.filter.focus();
      if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
        !!view && view.headerView.ui.filter.attr("aria-label", lang.filterCollapseAria);
        !!view && view.headerView.ui.filter.attr("aria-expanded", true);
      } else {
        !!view && view.headerView.ui.filter.attr("aria-label", lang.filterExpandAria);
        !!view && view.headerView.ui.filter.attr("aria-expanded", false);
      }
      var tabElements = this.facetView && this.facetView.$('.csui-facet');
      if (tabElements && tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
    },
    onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      ModalAlert.showError(error.toString());
    },
    updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    },
    _focusOnFirstSearchResultElement: function () {
      this.$el.find(".binf-list-group-item:first-child .csui-search-item-name > a").focus();
    },
    resetScrollToTop: function () {
      var scrollContainer = this.$('#results');
      scrollContainer.scrollTop(0);
      // if needed: triggerMethod(this, "update:scrollbar");
    },
    updateActionToolBar: function () {
      if (this.collection.totalCount === 0) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        if (!this.enableCustomSearch) {
          this.ui.customSearchContainer.addClass('binf-hidden');
        }
      } else {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.ui.customSearchContainer.removeClass('binf-hidden');
      }
    },
    unblockSearchResultsAction: function () {
      this.unblockActions();
      if (this.collection.models.length > 0) {
        this.$el.find(".binf-list-group").removeClass("list-group-height-noresults");
        this.$el.find(".csui-search-results-content").removeClass("csui-search-noresults");
      } else {
        this.$el.find(".binf-list-group").addClass("list-group-height-noresults");
        this.$el.find(".csui-search-results-content").addClass("csui-search-noresults");
      }
    },
    _toggleCustomSearch: function () {
      this.enableCustomSearch = !!this.options.customSearchView || this.query.get("query_id") &&
                                Object.keys(
                                    this.query.attributes).length >
                                1;
      if (this.enableCustomSearch) {
        this.$el.find("#csui-search-custom-container").addClass('csui-search-custom-container');
        this.$el.find("#csui-search-custom-results").addClass("csui-search-custom-results");
        this.$el.find(".csui-search-custom-tab").addClass('binf-active');
      } else {
        if (this.customSearchView && this.query.get("where")) {
          this.customSearchRegion.empty();
          this.$el.find("#csui-search-custom-container").removeClass(
              'csui-search-custom-container');
          this.$el.find("#csui-search-custom-results").removeClass("csui-search-custom-results");
        }
      }
    },

    _updatePanels: function () {
      this._toggleCustomSearch();
      if (!this.enableCustomSearch) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          var view = this;
          this.ui.searchSidePanel.one(this._transitionEnd(),
              function () {
                view.$el.find(".csui-search-results-custom").hide();
                view.$el.find(".csui-search-left-panel-tabs").hide();
                if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchSidePanel.addClass('csui-is-hidden');
                }
                view.ui.facetView.show();
              });
          this.ui.searchResultsBody.removeClass("csui-search-results-body-right");
          this.ui.searchSidePanel.removeClass("csui-is-visible");
        } else {
          this.$el.find(".csui-search-results-custom").hide();
          this.$el.find(".csui-search-left-panel-tabs").hide();
          this.ui.facetView.show();
        }
      } else {
        this.$el.find(".csui-search-results-custom").show();
        this.$el.find(".csui-search-left-panel-tabs").show();
        this.ui.searchResultsBody.addClass("csui-search-results-body-right");
      }
      if (this.headerView) {
        this.headerView.options.useCustomTitle = this.enableCustomSearch;
      }
      if (this.facetView) {
        this.facetView.options.data.showTitle = !this.enableCustomSearch;
        //re-render facetView to show title
        this.facetView.render();
      }
    },

    openCustomView: function (e) {
      //Show custom search panel, hide search facet
      if (this.enableCustomSearch) {
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.ui.facetView.hide();
          this.$el.find(".csui-search-results-custom").show();
          this.$el.find(".csui-search-facet-tab").removeClass('binf-active');
          this.$el.find(".csui-search-custom-tab").addClass('binf-active');
          e.stopPropagation();
        }
      }
    },

    openFacetView: function (e) {
      //Show search facet panel, hide custom search panel
      if (this.enableCustomSearch) {
        this._ensureFacetPanelViewDisplayed();
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.$el.find(".csui-search-results-custom").hide();
          this.ui.facetView.show();
          this.$el.find(".csui-search-custom-tab").removeClass('binf-active');
          this.$el.find(".csui-search-facet-tab").addClass('binf-active');
          e.stopPropagation();
        }
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
      // If the collection was passed from outside and might be of a limited scope
      if (this._originalScope) {
        // Restore the scope of the response
        this.options.collection.setResourceScope(this._originalScope);
      }

    },

    // bubble to regions
    //Dom refresh currently only needed for the Pagination view. When a refresh is called
    //on the searchresultview, it causes the results to constantly expand its length without cause.
    windowRefresh: function () {
      // Window resizing can be triggered between the constructor and rendering;
      // sub-views of this view are not created before the min view is rendered
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      if (this._selectAllView) {
        this._selectAllView.triggerMethod('dom:refresh');
      }
      if (this.expandAllView) {
        this.expandAllView.triggerMethod('dom:refresh');
      }
      var panelPosition = this.ui.searchSidePanel.css("position");
      if (panelPosition != "absolute") {
        if (this.$el.width() > 1023 &&
            this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
          //Entered from width <1024 to width >1024
          this.ui.searchSidePanel.removeClass("search-side-panel-overlay");
          if (this.ui.searchSidePanel.hasClass("search-side-panel-auto")) {
            //open search facet
            this.ui.searchSidePanel.removeClass("search-side-panel-auto");
            this._completeFilterCommand(this, true);
          }
        }
      } else if (!this.ui.searchSidePanel.hasClass("search-side-panel-auto") &&
                 !this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
        //Entered from width >1024 to width <1024
        this.ui.searchSidePanel.addClass("search-side-panel-overlay");
        if (this.ui.searchSidePanel.hasClass("csui-is-visible")) {
          //should be opened automatically once width >1024
          this.ui.searchSidePanel.addClass("search-side-panel-auto");
          //close search facet
          this._completeFilterCommand(this, true);
        }
      }
    }
    ,

    setSearchHeader: function () {
      this.headerView = new HeaderView({
        collection: this.collection,
        filter: this.options.searchString,
        context: this.options.context,
        enableBackButton: this.options.enableBackButton,
        backButtonToolTip: this.options.backButtonToolTip,
        enableFacetFilter: config.enableFacetFilter, // LPAD-60082: Enable/disable facets
        useCustomTitle: this.enableCustomSearch,
        commands: commands,
        originatingView: this,
        titleView: this.options.titleView
      });
      return true;
    },

    _setToolBar: function () {
      var self       = this,
          parentNode = new NodeModel({id: undefined},
              {connector: this.collection.connector});
      this.collection.node = parentNode;

      // toolbarItems is an object with several TooItemFactories in it (for each toolbar one)
      this.toolbarView = new TableToolbarView({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: this.collection,
        originatingView: this,
        context: this.options.context,
        toolbarCommandController: this.commandController,
        events: function () {
          return _.extend({}, TableToolbarView.prototype.events, {
            'keydown': self.onKeyInViewInToolbarView
          });
        }
      });
      this.listenTo(this.toolbarView, 'refresh:tabindexes', function () {
        // unlike in nodes table view, for header toolbar in search results has to navigate through
        // tab key instead-of direction keys
        this.toolbarView.$el.find('.csui-otherToolbar>ul>li>a:visible').attr('tabindex', 0);
      });
    },

    onKeyInViewInToolbarView: function (event) {
      switch (event.keyCode) {
      case 37:
        event.preventDefault();
        event.stopPropagation();
        break;
      case 39:
        // right arrow
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    },

    setResultView: function () {
      this.resultsView = new SearchResultListView({
        context: this.options.context,
        collection: this.collection,
        layoutView: this,
        filter: this.options.searchString,
        metadata: this.metadata,
        rowStates: this._rowStates
      });
      return true;
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: [10, 25, 50, 100] // LPAD-48290, to make consistent with classic console
      });
      return true;
    },

    _calculateSelectAllCheckedStatus: function () {
      var selected = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      var all = selected.length === this.collection.length;
      if (selected.length > 0 && !all) {
        return 'mixed';
      } else {
        return selected.length > 0;
      }
    },

    _updateSelectAllCheckbox: function () {
      if (this._selectAllView) {
        this._selectAllView.setChecked(this._calculateSelectAllCheckedStatus());
        this._selectAllView.setDisabled(this.collection.length === 0);
      }
    },

    setSelectAllView: function () {
      this._selectAllView = new CheckboxView({
        checked: this._calculateSelectAllCheckedStatus(),
        disabled: this.collection.length === 0,
        ariaLabel: lang.selectAllAria,
        title: lang.selectAll
      });

      this.listenTo(this._selectAllView, 'clicked', function (e) {
        e.cancel = true;  // don't update checkbox immediately

        var checked = this._selectAllView.model.get('checked'); // state before clicking cb

        switch (checked) {
        case 'true':
          // all rows are selected -> deselect all
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);
          break;
        default:
          // no or some rows are selected -> select all, except those that are not selectable
          var selectedModelIds = [];
          this.collection.each(function (model) {
            if (model.get('selectable') !== false) {
              selectedModelIds.push(model.get('id'));
            }
          });
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, selectedModelIds);
        }
      });

      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          function () {
            this._updateSelectAllCheckbox();
          });

      this.listenTo(this.collection, 'reset', function () {
        this._updateSelectAllCheckbox();
      });
    },

    setExpandAllView: function () {
      this.expandAllView = new ExpandAllView({
        collection: this.collection,
        view: this.resultsView,
        _eleCollapse: "icon-expandArrowUp",
        _eleExpand: "icon-expandArrowDown"
      });
      return true;
    },

    setSortingView: function () {
      this.sortingView = new SortingView({
        collection: this.collection
      });
      return true;
    },

    setCustomSearchView: function () {
      this.customSearchView = this.options.customSearchView || new SearchObjectView({
        context: this.options.context,
        savedSearchQueryId: this.query.get("query_id"),
        customValues: this.query,
        parentView: this
      });
      return true;
    },

    // controller for the toolbar actions
    _toolbarCommandExecuted: function (context) {
      if (context && context.commandSignature) {

        // the state of the selected nodes can be changed and other toolbar items might be enabled
        this._updateToolItems();

        // reducing performance to somewhat extent,
        // such that collection will be refetched if it meets the following conditions:
        // 1) if the current command allows to refetch from it's own implementation
        // 2) if the total count is > current page size.
        if (!!context.command && !!context.command.allowCollectionRefetch &&
            this.collection.totalCount > this.collection.topCount) {
          this.collection.fetch();
        }
      }
    },

    setInlineActionBarEvents: function () {
      this.listenTo(this.resultsView, 'childview:enterSearchRow',
          this._showInlineActionBarWithDelay);
      this.listenTo(this.resultsView, 'childview:openVersionHistory',
          this.openVersionHistory);
      this.listenTo(this.resultsView, 'childview:leaveSearchRow', this._actionBarShouldDestroy);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
      this.listenTo(this.collection, "remove", this._updateToolItems);
      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          this._updateToolItems);
    },

    _updateToolItems: function () {
      if (this.toolbarView) {
        var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
        var nodes = [];
        _.each(selectedModelIds, function (id) {
          nodes.push(this.collection.findWhere({id: id}));
        }, this);
        if (nodes && nodes.length === 1) {
          this.toolbarView.options.collection.node = nodes[0].parent;
        } else {
          this.toolbarView.options.collection.node = new NodeModel({id: undefined},
              {connector: this.collection.connector});
        }
        this.toolbarView.updateForSelectedChildren(nodes);
      }
    },

    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar,
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this
            }, this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el).css("display", "block")
            .addClass('csui-table-cell-name-appendix-full');
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        if (!self.resultsView.lockedForOtherContols) {
          // don't show the action bar control if the searchresult view is locked because a different
          // control is already open
          self._showInlineActionBar.call(self, args);
        }
      }, 200);
    },

    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        //this.inlineToolbarView.updateForSelectedChildren(args.node);
        this.inlineToolbarView.destroy();
      }
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    openVersionHistory: function (args) {
      var nodes = new NodeCollection();
      nodes.push(args.model);
      var status = {
        nodes: nodes,
        container: args.model.collection.node,
        collection: args.model.collection,
        selectedTab: new Backbone.Model({title: 'Versions'})
      };
      status = _.extend(status, {originatingView: this});
      // view properties of an existing item
      var propertiesCmd = new PropertiesCommand();
      propertiesCmd.execute(status, this.options)
          .always(function (args) {
            //self.cancel();
          });
    },

    onRender: function () {
      var self = this;
      this.headerRegion.show(this.headerView);
      this.toolbarRegion.show(this.toolbarView);
      this.resultsRegion.show(this.resultsView);
      this.paginationRegion.show(this.paginationView);
      this.selectAllRegion.show(this._selectAllView);
      this.sortingRegion.show(this.sortingView);
      this.expandAllRegion.show(this.expandAllView);
      if (this.enableCustomSearch) {
        this.customSearchRegion.show(this.customSearchView);
      }
      if (this.facetBarView) {
        this.facetBarRegion.show(this.facetBarView);
      }

      if (this.enableCustomSearch) {
        this.ui.facetView.hide();
        this.ui.searchSidePanel.removeClass('csui-is-hidden');
      } else {
        this.ui.searchSidePanel.removeClass('csui-is-visible');
        var view = this;
        this.ui.searchSidePanel.one(this._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
            });
      }
      this._toggleCustomSearch();

      // perfect scrollbar stops 'scroll' event propagation, trigger it for elements to listen to
      this.$('.csui-result-list').on('scroll', function () {
        self.trigger('scroll');
      });
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingLocal: true,
        showTitle: !this.enableCustomSearch
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._addToFacetFilter);
    },

    _removeFacetPanelView: function () {
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _addToFacetFilter: function (filter) {
      this.facetFilters.addFilter(filter);
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _removeFacetFilter: function (filter) {
      this.facetFilters.removeFilter(filter);
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _removeAll: function () {
      this.facetFilters.clearFilter();
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _completeFilterCommand: function (view, flag) {
      var panelPosition = view.ui.searchSidePanel.css("position");
      if (panelPosition === "absolute" && flag === undefined) {
        view.ui.searchSidePanel.removeClass("search-side-panel-auto");
        view.ui.searchSidePanel.addClass("search-side-panel-overlay");
      }
      view.showSidePanel = !view.ui.searchSidePanel.hasClass("csui-is-visible");
      if (view.showSidePanel) {
        view._ensureFacetPanelViewDisplayed();
        view.ui.searchSidePanel.removeClass('csui-is-hidden');
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (base.isMSBrowser()) {
                if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchResultsBody.addClass('csui-search-results-body-right');
                }
              }
              view.triggerMethod('dom:refresh');
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
            }).addClass('csui-is-visible');
        if (!base.isMSBrowser()) {
          if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
            view.ui.searchResultsBody.addClass('csui-search-results-body-right');
          }
        }
      } else {
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
              view.triggerMethod('dom:refresh');
              view._removeFacetPanelView();
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
            }).removeClass('csui-is-visible');
        view.ui.searchResultsBody.removeClass('csui-search-results-body-right');
      }
      this.facetView && this.facetView.triggerMethod('dom:refresh');
    },
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

    updateHeaderTitle: function () {
      this.headerView.setCustomSearchTitle(this.options.title);
    },

    _handleFacetBarVisible: function () {
      this.ui.searchResultsContent.addClass('csui-facetbarviewOpened');
      this.ui.searchResultsContent.find(".csui-facet-list-bar .csui-facet-item:last a").focus();
    },

    _handleFacetBarHidden: function () {
      this.ui.searchResultsContent.removeClass('csui-facetbarviewOpened');
      this.headerView.trigger("refresh:tabindexes");
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(SearchResultsView.prototype, LayoutViewEventsPropagationMixin);

  return SearchResultsView;

});


csui.define('json!csui/widgets/search.custom/search.custom.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "savedSearchQueryId": {
        "title": "{{savedSearchQueryTitle}}",
        "description": "{{savedSearchQueryDescription}}",
        "type": "string"
      }
    },
    "required": [
      "savedSearchQueryId"
    ]
  },
  "options": {
    "fields": {
      "savedSearchQueryId": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": [258]
          }
        }
      }
    }
  }
}
);


csui.define('json!csui/widgets/search.results/search.results.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {},
  "options": {},
  "actions": [
    {
      "toolItems": "csui/widgets/search.results/toolbaritems",
      "toolItemMasks": "csui/widgets/search.results/toolbaritems.masks",
      "toolbars": [
        {
          "id": "otherToolbar",
          "title": "{{otherToolbarTitle}}",
          "description": "{{otherToolbarDescription}}"
        },
        {
          "id": "inlineToolbar",
          "title": "{{inlineToolbarTitle}}",
          "description": "{{inlineToolbarDescription}}"
        }
      ]
    }
  ]
}
);

csui.define('csui/widgets/search.custom/impl/nls/search.custom.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.custom/impl/nls/root/search.custom.manifest',{
  "widgetTitle": "Custom View Search",
  "widgetDescription": "Shows custom view search form for the given saved search query.",
  "savedSearchQueryTitle": "Search query",
  "savedSearchQueryDescription": "An existing saved search query object"
});


csui.define('csui/widgets/search.results/impl/nls/search.results.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/impl/nls/root/search.results.manifest',{
  "widgetTitle": "Search Results",
  "widgetDescription": "Shows objects found by a full-text search query and offers the most important actions for them.",
  "otherToolbarTitle": "List Header Toolbar",
  "otherToolbarDescription": "Toolbar, which is activated in the list header, once a list item is selected.",
  "inlineToolbarTitle": "Inline Toolbar",
  "inlineToolbarDescription": "Toolbar, which is displayed on the right side of a list item, when the mouse cursor is moving above it."
});


csui.define('bundles/csui-search',[
  // Application widgets
  'csui/widgets/search.custom/search.custom.view',
  'csui/widgets/search.results/search.results.view',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/impl/toolbaritems',

  // Application widgets manifests
  'json!csui/widgets/search.custom/search.custom.manifest.json',
  'json!csui/widgets/search.results/search.results.manifest.json',
  'i18n!csui/widgets/search.custom/impl/nls/search.custom.manifest',
  'i18n!csui/widgets/search.results/impl/nls/search.results.manifest',

  // Tool items and tool item masks
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks'

], {});

csui.require(['require', 'css'], function (require, css) {

  css.styleLoad(require, 'csui/bundles/csui-search', true);

});

