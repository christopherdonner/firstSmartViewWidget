/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/models/form'
], function (Backbone, FormModel) {
  'use strict';

  var FormCollection = Backbone.Collection.extend({

    model: FormModel,

    constructor: function FormCollection(models, options) {
      this.options = options || (options = {});

      Backbone.Collection.prototype.constructor.call(this, models, options);
    }

  });

  return FormCollection;

});
