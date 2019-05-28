/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/base'
], function (require, $, _, Backbone, base) {
  'use strict';

  describe('base', function () {
    describe('isPlaceholder', function () {
      it('recognizes string as a jQuery selector', function () {
        expect(base.isPlaceholder('#test')).toBeTruthy();
      });

      it('recognizes HTML DOM Element', function () {
        expect(base.isPlaceholder(document.body)).toBeTruthy();
      });

      it('recognizes jQuery object', function () {
        expect(base.isPlaceholder($(document.body))).toBeTruthy();
      });

      it('cannot be fooled by undefined or null', function () {
        expect(base.isPlaceholder()).toBeFalsy();
        expect(base.isPlaceholder(null)).toBeFalsy();
      });

      it('cannot be fooled by various values', function () {
        expect(base.isPlaceholder(123)).toBeFalsy();
        expect(base.isPlaceholder([''])).toBeFalsy();
        expect(base.isPlaceholder({test: ''})).toBeFalsy();
        expect(base.isPlaceholder(new Backbone.Model())).toBeFalsy();
        expect(base.isPlaceholder(new Backbone.View())).toBeFalsy();
      });
    });

    describe('isBackbone', function () {
      it('recognizes Backbone.Events', function () {
        function Test() {}

        _.extend(Test.prototype, Backbone.Events);
        expect(base.isBackbone(new Test())).toBeTruthy();
      });

      it('recognizes Backbone.Model and Backbone.Collection', function () {
        expect(base.isBackbone(new Backbone.Model())).toBeTruthy();
        expect(base.isBackbone(new Backbone.Collection())).toBeTruthy();
      });

      it('recognizes Backbone.View', function () {
        expect(base.isBackbone(new Backbone.View())).toBeTruthy();
      });

      it('cannot be fooled by undefined or null', function () {
        expect(base.isBackbone()).toBeFalsy();
        expect(base.isBackbone(null)).toBeFalsy();
      });

      it('cannot be fooled by various values', function () {
        expect(base.isBackbone(123)).toBeFalsy();
        expect(base.isBackbone('123')).toBeFalsy();
        expect(base.isBackbone([''])).toBeFalsy();
        expect(base.isBackbone({test: ''})).toBeFalsy();
        expect(base.isBackbone(document.body)).toBeFalsy();
        expect(base.isBackbone($(document.body))).toBeFalsy();
      });
    });

    describe('isVisibleInWindowViewport', function () {
      var extents, el, id;

      beforeAll(function () {
        window.scroll(0, 0);
        extents = {
          width: $(window).width(),
          height: $(window).height()
        };
        expect(extents.width).toBeGreaterThan(20);
        expect(extents.height).toBeGreaterThan(20);
      });

      beforeEach(function () {
        id = 'isVisibleInWindowViewport-' + _.uniqueId();
        el = $('<div>', {id: id})
            .css({
              width: '20px',
              height: '20px'
            })
            .prependTo(document.body);
      });

      afterEach(function () {
        el.remove();
      });

      it('returns false if the object is not in DOM',
          function () {
            var el = $('<div>').css({
                  width: '20px',
                  height: '20px'
                }),
                result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      it('returns false if the object does not exist',
          function () {
            var el = $('#dummy-' + _.uniqueId()),
                result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      it('accepts DOM element, jQuery object or selector string', function () {
        var result1 = base.isVisibleInWindowViewport(el),
            result2 = base.isVisibleInWindowViewport(el.get(0)),
            result3 = base.isVisibleInWindowViewport('#' + id);
        expect(result1).toEqual(result2);
        expect(result1).toEqual(result3);
      });

      it('returns true if the object is in the top left corner of the visible window part',
          function () {
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeTruthy();
          });

      it('returns true if the object is in the middle of the visible window part',
          function () {
            el.css({
              position: 'absolute',
              left: '10px',
              top: '10px'
            });
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeTruthy();
          });

      it('returns false if the object is in back of the visible window part',
          function () {
            el.css({
              position: 'absolute',
              left: extents.width + 'px',
              top: 0
            });
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      it('returns false if the object is in front of the visible window part',
          function () {
            el.css({
              position: 'absolute',
              left: -extents.width + 'px',
              top: 0
            });
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      it('returns false if the object is above the visible window part',
          function () {
            el.css({
              position: 'absolute',
              left: 0,
              top: extents.height + 'px'
            });
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      it('returns false if the object is below the visible window part',
          function () {
            el.css({
              position: 'absolute',
              left: 0,
              top: -extents.height + 'px'
            });
            var result = base.isVisibleInWindowViewport(el);
            expect(result).toBeFalsy();
          });

      describe('when the widow is scrolled to left and bottom', function () {
        beforeEach(function () {
          $(document.body).css({
            width: extents.width * 2,
            height: extents.height * 2
          });
          window.scroll(extents.width, extents.height);
        });

        afterEach(function () {
          window.scroll(0, 0);
          $(document.body).css({
            width: null,
            height: null
          });
        });

        it('returns false if the object is out of the scrolled-in area',
            function () {
              var result = base.isVisibleInWindowViewport(el);
              expect(result).toBeFalsy();
            });

        it('returns true if the object is within the scrolled-in area',
            function () {
              el.css({
                position: 'absolute',
                left: extents.width + 'px',
                top: extents.height + 'px'
              });
              var result = base.isVisibleInWindowViewport(el);
              expect(result).toBeTruthy();
            });
      });
    });
  });
});
