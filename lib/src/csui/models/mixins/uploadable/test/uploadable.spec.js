/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function ($, Backbone, UploadableMixin) {
  'use strict';

  describe('UploadableMixin', function () {
    var TestModel, originalMock;

    beforeAll(function () {
      TestModel = Backbone.Model.extend({
        initialize: function (models, options) {
          this.makeUploadable(options);
        },

        url: function () {
          return '/test';
        },

        prepare: function (data, options) {
          return {content: data};
        },

        parse: function (response, options) {
          return response.content;
        }
      });

      TestModel.prototype.sync = function (method, model, options) {
        var deferred = $.Deferred();
        this.trigger('request', this, {}, options);
        setTimeout(function () {
          var data = options.data;
          options.success.call(options.context, data, 'success', {});
          deferred.resolve(data);
        }.bind(this));
        return deferred.promise();
      };

      UploadableMixin.mixin(TestModel.prototype);

      originalMock = UploadableMixin.mock;
      UploadableMixin.mock = true;
    });

    afterAll(function () {
      UploadableMixin.mock = originalMock;
    });

    it('prepares the request body by default', function (done) {
      new TestModel()
          .save({test: 1})
          .then(function (prepared) {
            expect(prepared).toBeTruthy();
            expect(prepared.content).toBeTruthy('object');
            expect(prepared.content.test).toEqual(1);
            done();
          });
    });

    it('leaves the request body as-is if required', function (done) {
      new TestModel()
          .save({test: 1}, {prepare: false})
          .then(function (prepared) {
            expect(prepared).toBeTruthy();
            expect(prepared.test).toEqual(1);
            done();
          });
    });
  });
});
