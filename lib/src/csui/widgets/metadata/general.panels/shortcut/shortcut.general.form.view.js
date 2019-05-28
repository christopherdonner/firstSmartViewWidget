/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'csui/utils/contexts/factories/node',
  'hbs!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form',
  'css!csui/widgets/metadata/general.panels/shortcut/impl/shortcut.general.form'
], function (_, NodeGeneralFormView, NodeModelFactory, formTemplate) {
  'use strict';

  var ShortcutGeneralFormView = NodeGeneralFormView.extend({

    constructor: function ShortcutGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);
      if (options.context && options.node && options.node.original &&
          options.node.original.get('id') > 0) {
        options.context.getModel(NodeModelFactory, {
          attributes: {id: options.node.original.get('id')},
          node: options.node.original,
          temporary: true
        });
      }
    },

    formTemplate: formTemplate,

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        original_id: '.shortcut_section'
      });
    }

  });

  return ShortcutGeneralFormView;

});
