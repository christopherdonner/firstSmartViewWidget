/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette", "csui/lib/backbone",
  "csui/widgets/metadata/metadata.view", "csui/utils/contexts/page/page.context",
  "csui/utils/contexts/factories/node", "./metadata.mock.data.js",
  "csui/widgets/metadata/metadata.properties.view",
  "../../../utils/testutils/async.test.utils.js"
], function ($, _, Marionette, Backbone, MetaDataView, PageContext, NodeModelFactory,
    MetadataMock, MetadataPropertiesView, asyncTestUtils) {
  'use strict';

  describe("MetaDataView Widget", function () {
    var context, v1, v2, v3, node1, node2;
    var titleProperties = "Properties",
        titleVersions   = "Versions",
        titleActivities = "Activity",
        titleGeneral    = "General";

    beforeAll(function () {
      MetadataMock.enable();

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

      node1 = context.getModel(NodeModelFactory,
          {attributes: {id: 11111}, delayRestCommands: true});
      node1.setExpand('properties', 'original_id');

      node2 = context.getModel(NodeModelFactory, {attributes: {id: 22222}});
      node2.setExpand('properties', 'original_id');

      node1.nonPromotedActionCommands = ['addcategory'];

      v1 = new MetaDataView({
        context: context,
        model: node1,
        delayTabContent: false
      });

      v2 = new MetaDataView({
        context: context,
        model: node2,
        delayTabContent: false
      });

      v3 = new MetadataPropertiesView({
        context: context,
        node: node1
      });
    });

    afterAll(function () {
      MetadataMock.disable();
      $('body').empty();
     });

    it("the first view can be instantiated", function () {
      expect(v1).toBeDefined();
      expect(v1.$el.length > 0).toBeTruthy();
      expect(v1.$el.attr('class')).toEqual('cs-metadata');
      expect(v1.el.childNodes.length === 0).toBeTruthy();
      expect(v1).toBeDefined();
      expect(v1.$el.length > 0).toBeTruthy();
      expect(v1.el.childNodes.length === 0).toBeTruthy();
    });

    it("the second view can be instantiated", function () {
      expect(v2).toBeDefined();
      expect(v2.$el.length > 0).toBeTruthy();
      expect(v1.$el.attr('class')).toEqual('cs-metadata');
      expect(v2.el.childNodes.length === 0).toBeTruthy();

      expect(v2).toBeDefined();
      expect(v2.$el.length > 0).toBeTruthy();
      expect(v2.el.childNodes.length === 0).toBeTruthy();

    });

    describe("both views can be rendered and contain correct html elements", function () {

      it("view1 with a document object ID=11111", function (done) {
        var dataFetched = context.fetch()
            .then(function () {
              expect(node1.attributes.id).toEqual(11111);
              expect(node1.attributes.type).toEqual(144);
              expect(node1.attributes.mime_type).toEqual('application/pdf');
              $('body').append('<div id="metadata-view-v1"></div>');
              var region = new Marionette.Region({
                el: "#metadata-view-v1"
              });
              region.show(v1);

              expect(v1.$el.length > 0).toBeTruthy();
              expect(v1.el.childNodes.length > 0).toBeTruthy();
              expect(v1.$('.metadata-content-wrapper').length).toEqual(1);
              expect(v1.$('> .metadata-content-header > .metadata-header').length > 0).toBeTruthy();

              expect(v1.$('.metadata-content-wrapper > .cs-tab-links').length).toEqual(1);
              expect(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu').length).toEqual(
                  1);
              expect(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li').length).toEqual(
                  2);

              expect($(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li')[0]).find(
                  'a span').html()).toEqual(titleProperties);
              expect($(v1.$('.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu >' +
                            ' li')[1]).find('a span').html()).toEqual(titleVersions);

              expect(v1.$('.metadata-content-wrapper > .cs-tab-links').length).toEqual(1);

              expect(v1.$('.metadata-content-wrapper > .binf-tab-content').length).toEqual(1);
              expect(v1.$('.metadata-content-wrapper > .binf-tab-content > .binf-tab-pane >' +
                          ' .metadata-inner-wrapper').length > 0).toBeTruthy();

              expect(v1.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane').length).toEqual(2);
              expect($(v1.$('.metadata-content-wrapper .binf-tab-content .binf-tab-pane')[0]).find(
                  '.cs-metadata-properties').length).toEqual(1);
              expect($(v1.$('.metadata-content-wrapper .binf-tab-content .binf-tab-pane')[1]).find(
                  '.csui-metadata-versions').length).toEqual(1);

              done();
            })
            .fail(function () {
              expect(dataFetched.state()).toBe('resolved', 'Data fetch timed out');
              done();
            });

      });

      it("view2 with a folder object ID=22222", function (done) {
        var dataFetched = context.fetch()
            .then(function () {
              expect(node2.attributes.id).toEqual(22222);
              expect(node2.attributes.type).toEqual(0);
              expect(node2.attributes.mime_type).not.toBeDefined();
              v2.render();
              expect(v2.$el.length > 0).toBeTruthy();
              expect(v2.el.childNodes.length > 0).toBeTruthy();
              $('body').append('<div id="metadata-view-v2"></div>');
              var region = new Marionette.Region({
                el: "#metadata-view-v2"
              });
              region.show(v2);
              expect(v2.$('.metadata-content-wrapper').length).toEqual(1);
              expect(v2.$('> .metadata-content-header > .metadata-header').length > 0).toBeTruthy();

              expect(v2.$('.metadata-content-wrapper > .cs-tab-links').length).toEqual(1);
              expect(v2.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu').length).toEqual(
                  1);
              expect(v2.$('.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu >' +
                          ' li').length).toEqual(1);

              expect($(v2.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li')[0]).find(
                  'a span').html()).toEqual(titleProperties);

              expect(v2.$('.metadata-content-wrapper > .cs-tab-links').length).toEqual(1);

              expect(v2.$('.metadata-content-wrapper > .binf-tab-content').length).toEqual(1);
              expect(v2.$('.metadata-content-wrapper > .binf-tab-content > .binf-tab-pane >' +
                          ' .metadata-inner-wrapper').length >
                     0).toBeTruthy();

              expect(v2.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane').length).toEqual(1);
              expect($(v2.$('.metadata-content-wrapper .binf-tab-content .binf-tab-pane')[0]).find(
                  '.cs-metadata-properties').length).toEqual(1);

              done();
            })
            .fail(function () {
              expect(dataFetched.state()).toBe('resolved', 'Data fetch timed out');
              done();
            });

      });
    });

    it('should render tab content header view', function (done) {
      v3.on('update:scrollbar', function () {
        expect(!!v3.tabContentHeader).toBeTruthy();
        done();
      });
      v3.render();
    });

    it('should show required field switch for required categories ', function () {
      expect(v3.tabContentHeader.isRequiredCatPresent()).toBeTruthy();
    });

    describe("tab links", function () {
      beforeAll(function () {
        $($.fn.binf_modal.getDefaultContainer()).empty();
      });
      it('tab links present', function () {
        expect(v1.$el.find('.cs-tab-links').length).toEqual(1);
      });

      it('alphabetical order of categories', function () {
        var tabLinksText        = v1.$el.find('.tab-links-bar .binf-nav .cs-tablink-text'),
            i                   = 1,  //general category is at 0
            inAlphabeticalOrder = true;
        for (; inAlphabeticalOrder && i < tabLinksText.length - 1; i++) {
          inAlphabeticalOrder = tabLinksText[i + 1].innerText.toLowerCase() >
                                tabLinksText[i].innerText.toLowerCase();
        }
        expect(inAlphabeticalOrder).toBeTruthy();
      });

      it('highlighting tab link on clicking', function () {
        var tabLink = v1.$el.find('.tab-links-bar .binf-nav > li:last-child');
        v1.$el.find('.tab-links-bar .binf-nav > li:last-child > a')[0].click();
        expect(tabLink.hasClass('binf-active')).toBeTruthy();
        expect(tabLink.attr('aria-selected')).toEqual('true');
      });

      it('shows loading icons  and add-properties menu', function () {
        var loadingIcons = v1.$el.find('.csui-loading-parent-wrapper');
        expect(loadingIcons.length).toEqual(1);
      });

      it('shows add category dialog', function (done) {
        setInterval(function () {
          var addCat = v1.$el.find('.metadata-add-properties > * > button');
          expect(addCat.length).toEqual(1);
          console.log("addCat.length" + addCat.length);
          addCat[0].click();
          asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
              '.target-browse.cs-dialog.binf-modal').done(function (el) {
            expect(el.length).toEqual(1);
            el.find('.binf-modal-footer button:last-child').trigger('click');
            done();
          });
        }, 300);
      });

      describe('remove category', function () {
        var tabLinksBar, catToDelete, deleteConfirmBtn, catName;
        beforeAll(function () {
          tabLinksBar = v1.$el.find('.tab-links-bar');
          catToDelete = tabLinksBar.find('.binf-nav-pills > li:last-child > a');
          catName = catToDelete.find('.cs-tablink-text').text();
        });

        it("Turn on the required field switch ", function () {
          v3.tabContentHeader.ui.requiredSwitchIcon.trigger('click');
          expect(v3.$el.find('div .required-field-switch .binf-switch-off').length).toEqual(1);
        });

        it('check delete button & confirm delete', function (done) {
          expect(tabLinksBar.length).toEqual(1);
          catToDelete.parent().find('.cs-tablink-delete')[0].click();
          asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
              '.csui-alert.binf-modal .binf-modal-footer .binf-btn-primary').done(function (el) {
            expect(el.length).toEqual(1);
            el.trigger('click');
            done();
          });
        });

        it('Switch should be turned to off state after clicking the confirm delete button',
            function (done) {
               asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
               '.csui-alert.binf-modal .binf-modal-footer .binf-btn-primary').done(function (el){
                el.trigger('click');
                expect(v3.$el.find('div .required-field-switch .binf-switch-on').length).toEqual(0);
                done();
               });
              });


        it('verify removal of category', function (done) {
          asyncTestUtils.asyncElement(tabLinksBar,
              '.binf-nav-pills > li > a[title=' + catName + ']', true).done(function (el) {
            expect(el.length).toEqual(0);
            done();
          });
        });
      });
    });

    it('should open actions dropdown menu on click[medium]', function () {
      var headerElement = v1.$el.find('> .metadata-content-header >' +
                                      ' .metadata-header.with-right-bar >' +
                                      ' .cs-metadata-item-name-container > * >' +
                                      ' .title-edit-icon-div .cs-dropdown-menu');
      expect(headerElement.find(".binf-dropdown.binf-open").length).toEqual(0);
      headerElement.find("> .binf-dropdown > .binf-dropdown-toggle").click();
      expect(headerElement.find(".binf-dropdown.binf-open").length).toEqual(1);
      expect(headerElement.find(".binf-dropdown-menu > li > a").length).toBeGreaterThan(0);
    });

    it('For Folder thumbnail_section icon should be present', function () {
      var thumbnail_icon = v2.$el.find('.thumbnail_section');
      expect(thumbnail_icon.length).toEqual(1);
      expect(thumbnail_icon.attr('title')).toEqual('Open ' + v2.options.model.get('type_name'));
    });

    it('Item Id element must be present', function () {
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item[data-alpaca-container-item-name='itemId']").length).toEqual(
          1);
      var itemid = v1.options.model.get('id');
      itemid = itemid.toString();
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item[data-alpaca-container-item-name='itemId'] span").html()).toEqual(
          itemid);
    });

    it('Item Id Label must be present', function () {
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item label[title='Item ID']").length).toEqual(1);
    });
  });
});


