/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/nls/localized.strings', 'csui/utils/log',
  'csui/utils/url', 'csui/models/command', 'csui/models/node/node.model',
  'csui/utils/node.links/node.links'
], function (module, require, _, $, lang, log, Url, CommandModel, NodeModel,
    nodeLinks) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var GlobalMessage, ModalAlert, ConflictResolver, TaskQueue,
      PageLeavingBlocker, ConnectorFactory, NextNodeModelFactory;

  var SaveFilterCommand = CommandModel.extend({
    defaults: {
      signature: "SaveFilter",
      command_key: ['savefilter', 'SaveFilter'],
      name: lang.CommandNameSaveFilter,
      verb: lang.CommandVerbSaveFilter
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.suppressSuccessMessage = true;
      require([
        'csui/controls/globalmessage/globalmessage',
        'csui/dialogs/modal.alert/modal.alert',
        'csui/controls/conflict.resolver/conflict.resolver',
        'csui/utils/taskqueue', 'csui/utils/page.leaving.blocker',
        'csui/utils/contexts/factories/connector',
        'csui/utils/contexts/factories/next.node'
      ], function () {
        GlobalMessage = arguments[0];
        ModalAlert = arguments[1];
        ConflictResolver = arguments[2];
        TaskQueue = arguments[3];
        PageLeavingBlocker = arguments[4];
        ConnectorFactory = arguments[5];
        NextNodeModelFactory = arguments[6];

        self._selectSaveFilterOptions(status, options)
            .done(function (selectedOptions) {
              var selectedNodes = status.nodes,
                  facets        = status.facets,
                  targetFolder  = selectedOptions.nodes[0],
                  filterName    = selectedOptions.filterName;
              var url = status.connector.connection.url.replace('/v1', '/v2');
              var selectedFacets = [];
              $.each(facets.filters, function (idx, facet) {
                var facettypes = [], facetArrayType = [];
                if (facet.values instanceof Array) {
                  $.each(facet.values, function (index, facettype) {
                    facettypes.push(facettype.id);
                  });
                  facetArrayType.push(facet.id);
                  facetArrayType.push(facettypes);
                  selectedFacets.push(facetArrayType);
                }
              });
              var ajaxFormData = {
                'type': 899,
                'location_id': selectedNodes.models[0].get("id"),
                'name': filterName,
                'parent_id': targetFolder.get("id"),
                'selected_facets': selectedFacets
              };
              var formData = new FormData();
              var saveFilterOptions = status.connector.extendAjaxOptions({
                url: url + '/nodes',
                type: 'POST',
                data: 'body=' + encodeURIComponent(JSON.stringify(ajaxFormData)),
                contentType: 'application/x-www-form-urlencoded'
              });

              $.ajax(saveFilterOptions)
                  .done(function (resp) {
                    deferred.resolve(resp.results);
                    var virtualFolderId   = resp.results.data.properties.id,
                        virtualFolderNode = new NodeModel({id: virtualFolderId},
                            {connector: context.getObject(ConnectorFactory)}),
                        name              = resp.results.data.properties.name,
                        msg               = _.str.sformat(lang.SaveFilterCommandSuccessfully, name),
                        options           = {
                          context: context,
                          nextNodeModelFactory: NextNodeModelFactory,
                          link_url: nodeLinks.getUrl(virtualFolderNode),
                          targetFolder: virtualFolderNode
                        },
                        dets; // leave details as undefined;
                    GlobalMessage.showMessage('success_with_link', msg, dets, options);
                  })
                  .fail(function (error) {
                    deferred.reject(error);
                    if (error && error.responseText) {
                      var errorObj = JSON.parse(error.responseText);
                      GlobalMessage.showMessage('error', errorObj.error);
                    }
                  });

            }).fail(function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _selectSaveFilterOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var numNodes = status.nodes.length;
            var pickerOptions = _.extend({
              command: 'savefilter',
              selectableTypes: [-1],
              showAllTypes: true,
              orderBy: 'type asc',
              dialogTitle: lang.DialogTitleSaveFilter,
              initialContainer: status.container || status.nodes.models[0].parent,
              initialSelection: status.nodes,
              startLocation: '',
              includeCombineProperties: (numNodes === 1),
              propertiesSeletor: false,
              saveFilter: true,
              globalSearch: true,
              context: options ? options.context : status.context,
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers'],
              resolveShortcuts: true,
              resultOriginalNode: true
            }, status);

            self.nodePicker = new NodePicker(pickerOptions);

            self.nodePicker
                .show()
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                })
                .fail(function (error) {
                  deferred.reject.apply(deferred, arguments);
                });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }
  });

  return SaveFilterCommand;
});
