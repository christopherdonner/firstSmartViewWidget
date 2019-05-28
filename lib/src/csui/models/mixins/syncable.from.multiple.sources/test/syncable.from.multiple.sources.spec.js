/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  './syncable.from.multiple.sources.mock.js'
], function (_, $, Backbone, SyncableFromMultipleSourcesMixin, mock) {
  'use strict';

  describe('SyncableFromMultipleSourcesMixin', function () {
    describe('when used with generic promises', function () {
      beforeAll(function () {
        this.TestModel = Backbone.Model.extend({
          constructor: function TestModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeSyncableFromMultipleSources(options);
          },

          sync: function (method, model, options) {
            var first = $.Deferred(),
                second = $.Deferred();
            setTimeout(function () {
              first.resolve({name: 'test'});
            });
            setTimeout(function () {
              if (options.fail) {
                second.reject({failure: true});
              } else {
                second.resolve({type: 1});
              }
            });
            return this.syncFromMultipleSources(
                [first.promise(), second.promise()],
                this._mergeSources, this._convertError, options);
          },

          _mergeSources: function (first, second) {
            return Object.assign({}, first, second);
          },

          _convertError: function (response) {
            return {
              statusText: 'Bad Request',
              responseJSON: response
            };
          }
        });

        SyncableFromMultipleSourcesMixin.mixin(this.TestModel.prototype);
      });

      declareTests();
    });

    describe('when used with $.ajax calls', function () {
      beforeAll(function () {
        this.TestModel = Backbone.Model.extend({
          constructor: function TestModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeSyncableFromMultipleSources(options);
          },

          sync: function (method, model, options) {
            var first = $.ajax({
                  url: '//server/otcs/cs/api/v1/test/1'
                }),
                second = $.ajax({
                  url: '//server/otcs/cs/api/v1/test/' +
                       (options.fail ? '3' : '2')
                });
            return this.syncFromMultipleSources(
                [first, second], this._mergeSources, options);
          },

          _mergeSources: function (first, second) {
            return Object.assign({}, first[0], second[0]);
          }
        });

        SyncableFromMultipleSourcesMixin.mixin(this.TestModel.prototype);

        mock.enable();
      });

      afterAll(function () {
        mock.disable();
      });

      declareTests();
    });

    function declareTests() {
      it('triggers the "request" event just once like the standard sync',
          function (done) {
            var model = new this.TestModel(),
                triggered;
            model.on('request', function (fetchedModel, object, options) {
                   expect(triggered).toBeFalsy();
                   expect(fetchedModel).toBe(model);
                   expect(object).toBeTruthy();
                   expect(options.fail).toBe(false);
                   triggered = true;
                   done();
                 })
                 .fetch({fail: false});
          });

      describe('and succeeded fetching', function () {
        it('passes the merged response to model attributes',
            function (done) {
              var model = new this.TestModel();
              model.fetch()
                   .done(function () {
                     expect(model.get('name')).toEqual('test');
                     expect(model.get('type')).toEqual(1);
                     done();
                   });
            });

        it('executes the success callback like the standard sync',
            function (done) {
              var model = new this.TestModel();
              model.fetch({
                success: function (fetchedModel, response, options) {
                  expect(fetchedModel).toBe(model);
                  expect(response.name).toEqual('test');
                  expect(response.type).toEqual(1);
                  expect(options.fail).toBe(false);
                  done();
                },
                fail: false
              });
            });

        it('triggers the "sync" event just once like the standard sync',
            function (done) {
              var model = new this.TestModel(),
                  triggered;
              model.on('sync', function (fetchedModel, response, options) {
                     expect(triggered).toBeFalsy();
                     expect(fetchedModel).toBe(model);
                     expect(response.name).toEqual('test');
                     expect(response.type).toEqual(1);
                     expect(options.fail).toBe(false);
                     triggered = true;
                     done();
                   })
                   .fetch({fail: false});
            });

        it('resolves the promise like the standard sync',
            function (done) {
              var model = new this.TestModel();
              model.fetch()
                   .done(function (response, textStatus, object) {
                     expect(response.name).toEqual('test');
                     expect(response.type).toEqual(1);
                     expect(textStatus).toEqual('success');
                     done();
                   });
            });

        it('triggers events and executes callbacks in the right order',
            function (done) {
              var model = new this.TestModel(),
                  index = 0,
                  requestEvent, successCallback, syncEvent;
              model.on('request', function (fetchedModel, object, options) {
                     requestEvent = ++index;
                   })
                   .on('sync', function (fetchedModel, response, options) {
                     syncEvent = ++index;
                   })
                   .fetch({
                     success: function (fetchedModel, response, options) {
                       successCallback = ++index;
                     }
                   })
                   .done(function (response, textStatus, object) {
                     expect(requestEvent).toEqual(1);
                     expect(successCallback).toEqual(2);
                     expect(syncEvent).toEqual(3);
                     done();
                   });
            });
      });

      describe('and failed fetching', function () {
        it('leaves the model attributes intact',
            function (done) {
              var model = new this.TestModel();
              model.fetch({fail: true})
                   .fail(function () {
                     expect(model.get('name')).toBeUndefined();
                     expect(model.get('type')).toBeUndefined();
                     done();
                   });
            });

        it('executes the error callback like the standard sync',
            function (done) {
              var model = new this.TestModel();
              model.fetch({
                error: function (fetchedModel, object, options) {
                  expect(fetchedModel).toBe(model);
                  expect(object.responseJSON).toBeTruthy();
                  expect(object.responseJSON.failure).toBe(true);
                  expect(object.statusText).toEqual('Bad Request');
                  expect(options.fail).toBe(true);
                  done();
                },
                fail: true
              });
            });

        it('triggers the "error" event just once like the standard sync',
            function (done) {
              var model = new this.TestModel(),
                  triggered;
              model.on('error', function (fetchedModel, object, options) {
                     expect(triggered).toBeFalsy();
                     expect(fetchedModel).toBe(model);
                     expect(object.responseJSON).toBeTruthy();
                     expect(object.responseJSON.failure).toBe(true);
                     expect(object.statusText).toEqual('Bad Request');
                     expect(options.fail).toBe(true);
                     triggered = true;
                     done();
                   })
                   .fetch({fail: true});
            });

        it('rejects the promise like the standard sync',
            function (done) {
              var model = new this.TestModel();
              model.fetch({fail: true})
                   .fail(function (object, textStatus, errorThrown) {
                     expect(object.responseJSON).toBeTruthy();
                     expect(object.responseJSON.failure).toBe(true);
                     expect(textStatus).toEqual('error');
                     expect(errorThrown).toEqual('Bad Request');
                     done();
                   });
            });

        it('triggers events and executes callbacks in the right order',
            function (done) {
              var model = new this.TestModel(),
                  index = 0,
                  requestEvent, errorCallback, errorEvent;
              model.on('request', function (fetchedModel, object, options) {
                     requestEvent = ++index;
                   })
                   .on('error', function (fetchedModel, response, options) {
                     errorEvent = ++index;
                   })
                   .fetch({
                     error: function (object, textStatus, errorThrown) {
                       errorCallback = ++index;
                     },
                     fail: true
                   })
                   .fail(function (object, textStatus, errorThrown) {
                     expect(requestEvent).toEqual(1);
                     expect(errorCallback).toEqual(2);
                     expect(errorEvent).toEqual(3);
                     done();
                   });
            });
      });
    }
  });
});
