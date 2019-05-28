csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone) {
  var HistoryModel = Backbone.Model.extend({
    defaults: {
      id: 0
    },
    constructor: function Comment() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return HistoryModel;
});