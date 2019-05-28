/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
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
