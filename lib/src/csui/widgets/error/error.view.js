/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore','csui/lib/backbone', 'csui/controls/error/error.view'
], function (_, Backbone, ErrorControlView) {
  'use strict';

  var ErrorWidgetView = ErrorControlView.extend({

    className: function () {
      var cvclass = ErrorControlView.prototype.className;
      if( _.isFunction(cvclass)) {
        cvclass = cvclass.call(this);
      }
      return 'csui-error-widget ' + cvclass;
    },

    constructor: function ErrorWidgetView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          message: options.data.message,
          suggestion: options.data.suggestion
        });
      }

      ErrorControlView.prototype.constructor.call(this, options);
    }

  });

  return ErrorWidgetView;

});
