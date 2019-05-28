/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/utils/base',
    'csui/models/ancestor', 'csui/models/node/node.model'
], function (_, base, AncestorModel, NodeModel) {
  'use strict';

  var SearchResponseMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSearchResponse: function (options) {
          return this;
        },
        parseSearchResponse: function (resp, options) {
          var sorting = resp.collection.sorting;
          if (sorting) {
            this.previousQuery = this.options.query.attributes.where;
          }
          this.previousOrderBy = this.orderBy;
          this.excludeSelectedAndInvalidFacets(resp);
          var jsonResponse = resp.results;
          if (jsonResponse) {
            for (var response in jsonResponse) {
              if (jsonResponse.hasOwnProperty(response)) {
                if (!!jsonResponse[response].data && !!jsonResponse[response].data.properties) {
                  if (!!jsonResponse[response].data.versions &&
                      !!jsonResponse[response].data.versions.file_size) {
                    jsonResponse[response].data.properties.size = jsonResponse[response].data.versions.file_size;
                  }
                  if (!!jsonResponse[response].data.versions &&
                      !!jsonResponse[response].data.versions.version_id) {
                    jsonResponse[response].data.properties.version_id = jsonResponse[response].data.versions.version_id;
                  }
                  if (!!jsonResponse[response].data.properties &&
                      !!jsonResponse[response].data.properties.container &&
                      jsonResponse[response].data.properties.container) {
                    jsonResponse[response].data.properties.size = jsonResponse[response].data.properties.container_size;
                  }
                  if (!!jsonResponse[response].data.properties.summary) {
                    jsonResponse[response].data.properties.summary = this.jsonToStringTokenizer(
                        jsonResponse[response].data.properties.summary);
                  }
                  if (!!jsonResponse[response].data.properties.reserved_user_id_expand) {
                    jsonResponse[response].data.properties.reserved_user_id = jsonResponse[response].data.properties.reserved_user_id_expand;
                  }
                }

                if (!!jsonResponse[response].links && !!jsonResponse[response].links.ancestors) {
                  var breadcrumbsObj = [],
                      ancestors      = jsonResponse[response].links.ancestors,
                      ancestorIds    = [];
                  if (ancestors) {
                    for (var breadcrumbIdx in ancestors) {
                      if (ancestors.hasOwnProperty(breadcrumbIdx)) {
                        var ancestorModel = new AncestorModel();
                        var breadcrumbIndex = parseInt(breadcrumbIdx, 10),
                            breadcrumbItem  = {};
                        var currentObject = ancestors[breadcrumbIndex];
                        breadcrumbItem.id = currentObject.href.substring(
                            currentObject.href.lastIndexOf("/") + 1,
                            currentObject.href.length);
                        breadcrumbItem.volume_id = breadcrumbIndex === 0 ?
                                                   breadcrumbItem.id : ancestorIds[0];
                        breadcrumbItem.parent_id = breadcrumbIndex === 0 ? '-1' :
                                                   ancestorIds[breadcrumbIndex - 1];
                        if (NodeModel.usesIntegerId) {
                          breadcrumbItem.id = parseInt( breadcrumbItem.id );
                          breadcrumbItem.volume_id = parseInt(breadcrumbItem.volume_id);
                          breadcrumbItem.parent_id = parseInt(breadcrumbItem.parent_id);
                        }
                        ancestorIds.push(breadcrumbItem.id);
                        breadcrumbItem.name = currentObject.name;
                        breadcrumbItem.showAsLink = true;
                        ancestorModel.attributes = breadcrumbItem;
                        breadcrumbsObj.push(ancestorModel);
                      }
                    }
                  }
                  jsonResponse[response].data.properties.ancestors = breadcrumbsObj;
                }
                if (!!jsonResponse[response].search_result_metadata) {
                  jsonResponse[response].data.properties.search_result_metadata = jsonResponse[response].search_result_metadata;
                }
              }
            }
          }
        },

        jsonToStringTokenizer: function (jsonSummary) {
          var highlightedSummary = "";
          for (var summary in jsonSummary) {
            if (jsonSummary.hasOwnProperty(summary)) {
              highlightedSummary += !!jsonSummary[summary].type ?
                                    " <HH>" + jsonSummary[summary].text + "</HH> " :
                                    jsonSummary[summary];
            }
          }
          return highlightedSummary;
        },

        parseBrowsedItems: function (response, options) {
          return response.results;
        },
        excludeSelectedAndInvalidFacets: function (response) {
          var searching = response.collection.searching;
          if (!!searching && !!searching.facets && !!searching.facets.available) {
            var availableFacets = searching.facets.available;
            if (!!searching.facets.selected) {
              var selectedFacets = searching.facets.selected;
              var len1 = selectedFacets.length;
              for (var i = 0; i < len1; i++) {
                var len2 = availableFacets.length;
                for (var j = 0; j < len2; j++) {
                  var availableName = availableFacets[j].name;
                  if (availableName === 'OTObjectSize') {
                    availableFacets.splice(j, 1);
                    len2 = availableFacets.length;
                    j--;
                  } else if (availableName === selectedFacets[i].name) {
                    var len3 = selectedFacets[i].facet_items.length;
                    for (var k = 0; k < len3; k++) {
                      var len4 = availableFacets[j].facet_items.length;
                      for (var l = 0; l < len4; l++) {
                        if (availableFacets[j].facet_items[l].display_name ===
                            selectedFacets[i].facet_items[k].display_name) {
                          availableFacets[j].facet_items.splice(l, 1);
                          l--;
                          len4 = availableFacets[j].facet_items.length;
                        }

                      }
                    }
                  } else if (availableFacets[j].facet_items.length === 0) {
                    availableFacets.splice(j, 1);
                    len2 = availableFacets.length;
                    j--;
                  }

                }
              }
            }
          }
        }
      });
    }
  };

  return SearchResponseMixin;
});
