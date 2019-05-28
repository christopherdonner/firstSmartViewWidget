/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'hbs!csui/widgets/metadata/general.panels/url/impl/url.general.form',
  'css!csui/widgets/metadata/general.panels/url/impl/url.general.form'
], function (_, NodeGeneralFormView, formTemplate) {
  'use strict';

  var UrlGeneralFormView = NodeGeneralFormView.extend({

    constructor: function UrlGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);
    },

    formTemplate: formTemplate,

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        url: ".url_section"
      });
    }

  });

  return UrlGeneralFormView;

});
