/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'webreports/models/wrtext/wrtext.model'
], function (_,ModelFactory, ConnectorFactory, WrTextModel) {

  var WrTextModelFactory = ModelFactory.extend({
    propertyPrefix: 'wrtext',

    constructor: function WrTextModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.property = new WrTextModel(options.wrtext.attributes, {
        connector: connector
      });
    },

    fetch: function (options) {
      if (options){
        _.extend(options,{dataType:'html'});
      } else {
        options = {dataType:'html'};
      }
      return this.property.fetch(options);
    }

  });

  return WrTextModelFactory;

});
