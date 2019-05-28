/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/widget/widget.model',
  './widget.mock.js'
], function (WidgetModel, mock) {
  'use strict';

  describe('WidgetModel', function () {
    if (!window.require) {
      return it('Modules cannot be unloaded in the release mode.');
    }

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    it('can be created', function () {
      var widget = new WidgetModel();
      expect(widget instanceof WidgetModel).toBeTruthy();
    });

    describe('when fetched', function () {

      var widget;

      beforeAll(function (done) {
        widget = new WidgetModel({id: 'csui/widgets/favorites'});
        widget
            .fetch()
            .done(done);
      });

      it('provides main view by default', function () {
        expect(widget.get('view')).toBeTruthy();
      });

      it('provides manifest by default', function () {
        expect(widget.get('manifest')).toBeTruthy();
      });
      it('provides originating server module by default', function () {
        expect(widget.serverModule.id).toBeTruthy();
      });

      it('localizes manifest with a flat language module', function () {
        expect(JSON.stringify(widget.get('manifest'))).toEqual(
            JSON.stringify(mock.localizedManifests.favorites));
      });

      it('localizes manifest with a hierarchical language module', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/shortcut'});
        widget
            .fetch()
            .done(function () {
              expect(JSON.stringify(widget.get('manifest'))).toEqual(
                  JSON.stringify(mock.localizedManifests.shortcut));
              done();
            });
      });
      xit('does not fail, if requested and if the localization module is missing', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/error'});
        widget
            .fetch({ignoreErrors: true})
            .fail(function () {
              expect(JSON.stringify(widget.get('manifest'))).toEqual(
                  JSON.stringify(mock.localizedManifests.error));
              done();
            });
      });

      it('fails by default, if the localization module is missing', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/error'});
        widget
            .fetch()
            .fail(done);
      });

      it('does not fail, if a localization string is missing', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/placeholder'});
        widget
            .fetch()
            .done(function () {
              expect(JSON.stringify(widget.get('manifest'))).toEqual(
                  JSON.stringify(mock.localizedManifests.placeholder));
              done();
            });
      });

      it('ignores the error coming from a missing widget if specified', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/dummy'});
        widget
            .fetch({ignoreErrors: true})
            .done(function () {
              expect(widget.get('error')).toBeTruthy();
              done();
            });
      });

      it('fails if a widget is missing by default', function (done) {
        var widget = new WidgetModel({id: 'csui/widgets/dummy'});
        widget
            .fetch()
            .fail(function () {
              expect(widget.get('error')).toBeTruthy();
              done();
            });
      });
    });
  });
});
