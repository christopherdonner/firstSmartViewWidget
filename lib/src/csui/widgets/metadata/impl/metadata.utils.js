/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/url",
  "csui/widgets/metadata/impl/metadata.forms"
], function (_, $, Backbone, Url, MetadataFormCollection) {

  function MetadataUtils() {
  }

  _.extend(MetadataUtils.prototype, Backbone.Events, {
    ContainerHasEnforcedEmptyRequiredMetadata: function (options) {
      var deferred = $.Deferred();
      var tempNode = new Backbone.Model({
        name: options.name,
        id: options.id,
        docParentId: options.docParentId,
        type: options.addableType
      });
      if (options.enforcedRequiredAttrs) {
        tempNode.options || (tempNode.options = {});
        tempNode.options.enforcedRequiredAttrs = true;
      }

      var allForms = new MetadataFormCollection(undefined, {
        node: tempNode,
        action: options.action,
        connector: options.container.connector,
        container: options.container,
        inheritance: options.inheritance,
        autofetch: true,
        autoreset: true
      });

      allForms.fetch()
          .done(_.bind(function () {
            if (allForms.models.length === 0) {
              deferred.resolve({hasRequiredMetadata: false});
            } else {
              var formsValid = this.FormsCollectionHasRequiredAttributes(allForms);
              deferred.resolve({hasRequiredMetadata: !formsValid, initialFormData: allForms});
            }
          }, this));

      return deferred.promise();
    },
    FormsCollectionHasRequiredAttributes: function (allForms) {
      var formsValid = true;
      _.each(allForms.models, _.bind(function (form) {
        var valid = this._checkForAlpacaRequiredFields(form);
        formsValid = formsValid && valid;
      }, this));
      return formsValid;
    },

    jsonObjTraverse: function (jsonObj, stack, key, val, res, prop) {
      for (var property in jsonObj) {
        if (jsonObj.hasOwnProperty(property)) {
          if (jsonObj[key] && jsonObj[key] === val && _.indexOf(res, prop) === -1) {
            res.push(prop);
          }
          if (typeof jsonObj[property] == "object") {
            this.jsonObjTraverse(jsonObj[property], stack + '.' + property, key, val, res,
                property);
          }
        }
      }
    },
    _checkForAlpacaRequiredFields: function (form) {
      var valid                = true,
          data                 = form.get('data'),
          options              = form.get('options'),
          schema               = form.get('schema'),
          reqArray             = [],
          reqFieldId           = [],
          nonValidateFieldsIds = [];
      this.jsonObjTraverse(schema, '', 'required', true, reqFieldId, 'properties');
      this.jsonObjTraverse(options, '', 'validate', false, nonValidateFieldsIds, 'fields');
      var removeNonValidateFields = function (nvFields, rFields) {
        var rFields_ = nvFields.filter(function (n) {
          return rFields.indexOf(n) != -1;
        });
        return rFields_.length > 0 ? rFields_ : rFields;
      };

      var filteredRequiredFieldsIds = removeNonValidateFields(nonValidateFieldsIds, reqFieldId),
          getReqArray               = function (jsonObj, stack, ele, res) {
            for (var property in jsonObj) {
              if (jsonObj.hasOwnProperty(property)) {
                if (property === ele) {
                  res.push(jsonObj[ele]);
                }
                if (typeof jsonObj[property] == "object") {
                  getReqArray(jsonObj[property], stack + '.' + property, ele, res);
                }
              }
            }
          };

      if (!!filteredRequiredFieldsIds) {
        var nullCount = false;
        _.each(filteredRequiredFieldsIds, function (arrayElement) {
          reqArray = [];
          getReqArray(data, '', arrayElement.toString(), reqArray);
          _.each(reqArray, function (arrayElement) {
            var checkNull = function (element) {
              if (element instanceof Array && (element !== null || element !== "")) {
                _.each(element, function (childElement) {
                  checkNull(childElement);
                });
              } else if (element === null || element === "") {
                nullCount = true;
                return;
              }
            };
            if (!nullCount) {
              checkNull(arrayElement);
            } else {
              valid = false;
              return;
            }
          });
          if (nullCount) {
            valid = false;
            return;
          }
        });
      }

      return valid;
    },
    AlpacaFormOptionsSchemaHaveRequiredFields: function (formOptions, formSchema, metadataTab) {
      var required  = false,
          reqFields = [];
      if (!!metadataTab && metadataTab === 'general') { //for 'general' traverse all the properties.
        if (formSchema && formSchema.properties) {
          if (!!formSchema.properties.name) {
            formSchema.properties.name.required = false;
          }
          if (!!formSchema.properties.advanced_versioning) {
            formSchema.properties.advanced_versioning.required = false;
          }
          if (!!formSchema.properties.file) {
            formSchema.properties.file.required = false;
          }

          for (var key in formSchema.properties) {
            if (formSchema.properties.hasOwnProperty(key) && formSchema.properties[key].required &&
                !formOptions.fields[key].hidden) {
              required = true;
            }
          }
        }
      } else { // other than 'general' tab, search for required property.
        if (formSchema && required === false) {
          this.jsonObjTraverse(formSchema, '', 'required', true, reqFields, 'properties');
          if (reqFields.length > 0) {
            required = true;
          }
        }
      }
      return required;
    },
    ContainerHasEnforcedEmptyRequiredMetadataOnNodes: function (options) {
      if (!options.items || options.items.length < 1 || !options.container) {
        return $.Deferred().reject({});
      }

      var deferred = $.Deferred();
      var ids = _.map(options.items, function (item) { return item.id });
      var formData = new FormData();
      formData.append('body', JSON.stringify({'ids': ids}));

      var connector = options.container.connector;
      var ajaxOptions = {
        type: 'POST',
        url: Url.combine(connector.connection.url, "validation/nodes/categories/enforcement"),
        data: formData,
        contentType: false,
        processData: false
      };
      connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            if (options.inheritance === 'original') {
              deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
            } else {  // inheritance == 'destination' or 'merged'
              if (resp.results && resp.results.length > 0) {
                var utilOptions = {
                  action: options.action,
                  id: resp.results[0].id,
                  inheritance: options.inheritance,
                  container: options.container,
                  enforcedRequiredAttrs: true
                };
                this.ContainerHasEnforcedEmptyRequiredMetadata(utilOptions)
                    .done(function (resp2) {
                      if (resp2.hasRequiredMetadata === true) {
                        deferred.resolve({requiredMetadata: true, enforcedItems: resp.results});
                      } else {
                        deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
                      }
                    })
                    .fail(function (error) {
                      deferred.reject(error);
                    });
              } else {
                deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
              }
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    }

  });

  MetadataUtils.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataUtils, {version: "1.0"});

  return MetadataUtils;
});
