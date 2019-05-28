/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/dialog/impl/footer.view',
  'hbs!csui/dialogs/node.picker/impl/footer/footer',
  'hbs!csui/dialogs/node.picker/impl/footer/selectedItems.info',
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/dialogs/node.picker/impl/footer/footer'
], function (_,
    $,
    Marionette,
    Backbone,
    ViewEventsPropagationMixin,
    TabableRegionBehavior,
    DialogFooterView,
    footerTemplate,
    selectedItemsMessageTemplate,
    lang) {

  var NodePickerSelectedItemsMessageView = Marionette.ItemView.extend({
    template: selectedItemsMessageTemplate,
    className: 'csui-selectedItems-message',

    templateHelpers: function () {
      var selectedItemsCount   = this.selectedItemsCnt || this.options.selectedItemsCnt,
          selectedItemsMessage = "";
      if (selectedItemsCount === 1) {
        selectedItemsMessage = _.str.sformat(lang.SelectOneItemMessage, selectedItemsCount);
      } else {
        selectedItemsMessage = _.str.sformat(lang.SelectManyItemsMessage, selectedItemsCount);
      }
      var data = {
        isMultiSelectEnabled: this.options.isMultiSelectEnabled,
        selectedItemsMessage: selectedItemsMessage
      };
      return data;
    },

    constructor: function NodePickerSelectedItemsMessageView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var selectedItemsCount = this.selectedItemsCnt || this.options.selectedItemsCnt;
      if (!selectedItemsCount) {
        this.$el.addClass('binf-hidden');
      } else {
        this.$el.removeClass('binf-hidden');
      }
    }
  });
  var NodePickerFooterView = Marionette.LayoutView.extend({

    template: footerTemplate,
    className: 'cs-footer-control',

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabableRegionBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    regions: {
      selectedItemsInfoRegion: '.csui-selected-items',
      buttonsRegion: '.csui-footer-buttons'

    },
    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    constructor: function NodePickerFooterView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();

    },

    initialize: function () {
      var options    = this.options,
          buttons    = options.buttons ? options.buttons : [],
          footerView = this.footerView = new DialogFooterView({
            collection: new Backbone.Collection(buttons)
          });
      this.messageView = new NodePickerSelectedItemsMessageView(_.extend({},
          {selectedItemsCnt: 0}));
      this.listenTo(footerView, 'childview:click', this.onClickButton);
      this.listenTo(this, 'selectedItems:updateCount', this.updateSelectedItems);
    },

    onRender: function () {
      this.buttonsRegion.show(this.footerView);
    },

    updateButton: function (id, options) {
      var footerView = this.footerView;
      footerView.updateButton(id, options);
    },

    onClickButton: function (view) {
      var attributes = view.model.attributes;
      if (attributes.click) {
        attributes.click({
          dialog: this,
          button: this.$el
        });
      }
      if (attributes.close) {
        this.destroy();
      }
    },

    updateSelectedItems: function (selectedItemsCnt) {
      this.messageView = new NodePickerSelectedItemsMessageView(_.extend({},
          {
            selectedItemsCnt: selectedItemsCnt,
            isMultiSelectEnabled: this.options.isMultiSelectEnabled
          }));
      this.selectedItemsInfoRegion.show(this.messageView);
    },

    onBeforeDestroy: function () {
      this.footerView.destroy();
      this.messageView.destroy();
    }

  });

  _.extend(NodePickerFooterView.prototype, ViewEventsPropagationMixin);
  return NodePickerFooterView;
});




