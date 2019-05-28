/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'i18n',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/util/gallery',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/util/gallery.item',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/util/filmstrip.item',
  'css!csui/controls/thumbnail/content/thumbnail.icon/util/gallary'
], function (_, $, i18n, GalleryTemplate, GalleryItemTemplate, FlimStripItemTemplate) {
  'use strict';

  var data, galleryContent, galleryItems, galleryFilmItems, totalItems, currentItem, currentItemName, filmStripActiveItem, filmStripWidth;

  function createGalleryContainer(galleryData, currentItemIndex, lang) {
    data = galleryData;
    totalItems = galleryData.length;
    currentItem = galleryData[currentItemIndex];
    currentItemName = currentItem.name;

    galleryContent = $('<div />', {
      'class': 'binf-gallery-container',
      'html': GalleryTemplate({
        "totalItems": galleryData.length,
        "currentItem": currentItem.index + 1,
        "currentItemName": currentItemName,
        "lang": lang
      })
    });

    galleryItems = $('<div />', {
      'class': 'binf-carousel-inner',
      'html': GalleryItemTemplate({data: galleryData})
    });

    galleryFilmItems = $('<div />', {
      'class': 'csui-carousel-film-strip-inner',
      'html': FlimStripItemTemplate({data: galleryData})
    });

    galleryContent.find(".csui-carousel-film-strip .binf-carousel").html(galleryFilmItems);
    galleryContent.find(".csui-preview-carousal").html(galleryItems);

    if (data.length < 2) {
      galleryContent.find("#binf-carousel").children(".binf-left").hide();
      galleryContent.find("#binf-carousel").children(".binf-right").hide();
    }
    filmStripWidth = 74;
    var carouselFilmStripWidth = filmStripWidth * data.length;
    if ($(window).width() < carouselFilmStripWidth) {
      galleryContent.find('.csui-carousel-film-strip-inner').css('width',
          carouselFilmStripWidth + 'px');
      galleryContent.find('.csui-carousel-film-strip-inner').addClass('csui-film-strip-adjust');
    }

    galleryContent.find('#binf-carousel').on('slid.binf.carousel', updateSlide);
    galleryContent.find('.csui-thumb-toggle-control').on('click', {lang: lang}, thumbToggle);
    galleryContent.find('.csui-download-gallery').on('click', downloadItem);
    galleryFilmItems.find(".binf-item").on('keyup', function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        $(event.currentTarget) && $(event.currentTarget).find(".binf-thumb").trigger("click");
      }
    });
    return galleryContent;
  }

  function downloadItem(event) {
    currentItem.downloadItem(event);
  }

  function updateSlide(e) {
    filmStripWidth = $(
            galleryContent.find('.csui-carousel-film-strip-inner .binf-thumb-img')[0]).width() + 10;
    filmStripActiveItem = galleryContent.find('.csui-carousel-film-strip-inner').find(
        '.binf-item').removeClass('binf-active');
    var filmStripActiveElement = $(filmStripActiveItem[$(e.relatedTarget).index()]);
    filmStripActiveElement.addClass('binf-active');
    if (currentItem && currentItem.index >= 0) {
      currentItem = data[$(e.relatedTarget).index()];
      if (data[currentItem.index].model && data[currentItem.index].model.contentURL &&
          !data[currentItem.index].model.addedOriginalImage) {
        $(e.relatedTarget).addClass("csui-item-original");
        data[currentItem.index].addedOriginalImage = true;
        if ($(e.relatedTarget).find("img").length > 0) {
          $(e.relatedTarget).find("img").attr("src", data[currentItem.index].model.contentURL);
        }
        if ($(e.relatedTarget).find("video").length > 0) {
          $(e.relatedTarget).find("video").attr("src", data[currentItem.index].model.contentURL);
          $(e.relatedTarget).find(".outer-border").addClass("binf-hidden");
        }
      }
      currentItemName = currentItem.name;
      galleryContent.find('.csui-current-total-items').html(
          (currentItem.index + 1) + ' / ' + totalItems);
      galleryContent.find('.csui-active-item-name .item-name').html(currentItemName);
      currentItem.updateScroll(filmStripActiveElement);
    }
  }
  function thumbToggle(event) {
    galleryContent.find('.csui-carousel-film-strip .binf-carousel').slideToggle();
    galleryContent.find('.binf-glyphicon-menu-down').toggleClass('binf-glyphicon-menu-up');
    if (galleryContent.find('.binf-glyphicon-menu-up').length > 0) {
      galleryContent.find('.binf-glyphicon-menu-up').attr('title', event.data.lang.showTitle);
    } else {
      galleryContent.find('.binf-glyphicon-menu-down').attr('title', event.data.lang.hideTitle);
    }
  }

  return {
    createGalleryContainer: createGalleryContainer,
    updateSlide: updateSlide,
    thumbToggle: thumbToggle,
    downloadItem: downloadItem
  };
});