/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette',
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
