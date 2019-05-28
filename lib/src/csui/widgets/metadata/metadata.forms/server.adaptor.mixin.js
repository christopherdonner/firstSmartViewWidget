/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/base', 'csui/utils/url',
  'csui/models/appliedcategories', 'csui/models/form',
  'csui/models/appliedcategoryform', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/models/nodecreateforms','csui/models/nodeupdateforms',
  'csui/models/node/node.model', 'csui/models/version'
], function ($, _, Backbone, log, base, Url,
    AppliedCategoryCollection, FormModel, AppliedCategoryFormModel, lang,
    NodeCreateFormCollection, NodeUpdateFormCollection, NodeModel,
    VersionModel) {
  'use strict';

  var prototypeExt = {

    makeServerAdaptor: function (options) {
      return this;
    },

    sync: function (method, model, options) {

      if (method === 'read') {
        if (this.action === 'copy' || this.action === 'move') {
          return this._getMetadataCopyMoveItemForms(method, model, options);
        } else if (this.action === 'create' || this.node.get("id") === undefined) {
          return this._getMetadataAddItemForms(method, model, options);
        } else {  // the main metadata case
          if (this.node instanceof VersionModel) {
            return this._getMetadataVersionsForms(method, model, options);
          } else {
            return this._getMetadataForms(method, model, options);
          }
        }

      } else {
        return Backbone.Collection.prototype.sync.apply(this, arguments);
      }

    },
    _getMetadataForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);
      var node       = this.node,
          type       = node.get('type'),
          categories = new NodeUpdateFormCollection(undefined, {node: node});
      return categories
          .fetch()
          .then(_.bind(function (data, status, jqXHR) {
            this.options = options;
            this.forms = categories.models;
            if (options.success) {
              options.success(this.forms, 'success');
            }            
          }, this))
          .fail(function (request, message, statusText) {
            if (options.error) {
              options.error(request, message, statusText);
            }
          });
    },
    _getMetadataVersionsForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var deferred = $.Deferred();

      var version = this.node;
      var nodeId = version.get('id');
      var verNum = version.get('version_number');
      var connector = version.connector;

      var versionCatsUrl = Url.combine(connector.connection.url, 'forms/nodes/versions/categories');
      var getCategoriesOptions = connector.extendAjaxOptions({
        url: versionCatsUrl + '?' +
             $.param({
               id: nodeId,
               version_number: verNum
             })
      });

      $.ajax(getCategoriesOptions)
          .done(_.bind(function (response, statusText, jqxhr) {

            var forms = [];
            var allCategoriesForm = response.forms[0];
            if (allCategoriesForm) {
              var roleName = "categories";
              if (this.roles === undefined) {
                this.roles = {};
              }
              if (this.roles[roleName] === undefined) {
                this.roles[roleName] = {};
              }

              var catIds = _.keys(allCategoriesForm.options.fields);
              _.each(catIds, function (catId) {
                var catName = allCategoriesForm.schema.properties[catId].title;
                var catData = allCategoriesForm.data[catId];
                var catOptions = allCategoriesForm.options.fields[catId];
                var catSchema = allCategoriesForm.schema.properties[catId];
                if (NodeModel.usesIntegerId) {
                  catId = parseInt(catId);
                }
                var catModel = new AppliedCategoryFormModel({
                  id: catId,
                  title: catName,
                  allow_delete: false
                }, {
                  node: this.node,
                  categoryId: catId,
                  action: 'none'
                });
                forms.push(catModel);

                catModel.set({
                  data: catData,
                  options: catOptions,
                  schema: _.omit(catSchema, ['description']),
                  role_name: roleName,
                  removeable: false
                });
              }, this);
            }

            if (options.success) {
              options.success(forms, 'success');
            }
            deferred.resolve();

          }, this))
          .fail(function () {
            deferred.reject.apply(deferred, arguments);
          });

      return deferred.promise();
    },
    _getMetadataAddItemForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var nData       = this.node.get('data'),
          createForms = this.formCollection ||
                        new NodeCreateFormCollection(undefined, {
                          node: this.container,
                          docParentId: this.node.get('docParentId'),
                          type: this.node.get('type')
                        }),
          data        = this.node.get('forms') || undefined,
          xhr         = this.node.get('xhr') || undefined,
          pushresp    = {};

      if (!!data && !!xhr) {
        data.forms[0].id = 'general';

        this._pushForms(data, nData, options);
        this.fetching = false;
        this.fetched = true;
        return $.Deferred().resolve();
      }
      else {
        return createForms
            .fetch()
            .then(_.bind(function (data, status, jqXHR) {

              this._pushForms(data, nData, options);
            }, this))
            .fail(function (jqXHR, textStatus, errorThrown) {
              if (options.error) {
                options.error(jqXHR, textStatus, errorThrown);
              }
            });
      }

    },

    _pushForms: function (data, nData, options) {
      var forms = [];
      var name = this.node.get('name');
      if (name !== undefined) {
        data.forms[0].data.name = name;
      }
      var addableType = this.node.get('type');
      if (addableType === 1) {  // Shortcut
        var original_id = this.node.get('original_id');
        if (original_id !== undefined) {
          data.forms[0].data.original_id = original_id;
        }
      } else if (addableType === 140) {  // URL
        var url = this.node.get('url');
        if (url && url.length > 0) {
          data.forms[0].data.url = url;
        }
      } else if (addableType === 144) {  // Document
        if (name !== undefined) {
          data.forms[0].data.file = name;
        }
        if (nData) {
          var fData = data.forms[0].data;
          nData.name && (fData.name = nData.name);
          nData.description && (fData.description = nData.description);
          nData.advanced_versioning &&
          (fData.advanced_versioning = nData.advanced_versioning);
        }
      }

      _.each(data.forms, function (form) {
        if (form.role_name === 'categories') {
          this._pushCategoryForms(form, forms, options);
        } else {
          forms.push(new FormModel(form));
        }
      }, this);

      if (options.success) {
        options.success(forms, 'success');
      }
    },

    _pushCategoryForms: function (multiForm, targetForms, options) {
      var nData  = this.node.get('data'),
          catIds = _.keys(multiForm.options.fields);
      _.each(catIds, function (catId) {
        if (_.indexOf(this.node.removedCategories, catId) === -1) {
          var catName = multiForm.schema.properties[catId].title,
              catData = multiForm.data[catId];
          if (nData && nData.roles && nData.roles.categories &&
              nData.roles.categories[catId]) {
            catData = _.extend(catData, nData.roles.categories[catId]);
          }
          var catOptions = multiForm.options.fields[catId];
          var catSchema = _.omit(multiForm.schema.properties[catId], 'description');
          if (NodeModel.usesIntegerId) {
            catId = parseInt(catId);
          }
          var catModel = new AppliedCategoryFormModel({
            id: catId,
            title: catName,
            data: catData,
            options: catOptions,
            schema: catSchema,
            role_name: 'categories',
            allow_delete: (catOptions && catOptions.removeable === false) ? false : true,
            removeable: (catOptions && catOptions.removeable === false) ? false : true
          }, {
            node: this.node,
            categoryId: catId,
            action: 'none'
          });
          if (options.reset) {
            targetForms.push(catModel);
          } else {
            this.add(catModel);
          }
        }
      }, this);
    },
    _getMetadataCopyMoveItemForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var deferred    = $.Deferred(),
          self        = this,
          nodeId      = this.node.get('id'),
          connector   = this.container.connector,
          inheritance = {original: 0, destination: 1, merged: 2},
          formUrl;

      if (self.action === 'copy') {
        formUrl = '/forms/nodes/copy';
      } else if (self.action === 'move') {
        formUrl = '/forms/nodes/move';
      }
      var getCategoriesOptions = connector.extendAjaxOptions({
        url: connector.connection.url + formUrl + '?' +
             $.param({
               id: nodeId,
               parent_id: self.container.get('id'),
               inheritance: inheritance[self.inheritance]
             })
      });

      $.ajax(getCategoriesOptions)
          .done(function (response, statusText, jqxhr) {

            var forms = [];
            var allCategoriesForm;
            if (response.forms.length > 1) {
              allCategoriesForm = _.find(response.forms, function (form) {
                return form.role_name === "categories";
              });
            }
            if (allCategoriesForm) {
              var roleName = allCategoriesForm.role_name;
              if (self.roles === undefined) {
                self.roles = {};
              }
              if (self.roles[roleName] === undefined) {
                self.roles[roleName] = {};
              }

              var prevDataOnNode = self.node.get('data');
              var prevCatDataOnNode = {};
              if (prevDataOnNode && prevDataOnNode.roles && prevDataOnNode.roles[roleName]) {
                prevCatDataOnNode = prevDataOnNode.roles[roleName];
              }

              var catIds = _.keys(allCategoriesForm.options.fields);
              _.each(catIds, function (catId) {
                if (_.indexOf(self.node.removedCategories, catId) === -1) { //don't show
                  var catName      = allCategoriesForm.schema.properties[catId].title,
                      catData      = allCategoriesForm.data[catId],
                      catOptions   = allCategoriesForm.options.fields[catId],
                      catSchema    = allCategoriesForm.schema.properties[catId],
                      correctCatId = NodeModel.usesIntegerId ? parseInt(catId) : catId,
                      catModel     = new AppliedCategoryFormModel({
                        id: correctCatId,
                        title: catName,
                        allow_delete: true
                      }, {
                        node: self.node,
                        categoryId: correctCatId,
                        action: 'none'
                      });

                  forms.push(catModel);
                  if (_.isEmpty(prevCatDataOnNode[catId]) === false) {
                    _.each(catData, function (iValue, iKey) {
                      if (_.has(prevCatDataOnNode[catId], iKey)) {
                        catData[iKey] = prevCatDataOnNode[catId][iKey];
                      }
                    });
                  }
                  catModel.set({
                    data: catData,
                    options: catOptions,
                    schema: _.omit(catSchema, ['description']),
                    role_name: roleName,
                    removeable: true
                  });
                }
              });
            }

            if (options.success) {
              options.success(forms, 'success');
            }
            deferred.resolve();

          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            if (options.error) {
              options.error(jqXHR, textStatus, errorThrown);
            }
            deferred.reject.apply(deferred, arguments);
          });

      return deferred.promise();
    }
  };

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, prototypeExt);
    }
  };

  return ServerAdaptorMixin;
});
