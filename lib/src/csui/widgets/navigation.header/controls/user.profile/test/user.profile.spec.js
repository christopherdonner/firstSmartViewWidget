/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
        "csui/lib/underscore",
        "csui/lib/marionette",
        "csui/pages/start/impl/navigationheader/navigationheader.view",
        'csui/utils/contexts/perspective/perspective.context',
        "./user.profile.mock.data.js",
        'csui/lib/jquery.simulate',
        'csui/lib/jquery.simulate.ext'
], function ($, _, Marionette, NavView, PerspectiveContext, ProfileMockData) {
  "use strict";

  xdescribe("Profile Menu", function () {

    var fetched = false,
      navHeader = null,
      context = null,
      profileView = null,
      userInfo = null;

    var el = null,
      divContainer = '<div class="binf-container"></div>';

    var nodes, user;

    beforeAll(function () {
      document.body.innerHTML = divContainer;

      nodes = ProfileMockData.mockData;
      user = {status: 'destroyed', test: ProfileMockData.test1};

    });

    it('starting main describe', function() {

    });

    describe('testing name display', function () {

      it('before each node', function() {

      });
      _.each(nodes, function (node, index) {
        processNode(node);
      });

    });

    it('finished main describe', function() {

    });


    function processNode(node) {

      describe('setting up ' + node.fstName + ' ' + node.lstName + ' ' + node.userName, function () {
        initializeView(node);
        reportOnProfileView(node);
        destroyView(node);
      });
    }

    function initializeView(node) {
      it("view initialized", function (done) {

        node.test.enable();
        context = new PerspectiveContext({
          factories: {
            connector: {
              connection: {
                url: node.url,
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            },
            user: {
              attributes: {id: '12345'}
            }
          }
        });

        navHeader = new NavView({
          context: context
        });
        expect(navHeader instanceof NavView).toBeTruthy();
        navHeader.render();

      });
    }

    function reportOnProfileView(node, prevNode) {
      describe('checking Name', function () {
        waitForFetch();

        appendNavHeader();

        it('correct first and last name displayed', function () {
          var name = navHeader.$el.find('a.csui-name')[0].innerText;
          var cmpName = node.userName;

          if (node.fstName.length > 0 && node.lstName.length > 0) {
            cmpName = node.fstName + ' ' + node.lstName;
          }
          else if (node.fstName.length > 0) {
            cmpName = node.fstName;
          }
          else if (node.lstName.length > 0) {
            cmpName = node.lstName;
          }
          expect(name).toBe(cmpName);
          node.status = 'complete';
        });
      });
    }

    function waitForFetch() {
      beforeEach(function (done) {

        var fetching = context.fetchPerspective()
          .then(function () {
            var nameAttr = navHeader.user.attributes.name;
            if (nameAttr && nameAttr.length > 0) {
              el = $("#content");

              done();
            }
          })
          .fail(function () {
            expect(fetching.state()).toBe('resolved', "user perspective fetch failed");
            done();
          });
      });
    }

    function appendNavHeader() {
      it("user perspective fetched", function () {
        el.append(navHeader.el);
        profileView = navHeader.profileView;
        userInfo = navHeader.user;
        expect(navHeader.user.attributes.name).toBe('userName');
      });
    }
    function waitForState(totalTimeout, checkFunction, failMsg) {
      var incTime = 200;
      var id = setInterval(waitEl(totalTimeout), incTime);
      var timespent = 0;

      function waitEl(timeout) {
        var end = timespent >= timeout;
        if (end || checkFunction()) {
          clearInterval(id);
        }
        timespent += incTime;
      }

      if (timespent > totalTimeout) {
        expect(false).toBeTruthy(failMsg);
      }
    }


    function viewOpenClose() {

      describe('open/close', function () {
        waitForFetch();

        appendNavHeader();
        beforeEach(function () {
          navHeader.$el.find('.nav-profile').trigger('click');
          navHeader.$el.find('.nav-profile').simulate('click');
        });


        it('profile menu opened', function () {
          var checkFunction = function () {
            var ret = false;
            if (navHeader.$el.find('.csui-profile > binf-open').length > 0) {
              ret = true;
            }
            return ret;
          };
          waitForState(10000, checkFunction, 'profile menu did not open');

          expect($('#csui-profile.binf-open').length > 0).toBe(true);
          expect($('.csui-profile-dropdown').css('display')).toBe('block');
        });

        it('profile menu closed', function () {

          var checkFunction = function () {
            var ret = false;
            if ($('.csui-profile > .binf-open').length === 0) {
              ret = true;
            }
            return ret;
          };
          waitForState(5000, checkFunction, 'profile menu did not open');

          expect($('.csui-profile > .binf-open').length > 0).toBe(false);
          expect($('.csui-profile-dropdown').is(':visible')).toBe(false);
          user.status = 'complete';

        });

      });
    }

    function destroyView(node) {
      it('view removed', function () {
        var checkFunction = function () {
          var ret = false;
          if (node.status === 'complete') {
            ret = true;
          }
          return ret;
        };
        waitForState(10000, checkFunction, 'view destroyed before completion');

        navHeader.$el.remove();
        navHeader = null;
        context.clear();
        context = null;
        el.html('');
        fetched = false;
        profileView = null;
        userInfo = null;
        node.status = 'destroyed';
        node.test.disable();

      });
    }


  });


});
