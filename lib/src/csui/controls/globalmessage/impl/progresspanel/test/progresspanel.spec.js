/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/connector', 'csui/models/node/node.model','csui/models/version', 'csui/models/nodechildren',
  './progresspanel.mock.js', 'csui/controls/fileupload/fileupload',
  'csui/controls/globalmessage/globalmessage',
  "csui/lib/marionette", "csui/utils/commands/delete","csui/utils/commands/versions/delete",
  'csui/lib/jquery.mockjax'
], function (_, $, Backbone, Connector, NodeModel, VersionModel,
    NodeChildrenCollection, mock, fileUploadHelper, GlobalMessage, Marionette,
    DeleteCommand,VersionDeleteCommand, mockjax) {

  describe('Progress Panel', function () {

    var node, testCollection, view,version;

    function initialize(options) {
      if (!node) {
        var connector = new Connector({
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/support',
            session: {
              ticket: 'dummy'
            }
          }
        });
        node = new NodeModel({id: 1234}, {connector: connector}),

         version = new VersionModel({ id: 1234,
           mime_type: 'text/plain',
           version_number: 1
         }, {
           connector: connector
         });


      }
      testCollection = new NodeChildrenCollection(undefined, _.extend({
        node: node
      }, options));

      var divContainer = '<div class="binf-container"><div class="binf-row"><div class="binf-col-sm-12" id="content"></div></div></div>';
      $('body').append(divContainer);

      var uploadRegion = new Marionette.Region({
        el: "#content"
      });

      view = mock.newView();
      uploadRegion.show(view);
      GlobalMessage.setMessageRegionView(view);           // propagate view
    }

    beforeAll(function () {
      mockjax.publishHandlers();
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    describe('proper mime-type icons are displayed', function () {

      it('for file upload', function (done) {
        initialize();
        testCollection.fetch()
            .done(function(){
              var fileUploadModel = fileUploadHelper.newUpload({
                    originatingView: view,
                    container: node,
                    collection: testCollection});

              fileUploadModel.addFilesToUpload(mock.fileList);
              fileUploadModel.listenToOnce(fileUploadModel, 'destroy', function(){
                expect(view.$el.find(".mime_word").length).toBe(1);
                view.$el.find('.csui-header .csui-action-close').click();
                view.$el.html('');
                done();
              });
            });
      });
    });
    xdescribe('remains shown by default, if delete fails', function () {
      it('when deleting a node', function (done) {
        var status = {
              collection: testCollection,
              container: node,
              nodes: testCollection,
              originatingView: view
            },
            deleteCmd =  new DeleteCommand();
        deleteCmd._performActions(status)
                 .always(function () {
                   expect(view.$el.find(".csui-progresspanel").length).toBe(1);  // message text
                   view.$el.find('.csui-header .csui-action-close').click();
                   view.$el.html('');
                   done();
                 });
      });

      it('when deleting a version', function (done) {
        var status = {
              collection: testCollection,
              container: version,
              nodes: testCollection,
              originatingView: view
            },
            deleteCmd =  new VersionDeleteCommand();
        deleteCmd._performActions(status)
                 .always(function () {
                   expect(view.$el.find(".csui-progresspanel").length).toBe(1);  // message text
                   view.$el.find('.csui-header .csui-action-close').click();
                   view.$el.html('');
                   done();
                 });
      });
    });
    xdescribe('can be forced to hide and replaced by the global message', function () {
      it('when deleting a node', function (done) {
        var status = {
              collection: testCollection,
              container: node,
              nodes: testCollection,
              originatingView: view,
              data: {
                showProgressDialog: false
              }
            },
            deleteCmd =  new DeleteCommand();
        deleteCmd._performActions(status)
          .always(function () {
            expect(view.$el.find(".csui-messagepanel").length).toBe(1);  // message text
            view.$el.find('.csui-header .csui-action-close').click();
            view.$el.html('');
            done();
          });
      });

      it('when deleting a version', function (done) {
        var status = {
              collection: testCollection,
              container: version,
              nodes: testCollection,
              originatingView: view,
              data: {
                showProgressDialog: false
              }
            },
            deleteCmd =  new VersionDeleteCommand();
        deleteCmd._performActions(status)
          .always(function () {
            expect(view.$el.find(".csui-messagepanel").length).toBe(1);  // message text
            view.$el.find('.csui-header .csui-action-close').click();
            view.$el.html('');
            done();
          });
      });
    });
  });
});
