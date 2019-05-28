/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/contexts/page/page.context', './nodestable.mock.js'
], function (Marionette, _, $, NodesTableView, PageContext, mock) {
  'use strict';

  describe('NodesTableView', function () {
    var context, contextNoDescriptionNodes, contextWithDescriptionNodes,
        factories = {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 2000}
          }
        };

    beforeEach(function () {
      mock.enable();
      if (!context) {
        context = new PageContext({
          factories: factories
        });
      }

      if (!contextNoDescriptionNodes) {
        var factoriesWithoutDescriptions = _.deepClone(factories);
        factoriesWithoutDescriptions.node.attributes.id = 4000;  //4000 don't have any
        contextNoDescriptionNodes = new PageContext({
          factories: factoriesWithoutDescriptions
        });
      }

      if (!contextWithDescriptionNodes) {
        var factoriesWithDescriptions = _.deepClone(factories);
        factoriesWithDescriptions.node.attributes.id = 5000;  //5000 have description nodes
        contextWithDescriptionNodes = new PageContext({
          factories: factoriesWithDescriptions
        });
      }
    });

    afterEach(function () {
      mock.disable();
    });

    describe('on creation, by default', function () {
      var nodesTableView, children;
      beforeEach(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });
          children = nodesTableView.collection;
          nodesTableView.render();
          context.once('sync', function () {
            expect(children.length).toEqual(30);
          })
              .fetch()
              .then(function () {
                done();
              });
        } else {
          done();
        }
      });

      it('shows the first page', function () {
        expect(children.skipCount).toEqual(0);
      });

      it('uses page size of 30 items', function () {
        expect(children.topCount).toEqual(30);
      });

      it('orders ascending by name', function () {
        expect(children.orderBy).toEqual('name asc');
      });

      it('does not filter', function () {
        expect(children.filters).toEqual({});
      });
    });
    xdescribe('on drill down, by default', function () {
      var nodesTableView, children;
      beforeEach(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });
          var collectionCnt = 0;
          var collectionCallback = _.after(1, function () {
            ++collectionCnt;
            if (collectionCnt === 1) {
              expect(children.length).toEqual(30);
              nodesTableView.tableView.setFilter({name: 'child'});
              children.setFilter({name: 'child'});
            } else if (collectionCnt === 2) {
              expect(children.filters).toEqual({name: 'child'});
              nodesTableView.tableView.table.order([2, 'desc']);
              children.setOrder('name desc');
            } else if (collectionCnt === 3) {
              expect(children.orderBy).toEqual('name desc');
              nodesTableView.paginationView.setPageSize(100, false);
              nodesTableView.paginationView.changePage(1);
            } else if (collectionCnt === 4) {
              expect(children.skipCount).toEqual(100);
              children.node.set('id', 2001);
              context.fetch();
            } else if (collectionCnt === 8) {
              contextCallback();
            } else {
            }
          });
          var contextCnt = 0;
          var contextCallback = _.after(1, function () {
            ++contextCnt;
            if (contextCnt === 3) {
              expect(children.length).toEqual(1);
              expect(children.first().get('id')).toEqual(3000);
              done();
            }
          });

          children = nodesTableView.collection
              .on('sync', function () {
                collectionCallback();
              });
          nodesTableView.render();
          var fetching = context
              .on('sync', function () {
                contextCallback();
              })
              .fetch()
              .fail(function () {
                expect(fetching.state()).toBe('resolved',
                    "Loading: context was not fetched in time");
              });

        } else {
          done();
        }
      }, 25000);

      it('resets to the first page', function () {
        expect(children.skipCount).toEqual(0);
      });

      it('keeps page size', function () {
        expect(children.topCount).toEqual(100);
      });

      it('retains sorting', function () {
        expect(children.orderBy).toEqual('name desc');
      });

      it('resets filtering', function () {
        expect(children.filters).toEqual({});
      });
    });

    xdescribe('folder with no description', function () {
      var nodesTableView, regionEl;
      beforeEach(function (done) {
        var self = this;
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextNoDescriptionNodes
          });
          contextNoDescriptionNodes.fetch().then(function () {
            regionEl = $('<div></div>').appendTo(document.body);
            new Marionette.Region({
              el: regionEl
            }).show(nodesTableView);
            self.view = nodesTableView;
            self.row = nodesTableView.$el.find(".csui-saved-item[role='row']").first().parent();
            done();
          });
        } else {
          this.view = nodesTableView;
          this.row = nodesTableView.$el.find(".csui-saved-item[role='row']").first().parent();
          done();
        }
      });
      afterAll(function () {
        regionEl.remove();
      });

      it('should not show description toggle icon', function () {
        expect(nodesTableView.$el.find(".icon.icon-description-toggle").length).toEqual(0);
      });
      it('should not show any description', function () {
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
      });

      it('presence of copy link action in actions dropdown menu[medium]', function () {

        var copyLinkAction = "Copy link";
        var headerElement = nodesTableView.$el.find('.csui-toolbar-caption > .csui-item-title');
        var dropdownElement = headerElement.find('.csui-item-title-dropdown-menu');
        expect(dropdownElement.find(".binf-dropdown.binf-open").length).toEqual(0);
        var a = dropdownElement.find(".binf-dropdown-toggle").click();
        expect(dropdownElement.find(".binf-dropdown.binf-open").length).toEqual(1);
        var liLength = dropdownElement.find(".binf-dropdown.binf-open > ul > li").length;
        var flag = false;
        for (var i = 0; i <= liLength; i++) {
          var liElementInstance = ".binf-dropdown.binf-open > ul > li:nth-child(" + i + ")";
          var liElement = dropdownElement.find(liElementInstance);
          var liContent = liElement.text().trim();
          if (copyLinkAction === liContent) {
            flag = true;
            break;
          }
        }
        expect(flag).toEqual(true);
      });

    });

    xdescribe('folder with description', function () {
      var nodesTableView, toggleIcon, regionEl, nodesFetched;
      beforeEach(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextWithDescriptionNodes
          });
          contextWithDescriptionNodes.fetch().then(function () {
            regionEl = $('<div></div>').appendTo(document.body);
            new Marionette.Region({
              el: regionEl
            }).show(nodesTableView);
            done();
          });
        } else {
          done();
        }
      });

      afterAll(function () {
        regionEl.remove();
      });

      it('should show description toggle icon', function () {
        toggleIcon = nodesTableView.$el.find(".icon.icon-description-toggle");
        expect(toggleIcon.length).toEqual(1);
        expect(toggleIcon.closest('a').prop('title')).toEqual("Show description");
      });

      it('should not show any description by default', function () {
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
      });

      it('show descriptions', function () {
        toggleIcon = nodesTableView.$el.find(".icon.icon-description-toggle");
        toggleIcon.trigger('click');
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toBeGreaterThan(0);
        expect(toggleIcon.closest('a').prop(
            'title')).toEqual("Hide description");
      });

      it('hide descriptions', function () {
        toggleIcon = nodesTableView.$el.find(".icon.icon-description-toggle");
        toggleIcon.trigger('click');
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
        expect(toggleIcon.closest('a').prop('title')).toEqual("Show description");
      });

      it('read more caret icon for lengthy description row', function () {
        nodesTableView.$el.find(".icon.icon-description-toggle").trigger('click');
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toBeGreaterThan(0);
        var lengthyDescriptionRow = nodesTableView.$el.find(
            'tr.csui-details-row-description:first');
        expect(lengthyDescriptionRow.find('.description-caret-div').length).toEqual(1);
        expect(lengthyDescriptionRow.find('span.description-readmore').hasClass(
            'caret-hide')).toBeFalsy();
        expect(lengthyDescriptionRow.find('span.description-showless').hasClass(
            'caret-hide')).toBeTruthy();
      });

      it('show full description clicking on readmore icon', function () {
        var lengthyDescriptionRow = nodesTableView.$el.find(
            'tr.csui-details-row-description:first');
        expect(lengthyDescriptionRow.find('.csui-description-collapsed').length).toEqual(1);
        lengthyDescriptionRow.find('span.description-readmore').trigger('click');
        expect(lengthyDescriptionRow.find('.csui-description-collapsed').length).toEqual(0);
        expect(lengthyDescriptionRow.find('span.description-showless').hasClass(
            'caret-hide')).toBeFalsy();
        expect(lengthyDescriptionRow.find('span.description-readmore').hasClass(
            'caret-hide')).toBeTruthy();
      });

      it('hide the description and show only single line, clicking on showless icon', function () {
        var lengthyDescriptionRow = nodesTableView.$el.find(
            'tr.csui-details-row-description:first');
        lengthyDescriptionRow.find('span.description-showless').trigger('click');
        expect(lengthyDescriptionRow.find('.csui-description-collapsed').length).toEqual(1);
        expect(lengthyDescriptionRow.find('span.description-showless').hasClass(
            'caret-hide')).toBeTruthy();
        expect(lengthyDescriptionRow.find('span.description-readmore').hasClass(
            'caret-hide')).toBeFalsy();
      });

      it('no caret icon should be shown for the short description row', function () {
        var shortDescriptionRow = nodesTableView.$el.find('tr.csui-details-row-description:last');
        expect(shortDescriptionRow.find('span.description-showless').hasClass(
            'caret-hide')).toBeTruthy();
        expect(shortDescriptionRow.find('span.description-readmore').hasClass(
            'caret-hide')).toBeTruthy();
        expect(shortDescriptionRow.find('.description-caret-div > span:visible').length).toEqual(0);
      });

      it('description row should not be shown, for the item which do not have any description',
          function () {
            expect(nodesTableView.$el.find('tr.csui-saved-item:last').next('tr').hasClass(
                'csui-details-row-description')).toBeFalsy();
          });
    });
  });
});