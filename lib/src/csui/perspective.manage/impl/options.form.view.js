/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/form.view',
  'hbs!csui/perspective.manage/impl/options.form.wrapper',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'css!csui/perspective.manage/impl/options.form',
], function (_, $, Backbone, Marionette, LayoutViewEventsPropagationMixin, PerfectScrollingBehavior,
    FormView, template, lang) {

  var WidgetOptionsFormWrapperView = Marionette.LayoutView.extend({

    template: template,

    className: 'csui-pman-form-wrapper',

    regions: {
      bodyRegion: '.csui-pman-form-content'
    },

    templateHelpers: function () {
      return {
        title: this.options.manifest.title,
        description: this.options.manifest.description
      }
    },

    constructor: function WidgetOptionsFormHeaderView(options) {
      this.options = options || {};
      this.manifest = this.options.manifest;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _createForm: function () {
      this.widgetOptionsFormView = new WidgetOptionsFormView({
        context: this.options.context,
        model: this._prepareFormModel(),
        mode: 'create',
      });

      this.listenToOnce(this.widgetOptionsFormView, 'render:form', function () {
        this.trigger('render:form');
      }.bind(this))

      this.listenTo(this.widgetOptionsFormView, 'change:field', function (field) {
        this.trigger('change:field', field);
      }.bind(this))
    },

    _hasSchema: function () {
      if (!this.manifest || !this.manifest.schema || !this.manifest.schema.properties ||
          _.isEmpty(this.manifest.schema.properties)) {
        return false;
      }
      return true;
    },

    onRender: function () {
      if (this._hasSchema()) {
        this._createForm();
        this.bodyRegion.show(this.widgetOptionsFormView);
      } else {
        this.trigger('render:form');
      }
    },

    getValues: function () {
      if (!this._hasSchema()) {
        return undefined;
      }
      return this.widgetOptionsFormView.getValues();
    },

    validate: function () {
      if (!this._hasSchema()) {
        return true;
      }
      return this.widgetOptionsFormView.validate();
    },

    _isPreviewWidget: function () {
      return this.options.widgetConfig.type ===
             'csui/perspective.manage/widgets/perspective.widget';
    },

    _prepareFormModel: function () {
      var data = this.options.widgetConfig.options || {};
      if (this._isPreviewWidget()) {
        data = data.options || {};
      }
      var schema      = JSON.parse(JSON.stringify(this.manifest.schema)),
          formOptions = JSON.parse(JSON.stringify(this.manifest.options || {}));

      this._addWidgetSizePropertyIfSupported(schema, formOptions, data);

      var model = new Backbone.Model({
        schema: schema,
        options: formOptions,
        data: data
      });
      return model;
    },
    _addWidgetSizePropertyIfSupported: function (schema, options, data) {
      if (!this.options.perspectiveView.getSupportedWidgetSizes) {
        return;
      }
      var supportedKinds = this.options.perspectiveView.getSupportedWidgetSizes(this.manifest,
          this.options.widgetView);
      if (!supportedKinds || supportedKinds.length === 0) {
        return;
      }
      var kindSchema = {
        title: lang.widgetSizeTitle,
        description: lang.widgetSizeDescription,
        type: 'string',
        enum: _.map(supportedKinds, function (sk) {
          return sk.kind;
        })
      };
      var kindOption = {
        type: 'select',
        optionLabels: _.map(supportedKinds, function (sk) {
          return sk.label;
        }),
        removeDefaultNone: true
      };
      var selectedKind = _.find(supportedKinds, function (size) {return size.selected;});
      if (!!selectedKind) {
        data[WidgetOptionsFormWrapperView.widgetSizeProperty] = selectedKind.kind;
      }
      var sizeSchema = {};
      sizeSchema[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindSchema;
      schema.properties = _.extend(sizeSchema, schema.properties);

      var sizeOptions = {};
      sizeOptions[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindOption;
      options.fields = _.extend(sizeOptions, options.fields);

      schema.required = schema.required || [];
      schema.required.push(WidgetOptionsFormWrapperView.widgetSizeProperty);
    },

  }, {
    widgetSizeProperty: '__widgetSize'
  });

  var WidgetOptionsFormView = FormView.extend({

    className: function () {
      var className = FormView.prototype.className.call(this);
      return className + ' perspective-widget-form';
    },

    constructor: function WidgetOptionsFormView(options) {
      FormView.apply(this, arguments);
    },

    _modifyModel: function () {
      this._normalizeSchemaToFormView();
      FormView.prototype._modifyModel.apply(this, arguments);
    },

    _normalizeSchemaToFormView: function () {
      var self = this;
      if (!this.alpaca.options) {
        this.alpaca.options = {};
      }
      if (!this.alpaca.options.fields) {
        this.alpaca.options.fields = {};
      }
      this._normalizeOptions(this.alpaca.schema.properties, this.alpaca.options.fields,
          this.alpaca.data);
    },
    _normalizeOptions: function (schemaProperies, optionFields, data) {
      var self = this;
      _.each(schemaProperies, function (field, fieldId) {
        var fieldOpts = optionFields[fieldId];
        var fieldData = data[fieldId];
        if (!fieldOpts) {
          optionFields[fieldId] = fieldOpts = {}
        }
        switch (field.type) {
        case 'array':
          if (!fieldOpts.fields) {
            _.defaults(fieldOpts, {
              fields: {
                item: {}
              }
            });
          }
          if (!!fieldOpts.items) {
            fieldOpts.fields.item = fieldOpts.items;
          }
          if (field.items.type === 'object') {
            fieldOpts.fields.item.fields || (fieldOpts.fields.item.fields = {});
            if (!fieldData) {
              data[fieldId] = fieldData = [{}];
            }
            self._normalizeOptions(field.items.properties, fieldOpts.fields.item.fields,
                fieldData[0]);
          }
          if (!fieldData) {
            data[fieldId] = [null];
          }
          break;
        case 'object':
          if (!fieldData) {
            data[fieldId] = fieldData = {};
          }
          if (!fieldOpts.fields) {
            fieldOpts.fields = {};
            self._normalizeOptions(field.properties, fieldOpts.fields, fieldData);
          }
          break;
        default:
          if (!fieldData) {
            data[fieldId] = null;
          }
          break;
        }
      });
    }

  });

  _.extend(WidgetOptionsFormView.prototype, LayoutViewEventsPropagationMixin);

  return WidgetOptionsFormWrapperView;

});
