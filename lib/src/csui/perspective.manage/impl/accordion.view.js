/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
