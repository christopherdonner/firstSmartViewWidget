/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/utils/url',
  'csui/utils/log',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/models/form',
  'hbs!csui/controls/form/impl/templates/form',
  'hbs!csui/controls/form/impl/templates/formsinglecol',
  'hbs!csui/controls/form/impl/templates/formdoublecol',
  'txt!csui/controls/form/impl/templates/alpaca.container.array.txt',
  'txt!csui/controls/form/impl/templates/alpaca.container.array.item.txt',
  'csui/utils/non-attaching.region/non-attaching.region',
  'i18n!csui/controls/form/impl/nls/lang',
  "csui/controls/form/fields/alpaca/alpnodepickerfield",
  "csui/controls/form/fields/alpaca/alpcsuidateonlyfield",
  "csui/controls/form/fields/alpaca/alpcsuidatetimefield",
  "csui/controls/form/fields/alpaca/alpcsuibooleanfield",
  "csui/controls/form/fields/alpaca/alpcsuitextfield",
  "csui/controls/form/fields/alpaca/alpcsuitextareafield",
  "csui/controls/form/fields/alpaca/alpcsuiselectfield",
  "csui/controls/form/fields/alpaca/alpcsuiintegerfield",
  'csui/controls/form/fields/alpaca/alpcsuipasswordfield',
  "csui/controls/form/fields/alpaca/alpcsuiurlfield",
  "csui/controls/form/fields/alpaca/alpnodepickerfield",
  "csui/controls/form/fields/alpaca/alpcsuiarrayfield",
  "csui/controls/form/fields/alpaca/alpcsuiobjectfield",
  "csui/controls/form/fields/alpaca/alpcsuiarraybuttonsfield",
  "csui/controls/form/fields/alpaca/alpcsuireservebuttonfield",
  "csui/controls/form/fields/alpaca/alpcsuitklfield",
  "csui/controls/form/fields/tklfield.view",
  'css!csui/controls/form/impl/form',
  'css!csui/lib/alpaca/css/alpaca',
  'csui/lib/binf/js/binf-datetimepicker',
  'csui/lib/handlebars.helpers.xif',
  'csui-ext!csui/controls/form/form.view',
  'csui/lib/jquery.when.all'
], function (_, Backbone, $, Url, log, Marionette, Alpaca,
    FormModel, template, singleColTemplate, doubleColTemplate,
    AlpArrayTemplate, AlpArrayItemTemplate, NonAttachingRegion, lang) {

  Alpaca.registerView({
    "id": "bootstrap-csui",
    "parent": "bootstrap-edit-horizontal",
    "type": "edit",
    "ui": "bootstrap",
    "title": "",
    "displayReadonly": true,
    "templates": {
      "control-textarea": "<div></div>",
      "control-checkbox": "<div></div>",
      "control-select": "<div></div>"
    },
    "callbacks": {},
    "styles": {},
    "horizontal": true,
    "collapsible": false
  });

  Alpaca.registerTemplate('container-array', AlpArrayTemplate);
  Alpaca.registerTemplate('container-array-item', AlpArrayItemTemplate);

  var FormView = Marionette.ItemView.extend({

    className: function () {
      var ret = 'cs-form';
      switch (this.mode) {
      case 'create':
        ret += ' cs-form-create';
        break;
      case 'read':
        ret += ' cs-form-read';
        break;
      case 'update':
        ret += ' cs-form-update';
        break;
      default:
        break;
      }

      return ret;
    },

    constructor: function FormView(options) {
      options = _.extend({}, options);

      this.mode = options.mode || 'update'; // read + update or create
      if (this.mode !== 'read' && this.mode !== 'update' &&
          this.mode !== 'create') {
        throw new Error('Invalid form mode: "' + this.mode + '".');
      }

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.layoutMode = this.options.layoutMode || 'singleCol';
      this.setRequiredFieldsEditable = (this.mode === 'create');

      this.listenTo(this.model, 'change', this.updateForm);
      this.listenTo(this.model, 'reset', this.render);
      this.listenTo(this, 'before:destroy', this._beforeDestroy);
    },

    updateForm: function () {
      return this.render();
    },

    render: function () {
      this.renderFinished = false;
      this.triggerMethod('before:render', this);
      this._renderContent();
      return this;
    },

    _renderContent: function () {
      this.alpaca = {
        data: this.model.get('data'),
        schema: this.model.get('schema'),
        options: this.model.get('options')
      };

      this._destroyForm();
      this._modifyModel();

      this.alpaca.view = this.model.get('view') || this._getLayout();

      this.$el.addClass('binf-hidden');

      _.extend(this.alpaca.options, {
        validate: true,
        custom: {
          some: "value"
        }
      });
      this._otcsContextConfig = {
        context: this.options.context,
        formView: this
      };

      this.$form = this.$el.alpaca({
        connector: {
          id: 'otcs_context',
          config: this._otcsContextConfig
        },
        data: this.alpaca.data,
        schema: this.alpaca.schema,
        view: this.alpaca.view,
        options: _.extend({}, this.alpaca.options, this._getFormTemplateHelpers()),
        postRender: _.bind(this._formRendered, this)
      });

      this.$form.bind('field:changed', _.bind(this._onFieldChanged, this));
      this.$form.bind('show:colout', _.bind(this._onShowColout, this));
      this.$form.bind('field:invalid', _.bind(this._onFieldInvalid, this));
      this.$form.bind('click:applyAll', _.bind(this.onClickApplyAll, this));
      this.$form.bind('reset', _.bind(this.resetForm, this));
    },
    _onShowColout: function (event) {
      Backbone.trigger('closeToggleAction');
      event.context = this.options.context;
      var coloutTarget = $(event.targetEl),
          popover      = coloutTarget.data('binf.popover'),
          view         = this;
      if (!popover) {
        require(['csui/controls/form/colout/colout.view'], function (ColoutLayoutView) {
          var coloutModel = new Backbone.Model({
            data: event.formdata,
            options: event.formoptions,
            schema: event.formschema,
            targetEl: event.targetEl,
            coloutContainer: event.coloutContainer,
            context: event.context
          });
          var coloutView = new ColoutLayoutView(coloutModel);
          if (!view.coloutNonAttachingRegion) {
            view.coloutNonAttachingRegion = new NonAttachingRegion({el: view.el});
          }
          view.coloutNonAttachingRegion.show(coloutView, {render: false});
        });
      }
    },
    _onFieldInvalid: function (event) {
      this.triggerMethod('invalid:field', event);
    },

    onClickApplyAll: function (args) {
      var documentCollections = this.model.node.collection || this.node.collection;
      this._ = _;
      this.args = args;
      var self = this;
      if (documentCollections && documentCollections.models) {
        _.each(documentCollections.models, function (model) {
          if (self.args.fieldpath.indexOf("_") !== -1) {
            var fieldId    = self.args.fieldpath.split("_"),
                string     = self.args.fieldpath,
                arr        = string.split('_'),
                parentPath = arr.splice(0, 2).join("_"),
                childPath  = arr.join("_");
            if (model.get("data").roles.categories[fieldId[0]] !== undefined) {
              if (fieldId.length === 2 &&
                  model.get("data").roles.categories[fieldId[0]][self.args.fieldpath] !==
                  undefined) {
                model.get(
                    "data").roles.categories[fieldId[0]][self.args.fieldpath] = self.args.fieldvalue;
              } else if (model.get("data").roles.categories[fieldId[0]] &&
                         model.get("data").roles.categories[fieldId[0]][parentPath] &&
                         model.get("data").roles.categories[fieldId[0]][parentPath][childPath] !==
                         undefined) {
                model.get(
                    "data").roles.categories[fieldId[0]][parentPath][childPath] = self.args.fieldvalue;
              }
            }
            if (model.newCategories && model.newCategories.models.length > 0) {
              this._.each(model.newCategories.models, function (newCatModel) {
                if (newCatModel.id === parseInt(fieldId[0]) &&
                    newCatModel.get("data") !== undefined) {
                  if (fieldId.length === 2 &&
                      newCatModel.get("data")[self.args.fieldpath] !== undefined) {
                    newCatModel.get("data")[self.args.fieldpath] = self.args.fieldvalue;
                  } else if (newCatModel.get("data")[parentPath] &&
                             newCatModel.get("data")[parentPath][childPath] !== undefined) {
                    newCatModel.get("data")[parentPath][childPath] = self.args.fieldvalue;
                  }

                }
              });
            }
          }
        }, this);
      }
      args.action(args.fieldevent, args.callback, args.view);
      this.trigger("click:applyAll", args);
    },

    resetForm: function () {
      this.render();
    },

    _getFormTemplateHelpers: function () {
      var formTemplateHelpers = this.getOption('formTemplateHelpers');
      if (_.isFunction(formTemplateHelpers)) {
        formTemplateHelpers = formTemplateHelpers.call(this);
      }
      return formTemplateHelpers;
    },

    _onFieldChanged: function (event, originatingView) {
      var MN = '{0}:_onFieldChanged {1} {2}';
      log.debug(MN, this.constructor.name, 'enter', event) && console.log(log.last);

      this.triggerMethod('change:field', this._getChangeFieldEventData(event), originatingView);
      log.debug(MN, this.constructor.name, 'trigger change:field', event.fieldpath) &&
      console.log(log.last);

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
    },

    _getChangeFieldEventData: function (event) {
      var evtData = event.targetfieldid ? {
        parentField: {
          name: event.fieldid,
          path: event.fieldpath,
          value: event.fieldvalue
        },
        targetField: {
          name: event.targetfieldid,
          path: event.targetfieldpath,
          value: event.targetfieldvalue
        },
        name: event.targetfieldid,
        path: event.targetfieldpath,
        value: event.targetfieldvalue
      } : {
        targetField: {
          name: event.fieldid,
          path: event.fieldpath,
          value: event.fieldvalue
        },
        name: event.fieldid,
        path: event.fieldpath,
        value: event.fieldvalue
      };
      _.extend(evtData, {
        view: this,
        fieldView: event.fieldView,
        model: this.model
      });
      return evtData;
    },

    _formRendered: function (form) {
      this.form = this._otcsContextConfig.form = form;
      this.$el.removeClass('binf-hidden');
      var self      = this,
          deferreds = [],
          options   = {
            async: function () {
              var deferred = $.Deferred();
              deferreds.push(deferred);
              return function () {
                deferred.resolve();
              };
            }
          };
      this.updateRenderedForm(options);
      self.triggerMethod('render', self);
      $.whenAll.apply($, deferreds).always(function () {
        self.renderFinished = true;
        self.triggerMethod('render:form', self);
      });
      this.setTooltipsForLabels();
      this.correctLabel4MV();
    },

    isRenderFinished: function () {
      return this.renderFinished === true;
    },

    setTooltipsForLabels: function () {
      var el = this.$el.find('.alpaca-container-label, .alpaca-container-item label');
      $.each(el, function (index, el_) {
        el_.setAttribute('title', el_.textContent.trim());
      });
    },

    correctLabel4MV: function () {
      var el = this.$el.find('label.alpaca-container-label');

      $.each(el, function (index, el_) {
        var mvContainer = $(el_).siblings('div.csui-multivalue-container');
        if (mvContainer.length > 0) {
          var mvLabelId = _.uniqueId('mvLabel');
          $(el_).attr('id', mvLabelId);
          $(mvContainer).find(
              'input, textarea, button.binf-dropdown-toggle, button.csui-btn-reserve-status-action').attr(
              'aria-labelledby',
              mvLabelId);
        }

      });
    },
    updateRenderedForm: function (options) {
      this.$('.alpaca-field-object>label').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    },

    _beforeDestroy: function () {
      this._destroyForm();
    },
    _getLayout: function () {
      var rgSplitObjectFields = this._splitFields(),
          bIsSingleColLayout  = this.layoutMode === 'singleCol';
      var bindings = {};
      var uniqueId = _.uniqueId('csform');
      _.each(rgSplitObjectFields, function (cur, i) {
        var col1Id = cur.isSetType ? ("csfSingleCol_" + uniqueId + i) :
                     ("csfLeftCol_" + uniqueId + i),
            col2Id = (cur.isSetType || bIsSingleColLayout) ? undefined :
                     "csfRightCol_" + uniqueId + i;
        _.extend(bindings, this._bindFields(cur, col1Id, col2Id));
      }, this);
      var fTemplate = bIsSingleColLayout ? singleColTemplate : doubleColTemplate;
      var template = fTemplate.call(this, {
        modelId: uniqueId,
        fields: rgSplitObjectFields
      });
      var parent = "bootstrap-csui";

      var view = {
        parent: parent,
        layout: {
          template: template,
          bindings: bindings
        }
      };

      return view;
    },
    _modifyModel: function () {
      this.alpaca.options = this.alpaca.options || {};
      this.alpaca.options.focus = false;
      this.alpaca.options.hideInitValidationError = true;

      if (this.model.get('id') === 'general') {
        this.alpaca.data = _.omit(this.alpaca.data, 'name');
        this.alpaca.schema.properties = _.omit(this.alpaca.schema.properties, 'name');
        this.alpaca.options.fields = _.omit(this.alpaca.options.fields, 'name');
      }
      this.alpaca.data = _.omit(this.alpaca.data,
          ['external_create_date', 'external_modify_date']);
      this.alpaca.schema.properties = _.omit(this.alpaca.schema.properties,
          ['external_create_date', 'external_modify_date']);
      this.alpaca.options.fields = _.omit(this.alpaca.options.fields,
          ['external_create_date', 'external_modify_date']);

      var applyFlag = false;
      if (this.options.metadataView && this.options.metadataView.model) {
        applyFlag = this.options.metadataView.model.get("applyFlag");
      }
      if (applyFlag) {
        var categories = [];
        if (this.options.metadataView && this.options.metadataView.model.collection.models &&
            this.options.metadataView.model.collection.models.length > 1) {
          _.each(this.options.metadataView.model.collection.models, function (model, key) {
            if (model.get("data") && model.get("data").roles) {
              var nodeCat       = [],
                  rmCategories  = [],
                  newCategories = [];
              _.each(model.get("data").roles.categories, function (data, key) {
                nodeCat = nodeCat.concat(key);
              }, this);
              if (model.removedCategories && model.removedCategories.length > 0) {
                rmCategories = model.removedCategories;
              }
              if (model.newCategories && model.newCategories.models &&
                  model.newCategories.models.length > 0) {
                newCategories = _.pluck(model.newCategories.models, 'id');
                newCategories = newCategories.concat(
                    newCategories.map(function (cat) {return cat.toString();}));
              }
              if (newCategories.length > 0) {
                rmCategories = _.difference(rmCategories, newCategories);
                nodeCat = _.union(nodeCat, newCategories);
              }
              nodeCat = _.difference(nodeCat, rmCategories);
              categories.push(nodeCat);
            }
          }, this);
        }
        this.commonCategories = _.intersection.apply(_, categories);
      }

      var addActionBar = function (alpField, idx) {
        _.extend(alpField, {
          "actionbar": {
            "actions": [
              {
                "action": "remove", "enabled": true,
                "title": !!alpField.isSetType ? lang.removeRow : lang.removeField,
                "aria-label": !!alpField.isSetType ? lang.removeRow : lang.removeField,
                "iconClass": "csui-icon circle_delete_grey" +
                             " csui-array-icon-delete-" + idx,
                "actionAria": _.str.sformat(lang.removeFieldAria, alpField.label)
              },
              {
                "action": "add", "enabled": true,
                "title": !!alpField.isSetType ? lang.addRow : lang.addField,
                "aria-label": !!alpField.isSetType ? lang.addRow : lang.addField,
                "iconClass": "csui-icon circle_add_grey csui-array-icon-add-" + idx,
                "actionAria": _.str.sformat(lang.addFieldAria, alpField.label)
              },
              {"action": "up", "enabled": false},
              {"action": "down", "enabled": false}
            ]
          }
        });
      };
      var updateAlpFields = function (formObj) {
        for (var idx in formObj) {
          if (formObj.hasOwnProperty(idx)) {
            var objType;
            if (_.isObject(formObj[idx])) {
              objType = formObj[idx]['type'];
              if (objType === 'otcs_user_picker' || objType === 'otcs_member_picker') {
                if (!!formObj[idx]['fields']) {
                  formObj[idx]['type'] = undefined;
                  formObj[idx]['fields']['type'] = 'otcs_user';
                } else {
                  formObj[idx]['type'] = 'otcs_user';
                }
              } else if (objType === 'radio') {
                formObj[idx]['type'] = 'select';
              }

              if (!!formObj[idx] && formObj[idx]['toolbarSticky'] === true) {
                addActionBar(formObj[idx], idx);
              }

              if (!!formObj[idx] && !!formObj[idx]['optionLabels']) {
                formObj[idx]['type'] = 'select';
              }
              updateAlpFields(formObj[idx]);
            } else {
              objType = formObj[idx];
              if (idx === 'type') {
                if (objType === 'otcs_user_picker' || objType === 'otcs_member_picker') {
                  formObj[idx] = 'otcs_user';
                } else if (objType === 'radio') {
                  formObj[idx] = 'select';
                }
              }
              if (idx === 'optionLabels' /*&& formObj[idx] === true*/) {
                formObj['type'] = 'select';
              }
              if (idx === 'toolbarSticky' && formObj[idx] === true) {
                addActionBar(formObj, idx);
              }
            }
          }
        }
      };

      updateAlpFields(this.alpaca.options.fields);
      var updateAlpProperties = function (alpFields, alpProp, mode) {
        for (var idx in alpProp) {
          if (alpProp.hasOwnProperty(idx)) {
            var isArrayType  = alpProp[idx]['type'] === 'array',
                isObjectType = alpProp[idx]['type'] === 'object';

            if (!!alpProp[idx] && alpProp[idx]['type'] && (isArrayType || isObjectType)) {
              var alpPropItems = isArrayType ? alpProp[idx]['items'] : alpProp[idx],
                  cur          = alpFields[idx];
              if (!!cur) {
                cur.toolbarSticky = alpProp[idx].disabled ? false : true;
                cur.isMultiField = true;
                cur.uniqueId = idx;
                cur.messages = lang;
                cur.isEditMode = mode === 'update';

                if (!!cur.fields) {
                  _.extend(cur.fields.item, {
                    isMultiFieldItem: true,
                    hideInlineActions: true
                  });

                  if (cur.validate !== undefined) {
                    _.extend(cur.fields.item, {
                      validate: cur.validate
                    });
                  }
                }

                var curSchema = alpPropItems;
                if (!!curSchema) {

                  if ((curSchema.minItems !== 1 && curSchema.type === 'object') ||
                      (curSchema.maxItems !== curSchema.minItems)
                      && (curSchema.type === 'object')) {
                    cur.isMultiRowSetEnabled = alpProp[idx].type === 'array';
                    cur.toolbarSticky = alpProp[idx].disabled ? false : true;

                    if (cur.fields) { // required for test\index.html to not fail
                      var curItemFields = isArrayType ? cur.fields.item.fields : cur.fields.fields;
                      _.each(curItemFields, function (item) {
                        _.extend(item, {
                          isMultiFieldItem: true
                        });
                        cur.onlyread = item.readonly;
                      });
                    }
                  }
                  cur.canWrite = cur.readonly === undefined ? !cur.onlyread : !cur.readonly;
                  cur.isTabable = cur.isEditMode && (!cur.isMultiFieldItem);
                }
              }
              if (isArrayType) { // iterate recursively on ..item/fields
                if (alpFields[idx].fields && alpFields[idx].fields.item &&
                    alpFields[idx].fields.item.fields) {
                  updateAlpProperties(alpFields[idx].fields.item.fields, alpPropItems.properties,
                      mode);
                }
              } else if (isObjectType) { // iterate recursively on self object
                updateAlpProperties(alpFields[idx].fields, alpPropItems.properties, mode);
              }
            }
          }
        }
      };

      updateAlpProperties(this.alpaca.options.fields, this.alpaca.schema.properties, this.mode);
      var updateAlpFieldsActionBar = function (formObj) {
        for (var idx in formObj) {
          if (formObj.hasOwnProperty(idx)) {
            var objType;
            if (_.isObject(formObj[idx])) {
              objType = formObj[idx]['type'];
              if (!!formObj[idx] && formObj[idx]['toolbarSticky'] === true) {
                addActionBar(formObj[idx], idx);
              }
              updateAlpFields(formObj[idx]);
            } else {
              objType = formObj[idx];
              if (idx === 'toolbarSticky' && formObj[idx] === true) {
                addActionBar(formObj, idx);
              }
              return;
            }
          }
        }
      };

      updateAlpFieldsActionBar(this.alpaca.options.fields);

      var updateAlpFieldLabels = function (alpFields, opts) {
        for (var idx in alpFields) {
          if (alpFields.hasOwnProperty(idx)) {
            var cur = alpFields[idx];
            cur.setRequiredFieldsEditable = opts.setRequiredFieldsEditable;
            cur.mode = opts.mode;
            if (cur.label && !cur.labelModifed) {
              cur.label = cur.label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
                  '&gt;').replace(/"/g, '&quot;');
              cur.label = $("<div>").innerHTML = cur.label;
            }
            cur.labelModifed = true;
            if (opts.inContainer) {
              cur.inContainer = true;
            }
            if (idx.indexOf("_") !== -1) {
              if (opts.commonCategories &&
                  opts.commonCategories.indexOf(idx.split("_")[0]) !== -1) {
                cur.applyFlag = true;
              }
            }
            if (cur.fields) {
              updateAlpFieldLabels(cur.fields, opts);
            }
          }
        }
      };

      var opts = {
        mode: this.mode,
        inContainer: !!this.options && !!this.options.node && !!this.options.node.get("container"),
        setRequiredFieldsEditable: this.setRequiredFieldsEditable,
        commonCategories: this.commonCategories
      };
      updateAlpFieldLabels(this.alpaca.options.fields, opts);

    },
    _splitFields: function () {
      var Memo = function (isSetType, isObjectType) {
        this.isSetType = isSetType;
        this.rgVals = [];
        this.rgKeys = [];
        this.rgObjectKeys = [];
      };

      var oSchema = this.alpaca.schema;
      var oOptions = this.alpaca.options;
      var oData = JSON.parse(JSON.stringify(this.alpaca.data));
      var memo = new Memo(), rgSplit = [], prev;
      var defaultData = {};
      _.reduce(oSchema.properties, _.bind(function (memo, cur, key, list) {
        var curIsSetType = (cur.type === 'array' && cur.items.type === 'object');
        var curIsObjectType = (cur.type === 'object');
        if (oOptions.fields && oOptions.fields[key] && oOptions.fields[key].hidden) {
          return memo;
        }

        (memo.isSetType !== undefined) || (memo.isSetType = curIsSetType);
        if (memo.isSetType !== curIsSetType) {
          rgSplit.push(memo);
          memo = new Memo(curIsSetType);
        }
        if (cur.type === 'object') {
          memo.rgObjectKeys = memo.rgObjectKeys.concat(_.keys(cur.properties));
        }
        if (curIsSetType) {
          oOptions.isSetType = curIsSetType;
          if (oOptions.fields && oOptions.fields[key]) {
            _.extend(oOptions.fields[key], {
              isSetType: true
            });
          }
          if (!!oData[key]) {
            var tempData = oData[key][0] || oData[key];
            _.each(cur.properties || cur.items.properties, function (val, key) {
              var arrData = tempData[key];
              if (!!val.items && !!val.items.defaultItems) {
                if (!!arrData && arrData.length > val.items.defaultItems) {
                  while (arrData.length > val.items.defaultItems) {
                    arrData.pop();
                  }
                } else if (!!arrData && arrData.length < val.items.defaultItems) {
                  while (arrData.length < val.items.defaultItems) {
                    arrData.push("");
                  }
                }
              }
            });
            this.setEmptyValueInData(oData);
            defaultData[key] = JSON.parse(JSON.stringify(tempData));
          }
        }
        memo.rgVals.push(cur);
        memo.rgKeys.push(key);
        prev = memo;
        return memo;
      }, this), memo);
      if (Object.keys(defaultData).length > 0) {
        oOptions.defaultData = defaultData;
      }
      if (prev) {
        rgSplit.push(prev);
      }

      return rgSplit;
    },

    setEmptyValueInData: function (oData) {
      var that = this;
      _.each(oData, function (value, id) {
        if (oData[id] instanceof Object) {
          that.setEmptyValueInData(oData[id]);
        } else {
          oData[id] = "";
        }
      });
    },
    _bindFields: function (oSplitFieldGroup, col1id, col2id) {
      var fieldKeys  = oSplitFieldGroup.rgKeys,
          objectKeys = oSplitFieldGroup.rgObjectKeys,
          nFields    = fieldKeys.length + objectKeys.length,
          bindings   = {};

      if (oSplitFieldGroup.isSetType || !col2id) {
        _.each(fieldKeys, function (fieldKey, i) {
          bindings[fieldKey] = col1id;
        }, this);

      } else if (col2id) {
        if (fieldKeys.length > 8) {
          _.each(fieldKeys, function (fieldKey, i) {
            bindings[fieldKey] = (i < nFields / 2) ? col1id : col2id;
          }, this);
        } else if (fieldKeys.length < 8) {
          _.each(fieldKeys, function (fieldKey, i) {
            bindings[fieldKey] = col1id;
          }, this);
        } else {
          _.each(fieldKeys, function (fieldKey, i) {
            bindings[fieldKey] = (i < 5) ? col1id : col2id;
          }, this);
        }

      }

      return bindings;

    },

    _destroyForm: function () {
      if (this.form) {
        this.form.destroy();
        this.form = undefined;
      }
      if (this.$form) {
        this.$form.unbind('field:changed');
        this.$form.unbind('field:invalid');
        this.$form.unbind('reset');
        this.$form.unbind('scroll');
        this.$form.empty();
        this.$form = undefined;
      }
      if (this.form) {
        this.form.destroy();
      }
    },

    validate: function () {

      var bValidateChildren = true;
      this.form.refreshValidationState(bValidateChildren);
      var bRet = this.form.isValid(bValidateChildren);

      return bRet;
    },

    setFocus: function () {
      this.form.children.some(function (cur) {
        var allowsFocus = (!cur.options.readonly && !cur.schema.readonly);
        if (allowsFocus) {
          cur.focus();
        }
        return allowsFocus;
      });
    },

    getValues: function (path) {
      var values = this.form.getValue();
      if (values && path) {
        values = FormModel.getValueOnPath(values, path);
      }
      return values;
    },

    _blockActions: function () {
      return;
    },

    _unblockActions: function () {
      return;
    },

    _validate: function (changes) {
      return true;
    },

    hideNotRequired: function (bHide) {
      var alpacaField      = this.$('.alpaca-field'),
          thumbnailSection = this.$('.thumbnail_section'),
          allFields        = $.merge(alpacaField, thumbnailSection);
      var allFieldsToHide = allFields.not(
          '.alpaca-field-object, .cs-form-set .alpaca-field-array'),
          allFieldSets    = allFields.filter(
              '.alpaca-field-object, .cs-form-set .alpaca-field-array');
      _.each(allFieldSets, function (curField) {
        if ($(curField).find('.alpaca-required').length === 0) {
          allFieldsToHide.push(curField);
        }
      });
      var optionalFields = allFieldsToHide.not('.alpaca-required');
      var applyToWholeForm = allFields.size() === optionalFields.size(),
          setFields        = _.filter(optionalFields, function (ele) {
            ele = !!ele && $(ele).closest('.cs-form-set').length > 0 ? ele : undefined;
            return ele;
          }),
          optionalSets     = _.filter(setFields, function (el) {
            el = $(el).hasClass('alpaca-field-array') &&
                 $(el).closest('.cs-form-set-container').find('.alpaca-required').length === 0 ?
                 el : undefined;
            return el;
          });
      optionalFields = _.union(_.difference(optionalFields, setFields), optionalSets);
      var targetToHide = applyToWholeForm ? this.$el : optionalFields,
          method       = bHide ? 'addClass' : 'removeClass';
      $(targetToHide)[method]('binf-hidden');
      if (bHide) {
        $(optionalFields).attr('data-cstabindex', '-1');
      } else {
        $(optionalFields).removeAttr('data-cstabindex');
      }
      this.$el[method]('csui-required-fields-only');
      return applyToWholeForm;
    }

  });

  FormView.version = '1.0';
  var ContextConnector = Alpaca.Connector.extend({});
  Alpaca.registerConnectorClass("otcs_context", ContextConnector);

  return FormView;

});
