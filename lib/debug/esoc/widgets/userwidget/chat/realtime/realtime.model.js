csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone) {

  var RealTimeModel = Backbone.Model.extend({
    constructor: function RealTimeModel(options) {
      // Define the subviews object off of the prototype chain
      this.submodel = {};
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function () {
    },
    getUserPresence: function (email) {
    },
    getUsersPresence: function (emailList) {
    }
  });

  return new RealTimeModel;
});

