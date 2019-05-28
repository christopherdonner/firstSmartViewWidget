/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'hbs!csui/widgets/metadata/general.panels/document/impl/document.general.form',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/general.panels/document/impl/document.general.form'
], function (_, $, Thumbnail, NodeGeneralFormView, formTemplate, lang) {
  'use strict';

  var DocumentGeneralFormView = NodeGeneralFormView.extend({

    constructor: function DocumentGeneralFormView(options) {
      NodeGeneralFormView.prototype.constructor.call(this, options);

      this.thumbnail = this.options.thumbnail || new Thumbnail({
            node: this.options.node
          });
      this.listenTo(this.thumbnail, 'load', this._showImage)
          .listenTo(this.thumbnail, 'error', this._showDefaultImage)
          .listenTo(this, 'destroy', function () {
            this.thumbnail.destroy();
          });
    },

    formTemplate: formTemplate,
    fieldToRefresh: ['modify_date', 'reserve_info', 'mime_type', 'size'],
    formTemplateHelpers: function () {
      var type_name = this.node.get('type_name'),
          doc_name  = this.node.get('name');
      return {
        showThumbnail: this.mode != 'create',
        title: _.str.sformat(lang.openDoc, type_name),
        aria_label: _.str.sformat(lang.openDocAria, type_name, doc_name),
        reserved: this.node.get('reserved'),
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        imgAlt: lang.docPreviewAlt
      };
    },

    _getBindings: function () {
      var bindings = NodeGeneralFormView.prototype._getBindings.apply(this, arguments);
      return _.extend(bindings, {
        size: ".size_section"
      });
    },

    updateRenderedForm: function (options) {
      NodeGeneralFormView.prototype.updateRenderedForm.apply(this, arguments);
      if (this.mode !== 'create') {
        var self = this;
        if (!!this.thumbnail.url) {
          this._showImage();
        } else {
          this.thumbnail.load();
        }
      }
    },

    _showImage: function () {
      var self                 = this,
          img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded');
      img.attr("src", this.thumbnail.url);
      img.prop('tabindex', '0');
      img.one('load', function (evt) {

        if (evt.target.clientHeight >= evt.target.clientWidth) {
          img.addClass('cs-form-img-vertical');
        } else {
          img.addClass('cs-form-img-horizontal');
        }
        img.addClass('cs-form-img-border');
        thumbnailNotLoadedEl.addClass('binf-hidden');
        img.removeClass('binf-hidden');
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);
      });
    },

    _showDefaultImage: function () {
      var img                  = this.$el.find('.img-doc-preview'),
          thumbnailNotLoadedEl = this.$el.find('.thumbnail_not_loaded'),
          className            = 'thumbnail_missing';
      if (!!this.options && !!(this.options.model.get('data'))) {
        className = this.options.model.get('data').mimeTypeClassName;
      }
      !!thumbnailNotLoadedEl.prop("className") &&
      thumbnailNotLoadedEl.prop("className").split(' ').forEach(_.bind(function (str) {
        if (str.indexOf('mime') === 0) {
          thumbnailNotLoadedEl.removeClass(str);
        }
      }, thumbnailNotLoadedEl));

      thumbnailNotLoadedEl.addClass(className);
      thumbnailNotLoadedEl.removeClass('thumbnail_empty');
      thumbnailNotLoadedEl.removeClass('csui-icon-notification-error');
      thumbnailNotLoadedEl.removeClass('binf-hidden');
      img.addClass('binf-hidden');
      var event = $.Event('tab:content:render');
      this.$el.trigger(event);
    }
  });

  return DocumentGeneralFormView;

});
