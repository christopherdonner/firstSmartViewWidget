/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/backbone',
  'csui/widgets/nodestable/nodestable.view', 'csui/controls/thumbnail/thumbnail.view',
  'csui/utils/contexts/page/page.context', './thumbnail.mock.js',
  '../../../utils/testutils/async.test.utils.js', "csui/lib/jquery.mousehover"
], function ($, _, Marionette, Backbone, NodesTableView, ThumbnailView, PageContext, mock,
    AsyncUtils) {
  describe("Thumbnail View", function () {
    var pageSize = 30;
    var context = new PageContext({
      factories: {
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
      }
    });

    var options = {
      context: context,
      data: {
        pageSize: pageSize
      }
    };

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    describe('on creation, by default', function () {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        var children = nodesTableView.collection;
        context.once('sync', function () {
          expect(children.length).toEqual(30);
        });
        nodesTableView.render();
        context.fetch().then(function () {
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          done();
        });
      });

      afterAll(function () {
        regionEl.remove();
        nodesTableView.destroy();
      });

      it('Nodestable view', function (done) {
        AsyncUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);
              done();
            });
      });

      it('To verify the ThumbnailView functionality', function (done) {
        var configurationMenu = nodesTableView.$el.find('.csui-configuration-view .binf-dropdown');
        configurationMenu.find('.binf-dropdown-toggle').trigger('click');
        var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
        clickMenuItem.trigger('click');
        AsyncUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
            function () {
              expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
              done();
            });
      });

      it('verifying for other action items', function () {
        var favoriteIcon = $(".csui-thumbnail-favorite").is(":visible");
        expect(favoriteIcon).toBeTruthy();
        var overViewIcon = $(".csui-thumbnail-overview").is(":visible");
        expect(overViewIcon).toBeTruthy();
        var nodeIcon = $(".csui-thumbnail-thumbnailIcon").is(":visible");
        expect(nodeIcon).toBeTruthy();
        var toolbar = $(".csui-thumbnail-actionbar > .csui-table-actionbar-bubble").is(":visible");
        expect(toolbar).toBeFalsy();
      });

      it('Hovering on the node', function (done) {
        var object = $(".csui-thumbnail-item");
        object.eq(0).trigger(
            {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
        AsyncUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
            function () {
              var toolbar = $(".csui-table-actionbar-bubble").is(":visible");
              expect(toolbar).toBe(true);
              done();
            });
      });

      it('Clicking on the favorite icon', function (done) {
        var favoriteIcon = $(".csui-favorite-star").eq(1);
        favoriteIcon.trigger('click');
        AsyncUtils.asyncElement($('body'), ".binf-popover-content").done(
            function () {
              expect(".binf-popover-content:visible").toBeTruthy();
              $("button[title='Cancel']").trigger('click');
              done();
            });
      });

      it('Clicking on the OverView icon', function (done) {
        var overViewIcon = $(".icon-thumbnail-metadata-overview").eq(0);
        overViewIcon.trigger('click');
        AsyncUtils.asyncElement($('body'), ".binf-popover-content").done(
            function () {
              expect(".binf-popover-content:visible").toBeTruthy();
              done();
            });
      });

      it('Click the Selectall checkbox in thumbnail view', function (done) {
        var selectAll = $(".csui-selectAll-input");
        selectAll.trigger('click');
        AsyncUtils.asyncElement(nodesTableView.$el, '.csui-selected-checkbox').done(
            function () {
              var thumbnailcol = $(".csui-thumbnail-item").find('input[title="Select item"]');
              expect(thumbnailcol.filter(':checked').length).toEqual(thumbnailcol.length);
              expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
              done();
            });
      });

      it('Check whether Selectall checkbox is checked in table view', function (done) {
        var headertoggle = $(".csui-condensed-header-toggle");
        headertoggle.trigger('click');
        var configurationMenu = nodesTableView.$el.find('.csui-configuration-view .binf-dropdown');
        configurationMenu.find('.binf-dropdown-toggle').trigger('click');
        var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
        clickMenuItem.trigger('click');

        AsyncUtils.asyncElement(nodesTableView.$el, 'thead th[data-csui-attribute=_select]').done(
            function () {
              var tablecol = nodesTableView.$el.find('td[data-csui-attribute=_select]');
              var selectedTableCol = nodesTableView.$el.find('td[data-csui-attribute=_select]' +
                                                             ' .csui-control.csui-checkbox[aria-checked=true]');
              expect(selectedTableCol.length).toEqual(tablecol.length);
              expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();

              var tableselectall = nodesTableView.$el.find('td[data-csui-attribute=_select]' +
                                                           ' .csui-control.csui-checkbox');
              var checked = tableselectall.attr('aria-checked');
              expect(checked).toBeDefined();
              expect(checked).toBe('true');
              tableselectall.trigger('click');
              done();
            });
      });
    });

    describe('Thumbnail add action', function () {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        var children = nodesTableView.collection;
        context.once('sync', function () {
          expect(children.length).toEqual(30);
        });
        nodesTableView.render();
        context.fetch().then(function () {
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          done();
        });
      });

      afterAll(function () {
        regionEl.remove();
        nodesTableView.destroy();
      });

      it('Open Thumbnail view', function (done) {
        AsyncUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);

              var configurationMenu = nodesTableView.$el.find(
                  '.csui-configuration-view .binf-dropdown');
              configurationMenu.find('.binf-dropdown-toggle').trigger('click');
              var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
              clickMenuItem.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
                  function () {
                    expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(
                        1);
                    done();
                  });
            });
      });

      it('Adding a folder', function (done) {
        AsyncUtils.asyncElement($('body'), ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Folder']");
              addFolder.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      it('Adding a Web Url', function (done) {
        AsyncUtils.asyncElement($('body'), ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Web address']");
              addFolder.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      it('Adding a Collection', function (done) {
        AsyncUtils.asyncElement($('body'), ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Collection']");
              addFolder.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      xit('Adding a Shortcut', function (done) {
        AsyncUtils.asyncElement($('body'), ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Shortcut']");
              addFolder.trigger('click');
              AsyncUtils.asyncElement($('body'), ".binf-modal-content:visible").done(
                  function () {
                    var inputField = $(".binf-modal-content:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });
    });

    describe('Thumbnail Header', function () {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        var children = nodesTableView.collection;
        context.once('sync', function () {
          expect(children.length).toEqual(30);
        });
        nodesTableView.render();
        context.fetch().then(function () {
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          done();
        });
      });

      afterAll(function () {
        regionEl.remove();
        nodesTableView.destroy();
      });

      it('Thumbnail view', function (done) {
        AsyncUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);
              var configurationMenu = nodesTableView.$el.find(
                  '.csui-configuration-view .binf-dropdown');
              configurationMenu.find('.binf-dropdown-toggle').trigger('click');
              var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
              clickMenuItem.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
                  function () {
                    expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                    done();
                  });
            });
      });

      it('To verify the thumbnail header elements', function (done) {
        var thumbnailHeader = $(".csui-thumbnail-header");
        expect(thumbnailHeader.is(':visible')).toBeTruthy();
        AsyncUtils.asyncElement(thumbnailHeader, ".csui-checkbox-selectAll").done(
            function ($el) {
              expect($el.is(":visible")).toBeTruthy();
              expect($el.text().trim()).toEqual("Select all");
              AsyncUtils.asyncElement(thumbnailHeader, ".csui-thumbnail-itemcount").done(
                  function ($el) {
                    expect($el.is(":visible")).toBeTruthy();
                    expect($el.text().trim()).toEqual(pageSize + " items");
                    done();
                  });
            });
        var sortOptions = $(".csui-search-sort-options").is(":visible");
        expect(sortOptions).toBeTruthy();
        var searchIcon = $(".csui-thumbnail-column-search").is(":visible");
        expect(searchIcon).toBeTruthy();
      });
    });
    describe('Thumbnail Sorting', function () {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        var children = nodesTableView.collection;
        context.once('sync', function () {
          expect(children.length).toEqual(30);
        });
        nodesTableView.render();
        context.fetch().then(function () {
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          done();
        });
      });

      afterAll(function () {
        regionEl.remove();
        nodesTableView.destroy();
      });
      it('Open thumbnail view', function (done) {
        AsyncUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);

              var configurationMenu = nodesTableView.$el.find(
                  '.csui-configuration-view .binf-dropdown');
              configurationMenu.find('.binf-dropdown-toggle').trigger('click');
              var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
              clickMenuItem.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
                  function () {
                    expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                    done();
                  });
            });
      });
      it('To verify thumbnail items in Ascending order by Name(A-Z)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#asc_name").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Name (A-Z)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(sortDropdown.text().trim()).toEqual("Name");
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(29).text().trim()).toEqual("Child 30");
                    done();
                  });
            });

      });
      xit('To verify thumbnail items in Descending order by Name(Z-A)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#desc_name").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Name (Z-A)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(sortDropdown.text().trim()).toEqual("Name");
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(29).text().trim()).toEqual("Child 79");
                    done();
                  });
            });
      });
      xit('To verify thumbnail items in Ascending order by Modified (new-old)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#asc_modify_date").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Modified (new-old)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(nodesTableView.collection.models["1"].attributes.modify_date).toEqual("2017-9-12T12:52:51Z");
                    done();

                  });
            });

      });
      xit('To verify thumbnail items in Descending order by Modified (old-new)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#desc_modify_date").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Modified (old-new)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(nodesTableView.collection.models["1"].attributes.modify_date).toEqual("2018-12-12T12:52:51Z");
                    done();

                  });
            });
      });
      it('To verify thumbnail items in Ascending order by Size (small-large)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#asc_size").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Size (small-large)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    var overViewIcon = $(".icon-thumbnail-metadata-overview").eq(29);
                    overViewIcon.trigger('click');
                    AsyncUtils.asyncElement($('body'), ".binf-popover-content").done(
                        function () {
                          expect(".binf-popover-content:visible").toBeTruthy();
                          AsyncUtils.asyncElement(".binf-popover-content",
                              ".csui-thumbnail-size-value").done(
                              function ($el) {
                                expect($el.text().trim()).toEqual("1 item");
                                done();
                              });
                        });
                  });
            });

      });
      it('To verify thumbnail items in Descending order by Size (large-small)', function (done) {
        var sortDropdown = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        AsyncUtils.asyncElement(sortingContainer, "#desc_size").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Size (large-small)");
              $el.trigger('click');
              AsyncUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    var overViewIcon = $(".icon-thumbnail-metadata-overview").eq(29);
                    overViewIcon.trigger('click');
                    AsyncUtils.asyncElement($('body'), ".binf-popover-content").done(
                        function () {
                          expect(".binf-popover-content:visible").toBeTruthy();
                          AsyncUtils.asyncElement(".binf-popover-content",
                              ".csui-thumbnail-size-value").done(
                              function ($el) {
                                expect($el.text().trim()).toEqual("1 item");
                                done();
                              });
                        });
                  });
            });

      });
    });
    describe('Thumbnail overview popover', function () {
      var nodesTableView, regionEl;
      beforeAll(function (done) {
        nodesTableView = new NodesTableView(options);
        var children = nodesTableView.collection;
        context.once('sync', function () {
          expect(children.length).toEqual(30);
        });
        nodesTableView.render();
        context.fetch().then(function () {
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          done();
        });
      });

      afterAll(function () {
        regionEl.remove();
        nodesTableView.destroy();
      });
      it('Open thumbnail view', function (done) {
        AsyncUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail']").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").length).toEqual(1);
              var configurationMenu = nodesTableView.$el.find(
                  '.csui-configuration-view .binf-dropdown');
              configurationMenu.find('.binf-dropdown-toggle').trigger('click');
              var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
              clickMenuItem.trigger('click');
              AsyncUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
                  function () {
                    expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                    done();
                  });
            });
      });
      it('To verify thumbnail overview popover', function (done) {
        var overViewIcon = $(".icon-thumbnail-metadata-overview").eq(0);
        overViewIcon.trigger('click');
        AsyncUtils.asyncElement($('body'), ".binf-popover-content").done(
            function () {
              expect(".binf-popover-content:visible").toBeTruthy();
              done();
            });
      });
      xit('To verify thumbnail properties actions in popover', function (done) {
        AsyncUtils.asyncElement(".binf-popover-content", ".icon-toolbar-metadata").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.is(':visible')).toBeTruthy();
              $el.trigger('click');
              AsyncUtils.asyncElement($('body'), ".csui-node-properties-wrapper").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    done();

                  });
            });
      });
    });
  });
});
