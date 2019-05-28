/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'hbs!csui/utils/commands/impl/thumbnail/loading.thumbnail',
  'hbs!csui/utils/commands/impl/thumbnail/no.thumbnail',
  'hbs!csui/utils/commands/impl/thumbnail/thumbnail',
  'css!csui/utils/commands/impl/thumbnail/thumbnail'
], function (Marionette, Thumbnail,
    loadingThumbnail, noThumbnail, thumbnail) {
  'use strict';

  var ThumbnailView = Marionette.ItemView.extend({

    className: 'csui-thumbnail',

    getTemplate: function () {
      var url = this.thumbnail.url;
      return url === undefined ? loadingThumbnail :
             url ? thumbnail : noThumbnail;
    },

    constructor: function ThumbnailView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.thumbnail = this.options.thumbnail || new Thumbnail({
        node: this.options.node
      });
      this.listenTo(this.thumbnail, 'load', this.render)
          .listenTo(this.thumbnail, 'error', this.render)
          .listenTo(this, 'render', function () {
            this.thumbnail.url === undefined && this.thumbnail.load();
          })
          .listenTo(this, 'destroy', function () {
            this.thumbnail.destroy();
          });
    },

    serializeData: function () {
      return {
        url: this.thumbnail.url
      };
    }

  });

  return ThumbnailView;

});
