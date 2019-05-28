/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
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
