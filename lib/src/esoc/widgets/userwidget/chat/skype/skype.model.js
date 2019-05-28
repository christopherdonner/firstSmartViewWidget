/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/jquery',
      'csui/lib/backbone'],
    function (module, _require, $, Backbone) {
      var SkypeModel = Backbone.Model.extend({
        constructor: function SkypeModel(options) {
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        initialize: function () {
        }
      });
      return SkypeModel;
    });
