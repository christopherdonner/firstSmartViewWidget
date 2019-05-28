/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette', 'csui/lib/underscore', "csui/lib/jquery",
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/contexts/page/page.context',
  './virtualfolder.mock.js',
  '../../../utils/testutils/async.test.utils.js'
], function (Marionette, _, $, NodesTableView, PageContext, mock, testUtils) {
  'use strict';

  describe('For VirtualFolder', function () {

    var context,
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

    });

    afterEach(function () {
      mock.disable();
    });

    describe('NodeStable view', function () {
      var nodesTableView, children;

      beforeEach(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });
          children = nodesTableView.collection;
          context.once('sync', function () {
            expect(children.length).toEqual(26);
          }).fetch()
              .then(function () {
                done();
              });

          $('body').append('<div id="vf-view-region"></div>');
          var region = new Marionette.Region({
            el: "#vf-view-region"
          });
          region.show(nodesTableView);
        } else {
          done();
        }
      });
      it('Filter icon is visible[Low]', function () {
        var filterIcon = nodesTableView.$el.find('.icon.icon-toolbarFilter:not(.binf-hidden)');
        expect(filterIcon.length).toEqual(1);
      });

      it('on click of filter icon,shows the facet panel [Medium]', function (done) {
        var facetPanel = nodesTableView.$el.find('.csui-table-facetview');
        expect(facetPanel.hasClass('csui-facetview-hidden')).toBeTruthy();
        var filterIcon = nodesTableView.$el.find('.icon.icon-toolbarFilter');
        filterIcon.trigger('click');
        testUtils.asyncElement(facetPanel, '.csui-facetview-hidden', true).done(function () {
          expect(facetPanel.hasClass('csui-facetview-hidden')).toBeFalsy();
          done();
        });
      });

      it('the facet panel contains facets [Low]', function () {
        expect(nodesTableView.$el.find('.csui-facet').length).toEqual(4);
      });

      describe('Target Dialog for copy', function () {
        var copyTargetBrowse, copyDefaultContainer;
        beforeAll(function () {
          copyDefaultContainer = $.fn.binf_modal.getDefaultContainer();
          copyTargetBrowse = $(copyDefaultContainer).empty();
        });
        xit('enables the linked header [Low]', function (done) {
          var selectedCheckbox = nodesTableView.$el.find(
              '.csui-selected-checkbox.csui-checkbox-primary:not(.csui-checkbox-selectAll)' +
              ' input').first();
          selectedCheckbox.trigger('click');
          testUtils.asyncElement(
              nodesTableView.$el, '.csui-table-rowselection-toolbar.csui-table-rowselection-toolbar-visible' +
                                  ' .csui-toolbar.binf-nav.binf-nav-pills' +
                                  '.csui-align-left').done(function (el) {
            expect(el.length).toEqual(1);
            done();
          });
        });
        xit('opens on clicking copy button and copy button is enabled [Medium] ',
            function (done) {
              var container  = $(copyDefaultContainer).appendTo(document.body),
                  copyAnchor = nodesTableView.$el.find(
                      '.csui-table-rowselection-toolbar.csui-table-rowselection-toolbar-visible [data-csui-command="copy"] > a');
              copyAnchor.trigger('click');
              testUtils.asyncElement(container, '.target-browse.cs-dialog.binf-modal:visible').done(
                  function (el) {
                    copyTargetBrowse = el;
                    expect(copyTargetBrowse.find(
                        '.binf-modal-footer' +
                        ' .binf-btn-primary:disabled').length).toEqual(
                        0);
                    done();
                  });
            });
        xit('disables copy button on selecting virtual folder of the targetBrowse[Medium]',
            function (done) {
              copyTargetBrowse.find('.csui-icon-node-virtual-folder_nonselectable:first').trigger(
                  'click');
              testUtils.asyncElement(copyTargetBrowse,
                  '.cs-footer-control .csui-footer-buttons' +
                  ' .binf-btn.binf-btn-primary.cs-add-button.csui-acc-tab-region:disabled').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    expect(copyTargetBrowse.find(
                        '.csui-panel.cs-pane-view.csui-slideMidLeft').length).toEqual(1);
                    expect(copyTargetBrowse.find(
                        '.csui-icon.csui-start-icon.icon-listview-checkmark').length).toEqual(0);
                    done();
                  });

            });
        it('gets closed on clicking targetBrowse[low]',
            function (done) {
              var cancelButton = copyTargetBrowse.find(
                  '.binf-modal-footer .cs-footer-control .csui-footer-buttons div > button').last();
              cancelButton.trigger('click');
              testUtils.asyncElement(copyDefaultContainer, '.target-browse.cs-dialog.binf-modal',
                  true).done(function (el) {
                expect(el.length).toEqual(0);
                done();
              });
            });

        afterAll(function () {
          copyTargetBrowse = $(copyDefaultContainer).empty();

        });
      });

      describe('Target Dialog for move', function () {
        var moveTargetBrowse, moveDefaultContainer;
        beforeAll(function () {
          moveDefaultContainer = $.fn.binf_modal.getDefaultContainer();
          moveTargetBrowse = $(moveDefaultContainer).empty();
        });

        xit('opens on clicking move button and move button is disabled [Medium] ',
            function (done) {
              var moveContainer = $(moveDefaultContainer).appendTo(document.body),
                  moveAnchor    = nodesTableView.$el.find(
                      '.csui-toolbar [data-csui-command="move"] > a');
              moveAnchor.trigger('click');
              testUtils.asyncElement(moveContainer,
                  '.target-browse.cs-dialog.binf-modal:visible').done(
                  function (el) {
                    moveTargetBrowse = el;
                    expect(moveTargetBrowse.find(
                        '.binf-modal-footer' +
                        ' .binf-btn-primary:disabled').length).toEqual(
                        1);
                    done();
                  });
            });

        xit('enables move button on selecting selectable type of the targetBrowse[Medium]',
            function (done) {
              moveTargetBrowse.find('.csui-icon.mime_folder:first').trigger('click');
              testUtils.asyncElement(moveTargetBrowse,
                  '.binf-btn.binf-btn-primary.cs-add-button.csui-acc-tab-region:disabled',
                  true).done(
                  function () {
                    expect(moveTargetBrowse.find(
                        '.binf-btn.binf-btn-primary.cs-add-button.csui-acc-tab-region:disabled').length).toEqual(
                        0);
                    expect(moveTargetBrowse.find(
                        '.csui-panel.cs-pane-view.csui-slideMidLeft').length).toEqual(1);
                    expect(moveTargetBrowse.find(
                        '.csui-icon.csui-start-icon.icon-listview-checkmark').length).toEqual(1);
                    done();
                  });
            });

        xit('disables move button on selecting virtual folder of the targetBrowse and its' +
           ' browsable [Medium]',
            function (done) {
              moveTargetBrowse.find('.csui-icon-node-virtual-folder_nonselectable:first').trigger(
                  'click');
              testUtils.asyncElement(moveTargetBrowse,
                  '.cs-footer-control .csui-footer-buttons .binf-btn.binf-btn-primary.cs-add-button.csui-acc-tab-region:disabled').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    expect(moveTargetBrowse.find(
                        '.csui-panel.cs-pane-view.csui-slideMidLeft').length).toEqual(1);
                    expect(moveTargetBrowse.find(
                        '.csui-icon.csui-start-icon.icon-listview-checkmark').length).toEqual(0);
                    done();
                  });

            });
        it('gets closed on clicking targetBrowse[low]',
            function (done) {
              var cancelButton = moveTargetBrowse.find('.binf-modal-footer .cs-footer-control' +
                                                       ' .csui-footer-buttons div > button').last();
              cancelButton.trigger('click');
              testUtils.asyncElement(moveDefaultContainer, '.target-browse.cs-dialog.binf-modal',
                  true).done(function (el) {
                expect(el.length).toEqual(0);
                done();
              });
            });

        afterAll(function () {
          moveTargetBrowse = $(moveDefaultContainer).empty();
        });
      });

      describe('Facet panel', function () {
        it('on select of a facet item,shows apply and cancel icon in facet bar [Medium]',
            function () {

              var facetItems = nodesTableView.$el.find('.csui-facet .csui-facet-content').first();
              var firstFacetItemCheckbox = facetItems.find('input[type="checkbox"]').first();
              firstFacetItemCheckbox.trigger('click');
              var multiSelectDiv = facetItems.find('.csui-facet-controls.csui-multi-select');
              var applyIcon = multiSelectDiv.find(
                  '.csui-btn.binf-btn.binf-btn-primary.csui-apply');
              var cancelIcon = multiSelectDiv.find(
                  '.csui-btn.binf-btn.binf-btn-secondary.csui-clear');
              expect(applyIcon.length).toEqual(1);
              expect(cancelIcon.length).toEqual(1);
            });

        it('on click of apply button,shows save as and clear filter button [High]',
            function (done) {
              var hiddenSaveAsIcon = nodesTableView.$el.find(
                  '.binf-btn.binf-btn-primary.csui-filter-save.binf-hidden');
              expect(hiddenSaveAsIcon.length).toEqual(1);
              var hiddenClearAllIcon = nodesTableView.$el.find(
                  '.csui-clear-all.binf-hidden .clear-label');
              expect(hiddenClearAllIcon.length).toEqual(1);
              var facetItems = nodesTableView.$el.find('.csui-facet .csui-facet-content').first();
              var multiSelectDiv = facetItems.find('.csui-facet-controls.csui-multi-select');
              var applyAllIcon = multiSelectDiv.find(
                  '.csui-btn.binf-btn.binf-btn-primary.csui-apply');
              applyAllIcon.trigger('click');
              testUtils.asyncElement(nodesTableView.$el,
                  '.binf-btn.binf-btn-primary.csui-filter-save:visible').done(function (el) {
                expect(el.length).toEqual(1);
                expect(nodesTableView.$el.find('.csui-clear-all:not(.binf-hidden)' +
                                               ' .clear-label').length).toEqual(1);
                done();
              });
            });
      });

      describe('Target Dialog for save filter', function () {
        var targetBrowse, globalMessageDialog, defaultContainer;
        beforeAll(function () {
          defaultContainer = $.fn.binf_modal.getDefaultContainer();
          targetBrowse = $(defaultContainer).empty();
        });

        xit('visible on click of save as button [High]', function (done) {
          var saveAsIcon = nodesTableView.$el.find(
              '.binf-btn.binf-btn-primary.csui-filter-save').first();
          saveAsIcon.trigger('click');
          defaultContainer = $(defaultContainer).appendTo(document.body);
          testUtils.asyncElement(defaultContainer, '.target-browse.cs-dialog.binf-modal').done(
              function (el) {
                expect(el.length).toEqual(1);
                done();
              });
        });

        xit('save button of the target browse is disabled [Low]', function () {
          expect(targetBrowse.find('.binf-btn-primary:disabled').length).toEqual(1);
        });

        xit('enables save button of the target browse on entering value in the folder' +
           ' input field [Medium] ', function (done) {
          var saveAsVFolderInputField = targetBrowse.find(
              '.target-browse.cs-dialog.binf-modal .csui-filtername.csui-acc-focusable-active');
          expect(saveAsVFolderInputField.length).toEqual(1);
          saveAsVFolderInputField.val('TestVirtualFolder');
          saveAsVFolderInputField.trigger('keyup');
          testUtils.asyncElement(targetBrowse, '.cs-footer-control .csui-footer-buttons' +
                                               ' .binf-btn-primary:disabled',
              true).done(function (el) {
            expect(el.length).toEqual(0);
            saveAsVFolderInputField.submit();
            done();
          });
        });

        xit('disables save button on selecting virtual folder but is browsable[medium]',
            function (done) {
              var virtualFolder = targetBrowse.find(
                  '.target-browse.cs-dialog.binf-modal' +
                  ' .csui-icon.csui-icon-node-virtual-folder_nonselectable').first();
              virtualFolder.trigger('click');
              testUtils.asyncElement(targetBrowse, '.binf-btn-primary:disabled').done(function () {
                expect(targetBrowse.find('.binf-btn-primary:disabled').length).toEqual(1);
                expect(targetBrowse.find(
                    '.csui-panel.cs-pane-view.csui-slideMidLeft').length).toEqual(1);
                expect(targetBrowse.find(
                    '.csui-icon.csui-start-icon.icon-listview-checkmark').length).toEqual(0);
                done();
              });
            });
        xit('enables save button on selecting selectable items[medium]', function (done) {
          var selectableItem = targetBrowse.find('.target-browse.cs-dialog.binf-modal' +
                                                 ' .csui-icon.mime_folder').first();
          selectableItem.trigger('click');
          testUtils.asyncElement(targetBrowse, '.binf-btn-primary:disabled', true).done(
              function () {
                expect(targetBrowse.find('.binf-btn-primary:disabled').length).toEqual(0);
                expect(targetBrowse.find(
                    '.csui-icon.csui-start-icon.icon-listview-checkmark').length).toEqual(1);
                done();
              });
        });

        xit('creates a virtual folder successfully on click of save button [high]',
            function (done) {
              $($.fn.binf_modal.getDefaultContainer()).empty();
              targetBrowse.find('.cs-footer-control .csui-footer-buttons' +
                                ' .binf-btn.binf-btn-primary.csui-acc-tab-region').trigger(
                  'click');
              testUtils.asyncElement(document.body,
                  '.csui-messagepanel.csui-success-with-link.csui-global-message.position-show').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    done();
                  });
            });
        afterAll(function () {
          defaultContainer = $.fn.binf_modal.getDefaultContainer();
          targetBrowse = $(defaultContainer).empty();
          $($.fn.binf_modal.getDefaultContainer()).empty();
        });
      });

      afterAll(function () {
        nodesTableView.destroy();
        $('body').empty();
      });
    });
  });
});