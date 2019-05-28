/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/marionette",
  "csui/utils/connector",
  'csui/utils/contexts/page/page.context',
  'csui/controls/userpicker/userpicker.view',
  "../../../utils/testutils/async.test.utils.js",
  './userpicker.mock.js'
], function ($, Marionette, Connector, PageContext, UserPickerView, AsyncUtils, UserpickerMock) {

  describe("UserPicker", function () {
    var context, userPickerView;

    beforeAll(function () {
      UserpickerMock.enable();
      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });
    });

    afterAll(function () {
      UserpickerMock.disable();
    });

    describe("UserPicker having some user's data", function () {

      beforeAll(function () {
        userPickerView = new UserPickerView({
          context: context
        });
      });

      afterAll(function () {
        userPickerView.destroy();
      });

      it("can be instantiated", function () {
        expect(userPickerView instanceof UserPickerView).toBeTruthy();
      });

      it("should be rendered in DOM", function () {
        new Marionette.Region({
          el: $('<div id="userpicker"></div>').appendTo(document.body)
        }).show(userPickerView);
        expect($('#userpicker > *').is(userPickerView.$el)).toBeTruthy();
      });

      it("testing on should open a user picker view when change the data in test field",
          function (done) {
            var userPickerTypeadhead = userPickerView.$el.find('input.typeahead');
            userPickerTypeadhead.val('u');
            userPickerTypeadhead.trigger('keyup');
            AsyncUtils.asyncElement(userPickerView.$el, 'ul.typeahead.binf-dropdown-menu').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });
    });

    describe("No results scenario on user picker dialog", function () {

      beforeAll(function () {
        userPickerView = new UserPickerView({
          context: context
        });
      });

      afterAll(function () {
        userPickerView.destroy();
      });

      it("can be instantiated", function () {
        expect(userPickerView instanceof UserPickerView).toBeTruthy();
      });

      it("should be rendered in DOM", function () {
        new Marionette.Region({
          el: $('<div id="userpicker"></div>').appendTo(document.body)
        }).show(userPickerView);
        expect($('#userpicker > *').is(userPickerView.$el)).toBeTruthy();
      });

      it("should show no results on enter with not existing user details", function (done) {
        var userPickerTypeadhead = userPickerView.$el.find('input.typeahead');
        userPickerTypeadhead.val('a');
        userPickerTypeadhead.trigger('keyup');
        AsyncUtils.asyncElement(userPickerView.$el, 'ul.typeahead.binf-dropdown-menu').done(
            function (el) {
              expect(el.length).toEqual(1);
              expect(el.find('li').text().trim()).toEqual("No results found");
              done();
            });
      });

    });
  });
});
