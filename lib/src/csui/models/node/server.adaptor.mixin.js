/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'i18n!csui/models/node/impl/nls/lang', 'csui/models/utils/v1tov2'
], function (_, $, Url, lang, v1tov2) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        isFetchableDirectly: function () {
          return this.get('id') > 0;
        },
        urlCacheBase: function () {
          var url = this.urlBase();
          if (url.indexOf('/volumes') < 0) {
            url = url.replace('/api/v1/', '/api/v2/');
          }
          return url + '?';
        },

        urlBase: function () {
          var id  = this.get('id'),
              url = this.connector.connection.url;
          if (!id) {
            url = Url.combine(url, 'nodes');
          } else if (id === 'volume') {
            url = Url.combine(url, 'volumes', this.get('type'));
          } else if (!_.isNumber(id) || id > 0) {
            url = Url.combine(url, 'nodes', id);
          } else {
            throw new Error('Unsupported id value');
          }
          if (this.options.apiVersion) {
            url.getApiBase(this.options.apiVersion);
          }
          return url;
        },

        url: function () {
          var url = this.urlBase(),
              query;
          if (!this.isNew()) {
            if (this.get('id') === 'volume') {
              var expands = v1tov2.expandsV2toV1(this.expand);
              if (expands.length) {
                query = $.param({expand: expands}, true);
              }
            } else {
              if (this.collection) {
                query = this._getCombinedUrlQuery();
              } else {
                query = Url.combineQueryString(
                    this.getExpandableResourcesUrlQuery(),
                    this.getAdditionalResourcesUrlQuery(),
                    this.getResourceFieldsUrlQuery(),
                    this.getRequestedCommandsUrlQuery()
                );
              }
              if (!/\bfields=properties\b/.test(query)) {
                query = Url.combineQueryString(query, 'fields=properties');
              }
            }
          }

          return query ? url + '?' + query : url;
        },

        _getCombinedUrlQuery: function () {
          var collection     = this.getV2ParameterSource(),
              queryParts     = [
                'getExpandableResourcesUrlQuery',
                'getAdditionalResourcesUrlQuery',
                'getResourceFieldsUrlQuery'
              ].map(function (method) {
                var parameters = this[method]();
                if (_.isEmpty(parameters)) {
                  method = collection[method];
                  if (method) {
                    return method.call(collection);
                  }
                }
                return parameters;
              }, this),
              method         = this.delayRestCommands ?
                               'getRequestedCommandsUrlQuery' :
                               'getAllCommandsUrlQuery',
              commands       = this[method](),
              commandOptions = {};
          if (_.isEmpty(commands)) {
            method = collection.getAllCommandsUrlQuery ||
                     collection.getRequestedCommandsUrlQuery;
            if (method) {
              commands = method.call(collection);
            }
          }
          if (!!this.refernce_id || !!this.attributes.reference_id) {
            commandOptions.reference_id = this.refernce_id || this.attributes.reference_id;
          }
          return Url.combineQueryString.apply(Url, queryParts.concat(commands, commandOptions));
        },

        parse: function (response) {
          var results    = response.results || response,
              resultData = results.data,
              data       = resultData && (resultData.id || resultData.properties) && resultData,
              node       = data && data.properties || data || response;
          if (response.type !== undefined) {
            node.type = response.type;
          }
          if (response.type_name !== undefined) {
            node.type_name = response.type_name;
          }
          if (data && data.versions) {
            node.versions = data.versions;
          }
          _.extend(node, response.type_info);
          if (node.versions) {
            var version = node.versions;
            if (_.isArray(version)) {
              version = version[version.length - 1];
            }
            if (version) {
              _.extend(node, _.pick(version, ['file_size', 'mime_type',
                'version_id', 'version_number',
                'version_number_major',
                'version_number_minor']));
            }
          }
          _.defaults(node, {
            perspective: results && results.perspective || response.perspective
          });
          this._parseActions(node, results, response);
          var original = node.original_id && node.original_id.id ?
                         node.original_id : node.original_id_expand;
          if (original) {
            this._parseActions(original, {}, {});
          }
          var parent = node.parent_id && node.parent_id.id ?
                       node.parent_id : node.parent_id_expand;
          if (parent) {
            this._parseActions(parent, {}, {});
            if (!parent.actions.length) {
              this._makeAccessible(parent);
            }
          }
          if (node.type === 140 && !node.url) {
            var defaultAction = _.findWhere(node.actions, {signature: 'default'});
            node.url = defaultAction && defaultAction.href;
          }
          node.addable_types = response.addable_types;
          var columns = data && data.columns;
          if (columns) {
            node.columns = this._parseColumns(columns, response);
          }
          var definitions = response.definitions || results.metadata &&
                                                    results.metadata.properties;
          if (definitions) {
            node.definitions = this._parseDefinitions(definitions, columns);
          }
          if (data && data.properties) {
            node.data = _.omit(data, 'columns', 'metadata', 'properties');
          } else {
            node.data = {};
          }
          if (this.collection && this.collection.node && this.collection.node.get('type') === 298) {
            node.reference_id = this.collection.node.get('id');
          }
          if (this.get('csuiLazyActionsRetrieved') === undefined &&
              !!this.get('csuiDelayedActionsRetrieved') && !_.isEmpty(this.changed)) {
            node.csuiLazyActionsRetrieved = true;
          }
          return node;
        },

        _parseColumns: function (columns, response) {
          var columnKeys = response.definitions_order ||
                           columns && _.pluck(columns, 'key');
          return _.map(columnKeys, function (key) {
            return {key: key};
          });
        },

        _parseDefinitions: function (definitions, columns) {
          if (!definitions.size &&
              (definitions.container_size || definitions.file_size)) {
            definitions.size = definitions.container_size ||
                               definitions.file_size;
            definitions.size.key = 'size';
            definitions.size.name = lang.sizeColumnTitle;
          }
          if (columns) {
            _.each(columns, function (column) {
              var columnKey  = column.key,
                  definition = definitions[columnKey];
              if (!definition) {
                definition = definitions[columnKey] = {
                  name: column.name,
                  type: column.data_type,
                  sort: column.sortable
                };
              }
              var supportedPersonas = ['user', 'group', 'member'];
              if ($.inArray(definition.persona, supportedPersonas) !== -1) {
                definition.type = 14;
              }
              var sortKey = column.sort_key;
              if (sortKey) {
                definition.sort_key = sortKey;
                definition.sort = true;
              }
            });
            _.each(columns, function (column) {
              var columnKey      = column.key,
                  formattedIndex = columnKey.lastIndexOf('_formatted');
              if (formattedIndex >= 0) {
                var realColumnKey = columnKey.substr(0, columnKey.length - 10),
                    definition    = definitions[realColumnKey];
                if (!definition) {
                  definition = definitions[realColumnKey] = {
                    name: column.name,
                    type: column.data_type,
                    sort: column.sortable
                  };
                }
                var sortKey = column.sort_key;
                if (sortKey) {
                  definition.sort_key = sortKey;
                  definition.sort = true;
                }
              }
            });
          }
          return _.map(definitions, function (definition, key) {
            if (!definition.key) {
              definition.key = key;
            }
            return definition;
          });
        },

        _parseActions: function (node, results, response) {
          var actions = node.actions || response.actions ||
                        response.available_actions,
              commands;
          if (_.isArray(actions)) {
            _.each(actions, function (action) {
              if (!action.signature) {
                action.signature = action.type;
                action.name = action.type_name;
                delete action.type;
                delete action.type_name;
              }
            });
            commands = _.reduce(actions, function (result, action) {
              result[action.signature] = {};
              return result;
            }, {});
            node.actions = actions;
          } else {
            commands = node.commands || response.commands || response.actions ||
                       results && results.actions || {};
            if (commands.data && commands.order && commands.map) {
              commands = commands.data;
            }
            node.actions = _.chain(commands)
                .keys()
                .map(function (key) {
                  var attributes = commands[key];
                  attributes.signature = key;
                  return attributes;
                })
                .value();
            delete node.commands;
            delete node.commands_map;
            delete node.commands_order;
          }
        },
        _makeAccessible: function (original) {
          original.actions = [
            {signature: 'open'}
          ];
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
