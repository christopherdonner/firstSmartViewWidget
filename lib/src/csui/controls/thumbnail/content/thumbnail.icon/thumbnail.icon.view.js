/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/impl/thumbnail.icon',
  'i18n!csui/controls/thumbnail/content/thumbnail.icon/impl/nls/localized.strings',
  'csui/controls/thumbnail/content/content.registry',
  'csui/controls/dialog/dialog.view',
  'csui/controls/thumbnail/content/thumbnail.icon/util/gallery.view',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'csui/models/nodes',
  'csui/utils/url',
  'csui/utils/taskqueue',
  'csui/utils/commands/download',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/lib/exif',
  'css!csui/controls/thumbnail/content/thumbnail.icon/impl/thumbnail.icon'
], function (module, _, $, Backbone, Marionette, base, NodeTypeIconView, nodeLinks, template, lang,
    ContentRegistry, DialogView, GalleryView, Thumbnail, NodeCollection, Url, TaskQueue,
    DownloadCommand, PerfectScrollingBehavior, EXIF) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  var ThumbnailIconView = Marionette.ItemView.extend({

    ui: {
      thumbnailIcon: '.csui-thumbnail-content-icon',
      iconcloseGallery:'.icon-close-gallery'
    },

    events: {
      'keydown': 'onKeyInView',
      'keydown @ui.iconcloseGallery':'handleShiftKey',
      'click @ui.thumbnailIcon': 'showThumbCarousel',
      'keyup @ui.thumbnailIcon': 'showGalleryView'
    },

    template: template,

    templateHelpers: function () {
      var node             = this.model,
          thumbnailAction  = this.model.get("mime_type") &&
                             this.model.get("mime_type").match(/^image|video\/*[-.\w\s]*$/g) ||
                             this.model.get("type") === 144,
          defaultActionUrl = nodeLinks.getUrl(this.model),
          typeAndName      = _.str.sformat(lang.typeAndNameAria, node.get('type_name'),
              node.get('name'));
      return {
        thumbnailAction: thumbnailAction,
        cid: (this.model && this.model.cid) || this.options.model.cid,
        defaultActionUrl: defaultActionUrl,
        typeAndNameAria: typeAndName,
        inactive: node.get('inactive'),
        inCreateMode: !this.model.get('id') // if node is in create mode e.g. add folder,
      };
    },

    constructor: function ThumbnailIconView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._createNodeTypeIcon)
          .listenTo(this, 'before:render', this._destroyNodeTypeIcon)
          .listenTo(this, 'before:destroy', this._destroyNodeTypeIcon)
          .listenTo(this.model, "update:thumbnail", this.updateThumbnailImage)
          .listenTo(this.model, "update:default:thumbnail", this.updateDefaultThumbnailImage);
    },

    showGalleryView: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.showThumbCarousel(event);
      }
    },

    showThumbCarousel: function (event) {
      var self            = this,
          showGalleryView = false;
      if (base.isSafari() || base.isMSBrowser() || base.isAppleMobile()) {
        showGalleryView = this.model.get("mime_type") &&
                          (this.model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                           this.model.get("mime_type").match(/^video\/(mp4|mov)$/g));
      } else {
        showGalleryView = this.model.get("mime_type") &&
                          (this.model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                           this.model.get("mime_type").match(/^video\/(mp4|webm|ogg|mov)$/g));
      }
      if (showGalleryView && showGalleryView.length > 0) {
        this.options.originatingView.blockingView.enable();
        var thumbNailCollection = _.filter(self.model.collection.models, function (model) {
          if (base.isSafari() || base.isMSBrowser() || base.isAppleMobile()) {
            return model.get("mime_type") &&
                   (model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                    model.get("mime_type").match(/^video\/(mp4|mov)$/g));
          } else {
            return model.get("mime_type") &&
                   (model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                    model.get("mime_type").match(/^video\/(mp4|webm|ogg|mov)$/g));
          }
        }, this);
        this.fetchGalleryImageURL(thumbNailCollection);
        var thumbnailGalleryData = [],
            currentItemIndex     = 0;

        self.thumbNailCollection = thumbNailCollection;
        _.each(thumbNailCollection, function (model, idx) {
          var thumbnailData = {
            name: model.get('name'),
            contentURL: model.contentURL ? model.contentURL :
                        model.thumbnail ? model.thumbnail.url : "",
            thumbnailURL: (model.thumbnail && model.thumbnail.url) ? model.thumbnail.url :
                          model.contentURL ? model.contentURL : "",
            id: model.cid,
            index: idx,
            activeItem: model.get('id') === self.model.get('id'),
            downloadItem: self.downloadItem.bind(null, model),
            updateScroll: self.updateScroll.bind(null, self),
            isVideo: model.get("mime_type").match(/^video\/*[-.\w\s]*$/g),
            videoType: model.get("mime_type"),
            model: model,
            videoNotSupportMsg: lang.videoNotSupportMsg,
            originalAvailable: model.contentURL ? true : false
          };
          if (model.get('id') === self.model.get('id')) {
            currentItemIndex = idx;
          }
          thumbnailGalleryData.push(thumbnailData);

        }, self);
        var galleryContainer = GalleryView.createGalleryContainer(thumbnailGalleryData,
            currentItemIndex, lang),
            galleryView      = new GalleryContentView({el: galleryContainer[0]});
        var dialog = new DialogView({
          title: "",
          headerView: '',
          view: galleryView,
          className: "csui-thumbcarousel-dialog",
          userClassName: "",
          largeSize: true
        });
        dialog.show();
        dialog.headerView.$el.find('.cs-icon-cross').removeClass("cs-icon-cross").addClass(
            "icon-close-gallery");
        dialog.headerView.$el.bind('keydown', _.bind(this.handleShiftKey, this));
        self.options.originatingView.blockingView.disable();
        self.galleryView = galleryView;
      } else if (!this.model.get("inactive") && !!this.model.get('id')) {
        this.trigger('execute:defaultAction', event);
      }
    },
    handleShiftKey: function(event) {
      var shiftKey = event.shiftKey;
      if(event.shiftKey && event.keyCode == 9) {              
        var cid = this.thumbNailCollection[this.thumbNailCollection.length-1].cid;
        setTimeout(function() {
          $(".binf-filmstrip-item-" + cid).focus();          
          }, 200);     
          }      
    },

    downloadItem: function (nodeModel, event) {
      new DownloadCommand().execute({
        nodes: new NodeCollection([nodeModel])
      });
    },

    updateScroll: function (view, element) {
      view.galleryView.updateScrollbar(element);
    },

    fetchOriginalThumbNails: function (thumbnailForNode) {
      var self     = this,
          model    = thumbnailForNode,
          deferred = $.Deferred();

      self._fetchThumbNailObject(model).done(function (node) {
        deferred.resolve(node);
      }).fail(function (node) {
        deferred.reject(node);
      });
      return deferred.promise();
    },

    _fetchThumbNailObject: function (node) {
      var deferredObject = $.Deferred(),
          thumbnail      = new Thumbnail({
            node: node
          });
      thumbnail.load();
      this.listenTo(thumbnail, 'load', function (thumbnail) {
            node.thumbnail = {};
            node.thumbnail.url = thumbnail.url;
            node.attributes.thumbnailPreviewAvailable = true;
            node.trigger('update:thumbnail', node);
            deferredObject.resolve(node);
          })
          .listenTo(thumbnail, 'error', function (thumbnail) {
            node.thumbnail = {};
            node.thumbnail.url = undefined;
            node.attributes.thumbnailPreviewAvailable = false;
            node.trigger('update:default:thumbnail', node);
            deferredObject.reject(node);
          });
      return deferredObject.promise();
    },

    updateThumbnailImage: function (node) {
      if (node && node.thumbnail) {
        var thumbnailItemContainer = this.$el.find(
            '.csui-thumbnail-content-icon.thumbnail-' + node.cid);
        thumbnailItemContainer.find(".csui-icon-group").css('background-image',
            'url(' + node.thumbnail.url + ')');
        thumbnailItemContainer.addClass('thumbnailPreview');
        if ($(".binf-filmstrip-item-" + node.cid).length > 0) {
          var filmStripImage = $(".binf-filmstrip-item-" + node.cid).find("img");
          if (filmStripImage.length > 0) {
            filmStripImage.attr("src", node.thumbnail.url);
          }
        }
      }
    },

    updateDefaultThumbnailImage: function (node) {
      if (node && node.thumbnail && node.thumbnail.url) {
        var thumbnailItemContainer = this.$el.find(
            '.csui-thumbnail-content-icon.thumbnail-' + node.cid);
        thumbnailItemContainer.find(".csui-icon-group").css('background-image',
            'url(' + node.thumbnail.url + ')');
        thumbnailItemContainer.find(".csui-icon").addClass("binf-hidden");
      }
    },

    fetchGalleryImageURL: function (models) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(models, function (model) {
            var deferred = $.Deferred();
            if (!model.contentURL) {
              queue.pending.add({
                worker: function () {
                  self._fetchImageOpenURL(model).done(function (node) {
                    deferred.resolve(node);
                  }).fail(function (node) {
                    deferred.reject(node);
                  });

                  return deferred.promise();
                }
              });
            }
            return deferred.promise(promises);  // return promises
          });
      return $.whenAll.apply($, promises);
    },

    _fetchImageOpenURL: function (node) {
      var self            = this,
          deferredObject  = $.Deferred(),
          photoUrl        = Url.combine(node.connector.connection.url, '/nodes',
              node.get('id'), '/content?action=open&suppress_response_codes'),
          getPhotoOptions = node.connector.extendAjaxOptions({
            url: photoUrl,
            dataType: 'binary'
          });
      if (node.get("type") === 144) {
        var transformDegrees = 0, flipRight = false;
        $.ajax(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                node.contentURL = URL.createObjectURL(response);
                node.addedOriginalImage = true;
                if (node.get("mime_type").match(/^video\/!*[-.\w\s]*$/g)) {
                  var video = self.galleryView &&
                              self.galleryView.$el.find(".binf-item-" + node.cid).find("video");
                  if (video.length > 0) {
                    video.attr("src", node.contentURL);
                    self.galleryView.$el.find(".binf-item-" + node.cid).addClass(
                        "csui-item-original");
                    self.galleryView.$el.find(
                        ".binf-item-" + node.cid + " .csui-img-loader").addClass(
                        "binf-hidden");
                  }
                } else {
                  var galleryItem    = self.galleryView &&
                                       self.galleryView.$el.find(".binf-item-" + node.cid),
                      thumbnailImage = galleryItem.find(".csui-gallery-thumbnail-icon"),
                      originalImage  = galleryItem.find(".csui-gallery-original-icon");
                  EXIF.getData(response, function () {
                    var myData      = this,
                        orientation = myData && myData.exifdata && myData.exifdata.Orientation;
                    if (orientation === 7 || orientation === 8) {
                      transformDegrees = -90;
                    } else if (orientation === 5 || orientation === 6) {
                      transformDegrees = 90;
                    } else if (orientation === 3 || orientation === 4) {
                      transformDegrees = 180;
                    } else {
                      transformDegrees = 0;
                    }
                    if (orientation === 2 || orientation === 4 || orientation === 5 ||
                        orientation === 7) {
                      flipRight = true;
                    }
                    if (thumbnailImage.length > 0) {
                      originalImage.find("img").attr("src", node.contentURL);
                      originalImage.find("img").addClass("csui-item-original");
                      originalImage.removeClass("binf-hidden");
                      thumbnailImage.addClass("binf-hidden");
                      if (flipRight) {
                        originalImage.find("img").css({
                          "-webkit-transform": "scaleX(-1)",
                          "-moz-transform": "scaleX(-1)",
                          "-o-transform": "scaleX(-1)",
                          "transform": "scaleX(-1)",
                          "filter": "FlipH",
                          "-ms-filter": "FlipH"
                        });
                      }
                      originalImage.find("img").css({
                        "-webkit-transform": "rotate(" + transformDegrees + "deg)",
                        "-moz-transform": "rotate(" + transformDegrees + "deg)",
                        "-ms-transform": "rotate(" + transformDegrees + "deg)",
                        "-o-transform": "rotate(" + transformDegrees + "deg)",
                        "transform": "rotate(" + transformDegrees + "deg)"
                      });
                    }
                  });
                }
                deferredObject.resolve();
              }
            }, this));
      }
      return deferredObject.promise();
    },

    _createNodeTypeIcon: function () {
      var iconView = new NodeTypeIconView({node: this.model});
      this.contentRegion = new Marionette.Region({el: this.$('> *')});
      this.contentRegion.show(iconView);
      if (this.model.get("type") === 144 && !(this.model.thumbnail && this.model.thumbnail.url)) {
        this.fetchOriginalThumbNails(this.model);
      } else if (this.model.get("type") === 144 && this.model.thumbnail &&
                 this.model.thumbnail.url) {
        this.updateThumbnailImage(this.model);
      } else if (this.model.get("type") === 144 && this.model.thumbnail &&
                 !this.model.thumbnail.url) {
        this.updateDefaultThumbnailImage(this.model);
      }
    },

    _destroyNodeTypeIcon: function () {
      if (this.contentRegion) {
        this.contentRegion.empty();
        this.contentRegion = null;
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.$el.find('a.csui-thumbnail-content-default-action').click();
      }
    }
  });

  var GalleryContentView = Marionette.View.extend({

    constructor: function GalleryContentView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.binf-filmstrip-container',
        suppressScrollY: true,
        scrollXMarginOffset: 2
      }
    },
    updateScrollbar: function (element) {
      this.trigger('update:scrollbar');
      var container = this.$(this.behaviors.PerfectScrolling.contentParent),
          scrollX   = this.$el.find('.binf-filmstrip-container').scrollLeft(),
          adjustScrollLeft;
      if (element.offset().left + element.width() >= container.width()) {
        adjustScrollLeft = element.offset().left - container.width() + scrollX + element.width() +
                           20;
      } else if (element.offset().left <= 0) {
        adjustScrollLeft = element.offset().left + scrollX - 5;
      }
      this.$(this.behaviors.PerfectScrolling.contentParent).animate(
          {scrollLeft: adjustScrollLeft}, "fast");
    }
  });

  ContentRegistry.registerByKey('thumbnailIcon', ThumbnailIconView);
  return ThumbnailIconView;
});
