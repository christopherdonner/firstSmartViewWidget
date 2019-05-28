/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/dialogs/node.picker/node.picker', 'csui/utils/contexts/page/page.context'
], function (_, Backbone, Marionette, NodePicker, PageContext) {
  'use strict';

  var defaultOptions = {
    start: {},
    selectRows: 'single',
    filter: {},
    selectable: {},
    ui: {}
  };

  function TargetPicker(options) {
    this.options = _.defaults({}, options, defaultOptions);
  }

  _.extend(TargetPicker.prototype, Backbone.Events, {

    show: function (options) {
      options = _.defaults({}, options, this.options);

      var connector = options.connector || {connection: options.connection},
          context = new PageContext({
            factories: {connector: connector}
          }),

          initialContainer = _.isEmpty(options.start) ? undefined :
                             options.start.id ? options.start : {
                               id: 'volume',
                               type: options.start.type
                             },

          selectableTypes = _.isEmpty(options.selectable.type) ?
                            options.filter.type : options.selectable.type,

          nodePicker = new NodePicker({
            context: context,
            initialContainer: initialContainer,
            selectMultiple: options.selectRows === 'multiple',
            selectableTypes: selectableTypes,
            globalSearch: true,
            dialogTitle: options.ui.TargetPickerDialogTitle
          }),
          promise = nodePicker.show(),

          self = this;

      promise
          .done(function (args) {
            var firstNode = args.nodes[0],
                nodes = _.invoke(args.nodes, 'toJSON');
            self.trigger('childSelected', {
              sender: self,
              nodes: _.invoke(args.nodes, 'toJSON'),
              ancestors: [] // old version compatibility
            });
            options.done && options.done({
              sender: self, // old version compatibility
              node: firstNode && firstNode.toJSON(), // old version compatibility
              ancestors: [], // old version compatibility
              nodes: nodes
            });
          })
          .fail(function () {
            options.done && options.done({
              sender: self, // old version compatibility
              nodes: []
            });
          });

      return this;
    }

  });

  TargetPicker.defaults = {

    containers: {
      selectable: {
        type: NodePicker.defaults.containers.selectableTypes
      },
      ui: {
        TargetPickerDialogTitle: NodePicker.defaults.containers.dialogTitle
      }
    },

    documents: {
      selectable: {
        type: NodePicker.defaults.documents.selectableTypes
      },
      ui: {
        TargetPickerDialogTitle: NodePicker.defaults.documents.dialogTitle
      }
    },

    categories: {
      start: NodePicker.defaults.categories.initialContainer,
      selectable: {
        type: NodePicker.defaults.categories.selectableTypes
      },
      ui: {
        TargetPickerDialogTitle: NodePicker.defaults.categories.dialogTitle
      }
    }

  };

  return TargetPicker;

});
