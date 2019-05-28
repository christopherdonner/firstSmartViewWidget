/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.when.all', 'csui/utils/connector',
  'csui/models/node/node.model', 'csui/controls/fileupload/fileupload', './applyToAll.mock.js',
  '../../../utils/testutils/async.test.utils.js'
], function ($, whenAll, Connector, NodeModel, fileUploadHelper, mock, testUtil) {
  'use strict';
  describe("apply to all", function () {
    var dialog, applyAllValue = 'hello world';
    beforeAll(function () {
      $.whenAll = whenAll;  //form.view.js uses whenAll
      dialog = $($.fn.binf_modal.getDefaultContainer());
      mock.enable();
      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });

      var container = new NodeModel({id: 3880}, {connector: connector});
      var files   = [
            new File(['Hello', 'World'], 'file1.txt', {type: 'text/plain'}),
            new File(['Hello', 'World', 'Hi'], 'file2.txt', {type: 'text/plain'}),
            new File(['Hello', 'World', 'Hi', 'Again'], 'file3.txt', {type: 'text/plain'})
          ],
          status  = {
            container: container
          },
          options = {
            addableType: 144,
            addableTypeName: "Document"
          };
      fileUploadHelper.newUpload(status, options).addFilesToUpload(files);
    });

    afterAll(function () {
      dialog.empty(); //clear binf modal container for reuse by other test cases
      mock.disable();
    });

    it('file upload dialog shown', function (done) {
      testUtil.asyncElement(dialog, '.cs-item-action-metadata .binf-tab-content:visible').done(
          function (el) {
            expect(el.length).toEqual(1);
            done();
          });
    });

    it('show apply all button on field change', function () {
      var el = dialog.find('.binf-tab-content .alpaca-required');
      el.find('input').val(applyAllValue).trigger('change').trigger('focusout');
      expect(el.find('.csui-icon.apply-all').is(':visible')).toBeTruthy();
    });

    it('apply to all and validate', function (done) {
      dialog.find(
          '.alpaca-required').parent().alpaca().fieldView.getEditableBehavior().ui.applyAll.trigger(
          'mousedown');
      var navList = dialog.find('.metadata-sidebar a:last-child');
      testUtil.asyncElement(dialog, '.metadata-sidebar-fadeout').done(function () {
        testUtil.asyncElement(dialog, '.metadata-sidebar-fadeout',
            {interval: 250, removal: true}).done(function () {
          navList.click();
          testUtil.asyncElement(dialog, '.binf-tab-content:visible').done(function (el) {
            expect(el.find('.alpaca-required input').val()).toEqual(applyAllValue);
            done();
          });
        });
      });
    });

  });
});
