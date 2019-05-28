/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/jquery', 'csui/lib/backbone',
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
          self.widgetDragTemplate = new widgetDragTemplateView({
            title: self.model.attributes.title,
            newWidget: self.model
          });
          self.widgetDragTemplate.render();
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
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.csui-pman-list',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.call(this, options);
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
      require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlertView) {
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

