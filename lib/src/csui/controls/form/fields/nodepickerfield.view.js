/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model', 'csui/models/nodeancestors',
  'csui/controls/form/impl/fields/csformfield.states.behavior',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/node',
  'hbs!csui/controls/form/impl/fields/nodepicker/nodepicker',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/utils/commands', 'csui/utils/defaultactionitems',
  'csui/utils/node.links/node.links',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/nodepicker/nodepicker',
  'csui/lib/binf/js/binf'
], function (module, _, $, Backbone, Marionette, ConnectorFactory,
    NodeModel, NodeAncestorCollection, FormFieldStatesBehavior,
    FormFieldView, DefaultActionBehavior, NodeModelFactory, template,
    FormArrayFieldStatesBehavior, commands, defaultActionItems, nodeLinks,
    lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    maxDesciptLines: 5
  });

  var NodePickerFieldView = FormFieldView.extend({
    constructor: function NodePickerFieldView(options) {
      FormFieldView.apply(this, arguments);
      this.behaviors = _.extend({
        defaultAction: {
          behaviorClass: DefaultActionBehavior
        }
      }, this.behaviors);

      var context = this.options.context;
      this.connector = context.getObject(ConnectorFactory);
      var id = this.model.get('data');
      this.node = new NodeModel(undefined, {
        connector: this.connector,
        autofetch: true,
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
      this.listenTo(this.node, 'sync', this._renderNode)
          .listenTo(this.node, 'error', this._renderError);
      this.ancestors = new NodeAncestorCollection(undefined, {
        node: this.node,
        autofetch: true
      });
      this.listenTo(this.ancestors, 'sync', this._renderNode)
          .listenTo(this.ancestors, 'error', this._renderError);

      if (this.options.alpacaField && this.options.alpacaField.options.mode) {
        this.options.alpacaField.options.anchorTitle = "";
        this.options.alpacaField.options.anchorTitleShort = "";
      }
      if (id) {
        var sharedNode = context.getModel(NodeModelFactory, {
          attributes: {id: id},
          temporary: true
        });
        this.node.set(sharedNode.attributes);
      }

      this._isReadyToSave = true;
      this.editVal = id;
      this.oldVal = id;
    },

    ui: {
      readArea: '.cs-field-read',
      readField: '.cs-field-read a',
      writeArea: '.cs-field-write',
      writeField: '.cs-field-write input',
      searchIcon: '.cs-search-icon',
      button: '.cs-field-read a'
    },

    events: {
      'keydown @ui.writeArea': 'onKeyDown',
      'mousedown @ui.writeField': 'onClickWriteField',
      'click @ui.searchIcon': 'onSearchIconClicked',
      'click @ui.button': 'onClickButton'
    },

    className: 'cs-formfield cs-nodepicker',

    template: template,

    templateHelpers: function () {
      var multiFieldLabel = "",
          isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();

      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }
      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        asReadonly: this.options.formView.mode === 'create',
        inputType: 'text',
        idBtnLabel: this.options.labelId,
        multiFieldLabel: multiFieldLabel
      });
    },

    onRender: function () {
      this.ui.writeField.change(_.bind(function () {
        this._isReadyToSave = true;
      }, this));
      setTimeout(_.bind(function () {
        var event = $.Event('tab:content:field:changed');
        this.$el.trigger(event);
      }, this), 100);
    },
    allowEditOnClickReadArea: function () {
      return false;
    },
    allowEditOnEnter: function () {
      return false;
    },

    _getNodePicker: function () {
      var deferred   = $.Deferred(),
          self       = this,
          alpOptions = this.model.get('options') || {},
          alpSchema  = this.model.get('schema') || {},
          label      = alpOptions.label || alpSchema.title,
          parent     = this.node.parent && this.node.parent.attributes ||
            (alpOptions.type_control && alpOptions.type_control.parameters.parent) ||
                       this.alpacaField.parent.data[0] ||
                       undefined,
          nodeId     = parent && parent.id || parent;
      if (!nodeId || nodeId < 0) {
        nodeId = this.node.attributes.id;
      }
      require(['csui/dialogs/node.picker/node.picker'], function (NodePicker, UserModelFactory) {

        var parameters        = alpOptions.type_control.parameters,
            nodePickerOptions = {
              connector: self.connector,
              dialogTitle: _.str.sformat(lang.nodePickerDialogTitle, label),
              selectableTypes: parameters.select_types,
              unselectableTypes: parameters.nonselect_types,
              globalSearch: true,
              context: self.options.context,
              initialContainer: {
                id: nodeId
              },
              initialSelection: [self.node],
              unselectableNodes: [self.node],
              resolveShortcuts: true,
              resultOriginalNode: true
            };

        if (!!parameters.startLocation) {
          nodePickerOptions.startLocation = parameters.startLocation;
        }
        if (!!parameters.startLocations) {
          nodePickerOptions.startLocations = parameters.startLocations;
        }

        var nodePicker = new NodePicker(nodePickerOptions);

        deferred.resolve(nodePicker);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },

    _showNodePicker: function () {
      if (!this._isReadyToSave) {
        return;
      }
      this._isReadyToSave = false;

      this._getNodePicker()
          .then(_.bind(function (nodePicker) {

            nodePicker.show()
                .done(_.bind(function (args) {
                  var newNode = args.nodes[0],
                      newId   = newNode.get('id');

                  if (this.getStatesBehavior().isWriteOnly() ||
                      this.getStatesBehavior().isStateWrite()) {
                    this.editVal = newId;
                  } else {
                    this.getStatesBehavior().setStateRead(false, true);
                  }
                  this.setValue(newId, true);
                  this.node.set(newNode.attributes);
                  var sharedNode = this.options.context.getModel(NodeModelFactory, {
                    attributes: {id: newId},
                    temporary: true
                  });
                  sharedNode.set(newNode.attributes);
                }, this))
                .fail(_.bind(function () {
                }, this))
                .always(_.bind(function () {
                  this.ui.writeField.focus();
                  this._isReadyToSave = true;
                }, this));
          }, this));
    },

    getEditValue: function () {
      return this.editVal;
    },

    getOldValue: function () {
      return this.oldVal;
    },

    isReadyToSave: function () {
      return this._isReadyToSave;
    },

    onKeyDown: function (event) {
      if (event.keyCode === 40) {
        this._showNodePicker();
      }
    },

    onClickWriteField: function (event) {
      this._showNodePicker();
    },

    onClickButton: function (event) {
      event.preventDefault();
      var formView = this.options.formView;
      if (formView.mode !== 'create' && this.node.get('id')) {
        this.triggerMethod('execute:defaultAction', this.node);
      }
    },
    setStateWrite: function (validate, focus) {

      if (this.getStatesBehavior().isWriteOnly() || this.getStatesBehavior().isStateWrite()) {
        this.ui.readArea.addClass('binf-hidden');
        this.ui.writeArea.removeClass('binf-hidden');
        this.ui.writeField.focus();
      } else {
        this._showNodePicker();
      }

      return true;
    },
    _prepareFieldText: function () {
      var ancestors = this.ancestors.pluck('name');
      var path;
      if (this.$el.width() > 0 && ancestors.length > 0) {
        var $locElement = this._getLocationElement();
        var maxHeight = this._getElementHeightWithXLines($locElement, config.maxDesciptLines);
        var truncatedAncestors = this._truncateAncestorsToFit(ancestors, $locElement, maxHeight);
        path = truncatedAncestors.join(' > ');
      }
      else {
        path = ancestors.join(' > ');
      }

      return path;
    },

    _getLocationElement: function () {
      var $el = this.$el;
      var $locElement = $el.find('> .cs-field-read .btn-container span');
      $locElement = $locElement.length > 0 ? $locElement :
                    $el.find('> .cs-field-read .btn-container a');
      return $locElement;
    },

    _getElementHeightWithXLines: function ($element, numberOfLines) {
      var lineHeight = $element.css('line-height');
      return parseInt(lineHeight) * numberOfLines;
    },

    _truncateAncestorsToFit: function (ancestors, $element, maxHeight) {
      var truncatedAncestors = this._removeAncestorsToFit(ancestors, $element, maxHeight);
      var fit;
      var ancestorNameIndex;
      fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      var wasTruncated = (truncatedAncestors.length > 1) && (truncatedAncestors[1] === "...");
      if (wasTruncated === true && fit.underflow === true) {
        var numberOfAncestorsRemoved = ancestors.length - truncatedAncestors.length + 1;
        var lastAncestorRemoved = ancestors[numberOfAncestorsRemoved];
        if (numberOfAncestorsRemoved === 1) {
          truncatedAncestors[1] = lastAncestorRemoved;
          ancestorNameIndex = 1;
        }
        else {
          truncatedAncestors.splice(2, 0, lastAncestorRemoved);
          ancestorNameIndex = 2;
        }
        truncatedAncestors = this._truncateNameToFit(truncatedAncestors, $element, maxHeight,
            ancestorNameIndex);
      }
      fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      if (fit.overflow === true) {
        ancestorNameIndex = 0;
        truncatedAncestors = this._truncateNameToFit(truncatedAncestors, $element, maxHeight,
            ancestorNameIndex);
      }
      fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      if (fit.overflow === true) {
        ancestorNameIndex = truncatedAncestors.length - 1;
        truncatedAncestors = this._truncateNameToFit(truncatedAncestors, $element, maxHeight,
            ancestorNameIndex);
      }

      return truncatedAncestors;
    },

    _removeAncestorsToFit: function (ancestors, $element, maxHeight) {
      var truncatedAncestors = [].concat(ancestors);
      var minAncestors = 2;
      var fit;
      var secondAncestorReplaced;

      secondAncestorReplaced = false;
      fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      while (fit.overflow === true && truncatedAncestors.length > minAncestors) {
        if (secondAncestorReplaced === false) {
          truncatedAncestors.splice(1, 1, "...");
          secondAncestorReplaced = true;
          minAncestors = 3;
        }
        else {
          truncatedAncestors.splice(2, 1);
        }
        fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      }

      return truncatedAncestors;
    },

    _truncateNameToFit: function (ancestors, $element, maxHeight, nameIndex) {
      var truncatedAncestors = [].concat(ancestors);
      var ancestorName = truncatedAncestors[nameIndex];
      var fit;

      fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      while (fit.overflow === true && ancestorName.length > 1) {
        ancestorName = ancestorName.substr(0, ancestorName.length - 1);
        truncatedAncestors[nameIndex] = ancestorName + "...";
        fit = this._checkAncestorsFit(truncatedAncestors, $element, maxHeight);
      }

      return truncatedAncestors;
    },

    _checkAncestorsFit: function (ancestors, $element, maxHeight) {
      $element.text(ancestors.join(' > '));
      var height = $element.height();
      return {
        overflow: (height > maxHeight),
        underflow: (height < maxHeight)
      };
    },

    _renderNode: function () {
      var url = nodeLinks.getUrl(this.node);
      var enabled = this.defaultActionController.hasAction(this.node);
      var anchorTitle = this.ancestors.pluck('name').join(' > ');
      var anchorShortTitle = this._prepareFieldText();

      this._renderField(url, enabled, anchorTitle, anchorShortTitle);
    },

    _renderError: function () {
      this._renderField('#', false,
          lang.originalNodeUnavailableTooltip, lang.originalNodeUnavailable);
    },

    _renderField: function (url, enabled, title, shortTitle) {
      var buttonDisabled, disabledClass;
      if (window.csui && window.csui.mobile) {
        buttonDisabled = this.model.attributes.options.buttonDisabled;
        disabledClass = this.model.attributes.options.disabledClass;
      } else {
        buttonDisabled = !enabled;
        disabledClass = enabled ? '' : 'binf-disabled';
      }
      _.extend(this.model.attributes.options, {
            url: url,
            buttonDisabled: buttonDisabled,
            disabledClass: disabledClass,
            anchorTitle: title,
            anchorTitleShort: shortTitle
          }
      );
      this.render();
    },

    onKeyPress: function (event) {
      if (event.keyCode === 13) { // enter
        this._showNodePicker();
      }
      if (event.keyCode !== 9) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    resetOldValueAfterCancel: function () {
      return true;
    },

    isFocusedOut: function (event) {
      return ($(".target-browse").length > 0);
    }
  });

  return NodePickerFieldView;
});
