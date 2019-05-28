/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log',
  'csui/controls/form/form.view', 'csui/utils/commandhelper',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/widgets/metadata/general.form.fields/general.form.field.behavior',
  'csui/widgets/metadata/general.action.fields/general.action.field.behavior',
  'csui/models/version',
  'csui/controls/globalmessage/globalmessage',
  'hbs!csui/widgets/metadata/general.panels/node/impl/node.general.form',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/utils/base',
  'csui/utils/commands/versions', 'csui/models/nodeversions',
  'css!csui/widgets/metadata/general.panels/node/impl/node.general.form'
], function (_, $, log, FormView, CommandHelper,
    DefaultActionBehavior, GeneralFormFieldBehavior, GeneralActionFieldBehavior, VersionModel,
    GlobalMessage, formTemplate, lang, base, versionCommands, NodeVersionCollection) {
  'use strict';

  var NodeGeneralFormView = FormView.extend({

    behaviors: {
      defaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      generalFormFields: {
        behaviorClass: GeneralFormFieldBehavior,
        fieldParent: '.csui-extra-general-fields',
        fieldDescriptors: function () {
          return this.options.generalFormFieldDescriptors;
        },
        fieldViewOptions: function () {
          return {
            context: this.options.context,
            node: this.node,
            mode: this.options.mode,
            originatingView: this,
            metadataView: this.options.metadataView
          };
        }
      },
      generalActionFields: {
        behaviorClass: GeneralActionFieldBehavior,
        fieldParent: '.csui-action-fields',
        fieldDescriptors: function () {
          return this.options.generalActionFieldDescriptors;
        },
        fieldViewOptions: function () {
          return {
            context: this.options.context,
            node: this.node,
            mode: this.options.mode,
            originatingView: this,
            metadataView: this.options.metadataView
          };
        }
      }

    },

    className: 'cs-form csui-general-form',
    fieldToRefresh: ['modify_date', 'reserve_info'],

    constructor: function NodeGeneralFormView(options) {
      FormView.prototype.constructor.call(this, options);
      this.node = this.options.node;
      this.fieldToRefresh = _.union(this.fieldToRefresh, (options.fieldToRefresh || []));
      this.listenTo(this, 'change:field', this._saveField);
      this.listenTo(this.node, 'change', _.bind(function () {
        if (this.mode !== "create") {
          this.model.fetch();
        }
        var event = $.Event('tab:content:field:changed');
        this.$el.trigger(event);
      }, this));

      var action = this.defaultActionController.getAction(this.options.node);
      if (!action) {
        this.noDefaultActionExist = true;
      }
    },

    formTemplate: formTemplate,

    formTemplateHelpers: function () {
      var type_name = this.node.get('type_name'),
          node_name = this.node.get('name');
      return {
        showThumbnail: this.mode != 'create',
        showSize: this.model.get('data').size !== "",
        reserved: this.node.get('reserved'),
        title: this.noDefaultActionExist ? "" : _.str.sformat(lang.openDoc, type_name),
        aria_label: this.noDefaultActionExist ? "" :
                    _.str.sformat(lang.openDocAria, type_name, node_name)
      };
    },

    _getLayout: function () {
      var template = this.getOption('formTemplate'),
          html     = template.call(this, {
            data: this.alpaca.data,
            mode: this.mode
          }),
          bindings = this._getBindings(),
          view     = {
            parent: 'bootstrap-csui',
            layout: {
              template: html,
              bindings: bindings
            }
          };
      return view;
    },

    _getBindings: function () {
      var bindings = {
        name: 'name_section',
        create_date: '.owner_section',
        create_user_id: '.owner_section',
        modify_date: '.owner_section',
        owner_user_id: '.owner_section',
        mime_type: '.typename_section',
        description: '.description_section',
        itemId: '.owner_section',
        size: '.size_section'
      };
      if (this.node.get("reserved")) {
        bindings = _.extend(bindings, {
          reserve_info: ".reserve_info"
        });
      }
      if (this.node instanceof VersionModel) {
        bindings = _.extend(bindings, {
          version_number_name: ".owner_section",
          owner_id: ".owner_section"
        });
      }
      return bindings;
    },

    _saveField: function (args) {
      if (this.mode === 'create') {
        return;
      }

      var field   = args.targetField,
          changes = {};

      changes[field.name] = field.value;
      this._saveChanges(changes);
    },

    _saveChanges: function (changes) {
      var MN = '{0}:_saveGeneralChanges {1} {2}';
      var node = this.model.options.node,
          self = this;
      node.save(changes, {
        wait: true,
        patch: true
      }).then(function () {
        return node.fetch();
      }).fail(function (jqxhr) {
        var preValues = self.model.get('data');
        self.form.children.forEach(function (formField) {
          formField.setValue(preValues[formField.propertyId]);
          formField.refresh();
        });
        var error = new base.Error(jqxhr);
        GlobalMessage.showMessage('error', error.message);
        self.trigger('forms:error');
      });
    },

    onBeforeDestroy: function() {
      if (this.triggerDefaultAction) {
        this.triggerMethod('execute:DefaultAction', this.options.node);
      }
    },

    updateRenderedForm: function (options) {
      this.updateReserveFieldDisplay();
      FormView.prototype.updateRenderedForm.apply(this, arguments);

      this._showDefaultImage();
      var thumbnail = this.$el.find('.thumbnail_section');
      if (this.options.node instanceof VersionModel) {
        var versionNode = this.options.node;
        thumbnail.click(_.bind(function () {
          var cmd = versionCommands.get('VersionOpen');
          var status = {nodes: new NodeVersionCollection([versionNode])};
          var cmdOptions = {context: this.options.context, originatingView: this};
          cmd.execute(status, cmdOptions);
        }, this));
      } else {
        thumbnail.click(_.bind(function (event) {
          if (!this.noDefaultActionExist) {
            if (!!this.options.node.get("container")) {
              this.options.metadataView.trigger('metadata:close');
              this.triggerDefaultAction = true;
            } else {
              this.triggerMethod('execute:DefaultAction', this.options.node);
            }
          }
        }, this));
      }

      thumbnail.on("focusin", function (event) {
        base.checkAndScrollElemToViewport(event.currentTarget);
      });

      var $langSwitcher = $('<span></span>')
          .prop('class', 'icon csui-icon language-switcher')
          .prop('alt', 'Switch language')
          .prop('title', 'Switch language')
          .css('margin-left', '0.5em');
      var generalFormFieldDescriptors = this.options.generalFormFieldDescriptors;
      if (generalFormFieldDescriptors && generalFormFieldDescriptors.length) {
        this.listenToOnce(this, 'render:general:form:fields', options.async());
      }
    },

    setFocus: function () {
      var nonReadOnlyFields = this.$form.find('.alpaca-field:not(.alpaca-readonly) button');
      if (nonReadOnlyFields.length > 0) {
        nonReadOnlyFields[0].focus();
      }
    },

    updateForm: function () {
      if (!!this.node.isReservedClicked || !!this.node.isUnreservedClicked) {
        this.render();
        this.node.isReservedClicked = false;
        this.node.isUnreservedClicked = false;
      }
      var alpacaForm     = this.$el.alpaca('get'),
          requiredSwitch = !!this.node.collection && !!this.node.collection.requireSwitched;
      if (!!alpacaForm) {
        var data = this.model.get('data');
        for (var i = 0; i < this.fieldToRefresh.length; i++) {
          var field = alpacaForm.childrenByPropertyId[this.fieldToRefresh[i]],
              value = data[this.fieldToRefresh[i]];
          if (!!field && field.getValue() !== value && !requiredSwitch) {
            field.setValue(value);
            field.refresh();
          }
        }
      }
      this._showDefaultImage();
      this.updateReserveFieldDisplay();
      return this;
    },

    updateReserveFieldDisplay: function () {
      var reserveInfoElem = this.$el.find(".reserve_info");
      if (!!this.node.get('reserved')) {
        if (reserveInfoElem.hasClass("binf-hidden")) {
          reserveInfoElem.removeClass("binf-hidden");
        }
      } else {
        if (!reserveInfoElem.hasClass("binf-hidden")) {
          reserveInfoElem.addClass("binf-hidden");
        }
      }
    },

    _showDefaultImage: function () {
      var defaultThumbnailEl = this.$el.find('.default_thumbnail'),
          className          = 'thumbnail_missing';
      if (!!this.options && !!(this.options.model.get('data'))) {
        className = this.options.model.get('data').mimeTypeClassName;
      }
      defaultThumbnailEl.addClass(className);
      defaultThumbnailEl.removeClass('thumbnail_empty');
      var event = $.Event('tab:content:render');
      this.$el.trigger(event);
      if (!!this.noDefaultActionExist) {
        this.$el.find('.default_thumbnail').addClass('thumbnail_disabled');
      }
    }

  });

  return NodeGeneralFormView;

});
