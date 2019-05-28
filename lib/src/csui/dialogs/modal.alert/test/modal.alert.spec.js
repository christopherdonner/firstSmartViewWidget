/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/dialogs/modal.alert/modal.alert',
  'i18n!csui/dialogs/modal.alert/impl/nls/lang'
], function ($, ModalAlert, lang) {
  'use strict';

  describe('ModalAlert', function () {
    var promise;

    beforeAll(function () {
      $(document.body).html('');
    });

    afterEach(function (done) {
      promise
          .close()
          .always(done);
    });

    describe('Show Warning', function () {
      it('Uses default warning title when no title provided', function (done) {
        promise = ModalAlert
            .showWarning('test warning')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual(lang.DefaultWarningTitle);
              done();
            });
      });

      it('Uses title provided', function (done) {
        promise = ModalAlert
            .showWarning('test warning', 'Ham')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual('Ham');
              done();
            });
      });
    });

    describe('Show Error', function () {
      it('Uses default error title when no title provided', function (done) {
        promise = ModalAlert
            .showError('test error')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual(lang.DefaultErrorTitle);
              done();
            });
      });

      it('Uses title provided', function (done) {
        promise = ModalAlert
            .showError('test error', 'Abc')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual('Abc');
              done();
            });
      });
    });

    describe('Show Information', function () {
      it('Uses default info title when no title provided', function (done) {
        promise = ModalAlert
            .showInformation('test info')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual(lang.DefaultInfoTitle);
              done();
            });
      });

      it('Uses title provided', function (done) {
        promise = ModalAlert
            .showInformation('test info', 'Inf')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual('Inf');
              done();
            });
      });
    });

    describe('Show Success', function () {
      it('Uses default error title when no title provided', function (done) {
        promise = ModalAlert
            .showSuccess('test success')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual(lang.DefaultSuccessTitle);
              done();
            });
      });

      it('Uses title provided', function (done) {
        promise = ModalAlert
            .showSuccess('test success', 'Scss')
            .progress(function () {
              var title = $('.csui-alert .title-text');
              expect(title.text()).toEqual('Scss');
              done();
            });
      });
    });
  });
});
