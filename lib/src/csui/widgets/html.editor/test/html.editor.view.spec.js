/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  'csui/widgets/html.editor/html.editor.view',
  '../../../utils/testutils/async.test.utils.js',
  './html.editor.mock.js'
], function ($, Marionette, PageContext, HtmlEditorView, asyncTestUtils, mock) {
  'use strict';
  xdescribe("HTML tile view", function () {

    describe("html editor view with invalid data id", function () {
      var context, htmlEditorView, el;
      beforeAll(function () {
        mock.enable();
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
        context = new PageContext();
        el = $('<div id="content"></div>').appendTo(document.body);
        htmlEditorView = new HtmlEditorView({
          icon: 'title-favourites',
          title: 'HTML Editor',
          context: context,
          id: 211987777 // Provide any wik page id.
        });
        new Marionette.Region({
          el: el
        }).show(htmlEditorView);
        context.fetch();
      });
      afterAll(function () {
        el.remove();
        mock.disable();
      });
      it('html view should be defined', function () {
        expect(htmlEditorView).toBeDefined();
      });

      it('should show content no longer exists when invalid data', function (done) {
        asyncTestUtils.asyncElement(el, '.csui-error-icon.notification_error').done(function (el) {
          expect(el.length).toEqual(1);
          done();
        });
      });

    });

    describe("html editor view with valid data id", function () {
      var context, htmlEditorView, el, dropdown;
      beforeAll(function () {
        mock.enable();
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
        context = new PageContext();
        el = $('<div id="content"></div>').appendTo(document.body);
        htmlEditorView = new HtmlEditorView({
          icon: 'title-favourites',
          title: 'HTML Editor',
          context: context,
          id: 2119877 // Provide any wik page id.
        });
        new Marionette.Region({
          el: el
        }).show(htmlEditorView);
        context.fetch();
      });
      afterAll(function () {
        el.remove();
        mock.disable();
      });
      it('html view should be defined', function () {
        expect(htmlEditorView).toBeDefined();
      });
      xit("should open permissions dialog on clicking permissions from dropdown", function (done) {
        asyncTestUtils.asyncElement(htmlEditorView.$el,
            '.binf-dropdown').done(function (el) {
          dropdown = el;
          expect(el.length).toEqual(1);
          el.find('.binf-dropdown-toggle').click();
          el.find('.binf-dropdown-menu > li:last-child > a').trigger('click');
          asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
              '.binf-modal-dialog:visible').done(function (el) {
            expect(el.length).toEqual(1);
            el.find('.cs-metadata-close').trigger('click');
            done();
          });
        });
      });
      it("should open html editor on clicking edit from dropdown", function (done) {
        asyncTestUtils.asyncElement(htmlEditorView.$el,
            '.binf-dropdown').done(function (el) {
          dropdown = el;
          expect(el.length).toEqual(1);
          el.find('.binf-dropdown-toggle').click();
          el.find('.binf-dropdown-menu > li:first-child > a').trigger('click');
          asyncTestUtils.asyncElement(document.body, '.csui-rich-text-editor-toolbar:visible').done(
              function (el) {
                expect(el.length).toEqual(1);
                done();
              });
        });
      });
      it("should close editor on clicking cancel", function(done) {        
        $(".csui-html-edit-icon.csui-html-edit-cancel").click();                
        asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(), '.csui-yes').done(function(el) {
          el.click();
          asyncTestUtils.asyncElement(htmlEditorView.$el, '.csui-html-editor-dropdown:visible').done(function(el) {
            expect(el.length).toEqual(1);
            done();
          });          
        });
      });
    });
  });
});
