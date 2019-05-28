/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'workflow/models/workitem/workitem.model',     // Model to create the factory for
  'workflow/models/workflow/workflow.model'
], function ($, _, ModelFactory, ConnectorFactory, WorkItemModel, WorkflowModel) {
  'use strict';

  var WorkItemModelFactory = ModelFactory.extend({
    propertyPrefix: 'workitem',

    constructor: function WorkItemModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new WorkItemModel(undefined, {
        connector: connector
      });

      this.workflow = new WorkflowModel(undefined, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {

      var isDoc   = this.property.get('isDoc'),
          mapList = this.property.get('mapsList'),
          dfd     = $.Deferred();

      if (isDoc && !(this.property.get('process_id') || this.property.get('draft_id'))) {

        if (mapList && mapList.length > 0) {
          return dfd.resolve(this.property);

        } else {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));

          return dfd.promise();

        }

      } else if (this.property.get('isDocDraft')) {
        var model = this.property.fetch({silent: true});
        model.done(_.bind(function (resp) {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));
        }, this))
            .fail(_.bind(function (error) {
              dfd.reject(error);
            }, this));
        return dfd.promise();
      } else {
        return this.property.fetch(options);
      }
    }

  });

  return WorkItemModelFactory;

});
