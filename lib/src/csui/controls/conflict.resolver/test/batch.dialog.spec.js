/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/models/node/node.model', 'csui/controls/conflict.resolver/conflict.resolver',
  'csui/utils/connector',
  'csui/models/fileuploads', "csui/lib/jquery.simulate"
], function (_, $, Marionette, PageContext, NodeModel, ConflictResolver, Connector,
    FileUploadCollection) {
  "use strict";

  xdescribe('Conflict Batch Resolver', function () {

    var container;

    beforeAll(function () {
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
    describe('test response of valid, invalid file arrays', function () {

      it('exception thrown if first file name is empty', function () {
        var files = [{name: ''}],
            thrownError = false;

        try {
          var conflictResolver = new ConflictResolver({files: files});
          conflictResolver.run();
        }
        catch (error) {
          thrownError = true;
        }

        expect(thrownError).toBeTruthy();
      });

      it('exception thrown if first file name attribute is empty', function () {
        var node = new NodeModel({name: ''}),
            files = [node],
            thrownError = false;

        try {
          var conflictResolver = new ConflictResolver({files: files});
          conflictResolver.run();
        }
        catch (error) {
          thrownError = true;
        }

        expect(thrownError).toBeTruthy();
      });

      it('exception thrown if no name parameter or attribute exists ', function () {
        var files = ['name', 'name2'],
            thrownError = false;

        try {
          var conflictResolver = new ConflictResolver({files: files});
          conflictResolver.run();
        }
        catch (error) {
          thrownError = true;
        }

        expect(thrownError).toBeTruthy();
      });

    });

    describe('testing batch dialog', function () {

      it('does not display if there are no conflicts', function () {
        var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict'},
              {name: '2 conflict'}]),
            conflictFiles = [],
            nonConflictFiles = [files.models[0]],
            conflictResolver = new ConflictResolver({files: files, container: container});

        conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);
        expect($('.csui-conflict-dialog.csui-batch').length).toBe(0);
      });

      it('does not display for one item conflict', function () {
        var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict', id: 1}]),
            conflictFiles = [files.models[1]],
            nonConflictFiles = [files.models[0]],
            conflictResolver = new ConflictResolver({files: files, container: container});

        conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);
        expect($('.csui-conflict-dialog.csui-batch').length).toBe(0);
      });

      it('display for 2 item conflict', function (done) {
        var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict', id: 1},
              {name: '2 conflict', id: 2}]),
            conflictFiles = [files.models[1], files.models[2]],
            nonConflictFiles = [files.models[0]],
            conflictResolver = new ConflictResolver({
              files: files, container: container,
              h1Label: 'Uploading 3 files'
            });

        conflictResolver.deferred.done(done);

        conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);
        var $el = conflictResolver._dialog.$el;
        expect($el.find('.binf-modal-header > div').length).toBe(2);
        expect($el.find('.binf-modal-header > div')[0].innerText).toBe(
            'Uploading 3 files');
        expect($el.find('.binf-modal-header > div')[1].innerText).toBe('2 Conflicts');
        conflictResolver._dialog.$el.find('.binf-modal-footer > button')[0].click();
      });

      describe('click on select buttons', function () {

        it('add version to all conflict files', function (done) {
          var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict'},
                {name: '2 conflict'}]),
              conflictFiles = [files.models[1], files.models[2]],
              nonConflictFiles = [files.models[0]],
              conflictResolver = new ConflictResolver({
                files: files,
                container: container
              });

          conflictResolver.deferred
              .then(function () {
                _.each(conflictFiles, function (file) {
                  expect(file.get('newVersion')).toBe(true);
                });
              })
              .done(done);

          conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);
          expect($('.csui-conflict-dialog.csui-batch').length).toBe(1);
          conflictResolver._dialog.$el.find('.binf-modal-footer > button')[0].click();
        });

        it('skipping conflict files', function (done) {
          var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict'},
                {name: '2 conflict'}]),
              conflictFiles = [files.models[1], files.models[2]],
              nonConflictFiles = [files.models[0]],
              conflictResolver = new ConflictResolver({
                files: files,
                container: container
              });

          conflictResolver.deferred
              .then(function (uploadFiles) {
                expect(uploadFiles.length).toBe(1);
              })
              .done(done);

          conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);

          expect($('.csui-conflict-dialog.csui-batch').length).toBe(1);
          conflictResolver._dialog.$el.find('.binf-modal-footer > button')[1].click();
        });

        it('resolve individual conflicts', function (done) {
          var files = new FileUploadCollection([{name: '1'}, {name: '1 conflict'},
                {name: '2 conflict'}]),
              conflictFiles = [files.models[1], files.models[2]],
              nonConflictFiles = [files.models[0]],
              conflictResolver = new ConflictResolver({
                files: files,
                container: container
              });

          conflictResolver._resolveConflicts(nonConflictFiles, conflictFiles);
          expect($('.csui-conflict-dialog.csui-batch').length).toBe(1);
          conflictResolver._dialog.$el.find('.binf-modal-footer > button')[2].click();
          expect(conflictResolver._conflictDialog).toBeTruthy();

          conflictResolver._conflictDialog.deferred.fail(done);
          conflictResolver._conflictDialog._dialog.$el
              .find('.binf-modal-footer > button')[1]
              .click();
        });

      });

    });

  });

});


