/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  'csui/models/node/node.model', 'csui/controls/conflict.resolver/impl/conflict.dialog/conflict.dialog', 'csui/utils/connector',
  '../../../test/filename.query.mock.data.cnt1.js',"csui/lib/jquery.simulate"
], function (_,$, Marionette, PageContext,  NodeModel, ConflictDialog, Connector, MockData) {
  "use strict";


  describe('Conflict Individual Resolver', function () {

    var container;

    beforeEach(function () {
      MockData.enable();
    });

    afterEach(function () {
      MockData.disable();
    });

    it('initialize dialog parameters', function () {
      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
      container = new NodeModel({id: 2000}, {connector: connector});

    });

    it('button Upload is disable on startup', function() {
      var conflictFiles = [{name: '1'}, {name: '1 conflict'}, {name: '2 conflict'}],
        conflictDialog = new  ConflictDialog({
          parentId: 2000,
          connector: container.connector,
          totalNumFiles: conflictFiles.length,
          conflictFiles: conflictFiles,
          actionBtnLabel: 'upload'
        });

      conflictDialog.show();
      expect(conflictDialog._dialog.$el.find('.binf-modal-footer button')[0].disabled).toBe(true);
      conflictDialog.cancel();
    });

    it('Single conflict, delete button does not appear', function(){
      var conflictFiles = [{name: '1 conflict'}],
        conflictDialog = new  ConflictDialog({
          parentId: 2000,
          connector: container.connector,
          totalNumFiles: conflictFiles.length,
          conflictFiles: conflictFiles,
          actionBtnLabel: 'upload'
        });

      conflictDialog.show();
      var dialog = conflictDialog._dialog;

      expect(dialog.$el.find('.circle_delete').length).toBe(0);
      conflictDialog.cancel();
    });


    it('Multi conflicts, delete icon appears', function(){
      var conflictFiles = [{name: '1 conflict'}, {name: '2 conflict'},{name: '3 conflict'},{name: '4 conflict'}],
        conflictDialog = new  ConflictDialog({
          parentId: 2000,
          connector: container.connector,
          totalNumFiles: conflictFiles.length,
          conflictFiles: conflictFiles,
          actionBtnLabel: 'upload'
        });

      conflictDialog.show();
      var dialog = conflictDialog._dialog;
      expect(dialog.$el.find('.circle_delete').length).toBe(4);
      conflictDialog.cancel();
    });

    describe('test clicking button rename', function(){
      var conflictDialog;
      it('click rename', function() {
        var conflictFiles = [{name: '1 conflict'}, {name: '2 conflict'},{name: '3 conflict'},{name: '4 conflict'}];
        conflictDialog = new  ConflictDialog({
          parentId: 2000,
          connector: container.connector,
          totalNumFiles: conflictFiles.length,
          conflictFiles: conflictFiles,
          actionBtnLabel: 'upload'
        });

        conflictDialog.show();

        var conflictItemView = _.values(conflictDialog._view.children._views)[0];
        expect(conflictItemView.ui.renameBtn[0].className.indexOf('binf-hidden')).toBe(-1);
        expect(conflictItemView.ui.versionBtn[0].className.indexOf('binf-hidden')).toBe(-1);
        expect(conflictItemView.ui.cancelIcon[0].className.indexOf('binf-hidden')).toBe(-1);
        conflictItemView.ui.renameBtn.click();
      });

      it('Rename, Version and cancel circle disappear', function() {
        var conflictItemView = _.values(conflictDialog._view.children._views)[0];
        expect(conflictItemView.ui.renameBtn[0].className.indexOf('binf-hidden') > -1).toBe(true);
        expect(conflictItemView.ui.versionBtn[0].className.indexOf('binf-hidden') > -1).toBe(true);
        expect(conflictItemView.ui.cancelIcon[0].className.indexOf('binf-hidden') > -1).toBe(true);
      });

      it('input edit field and cancel icon appear', function(){
        var conflictItemView = _.values(conflictDialog._view.children._views)[0];
        expect(conflictItemView.ui.inputField[0].className.indexOf('binf-hidden')).toBe(-1);
        expect(conflictItemView.ui.cancelEdit[0].className.indexOf('binf-hidden')).toBe(-1);
        conflictDialog.cancel();
      });
    });

    describe('Test input of new name', function(){

      it('cancel icon cancels input', function(){
        var conflictFiles = [{name: '1 conflict'}, {name: '2 conflict'}],
          conflictDialog = new  ConflictDialog({
            parentId: 2000,
            connector: container.connector,
            totalNumFiles: conflictFiles.length,
            conflictFiles: conflictFiles,
            actionBtnLabel: 'upload'
          });

        conflictDialog.show();

        var conflictItemView = _.values(conflictDialog._view.children._views)[0];
        conflictItemView.ui.renameBtn.click();
        conflictItemView.ui.cancelEdit.click();
        expect(conflictItemView.ui.renameBtn[0].className.indexOf('binf-hidden')).toBe(-1);
        expect(conflictItemView.ui.versionBtn[0].className.indexOf('binf-hidden')).toBe(-1);
        expect(conflictItemView.ui.cancelIcon[0].className.indexOf('binf-hidden')).toBe(-1);
        conflictDialog.cancel();
      });

      it('blank name is ignored', function(){
        var conflictFiles = [{name: '1 conflict'}, {name: '2 conflict'}],
          conflictDialog = new  ConflictDialog({
            parentId: 2000,
            connector: container.connector,
            totalNumFiles: conflictFiles.length,
            conflictFiles: conflictFiles,
            actionBtnLabel: 'upload'
          });

        conflictDialog.show();

        var conflictItemView = _.values(conflictDialog._view.children._views)[0],
          startName = conflictItemView.$el.find('.folder-name').text(),
          blurTriggered = false;

        conflictItemView.ui.renameBtn.click();
        conflictItemView.ui.inputField.val('');
        conflictItemView._queryName();

        setTimeout(function() {
          blurTriggered = true;

          expect(conflictItemView.ui.renameBtn[0].className.indexOf('binf-hidden')).toBe(-1);
          expect(conflictItemView.ui.versionBtn[0].className.indexOf('binf-hidden')).toBe(-1);
          expect(conflictItemView.ui.cancelIcon[0].className.indexOf('binf-hidden')).toBe(-1);
          expect(conflictItemView.$el.find('.folder-name').text()).toBe(startName);
          conflictDialog.cancel();

        }, 5000);
      });

    });
    it('end of test reached', function () {
    });

  });
});


