csui.define('csui/perspective.manage/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/impl/nls/root/lang',{
  layoutTabTitle: 'Change page layout',
  widgetTabTitle: 'Add widget',
  expandTab: 'Expand tab',
  collapseTab: 'Collapse tab',
  noTitle: 'Title not available',
  goBackTooltip: 'Go back',
  templateMessage: 'Drag and Drop tile in position',
  changePageLayoutConfirmatonText: 'All your previewsly added and configured widgets will be lost!',
  proceedButton: 'Proceed',
  changeLayoutCancelButton: 'Cancel',
  FlowLayoutTitle: 'Flow Layout',
  LcrLayoutTitle: 'Left-Center-Right',
  perspectiveSaveSuccess: 'Perspective has been updated successfully.',
  saveConfirmMsg: 'Please be aware this action will update all perspective overrides using this layout configuration. If you do not want this to happen, you should create a new perspective.',
  saveConfirmTitle: 'Save perspective',
  addWidget: 'Add Widget',
  save: 'Save',
  close: 'Close',
  cancel: 'Cancel'
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/widget.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-module-item\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_widget.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/perspective.manage/impl/widget.list.view',['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'csui/models/widget/widget.collection',
  'hbs!csui/perspective.manage/impl/widget.item'
], function (module, _, $, Backbone, Marionette, base, PerfectScrollingBehavior, Lang,
    WidgetCollection,
    WidgetItemTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {});

  var WidgetItemView = Marionette.ItemView.extend({

    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    template: WidgetItemTemplate,

    events: {
      'click': 'onClickItem'
    },
    onClickItem: function () {
      var widgetCollection = new Backbone.Collection(this.model.attributes.widgets);
      this.options.parentView.trigger("item:clicked", {
        data: {
          items: widgetCollection.models,
          draggable: true
        }
      });
    }

  });

  var WidgetListView = Marionette.ItemView.extend({
    tagName: 'div',

    template: WidgetItemTemplate,

    constructor: function WidgetListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
            return behavior.behaviorClass === PerfectScrollingBehavior;
          }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.cs-module-list',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.ItemView.call(this, options);

      var self = this;
      this.allWidgets = new WidgetCollection();
      this.allWidgets.fetch().done(function () {
        self.collection = self._groupWidgetsByModule();
        // self._sanitiseWidgetLibrary();
        self.render();
        self.trigger("items:fetched");
      });
    },

    initialize: function () {
      _.bindAll(this, "renderItem");
    },

    className: 'cs-module-list',

    render: function () {
      this.collection && this.collection.each(this.renderItem);
    },

    renderItem: function (model) {
      var parentView = this;
      var itemView = new WidgetItemView({model: model, parentView: parentView});
      itemView.render();
      $(this.el).append(itemView.el);
    },

    _groupWidgetsByModule: function () {
      // creates a data model where widgets are grouped according to their module
      var moduleCollection = new Backbone.Collection();
      _.each(this.allWidgets.models, function (model) {
        model.set("title",
            model.attributes.manifest ? model.attributes.manifest.title : Lang.noTitle);
      });
      _.each(_.groupBy(this.allWidgets.models, function (model) {
        return model.serverModule.id;
      }), function (val, key) {
        var title = _.first(val).serverModule.attributes.title;
        title = title ? title.replace(/OpenText /, '') : Lang.noTitle; // remove superfluous OpenText prefix
        moduleCollection.add({
          id: key,
          title: title,
          widgets: val
        })
      });
      return moduleCollection;
    },

    _sanitiseWidgetLibrary: function () {
      // checks to see if any widget groups or widgets have been whitelisted or blacklisted
      // alpha-sorts the groups and the widgets within them.
    }

  });

  return WidgetListView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/accordion',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-accordion-header csui-accordion-expand\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.widgetTabTitle : depth0), depth0))
    + "\">\r\n  "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.widgetTabTitle : depth0), depth0))
    + "\r\n  <div class=\"csui-button-icon cs-icon icon-expandArrowDown\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.expandTab : depth0), depth0))
    + "\"></div>\r\n  <div class=\"csui-button-icon cs-icon icon-expandArrowUp\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.collapseTab : depth0), depth0))
    + "\"></div>\r\n</div>\r\n<div class=\"csui-accordion-content\"></div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_accordion', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/perspective.manage/impl/accordion.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/perspective.manage/impl/widget.list.view',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'hbs!csui/perspective.manage/impl/accordion',
], function (_, $, Backbone, Marionette, base, WidgetListView, Lang, Template) {
  'use strict';

  var AccordionView = Marionette.ItemView.extend({
    tagName: 'div',

    className: 'csui-accordion',

    template: Template,

    ui: {
      accordionHeader: '.csui-accordion-header',
      accordionContent: '.csui-accordion-content',
      accordionHeaderIcon: '.csui-accordion-header .cs-icon'
    },

    events: {
      'click @ui.accordionHeader': "toggle"
    },

    templateHelpers: function () {
      return {
        widgetTabTitle: Lang.widgetTabTitle,
        expandTab: Lang.expandTab,
        collapseTab: Lang.collapseTab
      }
    },

    constructor: function AccordionView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      this.widgetListRegion = new Marionette.Region({
        el: this.ui.accordionContent
      });
      this.widgetListView = new WidgetListView();
      this.widgetListRegion.show(this.widgetListView);
      this.listenTo(this.widgetListView, "item:clicked", function (args) {
        this.trigger("item:clicked", args);
      }).listenTo(this.widgetListView, "items:fetched", function () {
        this.trigger("items:fetched");
      });
    },

    toggle: function () {
      this.showAccordion = !this.showAccordion;
      this.ui.accordionHeader.toggleClass("csui-accordion-expand");
      this.ui.accordionContent.toggle();
    }
  });

  return AccordionView;

});


csui.define('csui/perspective.manage/impl/perspectivelayouts',[
    'csui/lib/underscore',
    'i18n!csui/perspective.manage/impl/nls/root/lang',
    // Load extra layout items to be added
    'csui-ext!perspective.manage/impl/perspectivelayouts'
], function(_, Lang, extraPerspectiveLayouts) {

    var perspectivelayouts = [
        {
            title: Lang.LcrLayoutTitle, 
            type: "left-center-right",
            icon: "csui-layout-lcr"
        },
        {
            title: Lang.FlowLayoutTitle, 
            type: "flow",
            icon: "csui-layout-flow"
        }
    ];

    if(extraPerspectiveLayouts) {
        perspectivelayouts = _.union(perspectivelayouts, extraPerspectiveLayouts);
    }

    return perspectivelayouts;
});

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/pman.panel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-tab-pannel\">\r\n  <div class=\"csui-layout-tab\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.layoutTabTitle : depth0), depth0))
    + "\">\r\n    "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.layoutTabTitle : depth0), depth0))
    + "\r\n  </div>\r\n  <div class=\"csui-widget-tab\"></div>\r\n</div>\r\n<div class=\"csui-list-pannel\"></div>\r\n<div class=\"csui-template-wrapper\">\r\n  <div class=\"csui-widget-template\">\r\n    <div class=\"csui-template-header\"></div>\r\n    <div class=\"csui-template-body\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.templateMessage : depth0), depth0))
    + "</div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_pman.panel', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/list.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.className : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "\"\r\n     draggable="
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.draggable : depth0), depth0))
    + ">\r\n  <span>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>\r\n  <div class=\"csui-layout-icon "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.iconClass : depth0), depth0))
    + "\"></div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_list.item', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"cs-header binf-panel-heading cs-header-with-go-back\" tabindex=\"0\" role=\"link\"\r\n     aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackAria || (depth0 != null ? depth0.goBackAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon circular arrow_back cs-go-back\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackTooltip || (depth0 != null ? depth0.goBackTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n</div>\r\n<div class=\"cs-content\">\r\n  <div class=\"cs-list-group\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_list', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/widget.drag.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-widget-template\">\r\n  <div class=\"csui-template-header\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</div>\r\n  <div class=\"csui-template-body\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.body : depth0), depth0))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_widget.drag.template', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/impl/pman.panel',[],function(){});
csui.define('csui/perspective.manage/impl/pman.panel.view',['require', 'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/underscore', 'csui/lib/marionette',
  "csui/controls/progressblocker/blocker",
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/perspective.manage/impl/accordion.view',
  'csui/perspective.manage/impl/perspectivelayouts',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'hbs!csui/perspective.manage/impl/pman.panel',
  'hbs!csui/perspective.manage/impl/list.item',
  'hbs!csui/perspective.manage/impl/list',
  'hbs!csui/perspective.manage/impl/widget.drag.template',
  'css!csui/perspective.manage/impl/pman.panel'

], function (require, module, $, Backbone, _, Marionette, BlockerView, PerfectScrollingBehavior,
    AccordionView, perspectiveLayouts, Lang, template, ListItemTemplate, ListTemplate,
    WidgetDragTemplate) {
  'use strict';

  var PManPanelView = Marionette.ItemView.extend({
    tagName: 'div',

    template: template,

    events: {
      'click @ui.layoutTab': "onTabClicked"
    },

    ui: {
      tabPannel: ".csui-tab-pannel",
      listPannel: ".csui-list-pannel",
      layoutTab: ".csui-layout-tab",
      widgetTab: ".csui-widget-tab",
      template: ".csui-widget-template"
    },

    className: 'csui-pman-panel',

    templateHelpers: function () {
      return {
        layoutTabTitle: Lang.layoutTabTitle,
        templateMessage: Lang.templateMessage
      }
    },

    onRender: function () {
      this.ui.widgetTab.hide();
      this.ui.layoutTab.hide();
      this.accordionRegion = new Marionette.Region({
        el: this.ui.widgetTab
      });
      this.accordionView = new AccordionView();
      this.accordionRegion.show(this.accordionView);
      this.blockActions();
      this.listenTo(this.accordionView, "item:clicked", this.onTabClicked)
          .listenTo(this.accordionView, "items:fetched", function () {
            this.unblockActions();
            this.ui.layoutTab.show();
            this.ui.widgetTab.show();
          });
    },

    constructor: function PManPanelView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      BlockerView.imbue(this);
      this.listenTo(this, 'reset:items', function () {
        this.listView && this.listView.destroy();
      });
    },

    onTabClicked: function (options) {
      var args = options.data ? options : {
        data: {
          items: perspectiveLayouts
        }
      };
      args.draggable = !!args.data.draggable;
      args.itemClassName = !!args.data.draggable ? "csui-widget-item icon-draggable-handle" : "csui-layout-item";
      args.pmanView = this.options.pmanView;

      this.ui.tabPannel.addClass("binf-hidden");
      this.listregion = new Marionette.Region({
        el: this.ui.listPannel
      });
      this.listView = new ListView(args);
      this.listregion.show(this.listView);

      // Register events on listview to handle back
      this.listenTo(this.listView, "before:destroy", function () {
        this.ui.tabPannel.removeClass("binf-hidden");
      }).listenTo(this.listView, "click:back", function () {
        this.listView.destroy();
      });
    },
  });

  var ListItemView = Marionette.ItemView.extend({
    constructor: function ListItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    template: ListItemTemplate,

    templateHelpers: function () {
      return {
        draggable: !!this.options.draggable,
        className: this.options.itemClassName,
        iconClass: this.model.get('icon')
      }
    },

    ui: {
      widget: '.csui-widget-item'
    },

    events: {
      'dragstart @ui.widget': 'onDragStart',
      'dragend @ui.widget': 'onDragEnd'
    },

    triggers: {
      'click .csui-layout-item:not(.binf-active)': 'change:layout'
    },

    onRender: function () {
      if (this.model.get('type') === this.options.pmanView.perspective.get('perspective').type) {
        this.trigger('set:active');
      }
      var dndContainer = $('.perspective-editing .csui-dnd-container')
      if (dndContainer.length) {
        this._makeWidgetSortable();
      }
    },

    _makeWidgetSortable: function() {
      var self = this;
      this.$el.data('pman.widget', this.model);
      this.$el.sortable({
        connectWith: ".perspective-editing .csui-dnd-container",
        containment: ".perspective-editing .csui-dnd-container",
        helper: function (event, ui) {
          // Drag Image
          self.widgetDragTemplate = new widgetDragTemplateView({
            title: self.model.attributes.title,
            newWidget: self.model
          });
          self.widgetDragTemplate.render();
          //Set width and height to prevent jquery ui overriding Drag item width and height
          self.widgetDragTemplate.$el.width('250px');
          self.widgetDragTemplate.$el.height('250px');
          self.widgetDragTemplate.$el.css({opacity: 0.75});
          self.widgetDragTemplate.$el.appendTo(self.options.pmanView.$el.find('.pman-header'));
          return self.widgetDragTemplate.$el;
        },
        cursor: 'grabbing',
        tolerance: 'pointer',
        cursorAt: {top: 50, left: 50},
        start: function (event, ui) {
          ui.item.css('display', 'block');
          ui.placeholder.css('display', 'none');
        },
        over: function (event, ui) {
          ui.placeholder.css('display', 'none');
        },
        out: function (event, ui) {
            ui.placeholder.css('display', 'block');
            self.dragStart();
        }, 
        stop: function () {
            self.dragEnd();
        }
      });
    },


    onDragStart: function (event) {
      event.originalEvent.dataTransfer.setData("text", JSON.stringify(this.model.toJSON()))
      var template = $('.csui-template-wrapper');
      template.find(".csui-template-header").text(this.model.attributes.title);
      if (!!event.originalEvent.dataTransfer.setDragImage) {
        // IE11 dont have 'setDragImage'
        event.originalEvent.dataTransfer.setDragImage(template[0], 50, 50);
      }
      this.dragStart();
    },

    onDragEnd: function (event) {
      this.dragEnd();
    },

    dragStart: function () {
      this.options.pmanView.$el.find('.csui-pman-panel').addClass("csui-pman-drag-start");
    },

    dragEnd: function () {
      this.options.pmanView.$el.find('.csui-pman-panel').removeClass("csui-pman-drag-start");
    }
  });

  var ListView = Marionette.CompositeView.extend({

    constructor: function ListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.csui-pman-list',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.call(this, options);

      // TODO: Deprecate this, or fix it, so that a collection can be created
      // without breaking the client
      // Passing a collection without knowing its model schema and identifier
      // is not possible in Backbone, where the collections should be indexed
      if (this.options.data && this.options.data.items) {
        if (!this.collection) {
          var ViewCollection = Backbone.Collection.extend({
            model: Backbone.Model.extend({
              idAttribute: null
            })
          });
          this.collection = new ViewCollection();
        }
        this.collection.add(this.options.data.items);
      }
    },

    ui: {
      back: '.cs-go-back'
    },
    className: 'csui-pman-list',

    events: {
      'click @ui.back': 'onClickBack'
    },

    childEvents: {
      'change:layout': 'onChangeLayout',
      'set:active': 'setActive'
    },

    template: ListTemplate,

    templateHelpers: function () {
      return {
        goBackTooltip: Lang.goBackTooltip
      };
    },

    childViewContainer: '.cs-list-group',

    childView: ListItemView,

    childViewOptions: function () {
      return this.options;
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger('click:back');
    },

    setActive: function (childView) {
      this.$el.find('.csui-layout-item').removeClass('binf-active');
      childView.$el.find('.csui-layout-item').addClass('binf-active');
    },

    onChangeLayout: function (childView) {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlertView) {
        ModalAlertView.confirmWarning(Lang.changePageLayoutConfirmatonText, Lang.layoutTabTitle,
            {
              buttons: {
                showYes: true,
                labelYes: Lang.proceedButton,
                showNo: true,
                labelNo: Lang.changeLayoutCancelButton
              }
            })
            .done(function (labelYes) {
              if (labelYes) {
                self.setActive(childView);
                self.options.pmanView.trigger("change:layout", childView.model.get('type'));
              }
            });
      });
    }

  });

  var widgetDragTemplateView = Marionette.ItemView.extend({
    constructor: function ListItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    className: 'csui-template-wrapper',

    template: WidgetDragTemplate,

    templateHelpers: function () {
      return {
        header: this.options && this.options.title,
        body: Lang.templateMessage

      }
    },
    onRender: function () {
      this.$el.data('pman.widget', this.options.newWidget);
    }
  });

  return PManPanelView;
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/pman',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"pman-backdrop\"></div>\r\n<div class=\"pman-header\">\r\n  <div class=\"pman-header-backdrop\"></div>\r\n  <div class=\"pman-tools-container\">\r\n    <div class=\"pman-left-tools\">\r\n      <ul>\r\n        <li class=\"pman-toolitem\">\r\n          <button class=\"icon icon-toolbarAdd\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.addWidget : depth0), depth0))
    + "\"></button>\r\n        </li>\r\n      </ul>\r\n      <div class=\"pman-pannel-wrapper\"></div>\r\n    </div>\r\n    <div class=\"pman-right-tools\">\r\n      <ul>\r\n        <li class=\"pman-toolitem\">\r\n          <button class=\"icon icon-save\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.save : depth0), depth0))
    + "\" disabled></span>\r\n        </li>\r\n        <li class=\"pman-toolitem\">\r\n          <button class=\"icon cancel-edit\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.cancel : depth0), depth0))
    + "\"></button>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_pman', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/impl/pman',[],function(){});

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/options.form.wrapper',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-pman-form-header\">\r\n    <div class=\"csui-pman-form-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-pman-form-description\">"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "</div>\r\n</div>\r\n<div class=\"csui-pman-form-content\"></div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_options.form.wrapper', t);
return t;
});
/* END_TEMPLATE */
;


csui.define('css!csui/perspective.manage/impl/options.form',[],function(){});
csui.define('csui/perspective.manage/impl/options.form.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/form.view',
  'hbs!csui/perspective.manage/impl/options.form.wrapper',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'css!csui/perspective.manage/impl/options.form',
], function (_, $, Backbone, Marionette, LayoutViewEventsPropagationMixin, PerfectScrollingBehavior,
    FormView, template, lang) {

  var WidgetOptionsFormWrapperView = Marionette.LayoutView.extend({

    template: template,

    className: 'csui-pman-form-wrapper',

    regions: {
      bodyRegion: '.csui-pman-form-content'
    },

    templateHelpers: function () {
      return {
        title: this.options.manifest.title,
        description: this.options.manifest.description
      }
    },

    constructor: function WidgetOptionsFormHeaderView(options) {
      this.options = options || {};
      this.manifest = this.options.manifest;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _createForm: function () {
      this.widgetOptionsFormView = new WidgetOptionsFormView({
        context: this.options.context,
        model: this._prepareFormModel(),
        mode: 'create',
      });

      this.listenToOnce(this.widgetOptionsFormView, 'render:form', function () {
        this.trigger('render:form');
      }.bind(this))

      this.listenTo(this.widgetOptionsFormView, 'change:field', function (field) {
        this.trigger('change:field', field);
      }.bind(this))
    },

    _hasSchema: function () {
      if (!this.manifest || !this.manifest.schema || !this.manifest.schema.properties ||
          _.isEmpty(this.manifest.schema.properties)) {
        // No configuration required for the widget
        return false;
      }
      return true;
    },

    onRender: function () {
      if (this._hasSchema()) {
        this._createForm();
        this.bodyRegion.show(this.widgetOptionsFormView);
      } else {
        this.trigger('render:form');
      }
    },

    getValues: function () {
      if (!this._hasSchema()) {
        return undefined;
      }
      return this.widgetOptionsFormView.getValues();
    },

    validate: function () {
      if (!this._hasSchema()) {
        return true;
      }
      return this.widgetOptionsFormView.validate();
    },

    _isPreviewWidget: function () {
      return this.options.widgetConfig.type ===
             'csui/perspective.manage/widgets/perspective.widget';
    },

    _prepareFormModel: function () {
      var data = this.options.widgetConfig.options || {};
      if (this._isPreviewWidget()) {
        // For widgets added using DnD, widget will be added as preview for original widget
        // Resolve original widget options from preview widget's options
        data = data.options || {};
      }
      // Clone schema and options from manifest as they would change by form.view
      var schema      = JSON.parse(JSON.stringify(this.manifest.schema)),
          formOptions = JSON.parse(JSON.stringify(this.manifest.options || {}));

      this._addWidgetSizePropertyIfSupported(schema, formOptions, data);

      var model = new Backbone.Model({
        schema: schema,
        options: formOptions,
        data: data
      });
      return model;
    },

    /**
     * Add a new properties to form to change "Size" if widgets.
     * Size that can be configured depends on perspective's supported sizes as well as supported sizes of widget
     *
     */
    _addWidgetSizePropertyIfSupported: function (schema, options, data) {
      if (!this.options.perspectiveView.getSupportedWidgetSizes) {
        // Perspective view doesn't support configuring widget sizes
        return;
      }
      var supportedKinds = this.options.perspectiveView.getSupportedWidgetSizes(this.manifest,
          this.options.widgetView);
      if (!supportedKinds || supportedKinds.length === 0) {
        // No supported sizes found for widget
        return;
      }
      var kindSchema = {
        title: lang.widgetSizeTitle,
        description: lang.widgetSizeDescription,
        type: 'string',
        enum: _.map(supportedKinds, function (sk) {
          return sk.kind;
        })
      };
      var kindOption = {
        type: 'select',
        optionLabels: _.map(supportedKinds, function (sk) {
          return sk.label;
        }),
        removeDefaultNone: true
      };
      var selectedKind = _.find(supportedKinds, function (size) {return size.selected;});
      if (!!selectedKind) {
        data[WidgetOptionsFormWrapperView.widgetSizeProperty] = selectedKind.kind;
      }
      var sizeSchema = {};
      sizeSchema[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindSchema;
      schema.properties = _.extend(sizeSchema, schema.properties);

      var sizeOptions = {};
      sizeOptions[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindOption;
      options.fields = _.extend(sizeOptions, options.fields);

      schema.required = schema.required || [];
      schema.required.push(WidgetOptionsFormWrapperView.widgetSizeProperty);
    },

  }, {
    widgetSizeProperty: '__widgetSize'
  });

  var WidgetOptionsFormView = FormView.extend({

    className: function () {
      var className = FormView.prototype.className.call(this);
      return className + ' perspective-widget-form';
    },

    constructor: function WidgetOptionsFormView(options) {
      FormView.apply(this, arguments);
    },

    _modifyModel: function () {
      this._normalizeSchemaToFormView();
      FormView.prototype._modifyModel.apply(this, arguments);
    },

    _normalizeSchemaToFormView: function () {
      var self = this;
      if (!this.alpaca.options) {
        this.alpaca.options = {};
      }
      if (!this.alpaca.options.fields) {
        this.alpaca.options.fields = {};
      }
      this._normalizeOptions(this.alpaca.schema.properties, this.alpaca.options.fields,
          this.alpaca.data);
    },

    /**
     * Recursively fill options for all respective schemas
     */
    _normalizeOptions: function (schemaProperies, optionFields, data) {
      var self = this;
      _.each(schemaProperies, function (field, fieldId) {
        var fieldOpts = optionFields[fieldId];
        var fieldData = data[fieldId];
        if (!fieldOpts) {
          optionFields[fieldId] = fieldOpts = {}
        }
        switch (field.type) {
        case 'array':
          if (!fieldOpts.fields) {
            _.defaults(fieldOpts, {
              fields: {
                item: {}
              }
            });
          }
          if (!!fieldOpts.items) {
            fieldOpts.fields.item = fieldOpts.items;
          }
          if (field.items.type === 'object') {
            fieldOpts.fields.item.fields || (fieldOpts.fields.item.fields = {});
            if (!fieldData) {
              data[fieldId] = fieldData = [{}];
            }
            self._normalizeOptions(field.items.properties, fieldOpts.fields.item.fields,
                fieldData[0]);
          }
          if (!fieldData) {
            data[fieldId] = [null];
          }
          break;
        case 'object':
          if (!fieldData) {
            data[fieldId] = fieldData = {};
          }
          if (!fieldOpts.fields) {
            fieldOpts.fields = {};
            self._normalizeOptions(field.properties, fieldOpts.fields, fieldData);
          }
          break;
        default:
          if (!fieldData) {
            data[fieldId] = null;
          }
          break;
        }
      });
    }

  });

  _.extend(WidgetOptionsFormView.prototype, LayoutViewEventsPropagationMixin);

  return WidgetOptionsFormWrapperView;

});

csui.define('csui/perspective.manage/behaviours/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/behaviours/impl/nls/root/lang',{
  deleteConfirmMsg: 'Are you sure, you want to remove widget?',
  deleteConfirmTitle: 'Remove Widget',
  replaceConfirmMsg: 'Are you sure, you want to replace widget?',
  replaceConfirmTitle: 'Replace Widget',
  widgetSizeTitle: 'Widget size',
  widgetSizeDescription: 'Determines how much space the widget occupies. Note that widgets are re-sized automatically to display optimally on smaller screens.'
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/behaviours/impl/widget.masking',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-pman-widget-masking\">\r\n  <div class=\"csui-pman-widget-close\">\r\n    <div class=\"formfield_clear\"></div>\r\n  </div>\r\n</div>\r\n<div class=\"csui-pman-popover-right csui-pman-popover-holder\"></div>\r\n<div class=\"csui-pman-popover-left csui-pman-popover-holder\"></div>";
}});
Handlebars.registerPartial('csui_perspective.manage_behaviours_impl_widget.masking', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/behaviours/impl/widget.masking',[],function(){});
/**
 * Responsibilities:
 *  - Masking the unit level widget of perpsective. In case of grid.view, it will be cell
 *  - Listen and handle DnD of widgets and act accordingly - replace widgets
 *  - Fire "replace:widget" on dropping of any widget
 *  - Deleting a widget from perspective
 *  - Configuration of widget using callouts
 *
 * Usage:
 *  - Should be applied to widgets of perspective to be able to configure them
 *
 * Required Inputs:
 *  - perspectiveView
 *  - widgetView
 *
 * Events:
 *  - replace:widget
 *    - Fires on perspectiveView
 *    - When dropping any widget from tools on perpsective widget
 *  - delete:widget
 *    - Fires on perspectiveView
 *    - When deleting a perspective widget
 *  - update:widget:size
 *    - Firex Fires on perspectiveView
 *    - When change in size of widget
 *  - update:widget:config
 *    - Firex Fires on perspectiveView
 *    - When widget configuration options updated
 */
csui.define('csui/perspective.manage/behaviours/pman.widget.config.behaviour',['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone', 'csui/utils/log',
  'csui/models/widget/widget.model',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/behaviours/impl/nls/lang',
  'hbs!csui/perspective.manage/behaviours/impl/widget.masking',
  'css!csui/perspective.manage/behaviours/impl/widget.masking',
], function (require, i18n, _, $, Marionette, Backbone, log, WidgetModel, WidgetOptionsFormView,
    lang,
    maskingTemplate) {
  'use strict';

  /**
   * View to mask the perspective widget and handles the widget configuration
   */
  var WidgetMaskingView = Marionette.ItemView.extend({
    template: maskingTemplate,
    className: function () {
      return WidgetMaskingView.className
    },

    ui: {
      delete: '.csui-pman-widget-close',
      masking: '.csui-pman-widget-masking'
    },

    events: {
      'click @ui.masking': '_showCallout',
      'drop': 'onDrop',
      'dragover': 'onDragOver',
      'dragenter': 'onDragEnter',
      'dragleave': 'onDragLeave',
      'click @ui.delete': 'onDeleteClick'
    },

    constructor: function WidgetMaskingView(options) {
      Marionette.ItemView.apply(this, arguments);
      this.dropCounter = 0;
      this.manifest = undefined;
      this.perspectiveView = options.perspectiveView;
      this.widgetView = options.widgetView;
      this.widgetConfig = options.widgetConfig;
    },

    onRender: function () {
      var self = this;
      this._loadManifest().done(function (manifest) {
        self._createOptionsForm(function () {
          self._updateWidgetOptions();
        });
      });
    },

    _showCallout: function () {
      if (!this.widgetConfig || _.isEmpty(this.widgetConfig) ||
          this.widgetConfig.type === 'csui/perspective.manage/widgets/perspective.placeholder') {
        // Widget configuration not found. Hence cannot show callout
        return;
      }
      // open widget configuration callout
      this._loadManifest().done(function (manifest) {
        this._showOptionsCallout(manifest);
      }.bind(this));
    },

    _showOptionsCallout: function (manifest) {
      this._calculatePopoverPlacement();

      if (!!this.$popoverEl.data('binf.popover')) {
        // Currently showing popover. Close it.
        this.$popoverEl.binf_popover('destroy');
        return;
      }
      this.perspectiveView.$el.find('.' + WidgetMaskingView.className +
                                    ' .csui-pman-popover-holder').binf_popover('destroy');

      if (!!this.optionsFormView) {
        // Toggle. Open popover with existing form.view
        this._showPopover();
      } else {
        this._createOptionsForm();
      }
    },

    _createOptionsForm: function (afterRenderCallback) {
      this.optionsFormView = new WidgetOptionsFormView(_.defaults({
        context: this.perspectiveView.options.context,
        manifest: this.manifest
      }, this.options));
      if (!!afterRenderCallback) {
        this.optionsFormView.listenToOnce(this.optionsFormView, 'render:form', afterRenderCallback);
      }
      this.optionsFormView.render();
      this.optionsFormView.listenTo(this.optionsFormView, 'change:field',
          this._onChangeField.bind(this));
    },

    _calculatePopoverPlacement: function () {
      var adjust       = this._determineCalloutPlacement(),
          contentClass = (i18n && i18n.settings.rtl) ?
                         adjust.placement == 'right' ? adjust.mirror ? 'right' : 'left' : 'right' :
                         ((adjust.placement == 'left' && adjust.mirror) ? 'right' :
                          adjust.placement);
      this.$popoverEl = this.$el.find('.csui-pman-popover-' + contentClass);
      this.placement = adjust.placement;
    },

    /**
     * Determite callout position and show widget configuration callout
     */
    _showPopover: function () {
      var popoverOptions = {
        html: true,
        content: this.optionsFormView.el,
        trigger: 'manual',
        viewport: { // Limit popover placement to perspective panel only
          selector: this.options.perspectiveSelector,
          padding: 15
        },
        placement: this.placement
      };
      this.$popoverEl.binf_popover(popoverOptions);
      this.$popoverEl.off('hidden.binf.popover')
          .on('hidden.binf.popover', this._handleCalloutHide.bind(this));
      this.$popoverEl.binf_popover('show');
      this._registerPopoverEvents();
    },

    _registerPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').on('click.' + this.cid, {view: this},
          this._documentClickHandler);
      $('.pman-container').on('click.' + this.cid, {view: this}, this._documentClickHandler);
    },

    _unregisterPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid,
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid, this._documentClickHandler);
    },

    /**
     * Handle callout data update to widget on hidding of popover
     */
    _handleCalloutHide: function () {
      this._unregisterPopoverEvents();
      this._updateWidgetOptions();
    },

    _updateWidgetOptions: function () {
      var isValid = this.optionsFormView.validate();
      var updatedConfig = this.optionsFormView.getValues();
      this.perspectiveView.trigger("update:widget:options", this.widgetView, isValid,
          updatedConfig);
      if (isValid) {
        this.widgetView.$el.removeClass('binf-has-error');
      } else {
        this.widgetView.$el.addClass('binf-has-error');
      }
    },

    /**
     * Listen document click to close callouts
     */
    _documentClickHandler: function (event) {
      var self = event.data.view;
      if (!!$(event.target).closest('.binf-popover').length) {
        // Click on popover
        return;
      }
      if (self.$el.is(event.target) || !!self.$el.has(event.target).length) {
        // Click on current widget
        return;
      }
      if (!$.contains(document, event.target)) {
        // Not Exist in DOM
        return;
      }
      self._unregisterPopoverEvents();
      self.$popoverEl.binf_popover('destroy');
    },

    _onChangeField: function (field) {
      if (field.name === WidgetOptionsFormView.widgetSizeProperty) {
        // Notify perspective panel about size change to do respective DOM / style updates
        this.perspectiveView.trigger("update:widget:size", this.options.widgetView, field.value);
        // Close popover for now.
        this.$popoverEl.binf_popover('destroy');
        // TODO Re-position popover as widget size may change
        // this._calculatePopoverPlacement();
        // this._showPopover();
      }
    },

    _determineCalloutPlacement: function () {
      var offset    = this.$el.offset(),
          left      = offset.left,
          width     = $(document).outerWidth(),
          right     = $(document).width() - (left + this.$el.width()),
          isRtl     = i18n && i18n.settings.rtl,
          placement = isRtl ? right < 550 ? 'left' : 'right' : left < 550 ? 'right' : 'left',
          mirror    = false;
      var contentWidth = isRtl ? right + this.$el.width() + 500 :
                         this.$el.offset().left + this.$el.width() + 500;
      var documentWidth = $(document).width();
      if ((contentWidth > documentWidth) &&
          (!isRtl && placement == 'right' || isRtl && placement == 'left')) {
        placement = placement == 'right' ? 'left' : 'right';
        mirror = true;
      }
      return {
        placement: placement,
        mirror: mirror
      };
    },

    _isPreviewWidget: function () {
      return this.widgetConfig.type === WidgetMaskingView.perspectiveWidget;
    },

    _loadManifest: function () {
      if (this.manifest !== undefined) {
        return $.Deferred().resolve(this.manifest);
      }
      if (this._isPreviewWidget()) {
        // For widgets added using DnD, get manifest from perspective widget's options 
        // since Perspective widget will be added as preview for original widget
        this.manifest = this.widgetConfig.options.widget.get('manifest');
        return this._loadManifest();
      }
      var deferred = $.Deferred();
      var self        = this,
          widgetModel = new WidgetModel({id: this.widgetConfig.type});
      widgetModel.fetch().then(function () {
        self.manifest = widgetModel.get('manifest');
        deferred.resolve(self.manifest);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    onDeleteClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.deleteConfirmMsg, lang.deleteConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self._doDeleteWidget();
              }
            });
      });
    },

    _doDeleteWidget: function () {
      this.perspectiveView.trigger("delete:widget", this.widgetView);
    },

    _doReplaceWidget: function (widgetToReplace) {
      var manifest = (widgetToReplace.get('manifest') || {});
      this.perspectiveView.trigger('replace:widget', this.widgetView, {
        type: WidgetMaskingView.perspectiveWidget,
        kind: manifest.kind,
        options: {
          options: {}, // To be used and filled by callout form
          widget: widgetToReplace
        }
      });
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
      this.dropCounter++;
      this.$el.addClass('csui-widget-drop');
    },

    onDragLeave: function () {
      this.dropCounter--;
      if (this.dropCounter === 0) {
        this.$el.removeClass('csui-widget-drop');
      }
    },

    _extractWidgetToDrop: function (event) {
      var dragData = event.originalEvent.dataTransfer.getData("text");
      if (!dragData) {
        return undefined;
      }
      try { // TODO get rid of try catch and handle like non-droppable object
        var widgetToReplace = new WidgetModel(JSON.parse(dragData));
        return widgetToReplace;
      } catch (e) {
        // Unsupported drop
        return false;
      }
    },

    onDrop: function (event) {
      this.onDragLeave();
      var widgetToReplace = this._extractWidgetToDrop(event);
      if (!widgetToReplace) {
        return;
      }
      if (this.widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        this._doReplaceWidget(widgetToReplace);
      } else {
        var self = this;
        csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(lang.replaceConfirmMsg, lang.replaceConfirmTitle)
              .done(function (userConfirmed) {
                if (userConfirmed) {
                  self._doReplaceWidget(widgetToReplace);
                }
              });
        });
      }
    }

  }, {
    className: 'csui-configure-perspective-widget',
    perspectiveWidget: 'csui/perspective.manage/widgets/perspective.widget',
    placeholderWidget: 'csui/perspective.manage/widgets/perspective.placeholder',
    widgetSizeProperty: '__widgetSize'
  });

  var PerspectiveWidgetConfigurationBehaviour = Marionette.Behavior.extend({

    defaults: {
      perspectiveSelector: '.perspective-editing .cs-perspective > div'
    },

    constructor: function PerspectiveWidgetConfigurationBehaviour(options, view) {
      if (!options.perspectiveView) {
        throw new Marionette.Error({
          name: 'perspectiveView',
          message: 'Undefined perspectiveView options'
        });
      }
      this.perspectiveView = options.perspectiveView;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      _.extend(this.perspectiveView, {
        getPManPlaceholderWidget: function () {
          return {
            type: WidgetMaskingView.placeholderWidget,
            options: {}
          };
        }
      })
    },

    _ensureWidgetElement: function () {
      if (!_.isObject(this.$widgetEl)) {
        // Consider element to add mask can be provided through options
        this.$widgetEl = this.options.el ? $(this.options.el) : this.view.$el;
      }
      if (!this.$widgetEl || this.$widgetEl.length === 0) {
        throw new Marionette.Error('An "el" ' + this.$widgetEl.selector + ' must exist in DOM');
      }
      return true;
    },

    _checkAndApplyMask: function () {
      if (this.$el.find('.' + WidgetMaskingView.className).length > 0) {
        // Mask exist
        return;
      }
      this._ensureWidgetElement();

      // Get data configured to widget
      var widgetConfig = this._resolveWidgetConfiguration();
      var maskingView = new WidgetMaskingView(
          _.extend(this.options, {
            widgetView: this.view,
            widgetConfig: widgetConfig
          }));
      maskingView.render();
      this.$widgetEl.append(maskingView.el);
      this.$widgetEl.addClass('csui-pman-editable-widget')
      // To be used perspective.view to show placeholder watermark
      this.$widgetEl.data('pman.widget', {attributes: {manifest: widgetConfig}});
    },

    _resolveWidgetConfiguration: function () {
      if (!!this.view.model && !!this.view.model.get('widget')) {
        // Try model of widget view - Flow, LCR, Grid.. who even using grid control 
        return this.view.model.get('widget');
      }
      if (!!this.view.getPManWidgetConfig && _.isFunction(this.view.getPManWidgetConfig)) {
        // Widget configuration can be provided though a function 
        return this.view.getPManWidgetConfig();
      }
      if (!!this.options.widgetConfig) {
        // Can be provided through behaviour's options
        return this.options.widgetConfig;
      }
    },

    onRender: function () {
      this._checkAndApplyMask();
    },

    onDestroy: function () {
    },

  });

  return PerspectiveWidgetConfigurationBehaviour;

})
;
csui.define('csui/perspective.manage/pman.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/perspective.manage/impl/pman.panel.view',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'hbs!csui/perspective.manage/impl/pman',
  'css!csui/perspective.manage/impl/pman',
  'csui/perspective.manage/behaviours/pman.widget.config.behaviour'
], function (_, $, Backbone, Marionette, base, NonEmptyingRegion, PManPanelView, lang, template) {

  var pmanContainer;

  var PManView = Marionette.ItemView.extend({

    className: 'pman pman-container',
    template: template,

    templateHelpers: function () {
      return {
        addWidget: lang.addWidget,
        save: lang.save,
        cancel: lang.cancel
      };
    },

    ui: {
      "pmanPanel": ".pman-header .pman-pannel-wrapper",
      'cancelEdit': '.pman-header .cancel-edit',
      'addIcon': '.pman-header .icon-toolbarAdd',
      'saveBtn': '.pman-header .icon-save'
    },

    events: {
      'click @ui.cancelEdit': "onClickClose",
      'click @ui.addIcon': "togglePannel",
      'click @ui.saveBtn': "onClickSave"
    },

    constructor: function PManView(options) {
      options || (options = {});
      _.defaults(options, {
        applyMasking: this.applyMasking.bind(this),
        container: document.body
      });
      options.container = $(options.container);
      this.context = options.context;
      this._prepareForEdit(options.perspective || options.context.perspective);
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._registerEventHandler();
    },

    _registerEventHandler: function () {
      this.listenTo(this, 'change:layout', function (newLayoutType) {
        this.perspective.set('perspective', {
          type: newLayoutType,
          options: {perspectiveMode: 'edit'}
        }, {silent: true});
        this._triggerEditMode();
        this.togglePannel();
      });
      this.listenTo(this.context, 'save:perspective', this._savePerspective);
    },

    _prepareForEdit: function (originalPerspective) {
      if (!originalPerspective) {
        throw new Error("Missing perspective");
      }
      this.perspective = this._clonePrespective(originalPerspective);
      if (this.perspective.isNew()) {
        // No perspectives are configues to current node
        this.perspective.set('perspective', this._getDefaultPerspectiveConfig());
      }

      var perspectiveOptions = this.perspective.get('perspective').options || {};
      perspectiveOptions.perspectiveMode = 'edit';
    },

    _clonePrespective: function (original) {
      var perspectiveConfig = original.get('perspective');
      var config = JSON.parse(JSON.stringify(perspectiveConfig));
      original.set('perspective', config);
      return original;
    },

    show: function () {
      var container = this.getContainer(),
          region    = new NonEmptyingRegion({
            el: container
          });
      region.show(this);
      return this;
    },

    getContainer: function () {
      if (!pmanContainer || !$.contains(this.options.container, pmanContainer)) {
        pmanContainer = $('<div>', {'class': 'binf-widgets'}).appendTo(this.options.container)[0]
      }
      return pmanContainer;
    },

    /**
     * Default perspective when no perspectives configured for a container
     */
    _getDefaultPerspectiveConfig: function () {
      // TODO check if LCR is relevant to all containers.
      return {
        "type": "left-center-right",
        "options": {
          "center": {
            "type": "csui/widgets/nodestable"
          }
        }
      };
    },

    _fetchPerspective: function () {
      // TODO Handle Create perspective
      var self = this;
      if (!this.perspective.isNew()) {
        this.perspective.fetch().then(function () {
          // Enable save button
          self.ui.saveBtn.removeAttr('disabled');
        });
      } else {
        // Enable save button
        self.ui.saveBtn.removeAttr('disabled');
      }
    },

    /**
     * Updates / creates perspective
     */
    _savePerspective: function (updatedPerspective) {
      this.perspective.set('perspective', updatedPerspective);
      var self = this;
      // Save perspective to server
      this.perspective.save().then(function () {
        csui.require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          // Perspective save success
          GlobalMessage.showMessage("success", lang.perspectiveSaveSuccess);
          // Update context's perspective and exit from inline editing
          updatedPerspective.id = self.perspective.get('id');
          self.context.perspective.set(updatedPerspective);
          self._doExitPerspective();
        });
      }, function (error) {
        // API error while saving..
        var errorMessage;
        if (error && error.responseJSON && error.responseJSON.error) {
          errorMessage = error.responseJSON.error;
        } else {
          var errorHtml = base.MessageHelper.toHtml();
          base.MessageHelper.reset();
          errorMessage = $(errorHtml).text();
        }
        csui.require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("error", errorMessage);
        });
      });
    },

    onClickSave: function () {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmWarning(lang.saveConfirmMsg, lang.saveConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self.context.triggerMethod('serialize:perspective', self.perspective);
              }
            });
      });
    },

    onClickClose: function () {
      this._doExitPerspective();
    },

    togglePannel: function () {
      if (!this.ui.pmanPanel.hasClass('binf-active')) {
        // Reset before showing panel
        this._openToolsPanel();
      } else {
        this._closeToolsPanel();
      }
    },

    _openToolsPanel: function () {
      this.pmanPanelView.trigger('reset:items');
      this.ui.addIcon.addClass('binf-active');
      this.ui.addIcon.attr("title", lang.close);
      this.ui.pmanPanel.addClass('binf-active');
    },

    _closeToolsPanel: function () {
      this.ui.pmanPanel.removeClass('binf-active');
      this.ui.addIcon.attr("title", lang.addWidget);
      this.ui.addIcon.removeClass('binf-active');
    },

    applyMasking: function () {

    },

    _initializeWidgets: function () {
      this.pmanPanelRegion = new Marionette.Region({
        el: this.ui.pmanPanel
      });
      this.pmanPanelView = new PManPanelView({
        pmanView: this
      });
      this.pmanPanelRegion.show(this.pmanPanelView);
    },

    _triggerEditMode: function () {
      var perspectiveConfig = new Backbone.Model(this.perspective.get('perspective'));
      this.context.triggerMethod('enter:edit:perspective', perspectiveConfig);
    },

    onRender: function () {
      var self = this;
      this.options.container.addClass('perspective-editing');
      this.options.applyMasking();
      this._initializeWidgets();
      this._triggerEditMode();
      $(document).on('click.' + this.cid, {view: this}, this._documentClick);
      this._fetchPerspective();

    },

    _documentClick: function (event) {
      var self = event.data.view;
      if (self.ui.addIcon.is(event.target) || !!self.ui.addIcon.has(event.target).length) {
        // Add Icon
        return;
      }
      if (self.ui.pmanPanel.is(event.target) || !!self.ui.pmanPanel.has(event.target).length) {
        // Pman panel
        return;
      }
      self._closeToolsPanel();
    },

    /**
     * Edit from perspective inline editing mode.
     */
    _doExitPerspective: function () {
      this.options.container.removeClass('perspective-editing');
      this.context.triggerMethod('exit:edit:perspective', this.perspective);
      $(document).off('click.' + this.cid, this._documentClick);
      this.trigger('destroy');
    },

  }, {
    placeHolderWidget: 'csui/perspective.manage/widgets/perspective.placeholder'
  });

  return PManView;
});

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});
  
csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/root/lang',{
  dndWidgetsHere: 'Drag and Drop widgets here'
});
  


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-placeholder-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dndWidgetsHere || (depth0 != null ? depth0.dndWidgetsHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dndWidgetsHere","hash":{}}) : helper)))
    + "\">\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.dndWidgetsHere || (depth0 != null ? depth0.dndWidgetsHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dndWidgetsHere","hash":{}}) : helper)))
    + "\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_widgets_perspective.placeholder_impl_perspective.placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',[],function(){});
/**
 * Placeholder view to represent an empty widget in perpsective.
 * This will be replaces by perspective.widget (preview) on dropping of widgets on this
 */
csui.define('csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',
  'css!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectivePlaceholderView = Marionette.ItemView.extend({
    className: 'csui-perspective-placeholder',
    template: template,
    templateHelpers: function () {
      return {
        dndWidgetsHere: lang.dndWidgetsHere
      }
    },

    constructor: function (options) {
      Marionette.ItemView.apply(this, arguments);
    },

    onShow: function() {
      this.$el.parent().addClass('csui-pman-placeholder-container');
    },

    onDestroy: function() {
      this.$el.parent().removeClass('csui-pman-placeholder-container');
    }

  });
  return PerspectivePlaceholderView;
});
csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});
  
csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/root/lang',{
  noConfig: 'No configuration needed',
  clickToConfig: 'Click to configure'
});
  


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-header\">\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetTitle","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n</div>\r\n<div>\r\n  <div title=\""
    + this.escapeExpression(((helper = (helper = helpers.widgetMessage || (depth0 != null ? depth0.widgetMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetMessage","hash":{}}) : helper)))
    + "\" class=\"csui-pman-widget-msg\">\r\n    "
    + this.escapeExpression(((helper = (helper = helpers.widgetMessage || (depth0 != null ? depth0.widgetMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetMessage","hash":{}}) : helper)))
    + "\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_widgets_perspective.widget_impl_perspective.widget', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',[],function(){});
/**
 * Preview view of any widget
 */
csui.define('csui/perspective.manage/widgets/perspective.widget/perspective.widget.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',
  'css!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectiveWidgetView = Marionette.ItemView.extend({
    className: 'csui-pman-widget',
    template: template,
    templateHelpers: function () {
      var wConfig = this.widget.get("manifest");
      var noConfig = !wConfig || !wConfig.schema || !wConfig.schema.properties ||
                     _.isEmpty(wConfig.schema.properties);
      return {
        widgetTitle: this.widget.get('title'),
        widgetMessage: noConfig ? lang.noConfig : lang.clickToConfig
      }
    },

    constructor: function (options) {
      Marionette.ItemView.apply(this, arguments);
      this.widget = options.data.widget;
    }
  });
  return PerspectiveWidgetView;
});

csui.define('json!csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.manifest.json',{
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


csui.define('json!csui/perspective.manage/widgets/perspective.widget/perspective.widget.manifest.json',{
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

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/perspective.placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/root/perspective.placeholder.manifest',{
  dndWidgetsHere: 'Drag and Drop widgets here'
});


csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/perspective.widget.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/root/perspective.widget.manifest',{
  noConfig: 'No configuration needed',
  clickToConfig: 'Click to configure'
});


csui.define('bundles/csui-perspective',[
    'csui/perspective.manage/pman.view',
    'csui/perspective.manage/behaviours/pman.widget.config.behaviour',
    'csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.view',
    'csui/perspective.manage/widgets/perspective.widget/perspective.widget.view',
    
    // widgets manifests
    'json!csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.manifest.json',
    'json!csui/perspective.manage/widgets/perspective.widget/perspective.widget.manifest.json',

    'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/perspective.placeholder.manifest',
    'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/perspective.widget.manifest',
], {});
  
csui.require(['require', 'css'], function (require, css) {
    css.styleLoad(require, 'csui/bundles/csui-perspective', true);
});
  
