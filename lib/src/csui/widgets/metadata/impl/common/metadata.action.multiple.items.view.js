/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/widgets/metadata/impl/metadata.navigation.list.view',
  'csui/widgets/metadata/metadata.action.one.item.properties.view',
  'hbs!csui/widgets/metadata/impl/common/metadata.action.multiple.items',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadata.navigation.list.behavior', "csui/lib/jsonpath",
  'css!csui/widgets/metadata/impl/common/metadata.action.multiple.items'
], function (_, Backbone, Marionette, MetadataNavigationListView,
    MetadataActionOneItemPropertiesView, template, LayoutViewEventsPropagationMixin,
    MetadataNavigationListBehavior, jsonPath) {

  var MetadataActionMultipleItemsView = Marionette.LayoutView.extend({

    className: 'cs-metadata-add-items',
    template: template,

    regions: {
      navigationRegion: ".metadata-sidebar",
      contentRegion: ".metadata-content"
    },

    behaviors: {
      MetadataNavigationListBehavior: {
        behaviorClass: MetadataNavigationListBehavior
      }
    },

    constructor: function MetadataActionMultipleItemsView(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.collection = options.collection;
      this.container = options.container;
      this.context = options.context;
      this.originatingView = options.originatingView;
      this.initiallySelected = this.options.selected;
      this.commonCategories = options.commonCategories;
      this.initialFormData = options.initialFormData;
      this.requiredFields = [];

      var initiallySelectedModel = this._getInitiallySelectedModel();
      if (options.applyFlag) {
        initiallySelectedModel.set("applyFlag", options.applyFlag);
      }

      this.mdv = new MetadataActionOneItemPropertiesView({
        model: initiallySelectedModel,
        container: this.container,
        context: this.context,
        commands: options.commands,
        originatingView: this.originatingView,
        action: options.action,
        inheritance: options.inheritance
      });
      this.mdv.internal = true;
      this._subscribeToMetadataViewEvents();

      this.mdn = new MetadataNavigationListView({
        collection: options.collection,
        data: {
          back_button: false,
          title: '',
          show_required: true
        }
      });
      if (options.applyFlag) {
        this.setInitialCategories();
      }
      this.listenTo(this.mdn, 'click:item', this.onClickItem);
      this.listenTo(this.mdn, 'click:back', this.onClickBack);
      this.listenTo(this.mdn, 'show:node', function (args) {
        this._showNode(args.model);
      });
      this.propagateEventsToRegions();
    },

    _getInitiallySelectedModel: function () {
      if (this.initiallySelected && this.initiallySelected.length > 0) {
        return this.initiallySelected.models[0];
      } else if (this.collection && this.collection.length > 0) {
        return this.collection.models[0];
      } else {
        return null;
      }
    },

    onClickItem: function (item) {
      var valid = this.validateAndSetValuesToNode();
      if (valid) {
        this._showNode(item.model);
      } else {
        item.cancelClick = true;
      }
    },
    setInitialCategories: function () {
      var that = this;
      _.each(this.mdn.collection.models, function (model) {
        var fileAttr = {};
        if (model.get("data") === undefined) {
          fileAttr.advanced_versioning = false;
          fileAttr.name = model.get("newName") || model.get("name");
          fileAttr.mime_type = model.get("mime_type");
          fileAttr.type = model.get("type") || 144;
          fileAttr.parent_id = this.mdv.options.container.get("id");
          _.extend(fileAttr, JSON.parse(JSON.stringify(that.commonCategories)));
        }
        model.set('data', fileAttr);
      }, this);

    },

    getRequiredFields: function () {
      var formValues = {},
          that       = this;
      that.requiredFields = [];
      if (this.initialFormData && this.initialFormData.models) {
        _.each(this.initialFormData.models, function (tab, key) {
          var values   = tab.get("data"),
              roleName = tab.get("role_name"),
              options  = tab.get('options'),
              schema   = tab.get('schema'),
              roles, role, category;

          if (values) {
            if (roleName) {
              roles = formValues.roles || (formValues.roles = {});
              role = roles[roleName] || (roles[roleName] = {});
              if (roleName === 'categories') {
                var requiredFields = jsonPath(schema, "$..[?(@.required===true)]",
                    {resultType: "PATH"});
                var nonValidateFields = jsonPath(options, "$..[?(@.validate===false)]",
                    {resultType: "PATH"});
                var nonValidateFieldsIds = [];
                _.each(nonValidateFields, function (nvField) {
                  var matches = nvField.toString().match(/(\'[\w]*\')/g);
                  if (!!matches) {
                    nonValidateFieldsIds.push(matches[matches.length - 1].replace(/'/g, ""));
                  }
                });
                var reqFieldId = [];
                _.each(requiredFields, function (reqField) {
                  var matches = reqField.toString().match(/(\'[\w]*\')/g);
                  if (!!matches) {
                    reqFieldId.push(matches[matches.length - 1].replace(/'/g, ""));
                  }
                });
                reqFieldId = reqFieldId.filter(function (n) {
                  return nonValidateFieldsIds.indexOf(n) === -1;
                });
                if (reqFieldId.length > 0) {
                  that.requiredFields.push(reqFieldId);
                }
              }
            }
          }
        });
      }
    },

    validateAndSetValuesToAllNode: function () {
      var that           = this,
          requiredFields = {},
          valid          = true;
      var formsValid = true;
      this.getRequiredFields();
      _.each(this.mdn.collection.models, _.bind(function (form) {
        var data = form.get('data');
        _.each(data.roles.categories, function (category) {
          valid = valid && that._checkForAlpacaRequiredFields(form, category);
        });
        form.validated = valid;
        formsValid = formsValid && valid;
      }, this));
      return formsValid;
    },
    _checkForAlpacaRequiredFields: function (form, category) {
      var valid    = true,
          reqArray = [];
      if (!!this.requiredFields) {
        var nullCount = false;
        _.each(this.requiredFields, function (arrayElement) {
          reqArray = jsonPath(category, "$.." + arrayElement.toString(),
              {resultType: "PATH"}.toArray);
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
    validateAndSetValuesToNode: function () {
      var item = this.mdn.getSelectedItem();
      var valid = this.mdv.validate();
      if (valid) {
        var data = this.mdv.getValues();
        if (item.model.newCategories.models.length > 0) {
          _.each(item.model.newCategories.models, function (catModel) {
            var catId = catModel.get('id');
            var roleName = catModel.get('role_name');
            var catData = {};
            if (data && data.roles && data.roles[roleName]) {
              catData = data.roles[roleName];
            }
            if (_.isEmpty(catData[catId]) === false) {
              _.each(catModel.attributes.data, function (iValue, iKey) {
                if (_.has(catData[catId], iKey)) {
                  catModel.attributes.data[iKey] = catData[catId][iKey];
                }
              });
            }
          });
        }
        item.model.validated = true;
        item.model.set('data', data);  // intentionally trigger the set to redraw list item
        return true;
      }
      if (!!this.mdv.metadataPropertiesView.allFormsRendered) {
        item.model.validated = false;
        item.model.trigger('change', item.model); // intentionally trigger the set to redraw list item
      }
      return false;
    },

    onClickBack: function () {
      this.trigger("metadata:close", {sender: this});
    },

    onItemNameChanged: function (newName) {
      var selectedItem  = this.mdn.getSelectedItem(),
          selectedIndex = this.mdn.getSelectedIndex();

      selectedItem.render(); // name has been set silently
      this.mdn.setSelectedIndex(selectedIndex);
    },

    _showNode: function (model) {
      if (this.mdv && this.mdv.internal) {
        this.mdv.destroy();
      }
      model.set("applyFlag", this.options.applyFlag);
      this.mdv = new MetadataActionOneItemPropertiesView({
        model: model,
        container: this.container,
        context: this.context,
        originatingView: this.originatingView,
        action: this.options.action,
        inheritance: this.options.inheritance
      });
      this.mdv.internal = true;
      this._subscribeToMetadataViewEvents();
      this.contentRegion.show(this.mdv);
    },

    _subscribeToMetadataViewEvents: function () {
      this.listenTo(this.mdv, 'metadata:close',
          _.bind(function () {
            this.trigger("metadata:close", {sender: this});
          }, this));
      this.listenTo(this.mdv, 'item:name:changed', _.bind(this.onItemNameChanged, this));
    }

  });

  _.extend(MetadataActionMultipleItemsView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataActionMultipleItemsView;

});
