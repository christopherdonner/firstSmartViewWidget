/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/widget/widget.collection',
  './widget.mock.js'
], function (WidgetCollection, mock) {
  'use strict';

  describe('WidgetCollection', function () {
    if (!window.require) {
      return it('Modules cannot be unloaded in the release mode.');
    }

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    it('can be created for specific widgets', function () {
      var widgets = new WidgetCollection([
        {id: 'csui/widgets/favorites'}
      ]);
      expect(widgets.length).toEqual(1);
      expect(widgets.first().id).toEqual('csui/widgets/favorites');
    });
    it('includes all registered widgets, when created empty', function () {
      var widgets = new WidgetCollection();
      expect(widgets.length).toBeGreaterThan(0);
      expect(widgets.every(function (widget) {
        return !!widget.id;
      })).toBeTruthy();
    });

    describe('when fetched', function () {
      var widgets;

      beforeAll(function (done) {
        widgets = new WidgetCollection([
          {id: 'csui/widgets/favorites'},
          {id: 'csui/widgets/shortcut'},
          {id: 'csui/widgets/error'},
          {id: 'csui/widgets/placeholder'}
        ]);
        widgets
            .fetch()
            .done(done);
      });

      it('provides main view by default', function () {
        expect(widgets.every(function (widget) {
          return !!widget.get('view');
        })).toBeTruthy();
      });

      it('provides manifest by default', function () {
        expect(widgets.every(function (widget) {
          return !!widget.get('manifest');
        })).toBeTruthy();
      });
      it('provides originating server module by default', function () {
        expect(widgets.every(function (widget) {
          return !!widget.serverModule.id;
        })).toBeTruthy();
      });

      it('localizes manifest with a flat language module', function () {
        expect(JSON.stringify(widgets.first().get('manifest'))).toEqual(
            JSON.stringify(mock.localizedManifests.favorites));
      });

      it('localizes manifest with a hierarchical language module', function () {
        expect(JSON.stringify(widgets.at(1).get('manifest'))).toEqual(
            JSON.stringify(mock.localizedManifests.shortcut));
      });

      it('does not fail by default, if the localization module is missing', function () {
        expect(JSON.stringify(widgets.at(2).get('manifest'))).toEqual(
            JSON.stringify(mock.localizedManifests.error));
      });

      it('does not fail, if a localization string is missing', function () {
        expect(JSON.stringify(widgets.at(3).get('manifest'))).toEqual(
            JSON.stringify(mock.localizedManifests.placeholder));
      });

      it('ignores errors coming from missing widgets by default', function (done) {
        var widgets = new WidgetCollection([
          {id: 'csui/widgets/dummy'}
        ]);
        widgets
            .fetch()
            .done(function () {
              expect(widgets.first().get('error')).toBeTruthy();
              done();
            });
      });

      it('fails if widgets are missing if specified', function (done) {
        var widgets = new WidgetCollection([
          {id: 'csui/widgets/dummy'}
        ]);
        widgets
            .fetch({ignoreErrors: false})
            .fail(function () {
              expect(widgets.first().get('error')).toBeTruthy();
              done();
            });
      });
    });
  });
});
