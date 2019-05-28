/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/nodestable/nodestable.view', 'csui/utils/contexts/page/page.context',
  'csui/integration/folderbrowser/folderbrowser.widget',
  './folderbrowser.mock.data.js',
  'csui/utils/contexts/factories/node'
], function (module, $, _, Marionette, NodesTableView, PageContext,
    FolderBrowserWidget, folderBrowserMock, NodeModelFactory) {
  'use strict';

  describe('FolderBrowserWidget container', function () {
    var enableLog = false;
    function initHtmlBody(el) {
      document.body.innerHTML =
          '<div class="container">' +
          '<div class="row">' +
          '<div id ="content"></div>' +
          '</div></div>';
      return true;
    }
    function clearHtmlBody(el) {
      document.body.innerHTML = '</div></div>';
      return true;
    }

    beforeAll(function (done) {
      var par = null;
      initHtmlBody(par);
      if (enableLog) {
        console.log("Created HTML elements");
      }
      folderBrowserMock.test.enable();
      done();
    });

    afterAll(function (done) {
      folderBrowserMock.test.disable();
      if (enableLog) {
        console.log("Disabled mock in afterAll");
      }
      clearHtmlBody(null);
      if (enableLog) {
        console.log("Deleted HTML elements");
      }
      done();
    });

    describe('FolderBrowserWidget', function () {
      var context;

      beforeAll(function () {

        context = new PageContext({
          factories: {
            connector: {
              connection: {
                url: '//server/otcs/cs/api/v1',
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

      });

      it('can be created and destroyed without showing', function () {
        var folderBrowser = new FolderBrowserWidget({
          context: context,
          start: {id: 101}
        });
        folderBrowser.close();
      });

      it('can be created, showed and destroyed without waiting until it appears',
          function () {
            var folderBrowser = new FolderBrowserWidget({
                  context: context,
                  start: {id: 101}
                }),
                place = $('<div>');
            folderBrowser.show({placeholder: place[0]});
            folderBrowser.close();
          });

      it('shows full action list for starting node', function (done) {
        var folderBrowser = new FolderBrowserWidget({
              context: context,
              start: {id: 101}
            }),
            place = $('<div>');
        folderBrowser.show({placeholder: place[0]});
        folderBrowser.folderView.contextPromise
            .done(function () {
              var actions = folderBrowser.folderView.container.actions.models;
              expect(actions.length > 0).toBeTruthy;
              folderBrowser.close();
              done();
            })
            .fail(function () {
              expect(false).toBeTruthy('context not fetched');
              done();
            });
      }, 5000);
    });

    describe('when switching among containers', function () {
      var _connection, _defaultBrowse, _nodeModel;

      beforeAll(function (done) {
        _connection = {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          },
          credentials: {
            username: 'Admin',
            password: 'livelink'
          }
        };

        _defaultBrowse = new FolderBrowserWidget({
          connection: _connection,
          placeholder: '#content',
          pageSize: 20,
          start: {id: 101}
        });

        var requested;
        _defaultBrowse.folderView.context
            .once('request', function () {
              requested = true;
            })
            .once('sync', function () {
              setTimeout(function () {
                if (enableLog) {
                  console.log("wait 1,5 sec for end of render.");
                }
                expect(requested).toBeFalsy();
                done();
              }, 1500);
            });

        _nodeModel = _defaultBrowse.folderView.context.getObject(NodeModelFactory);

        if (enableLog) {
          console.log("Render the widget, fetch te data.");
        }
        _defaultBrowse.show({placeholder: '#content'});
      });

      it("drills down, if the new container is passed via 'model.set'.", function (done) {
        var requested = 0;
        _defaultBrowse.folderView.context
            .once('request', function () {
              ++requested;
            })
            .once('sync', function () {
              if (enableLog) {
                console.log("Model.set 103 finished.");
              }
              setTimeout(function () {
                if (enableLog) {
                  console.log("wait 1,5 sec for end of render.");
                }
                expect(requested).toEqual(1);
                done();
              }, 1500);
            });
        if (enableLog) {
          console.log("Model.set 103");
        }
        _nodeModel.set('id', 103);    // triggers opened and rendered

      }, 5000);

      it('drills down, if the new container is passed enterContainer with {id: id} only',
          function (done) {
            var requested = 0;
            _defaultBrowse.folderView.context
                .once('request', function () {
                  ++requested;
                })
                .once('sync', function () {
                  if (enableLog) {
                    console.log("successfully entered container 101.");
                  }
                  setTimeout(function () {
                    if (enableLog) {
                      console.log("wait 1,5 sec for end of render.");
                    }
                    expect(requested).toEqual(1);
                    done();
                  }, 1500);

                });
            if (enableLog) {
              console.log("change container to 101.");
            }
            _defaultBrowse.enterContainer(101);     // triggers opened and rendered
          }, 5000);

      it('does nothing, if the same container is passed to enterContainer', function () {
        var requested;
        _defaultBrowse.folderView.context.once('request', function () {
          requested = true;
        });
        if (enableLog) {
          console.log("attempt to change container to 101.");
        }
        _defaultBrowse.enterContainer(101);
        expect(requested).toBeFalsy();
      });

      it("closing widget", function (done) {
        _defaultBrowse.close();
        if (enableLog) {
          console.log("browser widget destroyed.");
        }
        expect(_defaultBrowse.region == null).toBeTruthy();
        done();
      });
    });
  });
});
