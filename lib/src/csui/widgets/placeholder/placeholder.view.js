/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/lib/marionette',
  'hbs!./impl/placeholder', 'css!./impl/placeholder'
], function (Backbone, Marionette, placeholderTemplate) {

  var PlaceholderView = Marionette.ItemView.extend({

    className: 'cs-placeholder tile',
    template: placeholderTemplate,

    constructor: function PlaceholderView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = new Backbone.Model({
          label: options.data.label,
          bgcolor: options.data.bgcolor,
          color: options.data.color
        });
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      this.$el.css({
        color: this.model.get('color'),
        backgroundColor: this.model.get('bgcolor')
      });
    }

  });

  return PlaceholderView;
});
