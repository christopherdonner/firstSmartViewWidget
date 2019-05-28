/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/lib/marionette',
  'css!csui/controls/globalmessage/impl/messagedialog',
], function (Backbone, Marionette) {
  'use strict';

  var CustomWrapperView = Marionette.ItemView.extend({

    constructor: function CustomWrapperView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      var contentView = this.getOption('contentView');
      if (!(contentView instanceof Backbone.View)) {
        contentView = contentView.call(this);
      }
      this.view = contentView;

      this.listenTo(contentView, 'destroy', this.destroy);
      this.region = new Marionette.Region({el: this.el});
    },

    className: 'csui-messagepanel',

    template: false,

    onRender: function () {
      this.region.show(this.view);
    },

    onDestroy: function () {
      this.region.empty();
    },

    doShow: function (relatedView, parentView) {
      this.options.messageHelper.showPanel(this, relatedView, parentView);
    }

  });

  return CustomWrapperView;

});
