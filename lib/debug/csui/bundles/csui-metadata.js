csui.define('csui/controls/tableheader/comment/comment.button.view',['require',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (require,
    _,
    Marionette,
    ViewEventsPropagationMixin,
    TabableRegionBehavior) {

  var CommentButtonView = Marionette.View.extend({

    className: 'csui-comment-button',

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function CommentButtonView(options) {
      Marionette.View.call(this, options);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      var self = this;
      csui.require(['esoc/widgets/utils/commentdialog/commentdialog.view'],
          function (CommentDialogView) {
            var contentRegion = new Marionette.Region({
              el: self.el
            });

            var globalConfig = (typeof window.require !== "undefined") ?
                               window.require.s.contexts._.config :
                               window.csui.require.s.contexts._.config;
            globalConfig.roId = self.model.get('id');

            var commentDialogView = new CommentDialogView({
              connector: self.model.connector,
              nodeid: self.model.get('id'),
              CSID: self.model.get('id'),
              model: self.model,
              context: self.options.context
            });

            commentDialogView.listenTo(commentDialogView, 'before:render', function () {
              self.triggerMethod('before:render', self);
            });
            commentDialogView.listenTo(commentDialogView, 'render', function () {
              self.triggerMethod('render', self);
            });

            self.propagateEventsToViews(commentDialogView);
            contentRegion.show(commentDialogView);
          }, function () {}
      );
      return this;
    }

  });

  _.extend(CommentButtonView.prototype, ViewEventsPropagationMixin);

  return CommentButtonView;
});


csui.define('csui/widgets/metadata/versions.toolbaritems',['csui/lib/underscore',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/metadata/versions.toolbaritems',
  'csui/controls/toolbar/toolitem.model'
], function (_, lang, ToolItemsFactory, extraToolItems, TooItemModel) {

  var toolbarItems = {

    tableHeaderToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "VersionProperties",
              name: lang.ToolbarItemVersionInfo,
              icon: "icon icon-toolbar-metadata"
            },
            {
              signature: "VersionDownload",
              name: lang.ToolbarItemVersionDownload
            },
            {
              signature: "VersionDelete",
              name: lang.ToolbarItemVersionDelete
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownIcon: "icon icon-toolbar-more"
        }),
    rightToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "PurgeAllVersions",
              name: lang.ToolbarItemVersionPurgeAll
            }
          ]
        },
        {
          hAlign: "right"
        }
    )
  };

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

csui.define('csui/widgets/metadata/impl/metadata.tabcontentcollection.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.contents.view',
    'csui/utils/base'
], function(_, TabContentCollectionView, base) {

    // This view is specific to metadata view which overrides the 'currentlyFocusedElement' function such that 
    // only the tab contents elements visible in the current view port of the are focused on TAB and SHIFT+TAB.

    var MetadataTabContentCollectionView = TabContentCollectionView.extend({

        constructor: function MetadataTabContentCollectionView(attributes, options) {
            TabContentCollectionView.prototype.constructor.apply(this, arguments);
            _.extend(this, {
                currentlyFocusedElement: function(event) {
                    var reverseDirection = event && event.shiftKey;
                    var elToFocus = this.currentlyFocusedElementInternal(event);
                    var totalElements = this.keyboardBehavior.tabableElements.length;
                    var cursor =  (reverseDirection ? totalElements - 1 : 0);
                    while(!base.isElementVisibleInParent(elToFocus, this.$el, 1, 1) && 
                            cursor >= 0 && cursor < totalElements) { 
                        event.elementCursor = cursor = cursor  + (reverseDirection ? -1 : 1);
                        elToFocus = this.currentlyFocusedElementInternal(event);
                    }
                    return elToFocus;
                }
            });
        }
    });

    return  MetadataTabContentCollectionView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/item.name/metadata.item.name',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <div class=\"title-edit-icon-div\">\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.show_dropdown_menu : depth0),{"name":"unless","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"csui-icon-edit inline-edit-icon icon-edit\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.edit_name_tooltip || (depth0 != null ? depth0.edit_name_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit_name_tooltip","hash":{}}) : helper)))
    + "\"\r\n            aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.edit_name_tooltip || (depth0 != null ? depth0.edit_name_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit_name_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-undo edit-cancel inline-edit-icon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel_edit_name_tooltip || (depth0 != null ? depth0.cancel_edit_name_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel_edit_name_tooltip","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel_edit_name_tooltip || (depth0 != null ? depth0.cancel_edit_name_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel_edit_name_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"cs-metadata-item-name\">\r\n<span class=\"csui-toggle-wrapper binf-hidden\">\r\n  <span class=\"icon circular1 arrow_back cs-go-back binf-hidden1\" style=\"display:none;\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.goBack || (depth0 != null ? depth0.goBack : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBack","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.goBack || (depth0 != null ? depth0.goBack : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBack","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n  <span class=\"csui-icon csui-metadata-listview csui-metadata-listview-expand-icon\" role=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.sidebarToggleTitle || (depth0 != null ? depth0.sidebarToggleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sidebarToggleTitle","hash":{}}) : helper)))
    + "\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.sidebarToggleTitle || (depth0 != null ? depth0.sidebarToggleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sidebarToggleTitle","hash":{}}) : helper)))
    + "\" tabindex=\"0\"></span>\r\n</span><span class=\"csui-type-icon\"></span>\r\n<div role=\"heading\" aria-level=\"2\" class=\"title-header\">\r\n<span class=\"title\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.nameAria || (depth0 != null ? depth0.nameAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nameAria","hash":{}}) : helper)))
    + "\" role=\"button\"\r\n      aria-expanded=\"false\">\r\n    "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "<span class=\"fadeout\"></span>\r\n</span>\r\n</div>\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.read_only : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class=\"title-edit-div\">\r\n  <label id=\""
    + this.escapeExpression(((helper = (helper = helpers.edit_name_id || (depth0 != null ? depth0.edit_name_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit_name_id","hash":{}}) : helper)))
    + "\" class=\"binf-hidden\">"
    + this.escapeExpression(((helper = (helper = helpers.placeholder_text || (depth0 != null ? depth0.placeholder_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder_text","hash":{}}) : helper)))
    + "</label>\r\n  <span class=\"cs-icon-required category_required\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.required_tooltip || (depth0 != null ? depth0.required_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"required_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n  <input type=\"text\" class=\"title-input\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholder_text || (depth0 != null ? depth0.placeholder_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder_text","hash":{}}) : helper)))
    + "\"\r\n         value=\""
    + this.escapeExpression(((helper = (helper = helpers.edit_name || (depth0 != null ? depth0.edit_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit_name","hash":{}}) : helper)))
    + "\" aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.edit_name_id || (depth0 != null ? depth0.edit_name_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit_name_id","hash":{}}) : helper)))
    + "\" aria-required=\"true\">\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideCancelButton : depth0),{"name":"unless","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n</div>\r\n<div class=\"title-error-div\">\r\n  <span class=\"title-error\" title=\"\"></span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_item.name_metadata.item.name', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"binf-dropdown\">\r\n    <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.btnId || (depth0 != null ? depth0.btnId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnId","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-dropdown-toggle\"\r\n            data-binf-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"\r\n            aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreAria || (depth0 != null ? depth0.showMoreAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreAria","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"csui-button-icon icon-expandArrowDown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showMoreTooltip || (depth0 != null ? depth0.showMoreTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showMoreTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n    </button>\r\n    <ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <div class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled binf-hidden\">\r\n  <span class=\"csui-loading-dots-wrapper\">\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n  </span>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasCommands : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_dropdown.menu_dropdown.menu', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/dropdown.menu/lazy.loading.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li role=\"menuitem\" class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled\">\r\n  <span class=\"csui-loading-dots-wrapper\">\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n  </span>\r\n</li>";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_dropdown.menu_lazy.loading.template', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',[],function(){});
csui.define('csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu.view',["module", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/backbone", "csui/lib/marionette", 'csui/utils/log',
  'csui/controls/toolbar/toolitem.model', 'csui/controls/toolbar/toolitem.view',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/utils/commands', 'csui/utils/commandhelper',
  'hbs!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/utils/contexts/factories/browsing.states',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'hbs!csui/widgets/metadata/impl/header/dropdown.menu/lazy.loading.template',
  'css!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',
  'csui/lib/binf/js/binf'
], function (module, $, _, Backbone, Marionette, log, ToolItemModel, ToolItemView,
    NodeCollection, FilteredToolItemsCollection, ToolbarView, commands,
    CommandHelper, template, TabableRegionBehavior, DropdownMenuBehavior,
    BrowsingStateCollectionFactory, lang, lazyloadingTemplate) {
  'use strict';

  // TODO: Make common dropdown menu control to be used in both the table header and the metadata header

  var DropdownMenuView = Marionette.CompositeView.extend({

    className: "cs-dropdown-menu",
    template: template,

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        role: 'menuitem'
      };
    },

    templateHelpers: function () {
      return {
        hasCommands: !!this.collection.length,
        btnId: _.uniqueId('dropdownMenuButton'),
        showMoreTooltip: lang.showMore,
        showMoreAria: lang.showMoreAria
      };
    },

    ui: {
      dropdownToggle: '.binf-dropdown-toggle',
      dropdownMenu: '.binf-dropdown-menu',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      },
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function DropdownMenuView(options) {

      var status = {
        nodes: new NodeCollection([options.model]),
        container: options.container,
        containerCollection: options.containerCollection,
        context: options.context
      };
      options.status = status;
      options.collection = new FilteredToolItemsCollection(
          options.toolItems, {
            status: status,
            commands: this.commands,
            delayedActions: options.containerCollection &&
                            options.containerCollection.delayedActions,
            mask: options.toolItemMask
          });

      options.reorderOnSort = true;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      _.defaults(this.options, options.toolItems.options);  // set options from ToolItemFactory

      this.originatingView = options.originatingView;

      this.commands = options.commands || commands;

      // Passing the el to the ctor prevents creating an own el, including
      // setting its attributes.  The caller must ensure the right tag.
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.model, "sync", this.render)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle)
          .listenTo(this.model, "change", this.render);
    },

    _updateMenuItems: function () {
      this.collection.refilter();
      this.render();
    },

    onRender: function () {
      if (!this.collection.length) {
        var node                 = this.options.model ? this.options.model : this.model,
            lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
            isLocallyCreatedNode = !!node && !!node.isLocallyCreated;
        if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands.length &&
            !isLocallyCreatedNode) {
          this.$el.find('.binf-dropdown').addClass('binf-hidden');
          this.ui.loadingIconsDiv.removeClass('binf-hidden');
          this.fetchingNonPromotedActions = true;
          node.setEnabledLazyActionCommands(
              true).done(_.bind(function () {
            this.fetchingNonPromotedActions = false;
            var blockingElement = this.$el.find('.csui-loading-parent-wrapper');
            blockingElement.animate("width: 0", 300, _.bind(function () {
              blockingElement.addClass('binf-hidden');
              this.$el.find('.binf-dropdown').removeClass('binf-hidden');
              //UpdateToolItems silently and re-render dropdown menu;
              this.collection.silentFetch = true;
              this._updateMenuItems();
            }, this));
          }, this));
        }
      } else {
        //state variable for fetching nonpromoted actions started or not
        this.fetchingNonPromotedActions = false;
        this.ui.dropdownToggle.binf_dropdown();
        this.ui.dropdownMenu.find("> li > a.binf-hidden").removeClass('binf-hidden');
        var adjustDropdown = _.bind(function () {
          this.ui.dropdownMenu.removeClass('adjust-dropdown-menu');
          var dropdownLeftOffset   = this.ui.dropdownMenu.offset().left,
              dropdownWidth        = this.ui.dropdownMenu.outerWidth(),
              originatingViewWidth = this.options.originatingView.$el.width(),
              margin               = (window.innerWidth - originatingViewWidth) / 2,
              rightOffset          = originatingViewWidth -
                                     (dropdownLeftOffset + dropdownWidth - margin);
          if (dropdownLeftOffset + dropdownWidth >
              originatingViewWidth ||
              (rightOffset + dropdownWidth > originatingViewWidth)) {
            this.ui.dropdownMenu.addClass('adjust-dropdown-menu');
          }
        }, this);
        var renderLazyActions = _.bind(function () {
          var self = this;
          var node                 = this.options.model ? this.options.model : this.model,
              lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
              isLocallyCreatedNode = !!node && !!node.isLocallyCreated;
          if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands.length &&
              !isLocallyCreatedNode) {
            this.fetchingNonPromotedActions = true;
            this.ui.dropdownMenu.append(lazyloadingTemplate);
            node.setEnabledLazyActionCommands(
                true).done(function () {
              self.fetchingNonPromotedActions = false;
              var newCollection = new FilteredToolItemsCollection(
                  self.options.toolItems, {
                    status: self.options.status,
                    commands: self.commands,
                    delayedActions: self.options.containerCollection &&
                                    self.options.containerCollection.lazyActions,
                    lazyActions: self.options.containerCollection &&
                                 self.options.containerCollection.lazyActions,
                    mask: self.options.toolItemsMask
                  });

              var blockingEle = self.ui.dropdownMenu.find('.csui-loading-parent-wrapper');
              //As per UX review comments, 300 ms given before rendering lazy actions
              blockingEle.animate("width: 0", 300, function () {
                blockingEle.remove();
                if (self.collection.models.length !== newCollection.models.length) {
                  _.filter(newCollection.models, function (model) {
                    if (self.isDestroyed === true || self._isDestroyed) {
                      self.children = undefined;
                    } else {
                      var signature = model.get("signature");
                      if (!self.collection.find({signature: signature})) {
                        self.collection.models.push(model);
                        var lazyToolItemView = self.addChild(model, ToolItemView);
                        lazyToolItemView.renderTextOnly();
                      }
                    }
                  });
                }
              });

            });
          }
        }, this);
        this.ui.dropdownToggle.bind('binf.dropdown.after.show', adjustDropdown);
        this.ui.dropdownToggle.bind('binf.dropdown.before.show', renderLazyActions);
        $(window).bind('resize.metadata.header.dropdown.menu', _.debounce(adjustDropdown, 100));
        this.delegateEvents();
      }
    },

    onRenderCollection: function () {
      if (this.collection.length && this.fetchingNonPromotedActions) {
        //loading icons div appended to dropdown,
        //but before fectching nonpromoted actions collection reset event trigger from dropDownMenu Behavior
        // in this case we are removing loding icons div from drop down and appended again
        var loadingIconsDiv = this.ui.dropdownMenu.find('.csui-loading-parent-wrapper');
        loadingIconsDiv.length && loadingIconsDiv.remove();
        this.ui.dropdownMenu.append(lazyloadingTemplate);
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.metadata.header.dropdown.menu");
    },

    currentlyFocusedElement: function () {
      return $(this.ui.dropdownToggle);
    },

    _closeToggle: function () {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      if (dropdownToggleEl.parent().hasClass('binf-open')) {
        dropdownToggleEl.binf_dropdown('toggle');
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

      var signature = args.toolItem.get("signature");
      var command = this.commands.findWhere({signature: signature});

      if (signature === 'Rename') {
        // IE is picky with Enter keypress triggered by Bootstrap not it was not stopped fast enough
        setTimeout(_.bind(function () {
          this.trigger('rename', this);
        }, this), 200);
      } else {
        var status = {
          context: this.options.context,
          nodes: new NodeCollection([this.model]),
          container: this.options.container,
          collection: this.options.containerCollection,
          originatingView: this.originatingView
        };

        if (command && command.enabled(status)) {
          // trigger some selected events so code like navigation can handle it if needed
          signature === 'Delete' && (this.trigger('metadata:item:before:delete', this));
          signature === 'Move' && (this.trigger('metadata:item:before:move', this));

          // Copy Link command in metadata page generate URL with metadata perspective
          if (signature === 'CopyLink' && this.options.metadataScenario) {
            var browsingStates = this.options.context.getCollection(BrowsingStateCollectionFactory);
            if (browsingStates.length === 1) {
              browsingStates.models[0].attributes.path.node_id = status.nodes.models[0].get('id');
              browsingStates.models[0].attributes.path.node_name = status.nodes.models[0].get(
                  'name');
            }
            status.url = browsingStates.getUrlPathWithQuery();
          }

          command.execute(status)
              .done(_.bind(function (resp) {
                // trigger some selected events so code like navigation can handle it if needed
                signature === 'Delete' && (this.trigger('metadata:item:deleted', this));
              }, this));
        }
      }
    }

  });

  return DropdownMenuView;
});



csui.define('csui/widgets/metadata/header.dropdown.menu.items',['csui/lib/underscore',
  //'i18n!csui/widgets/metadata/impl/nls/lang',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/metadata/header.dropdown.menu.items',
  // Load extra tool items from the previous module location
  'csui-ext!csui/widgets/metadata/header.item.name/menuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems,
    oldExtraToolItems) {
  'use strict';

  var toolbarItems = {
    dropdownMenuList: new ToolItemsFactory({
          main: [
            {signature: "Properties", name: lang.ToolbarItemInformation},
            {signature: "CopyLink", name: lang.ToolbarItemCopyLink},
            {signature: "Edit", name: lang.ToolbarItemEdit},
            {signature: "EmailLink", name: lang.ToolbarItemShare},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Rename", name: lang.ToolbarItemRename},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: lang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: lang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Delete", name: lang.ToolbarItemDelete}
          ],
          shortcut: [
            {signature: "OriginalCopyLink", name: lang.ToolbarItemOriginalCopyLink},
            {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
            {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
            {signature: "OriginalReserveDoc", name: lang.ToolbarItemOriginalReserve},
            {signature: "OriginalUnreserveDoc", name: lang.ToolbarItemOriginalUnreserve},
            {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
            {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
            {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload},
            {signature: "OriginalDelete", name: lang.ToolbarItemOriginalDelete}
          ]
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )
  };

  if (oldExtraToolItems) {
    // TODO: Issue deprecation warning
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

csui.define('csui/widgets/metadata/header.dropdown.menu.items.mask',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  var DropdownMenuItemsMask = ToolItemMask.extend({

    constructor: function DropdownMenuItemsMask() {
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

  return DropdownMenuItemsMask;

});


csui.define('css!csui/widgets/metadata/impl/metadata',[],function(){});

csui.define('css!csui/widgets/metadata/impl/header/item.name/metadata.item.name',[],function(){});
csui.define('csui/widgets/metadata/impl/header/item.name/metadata.item.name.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/node-type.icon/node-type.icon.view',
  'hbs!csui/widgets/metadata/impl/header/item.name/metadata.item.name',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu.view',
  'csui/widgets/metadata/header.dropdown.menu.items',
  'csui/widgets/metadata/header.dropdown.menu.items.mask',
  'csui/models/version', 'csui/behaviors/item.name/item.name.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'i18n', 'css!csui/widgets/metadata/impl/metadata',
  'css!csui/widgets/metadata/impl/header/item.name/metadata.item.name'
], function ($, _, Backbone, Marionette, NodeTypeIconView, template, lang,
    DropdownMenuView, dropdownMenuItems, DropdownMenuItemsMask, VersionModel,
    ItemNameBehavior, TabableRegionBehavior, ViewEventsPropagationMixin, i18n) {
  'use strict';

  var MetadataItemNameView = Marionette.ItemView.extend({

        className: 'cs-metadata-item-name-container',
        template: template,

        templateHelpers: function () {
          return {
            name: this.modelHasEmptyName ? (this.readonly ? this.placeHolderName : '') :
                  this.options.model.get("name"),
            edit_name: this.modelHasEmptyName ? '' : this.options.model.get("name"),
            edit_name_id: _.uniqueId('cs-metadata-edit-name'),
            placeholder_text: this.placeHolderName,
            nameAria: this.options.model.get("name") || lang.emptyObjectNameAria,
            edit_name_tooltip: lang.editNameTooltip,
            cancel_edit_name_tooltip: lang.cancelEditNameTooltip,
            switch_language_tooltip: lang.switchLanguageTooltip,
            show_dropdown_menu: this.options.showDropdownMenu ? true : false,
            read_only: this.options.model instanceof VersionModel || this.readonly,
            goBack: lang.goBackTooltip,
            sidebarToggleTitle: lang.expand,
            hideCancelButton: this.options.mode && this.options.mode === 'create'
          };
        },

        ui: {
          // note: if you change the template or this mapping, be sure not to break the behavior code
          name: '.title',
          nameEditIconDiv: '.title-edit-icon-div',
          nameEditIcon: '.csui-icon-edit',
          nameEditDiv: '.title-edit-div',
          nameInput: '.title-input',
          nameEditCancelIcon: '.edit-cancel',
          titleError: '.title-error',
          toggleIcon: '.csui-metadata-listview',
          toggleWrapper: '.csui-toggle-wrapper',
          backEle: '.arrow_back'
        },

        modelEvents: {
          'change': 'render'
        },

        events: {
          'keydown': 'onKeyInView',
          'mouseenter': 'onMouseEnterName',
          'mouseleave': 'onMouseLeaveName',
          'click @ui.nameEditIcon': 'onClickName',
          'keydown @ui.nameInput': 'onKeyDown',
          'click @ui.toggleIcon': 'toggleSideBar',
          'click @ui.backEle': 'goBack',
          'keydown @ui.toggleIcon': 'toggleSideBar',
          'keydown @ui.backEle': 'goBack',
          'keydown @ui.toggleWrapper': '_onKeyInView'
        },

        behaviors: function () {
          return {
            ItemName: {
              behaviorClass: ItemNameBehavior,
              nameSchema: this._nameSchema,
              mode: this.options.mode
            },
            TabableRegionBehavior: {
              behaviorClass: TabableRegionBehavior
            }
          };
        },

        toggleSideBar: function (event) {
          if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
            this.toggleSideBarEvent();
            event.preventDefault();
            event.stopPropagation();
          }
        },

        toggleSideBarEvent: function () {
          if (this.leftBar && this.leftBar.length > 0) {
            var parentWrapper = this.leftBar.closest(".metadata-navigation");
            if (!!parentWrapper) {
              if (parentWrapper.length > 0) {
                var sideBarEle = this.leftBar;
                if (sideBarEle.length > 0) {
                  if (parentWrapper.hasClass('csui-hide-side-bar')) {
                    parentWrapper.toggleClass("csui-hide-side-bar");
                    $(sideBarEle).show('blind', {direction: this.direction}, '200', function () {
                      $(window).trigger("resize.tableview");
                    });
                    $(this.ui.backEle).hide();
                    $(this.ui.toggleIcon).attr('title', lang.collapse).attr('aria-label',
                        lang.collapse);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-collapse-icon').removeClass(
                        'csui-metadata-listview-expand-icon');
                    this.sideBarHidden = false;
                  } else {
                    var that = this;
                    $(sideBarEle).hide('blind', {direction: this.direction}, '200', function () {
                      parentWrapper.toggleClass("csui-hide-side-bar");
                      $(window).trigger("resize.tableview");
                    });
                    $(that.ui.backEle).show().focus();
                    this.sideBarHidden = true;
                    $(this.ui.toggleIcon).attr('title', lang.expand).attr('aria-label', lang.expand);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-expand-icon').removeClass(
                        'csui-metadata-listview-collapse-icon');
                  }
                  $(sideBarEle).promise().done(function () {
                    var event = $.Event('toggled:navigationbar');
                    this.closest('.metadata-navigation').find('.cs-metadata').trigger(event);
                  });
                }
              }
            }
          }
        },

        // adapt the sidebar toggle button
        ensureTitleLabelIcon: function () {
          if (this.leftBar && this.leftBar.length > 0) {
            var parentWrapper = this.leftBar.closest(".metadata-navigation");
            if (!!parentWrapper) {
              if (parentWrapper.length > 0) {
                var sideBarEle = this.leftBar;
                if (sideBarEle.length > 0) {
                  if (parentWrapper.hasClass('csui-hide-side-bar')) {
                    $(this.ui.toggleIcon).attr('title', lang.expand).attr('aria-label', lang.expand);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-expand-icon').removeClass(
                        'csui-metadata-listview-collapse-icon');
                  } else {
                    $(this.ui.toggleIcon).attr('title', lang.collapse).attr('aria-label',
                        lang.collapse);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-collapse-icon').removeClass(
                        'csui-metadata-listview-expand-icon');
                  }
                }
              }
            }
          }
        },

        constructor: function MetadataItemNameView(options) {
          options || (options = {});
          this._nameSchema = _.extend({
            required: true,
            readonly: false
          }, options.nameSchema);

          // be the first listener, before the ones of the behavior, so behavior listeners already
          // see updated ui elements
          this.listenTo(options.model, "change:name", this._updateName);

          this.direction = !!i18n.settings.rtl ? 'right' : 'left';

          Marionette.ItemView.prototype.constructor.call(this, options);

          this.readonly = this._nameSchema.readonly;
          this.placeHolderName = lang.addItemPlaceHolderName;
          var name = this.model.get("name");
          this.modelHasEmptyName = name ? false : true;

          // create dropdown menu
          this._createDropdownMenu();

          $(window).bind('resize', {view: this}, this._onWindowResize);

        },

        goBack: function (event) {
          if (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click') {
            this.options.originatingView.triggerMethod('metadata:close');
            event.preventDefault();
            event.stopPropagation();
          }
        },

        _applyToggle: function () {
          if (!!this.sideBarHidden) {} else {
            this.ui.toggleWrapper instanceof Object &&
            this.ui.toggleWrapper.removeClass('binf-hidden');
            this.$el.addClass("csui-metadata-header-with-toggle");
            if (this.options.originatingView && !!this.options.originatingView.mdn &&
                !!this.options.originatingView.mdn.$el.is(":visible")) {
              if (this.ui.backEle instanceof Object) {
                this.ui.backEle.hide();
              }
            }
          }
        },

        _removeToggle: function () {
          if (this.ui.toggleWrapper instanceof Object) {
            this.ui.toggleWrapper.addClass('binf-hidden');
            this.$el.removeClass("csui-metadata-header-with-toggle");
          }
          if (!!this.sideBarHidden) {
            this.toggleSideBarEvent();
          }
        },

        onDestroy: function () {
          this._destroyDropdownMenu();
        },

        _updateName: function () {
          var name = this.model.get("name");
          this.modelHasEmptyName = name ? false : true;
          this.render();
          var focus = $(this.ui.nameInput).is(":focus");
          this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
          this.validate();
        },

        _destroyDropdownMenu: function () {
          if (this.dropdownMenuView) {
            this.cancelEventsToViewsPropagation(this.dropdownMenuView);
            this.dropdownMenuView.destroy();
          }
        },

        _createDropdownMenu: function () {
          if (this.options.showDropdownMenu) {
            var oView = this.options.originatingView;
            // TODO: Pass toolItems to the constructor of this component instead
            // of sniffing some other ones.
            var toolItems,
                toolItemsMask = this.options.toolbarItemsMask;
            if (oView && oView.options && oView.options.toolbarItems &&
                oView.options.toolbarItems.dropdownMenuListInProperties) {
              toolItems = oView.options.toolbarItems.dropdownMenuListInProperties;
            } else {
              toolItems = dropdownMenuItems.dropdownMenuList;
            }
            if (!toolItemsMask) {
              toolItemsMask = new DropdownMenuItemsMask();
            }
            if (this.options.showPermissionView) {
              toolItems = toolItems.collection.filter(
                  function (command) {
                    return (command.get("signature") != "permissions");
                  });
            } else {
              toolItems = toolItems.collection.filter(
                  function (command) {
                    return (command.get("signature") != "Properties");
                  });
            }
            this._destroyDropdownMenu();
            var ddm = this.dropdownMenuView = new DropdownMenuView({
              model: this.options.model,
              container: this.options.container,
              containerCollection: this.options.collection || this.options.containerCollection,
              toolItems: toolItems,
              toolItemsMask: toolItemsMask,
              originatingView: this.options.originatingView,
              context: this.options.context,
              commands: this.options.commands,
              metadataScenario: this.options.metadataScenario
            });
            this.listenTo(ddm, 'rename', _.bind(this._toggleEditMode, this, true));
            this.listenTo(ddm, 'metadata:item:before:delete', _.bind(function (args) {
              this.trigger('metadata:item:before:delete', args);
            }, this));
            this.listenTo(ddm, 'metadata:item:before:move', _.bind(function (args) {
              this.trigger('metadata:item:before:move', args);
            }, this));
            this.listenTo(ddm, 'metadata:item:deleted', _.bind(function (args) {
              this.trigger('metadata:item:deleted', args);
            }, this));
            ddm.$el.bind('keydown', _.bind(function (event) {
              if (event.keyCode === 9 && event.shiftKey) {
                if (this.ui.backEle.is(':visible') || this.ui.toggleIcon.is(':visible')) {
                  this.ui.name.prop('tabindex', 0);
                  event.stopPropagation();
                }
              }
            }, this));
            this.propagateEventsToViews(this.dropdownMenuView);
          }
        },

        _onWindowResize: function (event) {
          if (event && event.data && event.data.view) {
            var self = event.data.view;
            // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
            if (self.resizeTimer) {
              clearTimeout(self.resizeTimer);
            }

            self.resizeTimer = setTimeout(function () {
              self._setHideShowToggleButton();

            }, 200);
          }
        },

        _setHideShowToggleButton: function (event) {

          var isLandscape = window.matchMedia("(orientation: landscape)").matches,
              isPortrait  = window.matchMedia("(orientation: portrait)").matches,
              self        = !!event && !!event.data && !!event.data.view ? event.data.view : this;

          self.leftBar = self.options.originatingView &&
                         self.options.originatingView.$el.find(".metadata-sidebar");

          if (self.leftBar && self.leftBar.length > 0) {
            var navBar = self.leftBar.closest(".metadata-navigation");
            if (isLandscape) {
              if (window.innerWidth <= 1280) {
                if (!!self.sideBarHidden) {
                  self.ui.toggleWrapper instanceof Object &&
                  self.ui.toggleWrapper.removeClass('binf-hidden');
                  if (self.ui.backEle instanceof Object) {
                    self.ui.backEle.css({display: "inline-block", positin: "relative"});
                    self.ui.backEle.attr("tabindex", 0);
                  }
                  this.ensureTitleLabelIcon();
                } else {
                  self._applyToggle(event);
                  self.leftBar.removeClass('binf-hidden');
                  if (navBar.hasClass('csui-hide-side-bar')) {
                    self.leftBar.show();
                    navBar.toggleClass("csui-hide-side-bar");
                    if (self.ui.backEle instanceof Object) {
                      self.ui.backEle.hide();
                    }
                    $(window).trigger("resize.tableview");
                  }
                  this.ensureTitleLabelIcon();
                }
              } else {
                this.sideBarHidden = false;
                self._removeToggle(event);
                if (navBar.hasClass('csui-hide-side-bar')) {
                  self.leftBar.show();
                  navBar.toggleClass("csui-hide-side-bar");
                  if (self.ui.backEle instanceof Object) {
                    self.ui.backEle.hide();
                  }
                }
                $(window).trigger("resize.tableview");
                this.ensureTitleLabelIcon();
              }
            } else if (isPortrait) {
              self._applyToggle(event);
              if (self.leftBar.length > 0) {
                if (!navBar.hasClass('csui-hide-side-bar')) {
                  self.leftBar.hide();
                  navBar.toggleClass("csui-hide-side-bar");
                  $(window).trigger("resize.tableview");
                }
                if (self.ui.backEle instanceof Object) {
                  self.ui.backEle.css({display: "inline-block", positin: "relative"});
                  self.ui.backEle.attr("tabindex", 0);
                }
              }
              this.ensureTitleLabelIcon();
            }
          }
        },

        currentlyFocusedElement: function () {
          if (!!this.ui.backEle && $(this.ui.backEle).is(':visible')) {
            return this.ui.backEle;
          } else if (!!this.ui.toggleIcon && $(this.ui.toggleIcon).is(':visible')) {
            return this.ui.toggleIcon;
          } else if (!!this.options.mode && this.options.mode === 'create') {
            return $(this.ui.nameInput);
          } else {
            return $(this.ui.name);
          }
        },

        onRender: function () {
          this.editing = false;
          this.ui.nameEditIcon.addClass('binf-hidden');
          this.ui.nameEditDiv.addClass('binf-hidden');

          if (this._nodeIconView) {
            this._nodeIconView.destroy();
          }
          this._nodeIconView = new NodeTypeIconView({
            el: this.$('.csui-type-icon').get(0),
            node: this.options.model
          });
          // for shortcut objects add one more wrapper to apply special styling to overlay element.
          if(this.model.get('type') === 1){
            this._nodeIconView.$el.addClass('csui-metadata-shortcut-overlay');
          }
          this._nodeIconView.render();

          if (!this.readonly && this.options.showDropdownMenu && this.dropdownMenuView) {
            this.dropdownMenuView.render();
            Marionette.triggerMethodOn(this.dropdownMenuView, 'before:show', this.dropdownMenuView,
                this);
            this.ui.nameEditIconDiv.append(this.dropdownMenuView.el);
            Marionette.triggerMethodOn(this.dropdownMenuView, 'show', this.dropdownMenuView, this);
          }

          if (this.modelHasEmptyName) {
            this.ui.nameInput.addClass('csui-empty-with-placeholder');
            this.ui.nameInput.attr('placeholder', this.placeHolderName);
            if (this.readonly) {
              this.ui.name.addClass('csui-empty-with-placeholder');
            }
          }

          this._setHideShowToggleButton();

        },

        onMouseEnterName: function (event) {
          if (this.readonly) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();

          if (this.editing !== true) {
            this.ui.nameEditIcon.removeClass('binf-hidden');
          }
        },

        onMouseLeaveName: function (event) {
          if (this.readonly) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();

          if (this.editing !== true) {
            this.ui.nameEditIcon.addClass('binf-hidden');
          }
        },

        onKeyDown: function (event) {
          if (this.$el.parents(".cs-item-action-metadata").find(
                  "div[class='load-container']").length >
              0) {
            return false;
          }
          if (this.readonly) {
            return;
          }
          if (this.modelHasEmptyName && this.inputBoxNameChange !== true) {
            this.setInputBoxValue('');
            this.inputBoxNameChange = true;
            this.ui.nameInput.removeClass('csui-empty-with-placeholder');
          }
        },

        _validateAndSave: function () {
          var currentValue = this.getValue().trim();
          var inputValue = this.getInputBoxValue();
          inputValue = inputValue.trim();

          if (inputValue.length === 0 || currentValue !== inputValue) {
            var success = this.validate(inputValue);
            if (success === true) {
              var self = this;
              this.setInputBoxValue(inputValue);
              this.setValue(inputValue);
              this.modelHasEmptyName = false;
              this.trigger("metadata:item:name:save", {
                sender: this,
                success: function () {
                  self._toggleEditMode(false, false);
                },
                error: function (error) {
                  self.setValue(currentValue);
                  self._toggleEditMode(true);
                  self.showInlineError(error);
                }
              });
            }
          } else {
            this.clearInlineError();
            this._toggleEditMode(false, false);
          }
        },

        _onKeyInView: function (event) {
          if (event.keyCode === 9 && !event.shiftKey) {
            if ($(event.target).is(this.ui.backEle)) {
              this.ui.toggleIcon.focus();
              event.stopPropagation();
              event.preventDefault();
            } else if ($(event.target).is(this.ui.toggleIcon)) {
              this.ui.name.focus();
              event.stopPropagation();
              event.preventDefault();
            }
          }
        },
        // call proxies
        onKeyInView: function (event) {
          if (this.readonly) {
            return;
          }
          if (!!this.options.mode && this.options.mode === 'create') {
            return true;
          }
          //prevent propagation to dialog box tabable behavior (e.g. Recently Access)
          if (event.keyCode === 9 && event.shiftKey) {
            event.stopPropagation();
          }
          return this.ItemNameBehavior.onKeyInView(event);
        },

        _toggleEditMode: function (edit, setFocus) {
          //prevent toggle for item name on create dialog
          if (this.options.mode != 'create') {
            return this.ItemNameBehavior._toggleEditMode(edit, setFocus);
          }
        },

        onClickName: function (event) {
          if (this.readonly) {
            return;
          }
          return this.ItemNameBehavior.onClickName(event);
        },

        getValue: function () {
          return this.ItemNameBehavior.getValue();
        },

        setValue: function (value) {
          return this.ItemNameBehavior.setValue(value);
        },

        getInputBoxValue: function () {
          return this.ItemNameBehavior.getInputBoxValue();
        },

        setInputBoxValue: function (value) {
          return this.ItemNameBehavior.setInputBoxValue(value);
        },

        validate: function (iName) {
          return this.ItemNameBehavior.validate(iName);
        },

        setEditModeFocus: function () {
          return this.ItemNameBehavior.setEditModeFocus();
        },

        showInlineError: function (error) {
          return this.ItemNameBehavior.showInlineError(error);
        },

        clearInlineError: function () {
          return this.ItemNameBehavior.clearInlineError();
        },

        _getErrorMessageFromResponse: function (err) {
          return this.ItemNameBehavior._getErrorMessageFromResponse(err);
        },
        // end of: proxies

        // TODO: Deprecate this method and prefer using name field schema
        // for flags like readonly and required
        setReadOnly: function (mode) {
          mode = mode ? true : false;
          var focus;
          if ((this.readonly ? true : false) !== mode) {
            this.readonly = mode;
            this.render();
            focus = $(this.ui.nameInput).is(":focus");
            this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
            this.validate();
          } else {
            focus = $(this.ui.nameInput).is(":focus");
            if (!focus) {
              this.validate();
            }
          }
        },

        setPlaceHolder: function (placeHolderName) {
          placeHolderName || (placeHolderName = lang.addItemPlaceHolderName);
          if (this.placeHolderName !== placeHolderName) {
            this.placeHolderName = placeHolderName;
            this.render();
          }
        },

        updateNameSchema: function (nameSchema) {
          if (this.modelHasEmptyName && this.ui.nameInput.val() === "" && !nameSchema.readonly) {
            nameSchema.required = true;
          }
          this._nameSchema = _.extend({
            required: true,
            readonly: false
          }, nameSchema);
          this.readonly = this._nameSchema.readonly;
          this.render();
          this.ui.nameInput[0].placeholder = this.placeHolderName;
          var focus = $(this.ui.nameInput).is(":focus");
          this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
          return this.ItemNameBehavior.updateNameSchema(nameSchema);
        }

      }
  );

  _.extend(MetadataItemNameView.prototype, ViewEventsPropagationMixin);

  return MetadataItemNameView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/leftbar/header.leftbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"icon arrow_back cs-go-back\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackTooltip || (depth0 != null ? depth0.goBackTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackTooltip","hash":{}}) : helper)))
    + "\"\r\n        title=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackTooltip || (depth0 != null ? depth0.goBackTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackTooltip","hash":{}}) : helper)))
    + "\"\r\n        role=\"link\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.back_button : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_leftbar_header.leftbar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/header/leftbar/header.leftbar',[],function(){});
csui.define('csui/widgets/metadata/impl/header/leftbar/header.leftbar.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/metadata/impl/header/leftbar/header.leftbar',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/browsing.states',
  'css!csui/widgets/metadata/impl/header/leftbar/header.leftbar'
], function (_, $, Marionette, template, lang, TabableRegionBehavior,
    BrowsingStateCollectionFactory) {

  var MetadataHeaderLeftBarView = Marionette.ItemView.extend({

    className: 'metadata-header-left-bar',

    template: template,
    templateHelpers: function () {
      var templateValues = {
        back_button: this.options.showBackIcon,
        goBackTooltip: lang.goBackTooltip
      };
      return templateValues;
    },

    behaviors: function () {
      if (this.options.showBackIcon) {
        return {
          TabableRegionBehavior: {
            behaviorClass: TabableRegionBehavior
          }
        };
      } else {
        return {};
      }
    },

    ui: {
      back: '.cs-go-back'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.back': 'onClickClose'
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        // enter key(13) or space(32)
        event.preventDefault();
        event.stopPropagation();
        $(target).click();
      }
    },

    constructor: function MetadataHeaderLeftBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    currentlyFocusedElement: function () {
      if (this.options.showBackIcon) {
        return $(this.ui.back);
      }
      return undefined;
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.options.context) {
        var browsingStates = this.options.context.getCollection(BrowsingStateCollectionFactory);
        browsingStates && (browsingStates.triggerStateChangeOnStateRemoval = true);
      }

      this.trigger('metadata:close');
    }

  });

  return MetadataHeaderLeftBarView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/rightbar/header.rightbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"binf-row shortcut-div\">\r\n    <a href=\"#\" class=\"shortcut-switch\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.right_label || (depth0 != null ? depth0.right_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"right_label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.right_label || (depth0 != null ? depth0.right_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"right_label","hash":{}}) : helper)))
    + "</a>\r\n  </div>\r\n\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n  <div class=\"metadata-header-floating-rightbar\">\r\n    <span class=\"icon close cs-metadata-close\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.close_metadata_button_tooltip || (depth0 != null ? depth0.close_metadata_button_tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"close_metadata_button_tooltip","hash":{}}) : helper)))
    + "\"></span>\r\n  </div>\r\n\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.is_shortcut : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.show_close_icon : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_rightbar_header.rightbar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/header/rightbar/header.rightbar',[],function(){});
csui.define('csui/widgets/metadata/impl/header/rightbar/header.rightbar.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/widgets/metadata/impl/header/rightbar/header.rightbar',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/controls/form/fields/booleanfield.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'css!csui/widgets/metadata/impl/header/rightbar/header.rightbar'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template, lang,
    BooleanFieldView, TabableRegionBehavior) {

  var MetadataHeaderRightBarView = Marionette.ItemView.extend({

    className: 'metadata-header-right-bar',

    template: template,
    templateHelpers: function () {
      var templateValues = {
        show_close_icon: this.options.showCloseIcon,
        close_metadata_button_tooltip: lang.closeMetadataButtonTooltip
      };
      // showing properties of the original model of a shortcut
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        var right_static_label = lang.viewOriginalMessage;
        if (this.options.shortcutNode.original === this.node) {
          right_static_label = lang.viewShortcutMessage;
        }
        return _.extend(templateValues, {
          is_shortcut: true,
          right_label: right_static_label
        });
      } else {
        return templateValues;
      }
    },

    behaviors: function () {
      if ((this.options.showShortcutSwitch && this.options.shortcutNode) ||
          this.options.showCloseIcon) {
        return {
          TabableRegionBehavior: {
            behaviorClass: TabableRegionBehavior
          }
        };
      } else {
        return {};
      }
    },

    ui: {
      shortcutSwitchLabel: 'a.shortcut-switch',
      closeIcon: '.cs-metadata-close'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.shortcutSwitchLabel': 'onClickShortcutSwitch',
      'click @ui.closeIcon': 'onClickClose'
    },

    constructor: function MetadataHeaderRightBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        // enter key(13) or space(32)
        event.preventDefault();
        event.stopPropagation();
        // need timeout to overcome FireFox space press
        setTimeout(function () {
          $(target).click();
        }, 200);
      }
    },

    currentlyFocusedElement: function () {
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        return $(this.ui.shortcutSwitchLabel);
      } else if (this.options.showCloseIcon) {
        return $(this.ui.closeIcon);
      } else {
        return undefined;
      }
    },

    onClickShortcutSwitch: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('shortcut:switch');
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger("metadata:close");
    }

  });

  _.extend(MetadataHeaderRightBarView.prototype, ViewEventsPropagationMixin);

  return MetadataHeaderRightBarView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/header/metadata.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "\r\n  <div class=\"metadata-header-left-bar-container\"></div>\r\n  <div class=\"metadata-header with-right-bar\"></div>\r\n  <div class=\"metadata-header-right-bar-container\"></div>\r\n\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.back_button : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(9, data, 0)})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.show_only_required_fields_switch : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n    <div class=\"metadata-header-left-bar-container\"></div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.show_only_required_fields_switch : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "")
    + "\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "      <div class=\"metadata-header with-back-button with-right-bar\"></div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    return "      <div class=\"metadata-header with-back-button\"></div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.show_only_required_fields_switch : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0)})) != null ? stack1 : "")
    + "\r\n";
},"10":function(depth0,helpers,partials,data) {
    return "      <div class=\"metadata-header with-right-bar\"></div>\r\n";
},"12":function(depth0,helpers,partials,data) {
    return "      <div class=\"metadata-header\"></div>\r\n";
},"14":function(depth0,helpers,partials,data) {
    return "    <div class=\"metadata-header-right-bar-container\"></div>\r\n";
},"16":function(depth0,helpers,partials,data) {
    return "  <div class=\"metadata-header-right-bar-container\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.is_shortcut : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.show_close_icon : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_header_metadata.header', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/header/metadata.header',[],function(){});
csui.define('csui/widgets/metadata/impl/header/metadata.header.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/widgets/metadata/impl/header/item.name/metadata.item.name.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/header/leftbar/header.leftbar.view',
  'csui/widgets/metadata/impl/header/rightbar/header.rightbar.view',
  'hbs!csui/widgets/metadata/impl/header/metadata.header',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/utils/log',
  'csui/controls/form/fields/booleanfield.view',
  'css!csui/widgets/metadata/impl/header/metadata.header'
], function (_, $, Backbone, Marionette, MetadataItemNameView, ViewEventsPropagationMixin,
    MetadataHeaderLeftBarView, MetadataHeaderRightBarView, template, lang, log,
    BooleanFieldView) {

  var MetadataHeaderView = Marionette.ItemView.extend({

    className: 'metadata-content-header',
    template: template,
    templateHelpers: function () {
      var templateValues = {
        back_button: this.options.showBackIcon,
        show_close_icon: this.options.showCloseIcon,
        close_metadata_button_tooltip: lang.closeMetadataButtonTooltip,
        show_only_required_fields_switch: this.options.showRequiredFieldsSwitch,
        only_required_fields_label: lang.onlyRequiredFieldsLabel
      };
      // showing properties of the original model of a shortcut
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        var right_static_label = lang.viewOriginalMessage;
        if (this.options.shortcutNode.original === this.node) {
          right_static_label = lang.viewShortcutMessage;
        }
        return _.extend(templateValues, {
          is_shortcut: true,
          right_label: right_static_label
        });
      } else {
        return templateValues;
      }
    },

    ui: {
      leftbar: '.metadata-header-left-bar-container',
      header: '.metadata-header',
      rightbar: '.metadata-header-right-bar-container'
    },

    events: {
      'click .metadata-header': 'onClickHeader'
    },

    constructor: function MetadataHeaderView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      this.originatingView = options.originatingView;
      Marionette.ItemView.prototype.constructor.call(this, options);

      this._createMetadataHeaderLeftBarView();
      this._createMetadataItemNameView();
      this._createMetadataHeaderRightBarView();
    },

    _createMetadataHeaderLeftBarView: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.leftbarView.destroy();
      }

      var lbv = this.leftbarView = new MetadataHeaderLeftBarView(this.options);
      this.listenTo(lbv, 'metadata:close', function (args) {
        this.trigger('metadata:close', args);
      });

      this.propagateEventsToViews(this.leftbarView);
    },

    _createMetadataItemNameView: function (viewNode) {
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }

      var node = viewNode || this.node;
      var inv = this.metadataItemNameView = new MetadataItemNameView({
        model: node,
        container: this.options.container,
        containerCollection: this.options.containerCollection,
        collection: this.options.collection,
        context: this.options.context,
        nameSchema: this._getNameSchema(),
        commands: this.options.commands,
        originatingView: this.options.originatingView,
        showDropdownMenu: this.options.showDropdownMenu,
        metadataScenario: this.options.metadataScenario,
        showPermissionView: this.options.showPermissionView,
        mode: this.options.action
      });
      this.listenTo(inv, 'metadata:item:name:save', function (args) {
        this.trigger('metadata:item:name:save', args);
      });
      this.listenTo(inv, 'metadata:item:before:delete', _.bind(function (args) {
        this.trigger('metadata:item:before:delete', args);
      }, this));
      this.listenTo(inv, 'metadata:item:before:move', _.bind(function (args) {
        this.trigger('metadata:item:before:move', args);
      }, this));
      this.listenTo(inv, 'metadata:item:deleted', _.bind(function (args) {
        this.trigger('metadata:item:deleted', args);
      }, this));
      this.listenTo(inv, 'update:button', _.bind(function (args) {
        this.trigger('update:button', args);
      }, this));

      this.propagateEventsToViews(this.metadataItemNameView);
    },

    _createMetadataHeaderRightBarView: function (viewNode) {
      if (this.rightbarView) {
        this.cancelEventsToViewsPropagation(this.rightbarView);
        this.rightbarView.destroy();
      }

      var node = viewNode || this.node;
      var rbv = this.rightbarView = new MetadataHeaderRightBarView(
          _.extend({}, this.options, {model: node})
      );
      this.listenTo(rbv, 'shortcut:switch', this.onClickShortcutSwitch);
      this.listenTo(rbv, 'metadata:close', function (args) {
        this.trigger('metadata:close', args);
      });

      this.propagateEventsToViews(this.rightbarView);
    },

    onRender: function () {
      var lbv = this.leftbarView.render();
      Marionette.triggerMethodOn(lbv, 'before:show', lbv, this);
      this.ui.leftbar.append(lbv.el);

      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      this.ui.header.append(inv.el);

      var rbv = this.rightbarView.render();
      Marionette.triggerMethodOn(rbv, 'before:show', rbv, this);
      this.ui.rightbar.append(rbv.el);

      if (this.options.showCloseIcon) {
        this.$el.addClass('with-close-icon');
      }
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        this.$el.addClass('shortcut-object');
      }

      Marionette.triggerMethodOn(lbv, 'show', lbv, this);
      Marionette.triggerMethodOn(inv, 'show', inv, this);
      Marionette.triggerMethodOn(rbv, 'show', rbv, this);
    },

    onBeforeDestroy: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.leftbarView.destroy();
      }
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }
      if (this.requiredFieldSwitchView) {
        this.requiredFieldSwitchView.destroy();
      }
    },

    onClickHeader: function (event) {
      event.preventDefault();
      event.stopPropagation();

      // UX changed their mind
      //this.trigger("metadata:close", {sender: this});
    },

    onClickShortcutSwitch: function () {
      var viewNode = this.model;
      if (this.options.shortcutNode && this.options.shortcutNode.original === this.node) {
        // content shall show now shortcut
        // label shall be 'show original'
        viewNode = this.node = this.options.shortcutNode;
      } else {
        // content shall show now original
        // label shall be 'show shortcut'
        viewNode = this.node = this.node.original;
      }

      this._createMetadataItemNameView(viewNode);
      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      this.ui.header.append(inv.el);
      Marionette.triggerMethodOn(inv, 'show', inv, this);

      this._createMetadataHeaderRightBarView(viewNode);
      var rbv = this.rightbarView.render();
      Marionette.triggerMethodOn(rbv, 'before:show', rbv, this);
      this.ui.rightbar.append(rbv.el);
      Marionette.triggerMethodOn(rbv, 'show', rbv, this);
      // set focus back on the new view for keyboard navigation
      var $elem = rbv.currentlyFocusedElement();
      $elem && $elem.focus();

      this.trigger('shortcut:switch', {node: viewNode});
    },

    getNameInputBoxValue: function () {
      return this.metadataItemNameView.getInputBoxValue();
    },

    validateName: function () {
      var inputValue = this.metadataItemNameView.getInputBoxValue();
      return this.metadataItemNameView.validate(inputValue);
    },

    getNameValue: function () {
      return this.metadataItemNameView.getValue();
    },

    setNameEditModeFocus: function () {
      this.metadataItemNameView.setEditModeFocus();
    },

    _getNameSchema: function () {
      var generalForm = this.options.collection && this.options.collection.first(),
          formSchema  = generalForm && generalForm.get('schema'),
          nameSchema  = formSchema && formSchema.properties && formSchema.properties.name;
      // Warn only if the form collection was used to populate the view;
      // it is the case only for the creation mode, where the name should
      // be always present and flagged by required/readonly correctly
      if (this.options.collection && formSchema && !nameSchema) {
        log.warn('Form collection lacks name field in the first form.');
      }
      return nameSchema || {};
    }

  });

  _.extend(MetadataHeaderView.prototype, ViewEventsPropagationMixin);

  return MetadataHeaderView;

});

csui.define('csui/widgets/metadata/property.panels/categories/impl/category.form.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/base',
  'csui/utils/url', 'csui/controls/form/form.view', 'csui/controls/form/pub.sub',
  'csui/controls/globalmessage/globalmessage'
], function (_, $, Backbone, base, Url, FormView, PubSub, GlobalMessage) {

  var CategoryFormView = FormView.extend({

    constructor: function CategoryFormView(options) {
      FormView.prototype.constructor.call(this, options);

      this.node = this.options.node;
      this.listenTo(this, 'change:field', this._saveField);
      this.listenTo(this, 'disable:active:item', this._disableItem);
    },

    _disableItem: function (args) {
      this.options.metadataView && this.options.metadataView.trigger('disable:active:item');
    },

    _saveField: function (args) {
      // This view is shared for both creation and editing scenarios.
      // Do not save immediately in the creation mode.  The creation dialog
      // has a button to get all field values and perform the action.
      if (this.mode === 'create') {
        return;
      }

      // Optimizing the payload to send a part of the category, which has to
      // be complete, is complicated.  The classic UI sends all data anyway.
      // Until we have PATCH behaviour in the REST API, it doesn't pay off.
      var values = this.getValues();
      this._saveChanges(values);
    },

    _saveChanges: function (changes) {
      if (!this.node) {
        throw new Error('Missing node to save the categories to.');
      }
      if (_.keys(changes).length) {
        if (this._validate(changes)) {
          this._blockActions();
          return $
              .ajax(this.node.connector.extendAjaxOptions({
                type: 'PUT',
                url: Url.combine(this.node.urlBase(), 'categories', this.model.get('id')),
                data: {body: JSON.stringify(changes)}
              }))
              .done(_.bind(function () {
                this.trigger('forms:sync');
                // event for keyboard navigation
                var event = $.Event('tab:content:field:changed');
                this.options.metadataView &&
                this.options.metadataView.trigger('enable:active:item');
                this.$el.trigger(event);
              }, this))
              .fail(_.bind(function (jqxhr) {
                var preValues = this.model.get('data');
                this.form.children.forEach(function (formField) {
                  formField.setValue(preValues[formField.propertyId]);
                  formField.refresh();
                });
                var error = new base.Error(jqxhr);
                GlobalMessage.showMessage('error', error.message);
                this.trigger('forms:error');
              }, this))
              .always(_.bind(function () {
                this._unblockActions();
              }, this));
        }
        return $.Deferred().reject().promise();
      }
      return $.Deferred().resolve().promise();
    }

  });

  return CategoryFormView;
});


csui.define('csui/widgets/metadata/metadata.general.form.fields',[
  'csui/lib/underscore', 'csui/lib/backbone',
  // Load extra property panels to be added to the built-in tabs
  'csui-ext!csui/widgets/metadata/metadata.general.form.fields'
], function (_, Backbone, extraGeneralFormFields) {

  var MetadataGeneralFormFieldModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataGeneralFormFieldModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataGeneralFormFieldCollection = Backbone.Collection.extend({

    model: MetadataGeneralFormFieldModel,
    comparator: 'sequence',

    constructor: function MetadataGeneralFormFieldCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataGeneralFormFields = new MetadataGeneralFormFieldCollection();

  if (extraGeneralFormFields) {
    extraGeneralFormFields = _.flatten(extraGeneralFormFields, true);
    _.each(extraGeneralFormFields, function () {
      var sequence = extraGeneralFormFields.sequence;
      if (sequence < 10 || sequence > 100) {
        throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
      }
    });
    metadataGeneralFormFields.add(extraGeneralFormFields);
  }

  return metadataGeneralFormFields;

});


csui.define('css!csui/widgets/metadata/general.form.fields/impl/general.form.fields.view',[],function(){});
csui.define('csui/widgets/metadata/general.form.fields/impl/general.form.fields.view',['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/form/form.view',
  'css!csui/widgets/metadata/general.form.fields/impl/general.form.fields.view'
], function (_, Marionette, FormView) {
  'use strict';

  var GeneralFormFieldCollectionView = Marionette.CollectionView.extend({

    className: 'csui-general-form-fields',

    getChildView: function (model) {
      var fieldDescriptor = _.findWhere(this.options.fieldDescriptors,
          {formModel: model});
      return fieldDescriptor && fieldDescriptor.formView || FormView;
    },

    childViewOptions: function (model) {
      var options = {
            context: this.options.context,
            node: this.options.node,
            mode: this.options.mode,
            generalFormView: this.view,
            fetchedModels: this.options.fetchedModels,
            displayedModels: this.options.displayedModels,
            originatingView: this.options.originatingView,
            metadataView: this.options.metadataView,
            layoutMode: 'singleCol'
          },
          fieldDescriptor = _.findWhere(this.options.fieldDescriptors,
              {formModel: model});
      if (fieldDescriptor) {
        _.extend(options, fieldDescriptor.formViewOptions);
      }
      return options;
    },

    constructor: function GeneralFormFieldCollectionView(options) {
      Marionette.CollectionView.prototype.constructor.call(this, options);
      this.listenTo(this, 'render', this._triggerRenderForms);
    },

    // Trigger render:forms once every form has triggered render:form
    _triggerRenderForms: function () {
      var children = this.children.map(function (formView) {
        var formViewId = formView.cid;
        formView.once('render:form', function () {
          children = _.without(children, formViewId);
          if (!children.length) {
            this.triggerMethod('render:forms', this);
          }
        }, this);
        return formView.cid;
      }, this);
    }

  });

  return GeneralFormFieldCollectionView;

});

csui.define('csui/widgets/metadata/general.form.fields/general.form.field.behavior',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/widgets/metadata/metadata.general.form.fields',
  'csui/widgets/metadata/general.form.fields/impl/general.form.fields.view',
  'csui/dialogs/modal.alert/modal.alert'
], function (_, $, Backbone, Marionette, metadataGeneralFormFields,
    GeneralFormFieldCollectionView, ModalAlert) {
  'use strict';

  var GeneralFormFieldBehavior = Marionette.Behavior.extend({
    constructor: function GeneralFormFieldBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this
          .listenTo(this.view, 'render', this._insertFieldExtensions)
          .listenTo(this.view, 'destroy', this._emptyExtensionRegion);

      var self = this;
      view.getGeneralFormFieldValues = function () {
        var formValues = {};
        // Forms with extra fields are rendered only if there
        // were any field descriptors specified; there are no
        // data without forms
        if (self.fieldRegion) {
          self.fieldRegion.currentView.children.each(function (formView) {
            var values = formView.getValues(),
                roleName = formView.model.get("role_name"),
                roles, role;
            if (values) {
              if (roleName) {
                roles = formValues.roles || (formValues.roles = {});
                role = roles[roleName] || (roles[roleName] = {});
                // With a role defined, merge the properties to the
                // roles.<role_name> object
                _.extend(role, values);
              } else {
                // With no role defined, merge the properties to the root
                // object literal with the general properties
                _.extend(formValues, values);
              }
            }
          });
        }
        return formValues;
      };
    },

    _insertFieldExtensions: function () {
      var fieldParent = this.getOption('fieldParent');
      if (_.isFunction(fieldParent)) {
        fieldParent = fieldParent.call(this.view);
      }
      if (fieldParent) {
        fieldParent = this.view.$(fieldParent)[0];
      }
      if (!fieldParent) {
        return;
      }

      var fieldDescriptors = this.getOption('fieldDescriptors');
      if (_.isFunction(fieldDescriptors)) {
        fieldDescriptors = fieldDescriptors.call(this.view);
      }
      if (!fieldDescriptors || !fieldDescriptors.length) {
        return;
      }

      this.fieldRegion = new Marionette.Region({el: fieldParent});

      var fieldViewOptions = this.getOption('fieldViewOptions');
      if (_.isFunction(fieldViewOptions)) {
        fieldViewOptions = fieldViewOptions.call(this.view);
      }
      var fieldModels = new Backbone.Collection(_.pluck(fieldDescriptors, 'formModel')),
          fieldViews = new GeneralFormFieldCollectionView(_.extend({
            context: this.view.options.context,
            fieldDescriptors: fieldDescriptors,
            collection: fieldModels,
            node: this.view.options.node,
            mode: this.view.options.mode,
            generalFormView: this.view,
            fetchedModels: this.view.options.fetchedModels,
            displayedModels: this.view.options.displayedModels,
            originatingView: this.view.options.originatingView,
            metadataView: this.view.options.metadataView
          }, fieldViewOptions));
      this.listenTo(fieldViews, 'render:forms', function () {
        this.view.triggerMethod('render:general:form:fields', fieldViews);
      });
      this.fieldRegion.show(fieldViews);
    },

    _emptyExtensionRegion: function () {
      if (this.fieldRegion) {
        this.fieldRegion.empty();
      }
    }

  }, {

    getFieldDescriptors: function (options) {
      var methodName, parameters;
      if (options.action === 'create') {
        methodName = 'getGeneralFormFieldsForCreate';
        parameters = [{forms: options.forms}];
      } else if (options.action === 'copy') {
        methodName = 'getGeneralFormFieldsForCopy';
        parameters = [{forms: options.forms}];
      } else if (options.action === 'move') {
        methodName = 'getGeneralFormFieldsForMove';
        parameters = [{forms: options.forms}];
      } else {
        methodName = 'getGeneralFormFields';
      }
      var promises = metadataGeneralFormFields.chain()
          .map(function (fieldControllerDescriptor) {
            var Controller = fieldControllerDescriptor.get('controller'),
                controllerOptions = fieldControllerDescriptor.get('controllerOptions'),
                controller = new Controller(_.extend({
                  context: options.context,
                  model: options.node,
                  fetchedModels: options.forms
                }, controllerOptions)),
                method = controller[methodName];
            return method && method.apply(controller, parameters);
          })
          .compact()
          .value();
      return $.when
          .apply($, promises)
          .then(function () {
            return _.flatten(arguments);
          });
    }

  });

  return GeneralFormFieldBehavior;
});


csui.define('csui/widgets/metadata/metadata.general.action.fields',[
  'csui/lib/underscore', 'csui/lib/backbone',
  // Load extra property panels to be added to the built-in tabs
  'csui-ext!csui/widgets/metadata/metadata.general.action.fields'
], function (_, Backbone, generalActionFields) {

  var MetadataGeneralActionFieldModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataGeneralActionFieldModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataGeneralActionFieldCollection = Backbone.Collection.extend({

    model: MetadataGeneralActionFieldModel,
    comparator: 'sequence',

    constructor: function MetadataGeneralActionFieldCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataGeneralActionFields = new MetadataGeneralActionFieldCollection();

  // Adding Action Fields to General Panels

    if (generalActionFields) {
        generalActionFields = _.flatten(generalActionFields, true);
        _.each(generalActionFields, function () {
            var sequence = generalActionFields.sequence;
            if (sequence < 10 || sequence > 100) {
                throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
            }
        });
        metadataGeneralActionFields.add(generalActionFields);
    }


  return metadataGeneralActionFields;

});

csui.define('csui/widgets/metadata/general.action.fields/impl/general.action.fields.view',['csui/lib/underscore', 'csui/lib/marionette',
    'csui/controls/form/form.view',
    'css!csui/widgets/metadata/general.form.fields/impl/general.form.fields.view'
], function (_, Marionette, FormView) {
    'use strict';

    var GeneralActionFieldCollectionView = Marionette.CollectionView.extend({

        className: 'csui-general-action-fields',

        getChildView: function (model) {
            var fieldDescriptor = _.findWhere(this.options.fieldDescriptors,
                {formModel: model});
            return fieldDescriptor && fieldDescriptor.formView || FormView;
        },

        childViewOptions: function (model) {
            var options = {
                    context: this.options.context,
                    node: this.options.node,
                    mode: this.options.mode,
                    generalFormView: this.view,
                    fetchedModels: this.options.fetchedModels,
                    displayedModels: this.options.displayedModels,
                    originatingView: this.options.originatingView,
                    metadataView: this.options.metadataView,
                    layoutMode: 'singleCol'
                },
                fieldDescriptor = _.findWhere(this.options.fieldDescriptors,
                    {formModel: model});
            if (fieldDescriptor) {
                _.extend(options, fieldDescriptor.formViewOptions);
            }
            return options;
        },

        constructor: function GeneralActionFieldCollectionView(options) {
            Marionette.CollectionView.prototype.constructor.call(this, options);
            this.listenTo(this, 'render', this._triggerRenderForms);
        },

        // Trigger render:forms once every form has triggered render:form
        _triggerRenderForms: function () {
            var children = this.children.map(function (formView) {
                var formViewId = formView.cid;
                formView.once('render:form', function () {
                    children = _.without(children, formViewId);
                    if (!children.length) {
                        this.triggerMethod('render:forms', this);
                    }
                }, this);
                return formView.cid;
            }, this);
        }

    });

    return GeneralActionFieldCollectionView;

});

csui.define('csui/widgets/metadata/general.action.fields/general.action.field.behavior',[
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/lib/marionette', 'csui/widgets/metadata/metadata.general.action.fields',
    'csui/widgets/metadata/general.action.fields/impl/general.action.fields.view',
    'csui/dialogs/modal.alert/modal.alert'
], function (_, $, Backbone, Marionette, metadataGeneralActionFields,
        GeneralActionFieldCollectionView, ModalAlert) {
    'use strict';

    var GeneralActionFieldBehavior = Marionette.Behavior.extend({
        constructor: function GeneralActionFieldBehavior(options, view) {
            Marionette.Behavior.prototype.constructor.apply(this, arguments);
            this.view = view;
            this
                .listenTo(this.view, 'render', this._insertFieldExtensions)
                .listenTo(this.view, 'destroy', this._emptyExtensionRegion);

            var self = this;
            view.getGeneralActionFieldValues = function () {
                var formValues = {};
                // Forms with extra fields are rendered only if there
                // were any field descriptors specified; there are no
                // data without forms
                if (self.fieldRegion) {
                    self.fieldRegion.currentView.children.each(function (formView) {
                        var values = formView.getValues(),
                            roleName = formView.model.get("role_name"),
                            roles, role;
                        if (values) {
                            if (roleName) {
                                roles = formValues.roles || (formValues.roles = {});
                                role = roles[roleName] || (roles[roleName] = {});
                                // With a role defined, merge the properties to the
                                // roles.<role_name> object
                                _.extend(role, values);
                            } else {
                                // With no role defined, merge the properties to the root
                                // object literal with the general properties
                                _.extend(formValues, values);
                            }
                        }
                    });
                }
                return formValues;
            };
        },

        _insertFieldExtensions: function () {
            var fieldParent = this.getOption('fieldParent');
            if (_.isFunction(fieldParent)) {
                fieldParent = fieldParent.call(this.view);
            }
            if (fieldParent) {
                fieldParent = this.view.$(fieldParent)[0];
            }
            if (!fieldParent) {
                return;
            }

            var fieldDescriptors = this.getOption('fieldDescriptors');
            if (_.isFunction(fieldDescriptors)) {
                fieldDescriptors = fieldDescriptors.call(this.view);
            }
            if (!fieldDescriptors || !fieldDescriptors.length) {
                return;
            }

            this.fieldRegion = new Marionette.Region({el: fieldParent});

            var fieldViewOptions = this.getOption('fieldViewOptions');
            if (_.isFunction(fieldViewOptions)) {
                fieldViewOptions = fieldViewOptions.call(this.view);
            }
            var fieldModels = new Backbone.Collection(_.pluck(fieldDescriptors, 'formModel')),
                fieldViews = new GeneralActionFieldCollectionView(_.extend({
                    context: this.view.options.context,
                    fieldDescriptors: fieldDescriptors,
                    collection: fieldModels,
                    node: this.view.options.node,
                    mode: this.view.options.mode,
                    generalFormView: this.view,
                    fetchedModels: this.view.options.fetchedModels,
                    displayedModels: this.view.options.displayedModels,
                    originatingView: this.view.options.originatingView,
                    metadataView: this.view.options.metadataView
                }, fieldViewOptions));
            this.listenTo(fieldViews, 'render:actions', function () {
                this.view.triggerMethod('render:general:action:fields', fieldViews);
            });
            this.fieldRegion.show(fieldViews);
        },

        _emptyExtensionRegion: function () {
            if (this.fieldRegion) {
                this.fieldRegion.empty();
            }
        }

    }, {

        getFieldDescriptors: function (options) {
            var methodName, parameters;
            if (options.action === 'create') {
                methodName = 'getGeneralActionFieldsForCreate';
                parameters = [{forms: options.forms}];
            } else if (options.action === 'copy') {
                methodName = 'getGeneralActionFieldsForCopy';
                parameters = [{forms: options.forms}];
            } else if (options.action === 'move') {
                methodName = 'getGeneralActionFieldsForMove';
                parameters = [{forms: options.forms}];
            } else {
                methodName = 'getGeneralActionFields';
            }
            var promises = metadataGeneralActionFields.chain()
                .map(function (fieldControllerDescriptor) {
                    var Controller = fieldControllerDescriptor.get('controller'),
                        controllerOptions = fieldControllerDescriptor.get('controllerOptions'),
                        controller = new Controller(_.extend({
                            context: options.context,
                            model: options.node,
                            fetchedModels: options.forms
                        }, controllerOptions)),
                        method = controller[methodName];
                    return method && method.apply(controller, parameters);
                })
                .compact()
                .value();
            return $.when
                .apply($, promises)
                .then(function () {
                    return _.flatten(arguments);
                });
        }

    });

    return GeneralActionFieldBehavior;
});

csui.define('csui/widgets/metadata/general.panels/node/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/nodesprites',
  'csui/controls/table/cells/size/size.view', 'csui/utils/base',
  'csui/utils/url', 'csui/models/form', 'csui/models/version',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, Backbone, NodeSpriteCollection, SizeView, base, Url,
    FormModel, VersionModel, NodeResourceMixin, lang) {
  'use strict';

  var prototypeExt = {
    makeServerAdaptor: function (options) {
      return this;
    },

    url: function () {
      var node   = this.options.node,
          nodeId = node.get('id'),
          url;
      if (nodeId === undefined) {
        // creation form
        url = _.str.sformat('forms/nodes/create?type={0}&parent_id={1}',
            node.get('type'), node.get('parent_id'));
      } else {
        if (node instanceof VersionModel) {
          url = _.str.sformat('forms/nodes/versions/properties/general?id={0}&version_number={1}',
              nodeId, node.get('version_number'));
        } else {
          // update form
          url = _.str.sformat('forms/nodes/properties/general?id={0}', nodeId);
        }
      }
      return Url.combine(this.connector.connection.url, url);
    },

    parse: function (response, options) {
      // Some views may fail if one of the three properties was missing
      var form  = _.extend({
            data: {},
            schema: {},
            options: {}
            // The server returns an array pf forms, although only one category
            // was requested.  Normalize the response to be just a single form.
          }, response.form || response.forms && response.forms[0] || response),
          // Title usually does not come from the server
          title = form.title || this.get('title') || lang.general;

      form.options = _.omit(form.options, 'form');
      if (!form.schema.title) {
        form.schema.title = title;
      }
      if (!form.title) {
        form.title = title;
      }

      this._addCreatorInfo(form, options);
      this._addOwnerInfo(form, options);
      this._addCreateDateInfo(form, options);
      this._addModifyDateInfo(form, options);
      this._addMimeTypeInfo(form, options);
      this._addSizeInfo(form, options);
      this._addItemidInfo(form, options);
      this._ensurePlaceholder(form, options);
      this._addReserveInfo(form, options);
      this._addMimeTypeClassNameInfo(form, options);
      return form;
    },

    _addSizeInfo: function (ret, options) {
      var type = this.options.node.get('type');

      this.sizeView = new SizeView({
        model: this.options.node,
        column: {name: this.options.node.has('size') ? "size" : "file_size"}
      });

      var refNode =
              _.extend(ret.data, {
                // TODO: Create a custom field showing the friendly size
                // in the visible HTML element and the full size in bytes
                // in a tooltip
                size: this.sizeView.getValueData().formattedValue
              });

      _.extend(ret.options.fields, {
        size: {
          hidden: false,
          readonly: true,
          label: lang.formFieldSizeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        size: {
          hidden: false,
          readonly: true,
          title: lang.formFieldSizeLabel,
          type: "string"
        }
      });
    },

    _addItemidInfo: function (ret, options) {
      if (!!this.node) {
        var type = this.options.node.get('type');
        var refNode =
                _.extend(ret.data, {
                  itemId: this.node.get('id')
                });

        _.extend(ret.options.fields, {
          itemId: {
            hidden: false,
            readonly: true,
            label: lang.formFieldItemIdLabel,
            placeholder: lang.alpacaPlaceholderNotAvailable,
            type: "text"
          }
        });
        _.extend(ret.schema.properties, {
          itemId: {
            hidden: false,
            readonly: true,
            label: lang.formFieldItemIdLabel,
            placeholder: lang.alpacaPlaceholderNotAvailable,
            type: "text",
            tooltip: this.node.get('id')
          }
        });
      }
    },

    _addCreateDateInfo: function (ret, options) {
      if (!ret.options.fields.create_date) {
        return;
      }
      ret.options.fields.create_date.type = 'datetime';
      ret.options.fields.create_date.placeholder = lang.alpacaPlaceholderNotAvailable;
      ret.schema.properties.create_date.format = 'datetime';
    },

    _addModifyDateInfo: function (ret, options) {
      if (!ret.options.fields.modify_date) {
        return;
      }
      ret.options.fields.modify_date.type = 'datetime';
      ret.options.fields.modify_date.placeholder = lang.alpacaPlaceholderNotAvailable;
      ret.schema.properties.modify_date.format = 'datetime';
    },

    _addOwnerInfo: function (ret, options) {
      var ownerField = 'owner_user_id';
      // for version, we are still using v1 call for now until switch to v2
      if (this.node instanceof VersionModel) {
        ownerField = 'owner_id';  // v1 has a slightly different field name
      }
      if (!ret.options.fields[ownerField]) {
        return;
      }
      var isOwnerExists = this.node.get('owner_user_id') === -3,
          owner         = isOwnerExists ? {
            'id': -3
          } : (this.node.get('owner_user_id_expand') ||
               this.node.get('owner_user_id') ||
               this.node.get('owner_id'));

      if (owner && owner instanceof Object) {
        ret.data[ownerField] = owner.id;
        ret.options.fields[ownerField].type = 'otcs_user';
        ret.options.fields[ownerField].type_control = {
          name: isOwnerExists ? lang.NoOwner : base.formatMemberName(owner)
        };
        ret.options.fields[ownerField].placeholder = lang.alpacaPlaceholderNotAvailable;
      }
    },

    _addCreatorInfo: function (ret, options) {
      if (!ret.options.fields.create_user_id) {
        return;
      }
      var creator = this.node.get('create_user_id_expand') ||
                    this.node.get('create_user_id');
      if (creator && creator instanceof Object) {
        ret.data.create_user_id = creator.id;
        ret.options.fields.create_user_id.type = 'otcs_user';
        ret.options.fields.create_user_id.type_control = {
          name: base.formatMemberName(creator)
        };
        ret.options.fields.create_user_id.placeholder = lang.alpacaPlaceholderNotAvailable;
      }
    },

    _addMimeTypeInfo: function (ret, options) {
      var type = this.options.node.get('type');
      var node = this.options.node;

      _.extend(ret.data, {
        mime_type: NodeSpriteCollection.findTypeByNode(node)
      });

      _.extend(ret.options.fields, {
        mime_type: {
          hidden: false,
          readonly: true,
          label: lang.formFieldTypeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        mime_type: {
          hidden: false,
          readonly: true,
          title: lang.formFieldTypeLabel,
          type: "string"
        }
      });
    },

    // will retrieve corr. className of MimeType
    _addMimeTypeClassNameInfo: function (ret, options) {
      var type = this.options.node.get('type');
      var node = this.options.node;
      _.extend(ret.data, {
        mimeTypeClassName: NodeSpriteCollection.findClassByNode(node)
      });
    },

    _ensurePlaceholder: function (ret, options) {
      // ensure Description placeholder
      if (ret.options.fields.description) {
        var desc = ret.options.fields.description;
        if (desc.placeholder === undefined || desc.placeholder.length === 0) {
          desc.placeholder = lang.alpacaPlaceholderDescription;
        }
      }
    },

    _addReserveInfo: function (ret, options) {
      var refNode =
              _.extend(ret.data, {
                reserve_info: ((!!this.options.node.get('reserved')) ? this : undefined)
              });

      _.extend(ret.options.fields, {
        reserve_info: {
          hidden: false,
          readonly: true,
          label: lang.formFieldReservedByLabel,
          type: "otcs_reserve_button"
        }
      });

      _.extend(ret.schema.properties, {
        reserve_info: {
          hidden: false,
          readonly: true,
          type: "otcs_reserve_button"
        }
      });
    }
  };

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, prototypeExt);
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/widgets/metadata/general.panels/node/node.general.form.model',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/models/form',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/widgets/metadata/general.panels/node/server.adaptor.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function ($, _, FormModel, NodeResourceMixin, ServerAdaptorMixin,
    lang) {
  'use strict';

  var NodeGeneralFormModel = FormModel.extend({
    defaults: {
      id: 'general'
    },

    constructor: function NodeGeneralFormModel(attributes, options) {
      FormModel.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
          .makeServerAdaptor(options);
    }
  });

  NodeResourceMixin.mixin(NodeGeneralFormModel.prototype);
  ServerAdaptorMixin.mixin(NodeGeneralFormModel.prototype);

  return NodeGeneralFormModel;
});

csui.define('csui/widgets/metadata/general.panels/document/document.general.form.model',['csui/lib/underscore', 'csui/utils/base',
  'csui/controls/table/cells/size/size.view',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, base, SizeView, NodeGeneralFormModel, lang) {
  'use strict';

  var DocumentGeneralFormModel = NodeGeneralFormModel.extend({

    constructor: function DocumentGeneralFormModel(attributes, options) {
      NodeGeneralFormModel.prototype.constructor.apply(this, arguments);
    },

    parse: function (response, options) {
      var form = NodeGeneralFormModel.prototype.parse.apply(this, arguments);

      this._addSizeInfo(form, options);

      return form;
    },

    _addSizeInfo: function (ret, options) {
      var type        = this.options.node.get('type'),
          val         = this.options.node.has('size'),
          column_name = (val ? '' : 'file_') + 'size';
      this.sizeView = new SizeView({
        model: this.options.node,
        column: {name: column_name}
      });

      var sizeVal = this.sizeView.getValueData().formattedValue,
          refNode =
              _.extend(ret.data, {
                size: !!sizeVal ? sizeVal :
                      base.getReadableFileSizeString(this.options.node.get('size'))

              });


      _.extend(ret.options.fields, {
        size: {
          hidden: false,
          readonly: true,
          label: lang.formFieldSizeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        size: {
          hidden: false,
          readonly: true,
          title: lang.formFieldSizeLabel,
          type: "string",
          tooltip: this.sizeView.getValueData().value
        }
      });
    }

  });

  return DocumentGeneralFormModel;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/general.panels/node/impl/node.general.form',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-row\">\r\n  {{#if options.label}}\r\n  <div class=\"binf-col-md-12 alpaca-container-label\">\r\n    <h4>{{options.label}}</h4>\r\n  </div>\r\n  {{/if}}\r\n  <div class=\"metadata-pane-container\">\r\n    <div class=\"metadata-pane-left binf-col-md-6  cs-form-doublecolumn cs-form-leftcolumn\">\r\n      <div class=\"owner_section general-information\"></div>\r\n      <div class=\"typename_section general-information\"></div>\r\n      {{#if options.showSize}}\r\n      <div class=\"size_section general-information\"></div>\r\n      {{/if}}\r\n      <div class=\"reserve_info general-information\"></div>\r\n      <div class=\"csui-extra-general-fields\"></div>\r\n      <div class=\"csui-action-fields\"></div>\r\n    </div>\r\n    <div class=\"metadata-pane-right binf-col-md-6 cs-form-doublecolumn cs-form-rightcolumn\">\r\n      <div class=\"metadata-tab\">\r\n        {{#if options.showThumbnail}}\r\n        <div class=\"thumbnail_section metadata-preview preview-section\" title=\"{{options.title}}\">\r\n          <span class=\"default_thumbnail thumbnail_empty\" data-cstabindex=\"0\" role=\"button\"\r\n                aria-label=\"{{options.aria_label}}\"></span>\r\n        </div>\r\n        {{/if}}\r\n        <div class=\"description_section general-information\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_general.panels_node_impl_node.general.form', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/general.panels/node/impl/node.general.form',[],function(){});
csui.define('csui/widgets/metadata/general.panels/node/node.general.form.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log',
  'csui/controls/form/form.view', 'csui/utils/commandhelper',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/widgets/metadata/general.form.fields/general.form.field.behavior',
  'csui/widgets/metadata/general.action.fields/general.action.field.behavior',
  'csui/models/version',
  'csui/controls/globalmessage/globalmessage',
  'hbs!csui/widgets/metadata/general.panels/node/impl/node.general.form',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/utils/base',
  'csui/utils/commands/versions', 'csui/models/nodeversions',
  'css!csui/widgets/metadata/general.panels/node/impl/node.general.form'
], function (_, $, log, FormView, CommandHelper,
    DefaultActionBehavior, GeneralFormFieldBehavior, GeneralActionFieldBehavior, VersionModel,
    GlobalMessage, formTemplate, lang, base, versionCommands, NodeVersionCollection) {
  'use strict';

  var NodeGeneralFormView = FormView.extend({

    behaviors: {
      defaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      generalFormFields: {
        behaviorClass: GeneralFormFieldBehavior,
        fieldParent: '.csui-extra-general-fields',
        fieldDescriptors: function () {
          return this.options.generalFormFieldDescriptors;
        },
        fieldViewOptions: function () {
          return {
            context: this.options.context,
            node: this.node,
            mode: this.options.mode,
            originatingView: this,
            metadataView: this.options.metadataView
          };
        }
      },
      generalActionFields: {
        behaviorClass: GeneralActionFieldBehavior,
        fieldParent: '.csui-action-fields',
        fieldDescriptors: function () {
          return this.options.generalActionFieldDescriptors;
        },
        fieldViewOptions: function () {
          return {
            context: this.options.context,
            node: this.node,
            mode: this.options.mode,
            originatingView: this,
            metadataView: this.options.metadataView
          };
        }
      }

    },

    className: 'cs-form csui-general-form',

    // Default field set that needs to be refreshed while modifying any field in general form.
    // it can be extended if a particular module need to update more field.
    fieldToRefresh: ['modify_date', 'reserve_info'],

    constructor: function NodeGeneralFormView(options) {
      FormView.prototype.constructor.call(this, options);
      this.node = this.options.node;
      // extend fieldToRefresh from options.
      this.fieldToRefresh = _.union(this.fieldToRefresh, (options.fieldToRefresh || []));
      this.listenTo(this, 'change:field', this._saveField);
      this.listenTo(this.node, 'change', _.bind(function () {
        if (this.mode !== "create") {
          this.model.fetch();
        }

        // The model event is no longer triggered. If a single form field
        // is re-rendered, needs to let metadata keyboard navigation know
        // to refresh the list of tabable elements.
        var event = $.Event('tab:content:field:changed');
        this.$el.trigger(event);
      }, this));

      var action = this.defaultActionController.getAction(this.options.node);
      if (!action) {
        this.noDefaultActionExist = true;
      }
    },

    formTemplate: formTemplate,

    formTemplateHelpers: function () {
      var type_name = this.node.get('type_name'),
          node_name = this.node.get('name');
      return {
        showThumbnail: this.mode != 'create',
        showSize: this.model.get('data').size !== "",
        reserved: this.node.get('reserved'),
        title: this.noDefaultActionExist ? "" : _.str.sformat(lang.openDoc, type_name),
        aria_label: this.noDefaultActionExist ? "" :
                    _.str.sformat(lang.openDocAria, type_name, node_name)
      };
    },

    _getLayout: function () {
      var template = this.getOption('formTemplate'),
          html     = template.call(this, {
            data: this.alpaca.data,
            mode: this.mode
          }),
          bindings = this._getBindings(),
          view     = {
            parent: 'bootstrap-csui',
            layout: {
              template: html,
              bindings: bindings
            }
          };
      return view;
    },

    _getBindings: function () {
      var bindings = {
        name: 'name_section',
        create_date: '.owner_section',
        create_user_id: '.owner_section',
        modify_date: '.owner_section',
        owner_user_id: '.owner_section',
        mime_type: '.typename_section',
        description: '.description_section',
        itemId: '.owner_section',
        size: '.size_section'
      };
      // adding 'reserve_info' only for supported object types.
      if (this.node.get("reserved")) {
        bindings = _.extend(bindings, {
          reserve_info: ".reserve_info"
        });
      }
      // for version, extend the bindings because the v1 and v2 keys are slightly different
      // To support wiki and document Versions
      if (this.node instanceof VersionModel) {
        bindings = _.extend(bindings, {
          version_number_name: ".owner_section",
          owner_id: ".owner_section"
        });
      }
      return bindings;
    },

    _saveField: function (args) {
      // This view is shared for both creation and editing scenarios.
      // Do not save immediately in the creation mode.  The creation dialog
      // has a button to get all field values and perform the action.
      if (this.mode === 'create') {
        return;
      }

      var field   = args.targetField,
          changes = {};

      changes[field.name] = field.value;
      this._saveChanges(changes);
    },

    _saveChanges: function (changes) {
      var MN = '{0}:_saveGeneralChanges {1} {2}';
      var node = this.model.options.node,
          self = this;
      node.save(changes, {
        wait: true,
        patch: true
      }).then(function () {
        return node.fetch();
      }).fail(function (jqxhr) {
        var preValues = self.model.get('data');
        // Reset form data and refresh fields
        self.form.children.forEach(function (formField) {
          formField.setValue(preValues[formField.propertyId]);
          formField.refresh();
        });
        var error = new base.Error(jqxhr);
        GlobalMessage.showMessage('error', error.message);
        self.trigger('forms:error');
      });
    },

    onBeforeDestroy: function() {
      if (this.triggerDefaultAction) {
        this.triggerMethod('execute:DefaultAction', this.options.node);
      }
    },

    updateRenderedForm: function (options) {
      this.updateReserveFieldDisplay();
      FormView.prototype.updateRenderedForm.apply(this, arguments);

      this._showDefaultImage();
      var thumbnail = this.$el.find('.thumbnail_section');
      // default action
      if (this.options.node instanceof VersionModel) {
        //Handling default action for VersionModel differently
        var versionNode = this.options.node;
        thumbnail.click(_.bind(function () {
          var cmd = versionCommands.get('VersionOpen');
          var status = {nodes: new NodeVersionCollection([versionNode])};
          var cmdOptions = {context: this.options.context, originatingView: this};
          cmd.execute(status, cmdOptions);
        }, this));
      } else {
        // default action
        thumbnail.click(_.bind(function (event) {
          if (!this.noDefaultActionExist) {
            // metadataView should not be closed if thumbnail item will open in another tab
            if (!!this.options.node.get("container")) {
              this.options.metadataView.trigger('metadata:close');
              // Hold a flag to wait for form to destroy and then execute DefaultAction.
              this.triggerDefaultAction = true;
            } else {
              this.triggerMethod('execute:DefaultAction', this.options.node);
            }
          }
        }, this));
      }

      thumbnail.on("focusin", function (event) {
        base.checkAndScrollElemToViewport(event.currentTarget);
      });

      var $langSwitcher = $('<span></span>')
          .prop('class', 'icon csui-icon language-switcher')
          .prop('alt', 'Switch language')
          .prop('title', 'Switch language')
          .css('margin-left', '0.5em');
      //  this.form.domEl
      //      .find('#description_section label')
      //      .append($langSwitcher);

      // Let render:form triggered once all extra fields were rendered
      var generalFormFieldDescriptors = this.options.generalFormFieldDescriptors;
      if (generalFormFieldDescriptors && generalFormFieldDescriptors.length) {
        this.listenToOnce(this, 'render:general:form:fields', options.async());
      }
    },

    setFocus: function () {
      //this.form.focus();
      var nonReadOnlyFields = this.$form.find('.alpaca-field:not(.alpaca-readonly) button');
      if (nonReadOnlyFields.length > 0) {
        nonReadOnlyFields[0].focus();
      }
    },

    updateForm: function () {
      if (!!this.node.isReservedClicked || !!this.node.isUnreservedClicked) {
        // only render when reserve or unreserve action is preformed.
        this.render();
        this.node.isReservedClicked = false;
        this.node.isUnreservedClicked = false;
      }
      var alpacaForm     = this.$el.alpaca('get'),
          requiredSwitch = !!this.node.collection && !!this.node.collection.requireSwitched;
      if (!!alpacaForm) {
        var data = this.model.get('data');
        for (var i = 0; i < this.fieldToRefresh.length; i++) {
          var field = alpacaForm.childrenByPropertyId[this.fieldToRefresh[i]],
              value = data[this.fieldToRefresh[i]];
          if (!!field && field.getValue() !== value && !requiredSwitch) {
            field.setValue(value);
            field.refresh();
          }
        }
      }
      this._showDefaultImage();
      this.updateReserveFieldDisplay();
      return this;
    },

    updateReserveFieldDisplay: function () {
      var reserveInfoElem = this.$el.find(".reserve_info");
      if (!!this.node.get('reserved')) {
        if (reserveInfoElem.hasClass("binf-hidden")) {
          reserveInfoElem.removeClass("binf-hidden");
        }
      } else {
        if (!reserveInfoElem.hasClass("binf-hidden")) {
          reserveInfoElem.addClass("binf-hidden");
        }
      }
    },

    _showDefaultImage: function () {
      // show thumbnail missing svg and hide img tag
      var defaultThumbnailEl = this.$el.find('.default_thumbnail'),
          className          = 'thumbnail_missing';
      //checking model is available or not
      if (!!this.options && !!(this.options.model.get('data'))) {
        className = this.options.model.get('data').mimeTypeClassName;
      }
      defaultThumbnailEl.addClass(className);
      defaultThumbnailEl.removeClass('thumbnail_empty');
      // event for keyboard navigation
      var event = $.Event('tab:content:render');
      this.$el.trigger(event);
      if (!!this.noDefaultActionExist) {
        this.$el.find('.default_thumbnail').addClass('thumbnail_disabled');
      }
    }

  });

  return NodeGeneralFormView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/general.panels/document/impl/document.general.form',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-row\">\r\n  {{#if options.label}}\r\n  <div class=\"binf-col-md-12 alpaca-container-label\">\r\n    <h4>{{options.label}}</h4>\r\n  </div>\r\n  {{/if}}\r\n  <div class=\"metadata-pane-container\">\r\n\r\n    <div class=\"metadata-pane-left binf-col-md-6  cs-form-doublecolumn cs-form-leftcolumn\">\r\n      <div class=\"owner_section general-information\"></div>\r\n      <div class=\"typename_section general-information\"></div>\r\n      <div class=\"size_section general-information\"></div>\r\n      <div class=\"reserve_info general-information\"></div>\r\n      <div class=\"csui-extra-general-fields\"></div>\r\n    </div>\r\n    <div class=\"metadata-pane-right binf-col-md-6 cs-form-doublecolumn cs-form-rightcolumn\">\r\n      <div class=\"metadata-tab\">\r\n        {{#if options.showThumbnail}}\r\n        <div class=\"thumbnail_section metadata-preview preview-section\" title=\"{{options.title}}\">\r\n          <span class=\"thumbnail_not_loaded thumbnail_empty\" data-cstabindex=\"0\" role=\"button\"\r\n                aria-label=\"{{options.aria_label}}\"></span>\r\n          <img src=\"{{options.imgSrc}}\" class=\"img-doc-preview binf-hidden\"\r\n               alt=\"{{options.imgAlt}}\">\r\n        </div>\r\n        {{/if}}\r\n        <div class=\"description_section general-information\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_general.panels_document_impl_document.general.form', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/general.panels/document/impl/document.general.form',[],function(){});
csui.define('csui/widgets/metadata/general.panels/document/document.general.form.view',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'hbs!csui/widgets/metadata/general.panels/document/impl/document.general.form',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/general.panels/document/impl/document.general.form'
], function (_, $, Thumbnail, NodeGeneralFormView, formTemplate, lang) {
  'use strict';

  var DocumentGeneralFormView = NodeGeneralFormView.extend({

    constructor: function DocumentGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);

      this.thumbnail = this.options.thumbnail || new Thumbnail({
            node: this.options.node
          });
      this.listenTo(this.thumbnail, 'load', this._showImage)
          .listenTo(this.thumbnail, 'error', this._showDefaultImage)
          .listenTo(this, 'destroy', function () {
            this.thumbnail.destroy();
          });
    },

    formTemplate: formTemplate,
    fieldToRefresh: ['modify_date', 'reserve_info', 'mime_type', 'size'],
    formTemplateHelpers: function () {
      var type_name = this.node.get('type_name'),
          doc_name  = this.node.get('name');
      return {
        showThumbnail: this.mode != 'create',
        title: _.str.sformat(lang.openDoc, type_name),
        aria_label: _.str.sformat(lang.openDocAria, type_name, doc_name),
        reserved: this.node.get('reserved'),
        // a 1x1 transparent gif, to avoid an empty src tag
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        imgAlt: lang.docPreviewAlt
      };
    },

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        size: ".size_section"
      });
    },

    updateRenderedForm: function (options) {
      NodeGeneralFormView.prototype.updateRenderedForm.apply(this, arguments);
      if (this.mode !== 'create') {
        var self = this;
        //Just show image if url is available,otherwise load thumbnail
        if (!!this.thumbnail.url) {
          this._showImage();
        } else {
          this.thumbnail.load();
        }
      }
    },

    _showImage: function () {
      var self                 = this,
          img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded');
      img.attr("src", this.thumbnail.url);
      img.prop('tabindex', '0');
      img.one('load', function (evt) {

        if (evt.target.clientHeight >= evt.target.clientWidth) {
          img.addClass('cs-form-img-vertical');
        } else {
          img.addClass('cs-form-img-horizontal');
        }
        img.addClass('cs-form-img-border');
        //hide the thumbnail background span and show the real img
        thumbnailNotLoadedEl.addClass('binf-hidden');
        img.removeClass('binf-hidden');

        // event for keyboard navigation
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);
      });
    },

    _showDefaultImage: function () {
      // show thumbnail missing svg and hide img tag
      var img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded'),
          className            = 'thumbnail_missing';
      //checking model is available or not
      if (!!this.options && !!(this.options.model.get('data'))) {
        className = this.options.model.get('data').mimeTypeClassName;
      }
      // remove the old mime-type class , then update with new one.
      !!thumbnailNotLoadedEl.prop("className") &&
      thumbnailNotLoadedEl.prop("className").split(' ').forEach(_.bind(function (str) {
        if (str.indexOf('mime') === 0) {
          thumbnailNotLoadedEl.removeClass(str);
        }
      }, thumbnailNotLoadedEl));

      thumbnailNotLoadedEl.addClass(className);
      thumbnailNotLoadedEl.removeClass('thumbnail_empty');
      thumbnailNotLoadedEl.removeClass('csui-icon-notification-error');
      thumbnailNotLoadedEl.removeClass('binf-hidden');
      img.addClass('binf-hidden');

      // event for keyboard navigation
      var event = $.Event('tab:content:render');
      this.$el.trigger(event);
    }
  });

  return DocumentGeneralFormView;

});

csui.define('csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.model',['csui/lib/jquery', 'csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'csui/utils/node.links/node.links',
  'csui/models/specificnodemodel',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function ($, _, NodeGeneralFormModel, nodeLinks, SpecificNodeModel, SyncableMixin,
    lang) {
  'use strict';

  var ShortcutGeneralFormModel = NodeGeneralFormModel.extend({

    constructor: function ShortcutGeneralFormModel(attributes, options) {
      NodeGeneralFormModel.prototype.constructor.apply(this, arguments);
      this.makeSyncableFromMultipleSources(options);
    },

    _mergeSources: function (specificNodeModel, nodeGeneralFormModel) {
      var specProperties    = specificNodeModel[0].forms[0], // for specific node propertie
          generalProperties = nodeGeneralFormModel[0].forms[0]; // for general node properties

      _.extend(generalProperties.data, specProperties.data);
      _.extend(generalProperties.options.fields, specProperties.options.fields);
      _.extend(generalProperties.schema.properties, specProperties.schema.properties);

      generalProperties.options = _.omit(generalProperties.options, 'form');

      this.set(generalProperties);  // fused properties
    },

    sync: function () {
      var specNodeModel        = new SpecificNodeModel(this.node.attributes, {
            connector: this.connector,
            node: this.node,
            context: this.options.context
          }),
          nodeGeneralModel     = new NodeGeneralFormModel(this.node.attributes, {
            connector: this.connector,
            node: this.options.node,
            context: this.options.context
          }),
          specificModelPromise = specNodeModel.fetch(),
          generalModelPromise  = nodeGeneralModel.fetch(),
          options              = {parse: false};
      return this.syncFromMultipleSources(
          [specificModelPromise, generalModelPromise], this._mergeSources, options);
    }
  });
  SyncableMixin.mixin(ShortcutGeneralFormModel.prototype);
  return ShortcutGeneralFormModel;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-row\">\r\n  {{#if options.label}}\r\n  <div class=\"binf-col-md-12 alpaca-container-label\">\r\n    <h4>{{options.label}}</h4>\r\n  </div>\r\n  {{/if}}\r\n  <div class=\"metadata-pane-container\">\r\n    <div class=\"metadata-pane-left binf-col-md-6  cs-form-doublecolumn\r\n    cs-form-leftcolumn\">\r\n      <div class=\"owner_section general-information\"></div>\r\n      <div class=\"typename_section general-information\"></div>\r\n      <div class=\"csui-extra-general-fields\"></div>\r\n    </div>\r\n    <div class=\"metadata-pane-right binf-col-md-6 cs-form-doublecolumn cs-form-rightcolumn\">\r\n      <div class=\"metadata-tab\">\r\n        {{#if options.showThumbnail}}\r\n        <div class=\"thumbnail_section metadata-preview preview-section\" title=\"{{options.title}}\">\r\n          <span class=\"default_thumbnail thumbnail_empty\" data-cstabindex=\"0\" role=\"button\"\r\n                aria-label=\"{{options.title}}\"></span>\r\n        </div>\r\n        {{/if}}\r\n        <div class=\"shortcut_section general-information\"></div>\r\n        <div class=\"description_section general-information\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_general.panels_shortcut_impl_shortcut.general.form', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form',[],function(){});
csui.define('csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.view',['csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'csui/utils/contexts/factories/node',
  'hbs!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form',
  'css!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form'
], function (_, NodeGeneralFormView, NodeModelFactory, formTemplate) {
  'use strict';

  var ShortcutGeneralFormView = NodeGeneralFormView.extend({

    constructor: function ShortcutGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);

      // share the original node for deeper form fields code
      if (options.context && options.node && options.node.original &&
          options.node.original.get('id') > 0) {
        // Create the node model or do nothing if it exists
        options.context.getModel(NodeModelFactory, {
          // Add unique id to the propertyPrefix for this object
          attributes: {id: options.node.original.get('id')},
          // Pass the property value using the propertyPrefix of the factory
          node: options.node.original,
          // Discard the model during context change to prevent its re-fetch 
          temporary: true
        });
      }
    },

    formTemplate: formTemplate,

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        original_id: '.shortcut_section'
      });
    }

  });

  return ShortcutGeneralFormView;

});

csui.define('csui/widgets/metadata/general.panels/url/url.general.form.model',['csui/lib/jquery', 'csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'csui/models/specificnodemodel',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function ($, _, NodeGeneralFormModel, SpecificNodeModel, SyncableMixin, lang) {
  'use strict';

  var UrlGeneralFormModel = NodeGeneralFormModel.extend({

    constructor: function UrlGeneralFormModel(attributes, options) {
      NodeGeneralFormModel.prototype.constructor.apply(this, arguments);
      this.makeSyncableFromMultipleSources(options);
    },

    _mergeSources: function (specificNodeModel, nodeGeneralFormModel) {
      var specProperties    = specificNodeModel[0].forms[0], // for specific node propertie
          generalProperties = nodeGeneralFormModel[0].forms[0]; // for general node properties

      _.extend(generalProperties.data, specProperties.data);
      _.extend(generalProperties.options.fields, specProperties.options.fields);
      _.extend(generalProperties.schema.properties, specProperties.schema.properties);

      generalProperties.options = _.omit(generalProperties.options, 'form');

      this.set(generalProperties);  // fused properties
    },

    sync: function () {
      var specNodeModel        = new SpecificNodeModel(this.node.attributes, {
            connector: this.connector,
            node: this.node,
            context: this.options.context
          }),
          nodeGeneralModel     = new NodeGeneralFormModel(this.node.attributes, {
            connector: this.connector,
            node: this.options.node,
            context: this.options.context
          }),
          specificModelPromise = specNodeModel.fetch(),
          generalModelPromise  = nodeGeneralModel.fetch(),
          options              = {parse: false};
      return this.syncFromMultipleSources(
          [specificModelPromise, generalModelPromise], this._mergeSources, options);
    }
  });

  SyncableMixin.mixin(UrlGeneralFormModel.prototype);
  return UrlGeneralFormModel;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/general.panels/url/impl/url.general.form',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-row\">\r\n  {{#if options.label}}\r\n  <div class=\"binf-col-md-12 alpaca-container-label\">\r\n    <h4>{{options.label}}</h4>\r\n  </div>\r\n  {{/if}}\r\n  <div class=\"metadata-pane-container\">\r\n    <div class=\"metadata-pane-left binf-col-md-6  cs-form-doublecolumn\r\n    cs-form-leftcolumn\">\r\n      <div class=\"owner_section general-information\"></div>\r\n      <div class=\"typename_section general-information\"></div>\r\n      <div class=\"csui-extra-general-fields\"></div>\r\n    </div>\r\n    <div class=\"metadata-pane-right binf-col-md-6 cs-form-doublecolumn cs-form-rightcolumn\">\r\n      <div class=\"metadata-tab\">\r\n        {{#if options.showThumbnail}}\r\n        <div class=\"thumbnail_section metadata-preview preview-section\" title=\"{{options.title}}\">\r\n          <span class=\"default_thumbnail thumbnail_empty\" data-cstabindex=\"0\" role=\"button\"\r\n                aria-label=\"{{options.title}}\"></span>\r\n        </div>\r\n        {{/if}}\r\n        <div class=\"url_section general-information\"></div>\r\n        <div class=\"description_section general-information\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_general.panels_url_impl_url.general.form', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/general.panels/url/impl/url.general.form',[],function(){});
csui.define('csui/widgets/metadata/general.panels/url/url.general.form.view',['csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'hbs!csui/widgets/metadata/general.panels/url/impl/url.general.form',
  'css!csui/widgets/metadata/general.panels/url/impl/url.general.form'
], function (_, NodeGeneralFormView, formTemplate) {
  'use strict';

  var UrlGeneralFormView = NodeGeneralFormView.extend({

    constructor: function UrlGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);
    },

    formTemplate: formTemplate,

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        url: ".url_section"
      });
    }

  });

  return UrlGeneralFormView;

});


csui.define('csui/widgets/metadata/metadata.general.panels',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/widgets/metadata/general.panels/document/document.general.form.view',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.model',
  'csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.view',
  'csui/widgets/metadata/general.panels/url/url.general.form.model',
  'csui/widgets/metadata/general.panels/url/url.general.form.view',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load extra general property panel rules to be added to the built-in ones
  'csui-ext!csui/widgets/metadata/metadata.general.panels'
], function (_, Backbone,
    DocumentGeneralFormModel, DocumentGeneralFormView,
    NodeGeneralFormModel, NodeGeneralFormView,
    ShortcutGeneralFormModel, ShortcutGeneralFormView,
    UrlGeneralFormModel, UrlGeneralFormView,
    RulesMatchingMixin, extraGeneralPanels) {
  'use strict';

  var MetadataGeneralPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      contentModel: null,
      contentView: null,
      contentViewOptions: null
    },

    constructor: function MetadataGeneralPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(MetadataGeneralPanelModel.prototype);

  var MetadataGeneralPanelCollection = Backbone.Collection.extend({

    model: MetadataGeneralPanelModel,
    comparator: "sequence",

    constructor: function MetadataGeneralPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var generalPanels = new MetadataGeneralPanelCollection([
    {
      // document and Email
      equals: {type: [144, 749]},
      contentModel: DocumentGeneralFormModel,
      contentView: DocumentGeneralFormView,
      sequence: 100
    },
    {
      // shortcut and generation
      equals: {type: [1, 2]},
      contentModel: ShortcutGeneralFormModel,
      contentView: ShortcutGeneralFormView,
      sequence: 100
    },
    {
      // url
      equals: {type: 140},
      contentModel: UrlGeneralFormModel,
      contentView: UrlGeneralFormView,
      sequence: 100
    },
    {
      // default node
      contentModel: NodeGeneralFormModel,
      contentView: NodeGeneralFormView,
      sequence: 10000
    }
  ]);

  if (extraGeneralPanels) {
    generalPanels.add(_.flatten(extraGeneralPanels, true));
  }

  return generalPanels;

});

csui.define('csui/widgets/metadata/property.panels/general/metadata.general.property.controller',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/form', 'csui/controls/form/form.view',
  'csui/widgets/metadata/metadata.general.panels'
], function (_, $, Marionette, FormModel, FormView, generalPanels) {
  'use strict';

  var MetadataGeneralPropertyController = Marionette.Controller.extend({

    constructor: function MetadataExternalPropertyController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },

    getPropertyPanels: function (options) {
      var generalPanel = this._getGeneralPanel(),
          formModel = new generalPanel.model(undefined, {
            connector: this.connector,
            node: this.options.model,
            context: this.options.context
          }),
          self = this;
      return formModel
          .fetch()
          .then(function () {
            return [{
              model: formModel,
              contentView: generalPanel.contentView,
              contentViewOptions: generalPanel.contentViewOptions
            }];
          });
    },

    getPropertyPanelsForCreate: function (options) {
      var generalPanel = this._getGeneralPanel(),
          deferred = $.Deferred(),
          formModel = options.forms.findWhere({id: 'general'});
      // The 'v1/forms/nodes/create' always returns the general form.
      // If other collection is used to fetch the pre-filled forms, it
      // has to include some form with the 'general' id too
      if (!formModel) {
        throw new Error('General form missing.');
      }
      formModel = new generalPanel.model(formModel.attributes, {
        connector: this.connector,
        node: this.options.model,
        parse: true
      });
      return deferred
          .resolve([{
            model: formModel,
            contentView: generalPanel.contentView,
            contentViewOptions: generalPanel.contentViewOptions
          }])
          .promise();
    },

    getPropertyPanelsForMove: function (options) {
      return this._getPropertyPanelsForMoveAndCopy(options);
    },

    getPropertyPanelsForCopy: function (options) {
      return this._getPropertyPanelsForMoveAndCopy(options);
    },

    // Add read-only general tab fro move and copy scenarios;
    // useless for the operation, but the user may like to see
    // more information about the copied items and is ready to
    // pay the price for the fetching server call.
    _getPropertyPanelsForMoveAndCopy: function (options) {
      var generalPanel = this._getGeneralPanel(),
          formModel = new generalPanel.model(undefined, {
            connector: this.connector,
            node: this.options.model
          }),
          self = this;
      return formModel
          .fetch()
          .then(function () {
            formModel.get('schema').readonly = true;
            return [{
              model: formModel,
              contentView: generalPanel.contentView,
              contentViewOptions: generalPanel.contentViewOptions
            }];
          });
    },

    _getGeneralPanel: function () {
      var panel = generalPanels.findByNode(this.options.model);
      return {
        model: panel.get('contentModel') || FormModel,
        contentView: panel.get('contentView') || FormView,
        contentViewOptions: panel.get('contentViewOptions')
      };
    }

  });

  return MetadataGeneralPropertyController;

});


csui.define('csui/widgets/metadata/metadata.property.panels',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/property.panels/general/metadata.general.property.controller',
  // Load extra property panels to be added to the built-in tabs
  'csui-ext!csui/widgets/metadata/metadata.property.panels'
], function (_, Backbone, MetadataGeneralPropertyController, extraPropertyPanels) {

  var MetadataPropertyPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataPropertyPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataPropertyPanelCollection = Backbone.Collection.extend({

    model: MetadataPropertyPanelModel,
    comparator: "sequence",

    constructor: function MetadataPropertyPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataPropertyPanels = new MetadataPropertyPanelCollection([
    {
      sequence: 10,
      controller: MetadataGeneralPropertyController
    }
  ]);

  if (extraPropertyPanels) {
    extraPropertyPanels = _.flatten(extraPropertyPanels, true);
    _.each(extraPropertyPanels, function () {
      var sequence = extraPropertyPanels.sequence;
      if (sequence < 10 || sequence > 100) {
        throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
      }
    });
    metadataPropertyPanels.add(extraPropertyPanels);
  }

  return metadataPropertyPanels;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-dropdown\">\r\n  <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.btnId || (depth0 != null ? depth0.btnId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnId","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-dropdown-toggle\"\r\n          data-binf-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.addTitleTooltip || (depth0 != null ? depth0.addTitleTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addTitleTooltip","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"csui-button-icon icon-toolbarAdd\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.addTitleTooltip || (depth0 != null ? depth0.addTitleTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addTitleTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n  </button>\r\n  <ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n</div>\r\n<div class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled binf-hidden\">\r\n  <span class=\"csui-loading-dots-wrapper\">\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n  </span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_add.properties_add.properties.dropdown.menu', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',[],function(){});
csui.define('csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu.view',["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/lib/marionette",
  'csui/utils/log', 'csui/controls/toolbar/toolitem.view', 'csui/controls/progressblocker/blocker',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model', 'csui/utils/commands',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'hbs!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'csui/lib/binf/js/binf'
], function ($, _, Backbone, Marionette, log, ToolItemView, BlockingView,
    NodeCollection, FilteredToolItemsCollection, commands, DropdownMenuBehavior,
    template, lang) {

  //
  // This view shows the '+' icon for add properties commands such as 'add categories',
  // 'add classifications', etc.
  // - When there is only one command (for example: just 'add categories'), the '+' is just a
  // command icon that would launch the only only command when the user clicks on it.
  // - When there are two or more commands, the '+' icon is a dropdown menu that shows all the
  // available commands.
  //
  // Params:
  // - suppressAddProperties <boolean> : true to suppress the '+' icon
  //
  var AddPropertiesDropdownMenuView = Marionette.CompositeView.extend({

    className: "metadata-add-properties",

    template: template,
    templateHelpers: function () {
      return {
        btnId: _.uniqueId('addPropertiesButton'),
        addTitleTooltip: (this.collection.length === 1 ?
                          this.collection.at(0).get('name') : lang.addNewProperties)
      };
    },

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        role: 'menuitem'
      };
    },

    ui: {
      dropdownDiv: '.binf-dropdown',
      dropdownToggle: '.binf-dropdown-toggle',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
    },

    behaviors: {
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function AddPropertiesDropdownMenuView(options) {
      options || (options = {});
      this.context = options.context;
      this.commands = options.commands || commands;
      this.node = options.node;
      this.container = options.container;
      this.formCollection = options.collection;
      this.originalFormCollection = options.formCollection;
      this.listenTo(this.formCollection, "reset", this._updateMenuItems);

      this.originatingView = options.originatingView;
      if (options.blockingParentView) {
        BlockingView.delegate(this, options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      var status = {
        nodes: new NodeCollection([options.node]),
        container: options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        context: options.context
      };

      var toolbarName = 'addPropertiesToolbar';
      var toolItemFactory = options.toolbarItems[toolbarName];
      options.collection = new FilteredToolItemsCollection(
          toolItemFactory, {
            status: status,
            commands: this.commands,
            delayedActions: options.containerCollection &&
                            options.containerCollection.delayedActions,
            mask: options.toolbarItemsMask
          });

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);

      // Passing the el to the ctor prevents creating an own el, including
      // setting its attributes.  The caller must ensure the right tag.
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.node, 'sync change', this._reRender)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);

      if (options.containerCollection && options.containerCollection.delayedActions) {
        this.listenTo(options.containerCollection.delayedActions, 'sync', this._reRender);
      }
    },

    _updateMenuItems: function () {
      this.collection.refilter();
    },

    _reRender: function () {
      // Properties is being destroyed on changing the context node. Both destroyer
      // and a sub-view refreshed are listening on node changes. Although listening
      // is stopped during the destruction, already registered handlers will be
      // triggered nevertheless.
      if (this._isRendered && !this.isDestroyed) {
        this._updateMenuItems();
        this.render();
      }
    },

    onRender: function () {
      this._ensureLazyActionsRetrieved().done(_.bind(function () {
        if (this.collection.length < 1 || this.options.suppressAddProperties === true) {
          // hide the + button if there is no action
          this.$el.addClass('binf-hidden');
          this.ui.dropdownToggle.attr('data-cstabindex', '-1');
        } else {
          // show the view because with the latest code the view now can be hidden by the PUT call
          // event that the node does not have any actions yet until it is re-fetched
          this.$el.find('.binf-dropdown').removeClass('binf-hidden');
          this.$el.removeClass('binf-hidden');
          this.ui.dropdownToggle.attr('data-cstabindex', '0');
          // when there is only one command, set aria-haspopup=false
          if (this.collection.length === 1) {
            this.ui.dropdownToggle.attr('aria-haspopup', false);
          }
        }

        if (this.collection.length > 1) {
          // make the dropdown menu when there are more than 1 menu item
          this.ui.dropdownToggle.binf_dropdown();
        }

        this.ui.dropdownDiv.on('click', _.bind(this._onClickAddButton, this));
        this.ui.dropdownToggle.on('click', _.bind(this._onClickAddButton, this));

        var self = this;
        setTimeout(function () {
          // event for keyboard navigation
          var event = $.Event('tab:content:render');
          self.$el.trigger(event);
        }, 200);

      }, this)).fail(function () {
        this.$el.addClass('binf-hidden');
        this.ui.dropdownToggle.attr('data-cstabindex', '-1');
      });

    },

    _closeToggle: function () {
      if (this.options.suppressAddProperties !== true) {
        var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
        if (dropdownToggleEl.parent().hasClass('binf-open')) {
          dropdownToggleEl.binf_dropdown('toggle', false);
        }
      }
    },

    _onClickAddButton: function (event) {
      if (this.collection.length === 1) {
        Backbone.trigger('closeToggleAction');
        event.preventDefault();
        event.stopPropagation();

        // when there is just one command
        this._executeAction(this.collection.at(0).get('signature'));
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

      this._executeAction(args.toolItem.get("signature"));
    },

    _executeAction: function (signature) {
      var command = this.commands.findWhere({signature: signature});

      var executeOptions = {
        action: this.options.action,
        node: this.options.node,
        collection: this.formCollection,
        container: this.options.container,
        inheritance: this.options.inheritance,
        context: this.options.context,
        parentView: this.options.parentView,  // use for blocking view and callback
        addPropertiesCallback: this.options.addPropertiesCallback
      };

      var status = {
        context: this.options.context,
        nodes: new NodeCollection([this.node]),
        container: this.options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        originatingView: this.originatingView
      };

      if (command && command.enabled(status)) {
        var el = this.ui.dropdownDiv;
        el.addClass("binf-disabled");
        command.execute(status, executeOptions)
            .done(_.bind(function (resp) {
              el.removeClass("binf-disabled");
              //focus on tab link for added property
              el.closest('.tab-links').find('.tab-links-bar ul li.binf-active a').focus();
            }, this))
            .fail(function (error) {
              el.removeClass("binf-disabled");
              if (error && error.cancelled) {
                //focus on dropdown toggle icon
                el.find(".binf-btn.binf-dropdown-toggle").focus();
              }
            });
      }
    },
    _ensureLazyActionsRetrieved: function () {
      var deferred                = $.Deferred(),
          node                    = this.options.node,
          lazyActionsAreRetrieved = !!node.get('csuiLazyActionsRetrieved'),
          isNodeLocallyCreated    = !!node.isLocallyCreated,
          nonPromotedCommands     = node.nonPromotedActionCommands;
      if (!!node && !lazyActionsAreRetrieved && !isNodeLocallyCreated && nonPromotedCommands &&
          nonPromotedCommands.length) {
        this.$el.find('.binf-dropdown').addClass('binf-hidden');
        this.ui.loadingIconsDiv.removeClass('binf-hidden');
        node.setEnabledLazyActionCommands(true).done(_.bind(function () {
          //As per UX req: need to show loading dots atleast for 300ms after fetch as like in
          // inlineactionbar
          setTimeout(_.bind(function () {
            this.ui.loadingIconsDiv.addClass('binf-hidden');
            this._updateMenuItems();
            deferred.resolve();
          }, this), 300);
        }, this)).fail(_.bind(function () {
          this.$el.find('.binf-dropdown').removeClass('binf-hidden');
          deferred.reject();
        }, this));
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return AddPropertiesDropdownMenuView;
});



csui.define('csui/widgets/metadata/add.properties.menuitems',['csui/lib/underscore', 'csui/utils/base',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/metadata/add.properties.menuitems',
  // Load extra tool items from the previous module location
  'csui-ext!csui/widgets/metadata/add.properties/toolbaritems'
], function (_, base, lang, ToolItemsFactory, TooItemModel,
    extraToolItems, oldExtraToolItems) {
  'use strict';

  var toolbarItems = {

    addPropertiesToolbar: new ToolItemsFactory(
        {
          add: [
            {
              signature: "AddCategory",
              name: lang.addNewCategory
            }
          ]
        },
        {
          maxItemsShown: 0 // force toolbar to immediately start with a drop-down list
        }
    )

  };

  if (oldExtraToolItems) {
    // TODO: Issue deprecation warning
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

csui.define('csui/widgets/metadata/add.properties.menuitems.mask',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  var AddPropertiesMenuItemsMask = ToolItemMask.extend({

    constructor: function AddPropertiesMenuItemsMask() {
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

  return AddPropertiesMenuItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-tab-contents-header-content\">\r\n  <div class=\"csui-tab-contents-header-right\">\r\n    <div class=\"required-field-switch binf-hidden\">\r\n        <span id=\""
    + this.escapeExpression(((helper = (helper = helpers.requiredFieldsLabelId || (depth0 != null ? depth0.requiredFieldsLabelId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"requiredFieldsLabelId","hash":{}}) : helper)))
    + "\" class=\"only-required-fields-label\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.onlyRequiredFieldsLabel || (depth0 != null ? depth0.onlyRequiredFieldsLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"onlyRequiredFieldsLabel","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.onlyRequiredFieldsLabel || (depth0 != null ? depth0.onlyRequiredFieldsLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"onlyRequiredFieldsLabel","hash":{}}) : helper)))
    + "</span>\r\n      <div class=\"required-fields-switch\"></div>\r\n    </div>\r\n  </div>\r\n  <h4>General</h4>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_tab.contents.header_tab.contents.header', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header',[],function(){});
csui.define('csui/widgets/metadata/impl/tab.contents.header/tab.contents.header.view',['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/form/pub.sub',
  'csui/models/version',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'hbs!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header',
  'css!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header', 'csui/lib/binf/js/binf'
], function (require, $, _, Backbone, Marionette, PubSub, VersionModel, lang,
    tabContentsHeaderTemplate) {
  'use strict';

  var TabContentsHeaderView = Marionette.ItemView.extend({

    tagName: 'div',

    className: 'csui-tab-contents-header',

    template: tabContentsHeaderTemplate,

    ui: {
      leftTabContentsHeader: '.csui-tab-contents-header-content',
      rightTabContentsHeader: '.csui-tab-contents-header-right',
      tabContentsHeaderTitle: '.csui-tab-contents-header-content h4',
      requiredSwitchEle: '.required-field-switch', //container of required field switch
      requiredSwitchIcon: '.required-field-switch > div.required-fields-switch'
    },

    events: {
      'click @ui.requiredSwitchIcon': 'onClickRequiredIconDiv',
      'keydown': 'onKeyInView'
    },

    constructor: function TabContentsHeaderView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.pubsubPostFix = (this.options.node instanceof VersionModel ? 'v' : 'p') +
                           this.options.node.get('id');

      this.requiredFieldsLabelId = _.uniqueId("requiredFields");

      var objPubSubId = 'pubsub:tab:contents:header:view:change:tab:title:' + this.pubsubPostFix;
      PubSub.off(objPubSubId);

      this.listenTo(PubSub, objPubSubId, this._changeTabTitle);

      this.listenTo(this.collection, 'add', function (model) {
        !!model.get('required') && this._showRequiredSwitch();
      });
      this.listenTo(this.collection, 'remove', function (model) {
        if (!this.isRequiredCatPresent()) {
          this._hideRequiredSwitch();
        }
      });

      this.listenTo(this, 'metadata:schema:updated', function (model) {
        if (!this.isRequiredCatPresent()) {
          this._hideRequiredSwitch();
        } else {
          this._showRequiredSwitch();
        }
      }, this);
    },

    templateHelpers: function () {
      return {
        onlyRequiredFieldsLabel: lang.onlyRequiredFieldsLabel,
        requiredFieldsLabelId: this.requiredFieldsLabelId
      };
    },

    _changeTabTitle: function (args) {
      this.$(this.ui.tabContentsHeaderTitle).html(args);
    },

    onRender: function () {
      this.requiredFieldSwitchModel = new Backbone.Model(
          {data: !!this.options.node.collection.requireSwitched});
      var self = this;

      //fix for grunt out-release
      csui.require(['csui/controls/form/fields/booleanfield.view'], function (BooleanFieldView) {
        self.requiredFieldSwitchView = new BooleanFieldView({
          mode: 'writeonly',
          model: self.requiredFieldSwitchModel,
          labelId: self.requiredFieldsLabelId
        });
        self.requiredFieldSwitchView.render();
        self.listenTo(self.requiredFieldSwitchView, 'field:changed', function (event) {  //toggle
          // required fields
          var objPubSubId = 'pubsub:tab:contents:header:view:switch:' + self.pubsubPostFix;

          PubSub.trigger(objPubSubId, {on: event.fieldvalue});
          if (!!self.options.node.collection) {
            self.options.node.collection.requireSwitched = event.fieldvalue;
          }
        });
        self.$('.required-fields-switch').append(self.requiredFieldSwitchView.$el);
        if (self.isRequiredCatPresent()) {
          self._showRequiredSwitch();
        }

        PubSub.off('pubsub:header:rightbar:view:change:switch:status');
        self.listenTo(PubSub, 'pubsub:header:rightbar:view:change:switch:status', function (reset) {
          if (!!reset) {
            if (!!self.requiredFieldSwitchView.curVal) {
              self.requiredFieldSwitchView.$el.click();
            }
          } else if (!!self.requiredFieldSwitchModel &&
                     (self.requiredFieldSwitchModel.get('data') !== undefined &&
                     !self.requiredFieldSwitchModel.get('data')) && !!self.options.node &&
                     !!self.options.node.collection &&
                     !!self.options.node.collection.requireSwitched) {
            self.requiredFieldSwitchView.$el.click();
          }
        });

      });
    },

    currentlyFocusedElement: function (event) {
      if (!this.ui.requiredSwitchEle.hasClass('binf-hidden') && this.requiredFieldSwitchView) {
        return $(this.ui.requiredSwitchIcon.find(":input"));
      } else {
        return undefined;
      }
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 32 || event.keyCode === 13) {
        // space key(32) or enter key(13)
        if (!this.ui.requiredSwitchEle.hasClass('binf-hidden') && this.requiredFieldSwitchView) {
          event.preventDefault();
          event.stopPropagation();
          // need timeout to overcome FireFox space press
          setTimeout(_.bind(function () {
            $(target).click();
          }, this), 200);
        }
      }
      return undefined;
    },

    // this method is triggered by keyboard
    onClickRequiredIconDiv: function (event) {
      this.requiredFieldSwitchView.onClickWriteField(event);
    },

    _hideRequiredSwitch: function () {
      this.ui.tabContentsHeaderTitle.addClass('csui-tab-contents-header-title-full-width');
      this.ui.requiredSwitchEle.addClass('binf-hidden');
      //turn off if no required cat is present
      !!this.requiredFieldSwitchView && !!this.requiredFieldSwitchView.getValue() &&
      this.requiredFieldSwitchView.ui.flagWriteField.trigger('click');
    },

    _showRequiredSwitch: function () {
      this.ui.tabContentsHeaderTitle.removeClass('csui-tab-contents-header-title-full-width');
      this.ui.requiredSwitchEle.removeClass('binf-hidden');
    },

    isRequiredCatPresent: function () {
      var isRequiredCatPresent = false,
          i                    = 0;
      for (; !isRequiredCatPresent && i < this.collection.models.length; i++) {
        isRequiredCatPresent = this.collection.models[i].get('required') === true;
      }
      return isRequiredCatPresent;
    }
  });

  return TabContentsHeaderView;

});

csui.define('csui/widgets/metadata/impl/metadata.properties.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/url', 'csui/utils/base', 'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/models/form', 'csui/controls/form/form.view',
  'csui/widgets/metadata/property.panels/categories/impl/category.form.view',
  'csui/models/appliedcategories', 'csui/widgets/metadata/impl/metadata.forms',
  'csui/dialogs/modal.alert/modal.alert', 'csui/controls/progressblocker/blocker',
  'csui/models/version', 'csui/widgets/metadata/impl/metadata.utils', 'i18n',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/widgets/metadata/general.form.fields/general.form.field.behavior',
  'csui/widgets/metadata/general.action.fields/general.action.field.behavior',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/widgets/metadata/metadata.property.panels',
  'csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu.view',
  'csui/widgets/metadata/add.properties.menuitems',
  'csui/widgets/metadata/add.properties.menuitems.mask',
  'csui/widgets/metadata/impl/tab.contents.header/tab.contents.header.view',
  'csui/controls/form/pub.sub',
  'csui/widgets/metadata/impl/metadata.tabcontentcollection.view',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, Marionette, Url, base, TabPanelView, TabLinkCollectionViewExt,
    TabLinksScrollMixin, FormModel, FormView, CategoryFormView, AppliedCategoryCollection,
    MetadataFormCollection, ModalAlert, BlockingView, VersionModel, MetadataUtils, i18n,
    PerfectScrollingBehavior, GeneralFormFieldBehavior, GeneralActionFieldBehavior, lang,
    metadataPropertyPanels,
    AddPropertiesDropdownMenuView, toolbarItems, AddPropertiesMenuItemsMask,
    TabContentHeaderView, PubSub, MetadataTabContentCollectionView) {

  // Private and local collection defined and used by Metadata Properties View Class
  var AppliedCategoryActionsCollection = AppliedCategoryCollection.extend({

    constructor: function AppliedCategoryActionsCollection(attributes, options) {
      AppliedCategoryCollection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      _.defaults(this.options, {urlResource: ''});
    },

    url: function () {
      return Url.combine(this.node.urlBase(), this.options.urlResource);
    },

    fetch: function () {
      //
      // 1. with document version, the is no categories/actions call but luckily everything is
      // read-ony in UX specs for this release of the UI
      //
      // 2. with add item, the object has not been created yet on the server
      //
      if (this.node instanceof VersionModel ||
          this.node.get("id") === undefined || this.options.action) {
        this.fetching = false;
        this.fetched = true;
        return $.Deferred().resolve();
      }

      return AppliedCategoryCollection.prototype.fetch.apply(this, arguments);
    },

    parse: function () {
      // with document version, the is no categories/actions call but luckily everything is
      // read-ony in UX specs for this release of the UI
      if (this.node instanceof VersionModel) {
        return {};
      }
      // with add item, the object has not been created yet on the server
      if (this.node.get("id") === undefined || this.options.action) {
        return {categories_add: "dummy value"};
      }
      return AppliedCategoryCollection.prototype.parse.apply(this, arguments);
    }

  });

  //
  // Public: Metadata Properties View Class
  // Description: provides the view of general and other metadata properties (such as categories,
  // etc.) of a node.  It allows for navigation, editing and getting form values of different types
  // of metadata.
  //
  var MetadataPropertiesViewImpl = TabPanelView.extend({

    className: (base.isTouchBrowser() ? 'cs-touch-browser ' : '') + 'cs-metadata-properties' +
               ' binf-panel binf-panel-default',

    rtlEnabled: i18n.settings.rtl,

    contentView: function (model) {
      var panel = _.findWhere(this._propertyPanels, {model: model});
      if (panel) {
        return panel.contentView || FormView;
      }
      if (model.get('role_name') === 'categories') {
        return CategoryFormView;
      }
      return FormView;
    },

    contentViewOptions: function (model) {
      var options = {
            context: this.options.context,
            node: this.options.node,
            mode: this.options.formMode,
            fetchedModels: this.allForms,
            displayedModels: this.collection,
            originatingView: this,
            layoutMode: 'doubleCol',
            metadataView: this.options.metadataView,
            generalFormFieldDescriptors: this._generalFormFieldDescriptors,
            generalActionFieldDescriptors: this._generalActionFieldDescriptors
          },
          panel   = _.findWhere(this._propertyPanels, {model: model});
      if (panel) {
        _.extend(options, panel.contentViewOptions);
      }
      return options;
    },

    // specific implementation for TabableRegionBehavior
    isTabable: function () {
      if (this.options.notTabableRegion === true) {
        return false;
      }
      return true;  // this view can be reached by tab
    },

    constructor: function MetadataPropertiesViewImpl(options) {
      options || (options = {});
      var delete_icon;

      if (base.isTouchBrowser()) {
        delete_icon = 'category_delete-touch-browser';
      } else {
        delete_icon = 'category_delete';
      }

      _.defaults(options, {
        tabType: 'binf-nav-pills',
        mode: 'spy',
        extraScrollTopOffset: 3,
        formMode: 'update',
        toolbar: true,
        toolbarItems: toolbarItems,
        delete_icon: delete_icon,
        delete_tooltip: lang.removeCategoryTooltip,
        contentView: this.getContentView,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        TabContentCollectionViewClass: MetadataTabContentCollectionView,
        searchTabContentForTabableElements: true,
        tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                                ' select:not([disabled]), textarea:not([disabled]),' +
                                ' button:not([disabled]), iframe, object, embed,' +
                                ' *[tabindex], *[data-cstabindex], *[contenteditable]'
      });

      if (!options.toolbarItemsMask) {
        options.toolbarItemsMask = new AddPropertiesMenuItemsMask();
      }

      this.behaviors = _.extend({
        PerfectScrolling: {
          behaviorClass: PerfectScrollingBehavior,
          contentParent: '> .binf-tab-content',
          scrollXMarginOffset: 30,
          // like bottom padding of container, otherwise scrollbar is shown always
          scrollYMarginOffset: 15
        }
      }, this.behaviors);

      if (options.collection) {
        this.allForms = options.collection;
      } else {
        this.allForms = new MetadataFormCollection(undefined, {
          node: options.node,
          connector: options.node.connector,
          container: options.container,
          action: options.action,
          inheritance: options.inheritance,
          autoreset: true,
          formCollection: options.formCollection
        });
        // Prepare an empty collection to be populated by tabs/forms later
        options.collection = new Backbone.Collection();
      }

      // have collection to keep track of newly added categories
      if (options.node.newCategories === undefined) {
        options.node.newCategories = new Backbone.Collection();
      }
      if (options.node.removedCategories === undefined) {
        options.node.removedCategories = [];
      }

      TabPanelView.prototype.constructor.apply(this, arguments);

      this.widths = [];

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      PubSub.off('pubsub:tab:contents:panel:textarea:scrollupdate');
      this.listenTo(PubSub, 'pubsub:tab:contents:panel:textarea:scrollupdate',
          this._updateToTextAreaScrollbar);

      this.listenTo(this.allForms, "request", this.blockActions)
          .listenTo(this.allForms, "request", this._checkFormFetching)
          .listenTo(this.allForms, "sync", this._syncForms)
          .listenTo(this.allForms, "sync", this.unblockActions)
          .listenTo(this.allForms, "destroy", this.unblockActions)
          .listenTo(this.allForms, "error", this.unblockActions)
          // If tab panel re-renders itself whe the tab collection changes, it
          // has to prevent tab links and tab content from doing the same,
          // because these two views are destroyed during tab panel re-rendering
          .listenTo(this.collection, "reset", this.render)
          .listenTo(options.node, 'change:id', function () {
            if (this.options.formMode !== 'create') {
              this._fetchForms();
            }
          }).listenTo(this, 'reset:switch', this._resetRequiredSwitchView)
          .listenTo(this, "update:button", _.bind(function (flag) {
            this.options.metadataView.trigger("update:button", {overlay: flag});
          }, this));

      // If the collection has been fetched before passing it to the view
      // and the operation is still ongoing, turn on the blocking view right
      // away and wait for the finishing event to turn it off
      if (this.allForms.fetching) {
        this.blockActions();
      }

      $(window).bind('resize', {view: this}, this._onWindowResize);
      $(window).bind('resize.tableview', {view: this}, this._onWindowResize);

      // Perform after-rendering steps after blocking view renders inside
      // into this view; it registers for the render event earlier
      this.listenTo(this, 'render', this.onRendered);
      this.listenTo(Backbone, 'metadata:schema:updated', function (model) {
        this.resolveHasRequiredFields(model);
        this.has_required_fields = this.collection
            .filter(
                function (model) {
                  return model.get('required') === true;
                });
        this.tabLinks.trigger('metadata:schema:updated', model);
        this.tabContentHeader.trigger('metadata:schema:updated', model);
      }, this);
    },

    onBeforeDestroy: function () {
      $(window).unbind('resize', this._onWindowResize);
      $(window).unbind('resize.tableview', this._onWindowResize);

      if (this.addPropertiesView) {
        this.cancelEventsToViewsPropagation(this.addPropertiesView);
        this.addPropertiesView.destroy();
      }

      if (this.contentHeaderRegion) {
        this.contentHeaderRegion.empty();
      }
    },

    _updateScrollbar: function () {
      this.trigger('update:scrollbar');
      this.$(this.behaviors.PerfectScrolling.contentParent).animate({scrollTop: 0}, "fast");
    },

    _updateToTextAreaScrollbar: function (data) {
      this.trigger('update:scrollbar');
      var scrollTop = data.$el.offset().top -
                      this.$(this.behaviors.PerfectScrolling.contentParent).offset().top;
      if (this.$(this.behaviors.PerfectScrolling.contentParent).scrollTop() > 0) {
        this.$(this.behaviors.PerfectScrolling.contentParent).animate({scrollTop: scrollTop},
            "fast");
      }
    },

    _activateSelectedPropertyTab: function () {
      var selectedProperty = this.options.selectedProperty;
      if (selectedProperty && selectedProperty instanceof Backbone.Model) {
        if (this.collection && this.collection.length > 0) {
          var id = selectedProperty.get('id');  // primary check
          var title = selectedProperty.get('title');  // fallback check
          var i, model, matchIndex = -1;
          for (i = 0; i < this.collection.length; i++) {
            model = this.collection.at(i);
            if (id === model.get('id') || title === model.get('title')) {
              matchIndex = i;
              break;
            }
          }
          if (matchIndex !== -1) {
            this.options.activeTab.set("tabIndex", matchIndex);
            this.tabLinks.children.findByIndex(matchIndex).activate();
          }
        }
      }
    },

    // public
    render: function () {
      // fetch forms if not done or not failed already
      var dataFetched = true;
      if (!this.allForms.fetched && !this.allForms.error) {
        dataFetched = false;
        if (!this._fetchingForms) {
          this._fetchForms();
        }
      }
      if (dataFetched === false || this._fetchingForms) {
        // wait until data is there
        return this;
      }

      if (this.collection.length === 1) {
        // only one form given -> remove title
        var singleFormModel = this.collection.first(),
            schema          = _.clone(singleFormModel.get('schema'));
        schema.title = '';
        singleFormModel.set('schema', schema);
      }

      var self = this;
      this.collection.each(function (model, index) {
        var has_required_fields = self.resolveHasRequiredFields.call(self, model);
        if (has_required_fields) {
          self.hasRequiredField = true;
        }
      });
      _.extend(this, {
        _: _
      });
      // data available -> render
      TabPanelView.prototype.render.apply(this);
      // create add properties + dropdown toolbar
      this._createAddPropertiesView();
      this._initializeOthers();
      return this;
    },

    resolveHasRequiredFields: function (model) {
      var metadataUtils = new MetadataUtils();
      var has_required_fields = metadataUtils.AlpacaFormOptionsSchemaHaveRequiredFields(
          model.get('options'), model.get('schema'), model.get('id')
      );
      model.set('required', has_required_fields);
      return has_required_fields;
    },

    onRendered: function () {
      this._setTablinksAttributes();
      // work around for the dialog fade-in delay
      // delay this call a bit since the initial dialog fade in makes the tab to be hidden
      // calling _setTabLinksAttributes() the second time here fixes the dialog fade-in delay
      // but does not have any effect if the first call already works
      setTimeout(_.bind(this._setTablinksAttributes, this), 300);

      // If tab panel re-renders itself whe the tab collection changes, it
      // has to prevent tab links and tab content from doing the same,
      // because these two views are destroyed during tab panel re-rendering
      this.tabLinks.stopListening(this.collection, 'reset');
      this.tabContent.stopListening(this.collection, 'reset');
      if (this.tabContentHeader) { // clean-up completely tab content's header if it not yet.
        this.tabContentHeader.destroy();
        this.$el.find(".csui-tab-contents-header-wrapper").remove();
      }

      this.listenTo(this.tabLinks, 'childview:delete:tab', _.bind(this._onDeleteCategory, this));

      // Alpaca slow rendering work-around: hide all views then block and
      // wait until all forms are rendered then show view and unblock
      this.tabLinks.$el.addClass('binf-hidden');
      this.tabContent.$el.addClass('binf-hidden');
      this.blockActions();
      this.updateTitle = true;
      var allFormsRendered = [],
          self             = this;
      this.tabContent.children.each(_.bind(function (childView) {
        var formRendered = $.Deferred();
        allFormsRendered.push(formRendered.promise());
        var childViewContent = childView.content;
        if (childViewContent instanceof FormView && !childViewContent.isRenderFinished()) {
          this.listenTo(childViewContent, 'render:form', function (childViewContent) {
            var formHtmlRegion = !!childViewContent.$el.find(".cs-form-singlecolumn") ?
                                 childViewContent.$el.find(".cs-form-singlecolumn") :
                                 childViewContent.$el.find(".cs-form-doublecolumn");
            if (!!formHtmlRegion && formHtmlRegion.length > 0) {
              if (!!formHtmlRegion.html()) {
                formRendered.resolve();
              }
            } else {
              formRendered.resolve();
            }
          });
        } else {
          formRendered.resolve();
        }
      }, this));
      $.when.apply($, allFormsRendered).done(function () {
        self.unblockActions();
        self.tabLinks.$el.removeClass('binf-hidden');

        // Begin: tab contents header which contains tab title and required field view.
        var canHaveTabContentHeader = !!self.collection.findWhere({id: 'general'});
        if (canHaveTabContentHeader) {
          var objPubSubId = (self.options.node instanceof VersionModel ? 'v' : 'p');
          objPubSubId = 'pubsub:tab:contents:header:view:switch:' + objPubSubId +
                        self.options.node.get('id');
          PubSub.off(objPubSubId);
          self.listenTo(PubSub, objPubSubId, self._onRequiredSwitch);

          self.tabContent.$el.before("<div class='csui-tab-contents-header-wrapper'></div>");
          self.contentHeaderRegion = new Marionette.Region({
            el: self.$el.find('.csui-tab-contents-header-wrapper')
          });
          self.tabContentHeader = new TabContentHeaderView(self.options);
          self.contentHeaderRegion.show(self.tabContentHeader);
        }
        // End: tab contents header which contains tab title and required field view.

        if (!!self.tabContentHeader && !!self.options.node.collection.requireSwitched &&
            !!self.hasRequiredField) {
          self._hideNotRequiredFormFields(true);
        }
        self.tabContent.$el.removeClass('binf-hidden');

        // TODO: Find out, how the rightToolbar is added from outside;
        // it does not happen if the form collection is empty
        if (self.addPropertiesView && self.rightToolbar) {
          var apv = self.addPropertiesView.render();
          Marionette.triggerMethodOn(apv, 'before:show', apv, self);
          self.rightToolbar.append(apv.el);
          Marionette.triggerMethodOn(apv, 'show', apv, self);
          self.allFormsRendered = true;
        }

        // find out the first visible tab and make it active.
        // Iterate over tab colleciton instead of childer where order is not guaranteed.
        var firstVisibleTabLink,
            firstVisibleTab = self.tabLinks.collection.find(function (tabModel) {
              var tabLink = self.tabLinks.children.findByModel(tabModel);
              return !tabLink.$el.hasClass('binf-hidden');
            });
        if (firstVisibleTab &&
            !(firstVisibleTabLink = self.tabLinks.children.findByModel(
                firstVisibleTab)).isActive()) {
          firstVisibleTabLink.activate();
        }

        self._initializeOthers();
        self.triggerMethod('render:forms', this);

        // iPad needs a little timeOut
        setTimeout(function () {
          self._computeTablinkWidth();
          self._enableToolbarState();
        }, 300);

        // event for keyboard navigation
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);

        if (self.options.formMode !== "create") {
          self.setFocus();
        }
        self.trigger('update:scrollbar');
        if (self.updateTitle) {
          var objPubSubTabId = (self.options.node instanceof VersionModel ? 'v' : 'p') +
                               self.options.node.get('id');
          objPubSubTabId = 'pubsub:tab:contents:header:view:change:tab:title:' +
                           objPubSubTabId;
          PubSub.trigger(objPubSubTabId, firstVisibleTabLink.el.innerText);
        }

        // check options.selectedProperty and activate the tab if needed
        self._activateSelectedPropertyTab();
      });

      if (this.$el && !this.$el.is(":visible")) {
        this.updateTitle = false;
      }
      this.childWithBlockingView &&
      this.childWithBlockingView.metadataHeaderView.metadataItemNameView.ui.toggleIcon.attr(
          'tabindex', 0);
    },

    onShow: function () {
    },

    setFocus: function () {
      // TODO: check if we want to have this
      // set focus to first form
      //var firstTabContentView = this.tabContent.children[0];
      //if( firstFormView) {
      //  firstTabContentView.content.setFocus();
      //}
    },

    _computeTablinkWidth: function () {
      var tabLinksBar = this.$el.find('.tab-links-bar');
      var tabLinks = tabLinksBar && tabLinksBar.find('ul > li');
      tabLinksBar && tabLinksBar.removeClass('wide-tablink very-wide-tablink');

      // compute only when there is more than one tab (e.g. General + cats/rms/etc.)
      if (tabLinksBar && tabLinksBar.length > 0 && tabLinks && tabLinks.length > 1) {
        var tabLinksBarWidth = $(tabLinksBar[0]).width();
        var totalTablinksWidth = 0;
        var i, numTabs = 0;
        for (i = 0; i < tabLinks.length; i++) {
          var $tabLink = $(tabLinks[i]);
          if (!($tabLink.hasClass('hidden-by-switch'))) {
            totalTablinksWidth += $tabLink.width();
            numTabs++;
          }
        }
        var oneTablinkWidth = numTabs > 0 ? (totalTablinksWidth / numTabs) : $(tabLinks[0]).width();

        // if this total width check values are still smaller than the tabLinks bar width,
        // then increase the tabLink width
        var totalWidthCheck1 = totalTablinksWidth * 2;  // twice smaller
        var totalWidthCheck2 = totalTablinksWidth + (1.3 * oneTablinkWidth);  // a little smaller
        if (tabLinksBarWidth > totalWidthCheck1) {
          tabLinksBar.addClass('very-wide-tablink');
        } else if (tabLinksBarWidth > totalWidthCheck2) {
          tabLinksBar.addClass('wide-tablink');
        } else {
          tabLinksBar.removeClass('wide-tablink very-wide-tablink');
        }
      }
    },

    onPanelActivated: function () {
      // delay this a bit since the fade-in may make the tabs to be hidden
      setTimeout(_.bind(function () {
        this._setTablinksAttributes();
        this._enableToolbarState();
      }, this), 300);
    },

    // public: validate all Alpaca forms
    validateForms: function () {
      var allFormsValid = true;
      if (!!this.allFormsRendered) {
        this.tabContent.children.each(function (tab) {
          var isCurrentFormValid = tab.content.validate();
          allFormsValid = allFormsValid && isCurrentFormValid;
        });
        allFormsValid ? this._hideValidationError() : this._showValidationError();
        return allFormsValid;
      } else {
        return false;
      }
    },

    // public: get values from all Alpaca forms
    getFormsValues: function () {
      var formValues = {},
          formFieldValues, formFieldRoles, roles, role;

      this.tabContent.children.each(function (tab) {
        var values   = tab.content.getValues(),
            roleName = tab.content.model.get("role_name"),
            category, catId;

        if (values) {
          if (roleName) {
            roles = formValues.roles || (formValues.roles = {});
            role = roles[roleName] || (roles[roleName] = {});
            if (roleName === 'categories') {
              // For categories, merge the properties to the
              // roles.categories.<category_id> object
              catId = tab.model.get("id").toString();
              category = role[catId] || (role[catId] = {});
              // when attributes are not set, the server deletes
              // the category unless it is set to null
              if (_.isEmpty(values)) {
                category = null;
              } else {
                _.extend(category, values);
              }
            } else {
              // With a role defined, merge the properties to the
              // roles.<role_name> object
              _.extend(role, values);
            }
          } else {
            // With no role defined, merge the properties to the root
            // object literal with the general properties
            _.extend(formValues, values);
          }
        }
      });

      // add the deleted categories
      if (this.options.node.removedCategories.length > 0) {
        roles = formValues.roles || (formValues.roles = {});
        role = roles['categories'] || (roles['categories'] = {});
        _.each(this.options.node.removedCategories, function (removedCatId) {
          role[removedCatId] || (role[removedCatId] = {});
        });
      }

      var generalTab = this.tabContent.children.find(function (tab) {
        return !!tab.content.getGeneralFormFieldValues;
      });
      if (generalTab) {
        formFieldValues = generalTab.content.getGeneralFormFieldValues();
        // Do not make a full deep merge, but ensure, that we merge not
        // only properties on the root (general) level, but if there are
        // roles available, also on every role level
        formFieldRoles = formFieldValues.roles || {};
        delete formFieldValues.roles;
        _.extend(formValues, formFieldValues);
        _.each(_.keys(formFieldRoles), function (roleName) {
          roles = formValues.roles || (formValues.roles = {});
          role = roles[roleName] || (roles[roleName] = {});
          _.extend(role, formFieldRoles[roleName]);
        });
      }

      return formValues;
    },

    _addValidationErrorElement: function () {
      if (this.$el.find('.metadata-validation-error').length === 0) {
        this.tabLinks.$el.after('<div class="metadata-validation-error"></div>');
        this.validationErrorElem = $(this.$el.find('.metadata-validation-error')[0]);
        this.validationErrorElem.append(
            '<span class="icon notification_error cs-close-error-icon" alt="' +
            lang.hideValidationErrorMessageIconTooltip + '" title="' +
            lang.hideValidationErrorMessageIconTooltip + '"></span>');
        this.validationErrorElem.append('<span class="validation-error-message">' +
                                        lang.formValidationErrorMessage + '</span>');
        this.validationErrorElem.hide();

        var closeIcon = $(this.$el.find('.metadata-validation-error .cs-close-error-icon')[0]);
        closeIcon && closeIcon.on('click', _.bind(function (event) {
          event.preventDefault();
          event.stopPropagation();
          this._hideValidationError();
        }, this));
      }
    },

    _showValidationError: function () {
      if (this.validationErrorElem === undefined) {
        this._addValidationErrorElement();
      }
      if (this.tabContent.$el.find('.alpaca-message-notOptional').length > 0) {
        this.tabContent && this.tabContent.$el.addClass('show-validation-error');
        this.contentHeaderRegion && this.contentHeaderRegion.$el.addClass('show-validation-error');
        this.validationErrorElem && this.validationErrorElem.show();
      } else {
        this._hideValidationError();
      }
    },

    _hideValidationError: function () {
      this.tabContent && this.tabContent.$el.removeClass('show-validation-error');
      this.contentHeaderRegion && this.contentHeaderRegion.$el.removeClass('show-validation-error');
      this.validationErrorElem && this.validationErrorElem.hide();
    },

    _clearValidationError: function () {
      this.tabContent && this.tabContent.$el.removeClass('show-validation-error');
      this.contentHeaderRegion && this.contentHeaderRegion.$el.removeClass('show-validation-error');
      if (this.validationErrorElem) {
        this.validationErrorElem.remove();
        delete this.validationErrorElem;
      }
    },

    _checkFormFetching: function () {
      this._fetchingForms = true;
    },

    _fetchForms: function () {
      return this.allForms.fetch();
    },

    _syncForms: function () {
      var self = this;
      this.blockActions();
      this._clearValidationError();
      return this._loadPanels()
          .then(_.bind(this._loadGeneralFormFields, this)).then(
              _.bind(this._loadGeneralActionFields, this))
          .always(function () {
            self.unblockActions();
            self._fetchingForms = false;
          })
          .then(function () {
            var panelModels = _.pluck(self._propertyPanels, 'model'),
                models      = self.allForms.where({role_name: 'categories'});
            self.panelModelsLength = panelModels.length;
            // add back the newly added categories  that have not been saved to server
            if (self.options.node.newCategories.models.length > 0) {
              models = _.union(models, self.options.node.newCategories.models);
            }
            var categoryModels = _.sortBy(models,
                function (model) {return model.attributes.title.toLowerCase()});
            models = panelModels.concat(categoryModels);
            self._normalizeModels(models);
            self.collection.reset(models);
            // check categories actions
            self._checkCategoriesActions();
          })
          .fail(function (request) {
            var error = new base.Error(request);
            ModalAlert.showError(error.message, lang.getPropertyPanelsFailTitle);
          });
    },

    _loadPanels: function () {
      var self = this,
          methodName, parameters;
      if (this.options.action === 'create') {
        methodName = 'getPropertyPanelsForCreate';
        parameters = [{forms: this.allForms}];
      } else if (this.options.action === 'copy') {
        methodName = 'getPropertyPanelsForCopy';
        parameters = [{forms: this.allForms}];
      } else if (this.options.action === 'move') {
        methodName = 'getPropertyPanelsForMove';
        parameters = [{forms: this.allForms}];
      } else { // update
        methodName = 'getPropertyPanels';
        // There are no pre-fetched forms for the update action;
        // the 'v1/forms/info' has been abandoned, unfortunately,
        // thus every panel has to fetch its own model
      }
      var promises = metadataPropertyPanels.chain()
          .map(function (panel) {
            var Controller        = panel.get('controller'),
                controllerOptions = panel.get('controllerOptions'),
                controller        = new Controller(_.extend({
                  context: self.options.context,
                  model: self.options.node
                }, controllerOptions)),
                method            = controller[methodName];
            return method && method.apply(controller, parameters);
          })
          .compact()
          .value();
      return $.when
          .apply($, promises)
          .then(function () {
            self._propertyPanels = _.flatten(arguments);
          });
    },

    _loadGeneralFormFields: function () {
      var self = this;
      return GeneralFormFieldBehavior.getFieldDescriptors({
        context: this.options.context,
        action: this.options.action,
        node: this.options.node,
        forms: this.allForms
      }).then(function (fieldDescriptors) {
        self._generalFormFieldDescriptors = fieldDescriptors;
      });
    },

    _loadGeneralActionFields: function () {
      var self = this;
      return GeneralActionFieldBehavior.getFieldDescriptors({
        context: this.options.context,
        action: this.options.action,
        node: this.options.node,
        forms: this.allForms
      }).then(function (fieldDescriptors) {
        self._generalActionFieldDescriptors = fieldDescriptors;
      });
    },

    _normalizeModels: function (models) {
      _.each(models, function (model) {
        // If the view shows a form and the form has a title, which is
        // not empty, this title should be used for the tab too
        if (model instanceof FormModel) {
          var schema = model.get('schema');
          if (schema && schema.title) {
            model.set('title', schema.title);
          }
        }
        // Make sure, that the model has always an ID.  The scroll-spy
        // used within the tab control puts these IDs to the a@href on
        // the  tab links.  It could not recognize the particular link
        // to navigate to otherwise.
        if (model.get('id') == null) {
          model.set('id', model.cid);
        }
        // When models are added to a collection, their model.collection
        // property will not be updated, if it was already set - if they
        // were already added to some other collection earlier.  Here,
        // we're creating a new collection of property panel models, which
        // should own them - they have to be removed from their previous
        // collections, which fetched them.
        if (model.collection) {
          model.collection.remove(model);
        }
      });
    },

    // private
    _checkCategoriesActions: function () {
      // get category actions
      // talking to the server developer, only need to check available actions of one category
      var categoryModels = this.options.collection.where({role_name: 'categories'});
      if (categoryModels.length > 0) {
        var catId           = categoryModels[0].get('categoryId'),
            categoryActions = new AppliedCategoryActionsCollection(undefined, {
              node: this.options.node,
              action: this.options.action,
              urlResource: 'categories/' + catId + '/actions',
              autofetch: true,
              autoreset: true
            });
        this.blockActions();
        categoryActions.fetch()
            .done(_.bind(function () {
              if (categoryActions.length > 0 &&
                  categoryActions.at(0).get("categories_remove") &&
                  categoryActions.at(0).get("categories_remove").length > 0) {
                _.each(categoryModels, function (cat) {
                  cat.attributes['removeable'] = true;
                  cat.trigger('action:updated');
                });
              }
              this.unblockActions();
              setTimeout(_.bind(function () {
                // event for keyboard navigation
                var event = $.Event('tab:content:render');
                this.$el.trigger(event);
              }, this), 300);
            }, this))
            .fail(_.bind(function (resp) {
              var serverError = this._getRespError(resp);
              var title = lang.getCategoryActionsFailTitle;
              var message = _.str.sformat(lang.getActionsForACategoryFailMessage,
                  catId, this.options.node.get("id"), serverError);
              ModalAlert.showError(message, title);
              this.unblockActions();
            }, this));
      }
    },

    // private
    _initializeOthers: function () {
      var options = {
        gotoPreviousTooltip: lang.gotoPreviousCategoryTooltip,
        gotoNextTooltip: lang.gotoNextCategoryTooltip
      };
      this._initializeToolbars(options);
      this._listenToTabEvent();

      // delay this a bit since the initial dialog fade in makes the tab to be hidden
      setTimeout(_.bind(this._enableToolbarState, this), 300);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._setTablinksAttributes();
          self._computeTablinkWidth();
          self._enableToolbarState();
          self._updateScrollbar();
        }, 200);
      }
    },

    _setTablinksAttributes: function () {
      var i, limit = 5;
      var siblings, parent = this.$el.parent();
      for (i = 0; i < limit; i++) {
        siblings = parent.siblings('.cs-tab-links.binf-dropdown');
        if (siblings.length > 0) {
          var width = $(siblings[0]).width();
          if (width > 15) {
            var newWidth    = width - 12,
                widForEle   = newWidth + "px",
                dirForEle   = this.rtlEnabled ? "margin-right" : "margin-left",
                tabLinksEle = this.$el.find('.tab-links');

            tabLinksEle.css({
              "width": function () {
                return "calc(100% - " + widForEle + ")";
              }
            });

            if (tabLinksEle.length) {
              tabLinksEle.css(dirForEle, widForEle);
              var tabLinksEleWidth = parseInt(tabLinksEle.css('width').replace('px', ''), 10);
              if (tabLinksEleWidth > 20 && tabLinksEleWidth < 250) {
                tabLinksEle.addClass('csui-mini-tablinks');
              } else {
                tabLinksEle.removeClass('csui-mini-tablinks');
              }
            }
          }
          break;
        }
        parent = parent.parent();
      }
    },

    _createAddPropertiesView: function () {
      if (this.addPropertiesView) {
        this.cancelEventsToViewsPropagation(this.addPropertiesView);
        this.addPropertiesView.destroy();
      }

      var options = _.extend({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMask: this.options.toolbarItemsMask,
        parentView: this,
        blockingParentView: this.options.blockingParentView,
        addPropertiesCallback: this.addPropertiesCallback,
        suppressAddProperties: this.options.suppressAddProperties
      }, this.options);
      this.addPropertiesView = new AddPropertiesDropdownMenuView(options);
      this.propagateEventsToViews(this.addPropertiesView);
    },

    addCatAt: function (models, respModel) {
      var index = this.panelModelsLength;
      for (var i = index; i < models.length; i++) {
        if (models[i].get('title').toLowerCase() > respModel.get('title').toLowerCase()) {
          index = i;
          break;
        }
        index += 1;
      }
      return index;
    },

    addPropertiesCallback: function (catModel) {
      // keep a list of newly added categories
      if (this.options.action) {
        this.options.node.newCategories.add(catModel);
      }
      var index = this.options.collection.models.length === 1 ? 1 :
                  this.addCatAt(this.options.collection.models, catModel);

      this.doAddModelProperties(catModel, index);
      return false;
    },

    /**
     * Adds provided model's form and handles and fires respective adjustments and events.
     */
    doAddModelProperties: function doAddModelProperties(model, index, additionalAddOpts) {
      var self = this;
      this.tabLinks.$el.find(".binf-active").removeClass("binf-active")
          .removeAttr('aria-selected');

      function tabContentRendered() {
        // Refresh tab indexes
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);
        // Scroll and activate Tab
        self._autoScrollTabTo(index, {animationOff: true})
            .done(function () {
              var newTab = self.tabLinks.children.findByModel(
                  self.options.collection.findWhere({id: model.get('id')}));
              newTab.activate();
            });
      }

      // Add model to collection to render form
      this.options.collection.add(model, _.extend(additionalAddOpts || {}, {at: index}));
      model.collection = this.options.collection;

      this._listenToTabIdEvent(index);

      var formContent = this.tabContent.children.findByModel(
          this.options.collection.findWhere({id: model.get('id')})),
          newFormView = formContent && formContent.content;
      if (newFormView !== undefined) {
        var isRendered = (newFormView instanceof FormView) ? newFormView.isRenderFinished() :
                         newFormView._isRendered;
        if (isRendered) {
          // Content rendred by now.
          tabContentRendered();
        } else {
          var renderEvent = (newFormView instanceof FormView) ? 'render:form' : 'dom:refresh';
          this.listenToOnce(newFormView, renderEvent, _.bind(function () {
            this.trigger("update:button", false);
            tabContentRendered();
          }, this));
        }
        // Scroll to current rendered Tab. 
        // This is to make necessary adjustment to TabLinks scroll (Previous, Next)
        this._autoScrollTabTo(index, {animationOff: true});
      } else {
        tabContentRendered();
      }

      this._computeTablinkWidth();
      this._enableToolbarState();
      this.trigger('reset:switch');
    },

    _resetRequiredSwitchView: function () {
      PubSub.trigger('pubsub:header:rightbar:view:change:switch:status', 'reset');
    },

    // private
    _onDeleteCategory: function (tabLink) {
      this.tabToDelete = tabLink;
      var categoryName = tabLink.model.get("title");
      var title = lang.removeCategoryWarningTitle;
      var message = categoryName ? _.str.sformat(lang.removeCategoryWarningMessage, categoryName) :
                    lang.removeCategoryWarningMessage;
      ModalAlert
          .confirmWarning(message, title)
          .done(_.bind(this._removeCategory, this))
          .fail(_.bind(function (err) {
            if (!err) {
              this.tabToDelete.$el.find('a').focus();
            }
          }, this));
    },

    // private
    _removeCategory: function () {
      if (this.tabToDelete) {
        var id = this.tabToDelete.model.get('id');
        id = _.isNumber(id) ? id.toString() : id;

        // with add item metadata, the new node has not been created on the server yet
        if (this.options.node.get("id") === undefined || this.options.action) {
          this._removeTab();
          if (this.options.node.newCategories.remove(id) === undefined) {
            this.options.node.removedCategories.push(id);
          }
          return;
        }

        var fullUrl = Url.combine(this.options.node.urlBase(), 'categories/' + id);
        var options = {
          type: 'DELETE',
          url: fullUrl
        };
        this.options.node.connector && this.options.node.connector.extendAjaxOptions(options);

        this.blockActions();
        $.ajax(options)
            .done(_.bind(function () {
              this.unblockActions();
              this._removeTab();
            }, this))
            .fail(_.bind(function (resp) {
              this.unblockActions();
              var serverError = this._getRespError(resp);
              var categoryName = this.tabToDelete.model.get("title");
              var title = lang.removeCategoryFailMessageTitle;
              var message = _.str.sformat(lang.removeCategoryFailMessage, categoryName,
                  serverError);
              ModalAlert.showError(message, title);
            }, this));
      }
    },

    // private
    _removeTab: function () {
      if (this.tabToDelete.$el.hasClass('binf-active')) {
        var previousIndex = this.tabToDelete._index - 1;
        var previousTab = this.tabLinks.children.findByIndex(previousIndex);
        this._autoScrollTabTo(previousIndex, {animationOff: true})
            .done(function () {
              previousTab && previousTab.activate();
            });
      }
      this.options.collection.remove(this.tabToDelete.model);
      this.trigger('reset:switch');

      setTimeout(_.bind(function () {
        this._computeTablinkWidth();
        this._enableToolbarState();
        // event for keyboard navigation
        var event = $.Event('tab:content:render');
        this.$el.trigger(event);
      }, this), 300);
    },

    // private
    _onRequiredSwitch: function (args) {
      Backbone.trigger('closeToggleAction');
      this._updateScrollbar();
      this._hideNotRequiredFormFields(args.on, args);
      return false;
    },

    _hideNotRequiredFormFields: function (hide, args) {
      this.tabContent.children.each(function (tabContent) {
        // Not every tab panel has to be a form, or implemented by FormView
        if (tabContent.content.hideNotRequired) {
          var appliedToWholeForm = tabContent.content.hideNotRequired(hide);
          var tabLink = this.tabLinks.children.findByModel(tabContent.model);
          // If the whole form has been hidden, hide the tab content with
          // optional border lines and the tab link at the top too
          if (appliedToWholeForm) {
            var method = hide ? 'addClass' : 'removeClass';
            tabContent.$el[method]('binf-hidden hidden-by-switch');
            if (hide) {
              this._hideTabLinkByRequiredSwitch(tabLink.$el);
            } else {
              this._showTabLinkByRequiredSwitch(tabLink.$el, tabContent.model.get('removeable'));
            }
          } else {
            // The form has some required fields, make sure the tabLink is visible
            this._showTabLinkByRequiredSwitch(tabLink.$el, tabContent.model.get('removeable'));
          }
        }
      }, this);
      this.tabLinks.$el.find(".tab-links-first-visible").removeClass("tab-links-first-visible");
      this.tabContent.onReorder();
      // Ensure, that another tab gets activated, if the currently active
      // one was hidden, and scroll to the top to see it.
      /* var firstVisibleTabLink = this.tabLinks.children.find(function (tabLink) {
         return !tabLink.$el.hasClass('binf-hidden');
       });*/
      var firstVisibleTabLink,
          tabLinkViews      = this.tabLinks.children._views,
          keysSortedByIndex = Object.keys(tabLinkViews).sort(
              function (view1, view2) {
                return tabLinkViews[view1]._index - tabLinkViews[view2]._index;
              });
      for (var index = 0; index < keysSortedByIndex.length; index++) {
        if (!this.tabLinks.children._views[keysSortedByIndex[index]].$el.hasClass('binf-hidden')) {
          firstVisibleTabLink = this.tabLinks.children._views[keysSortedByIndex[index]];
          break;
        }
      }
      if (!!firstVisibleTabLink) {
        firstVisibleTabLink.$el.addClass("tab-links-first-visible");
      }
      // FIXME: If the very first tab (General) is hidden, this scrolls right
      // to the second one.  The scrollbar thumb stays a little above the top.
      // If it is moved really the the top, no tab link will be emphasized as
      // active one.  Hiding the tab links may need some cooperation from the
      // scroll-spy to skip the hidden tab links.
      if (firstVisibleTabLink && !firstVisibleTabLink.isActive()) {
        firstVisibleTabLink.activate();
      }

      setTimeout(_.bind(function () {
        this._computeTablinkWidth();
        this._enableToolbarState();
        // event for keyboard navigation
        var event = $.Event('tab:content:render');
        this.$el.trigger(event);
        if (!!args) { // executes only when coming thr' event driven
          this.currentTabPosition = 1;
        }

      }, this), 300);
    },

    // private
    _getRespError: function (resp) {
      var error = '';
      if (resp && resp.responseJSON && resp.responseJSON.error) {
        error = resp.responseJSON.error;
      } else if (base.MessageHelper.hasMessages()) {
        error = $(base.MessageHelper.toHtml()).text();
        base.MessageHelper.clear();
      }
      return error;
    }

  });

  _.extend(MetadataPropertiesViewImpl.prototype, TabLinksScrollMixin);

  return MetadataPropertiesViewImpl;

});

csui.define('csui/widgets/metadata/metadata.properties.view',['csui/widgets/metadata/impl/metadata.properties.view',
  'css!csui/widgets/metadata/impl/metadata'
], function (MetadataPropertiesViewImpl) {

  //
  // Public: Metadata Properties View Class
  // Description: provides the view of general and other metadata properties (such as categories,
  // etc.) of a node.  It allows for navigation, editing and getting form values of different types
  // of metadata.
  //
  // This class is a clean and easy-to-read wrapper to expose as a public interface.
  // See the implementation impl/metadata.properties.view.js for more available public methods.
  //
  var MetadataPropertiesView = MetadataPropertiesViewImpl.extend({

    constructor: function MetadataPropertiesView(options) {
      MetadataPropertiesViewImpl.prototype.constructor.apply(this, arguments);
    },

    validateForms: function () {
      return MetadataPropertiesViewImpl.prototype.validateForms.apply(this, arguments);
    },

    getFormsValues: function () {
      return MetadataPropertiesViewImpl.prototype.getFormsValues.apply(this, arguments);
    }

  });

  return MetadataPropertiesView;

});

csui.define('csui/widgets/metadata/impl/metadata.properties.content.view',['csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/nodesprites',
  'csui/widgets/metadata/metadata.properties.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin'
], function (_, Marionette, NodeSpriteCollection, MetadataPropertiesView,
    ViewEventsPropagationMixin) {

  var MetadataPropertiesContentView = Marionette.ItemView.extend({

    className: 'metadata-inner-wrapper',

    constructor: function MetadataPropertiesContentView(options) {
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);

      var tabOptions = {
        context: this.options.context,
        node: this.options.model,
        containerCollection: this.options.containerCollection,
        metadataView: this.options.metadataView,
        blockingParentView: this.options.blockingParentView,
        selectedProperty: this.options.selectedProperty,
        notTabableRegion: true
      };
      this.childTabPanelView = new MetadataPropertiesView(tabOptions);

      this.propagateEventsToViews(this.childTabPanelView);
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);

      var mdv = this.childTabPanelView.render();

      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);
      this.$el.append(mdv.el);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);

      this.triggerMethod('render', this);
      return this;
    },

    onBeforeDestroy: function () {
      this.childTabPanelView.destroy();
    },

    onPanelActivated: function () {
      this.childTabPanelView && this.childTabPanelView.triggerMethod('panel:activated');
    }

  });

  _.extend(MetadataPropertiesContentView.prototype, ViewEventsPropagationMixin);

  return MetadataPropertiesContentView;

});


csui.define('csui/utils/versions.default.action.items',[
  'csui/lib/underscore', 'csui/models/actionitems',
  // Load and register external default action rules
  'csui-ext!csui/utils/versions.default.action.items'
], function (_, ActionItemCollection, extraActions) {
  'use strict';

  var defaultActionItems = new ActionItemCollection([
    // Default for versions is always version open command
    {
      type: 144,
      signature: 'VersionOpen',
      sequence: 10
    }
  ]);

  if (extraActions) {
    defaultActionItems.add(_.flatten(extraActions, true));
  }

  return defaultActionItems;

});

csui.define('csui/widgets/metadata/impl/versions/metadata.versions.columns',["csui/lib/backbone", 'i18n!csui/widgets/metadata/impl/nls/lang'],
    function (Backbone, lang) {

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

      var tableColumns = new TableColumnCollection([
        {
          key: 'version_number_name',
          align: 'center',
          title: lang.versionColumnVersionNumberTitle,
          sequence: 10
        },
        {
          key: 'name',
          sequence: 20
        },
        {
          key: 'create_date',
          sequence: 30
        },
        {
          key: 'owner_id',
          sequence: 40
        },
        {
          key: 'file_size',
          align: 'right',
          title: lang.versionColumnSizeTitle,
          sequence: 50
        }
      ]);

      return tableColumns;

    });


csui.define('csui/widgets/metadata/versions.toolbaritems.mask',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask',
  // Load and external tool item masks
  'csui-ext!csui/widgets/metadata/versions.toolbaritems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask, dynamicMasks) {
  'use strict';
  dynamicMasks || (dynamicMasks = []);
  var VersionsToolbarItemsMask = ToolItemMask.extend({

    constructor: function VersionsToolbarItemsMask(options) {
      var config     = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      // Enable restoring the mask to its initial state
      this.storeMask();
      this.context = options.context;
      this.node = !!options.node ? options.node : options.model;
      this._updateMask();
      this.listenTo(this.node, 'change:id', this._updateMask);
    },
    _updateMask: function () {
      var modified = this.restoreMask({silent: true});
      dynamicMasks.forEach(function (mask) {
        mask = mask({
          context: this.context,
          node: this.node
        });
        if (mask) {
          modified = this.extendMask(mask, {silent: true}) || modified;
        }
      }, this);
      if (modified) {
        this.trigger('update', this);
      }
    }
  });

  return VersionsToolbarItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/versions/metadata.versions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-metadata-versions\">\r\n  <div class=\"csui-metadata-versions-rowselection-toolbar-view\"></div>\r\n  <div class=\"csui-table-view\"></div>\r\n  <div class=\"csui-pagination-view\"></div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_versions_metadata.versions', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/metadata/impl/versions/metadata.versions',[],function(){});
csui.define('csui/widgets/metadata/impl/versions/metadata.versions.view',["module", "csui/lib/jquery", "csui/lib/underscore",
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/table/table.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/utils/versions.default.action.items',
  'csui/utils/commands/versions',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/models/nodes',
  'csui/models/columns',
  'csui/models/nodeversions',
  'csui/models/version',
  'csui/widgets/metadata/impl/versions/metadata.versions.columns',
  'csui/widgets/metadata/versions.toolbaritems',
  'csui/widgets/metadata/versions.toolbaritems.mask',
  'hbs!csui/widgets/metadata/impl/versions/metadata.versions',
  'css!csui/widgets/metadata/impl/versions/metadata.versions'
], function (module, $, _, Backbone, Marionette, base,
    GlobalMessage,
    LayoutViewEventsPropagationMixin,
    FilteredToolItemsCollection,
    ToolbarView,
    DelayedToolbarView,
    TableView,
    PaginationView,
    defaultActionItems,
    commands,
    TableRowSelectionToolbarView,
    ToolbarCommandController,
    NodeCollection,
    NodeColumnCollection,
    NodeVersionCollection,
    VersionModel,
    metadataVersionsColumns,
    toolbarItems,
    VersionsToolbarItemsMask,
    template) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30,
    defaultPageSizes: [30, 50, 100],
    enabled: true
  });

  var MetadataVersionsTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'metadata-inner-wrapper';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },
    template: template,

    ui: {
      tableRowSelectionToolbarView: '.csui-metadata-versions-rowselection-toolbar-view',
      tableView: '.csui-table-view',
      childContainer: '.csui-table-view',
      paginationView: '.csui-pagination-view'
    },

    regions: {
      tableRowSelectionToolbarRegion: '@ui.tableRowSelectionToolbarView',
      tableRegion: '@ui.tableView',
      paginationRegion: '@ui.paginationView'
    },

    constructor: function MetadataVersionsTableView(options) {
      this.commands = options.commands || commands;
      _.defaults(options, {
        pageSize: config.defaultPageSize,
        ddItemsList: config.defaultPageSizes,
        toolbarItems: toolbarItems,
        originatingView: options.originatingView || options.metadataView
      });

      MetadataVersionsTableView.__super__.constructor.call(this, options);

      this.selectedNodes = new NodeCollection();

      this.collection = new NodeVersionCollection(undefined, {
        node: this.options.model,
        autoreset: true,
        expand: "user",
        commands: commands.getAllSignatures(),
        onlyClientSideDefinedColumns: true  // ignore columns sent by server
      });

      this.options.model.versions = this.collection;  // connect version collection with node

      this.commandController = new ToolbarCommandController({commands: this.commands});

      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
      this.defaultActionItems = defaultActionItems;

      if (!this.options.toolbarItemsMasks) {
        this.options.toolbarItemsMasks = new VersionsToolbarItemsMask(this.options);
      }

      this._setTableView();

      // must be after setTableView
      this._setTableRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks,
        commands: this.options.commands || commands,
      });

      this._setTableRowSelectionToolbarEventListeners();

      this._setPagination();

      this.collection.fetch();

      // Cause the show events triggered on the parent view re-triggered
      // on the views placed in the inner regions
      this.propagateEventsToRegions();
      this.listenTo(this.collection, "add", this._updateCollection)
          .listenTo(this.collection, "remove", this._updateCollection);
    },

    onRender: function () {
      this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

    _updateCollection: function () {
      this.collection.fetch();
    },

    _setTableView: function () {
      this.options || (this.options = {});

      var args = _.extend({
        tableColumns: metadataVersionsColumns,
        connector: this.model.connector,
        collection: this.collection,
        columns: this.collection.columns,
        columnsWithSearch: [],
        orderBy: "version_number_name desc",
        actionItems: defaultActionItems,
        commands: commands,
        originatingView: this.options.originatingView
      }, this.options);

      /*
      LPAD-60042
      deleting blockingParentView option to fix expand/collapse icon.
      table.view.js checks the condition this.$el[0].children.length > 0 in
      function calculateMaxColumnsDisplayed()
      */
      delete args.blockingParentView;

      if (!_.contains(this.options.ddItemsList, this.options.pageSize)) {
        this.options.ddItemsList.push(this.options.pageSize);
        this.options.ddItemsList.sort();
      }

      this.tableView = new TableView(args);

      // Events
      var cmdOption = {context: this.options.context, originatingView: this};

      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        var action = this.defaultActionItems.find(function (actionItem) {
          if (actionItem.get('type') === node.get('type')) {
            return true;
          }
        }, this);
        var cmd = commands.get(action.get('signature'));
        var status = {nodes: new NodeVersionCollection([node])};
        cmd.execute(status, cmdOption);
      });
    },

    _setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,

        // if toolbarCommandController is not defined, a new ToolbarCommandController
        // with the following commands is created
        commands: commands,
        selectedChildren: this.tableView.selectedChildren,
        container: this.collection.node,
        context: this.options.context,
        originatingView: this.options.originatingView,
        collection: this.collection
      });
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      // listen for change of the selected rows in the table.view and if at least one row is
      // selected, display the table-row-selected-toolbar
      this.listenTo(this.tableView.selectedChildren, 'reset', function () {
        // TODO: Re-use TableRowSelectionToolbarBehavior.
        if (this.tableView.selectedChildren.length > 0) {
          this.tableRowSelectionToolbarRegion.$el.addClass(
              'csui-metadata-versions-rowselection-toolbar-visible');
        } else {
          this.tableRowSelectionToolbarRegion.$el.removeClass(
              'csui-metadata-versions-rowselection-toolbar-visible');
        }
      });
    },

    _setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: this.options.ddItemsList,
        skipPaginationUpdateRequest: true
      });
    }

  }, {

    enabled: function (options) {
      if (config.enabled === false) {
        return false;
      }
      // don't enable if we are viewing properties of a VersionModel
      if (options.node instanceof VersionModel) {
        return false;
      }
      // TODO: Recognize versionable objects in a common way. For example,
      // available_roles in v1 REST API was a viable way. It could be also
      // done by extensibility on the client side.
      return _.contains([144, 736, 5574], options.node.get('type'));
    }

  });

  // Add the mixin functionality to the target view
  _.extend(MetadataVersionsTableView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataVersionsTableView;

});


csui.define('csui/widgets/metadata/metadata.panels',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/impl/metadata.properties.content.view',
  'csui/widgets/metadata/impl/versions/metadata.versions.view',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  // Load extra panels to be added to the built-in dropdown tabs
  'csui-ext!csui/widgets/metadata/metadata.panels'
], function (_, Backbone, MetadataPropertiesContentView,
    MetadataVersionsTableView, lang, extraPanels) {

  var MetadataPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      title: null,
      contentView: null,
      contentViewOptions: null
    },

    constructor: function MetadataPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataPanelCollection = Backbone.Collection.extend({

    model: MetadataPanelModel,
    comparator: "sequence",

    constructor: function MetadataPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataPanels = new MetadataPanelCollection([
    {
      title: lang.properties,
      name: 'properties',
      sequence: 10,
      contentView: MetadataPropertiesContentView
    }, {
      title: lang.versions,
      name: 'versions',
      sequence: 20,
      contentView: MetadataVersionsTableView
    }
  ]);

  if (extraPanels) {
    metadataPanels.add(_.flatten(extraPanels, true));
    // assign default name to panels that are not having the 'name' field yet
    var counter = 1;
    metadataPanels.forEach(function (model) {
      if (model.get('name') === undefined) {
        model.set('name', 'unnamed_panel' + counter, {silent: true});
        counter++;
      }
    });
  }

  return metadataPanels;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.link.dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.uniqueTabId || (depth0 != null ? depth0.uniqueTabId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uniqueTabId","hash":{}}) : helper)))
    + "\" data-binf-toggle=\"tab\">\r\n  <span class=\"cs-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n</a>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.link.dropdown', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tab.panel/impl/tab.link.dropdown.view',['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/controls/tab.panel/impl/tab.link.dropdown',
  'csui/lib/binf/js/binf'
], function (_, TabLinkView, itemTemplate) {
  "use strict";

  var TabLinkDropDownView = TabLinkView.extend({

    template: itemTemplate,

    attributes: function () {
      var title = this.model.get('title');
      return {
        id: 'tablink-' + this.model.get('uniqueTabId'),
        role: 'menuitem',
        'aria-label': title,
        title: title
      };
    },

    constructor: function TabLinkDropDownView() {
      TabLinkView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'change', this.render);

      this.$el.bind('click', '>a', _.bind(this._linkClicked, this));
    },

    onBeforeDestroy: function () {
      this.$el.unbind('click', '>a');
    },

    activate: function () {
      if (!this.$el.hasClass("binf-active")) {
        this.triggerMethod('clear:active:tab');
        this.ui.link.binf_tab('show');
      }
      // TODO: comment out this code for now because HTML Validator does not allow it
      //this.$el.attr('aria-selected', 'true');
      var index = this.model.collection.indexOf(this.model);
      this._parent.options.activeTab && this._parent.options.activeTab.set('tabIndex', index);
      this.triggerMethod('activate:tab', this);
      this.triggerMethod('click:link');
    },

    _linkClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.activate();
    }

  });

  return TabLinkDropDownView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/tab.panel/impl/tab.links.dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.btnId || (depth0 != null ? depth0.btnId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnId","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-btn-default\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"cs-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n  </button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "  <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.btnId || (depth0 != null ? depth0.btnId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnId","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-btn-default binf-dropdown-toggle\"\r\n          data-binf-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"cs-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n    <span class=\"cs-icon icon-caret-down\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.addToolTipContent || (depth0 != null ? depth0.addToolTipContent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addToolTipContent","hash":{}}) : helper)))
    + "\"></span>\r\n  </button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<span class=\"dropdown-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.single_item : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "<ul class=\"binf-dropdown-menu\" role=\"menu\" aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.btnId || (depth0 != null ? depth0.btnId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"btnId","hash":{}}) : helper)))
    + "\">\r\n</ul>\r\n";
}});
Handlebars.registerPartial('csui_controls_tab.panel_impl_tab.links.dropdown', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/tab.panel/behaviors/tab.links.dropdown.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  // This behavior implements a default keyboard navigation by tab keys similar to the browser
  // default and is used when the browser default can't be used because of tabable region behavior.

  var TabLinksDropdownKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksDropdownKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            // don't handle keystrokes at all if no elements were found for keyboard navigation
            return ret;
          }
          if (event.keyCode === 9) {  // tab
            // log.debug('TabLinksDropdownKeyboardBehavior::onKeyInView ' + this.constructor.name)
            // && console.log(log.last);

            // event.shiftKey: shift tab -> activate previous region
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      this.tabableElements = view.$el.find('button:not([disabled])').filter(':visible');
      this.view.currentTabPosition = -1;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);

      // log.debug('TabLinksDropdownKeyboardBehavior::refreshTabableElements ' +
      //           view.constructor.name + ': found ' + this.tabableElements.length + ' tabable' +
      //           ' elements') && console.log(log.last);
    }

  });

  return TabLinksDropdownKeyboardBehavior;

});


csui.define('css!csui/controls/tab.panel/impl/tab.links.dropdown',[],function(){});
csui.define('csui/controls/tab.panel/tab.links.dropdown.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tab.panel/impl/tab.link.dropdown.view',
  'hbs!csui/controls/tab.panel/impl/tab.links.dropdown',
  'csui/controls/tab.panel/behaviors/tab.links.dropdown.keyboard.behavior',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'i18n!csui/controls/tab.panel/impl/nls/lang',
  'css!csui/controls/tab.panel/impl/tab.links.dropdown',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, TabLinkDropDownView, collectionTemplate,
    TabLinksDropdownKeyboardBehavior, DropdownMenuBehavior, lang) {
  "use strict";

  var TabLinkDropDownCollectionView = Marionette.CompositeView.extend({

    className: 'cs-tab-links binf-dropdown tile-nav',

    template: collectionTemplate,
    templateHelpers: function () {
      return {
        single_item: this.collection.length === 1 ? true : false,
        addToolTipContent: lang.showMore,
        btnId: _.uniqueId("cstabBtn")
      };
    },

    childView: TabLinkDropDownView,
    childViewContainer: '>ul',

    ui: {
      toggle: '>.binf-dropdown-toggle',
      menuButton: '>.binf-btn',
      selectedLabel: '>.binf-btn >.cs-label'
    },

    behaviors: {
      TabLinksDropdownKeyboardBehavior: {
        behaviorClass: TabLinksDropdownKeyboardBehavior
      },
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function TabLinkDropDownCollectionView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.selected = new Backbone.Model();
      // if selectedTab is passed in, search for it and set activeTab to it
      // also store the data on this.selected model
      var activeTabIndex = options.activeTab && options.activeTab.get("tabIndex");
      if (this.collection && this.collection.length > 0 && activeTabIndex !== undefined &&
          activeTabIndex < this.collection.length) {
        var selectedTabTitle = options.selectedTab && options.selectedTab.get("title");
        if (selectedTabTitle !== undefined &&
            selectedTabTitle === this.collection.at(activeTabIndex).get("title")) {
          this._setSelection(this.collection.at(activeTabIndex));
        } else {
          var matchIndex = -1;
          if (selectedTabTitle !== undefined) {
            for (var i = 0; i < this.collection.length; i++) {
              if (selectedTabTitle === this.collection.at(i).get("title")) {
                matchIndex = i;
              }
            }
          }
          if (matchIndex !== -1) {
            this._setSelection(this.collection.at(matchIndex));
            options.activeTab.set("tabIndex", matchIndex);
          } else {
            this._setSelection(this.collection.at(0));
            options.activeTab.set("tabIndex", 0);
          }
        }
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
    },

    onRender: function () {
      var title = this.selected.get('title');
      this.ui.selectedLabel.text(title);
      this.ui.menuButton.attr('aria-label', title);
      if (this.collection.length !== 1) {
        this.ui.toggle.binf_dropdown();
      }
      // TODO: comment out this code for now because HTML Validator does not allow it
      // set the selected tab active and aria-selected=true
      var selectedId = this.selected.get('id');
      for (var i = 0; i < this.collection.length; i++) {
        if (selectedId === this.collection.at(i).get("id")) {
          var menuItems = this.$el.find("ul li");
          menuItems.removeClass('binf-active');  //.removeAttr('aria-selected');
          this.$(menuItems.get(i)).addClass('binf-active');  //.attr('aria-selected', 'true');
          break;
        }
      }
    },

    onChildviewClickLink: function (childView) {
      this._setSelection(childView.model);
      this.ui.toggle.binf_dropdown('toggle');
    },

    onChildviewClearActiveTab: function (childView) {
      this.children.each(function (view) {
        if (view.$el.hasClass('binf-active')) {
          view.$el.removeClass('binf-active');
        }
        // TODO: comment out this code for now because HTML Validator does not allow it
        //if (view.el.hasAttribute('aria-selected') !== undefined) {
        //  view.$el.removeAttr('aria-selected');
        //}
      });
    },

    _setSelection: function (model) {
      this.selected.set(model.pick('id', 'title'));
    },

    _updateSelection: function () {
      var title = this.selected.get('title');
      this.ui.selectedLabel.text(title);
      this.ui.menuButton.attr('aria-label', title);
    },

    _refreshSelection: function (model) {
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model);
      }
    }

  });

  return TabLinkDropDownCollectionView;

});

csui.define('csui/widgets/metadata/impl/metadata.dropdowntab.view',['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/tab.panel/tab.panel.view', 'csui/widgets/metadata/metadata.panels',
  'csui/controls/tab.panel/tab.links.dropdown.view',
  'csui/models/browsing.state/nodes/nodes.browsing.state',
  'csui/utils/contexts/factories/browsing.states',
  'csui/models/version', 'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/lib/binf/js/binf'
], function (require, _, Backbone, TabPanelView, metadataPanels, TabLinkDropDownCollectionView,
    NodeBrowsingStateModel, BrowsingStateCollectionFactory, VersionModel, lang) {
  'use strict';

  var MetadataDropdownTabView = TabPanelView.extend({

    // FIXME: This removes the tab classes from the paren object
    className: 'metadata-content-wrapper binf-panel binf-panel-default',

    ui: {
      dropdownToggle: '.binf-dropdown-toggle'
    },

    contentView: function () {
      return this.options.contentView;
    },

    contentViewOptions: function () {
      return {
        context: this.options.context,
        model: this.options.node,
        originatingView: this.options.originatingView,
        metadataView: this.options.metadataView,
        blockingParentView: this.options.blockingParentView,
        selectedProperty: this.options.selectedProperty
      };
    },

    constructor: function MetadataDropdownTabView(options) {
      // Assign the options to this before the parent constructor
      // would do it, so that the _buildTabs below can access it
      this.options = options || (options = {});
      _.defaults(options, {
        TabLinkCollectionViewClass: TabLinkDropDownCollectionView,
        implementTabContentsDefaultKeyboardHandling: false,
        delayTabContent: options.delayTabContent !== false
      });

      options.tabs = this._buildTabs();

      TabPanelView.prototype.constructor.call(this, options);

      this.browsingStates = this.options.context &&
                            this.options.context.getCollection(BrowsingStateCollectionFactory);

      this.listenTo(this.options.node, "change", this._nodeChanged)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
      this.listenTo(this, 'before:destroy', this._clearBrowsingState);
    },

    _buildTabs: function () {
      return metadataPanels
          .chain()
          .filter(function (panel) {
            // If there is a static method enabled, call it, otherwise
            // consider the panel always enabled
            var contentView = panel.get('contentView'),
                enabled     = contentView.enabled;
            // providing way to render custom properties view for node types that has separate
            // view to show in metadata. Based on key 'customproperties' provided in response.
            if (this.options.node.attributes.customProperties) {
              // filter extra commands based on the key 'executeCommand' for respective node.
              if (panel.attributes.executeCommand) {
                return !enabled || enabled({
                      context: this.options.context,
                      node: this.options.node
                    });
              } else {
                return false;
              }
            } else {
              return !enabled || enabled({
                    context: this.options.context,
                    node: this.options.node
                  });
            }
          }, this)
          .map(function (panel) {
            return panel.attributes;
          })
          .value();
    },

    onRender: function () {
      this.$el.prepend("<div class='csui-metadata-tab-bar'></div>");
      this._updateBrowsingState();
    },

    onActivateTab: function (tabContent, tabPane, tabLink) {
      // Warning: this onActivateTab is currently being triggered twice by the 'activate:tab' event.
      // The code in the base 'controls/tab.panel' needs to be revisited later when time permits.
      // Any code being called from here should handle two calls gracefully by itself !!!
      tabContent && tabContent.triggerMethod('panel:activated');
      this._updateBrowsingState();
    },

    _updateBrowsingState: function () {
      // let the router know and navigate accordingly
      if (this.browsingStates && this.options.node) {
        var stateChanged = false;
        var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
        var currentStateId = browsingState && browsingState.get('id');
        var newStateId = 'metadata';

        var titleNodeNameSuffix = lang.properties;
        var versionNumInTitle = '';
        var nodeName = this.options.node.get('name');
        var data = {path: {}, query: {}};
        data.path.node_id = this.options.node.get('id');

        // perspective: 'metadata.navigation' or 'metadata'
        var container = this.options.container || this.options.containerCollection;
        data.query.perspective = container ? 'metadata.navigation' : 'metadata';
        if (container && container.get('id') === this.options.node.get('id')) {
          data.query.perspective = 'metadata';
        }

        if (this.options.node instanceof VersionModel) {
          data.path.version_num = this.options.node.get('version_number');
          newStateId = 'version';
          versionNumInTitle = _.str.sformat(lang.versionNumInBrowserTitle, data.path.version_num);
        }

        var tabIndex = this.options.activeTab && this.options.activeTab.get('tabIndex');
        if (tabIndex !== undefined && this.options.collection &&
            tabIndex >= 0 && tabIndex < this.options.collection.length) {
          var tab = this.options.collection.at(tabIndex);
          data.query.panel = tab && tab.get('name');
          var activePanelTitle = tab && tab.get('title');
          activePanelTitle && (titleNodeNameSuffix = activePanelTitle);
        }

        if (versionNumInTitle.length > 0) {
          titleNodeNameSuffix = versionNumInTitle + ' ' + titleNodeNameSuffix;
        }
        data.path.node_name = nodeName + ' - ' + titleNodeNameSuffix;

        if (currentStateId !== newStateId) {
          data.query.container_id = this.options.node.get('parent_id');
          browsingState = new NodeBrowsingStateModel(data);
          browsingState.set('id', newStateId, {silent: true});
          this.browsingStates.push(browsingState, {silent: true});
          this.browsingState = browsingState;
          stateChanged = true;
        } else {
          var browsingStatePath = browsingState.get('path') || {};
          var browsingStateQuery = browsingState.get('query') || {};
          // merge and set the data.query
          data.query = _.extend({}, browsingStateQuery, data.query);
          // determine if a stage change is needed
          if (data.path.node_id !== browsingStatePath.node_id ||
              data.path.version_num !== browsingStatePath.version_num ||
              data.query.panel !== browsingStateQuery.panel) {
            stateChanged = true;
          }
          browsingState.set(data, {silent: true});
        }

        // TODO: fix the TabPanel component because the 'activate:tab' event is triggered twice.
        // the stateChanged check here is to handle this method being called twice.
        if (stateChanged && this.browsingStates.allowUrlUpdate) {
          this.browsingStates.trigger('state:change');
        } else if (this.browsingStates.updateBrowserTitleAfterPageLoaded === true) {
          this.browsingStates.updateBrowserTitleAfterPageLoaded = false;
          this.browsingStates.trigger('update:title');
        }
      }
    },

    _clearBrowsingState: function () {
      if (this.browsingStates && this.browsingState && this.options.node) {
        this.browsingStates.remove(this.browsingState, {silent: true});
        this.browsingState = undefined;
      }
    },

    _closeToggle: function () {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      if (dropdownToggleEl.parent().hasClass('binf-open')) {
        dropdownToggleEl.binf_dropdown('toggle');
      }
    },

    _updateTabs: function () {
      var tabs = this._buildTabs();
      // FIXME: _convertCollection should return an array of object
      // literals or models; the models below do not change their
      // parent collection without removing them
      this.collection.reset(this._convertCollection({tabs: tabs}).models);
    },

    _nodeChanged: function () {
      // We switched to other node or fetched the node info
      if (this.options.node.hasChanged('id') || this.options.node.hasChanged('type')) {
        this._updateTabs();
      }
    }

  });

  return MetadataDropdownTabView;

});

csui.define('csui/widgets/metadata/impl/metadata.controller',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/url",
  "csui/utils/base"
], function (_, $, Backbone, Url, base) {

  // handling server calls for metadata
  function MetadataController(status, options, attributes) {
    this.status = status || {};
    this.options = options || {};
    this.attributes = attributes || {};
  }

  _.extend(MetadataController.prototype, Backbone.Events, {

    save: function (model, data) {
      // Pass data via the first attrs param to get them set to model
      // attributes
      return model.save(data, {
        wait: true,
        patch: true
      });
    },

    createItem: function (model, formsValues) {
      return model.save(undefined, {
        // If data does not contain common attributes, which should be just set
        // to model attributes, it should be passed via options.data instead of
        // using the first attrs paremeter
        data: formsValues,
        wait: true
      });
    }

  });

  MetadataController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataController, {version: "1.0"});

  return MetadataController;
});

csui.define('csui/widgets/metadata/metadata.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/widgets/metadata/impl/header/metadata.header.view',
  'csui/widgets/metadata/impl/metadata.dropdowntab.view', 'csui/models/node/node.model',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/browsing.states',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadata.controller', 'csui/utils/nodesprites',
  'csui/controls/progressblocker/blocker', 'csui/utils/commandhelper',
  'csui/widgets/permissions/permissions.view',
  'csui/models/nodechildren', 'csui/models/version', 'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/commands', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadata'
], function (_, $, Marionette, base, MetadataHeaderView, MetadataDropdownTabView,
    NodeModel, NodeModelFactory, BrowsingStateCollectionFactory, ViewEventsPropagationMixin,
    MetadataController, NodeSpriteCollection, BlockingView, CommandHelper, PermissionsView,
    NodeChildrenCollection, VersionModel, ModalAlert, commands, lang) {

  var MetadataView = Marionette.ItemView.extend({

    className: 'cs-metadata',

    template: false,

    constructor: function MetadataView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      this.options = options;

      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
      }

      // setting initialPanel if it was passed in from data or overriden by URL
      options.model.unset('initialPanel', {silent: true});
      if (options.data.initialPanel) {
        options.model.set('initialPanel', options.data.initialPanel, {silent: true});
      }

      this.browsingStates = options.context.getCollection(BrowsingStateCollectionFactory);
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var query = browsingState && browsingState.get('query');
      var perspective = query && query.perspective;
      if (perspective === 'metadata' || perspective === 'metadata.navigation') {
        // find and set the inital 'panel'
        var panel = query && query.panel;
        panel && options.model.set('initialPanel', panel, {silent: true});

        // check for version_number
        var path = browsingState && browsingState.get('path');
        var versionNumberUrlOverride = path && path.version_num;
        if (versionNumberUrlOverride && !(options.model instanceof VersionModel)) {
          options.model = new VersionModel({
            id: options.model.get('id'),
            version_number: versionNumberUrlOverride,
            initialPanel: options.model.get('initialPanel')
          }, {
            connector: options.model.connector
          });
          this._ensureCompleteVersionNode();
        }
      }

      this.options.showShortcutSwitch = true;
      this.options.showRequiredFieldsSwitch = true;
      if (this.options.model.get('type') === 1 || !!this.options.model.get('shortcutNode')) {  // shortcut
        if (!!this.options.model.get('shortcutNode') && this.options.model.get('type') !== 1) {
          this.options.shortcutNode = this.options.model.get('shortcutNode');
        } else {
          this.options.model.connector.assignTo(this.options.model.original); //TODO: have to do this?
          this.options.shortcutNode = this.options.model;
          var shortcutResourceScope = this.options.shortcutNode.getResourceScope();
          this.options.model.original.setResourceScope(shortcutResourceScope);
          this.options.model = this.options.model.original;
          this.options.model.set('shortcutNode', this.options.shortcutNode, {silent: true});
        }
        //Load permissions page after getting actions from REST API
        this.options.actionsPromise = this._ensureCompleteNode();
      } else {
        this.options.actionsPromise = $.Deferred().resolve().promise();
      }


      // Once PropertiesView is opened , 'OrginatingView' becomes metadataView or
      // MetadataNavigationview.
      // If  properties view page does not have navigationlist (eg for folders and wikipage) then
      // originating view becomes 'MetadataView' based on supportOriginatingView
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);

      // When this view is used alone on a perspective, if should offer
      // spinning sun to commands executed with it as originating view
      BlockingView.imbue(this);

      this.options.showDropdownMenu = true;
      this.options.originatingView = this.options.originatingView || this;
      this.metadataHeaderView = new MetadataHeaderView(_.extend({
        // Since ItemNameView (which includes DropdownMenuView, etc.) is now being used elsewhere,
        // this boolean flag is to indicate metadata scenario for ItemNameView to know.
        metadataScenario: true,
        // If this widget is placed on a perspective, it becomes the originating view itself
        originatingView: this
      }, this.options));
      this.listenTo(this.metadataHeaderView, "metadata:item:name:save", this._saveItemName)
          .listenTo(this.metadataHeaderView, 'metadata:item:before:delete',
              function (args) {
                self.trigger('metadata:item:before:delete', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:before:move',
              function (args) {
                self.trigger('metadata:item:before:move', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:deleted', function (args) {
            self.trigger('metadata:item:deleted', args);
          })
          .listenTo(this.metadataHeaderView, "shortcut:switch", function (view) {
            self.options.model = view.node;
            self.options.model.set('shortcutNode', self.model.get('shortcutNode'), {silent: true});
            this._ensureCompleteNode()
                .always(function () {
                  !!self.metadataTabView && self.metadataTabView.destroy();
                  if (!!self.options.showPermissionView) {
                    self.metadataTabView = new PermissionsView({
                      model: self.options.model,
                      originatingView: self.options.originatingView,
                      context: self.options.context,
                      showCloseIcon: self.options.originatingView ? false : true,
                      showBackIcon: self.options.originatingView ? true : false,
                      selectedTab: status.selectedTab,
                      selectedProperty: self.options.selectedProperty
                    });

                  } else {
                    self.metadataTabView = new MetadataDropdownTabView({
                      context: self.options.context,
                      node: self.options.model,
                      containerCollection: self.options.containerCollection,
                      originatingView: self.options.originatingView,
                      metadataView: self,
                      activeTab: self.options.activeTab,
                      delayTabContent: self.options.delayTabContent
                    });
                  }

                  self.$el.append(self.metadataTabView.render().$el);
                  self.propagateEventsToViews(self.metadataTabView);
                });
          })
          .listenTo(this.metadataHeaderView, "metadata:close", function () {
            self.trigger("metadata:close");
          })
          // stops listening, so that the second subscribed event won't do any harm
          .listenTo(this.options.context, 'request', function () {
            self._closeMetadata();
          })
          .listenTo(this.options.context, 'request:perspective', function () {
            self._closeMetadata();
          });

      var tabOptions = {
        context: this.options.context,
        node: this.options.model,
        containerCollection: this.options.containerCollection,
        originatingView: this.options.originatingView,
        metadataView: this,
        blockingParentView: this,
        activeTab: this.options.activeTab,
        selectedTab: this.options.selectedTab,
        selectedProperty: this.options.selectedProperty,
        delayTabContent: self.options.delayTabContent
      };

      if (this.options.showPermissionView) {
        this.options.actionsPromise.always(function(){
          self.metadataTabView = new PermissionsView({
            model: self.options.model,
            originatingView: self.options.originatingView,
            context: self.options.context,
            showCloseIcon: self.options.originatingView ? false : true,
            showBackIcon: self.options.originatingView ? true : false,
            selectedTab: status.selectedTab,
            selectedProperty: self.options.selectedProperty
          });
          self.propagateEventsToViews(self.metadataTabView, self.metadataHeaderView);
        });
      } else {
        this.metadataTabView = new MetadataDropdownTabView(tabOptions);
        this.propagateEventsToViews(this.metadataTabView, this.metadataHeaderView);
      }
    },

    onRender: function () {
      // don't render until the shortcut's original node has been fetched
      var fetching = this.options.model.fetching;
      if (fetching) {
        // Note: render always so that the link to Shortcut Properties is available for the 
        // user to click on to go into the Properties page and update the Original Location field.
        // This is due to the backward UX design that Original Properties is rendered first.
        // TODO: Find out, why the link "View shortcut" is dead after re-rendering
        return fetching.always(_.bind(this.render, this));
      }

      var mhv = this.metadataHeaderView.render();
      var mdv = this.metadataTabView.render();

      Marionette.triggerMethodOn(mhv, 'before:show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);

      this.$el.append(mhv.el);
      this.$el.append(mdv.el);

      Marionette.triggerMethodOn(mhv, 'show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);
    },

    onBeforeDestroy: function () {
      this.cancelEventsToViewsPropagation(this.metadataTabView, this.metadataHeaderView);
      this.metadataHeaderView.destroy();
      this.metadataTabView.destroy();
    },

    _saveItemName: function (args) {
      var self = this;
      var itemName = args.sender.getValue();
      var data = {'name': itemName};
      var metadataController = new MetadataController();
      var node = this.options.model;
      var collection = this.options.collection;
      var shortcutOriginal;
      // workarounds to handle the refresh of the shortcut node or original node
      if (this.options.shortcutNode && this.options.shortcutNode.original === node) {
        var originalNodeInCollection = this.options.collection.findWhere(
            {id: node.get('id')});
        if (originalNodeInCollection) {
          shortcutOriginal = node;
          node = originalNodeInCollection;
        } else {
          collection = undefined;
        }
      }

      self._blockActions();
      metadataController.save(node, data)
          .done(function () {
            return node.fetch()
                .then(function () {
                  if (shortcutOriginal) {
                    shortcutOriginal.set(node.attributes);
                  }
                  // Following command causing failure in breadcrumb collection update,
                  // While renaming the item in metadata view, and clicking directly on breadcrumb
                  // ancestor. After commenting out nodes table parent item renaming functionality
                  // is working fine.
                  //self.options.context && self.options.context.trigger('current:folder:changed');
                  args.success && args.success();
                  self._unblockActions();
                  if (self.options.originatingView &&
                      _.isFunction(self.options.originatingView.unblockActions)) {
                    self.options.originatingView.unblockActions();
                  }
                });
          })
          .fail(function (error) {
            self._unblockActions();
            var errorMsg = CommandHelper._getErrorMessageFromResponse(error);
            errorMsg === undefined && (errorMsg = lang.failedToSaveName);
            args.error && args.error(errorMsg);
          });
    },

    _ensureCompleteVersionNode: function () {
      this._blockActions();
      return this.options.model.fetch()
          .always(_.bind(this._unblockActions, this))
          .fail(function (request) {
            var error = new base.Error(request);
            ModalAlert.showError(error.message);
          });
    },

    _ensureCompleteNode: function () {
      var node = this.options.model;

      function checkExpansion(property) {
        var value = node.get(property + '_id');
        if (value && !_.isObject(value) && !_.isObject(node.get(property + '_id_expand'))) {
          node.setExpand('properties', property);
          return true;
        }
      }

      var expandable = _.invoke(['original', 'parent', 'create_user',
        'modify_user', 'owner_user', 'reserved_user'], checkExpansion);
      expandable = _.contains(expandable, true);

      var actionsNeeded = node.actions.length <= 1;

      if (expandable || actionsNeeded) {
        this._blockActions();
        return node.fetch()
            .always(_.bind(this._unblockActions, this))
            .fail(_.bind(function (request) {
              var error = new base.Error(request);
              ModalAlert.showError(error.message);
            }, this));
      }
      return $.Deferred().resolve().promise();
    },

    _closeMetadata: function () {
      var node = this.options.model;
      if (node.get('type') === 1 && node.original && node.original.get('type') === 0) {
        this.trigger("metadata:close");
      } else {
        this.trigger('metadata:close:without:animation');
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    }

  });

  _.extend(MetadataView.prototype, ViewEventsPropagationMixin);

  return MetadataView;

});

csui.define('csui/widgets/metadata/metadata.action.one.item.properties.view',["module", "csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette",
  "csui/widgets/metadata/impl/header/metadata.header.view",
  "csui/widgets/metadata/metadata.properties.view", 'csui/utils/log',
  "csui/controls/mixins/view.events.propagation/view.events.propagation.mixin",
  "css!csui/widgets/metadata/impl/metadata"
], function (module, _, $, Marionette, MetadataHeaderView, MetadataPropertiesView,
    log, ViewEventsPropagationMixin) {

  var MetadataActionOneItemPropertiesView = Marionette.ItemView.extend({

    className: 'cs-add-item-metadata-form',
    template: false,

    // public
    constructor: function MetadataActionOneItemPropertiesView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      options.showRequiredFieldsSwitch = true;
      this.metadataHeaderView = new MetadataHeaderView(options);
      this.listenTo(this.metadataHeaderView, "metadata:item:name:save", this._saveItemName);
      this.listenTo(this.metadataHeaderView, "update:button", _.bind(function (args) {
        this.trigger("update:button", args);
      }, this));

      this.metadataPropertiesView = new MetadataPropertiesView({
        node: options.model,
        collection: options.collection,
        container: options.container,
        context: options.context,
        formMode: 'create',
        action: options.action,
        inheritance: options.inheritance,
        metadataView: this,
        formCollection: options.formCollection,
        suppressAddProperties: options.suppressAddProperties
      });
      if (!options.collection) {
        this.listenTo(this.metadataPropertiesView.allForms, 'sync', this._updateSchema);
      }
      this.listenTo(this.metadataPropertiesView, 'render:forms', this.setNameFieldFocus);
      this.propagateEventsToViews(this.metadataHeaderView, this.metadataPropertiesView);
    },

    // private
    _updateSchema: function() {
      // just update name schema in name field of header
      var generalForm = this.metadataPropertiesView.allForms.first(),
          formSchema = generalForm && generalForm.get('schema'),
          nameSchema = formSchema && formSchema.properties && formSchema.properties.name;
      if (nameSchema) {
        this.metadataHeaderView.metadataItemNameView.updateNameSchema(nameSchema);
      } else {
        log.warn('Form collection lacks name field in the first form.') && console.warn(log.last);
      }
    },

    // private
    onRender: function () {
      var inv = this.metadataHeaderView.render();
      var mdv = this.metadataPropertiesView.render();

      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);

      if (this.options.suppressHeaderView !== true) {
        this.$el.append(inv.el);
      }
      this.$el.append(mdv.el);

      if (this.options.suppressHeaderView) {
        this.$el.addClass('without-header-bar');
      }

      if (this.options.extraViewClass) {
        this.$el.addClass(this.options.extraViewClass);
      }

      Marionette.triggerMethodOn(inv, 'show', inv, this);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);
    },

    // private
    onBeforeDestroy: function () {
      this.cancelEventsToViewsPropagation(this.metadataHeaderView, this.metadataPropertiesView);
      this.metadataHeaderView.destroy();
      this.metadataPropertiesView.destroy();
    },

    // public
    validate: function () {
      var bNameIsValid = this.metadataHeaderView.validateName();
      var bFormsAreValid = this.metadataPropertiesView.validateForms();

      return bNameIsValid && bFormsAreValid;
    },

    // public
    getValues: function () {
      var data = {};
      var validation = this.validate();
      if (validation) {
        var itemName = this.metadataHeaderView.getNameValue();
        data = {
          "name": itemName,
          "type": this.options.model.get('type'),
          "parent_id": this.options.model.get('parent_id')
        };
        var formsValues = this.metadataPropertiesView.getFormsValues();
        _.extend(data, formsValues);
      }

      return data;
    },

    // public
    setNameFieldFocus: function () {
      if (this.firstFocusCalled !== true && this.options.suppressHeaderView !== true) {
        this.metadataHeaderView.setNameEditModeFocus();
      }
      this.firstFocusCalled = true;
    },

    _saveItemName: function (args) {
      var itemName = args.sender.getValue();
      this.model.set('name', itemName, {silent: true});
      args.success && args.success();
    }

  });

  MetadataActionOneItemPropertiesView.version = "1.0";

  _.extend(MetadataActionOneItemPropertiesView.prototype, ViewEventsPropagationMixin);

  return MetadataActionOneItemPropertiesView;

});

csui.define('csui/widgets/metadata/impl/common/base.metadata.action.view',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
  "csui/controls/dialog/dialog.view", "csui/controls/progressblocker/blocker",
  "i18n!csui/widgets/metadata/impl/nls/lang", "css!csui/widgets/metadata/impl/metadata"
], function (_, $, Backbone, DialogView, BlockingView, lang) {

  function BaseMetadataActionView() {
  }

  _.extend(BaseMetadataActionView.prototype, Backbone.Events, {

    // public: display metadata view in either originatingView with animation or modal dialog
    // @parameter:
    // - options: {
    //    - originatingView: animate and show the form in the originating view
    //    - view: the view to show
    //    - dialogOptions: {
    //      - dialogTitle: dialog title
    //      - OkButtonTitle: the OK button title
    //      - OkButtonClick: method to handle the OkClick
    //      - CancelButtonTitle: (optional) the Cancel button title
    //      - CancelButtonClick: (optional) method to handle the CancelClick
    //    }
    // }
    baseDisplayForm: function (options) {
      options || (options = {});
      this.options = options;
      this.deferred = $.Deferred();

      if (options.view) {
        BlockingView.imbue(options.view);
      }

      // replace the originatingView with sliding left/right animation
      if (options.originatingView) {

        // TODO: UX and Josef will ask for this in the future, add this support when time permits

      } else {  // show Metadata View in a modal dialog

        var dialogOptions = options.dialogOptions || {};
        var okAction = dialogOptions.OkButtonClick || this._cancelAction;
        var cancelAction = dialogOptions.CancelButtonClick || this._cancelAction;
        var buttons = [
          {
            id: 'okButton',
            default: true,
            label: dialogOptions.OkButtonTitle ? dialogOptions.OkButtonTitle :
                   lang.defaultDialogOkButtonTitle,
            click: _.bind(okAction, this, options)
          },
          {
            id: 'cancel',
            label: dialogOptions.CancelButtonTitle ? dialogOptions.CancelButtonTitle :
                   lang.defaultDialogCancelButtonTitle,
            click: _.bind(cancelAction, this),
            actionToken: dialogOptions.CancelButtonActionToken
          }
        ];
        if (this.options.view.model) {
          if (!(this.options.view.model.get('name'))) {
            buttons[0].disabled = true;
          }
        }
        var title = dialogOptions.dialogTitle ? dialogOptions.dialogTitle :
                    lang.defaultDialogTitle;
        var dialog = new DialogView({
          className: 'cs-item-action-metadata',
          title: title,
          buttons: buttons,
          largeSize: true,
          view: options.view
        });
        this.dialog = dialog;
        this.listenTo(this.dialog, "hide", this._cancelAction)
            .listenTo(this.dialog, "update:button", _.bind(function (args) {
              // Apply overlay[pointer-events:none] for button to prevent user interaction
              // until the respective action is performed instead of disabling the button
              // which may cause ambiguity
              if (args.overlay !== undefined) {
                var buttonModel = this.dialog.footerView.collection.get('okButton'),
                    button      = this.dialog.footerView.children.findByModel(buttonModel),
                    method      = button && !button.$el.is(":disabled") && args.overlay ?
                                  'addClass' : 'removeClass';
                button.$el[method]("cs-button-overlay");
              } else {
                this.dialog.footerView.updateButton('okButton', args);
              }
            }, this));

        dialog.show();

      }

      return this.deferred.promise();
    },

    // private
    _cancelAction: function (args) {
      var resetRequiredSwitch = !!this.node && !!this.node.collection &&
                                !!this.node.collection.requireSwitched &&
                                (!!this.node.get('action') ||
                                 (!!this.options.view && this.options.view.options.action));
      if (resetRequiredSwitch) {
        this.node.collection.requireSwitched = false;
      }
      if (this.options.view) {
        this.options.view.unblockActions();
      }
      this.dialog.destroy();

      // assume that the close button was clicked if args is undefined
      if (args === undefined) {
        args = {
          buttonAttributes: {
            actionToken: "closeMetadataActionView"
          }
        };
      }

      this.deferred.reject(args);
    }

  });

  BaseMetadataActionView.prototype.get = Backbone.Model.prototype.get;
  _.extend(BaseMetadataActionView, {version: "1.0"});

  return BaseMetadataActionView;

});

csui.define('csui/widgets/metadata/impl/add.properties/metadata.add.categories.view',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/log', 'csui/widgets/metadata/impl/common/base.metadata.action.view',
  'csui/models/forms', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/dialogs/modal.alert/modal.alert', 'css!csui/widgets/metadata/impl/metadata'
], function (require, _, $, Url, log, BaseMetadataActionView, FormCollection, lang, ModalAlert) {
  'use strict';

  //
  // Metadata add categories view displays the category form for the user to fill out
  // categories values, validates the form and adds the category to the object when the user clicks
  // on the Add button.
  //
  function MetadataAddCategoriesView() {
  }

  _.extend(MetadataAddCategoriesView.prototype, BaseMetadataActionView.prototype, {

    displayForm: function (options) {
      var deferred = $.Deferred();
      var self = this;

      options || (options = {});
      this.node = options.model;
      this.catId = options.catId;
      this.catName = options.catName;

      var catCollection = new FormCollection([options.catModel]);
      catCollection.fetching = false;
      catCollection.fetched = true;

      csui.require(["csui/widgets/metadata/metadata.action.one.item.properties.view"
      ], function (MetadataActionOneItemPropertiesView) {

        self.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
          model: options.model,
          collection: catCollection,
          context: options.context,
          commands: options.commands,
          suppressAddProperties: true,
          suppressHeaderView: true,
          extraViewClass: 'add-category'
        });

        var baseUIOptions = {};
        baseUIOptions.callerProcessData = options.callerProcessData;
        baseUIOptions.originatingView = options.originatingView;
        baseUIOptions.view = self.metadataAddItemPropView;
        var dialogOptions = {};
        dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                    lang.addNewCategoryDialogTitle;
        dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                      lang.addNewCategoryDialogAddButtonTitle;
        dialogOptions.OkButtonClick = self._addCategory;
        baseUIOptions.dialogOptions = dialogOptions;

        self.baseDisplayForm(baseUIOptions)
            .done(function (resp) {
              deferred.resolve(resp);
            })
            .fail(function (error2) {
              deferred.reject(error2);
            });

      }, function (error) {
        log.warn('Failed to load MetadataActionOneItemPropertiesView. {0}', error)
        && console.log(log.last);
        deferred.reject(error);
      });

      return deferred.promise();
    },

    // private
    _addCategory: function (args) {
      var valid = this.metadataAddItemPropView.validate();
      if (valid) {
        //generic error handling for all modules
        this.options.view.$el.find(".cs-formfield-invalid").removeClass('cs-formfield-invalid');
        var nodeId = this.node.get('id');
        var catData = this.metadataAddItemPropView.getValues();
        var data = {id: nodeId, category_id: this.catId};
        if (catData.roles && catData.roles.categories) {
          _.each(catData.roles.categories, function (cat, key) {
            data = _.extend(data, cat);
          });
        }

        var fullUrl = Url.combine(this.node.urlBase(), 'categories');
        var formData = new FormData();
        var options = {
          type: 'POST',
          url: fullUrl
        };
        formData.append('body', JSON.stringify(data));
        _.extend(options, {
          data: formData,
          contentType: false,
          processData: false
        });

        this.node.connector &&
        this.node.connector.extendAjaxOptions(options);

        this.metadataAddItemPropView.blockActions();
        $.ajax(options)
            .done(_.bind(function (resp) {
              this.metadataAddItemPropView.unblockActions();
              this.dialog.destroy();
              this.deferred.resolve(resp);
            }, this))
            .fail(_.bind(function (error) {
              this.metadataAddItemPropView.unblockActions();
              var serverError = '';
              if (error && error.responseJSON && error.responseJSON.error) {
                serverError = error.responseJSON.error;
              }
              var title = lang.addNewCategoryFailTitle;
              var message = _.str.sformat(lang.addNewCategoryFailMessage,
                  this.catName, this.node.get('name'), nodeId, serverError);
              ModalAlert.showError(message, title);
            }, this));

      } else {
        //generic error handling for all modules
        this.options.view.$el.find(".binf-has-error .cs-formfield").addClass(
            'cs-formfield-invalid');

      }

    }

  });

  _.extend(MetadataAddCategoriesView, {version: "1.0"});

  return MetadataAddCategoriesView;

});

csui.define('csui/widgets/metadata/metadata.add.categories.controller',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/utils/base', 'csui/utils/log', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/dialogs/modal.alert/modal.alert', 'csui/widgets/metadata/impl/metadata.utils',
  'csui/widgets/metadata/impl/add.properties/metadata.add.categories.view',
  'csui/models/node/node.model', 'csui/models/appliedcategoryform',
  'csui/dialogs/node.picker/node.picker', 'csui/utils/commands',
  'css!csui/widgets/metadata/impl/metadata'
], function (require, _, $, Backbone, Url, base, log, lang, ModalAlert,
    MetadataUtils, MetadataAddCategoriesView, NodeModel, AppliedCategoryFormModel,
    NodePicker, commands) {
  'use strict';

  //
  // Metadata add categories controller handles adding category to an existing item, a new item
  // being created or copied or moved.
  //

  function MetadataAddCategoriesController() {
  }

  _.extend(MetadataAddCategoriesController.prototype, Backbone.Events, {

    // Public: add category to an existing item, new item being created or copied or moved
    //
    // Parameters:
    // - <object> options containing:
    //   - action: the action 'create', 'copy', 'move', or undefined for an existing item
    //   - node: an existing or a temporary NodeModel for a new item being created with undefined id
    //   - collection: the existing category collection
    //   - container: the container where the item is/will be in
    //   - inheritance: the category inheritance 'original', 'destination' or 'merged'
    //   - context: the application context
    //   - parentView: the view to have blockingView on
    //
    // Return:
    // - <object> jQuery deferred object containing the new 'catModel' if succeeds
    //
    AddNewCategory: function (options) {
      var deferred = $.Deferred();
      var nodePicker = new NodePicker({
        startLocation: 'category.volume',
        context: options.context,
        selectableTypes: [131],
        unselectableNodes: !options.collection ? [] :
                           options.collection.where({role_name: "categories"}),
        selectMultiple: false,
        dialogTitle: lang.selectCategoryTitle,
        globalSearch: true,
        selectButtonLabel: lang.selectCategoryButtonLabel
      });
      nodePicker.show()
          .done(_.bind(function (args) {
            _.reduce(args.nodes, function (promise, node) {
                  return promise.then(_.bind(function () {
                    var catId = node.get('id');
                    var catName = node.get('name');

                    // with adding a new item, the object does not exist yet.  Just load the form.
                    if (options.node.get('id') === undefined || options.action) {
                      // load the category create form for the user to fill out values
                      return this._loadNewCategoryForm(options, catId, catName);
                    } else {
                      // code path new: display the form in a modal dialog with the Add button
                      return this._displayAddCategoryForm(options, catId, catName);
                    }
                  }, this));
                }, $.Deferred().resolve(), this)
                .done(function (resp3) {
                  deferred.resolve(resp3);
                })
                .fail(function (error3) {
                  deferred.reject(error3);
                });
          }, this))
          .fail(function (error2) {
            deferred.reject(error2);
          });

      return deferred.promise();
    },

    // private: display the form in a modal dialog with the Add button
    _displayAddCategoryForm: function (options, catId, catName) {
      var deferred = $.Deferred();
      var self = this;
      this._getCategoryModel(options, catId, catName)
          .done(function (resp) {
            var formOptions = {
              model: options.node,
              context: options.context,
              commands: commands,
              catId: catId,
              catName: catName, catModel: resp.catModel
            };
            var metadataAddCatView = new MetadataAddCategoriesView();
            metadataAddCatView.displayForm(formOptions)
                .done(function (resp2) {
                  self._loadNewCategoryForm(options, catId, catName, "update")
                      .done(function (resp3) {
                        deferred.resolve(resp3);
                      })
                      .fail(function (error3) {
                        deferred.reject(error3);
                      });
                })
                .fail(function (error2) {
                  deferred.reject(error2);
                });
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: load the category create form first for the user to fill out values
    _loadNewCategoryForm: function (options, catId, catName, formType) {
      if (catId && options.collection.get(catId)) {
        var title = lang.addNewCategoryFailTitle;
        var message = _.str.sformat(lang.categoryExistsMessage, catName);
        ModalAlert.showError(message, title);
        return $.Deferred().reject({});
      }

      var deferred = $.Deferred();
      this._getCategoryModel(options, catId, catName, formType)
          .done(_.bind(function (resp) {
            deferred.resolve(resp);
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: get the category model
    _getCategoryModel: function (options, catId, catName, formType) {

      var allowDeleteCat = true;
      // default: formType = 'create'
      if (!formType) {
        formType = 'create';
        if (options.action === undefined) {
          allowDeleteCat = false;
        }
      }

      var deferred = $.Deferred();
      var fullUrl;
      var connector = (options.node && options.node.connector) ||
                      (options.container && options.container.connector);
      var nodeId = options.node.get('id');
      //TO:DO pId is passed to made it availabe in TKLFieldView need to fix as this temp fix
      if (options.container) {
        options.node.pId = options.container.get('id');
      }
      if (options.node.get('id') === undefined && options.action === 'create') {
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/create?parent_id=' + options.container.get('id') +
            '&type=' + options.node.get('type') + '&category_id=' + catId);
      } else if (options.action === 'copy' || options.action === 'move') {
        var inheritanceVal = 0;
        if (options.inheritance === 'destination') {
          inheritanceVal = 1;
        } else if (options.inheritance === 'merged') {
          inheritanceVal = 2;
        }
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/' + options.action + '?id=' + nodeId +
            '&parent_id=' + options.container.get('id') +
            '&inheritance=' + inheritanceVal + '&category_id=' + catId);
      } else {
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/categories/' + formType + '?id=' + nodeId +
            '&category_id=' + catId);
      }

      var ajaxOptions = {
        type: 'GET',
        url: fullUrl
      };
      connector.extendAjaxOptions(ajaxOptions);
      if (options.parentView) {
        options.parentView.blockActions();
        //prevent pointer events on add button untill new category form is rendered
        options.parentView.trigger("update:button", true);
      }
      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            options.parentView && (options.parentView.unblockActions());

            // different calls have different data structure
            var categoriesForm, data, fOptions, schema;
            if (options.action === 'create' ||
                options.action === 'copy' || options.action === 'move') {
              if (resp.forms.length > 1) {
                categoriesForm = _.find(resp.forms, function (form) {
                  return form.role_name === "categories";
                });
                if (categoriesForm) {
                  data = (categoriesForm.data[catId]) || {};
                  fOptions = (categoriesForm.options.fields[catId]) || {};
                  schema = (categoriesForm.schema.properties[catId]) || {};
                }
              }
            } else {
              categoriesForm = resp && resp.forms && resp.forms[0];
              data = (categoriesForm && categoriesForm.data) || {};
              fOptions = (categoriesForm.options) || {};
              schema = (categoriesForm.schema) || {};
            }

            if (categoriesForm) {

              if (fOptions.form) {
                fOptions = _.omit(fOptions, 'form');
              }
              if (schema.title === undefined && catName) {
                schema.title = catName;
              }

              var metadataUtils = new MetadataUtils();
              var required = metadataUtils.AlpacaFormOptionsSchemaHaveRequiredFields(fOptions,
                  schema);

              var catModel = new AppliedCategoryFormModel({
                id: catId,
                title: catName || (fOptions && fOptions.fields && fOptions.fields.category_id &&
                                   fOptions.fields.category_id.label),
                allow_delete: allowDeleteCat,
                required: required
              }, {
                node: options.node,
                categoryId: catId,
                action: 'none'
              });

              catModel.set({
                data: data,
                options: fOptions,
                schema: _.omit(schema, 'description'),
                role_name: "categories",
                removeable: true
              });

              deferred.resolve({catModel: catModel});

            } else {
              deferred.reject({});
            }

          }, this))
          .fail(_.bind(function (error) {
            if (options.parentView) {
              options.parentView.unblockActions();
              options.parentView.trigger("update:button", false);
            }
            var serverError = this._getRespError(error);
            var title = lang.loadNewCategoryFailTitle;
            var message = _.str.sformat(lang.loadNewCategoryFailMessage,
                catName, options.node.get('name'), nodeId, serverError);
            ModalAlert.showError(message, title);
            deferred.reject(error);
          }, this));

      return deferred.promise();
    },

    // private
    _getRespError: function (resp) {
      var error = '';
      if (resp && resp.responseJSON && resp.responseJSON.error) {
        error = resp.responseJSON.error;
      } else if (base.MessageHelper.hasMessages()) {
        error = $(base.MessageHelper.toHtml()).text();
        base.MessageHelper.clear();
      }
      return error;
    }

  });

  _.extend(MetadataAddCategoriesController, {version: "1.0"});

  return MetadataAddCategoriesController;

});

csui.define('csui/widgets/metadata/metadata.add.item.controller',["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/widgets/metadata/impl/metadata.controller",
  "csui/widgets/metadata/metadata.action.one.item.properties.view",
  "csui/utils/commandhelper", "i18n!csui/widgets/metadata/impl/nls/lang",
  "csui/dialogs/modal.alert/modal.alert", 'csui/utils/nodesprites',
  'csui/utils/commands', "css!csui/widgets/metadata/impl/metadata"
], function (_, BaseMetadataActionView, MetadataController,
    MetadataActionOneItemPropertiesView, CommandHelper, lang, ModalAlert,
    nodeSpriteCollection, commands) {

  //
  // Metadata Add Item Controller allows the adding of item with complete metadata
  // that the user can edit and change values of general metadata, categories and other roles.
  //

  function MetadataAddItemController() {
  }

  _.extend(MetadataAddItemController.prototype, BaseMetadataActionView.prototype, {

    // public (usually called from the 'command' class that has 'status' and 'options' parameters)
    displayForm: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var node = nodes.length > 0 ? nodes.models[0] : null;
      // Compute the type name only if the new node includes the type name
      // sent by the server, to be able to fall back to it
      var addableTypeName = node.get('type_name') ?
                            nodeSpriteCollection.findTypeByNode(node) :
                            lang.addItemMetadataDialogTitleGeneric;

      this.node = node;
      this.metadataController = options.metadataController;

      var addItemView = this.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
        model: node,
        container: status.container,
        id: options.id,
        context: status.context || options && options.context,
        commands: commands,
        action: 'create',
        inheritance: options.inheritance,
        // Performs the complete fetch and preparation of the creation forms
        collection: options.completeFormCollection,
        // Performs just fetch; the preparation is performed by the csui forms collection
        formCollection: options.formCollection
      });
      var baseUIOptions = {};
      baseUIOptions.callerProcessData = options.callerProcessData;
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = addItemView;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  _.str.sformat(lang.addItemMetadataDialogTitle1, addableTypeName);
      dialogOptions.OkButtonTitle = options.addButtonTitle ? options.addButtonTitle :
                                    lang.addItemMetadataDialogButtonAddTitle;
      dialogOptions.OkButtonClick = this._addItem;
      dialogOptions.CancelButtonActionToken = options.cancelButtonActionToken;
      baseUIOptions.dialogOptions = dialogOptions;

      var deferred = this.baseDisplayForm(baseUIOptions);
      this.listenTo(this.metadataAddItemPropView, "update:button", _.bind(function (args) {
        this.dialog && this.dialog.trigger("update:button", args);
      }, this));

      return deferred;
    },

    // private
    _addItem: function (args) {
      function updateButtons(dialog, attributes) {
        if (dialog && dialog.footerView) {
          dialog.footerView.getButtons().forEach(function (buttonView) {
            buttonView.updateButton(attributes);
          });
        }
      }

      if (!!args.view.metadataPropertiesView.allFormsRendered) {
        var enable = false;
        if (args.callerProcessData !== true) {
          updateButtons(this.dialog, {disabled: true});
          enable = true;
        }
        var valid = this.metadataAddItemPropView.validate();
        if (valid) {
          var data = this.metadataAddItemPropView.getValues();

          if (args.callerProcessData === true) {
            this.dialog.destroy();
            this.deferred.resolve({data: data});
          } else {
            var metadataController = this.metadataController ||
                                     new MetadataController();

            this.metadataAddItemPropView.blockActions();
            enable = false;
            metadataController.createItem(this.node, data)
                .done(_.bind(function (resp) {
                  this.listenToOnce(this.dialog, "hide", function () {
                    this.metadataAddItemPropView.unblockActions();
                    updateButtons(this.dialog, {disabled: false});
                  });
                  this.dialog.destroy();
                  this.deferred.resolve({name: data.name});
                }, this))
                .fail(_.bind(function (resp) {
                  this.metadataAddItemPropView.unblockActions();
                  var error = lang.failedToCreateItem;
                  if (resp) {
                    if (resp.responseJSON && resp.responseJSON.error) {
                      error = resp.responseJSON.error;
                    } else if (resp.responseText) {
                      error = resp.responseText;
                    }
                    ModalAlert.showError(error);
                  }
                  updateButtons(this.dialog, {disabled: false});
                }, this));
          }
        }
        if (enable) {
          updateButtons(this.dialog, {disabled: false});
        }
      }
    }

  });

  _.extend(MetadataAddItemController, {version: "1.0"});

  return MetadataAddItemController;

});

csui.define('csui/widgets/metadata/impl/metadata.navigation.list.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  // This behavior implements a default keyboard navigation for the metadata navigation list.

  var TabPosition = {
    none: -1,
    header: 0,
    list: 1
  };

  var MetadataNavigationListKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function MetadataNavigationListKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'click:item', function (item) {
        // clear the currently focused element
        var selIndex = view.selectedIndex;
        var selectedElem = view.selectedIndexElem(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        // set the new element tabindex
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
      });

      _.extend(view, {

        _focusHeader: function () {
          if (this.headerFocusable === true && this.headerElement) {
            this.currentTabPosition = TabPosition.header;
            return $(this.ui.header);
          }
          return undefined;
        },

        _focusList: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          this.currentTabPosition = TabPosition.list;
          return this.getSelectedItem().$el;
        },

        _setFocus: function () {
          if (this.headerFocusable === true && this.headerElement) {
            return this._focusHeader();
          } else {
            return this._focusList();
          }
        },

        _headerIsInFocus: function () {
          return this.$(this.ui.header).is(":focus");
        },

        _listIsInFocus: function () {
          var inFocus = false;
          var i;
          for (i = 0; i < this.collection.length; i++) {
            var $elem = this.selectedIndexElem(i);
            if ($elem && $elem.is(":focus")) {
              inFocus = true;
              break;
            }
          }

          return inFocus;
        },

        _checkFocusAndSetCurrentTabPosition: function () {
          if (this._headerIsInFocus()) {
            this.currentTabPosition = TabPosition.header;
          } else if (this._listIsInFocus()) {
            this.currentTabPosition = TabPosition.list;
          } else {
            this.currentTabPosition = TabPosition.none;
          }
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function () {
          if (this.headerFocusable === true) {
            $(this.ui.header).prop('tabindex', '0');
          }
          this.getSelectedItem() && this.getSelectedItem().$el.prop('tabindex', '0');
        },

        currentlyFocusedElement: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          this._setFirstAndLastFocusable();
          if (event && event.shiftKey) {
            return this._focusList();
          }
          // maintain old position
          if (this.currentTabPosition === TabPosition.header) {
            return this._focusHeader();
          } else if (this.currentTabPosition === TabPosition.list) {
            return this._focusList();
          } else {
            return this._setFocus();
          }
        },

        _resetFocusedListElem: function () {
          // workaround the general behaviors that it keeps the old focus
          // reset focus back to the active list item before moving out of the region
          var selIndex, selectedElem;

          // clear the currently focused element
          selIndex = this.selectedIndex;
          selectedElem = this.selectedIndexElem(selIndex);
          selectedElem && selectedElem.prop('tabindex', '-1');

          // set to the active element
          selIndex = this.getSelectedIndex();
          selectedElem = this.selectedIndexElem(selIndex);
          if (selectedElem) {
            selectedElem.prop('tabindex', '0');
            this.selectedIndex = selIndex;
          }

          // always have the header focusable
          $(this.ui.header).prop('tabindex', '0');
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();
          // this.trigger('changed:focus', this);
          setTimeout(_.bind(function () {
            $preElem && $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
            $elem.focus();
          }, this), 50);
        },

        onKeyInView: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          if (event.keyCode === 9) {
            // tab
            if (event.shiftKey) {  // shift tab -> activate previous region
              if (this.currentTabPosition === TabPosition.list &&
                  this.headerFocusable === true && this.headerElement) {
                if ($(this.ui.header).is(":visible")) {
                  this._moveTo(event, this._focusHeader());
                  this._resetFocusedListElem();
                }
              }
            } else {
              if (this.currentTabPosition === TabPosition.header) {
                if (this.$el.find(">.cs-content").is(":visible")) {
                  this._moveTo(event, this._focusList());
                }
              } else {
                setTimeout(_.bind(function () {
                  this._resetFocusedListElem();
                }, this), 50);
              }
            }
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space(32) or enter(13)
            if (this.currentTabPosition === TabPosition.header) {
              event.preventDefault();
              event.stopPropagation();
              this.clickBack();
            } else if (this.currentTabPosition === TabPosition.list) {
              event.preventDefault();
              event.stopPropagation();
              this.selectAt(this.selectedIndex);
            }
          }
        },

        onKeyDown: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          if (this.currentTabPosition !== TabPosition.list) {
            this.onKeyInView(event);
            return;
          }

          var selIndex = this.selectedIndex;
          if (selIndex < 0 || selIndex === undefined) {
            selIndex = this.getSelectedIndex();
          }
          var $preElem = this.selectedIndexElem(selIndex);

          switch (event.which) {
          case 33: // page up
            this._moveTo(event, this._selectFirst(), $preElem);
            break;
          case 34: // page down
            this._moveTo(event, this._selectLast(), $preElem);
            break;
          case 38: // up
            this._moveTo(event, this._selectPrevious(), $preElem);
            break;
          case 40: // down
            this._moveTo(event, this._selectNext(), $preElem);
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirst: function () {
          this.selectedIndex = 0;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectLast: function () {
          this.selectedIndex = this.collection.length - 1;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectNext: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex < this.collection.length - 1) {
            this.selectedIndex++;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectPrevious: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        selectAt: function (index) {
          if (index >= this.collection.length || index < 0) {
            return;
          }
          var $elem = this.selectedIndexElem(index);
          $elem && $elem.click();
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('MetadataNavigationListKeyboardBehavior::refreshTabableElements ' +
                view.constructor.name) &&
      console.log(log.last);
      if (view.options.data.back_button) {
        this.view.headerFocusable = true;
        this.view.headerElement = view.ui.header;
      }
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

  return MetadataNavigationListKeyboardBehavior;
});

csui.define('csui/widgets/metadata/impl/metadata.navigation.list.view',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/list/simplelist.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.keyboard.behavior',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/models/version',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, $,
    SimpleListView,
    TabableRegionBehavior,
    MetadataNavigationListKeyboardBehavior,
    NodeTypeIconView,
    VersionModel,
    lang) {

  var MetadataNavigationListView = SimpleListView.extend({

    childViewOptions: function (model) {
      return {
        templateHelpers: function () {
          var nameAttribute = this.options.nameAttribute || 'name';
          return {enableIcon: true, name: this.model.get(nameAttribute)};
        },
        nameAttribute: this.options.data.nameAttribute
      };
    },

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      },
      MetadataNavigationListKeyboardBehavior: {
        behaviorClass: MetadataNavigationListKeyboardBehavior
      }
    },

    constructor: function MetadataNavigationListView(options) {
      this.events = _.extend({}, SimpleListView.prototype.events, this.events);
      SimpleListView.apply(this, arguments);

      // Do not use childEvents, because SimpleListView does it and our property
      // would overwrite their value and disable their event handlers
      this.listenTo(this, 'childview:render', this.onRenderItem);
      this.listenTo(this, 'childview:before:destroy', this.onBeforeDestroyItem);
    },

    onRenderItem: function (childView) {
      // for version metadata, show the version number in place of the icon
      if (childView.model instanceof VersionModel) {
        var verNum = childView.model.get('version_number_name');
        $(childView.$('.csui-type-icon').get(0)).append(
            "<span title='" + verNum + "' class='list-item-version'>" + verNum + "</span>"
        );
      } else {
        childView._nodeIconView = new NodeTypeIconView({
          el: childView.$('.csui-type-icon').get(0),
          node: childView.model
        });
        childView._nodeIconView.render();
        // Checking for ThumbnailView
        if (this.options.originatingView && this.options.originatingView.thumbnailView) {
          this.$el.addClass("csui-metadata-navigation-thumbnail");
          var nodeUrl = childView.model && childView.model.thumbnail &&
                        childView.model.thumbnail.url;
          if (nodeUrl) {
            childView._nodeIconView.$el.find('.csui-icon').css('background-image',
                'url(' + nodeUrl + ')');
          }
        }
        else {
          this.$el.find(".csui-metadata-navigation-thumbnail").removeClass(
              "csui-metadata-navigation-thumbnail");
        }
      }

      // show a red star if the model has enforced required attribute
      var show_required = this.options.data && this.options.data.show_required === true;
      var enforcedRequire = childView.model && childView.model.options &&
                            childView.model.options.enforcedRequiredAttrs === true;
      if (show_required && enforcedRequire) {
        var titleEl = childView.$('.list-item-title').get(0);
        if (titleEl) {
          var cssClasses, tooltip;
          if (childView.model.validated === true) {
            // change the star to green checkmark if the model passed validation
            cssClasses = 'cs-icon-required category_required_done';
            tooltip = lang.requiredPassedTooltip;
          } else {
            //show red star icon for required attributes to be filled
            cssClasses = 'cs-icon-required category_required';
            tooltip = lang.requiredTooltip;
          }
          $(titleEl).before("<span class='" + cssClasses + "' alt='" + tooltip +
                            "' title='" + tooltip + "'></span>");
        }
      }
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }

  });

  return MetadataNavigationListView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/common/metadata.action.multiple.items',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"metadata-wrapper binf-col-md-12\">\r\n  <div class=\"metadata-navigation\">\r\n    <div class=\"metadata-sidebar\"></div>\r\n    <div class=\"metadata-content\"></div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_common_metadata.action.multiple.items', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/metadata/impl/metadata.navigation.list.behavior',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, $, Backbone, Marionette) {
  'use strict';

  // This behavior provides shared functionality for the metadata navigation list.

  var MetadataNavigationListBehavior = Marionette.Behavior.extend({

    constructor: function MetadataNavigationListBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      _.extend(view, {

        onBeforeShow: function () {
          this._showChildViews();
        },
        onShow: function () {
          this._showScrollPosition();
        },
        onBeforeDestroy: function () {
          if (this.mdv && this.mdv.internal) {
            this.mdv.destroy();
          }
          if (this.mdn) {
            this.mdn.destroy();
          }
        },

        _showChildViews: function () {
          this.navigationRegion.show(this.mdn);
          this.contentRegion.show(this.mdv);
        },

        _showScrollPosition: function () {
          if (this.initiallySelected instanceof Backbone.Model) {
            var index = this.mdn.collection.findIndex({id: this.initiallySelected.get('id')});
            (index < 0 || index > this.mdn.collection.length - 1) && (index = 0);
            return this.mdn.setSelectedIndex(index);
          } else if (this.initiallySelected && this.initiallySelected.length > 0) {
            var firstSelected = this.initiallySelected.models[0];
            var selIndex = this.mdn.collection.indexOf(firstSelected);
            this.mdn.setSelectedIndex(selIndex);
          } else {
            if (this.mdn.collection.models.length > 0) {
              this.mdn.setSelectedIndex(0);
            }
          }

        }
      });

    } // constructor

  });

  return MetadataNavigationListBehavior;
});


csui.define('css!csui/widgets/metadata/impl/common/metadata.action.multiple.items',[],function(){});
csui.define('csui/widgets/metadata/impl/common/metadata.action.multiple.items.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/widgets/metadata/impl/metadata.navigation.list.view',
  'csui/widgets/metadata/metadata.action.one.item.properties.view',
  'hbs!csui/widgets/metadata/impl/common/metadata.action.multiple.items',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadata.navigation.list.behavior', "csui/lib/jsonpath",
  'css!csui/widgets/metadata/impl/common/metadata.action.multiple.items'
], function (_, Backbone, Marionette, MetadataNavigationListView,
    MetadataActionOneItemPropertiesView, template, LayoutViewEventsPropagationMixin,
    MetadataNavigationListBehavior, jsonPath) {

  var MetadataActionMultipleItemsView = Marionette.LayoutView.extend({

    className: 'cs-metadata-add-items',
    template: template,

    regions: {
      navigationRegion: ".metadata-sidebar",
      contentRegion: ".metadata-content"
    },

    behaviors: {
      MetadataNavigationListBehavior: {
        behaviorClass: MetadataNavigationListBehavior
      }
    },

    constructor: function MetadataActionMultipleItemsView(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.collection = options.collection;
      this.container = options.container;
      this.context = options.context;
      this.originatingView = options.originatingView;
      this.initiallySelected = this.options.selected;
      this.commonCategories = options.commonCategories;
      this.initialFormData = options.initialFormData;
      this.requiredFields = [];

      var initiallySelectedModel = this._getInitiallySelectedModel();
      if (options.applyFlag) {
        initiallySelectedModel.set("applyFlag", options.applyFlag);
      }

      this.mdv = new MetadataActionOneItemPropertiesView({
        model: initiallySelectedModel,
        container: this.container,
        context: this.context,
        commands: options.commands,
        originatingView: this.originatingView,
        action: options.action,
        inheritance: options.inheritance
      });
      this.mdv.internal = true;
      this._subscribeToMetadataViewEvents();

      this.mdn = new MetadataNavigationListView({
        collection: options.collection,
        data: {
          back_button: false,
          title: '',
          show_required: true
        }
      });
      //Set the Initial categories to all uploadable files
      if (options.applyFlag) {
        this.setInitialCategories();
      }
      this.listenTo(this.mdn, 'click:item', this.onClickItem);
      this.listenTo(this.mdn, 'click:back', this.onClickBack);
      this.listenTo(this.mdn, 'show:node', function (args) {
        this._showNode(args.model);
      });
      this.propagateEventsToRegions();
    },

    _getInitiallySelectedModel: function () {
      if (this.initiallySelected && this.initiallySelected.length > 0) {
        return this.initiallySelected.models[0];
      } else if (this.collection && this.collection.length > 0) {
        return this.collection.models[0];
      } else {
        return null;
      }
    },

    onClickItem: function (item) {
      var valid = this.validateAndSetValuesToNode();
      if (valid) {
        this._showNode(item.model);
      } else {
        item.cancelClick = true;
      }
    },

    // set initial category values to all Alpaca forms
    setInitialCategories: function () {
      var that = this;
      _.each(this.mdn.collection.models, function (model) {
        var fileAttr = {};
        if (model.get("data") === undefined) {
          fileAttr.advanced_versioning = false;
          fileAttr.name = model.get("newName") || model.get("name");
          fileAttr.mime_type = model.get("mime_type");
          fileAttr.type = model.get("type") || 144;
          fileAttr.parent_id = this.mdv.options.container.get("id");
          _.extend(fileAttr, JSON.parse(JSON.stringify(that.commonCategories)));
        }
        model.set('data', fileAttr);
      }, this);

    },

    getRequiredFields: function () {
      var formValues = {},
          that       = this;
      that.requiredFields = [];
      if (this.initialFormData && this.initialFormData.models) {
        _.each(this.initialFormData.models, function (tab, key) {
          var values   = tab.get("data"),
              roleName = tab.get("role_name"),
              options  = tab.get('options'),
              schema   = tab.get('schema'),
              roles, role, category;

          if (values) {
            if (roleName) {
              roles = formValues.roles || (formValues.roles = {});
              role = roles[roleName] || (roles[roleName] = {});
              if (roleName === 'categories') {
                var requiredFields = jsonPath(schema, "$..[?(@.required===true)]",
                    {resultType: "PATH"});
                var nonValidateFields = jsonPath(options, "$..[?(@.validate===false)]",
                    {resultType: "PATH"});

                // getting field id for non validate fields
                var nonValidateFieldsIds = [];
                _.each(nonValidateFields, function (nvField) {
                  var matches = nvField.toString().match(/(\'[\w]*\')/g);
                  if (!!matches) {
                    nonValidateFieldsIds.push(matches[matches.length - 1].replace(/'/g, ""));
                  }
                });

                // getting field id for Required Fields
                var reqFieldId = [];
                _.each(requiredFields, function (reqField) {
                  var matches = reqField.toString().match(/(\'[\w]*\')/g);
                  if (!!matches) {
                    reqFieldId.push(matches[matches.length - 1].replace(/'/g, ""));
                  }
                });

                // eliminating non validating fields from required field ids.
                reqFieldId = reqFieldId.filter(function (n) {
                  // Eliminate if validation not required.
                  return nonValidateFieldsIds.indexOf(n) === -1;
                });
                if (reqFieldId.length > 0) {
                  that.requiredFields.push(reqFieldId);
                }
              }
            }
          }
        });
      }
    },

    validateAndSetValuesToAllNode: function () {
      var that           = this,
          requiredFields = {},
          valid          = true;
      var formsValid = true;
      this.getRequiredFields();
      _.each(this.mdn.collection.models, _.bind(function (form) {
        var data = form.get('data');
        _.each(data.roles.categories, function (category) {
          valid = valid && that._checkForAlpacaRequiredFields(form, category);
        });
        form.validated = valid;
        formsValid = formsValid && valid;
      }, this));
      return formsValid;
    },

    // private
    _checkForAlpacaRequiredFields: function (form, category) {
      var valid    = true,
          reqArray = [];
      if (!!this.requiredFields) {
        var nullCount = false;
        _.each(this.requiredFields, function (arrayElement) {
          reqArray = jsonPath(category, "$.." + arrayElement.toString(),
              {resultType: "PATH"}.toArray);
          _.each(reqArray, function (arrayElement) {
            var checkNull = function (element) {
              if (element instanceof Array && (element !== null || element !== "")) {
                _.each(element, function (childElement) {
                  checkNull(childElement);
                });
              } else if (element === null || element === "") {
                nullCount = true;
                return;
              }
            };
            if (!nullCount) {
              checkNull(arrayElement);
            } else {
              valid = false;
              return;
            }
          });
          if (nullCount) {
            valid = false;
            return;
          }
        });
      }
      return valid;
    },

    // public: validate the current form and set values to node if valid.
    //         returns true if form is valid; otherwise, false.
    validateAndSetValuesToNode: function () {
      var item = this.mdn.getSelectedItem();
      var valid = this.mdv.validate();
      if (valid) {
        var data = this.mdv.getValues();
        // store the newly added categories data
        if (item.model.newCategories.models.length > 0) {
          _.each(item.model.newCategories.models, function (catModel) {
            var catId = catModel.get('id');
            var roleName = catModel.get('role_name');
            var catData = {};
            if (data && data.roles && data.roles[roleName]) {
              catData = data.roles[roleName];
            }
            if (_.isEmpty(catData[catId]) === false) {
              _.each(catModel.attributes.data, function (iValue, iKey) {
                if (_.has(catData[catId], iKey)) {
                  catModel.attributes.data[iKey] = catData[catId][iKey];
                }
              });
            }
          });
        }
        item.model.validated = true;
        item.model.set('data', data);  // intentionally trigger the set to redraw list item
        return true;
      }
      if (!!this.mdv.metadataPropertiesView.allFormsRendered) {
        item.model.validated = false;
        item.model.trigger('change', item.model); // intentionally trigger the set to redraw list item
      }
      return false;
    },

    onClickBack: function () {
      this.trigger("metadata:close", {sender: this});
    },

    onItemNameChanged: function (newName) {
      var selectedItem  = this.mdn.getSelectedItem(),
          selectedIndex = this.mdn.getSelectedIndex();

      selectedItem.render(); // name has been set silently
      this.mdn.setSelectedIndex(selectedIndex);
    },

    _showNode: function (model) {
      if (this.mdv && this.mdv.internal) {
        this.mdv.destroy();
      }
      model.set("applyFlag", this.options.applyFlag);
      this.mdv = new MetadataActionOneItemPropertiesView({
        model: model,
        container: this.container,
        context: this.context,
        originatingView: this.originatingView,
        action: this.options.action,
        inheritance: this.options.inheritance
      });
      this.mdv.internal = true;
      this._subscribeToMetadataViewEvents();
      this.contentRegion.show(this.mdv);
    },

    _subscribeToMetadataViewEvents: function () {
      this.listenTo(this.mdv, 'metadata:close',
          _.bind(function () {
            this.trigger("metadata:close", {sender: this});
          }, this));
      this.listenTo(this.mdv, 'item:name:changed', _.bind(this.onItemNameChanged, this));
    }

  });

  _.extend(MetadataActionMultipleItemsView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataActionMultipleItemsView;

});

csui.define('csui/widgets/metadata/impl/add.items/metadata.add.multiple.docs.controller',["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/models/node/node.model", "csui/controls/dialog/dialog.view",
  "csui/widgets/metadata/impl/common/metadata.action.multiple.items.view",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/dialogs/modal.alert/modal.alert",
  'csui/utils/commands',
  "css!csui/widgets/metadata/impl/metadata", "csui/utils/deepClone/deepClone"
], function (_, BaseMetadataActionView, NodeModel, DialogView,
    MetadataActionMultipleItemsView, lang, ModalAlert, commands) {

  function MetadataAddMultipleDocsController() {
  }

  _.extend(MetadataAddMultipleDocsController.prototype, BaseMetadataActionView.prototype, {

    // public
    displayForm: function (status, options) {

      var applyFlag        = false,
          commonCategories = this._getCommonCategories(options);
      if (options.initialFormData && options.initialFormData.models &&
          options.initialFormData.models.length > 1) {
        applyFlag = true;
      }
      this.metadataAddItems = new MetadataActionMultipleItemsView({
        container: options.container,
        collection: status.nodes,
        selected: status.nodes,
        action: 'create',
        originatingView: options.originatingView,
        context: options.context,
        commands: commands,
        commonCategories: commonCategories,
        applyFlag: applyFlag,
        initialFormData: options.initialFormData
      });

      this.listenTo(this.metadataAddItems, "metadata:add", _.bind(function () {
        this.deferred.resolve();
      }, this));

      var baseUIOptions = {};
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = this.metadataAddItems;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.addDocumentMetadataDialogTitle;
      dialogOptions.OkButtonTitle = options.addButtonTitle ? options.addButtonTitle :
                                    lang.addDocumentMetadataDialogAddButtonTitle;
      dialogOptions.OkButtonClick = this._addItems;
      baseUIOptions.dialogOptions = dialogOptions;

      return this.baseDisplayForm(baseUIOptions);

    },

    _getCommonCategories: function (options) {
      var formValues = {},
          that       = this;
      if (options.initialFormData && options.initialFormData.models) {
        _.each(options.initialFormData.models, function (tab, key) {
          var values   = tab.get("data"),
              roleName = tab.get("role_name"),
              options  = tab.get('options'),
              schema   = tab.get('schema'),
              roles, role, category;

          if (values) {
            if (roleName) {
              roles = formValues.roles || (formValues.roles = {});
              role = roles[roleName] || (roles[roleName] = {});
              if (roleName === 'categories') {
                // For categories, merge the properties to the
                // roles.categories.<category_id> object
                var catId = tab.get("id").toString();
                category = role[catId] || (role[catId] = {});
                // when attributes are not set, the server deletes
                // the category unless it is set to null
                if (_.isEmpty(values)) {
                  category = null;
                } else {
                  //Replace null values with empty string
                  values = JSON.parse(JSON.stringify(values).replace(/null/g, "\"\""));
                  _.extend(category, values);
                }
              } else {
                // With a role defined, merge the properties to the
                // roles.<role_name> object
                //TODO: uncomment this once classifications are displayed on upload dialog
                //_.extend(role, values);
              }
            }
          }
        });
      }
      return formValues;
    },

    // private
    _addItems: function (args) {
      if (args.view.mdv && args.view.mdv.metadataPropertiesView &&
          args.view.mdv.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItems.validateAndSetValuesToNode();
        if (valid) {
          //generic error handling for all modules
          this.options.view.$el.find(".cs-formfield-invalid").removeClass('cs-formfield-invalid');
          var allValid = true;
          this.metadataAddItems.validateAndSetValuesToAllNode();
          this.metadataAddItems.collection.forEach(function (model) {
            allValid = allValid && (model.validated ? true : false);
          });
          if (allValid) {
            this.metadataAddItems.collection.forEach(function (model) {
              var data = model.get('data');
              var item = model.get('fileObject');
              var extended_data = model.get('extended_data');
              if (data && item) {
                item.set('newName', data.name);
                var extendedData = {};
                if (data.description !== undefined) {
                  extendedData.description = data.description;
                }
                if (data.advanced_versioning !== undefined) {
                  extendedData.advanced_versioning = data.advanced_versioning;
                }
                if (data.roles) {
                  extendedData.roles = _.deepClone(data.roles);
                }
                if (_.isEmpty(extendedData) === false) {
                  _.extend(extended_data, extendedData);
                }
              }
            });
            this.dialog.destroy();
            this.deferred.resolve();
          } else {
            var title = lang.addDocumentMetadataDialogTitle;
            var message = lang.missingRequiredMetadataForDocuments;
            ModalAlert.showError(message, title);
          }
        } else {
          //generic error handling for all modules
          this.options.view.$el.find(".binf-has-error .cs-formfield").addClass(
              'cs-formfield-invalid');
        }
      }
    }

  });

  _.extend(MetadataAddMultipleDocsController, {version: "1.0"});

  return MetadataAddMultipleDocsController;

});

csui.define('csui/widgets/metadata/metadata.add.document.controller',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
  "csui/models/nodes", "csui/models/node/node.model",
  "csui/widgets/metadata/metadata.add.item.controller", "csui/widgets/metadata/impl/metadata.utils",
  "csui/widgets/metadata/impl/add.items/metadata.add.multiple.docs.controller",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/utils/deepClone/deepClone"
], function (_, $, Backbone, NodeCollection, NodeModel, MetadataAddItemController, MetadataUtils,
    MetadataAddMultipleDocsController, lang) {
  'use strict';

  function MetadataAddDocumentController() {
  }

  _.extend(MetadataAddDocumentController.prototype, Backbone.Events, {

    //
    // Public: check for enforced required metadata and show the metadata view if true
    //
    addItemsRequiredMetadata: function (fileUploadCollection, options) {
      var deferred      = $.Deferred(),
          fileModels    = fileUploadCollection.models,
          file          = _.find(fileUploadCollection.models, function (fileUploadModel) {
                return fileUploadModel.get('newVersion') === undefined;
              }) || fileModels[0],
          tempName      = fileModels.length > 0 ? file.get('file').name : 'temp_name',
          utilOptions   = {
            action: 'create',
            addableType: options.addableType,
            name: tempName,
            container: options.container,
            docParentId: fileModels.length > 0 ? file.get('id') : null
          },
          metadataUtils = new MetadataUtils(),
          newFiles      = $.grep(fileUploadCollection.models, function (fileUploadModel) {
            return fileUploadModel.get('newVersion') === undefined;
          }); //Collection might contain new versions of existing items, remove such items

      metadataUtils.ContainerHasEnforcedEmptyRequiredMetadata(utilOptions)
          .done(_.bind(function (resp) {
            if (resp.hasRequiredMetadata === true) {
              var metadataDeferred = $.Deferred();

              if (newFiles && newFiles.length === 1) {
                // add one item with required metadata
                metadataDeferred = this._addOneItemWithRequiredMetadata(newFiles,
                    options);
              } else if (newFiles && newFiles.length > 1) {
                // add multiple items with required metadata
                if (resp.initialFormData) {
                  options.initialFormData = resp.initialFormData;
                }
                metadataDeferred = this._addMultipleItemsWithRequiredMetadata(newFiles,
                    options);
              } else {
                deferred.reject();
              }

              metadataDeferred.done(function (resp) {
                deferred.resolve(resp);
              }).fail(function (error) {
                deferred.reject(error);
              });

            } else {
              // no required metadata: resolve and let the caller code proceed with add item as normal
              deferred.resolve({});
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: create a node collection from the items array
    _makeNodeCollectionFromItems: function (items, options) {
      var nodes = new NodeCollection();
      if (items && items.length > 0) {
        _.each(items, function (item) {
          var file = item.get('file');
          var node = new NodeModel({
            name: item.get('newName') || file.name,
            type: item.get('type') || 144,
            size: file.size,
            mime_type: file.type,
            fileObject: item,
            extended_data: item.get('extended_data')
          }, {
            connector: options.container.connector
          });
          _.extend(node.options, {
            enforcedRequiredAttrs: true
          });
          nodes.add(node, {silent: true});
        }, this);
      }
      return nodes;
    },

    // Private: add one item with required metadata
    _addOneItemWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var status = {
        nodes: nodes,
        container: options.container,
        context: options.context
      };
      var cmdOptions = {
        callerProcessData: true,
        dialogTitle: lang.addDocumentMetadataDialogTitle,
        addButtonTitle: lang.addDocumentMetadataDialogAddButtonTitle,
        cancelButtonActionToken: "cancelAddOneItemWithRequiredMetadata"
      };

      // show add item metadata view
      var metadataAddItemController = new MetadataAddItemController();
      metadataAddItemController
          .displayForm(status, cmdOptions)
          .done(function (resp) {
            var item = items[0];
            item.set('newName', resp.data.name);

            var extendedData = {};
            if (resp.data.description !== undefined) {
              extendedData.description = resp.data.description;
            }
            if (resp.data.advanced_versioning !== undefined) {
              extendedData.advanced_versioning = resp.data.advanced_versioning;
            }
            if (resp.data.roles) {
              extendedData.roles = _.deepClone(resp.data.roles);
            }
            if (_.isEmpty(extendedData) === false) {
              item.set('extended_data', extendedData);
            }

            deferred.resolve();
          })
          .fail(function (args) {
            var error = (args && args.error) ? args.error : undefined;
            var userAction;

            if (args && args.buttonAttributes) {
              if (args.buttonAttributes.actionToken === "cancelAddOneItemWithRequiredMetadata") {
                userAction = "cancelAddOneItemWithRequiredMetadata";
              }
              else if (args.buttonAttributes.actionToken === "closeMetadataActionView") {
                userAction = "closeMetadataActionView";
              }
            }
            deferred.reject({error: error, userAction: userAction});
          });

      return deferred.promise();
    },

    // Private: add multiple items with required metadata
    _addMultipleItemsWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var cmdStatus = {nodes: nodes};

      var metadataAddMultipleDocsController = new MetadataAddMultipleDocsController();
      metadataAddMultipleDocsController
          .displayForm(cmdStatus, options)
          .done(function (resp) {
            deferred.resolve();
          })
          .fail(function () {
            deferred.reject();
          });

      return deferred.promise();
    }

  });

  MetadataAddDocumentController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataAddDocumentController, {version: "1.0"});

  return MetadataAddDocumentController;

});

csui.define('csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.one.item.controller',["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/widgets/metadata/impl/metadata.controller",
  "csui/widgets/metadata/metadata.action.one.item.properties.view",
  "csui/utils/commandhelper", "i18n!csui/widgets/metadata/impl/nls/lang",
  "csui/dialogs/modal.alert/modal.alert", 'csui/utils/commands',
  "css!csui/widgets/metadata/impl/metadata"
], function (_, BaseMetadataActionView, MetadataController,
    MetadataActionOneItemPropertiesView, CommandHelper, lang, ModalAlert, commands) {

  //
  // Metadata Copy/Move One Item Controller allows copying/moving of ONE item with complete metadata
  // that the user can edit and change values of general metadata, categories and other roles.
  //

  function MetadataCopyMoveOneItemController() {
  }

  _.extend(MetadataCopyMoveOneItemController.prototype, BaseMetadataActionView.prototype, {

    // public (usually called from the 'command' class that has 'status' and 'options' parameters)
    displayForm: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var node = nodes.length > 0 ? nodes.models[0] : null;

      this.node = node;

      var addItemView = this.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
        model: node,
        container: status.container,
        originatingView: options.originatingView,
        context: options.context,
        commands: commands,
        action: options.action,
        inheritance: options.inheritance
      });

      var baseUIOptions = {};
      baseUIOptions.callerProcessData = options.callerProcessData;
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = addItemView;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.defaultDialogTitle;
      dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                    lang.defaultDialogOkButtonTitle;
      dialogOptions.OkButtonClick = this._CopyMoveItem;
      baseUIOptions.dialogOptions = dialogOptions;

      var deferred = this.baseDisplayForm(baseUIOptions);

      return deferred;
    },

    // private
    _CopyMoveItem: function (args) {
      if (args.view.metadataPropertiesView && args.view.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItemPropView.validate();
        if (valid) {
          var data = this.metadataAddItemPropView.getValues();

          if (args.callerProcessData === true) {
            this.dialog.destroy();
            this.deferred.resolve({data: data});
          } else {
            var metadataController = new MetadataController();
            metadataController.createItem(this.node, data)
                .done(_.bind(function (resp) {
                  this.dialog.destroy();
                  this.deferred.resolve({name: data.name});
                }, this))
                .fail(function (resp) {
                  var error = lang.failedToCreateItem;
                  if (resp) {
                    if (resp.responseJSON && resp.responseJSON.error) {
                      error = resp.responseJSON.error;
                    } else if (resp.responseText) {
                      error = resp.responseText;
                    }
                    ModalAlert.showError(error);
                  }
                });
          }
        }
      }
    }

  });

  _.extend(MetadataCopyMoveOneItemController, {version: "1.0"});

  return MetadataCopyMoveOneItemController;

});

csui.define('csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.multiple.items.controller',["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/models/node/node.model", "csui/controls/dialog/dialog.view",
  "csui/widgets/metadata/impl/common/metadata.action.multiple.items.view",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/dialogs/modal.alert/modal.alert",
  "css!csui/widgets/metadata/impl/metadata", "csui/utils/deepClone/deepClone"
], function (_, BaseMetadataActionView, NodeModel, DialogView,
    MetadataActionMultipleItemsView, lang, ModalAlert) {

  function MetadataCopyMoveMultipleItemsController() {
  }

  _.extend(MetadataCopyMoveMultipleItemsController.prototype, BaseMetadataActionView.prototype, {

    // public
    displayForm: function (status, options) {

      this.metadataAddItems = new MetadataActionMultipleItemsView({
        container: options.container,
        collection: status.nodes,
        selected: status.nodes,
        originatingView: options.originatingView,
        context: options.context,
        action: options.action,
        inheritance: options.inheritance
      });

      this.listenTo(this.metadataAddItems, "metadata:add", _.bind(function () {
        this.deferred.resolve();
      }, this));

      var baseUIOptions = {};
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = this.metadataAddItems;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.defaultDialogTitle;
      dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                    lang.defaultDialogOkButtonTitle;
      dialogOptions.OkButtonClick = this._CopyMoveItems;
      baseUIOptions.dialogOptions = dialogOptions;

      return this.baseDisplayForm(baseUIOptions);

    },

    // private
    _CopyMoveItems: function (args) {
      if (args.view.mdv && args.view.mdv.metadataPropertiesView &&
          args.view.mdv.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItems.validateAndSetValuesToNode();
        if (valid) {
          var allValid = true;
          this.metadataAddItems.collection.forEach(function (model) {
            var modelValid = model.options.enforcedRequiredAttrs === true ?
                             (model.validated ? true : false ) : true;
            allValid = allValid && modelValid;
          });
          if (allValid) {
            this.metadataAddItems.collection.forEach(function (model) {
              var data = model.get('data');
              var item = model.get('itemObject');
              if (data && item) {
                item.newName = data.name;
                var extendedData = {};
                if (data.description !== undefined) {
                  extendedData.description = data.description;
                }
                if (data.advanced_versioning !== undefined) {
                  extendedData.advanced_versioning = data.advanced_versioning;
                }
                if (data.roles) {
                  extendedData.roles = _.deepClone(data.roles);
                }
                if (_.isEmpty(extendedData) === false) {
                  item.extended_data = extendedData;
                }
              }
            });
            this.dialog.destroy();
            this.deferred.resolve();
          } else {
            var title = lang.defaultDialogTitle;
            var message = lang.missingRequiredMetadataForObjects;
            ModalAlert.showError(message, title);
          }
        }
      }
    }

  });

  _.extend(MetadataCopyMoveMultipleItemsController, {version: "1.0"});

  return MetadataCopyMoveMultipleItemsController;

});

csui.define('csui/widgets/metadata/metadata.copy.move.items.controller',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/models/nodes",
  "csui/models/node/node.model", "csui/widgets/metadata/impl/metadata.utils", "csui/models/actions",
  "csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.one.item.controller",
  "csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.multiple.items.controller",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/utils/deepClone/deepClone"
], function (_, $, Backbone, NodeCollection, NodeModel, MetadataUtils, ActionCollection,
    MetadataCopyMoveOneItemController, MetadataCopyMoveMultipleItemsController, lang) {

  function MetadataCopyMoveItemsController() {
  }

  _.extend(MetadataCopyMoveItemsController.prototype, Backbone.Events, {

    //
    // Public: copy/move one or multiple items with open metadata option
    //
    CopyMoveItemsWithMetadata: function (items, options) {
      return this.CopyMoveItemsRequiredMetadata(items, _.extend(options, {openMetadata: true}));
    },

    // private
    _copyMoveItemsWithMetadata: function (items, options) {
      var deferred = $.Deferred();
      var metadataDeferred = $.Deferred();

      if (items && items.length > 0) {
        options.id || (options.id = items[0].id);
        options.container || (options.container = options.targetFolder);
      }

      if (items && items.length === 1) {
        // copy/move one item with metadata
        metadataDeferred = this._copyMoveOneItemWithRequiredMetadata(items, options);
      } else if (items && items.length > 1) {
        // copy/move multiple items with metadata
        metadataDeferred = this._copyMoveMultipleItemsWithRequiredMetadata(items, options);
      } else {
        deferred.reject();
      }

      metadataDeferred.done(function (resp) {
        deferred.resolve();
      }).fail(function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },

    //
    // Public: check for enforced required metadata and show the metadata view if true
    //
    CopyMoveItemsRequiredMetadata: function (items, options) {
      if (!items || items.length < 1) {
        return $.Deferred().reject();
      }

      // 'original' does not need checking
      if (options.openMetadata !== true && options.inheritance === 'original') {
        return $.Deferred().resolve();
      }

      // latest PM decision is to deal only with 'destination'.  Option 'merged' is only for 1 item.
      if (options.openMetadata !== true && items.length > 1 && options.inheritance === 'merged') {
        return $.Deferred().resolve();
      }

      var deferred = $.Deferred();
      // talking the server developers, only need to check with one object
      var utilOptions = {
        action: options.action,
        inheritance: options.inheritance,
        items: items,
        container: options.targetFolder,
        context: options.context
      };
      var metadataUtils = new MetadataUtils();
      metadataUtils.ContainerHasEnforcedEmptyRequiredMetadataOnNodes(utilOptions)
          .done(_.bind(function (resp) {
            if ((resp.requiredMetadata && resp.enforcedItems && resp.enforcedItems.length > 0) ||
                options.openMetadata === true) {
              if (resp.requiredMetadata) {
                utilOptions = _.extend(utilOptions, {enforcedItems: resp.enforcedItems});
              }
              this._copyMoveItemsWithMetadata(items, utilOptions)
                  .done(function (resp) {
                    deferred.resolve(resp);
                  }).fail(function (error) {
                deferred.reject(error);
              });
            } else {
              // no required metadata: resolve and let the caller code proceed normally
              deferred.resolve();
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: create a node collection from the items array
    _makeNodeCollectionFromItems: function (items, options) {
      var nodes = new NodeCollection();
      if (items && items.length > 0) {
        _.each(items, function (item) {
          var enforcedRequiredAttrs = _.find(options.enforcedItems,
              function (enfItem) { return enfItem.id === item.id; }) === undefined ? false : true;
          var node = new NodeModel({
            id: item.id,
            name: item.newName || item.name,
            container: item.container,
            mime_type: item.mime_type,
            original_id: item.original_id,
            type: item.type,
            type_name: item.type_name,
            action: options.action,
            inheritance: options.inheritance,
            itemObject: item,
            size: item.size,
            size_formatted: (item.type === 144 || item.type === 749 || item.type === 736 ||
                             item.type === 30309) ? item.size_formatted : undefined
          }, {
            connector: options.container.connector
          });
          if (item.type === 140) { // for url object
            node.attributes.url = item.url;
          }
          _.extend(node.options, {
            original: item.original,
            enforcedRequiredAttrs: enforcedRequiredAttrs
          });
          node.original = item.original || node.original;
          node.actions = item.actions || new ActionCollection();
          nodes.add(node, {silent: true});
        }, this);
      }
      return nodes;
    },

    // Private: copy/move one item with required metadata
    _copyMoveOneItemWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();
      var nodes = this._makeNodeCollectionFromItems(items, options);
      var status = {
        nodes: nodes,
        container: options.container
      };
      var dialogTitle, okButtonTitle;
      if (options.action === 'copy') {
        dialogTitle = lang.copyOneItemMetadataDialogTitle;
        okButtonTitle = lang.copyItemsMetadataDialogButtonTitle;
      } else if (options.action === 'move') {
        dialogTitle = lang.moveOneItemMetadataDialogTitle;
        okButtonTitle = lang.moveItemsMetadataDialogButtonTitle;
      }
      dialogTitle = this._extendDialogTitle(dialogTitle, options.inheritance);

      var cmdOptions = {
        callerProcessData: true,
        action: options.action,
        context: options.context,
        inheritance: options.inheritance,
        originatingView: options.originatingView,
        dialogTitle: dialogTitle,
        okButtonTitle: okButtonTitle
      };

      // show copy/move one item metadata view
      var metadataCopyMoveOneItemController = new MetadataCopyMoveOneItemController();
      metadataCopyMoveOneItemController
          .displayForm(status, cmdOptions)
          .done(function (resp) {
            items[0].newName = resp.data.name;
            var extendedData = {};
            if (resp.data.description !== undefined) {
              extendedData.description = resp.data.description;
            }
            if (resp.data.advanced_versioning !== undefined) {
              extendedData.advanced_versioning = resp.data.advanced_versioning;
            }
            if (resp.data.roles) {
              extendedData.roles = _.deepClone(resp.data.roles);
            }
            if (_.isEmpty(extendedData) === false) {
              items[0].extended_data = extendedData;
            }

            deferred.resolve();
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: copy/move multiple items with metadata
    _copyMoveMultipleItemsWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var dialogTitle, okButtonTitle;
      if (options.action === 'copy') {
        dialogTitle = _.str.sformat(lang.copyMultipleItemsMetadataDialogTitle, items.length);
        okButtonTitle = lang.copyItemsMetadataDialogButtonTitle;
      } else if (options.action === 'move') {
        dialogTitle = _.str.sformat(lang.moveMultipleItemsMetadataDialogTitle, items.length);
        okButtonTitle = lang.moveItemsMetadataDialogButtonTitle;
      }
      dialogTitle = this._extendDialogTitle(dialogTitle, options.inheritance);

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var cmdStatus = {nodes: nodes};
      var cmdOptions = {
        action: options.action,
        inheritance: options.inheritance,
        container: options.container,
        context: options.context,
        originatingView: options.originatingView,
        dialogTitle: dialogTitle,
        okButtonTitle: okButtonTitle
      };
      var metadataCopyMoveMultipleItemsController = new MetadataCopyMoveMultipleItemsController();
      metadataCopyMoveMultipleItemsController
          .displayForm(cmdStatus, cmdOptions)
          .done(function (resp) {
            deferred.resolve();
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    // Private: extend the dialog title based on the inheritance
    _extendDialogTitle: function (dialogTitle, inheritance) {
      var extDialogTitle = dialogTitle;
      if (inheritance === 'original') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceOriginalProperties;
      } else if (inheritance === 'destination') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceDestinationProperties;
      } else if (inheritance === 'merged') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceMergedProperties;
      }
      return extDialogTitle;
    }

  });

  MetadataCopyMoveItemsController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataCopyMoveItemsController, {version: "1.0"});

  return MetadataCopyMoveItemsController;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"metadata-wrapper binf-col-md-12\">\r\n  <div class=\"metadata-navigation\">\r\n    <div class=\"metadata-sidebar\"></div>\r\n    <div class=\"metadata-content\"></div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_metadata_impl_metadatanavigation_impl_metadatanavigation', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/metadata/impl/metadatanavigation/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/metadata/impl/metadatanavigation/impl/nls/root/lang',{
  dialogTitle: 'Favorites',
  searchPlaceholder: 'Search Favorites',
  versionsTitle: 'Versions'
});



csui.define('css!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation',[],function(){});
// Shows a list of links to favorite nodes
csui.define('csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.view',
  'csui/widgets/metadata/metadata.view',
  'hbs!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/browsing.states', 'csui/utils/contexts/factories/next.node',
  'i18n!csui/widgets/metadata/impl/metadatanavigation/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation'
], function (_, Backbone, Marionette, TabableRegionBehavior, MetadataNavigationListBehavior,
    MetadataNavigationListView, MetadataView, template, LayoutViewEventsPropagationMixin,
    BrowsingStateCollectionFactory, NextNodeModelFactory, lang) {
  'use strict';

  //
  // Constructor options:
  // - showTitleIcon: boolean to show or hide the icon in the title bar
  //
  var MetadataNavigationView = Marionette.LayoutView.extend({

    className: 'cs-metadata',
    template: template,

    regions: {
      navigationRegion: ".metadata-sidebar",
      contentRegion: ".metadata-content"
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      },
      MetadataNavigationListBehavior: {
        behaviorClass: MetadataNavigationListBehavior
      }
    },

    constructor: function MetadataNavigationView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.collection = options.collection;
      this.container = options.container;
      this.containerCollection = options.containerCollection;
      this.context = options.context;
      this.originatingView = options.originatingView;
      this.showCloseIcon = options.showCloseIcon;
      this.initiallySelected = this.options.selected;
      this.selectedTab = options.selectedTab;
      this.selectedProperty = options.selectedProperty;
      this.showPermissionView = options.showPermissionView;
      // TODO: Put the title on the iterface (to options). New scenarios
      // should not be hardcoded here one after another.  The should
      // specify what they need on the interface.
      var title = options.container ? options.container.get('name') : '';
      if (!title && options.collection.length > 0 &&
          !!options.collection.models[0].collection.title) {
        title = options.collection.models[0].collection.title;
      }
      // for versions, use a static title
      if (Object.getPrototypeOf(options.collection).constructor.name === 'NodeVersionCollection') {
        title = lang.versionsTitle;
      }

      // Set toolbarItems from originating view to this.options, because when creating
      // MetadataView, this is used as originatingView and we want to use the toolbar or menu
      // items that are specified at the initial originatingView
      if (!this.options.toolbarItems && this.originatingView && this.originatingView.options &&
          this.originatingView.options.toolbarItems) {
        this.options.toolbarItems = this.originatingView.options.toolbarItems;
      }

      var initiallySelectedModel = this._getInitiallySelectedModel();
      this.mdv = (this.options.data && this.options.data.contentView) ?
                 this.options.data.contentView :
                 new MetadataView({
                   model: initiallySelectedModel,
                   container: this.container,
                   containerCollection: this.containerCollection,
                   collection: this.collection,
                   context: this.context,
                   originatingView: this,
                   metadataNavigationView: this,
                   isExpandedView: !!this.options.isExpandedView,
                   showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
                   selectedTab: this.selectedTab,
                   selectedProperty: this.selectedProperty,
                   showPermissionView: this.showPermissionView
                 });
      if (!this.options.data || !this.options.data.contentView) {
        this.mdv.internal = true;
      }

      this._subscribeToMetadataViewEvents();

      this.mdn = new MetadataNavigationListView({
        collection: options.collection,
        containerCollection: this.containerCollection,
        data: {
          back_button: (this.originatingView || this.containerCollection) ? true : false,
          title: title,
          nameAttribute: options.nameAttribute
        },
        originatingView: options.originatingView
      });
      this.listenTo(this.mdn, 'click:item', this.onClickItem);
      this.listenTo(this.mdn, 'click:back', this.onClickBack);
      this.listenTo(this.mdn, 'show:node', function (args) {
        this._showNode(args.model);
      });
      this.listenTo(this.mdv, 'disable:active:item', function (args) {
        this.mdn.$el.find('.binf-active').addClass('active-item-disable');
      }).listenTo(this.mdv, 'enable:active:item', function () {
        this.mdn.$el.find('.active-item-disable').removeClass('active-item-disable');
      });

      if (this.options.originatingView) {
        this.listenTo(this.options.originatingView, 'before:destroy', function () {
          this._closeMetadata();
        });
      }

      this.propagateEventsToRegions();
    },

    _getInitiallySelectedModel: function () {
      if (this.initiallySelected instanceof Backbone.Model) {
        var index = this.collection.findIndex({id: this.initiallySelected.get('id')});
        if (index < 0 || index > this.collection.length - 1) { return null; }
        return this.collection.at(index);
      } else if (this.initiallySelected && this.initiallySelected.length > 0) {
        return this.initiallySelected.models[0];
      } else if (this.collection && this.collection.length > 0) {
        return this.collection.models[0];
      } else {
        return null;
      }
    },

    onClickItem: function (item) {
      this._showNode(item.model);
    },

    onClickBack: function () {
      this._closeMetadata();
    },

    onItemNameChanged: function (newName) {
      var selectedItem  = this.mdn.getSelectedItem(),
          selectedIndex = this.mdn.getSelectedIndex();

      selectedItem.render(); // name has been set silently
      this.mdn.setSelectedIndex(selectedIndex);
    },

    _moveToNextItemAfterDeleteOrMove: function () {
      if (this.mdn.collection.length === 0) {
        this._closeMetadata();
      } else {
        var nextIndex = this.indexOfItemDeleteOrMove;
        nextIndex === this.mdn.collection.length && (nextIndex--);
        this.mdn.selectAt(nextIndex);
      }
    },

    onItemBeforeDelete: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
    },

    onItemDeleted: function (args) {
      this._moveToNextItemAfterDeleteOrMove();
    },

    onItemBeforeMove: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
      this.listenToOnce(this.containerCollection, 'remove', _.bind(this.onItemMoved, this));
    },

    onItemMoved: function (removedNode) {
      this.mdn.collection.remove(removedNode);
      this._moveToNextItemAfterDeleteOrMove();
    },

    _showNode: function (model) {
      var selectedTab = this.mdv.metadataTabView.tabLinks ?
                        this.mdv.metadataTabView.tabLinks.selected :
                        this.mdv.options.selectedTab ? this.mdv.options.selectedTab : "",
          activeTab   = this.mdv.metadataTabView.options.activeTab ?
                        this.mdv.metadataTabView.options.activeTab :
                        this.mdv.options.activeTab ? this.mdv.options.activeTab : "";
      if (this.mdv && this.mdv.internal) {
        this.mdv.destroy();
      }

      // clear browsingState version number because it is not applicable to the next node
      var browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      var browsingState = browsingStates && browsingStates.at(browsingStates.length - 1);
      if (browsingState && _.has(browsingState.attributes.path, 'version_num')) {
        delete browsingState.attributes.path.version_num;
      }

      this.mdv = new MetadataView({
        model: model,
        container: this.container,
        containerCollection: this.containerCollection,
        collection: this.collection,
        context: this.context,
        originatingView: this,
        metadataNavigationView: this,
        showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
        activeTab: activeTab,
        selectedTab: selectedTab,
        showPermissionView: this.showPermissionView
      });
      this.mdv.internal = true;

      this._subscribeToMetadataViewEvents();
      this.contentRegion.show(this.mdv);
    },

    onMetadataClose: function () {
      this._closeMetadata();
    },

    _closeMetadata: function () {
      var browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      browsingStates && (browsingStates.triggerStateChangeOnStateRemoval = true);
      this.trigger('metadata:close', {sender: this});

      if (!this.originatingView && this.containerCollection && this.containerCollection.node) {
        // there is no originatingView to go back; thus, go to the container
        var id = this.containerCollection.node.get('id');
        if (this.context && id !== undefined) {
          var nextNode = this.context.getModel(NextNodeModelFactory);
          if (nextNode) {
            if (nextNode.get('id') === id) {
              // when id is same as nextNode's id, nextNode.set(id) event is not triggered
              nextNode.unset('id', {silent: true});
            }
            nextNode.set('id', id);
          }
        }
      }
    },

    _subscribeToMetadataViewEvents: function () {
      this.listenTo(this.mdv, 'metadata:close', _.bind(function () {
        this._closeMetadata();
      }, this));
      this.listenTo(this.mdv, 'metadata:close:without:animation', _.bind(function () {
        this.trigger('metadata:close:without:animation', {sender: this});
      }, this));
      this.listenTo(this.mdv, 'item:name:changed', _.bind(this.onItemNameChanged, this));
      this.listenTo(this.mdv, 'metadata:item:before:delete', _.bind(function (args) {
        this.onItemBeforeDelete(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:deleted', _.bind(function (args) {
        this.onItemDeleted(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:before:move', _.bind(function (args) {
        this.onItemBeforeMove(args);
      }, this));
    }

  });

  _.extend(MetadataNavigationView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataNavigationView;

});

csui.define('csui/widgets/metadata.navigation/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/metadata.navigation/impl/nls/root/lang',{

  FetchNodeFailTitle: 'Error',
  FetchNodeFailMessage: 'Failed to fetch node "{0}". \n\n{1}'

});



csui.define('css!csui/widgets/metadata.navigation/impl/metadata.navigation',[],function(){});
csui.define('csui/widgets/metadata.navigation/metadata.navigation.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/progressblocker/blocker', 'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/children', 'csui/utils/contexts/factories/children2',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
  'csui/behaviors/default.action/impl/defaultaction', 'csui/dialogs/modal.alert/modal.alert',
  'i18n!csui/widgets/metadata.navigation/impl/nls/lang',
  'css!csui/widgets/metadata.navigation/impl/metadata.navigation'
], function (_, $, Backbone, Marionette, base, BlockingView, NodeModelFactory,
    ChildrenCollectionFactory, Children2CollectionFactory, NodesTableView,
    ViewEventsPropagationMixin, MetadataNavigationViewImpl, DefaultActionController,
    ModalAlert, lang) {
  'use strict';

  // TODO: remove this code when v1 and v2 browse call is finalized
  if (NodesTableView.useV2RestApi) {
    ChildrenCollectionFactory = Children2CollectionFactory;
  }

  //
  // Public: Metadata Navigation View
  // Description: view consists of the navigation list panel on the left and metadata view panel.
  //
  var MetadataNavigationView = Marionette.ItemView.extend({

    className: 'cs-metadata-navigation-wrapper',

    template: false,

    constructor: function MetadataNavigationView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.showCloseIcon = false;
      this.options = options;
      this.defaultActionController = new DefaultActionController();

      // Once PropertiesView is opened, 'OrginatingView' becomes metadataView or
      // MetadataNavigationview.
      // If  properties view page does not have navigationlist (eg for folders and wikipage) then
      // originating view becomes 'MetadataView' based on supportOriginatingView
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);

      // When this view is used alone on a perspective, if should offer
      // spinning sun to commands executed with it as originating view
      BlockingView.imbue(this);
    },

    onRender: function () {
      // don't render until the complete data have been fetched
      var fetching = this._ensureCompleteData();
      if (fetching) {
        return fetching.done(_.bind(this.render, this));
      }

      this.metadataNavigationView && this.metadataNavigationView.destroy();
      var mnv = this.metadataNavigationView = new MetadataNavigationViewImpl(this.options);
      this.propagateEventsToViews(this.metadataNavigationView);

      this.metadataNavigationView.render();
      Marionette.triggerMethodOn(mnv, 'before:show', mnv, this);
      this.$el.append(mnv.el);
      Marionette.triggerMethodOn(mnv, 'show', mnv, this);
    },

    onBeforeDestroy: function () {
      if (this.metadataNavigationView) {
        this.cancelEventsToViewsPropagation(this.metadataNavigationView);
        this.metadataNavigationView.destroy();
      }
    },

    _ensureCompleteData: function () {
      var self = this;
      var deferred;
      var options = this.options;
      if (!options.model || (!options.collection && !options.containerCollection)) {
        deferred = $.Deferred();
      }

      function ensureCollectionAfterModel() {
        self._ensureCollection()
            .always(function () {
              self.unblockActions();
            })
            .done(function (response) {
              deferred && deferred.resolve(response);
            })
            .fail(function (error) {
              deferred && deferred.reject(error);
            });
      }

      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
        options.selected = options.model;
        self.blockActions();
        options.model.ensureFetched()
            .done(function (response) {
              ensureCollectionAfterModel();
            })
            .fail(function (error) {
              self.unblockActions();
              self._showFetchNodeFailMessage(error, options.model.get("id"));
              deferred && deferred.reject(error);
            });
      } else if (!options.collection || !options.containerCollection) {
        options.selected = options.model;
        self.blockActions();
        ensureCollectionAfterModel();
      }

      return deferred && deferred.promise();
    },

    _ensureCollection: function () {
      var self = this;
      var deferred = $.Deferred();
      var options = this.options;

      var collection = options.collection || options.containerCollection;
      if (!collection) {
        options.container = options.context.getModel(NodeModelFactory, {
          attributes: {id: options.model.get('parent_id')},
          temporary: true
        });
        options.container.ensureFetched()
            .done(function (response) {
              collection = options.context.getCollection(
                  ChildrenCollectionFactory, {
                    options: {
                      node: options.container,
                      commands: self.defaultActionController.commands,
                      defaultActionCommands: self.defaultActionController.actionItems.getAllCommandSignatures(
                          self.defaultActionController.commands),
                      delayRestCommands: false
                    }

                  });
              collection.ensureFetched()
                  .done(function (response2) {
                    self._ensureModelInCollection(collection);
                    deferred && deferred.resolve(response2);
                  })
                  .fail(function (error2) {
                    self.unblockActions();
                    self._showFetchNodeFailMessage(error2, options.container.get("id"));
                    deferred && deferred.reject(error2);
                  });
            })
            .fail(function (error) {
              self.unblockActions();
              self._showFetchNodeFailMessage(error, options.container.get("id"));
              deferred && deferred.reject(error);
            });

        return deferred && deferred.promise();
      }

      this._ensureModelInCollection(collection);

      return deferred && deferred.promise().resolve();
    },

    _ensureModelInCollection: function (collection) {
      // if the model is not in the collection, insert it at the beginning
      if (!collection.findWhere({id: this.options.model.get('id')})) {
        collection.add(this.options.model, {at: 0, silent: true});
      }

      this.options.collection || (this.options.collection = collection);
      this.options.containerCollection || (this.options.containerCollection = collection);
    },

    _showFetchNodeFailMessage: function (error, nodeId) {
      var errorObj = new base.Error(error);
      var title = lang.FetchNodeFailTitle;
      var message = _.str.sformat(lang.FetchNodeFailMessage, nodeId, errorObj.message);
      ModalAlert.showError(message, title);
    }

  });

  _.extend(MetadataNavigationView.prototype, ViewEventsPropagationMixin);

  return MetadataNavigationView;

});

csui.define('csui/widgets/document.overview/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/document.overview/impl/nls/root/lang',{
  ToolbarItemOpen: 'Open',
  ToolbarItemDownload: 'Download',
  ToolbarItemEdit: 'Edit',
  ToolbarItemProperties: 'Properties',
  location: "Location",
  docPreviewImgAlt: 'Document Preview',
  name: "Name",
  description: "Description",
  created: "Created",
  createdBy: "Created by",
  type: "Type",
  modified: "Modified",
  ownedBy: "Owned by",
  size: "Size"

});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/document.overview/impl/document.overview',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"cs-content-wrapper\">\r\n  <div class=\"cs-content-header\">\r\n    <div class=\"title-container\"></div>\r\n    <div class=\"actions-container\">\r\n      <div class=\"commentRegion\"></div>\r\n      <div class=\"favoriteRegion\"></div>\r\n    </div>\r\n\r\n  </div>\r\n  <div class=\"cs-content-container\">\r\n    <div class=\"description-container cs-content\">\r\n      <div class=\"owner_section general-information\"></div>\r\n      <div class=\"modified_section general-information\"></div>\r\n      <div class=\"type_section general-information\"></div>\r\n      <div class=\"size_section general-information\"></div>\r\n      <div class=\"reserve_info general-information\"></div>\r\n      <div class=\"location-container general-information\">\r\n        <div class=\"alpaca-container-item\">\r\n          <div class=\"binf-form-group alpaca-field alpaca-field-text alpaca-optional\r\n              alpaca-readonly\">\r\n            <label class=\"binf-control-label alpaca-control-label binf-col-sm-3\">\r\n              "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.location : stack1), depth0))
    + "\r\n            </label>\r\n            <div id=\"location\" class=\"binf-col-sm-9 location-view\">\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"description_section general-information\">\r\n\r\n      </div>\r\n    </div>\r\n    <div class=\"binf-col-md-4 thumbnail-container binf-text-left cs-content\">\r\n      <div class=\"metadata-tab\">\r\n        <div class=\"thumbnail_section metadata-preview preview-section\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.ToolbarItemOpen : stack1), depth0))
    + "\">\r\n          <span class=\"thumbnail_not_loaded thumbnail_empty\" data-cstabindex=\"0\"></span>\r\n          <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imgSrc || (depth0 != null ? depth0.imgSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imgSrc","hash":{}}) : helper)))
    + "\" class=\"img-doc-preview binf-hidden\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.imgAlt || (depth0 != null ? depth0.imgAlt : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imgAlt","hash":{}}) : helper)))
    + "\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"cs-content-footer\">\r\n    <button class=\"binf-btn primary-btn open-command\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.ToolbarItemOpen : stack1), depth0))
    + "</button>\r\n    <button class=\"binf-btn default-btn command-btn\"\r\n            data-signature=\"Download\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.ToolbarItemDownload : stack1), depth0))
    + "</button>\r\n    <button class=\"binf-btn default-btn command-btn edit-btn\"\r\n            data-signature=\"Edit\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.ToolbarItemEdit : stack1), depth0))
    + "</button>\r\n    <button class=\"binf-btn default-btn command-btn\"\r\n            data-signature=\"Properties\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.ToolbarItemProperties : stack1), depth0))
    + "</button>\r\n  </div>\r\n</div>\r\n\r\n";
}});
Handlebars.registerPartial('csui_widgets_document.overview_impl_document.overview', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/document.overview/impl/document.overview',[],function(){});
// Shows a list of links to favorite nodes
csui.define('csui/widgets/document.overview/document.overview.view',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/widgets/metadata/impl/header/item.name/metadata.item.name.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/form/form.view',
  'csui/models/nodeancestors',
  'csui/utils/nodesprites',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/connector',
  'csui/controls/form/fields/nodepickerfield.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/contexts/factories/node',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/controls/tableheader/comment/comment.button.view',
  'csui/widgets/favorites/favorite.star.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/models/nodes',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/commands',
  'i18n!csui/widgets/document.overview/impl/nls/lang',
  'hbs!./impl/document.overview',
  'css!./impl/document.overview'

], function (_, Backbone, Marionette, $,
    MetadataItemNameView,
    ViewEventsPropagationMixin,
    FormView,
    NodeAncestorCollection,
    NodeSpriteCollection,
    NodeModel,
    ConnectorFactory,
    NodePickerFieldView,
    NodeTypeIconView,
    NodeModelFactory, Thumbnail, DocumentGeneralFormModel, CommentView,
    FavoriteStarView, ToolbarCommandController,
    NodeCollection,
    DefaultActionBehavior, PerfectScrollingBehavior, commands, lang, documentOverviewTemplate) {
  'use strict';

  var DocumentOverviewView = FormView.extend({

    constructor: function DocumentOverviewView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.node) {
        options.node = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
      }
      //disable breadcrumb show
      Backbone.trigger("show:breadcrumbsoverride");
      this.options = options;
      this._createModel();
      FormView.prototype.constructor.call(this, this.options);

      this.listenTo(this.options.node, 'change', this.updateForm);

      this._createMetadataItemNameView();

      this.commandController = new ToolbarCommandController({
        commands: options.commands || commands
      });
      this.commands = this.commandController.commands;
      this.reloadWidget = false;
      this.parentNode = undefined;
      this.supportOriginatingView = true;
    },
    fieldToRefresh: 'modify_date',

    _createMetadataItemNameView: function () {
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }

      var inv = this.metadataItemNameView = new MetadataItemNameView({
        model: this.options.node,
        container: this.options.node.parent,
        containerCollection: this.options.containerCollection,
        collection: this.options.collection,
        context: this.options.context,
        nameSchema: {},
        commands: this.commands,
        originatingView: this,
        showDropdownMenu: true
      });
      this.listenTo(inv, 'metadata:item:name:save', this._saveItemName);
      this.listenTo(inv, 'metadata:item:before:delete', _.bind(function (args) {
        this.trigger('metadata:item:before:delete', args);
      }, this));
      this.listenTo(inv, 'metadata:item:before:move', _.bind(function (args) {
        this.trigger('metadata:item:before:move', args);
      }, this));
      this.listenTo(inv, 'metadata:item:deleted', _.bind(function (args) {
        this.trigger('metadata:item:deleted', args);
      }, this));

      this.propagateEventsToViews(this.metadataItemNameView);
    },

    reloadWidget: false,

    formTemplate: documentOverviewTemplate,

    className: 'cs-form csui-general-form cs-document-overview-wrapper',

    ui: {
      command: ".command-btn",
      open: ".open-command",
      location: "#location"
    },

    events: {
      "click @ui.command": '_triggerMenuItemAction',
      "click @ui.open": '_executeDefaultAction'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.cs-content-container',
        suppressScrollX: true
      }
    },

    _executeDefaultAction: function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.defaultActionController
          .executeAction(this.options.node, {
            context: this.options.context,
            originatingView: this
          });
    },

    _saveItemName: function (args) {
      var self = this;
      var itemName = args.sender.getValue();
      var name = {'name': itemName};
      var node = this.options.model;
      node.setFields('versions.element(0)', 'owner_id');
      node.set(name, {silent: true});
      var data = _.clone(node.attributes);
      return node.save(data, {
        data: name,
        wait: true,
        silent: true
      }).then(function () {
        node.fetch({silent: true}).done(function () {
          self._updateFieldsToRefersh();
          self.metadataItemNameView._toggleEditMode(false, false);
        });
      });
    },

    _triggerMenuItemAction: function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      var signature = $(event.target).data("signature");
      var command = this.commands.findWhere({signature: signature});
      var originatingView = this;
      originatingView.collection = new NodeCollection([this.options.node]);

      var status = {
        context: this.options.context,
        nodes: new NodeCollection([this.options.node]),
        container: this.options.node,
        originatingView: originatingView
      };

      if (command && command.enabled(status)) {
        command.execute(status);
      }
    },

    _createModel: function () {
      var node = this.options.node;
      this.options.model = new DocumentGeneralFormModel({
        data: {
          "name": node.get("name"),
          "description": node.get("description"),
          "create_date": node.get("create_date"),
          "create_user_id": node.get("create_user_id"),
          "type": node.get("type"),
          "type_name": node.get("type_name"),
          "mime_type": NodeSpriteCollection.findTypeByNode(node),
          "modify_date": node.get("modify_date"),
          "owner_user_id": node.get("owner_user_id"),
          "size": node.get("size_formatted"),
          "reserved_user_id": node.get("reserved_user_id")
        },
        schema: {
          "properties": {
            "name": {
              "maxLength": 248,
              "minLength": 1,
              "readonly": true,
              "required": true,
              "title": "Name",
              "type": "string"
            },
            "description": {
              "readonly": true,
              "required": false,
              "title": "Description",
              "type": "string"
            },
            "create_date": {
              "readonly": true,
              "required": false,
              "title": "Created",
              "type": "string",
              "format": "datetime"
            },
            "create_user_id": {
              "readonly": true,
              "required": false,
              "title": "Created By",
              "type": "otcs_user_picker"
            },
            "type": {
              "readonly": true,
              "required": false,
              "title": "Type",
              "type": "integer"
            },
            "type_name": {
              "readonly": true,
              "required": false,
              "title": "Type",
              "type": "string"
            },
            "modify_date": {
              "readonly": true,
              "required": false,
              "title": "Modified",
              "type": "string",
              "format": "datetime"
            },
            "owner_user_id": {
              "readonly": true,
              "required": false,
              "title": "Owned By",
              "type": "otcs_user_picker"
            },
            "size": {
              "hidden": false,
              "readonly": true,
              "title": "Size",
              "type": "string",
              "tooltip": "838,049 bytes"
            },
            "mime_type": {
              "hidden": false,
              "readonly": true,
              "title": "Type",
              "type": "string"
            }
          },
          "type": "object",
          "title": "General"
        },
        options: {
          "fields": {
            "name": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.name,
              "readonly": true,
              "type": "text"
            },
            "description": {
              "hidden": false,
              "rows": 5,
              "hideInitValidationError": true,
              "label": lang.description,
              "readonly": true,
              "type": "textarea",
              "placeholder": "Add description"
            },
            "create_date": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.created,
              "readonly": true,
              "type": "datetime",
              "placeholder": "n/a"
            },
            "create_user_id": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.createdBy,
              "readonly": true,
              "type": "otcs_user",
              "type_control": {
                "name": "Admin"
              },
              "placeholder": "n/a"
            },
            "type": {
              "hidden": true,
              "hideInitValidationError": true,
              "label": lang.type,
              "readonly": true,
              "type": "integer"
            },
            "type_name": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.type,
              "readonly": true,
              "type": "text"
            },
            "modify_date": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.modified,
              "readonly": true,
              "type": "datetime",
              "placeholder": "n/a"
            },
            "owner_user_id": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": lang.ownedBy,
              "readonly": true,
              "type": "otcs_user",
              "type_control": {
                "name": "Admin"
              },
              "placeholder": "n/a"
            },
            "size": {
              "hidden": false,
              "readonly": true,
              "label": lang.size,
              "placeholder": "n/a",
              "type": "text"
            },
            "mime_type": {
              "hidden": false,
              "readonly": true,
              "label": lang.type,
              "placeholder": "n/a",
              "type": "text"
            }
          }
        }
      }, this.options);
      this.options.model._addReserveInfo(this.options.model.attributes);
    },

    _updateModel: function () {
      var node = this.options.node;

      _.extend(this.model.attributes.data, {
        "name": node.get("name"),
        "description": node.get("description"),
        "create_date": node.get("create_date"),
        "create_user_id": node.get("create_user_id"),
        "type": node.get("type"),
        "type_name": node.get("type_name"),
        "mime_type": NodeSpriteCollection.findTypeByNode(node),
        "modify_date": node.get("modify_date"),
        "owner_user_id": node.get("owner_user_id"),
        "size": node.get("size_formatted"),
        "reserved_user_id": node.get("reserved_user_id")
      });
      this.model._addReserveInfo(this.model.attributes);
    },

    _getLayout: function () {
      var data = this.alpaca.data;
      data.name = this.model.get("data").name;
      var template = this.getOption('formTemplate'),
          html     = template.call(this, {
            data: data,
            mode: this.mode,
            lang: lang,
            // a 1x1 transparent gif, to avoid an empty src tag
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
            imgAlt: lang.docPreviewImgAlt
          }),
          bindings = this._getBindings(),
          view     = {
            parent: 'bootstrap-csui',
            layout: {
              template: html,
              bindings: bindings
            }
          };
      return view;
    },

    _getBindings: function () {
      var bindings = {
        name: 'name_section',
        owner_user_id: '.owner_section',
        modify_date: '.modified_section',
        mime_type: '.type_section',
        description: '.description_section',
        size: '.size_section',
        status: 'status_section'
      };
      // adding 'reserve_info' only for supported object types.
      if (this.model && this.model.node && this.model.node.get("reserved")) {
        bindings = _.extend(bindings, {
          reserve_info: ".reserve_info"
        });
      }

      return bindings;
    },

    updateForm: function (event) {
        //  perform this operations whenever change happen to the node.
        this._updateModel();
        this._createModel();
        FormView.prototype.constructor.call(this, this.options);
        this.metadataItemNameView = new MetadataItemNameView({
          model: this.options.node,
          container: this.options.node.parent,
          containerCollection: this.options.containerCollection,
          collection: this.options.collection,
          context: this.options.context,
          nameSchema: {},
          commands: this.commands,
          originatingView: this,
          showDropdownMenu: true
        });
        this.listenTo(this.metadataItemNameView, 'metadata:item:name:save', this._saveItemName);
        this.propagateEventsToViews(this.metadataItemNameView);
        FormView.prototype.updateForm.apply(this, arguments); 
    },

    updateRenderedForm: function (options) {
      FormView.prototype.updateRenderedForm.apply(this, arguments);

      this._showNodeIcon();
      this._showMetadataItemName();
      this._showThumbnail();
      this._addLocationView();
      this._addCommentView();
      this._addFavoriteView();
      this._checkDescriptionContent();
      this._checkEditPermission();
    },

    // overriding this method to validate the node's name, for document overview page only.
    _validateAndSave: function () {
      var currentValue = this.metadataItemNameView.getValue().trim();
      var inputValue = this.metadataItemNameView.getInputBoxValue();
      inputValue = inputValue.trim();
      if (inputValue.length === 0 || currentValue !== inputValue) {
        this.metadataItemNameView.ItemNameBehavior.validateInputName(inputValue).done(
            _.bind(function (success) {
              if (success) {
                this.metadataItemNameView.setInputBoxValue(inputValue);
                this.metadataItemNameView.setValue(inputValue);
                this.metadataItemNameView.modelHasEmptyName = false;
                this.metadataItemNameView.trigger("metadata:item:name:save", {
                  sender: this.metadataItemNameView
                });
              } else {
                return false;
              }
            }, this));
      }
    },

    _showThumbnail: function () {
      this.thumbnail = this.options.thumbnail ||
                       new Thumbnail({
                         node: this.options.node
                       });
      this.listenTo(this.thumbnail, 'load', this._showImage)
          .listenTo(this.thumbnail, 'error', this._showDefaultImage)
          .listenTo(this, 'destroy', _.bind(this._destroyThumbnail, this));

      if (this.mode !== 'create' && !this.thumbnailSet) {
        var self = this;
        this.thumbnailSet = true;
        //Just show image if url is available,otherwise load thumbnail
        if (!!this.thumbnail.url) {
          this._showImage();
        } else {
          this.thumbnail.load();
        }
        // default action
        this.$el.find('.thumbnail_section').click(function () {
          self.triggerMethod('execute:DefaultAction', self.options.node);
        });
      }
    },

    _showImage: function () {
      var self                 = this,
          img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded');
      img.attr("src", this.thumbnail.url);
      img.prop('tabindex', '0');
      img.one('load', function (evt) {

        if (evt.target.clientHeight >= evt.target.clientWidth) {
          img.addClass('cs-form-img-vertical');
        } else {
          img.addClass('cs-form-img-horizontal');
        }
        img.addClass('cs-form-img-border');
        //hide the thumbnail background span and show the real img
        thumbnailNotLoadedEl.addClass('binf-hidden');
        img.removeClass('binf-hidden');

        // event for keyboard navigation
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);
      });
    },

    _showDefaultImage: function () {
      // show thumbnail missing svg and hide img tag
      var img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded'),
          className            = NodeSpriteCollection.findClassByNode(this.options.node);
      thumbnailNotLoadedEl.addClass(className);
      thumbnailNotLoadedEl.removeClass('thumbnail_empty');
      thumbnailNotLoadedEl.removeClass('csui-icon-notification-error');
      thumbnailNotLoadedEl.removeClass('binf-hidden');
      img.addClass('binf-hidden');

      // event for keyboard navigation
      var event = $.Event('tab:content:render');
      this.$el.trigger(event);
    },

    _showNodeIcon: function () {
      if (!this._nodeIconView) {
        this._nodeIconView = new NodeTypeIconView({
          el: this.$el.find('.csui-type-icon').get(0),
          node: this.options.node
        });
        this._nodeIconView.render();
        //enable breadcrumb show
        Backbone.trigger("show:breadcrumbsoverride");
      }
    },

    _showMetadataItemName: function () {
      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      this.$el.find(".title-container").append(inv.el);
    },

    _addLocationView: function () {
      var self = this;

      var locationRegion = new Marionette.Region({
        el: this.$el.find(this.ui.location)
      });
      var field = new NodePickerFieldView({
        model: this._getParentNode(), // parent of the document
        context: this.options.context,
        formView: this
      });
      locationRegion.show(field);

      // check permission
      var newAncestors = new NodeAncestorCollection(undefined, {
        node: this._getParentNode()
      });
      this.listenTo(newAncestors, 'error', function (result) {
        self.$(".location-container").hide();
      });
      newAncestors.fetch();
    },

    _getParentNode: function () {
      if (this.parentNode === undefined) {
        this.parentNode = this.options.node.parent;

        this.parentNode.attributes.schema = this.options.model.attributes.schema;
        this.parentNode.attributes.schema.readonly = true;
        this.parentNode.attributes.options = this.options.model.attributes.options;
        this.parentNode.attributes.data = this.parentNode.attributes.id;
      }

      return this.parentNode;
    },

    _addCommentView: function () {
      var commentOptions = this.options;
      commentOptions.model = this.options.node;
      var commentView = new CommentView(commentOptions);

      var commentRegion = new Marionette.Region({
        el: this.$el.find(".commentRegion")
      });
      commentRegion.show(commentView);
    },

    _checkDescriptionContent: function () {
      var e = this.$el.find(".description_section .cs-field-textarea-data");
      if (!e || (e.length === 0)) {
        this.$el.find(".description_section").hide();
      } else {
        this.$el.find(".description_section").show();
      }
    },

    _addFavoriteView: function () {
      var favoriteOptions = this.options;
      favoriteOptions.model = this.options.node;
      favoriteOptions.popoverAtBodyElement = true;
      var favoriteView = new FavoriteStarView(favoriteOptions);

      var favoriteRegion = new Marionette.Region({
        el: this.$el.find(".favoriteRegion")
      });
      favoriteRegion.show(favoriteView);
    },

    _checkEditPermission: function () {
      var command = this.commands.findWhere({signature: "Edit"});

      var status = {
        context: this.options.context,
        nodes: new NodeCollection([this.options.node]),
        container: this.options.node.parent
      };

      if (!(command && command.enabled(status))) {
        this.$el.find(".edit-btn").addClass("binf-hidden");
      }
    },

    _destroyForm: function () {
      FormView.prototype._destroyForm.apply(this, arguments);
      this._destroyThumbnail();
    },

    _destroyThumbnail: function () {
      if (this.thumbnail) {
        this.thumbnail.destroy();
        this.thumbnail = undefined;
      }
      this.thumbnailSet = false;
    },

    _updateFieldsToRefersh: function () {
      var alpacaForm = this.$el.alpaca('get');
      if (!!alpacaForm) {
        var data = this.options.model.attributes;
        var field = alpacaForm.childrenByPropertyId[this.fieldToRefresh],
            value = data[this.fieldToRefresh];
        if (!!field && field.getValue() !== value) {
          field.setValue(value);
          field.refresh();
        }

      }
    }
  });

  _.extend(DocumentOverviewView.prototype, ViewEventsPropagationMixin);

  return DocumentOverviewView;

});


csui.define('json!csui/widgets/document.overview/document.overview.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      }
    },
    "required": ["id"]
  },
  "options": {
    "fields": {
      "id": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": [144]
          }
        }
      }
    }
  }
}
);


csui.define('json!csui/widgets/metadata/metadata.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      },
      "initialPanel": {
        "title": "{{initialPanelTitle}}",
        "description": "{{initialPanelDescription}}",
        "type": "string"
      }
    },
    "required": ["id"]
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
      }
    }
  },
  "actions": [
    {
      "toolItems": "csui/widgets/metadata/header.dropdown.menu.items",
      "toolItemMasks": "csui/widgets/metadata/header.dropdown.menu.items.mask",
      "toolbars": [
        {
          "id": "dropdownMenuList",
          "title": "{{dropdownMenuTitle}}",
          "description": "{{dropdownMenuDescription}}"
        }
      ]
    },
    {
      "toolItems": "csui/widgets/metadata/add.properties.menuitems",
      "toolItemMasks": "csui/widgets/metadata/add.properties.menuitems.mask",
      "toolbars": [
        {
          "id": "addPropertiesToolbar",
          "title": "{{addPropertiesTitle}}",
          "description": "{{addPropertiesDescription}}"
        }
      ]
    }
  ]
}
);


csui.define('json!csui/widgets/metadata.navigation/metadata.navigation.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "title": "{{idTitle}}",
        "description": "{{idDescription}}",
        "type": "integer"
      },
      "initialPanel": {
        "title": "{{initialPanelTitle}}",
        "description": "{{initialPanelDescription}}",
        "type": "string"
      }
    },
    "required": ["id"]
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
      }
    }
  }
}
);

csui.define('csui/widgets/document.overview/impl/nls/document.overview.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/document.overview/impl/nls/root/document.overview.manifest',{
  "widgetTitle": "Document Overview",
  "widgetDescription": "Shows basic information about a document and offers the most often actions for it.",
  "idTitle": "Document",
  "idDescription": "A document to show the overview for"
});


csui.define('csui/widgets/metadata/impl/nls/metadata.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/metadata/impl/nls/root/metadata.manifest',{
  "widgetTitle": "Object Information",
  "widgetDescription": "Shows information about an object and offers the most important actions for it.",
  "idTitle": "Object",
  "idDescription": "An object to show the information for",
  "initialPanelTitle": "Object information",
  "initialPanelDescription": "An object to show the information for",
  "dropdownMenuTitle": "Object Context Menu",
  "dropdownMenuDescription": "Context menu, which is displayed when clicking on the arrow on the right side of the name of the opened object.",
  "addPropertiesTitle": "Add Feature Menu",
  "addPropertiesDescription": "Drop-down menu, which is displayed when clicking on the plus on the right side of the property tabs."
});


csui.define('csui/widgets/metadata.navigation/impl/nls/metadata.navigation.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/metadata.navigation/impl/nls/root/metadata.navigation.manifest',{
  "widgetTitle": "Object Information",
  "widgetDescription": "Shows information about an object and offers the most important actions for it.",
  "idTitle": "Object",
  "idDescription": "An object to show the information for",
  "initialPanelTitle": "Object information",
  "initialPanelDescription": "An object to show the information for"
});


csui.define('bundles/csui-metadata',[
  // Controls
  'csui/controls/tableheader/comment/comment.button.view',
  'csui/widgets/metadata/versions.toolbaritems',
  'csui/widgets/metadata/impl/metadata.tabcontentcollection.view',

  // Application widgets
  'csui/widgets/metadata/metadata.view',
  'csui/widgets/metadata/metadata.properties.view',
  'csui/widgets/metadata/metadata.action.one.item.properties.view',
  'csui/widgets/metadata/metadata.add.categories.controller',
  'csui/widgets/metadata/metadata.add.document.controller',
  'csui/widgets/metadata/metadata.add.item.controller',
  'csui/widgets/metadata/metadata.copy.move.items.controller',
  'csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
  'csui/widgets/metadata.navigation/metadata.navigation.view',
  'csui/widgets/document.overview/document.overview.view',

  // Application widgets manifests
  'json!csui/widgets/document.overview/document.overview.manifest.json',
  'json!csui/widgets/metadata/metadata.manifest.json',
  'json!csui/widgets/metadata.navigation/metadata.navigation.manifest.json',
  'i18n!csui/widgets/document.overview/impl/nls/document.overview.manifest',
  'i18n!csui/widgets/metadata/impl/nls/metadata.manifest',
  'i18n!csui/widgets/metadata.navigation/impl/nls/metadata.navigation.manifest',

  // Tool items and tool item masks
  'csui/widgets/metadata/add.properties.menuitems',
  'csui/widgets/metadata/add.properties.menuitems.mask',
  'csui/widgets/metadata/header.dropdown.menu.items',
  'csui/widgets/metadata/header.dropdown.menu.items.mask',
  'csui/widgets/metadata/versions.toolbaritems.mask',

  // Metadata general action fields
  'csui/widgets/metadata/metadata.general.action.fields'

], {});

csui.require(['require', 'css'], function (require, css) {

  css.styleLoad(require, 'csui/bundles/csui-metadata', true);

});

