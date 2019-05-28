/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/utils/connector', 'csui/models/node/node.model',
  'csui/models/nodechildren', 'csui/controls/fileupload/fileupload',
  'csui/controls/globalmessage/globalmessage',
  './fileupload.mock.js'
], function (Marionette, Connector, NodeModel, NodeChildrenCollection,
    fileUploadHelper, GlobalMessage, mock) {
  "use strict";

  describe('fileUploadHelper', function () {

    var container;

    beforeAll(function () {
      var messageLocation = new Marionette.View();
      GlobalMessage.setMessageRegionView(messageLocation);

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

      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    it('succeeds uploading after the second (GET) server call', function (done) {
      var fileUploadController = fileUploadHelper.newUpload({container: container}),
          fileUploads = fileUploadController.uploadFiles;
      fileUploads.once('add', function (fileUpload) {
        fileUpload
            .promise()
            .then(function () {
              expect(fileUpload.node.get('create_user_id')).toEqual(1000);
            })
            .done(done);
      });
      fileUploadController.addFilesToUpload([
        {
          name: 'test.txt',
          size: 100,
          type: 'text/plain'
        }
      ]);
    });

    it('fails uploading, if the second (GET) server call fails', function (done) {
      var fileUploadController = fileUploadHelper.newUpload({container: container}),
          fileUploads = fileUploadController.uploadFiles;
      fileUploads.once('add', function (fileUpload) {
        fileUpload
            .promise()
            .fail(function (fileUpload, error) {
              expect(error.statusCode).toEqual(500);
              expect(error.message).toEqual('Unpredicted Error');
              done();
            })
            .fail(done);
      });
      fileUploadController.addFilesToUpload([
        {
          name: 'test2.txt',
          size: 200,
          type: 'text/plain'
        }
      ]);
    });

    it('adds the new node to the target collection', function (done) {
      var children = new NodeChildrenCollection(undefined, {node: container}),
          fileUploadController = fileUploadHelper.newUpload({
            container: container,
            collection: children
          }),
          fileUploads = fileUploadController.uploadFiles;
      children.once('add', function (fileUpload) {
        expect(children.first()).toBe(fileUploads.first().node);
        done();
      });
      fileUploadController.addFilesToUpload([
        {
          name: 'test.txt',
          size: 100,
          type: 'text/plain'
        }
      ]);
    });

    it('accepts files as objects with additional parameters', function (done) {
      var fileUploadController = fileUploadHelper.newUpload({container: container}),
          fileUploads = fileUploadController.uploadFiles;
      fileUploads.once('add', function (fileUpload) {
        fileUpload
            .promise()
            .then(function () {
              expect(fileUpload.node.get('name')).toEqual('new test.txt');
              expect(fileUpload.node.get('roles').categories[2003]).toBeTruthy();
            })
            .done(done);
      });
      fileUploadController.addFilesToUpload([
        {
          newName: 'new test.txt',
          file: {
            name: 'test.txt',
            size: 100,
            type: 'text/plain'
          },
          data: {
            roles: {
              categories: {
                '2003': {}
              }
            }
          }
        }
      ]);
    });

  });

});
