/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  'use strict';
  var WorkflowModel = Backbone.Model.extend({

    defaults: {
      workflow_id: 0
    },
    constructor: function WorkflowModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },
    createDraftProcess: function () {
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var postUrl = Url.combine(baseUrl, 'draftprocesses');
      var content = {workflow_id: this.get('workflow_id'),doc_ids : this.get('DocIDs')};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));
      var ajaxOptions = {
        type: 'POST',
        url: postUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp.results);
          }, this))
          .fail(_.bind(function (resp) {
            dfd.reject(resp.responseJSON.error);
          }, this));
      return dfd;
    },
    getDocumentWorkflows: function () {

      var generateUrl = function (attributes) {
        var url         = '',
            docIds      = (attributes.doc_id) ? attributes.doc_id.split(',') : attributes.DocIDs,
            selectionID = $("#selectionID");

        _.each(docIds, function (docId) {
          url = url.concat('doc_id').concat('=').concat(docId).concat('&');
        });

        if (attributes.ParentID) {
          url = url.concat('parent_id=').concat(attributes.ParentID);
        }
        if (attributes.checkEnabled) {
          url = url.concat('&checkEnabled=').concat(attributes.checkEnabled);
        }
        if (selectionID.length === 0) {
          var firstRow = $("#tableview tbody>tr")[0];
          if(firstRow){
            $('<input>').attr({
              type: 'hidden',
              id: 'selectionID',
              value: _.uniqueId()
            }).appendTo(firstRow);
            selectionID = $("#selectionID");
          }
        }
        if(selectionID.val()){
          url = url.concat('&selectionID=').concat(selectionID.val());
        }
        if (attributes.newDocID) {
          _.each(attributes.newDocID, function (docId) {
            url = url.concat('&newDocID').concat('=').concat(docId);
          });

          
        }
        return url;
      };
      var baseUrl     = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl      = Url.combine(baseUrl, 'docworkflows?' + generateUrl(this.attributes)),
          dfd         = $.Deferred(),
          ajaxOptions = {
            type: 'GET',
            url: getUrl,
            async: (this.get("CheckEnable")) ? false : true
          };

      this.connector && this.connector.extendAjaxOptions(ajaxOptions);
      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            if (!this.get("CheckEnable")) {
              if (resp.results.data.length === 1) {
                this.set("workflow_id", resp.results.data[0].DataID);
                this.set("resp", resp.results);
                this.createDraftProcess()
                    .done(_.bind(function (resp) {
                      var response = this.get("resp");
                      response.data[0].draftprocess_id = resp.draftprocess_id;
                      dfd.resolve(response);
                    }, this))
                    .fail(_.bind(function (error) {
                      dfd.reject(error);
                    }, this));
              } else {
                dfd.resolve(resp.results);
              }
            } else {
              dfd.resolve(resp.results);
            }
          }, this))
          .fail(_.bind(function (resp) {
            dfd.reject(resp);
          }, this));
      return dfd;
    }
  });

  return WorkflowModel;
});
