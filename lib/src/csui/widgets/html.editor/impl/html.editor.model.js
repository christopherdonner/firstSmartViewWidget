/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model'
], function (_, $, Backbone, Url, NodeModel) {
  "use strict";

  var HtmlEditorModel = NodeModel.extend({

    constructor: function HtmlEditorModel(options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, options);
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  _.extend(HtmlEditorModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      var url = Url.combine(this.options.connector.connection.url,
          "nodes/" + this.options.id + "/content");
      return url;
    },

    parse: function (response) {
      return {
        'data': response,
        'oldData': response //old Data required on cancel after updating data with autosaved
      };
    }
  });

  return HtmlEditorModel;

});

