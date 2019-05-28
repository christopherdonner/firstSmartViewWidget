/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/controls/toolbar/toolbar.view',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem/workitem.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.controller',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (_, Marionette, $, ToolbarView, BaseTestUtils,
    TabableTestView, WorkItemView, AttachmentExtensionController, WorkItemActivitiesController, attachmentsLang) {
  'use strict';

  describe('The WorkItemView', function () {

    var widget,
        cancelButton,
        sendOnButton,
        approveButton,
        rejectButton,
        tabable;

    beforeEach(function (done) {
      BaseTestUtils.workItemMock.enable();

      var context  = BaseTestUtils.getContext(),
          workItem = BaseTestUtils.getSimpleWorkItemModel(context, 1),
          options  = {model: workItem, context: context, viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]};

      workItem.fetch().then(function () {
        widget = new WorkItemView(options);
        tabable = new TabableTestView({
          view: widget
        });
        tabable.show();
        spyOn(ToolbarView.prototype, '_handleWindowResize').and.callFake(function () {

        });
        widget.model.trigger('change', widget.model);

        BaseTestUtils.waitUntil(function () {
          var toolbar = widget.$('.workitem-attachment-toolbar-add');
          if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties') && toolbar.length === 1) {
            sendOnButton = widget.$el.find(".binf-modal-footer .binf-btn")[0];
            approveButton = widget.$el.find(".binf-modal-footer .binf-btn")[1];
            rejectButton = widget.$el.find(".binf-modal-footer .binf-btn")[2];
            cancelButton = widget.$el.find(".binf-modal-footer .binf-btn")[3];

            return true;
          }

          return false;
        }, 5000).then(done);
      });
    });

    afterEach(function () {
      widget.destroy();
      tabable.destroy();
      $('body').empty();

      BaseTestUtils.workItemMock.disable();
    });

    it('shows title', function () {
      expect(widget.$el.find(
          ".workitem-header .tile-title > h2")[0].textContent).toBe("<Initiator>");
    });

    it('Send On', function () {
      expect(sendOnButton.textContent).toBe("Send On");
    });

    it('shows Approve button', function () {
      expect(approveButton.textContent).toBe("Approve");
    });

    it('opens acton.dialog with Approve Button', function (done) {
      expect(widget.$el.find('.workitem-header .tile-title').length === 1).toBeTruthy();
      approveButton.click();
      BaseTestUtils.waitUntil(function () {
        if (document.getElementsByClassName('tile-title binf-modal-title').item(0).textContent ===
            "Approve: <Initiator>") {
          return true;
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('Dialog was not opened in time');})
          .always(done);
      expect($('.workitem-view').length).toBeGreaterThan(0);

    }, 5000);

    it('shows Reject button', function () {
      expect(rejectButton.textContent).toBe("Reject");
    });

    it('shows cancel button', function () {
      expect(cancelButton.textContent).toBe("Close");
    });

    it('has key accessibility "Move down" for Attachments', function (done) {
      var selected,
          selectRendered = false;

      widget.$el.appendTo(document.body);

      var attachments = widget.$el.find('.workitem-attachments-name');
      var attachment = attachments[0];
      var e = $.Event("keydown");
      e.keyCode = 40;
      e.which = 40;
      $(attachment).trigger(e);

      BaseTestUtils.waitUntil(function () {
        if (($(attachment).filter('[tabindex=0]')).length === 0) {
          selectRendered = true
        }
        if (selectRendered) {
          selected = $(attachment).filter('[tabindex=0]');
          expect(selected.length).toEqual(0, 'for the first Attachment tabindex is not set to -1');
          selected = $(attachments[1]).filter('[tabindex=0]');
          expect(selected.length).toEqual(1, 'for the second Attachment tabindex is not set to 0');
          return true
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('tabindex was not moved in time');})
          .always(done);
    });

    it('has key accessibility "Move up" for Attachments', function (done) {
      var selected,
          selectRendered = false;

      var attachments = widget.$el.find('.workitem-attachments-name');
      var attachment = attachments[1];
      var e = $.Event("keydown");
      e.keyCode = 38;
      e.which = 38;
      $(attachment).trigger(e);

      BaseTestUtils.waitUntil(function () {
        if (($(attachment).filter('[tabindex=0]')).length === 0) {
          selectRendered = true
        }
        if (selectRendered) {
          selected = $(attachment).filter('[tabindex=0]');
          expect(selected.length).toEqual(0,
              'for the second Attachment the tabindex is not set to -1');
          selected = $(attachments[0]).filter('[tabindex=0]');
          expect(selected.length).toEqual(1, 'for the first Attachment tabindex is not set to 0');
          return true
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('tabindex was not moved in time');})
          .always(done);
    });

  });

  describe('The WorkItemView for Document initiation for single document and single workflow',
      function () {
        var widget,
            startButton,
            cancelButton,
            tabable,
            toolbar;

        beforeEach(function (done) {
          BaseTestUtils.workItemMock.enable();
          var context   = BaseTestUtils.getContext(),
              docIdList = {0: 301425},
              parentId  = 47111,
              workflow  = BaseTestUtils.getListOfWorkflowMapsAvailableForDocument(context,
                  docIdList,
                  parentId);
          workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                var workItem = BaseTestUtils.getSimpleWorkItemModelForDraftProcess(context,
                    resp.data[0].draftprocess_id);
                var options = {
                  model: workItem,
                  context: context,
                  viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]
                };
                workItem.fetch().then(function () {
                  var docModel = BaseTestUtils.getDocModel(context, docIdList[0]);
                  var docModels = [];
                  docModels.push(docModel);
                  workItem.set('isDoc', true);
                  workItem.set('docModel', docModel);
                  workItem.set('docModels', docModels);
                  workItem.set('mapsList', resp.data);
                  workItem.set('datafetched', true);
                  workItem.set('parent_id', parentId);
                  workItem.set('status', "");
                  workItem.set('draft_id', resp.data[0].draftprocess_id);
                  workItem.set('doc_id', docIdList[0]);
                  workItem.set('isDraft', true);

                  widget = new WorkItemView(options);
                  tabable = new TabableTestView({
                    view: widget
                  });
                  tabable.show();
                  widget.model.trigger('change', widget.model);
                });
              }, this))
              .fail(_.bind(function (error) {
              }, this));

          BaseTestUtils.waitUntil(function () {
            var elems = widget.$(':tabbable');
            toolbar = widget.$('.workitem-attachment-toolbar-add');

            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties') &&
                toolbar.length === 1) {
              startButton = widget.$el.find(".binf-modal-footer .binf-btn")[0];
              cancelButton = widget.$el.find(".binf-modal-footer .binf-btn")[1];
              return true;
            }
            return false;
          }, 5000).then(done);

        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it('shows start button', function () {
          expect(startButton.textContent).toBe("Start");
        });

        it('shows cancel button', function () {
          expect(cancelButton.textContent).toBe("Cancel");
        });

        it('shows title', function () {
          expect(widget.$el.find(
              ".workitem-header .tile-title > h2")[0].textContent).toBe("Smart ui");
        });

        it('the attachments item', function () {
          var item = widget.$el.find('.workitem-attachments-item');
          expect(item.length).toEqual(1);
        });

        it('the attachment name', function () {
          var item = widget.$el.find('.workitem-attachment-name');
          expect(item[0].textContent).toBe("test.jpg");
        });

        it('the attachments toolbar', function () {
          expect(toolbar.length).toEqual(1);
          var addButton = $(toolbar).find('.icon-toolbarAdd');
          expect(addButton.length).toEqual(1);

          var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
          expect(toolbarMenu.length).toEqual(3);
          expect($(toolbar).find(
              'li .csui-toolitem:contains(' + attachmentsLang.AddFromDesktopLabel + ')').length).toEqual(1);
          expect(
              $(toolbar).find(
                  'li .csui-toolitem:contains(' + attachmentsLang.AddFromContentServerLabel +
                  ')').length).toEqual(
              1);
          expect($(toolbar).find(
              'li .csui-toolitem:contains(' + attachmentsLang.AddShortcutLabel + ')').length).toEqual(1);
        });
      });

  describe('The WorkItemView for Document initiation for multiple document and single workflow',
      function () {
        var widget,
            startButton,
            cancelButton,
            tabable,
            toolbar;

        beforeEach(function (done) {
          BaseTestUtils.workItemMock.enable();
          var context   = BaseTestUtils.getContext(),
              docIdList = {0: 4194, 1: 2984},
              parentId  = 23451,
              workflow  = BaseTestUtils.getListOfWorkflowMapsAvailableForDocument(context,
                  docIdList,
                  parentId);
          workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                var draftId = resp.data[0].draftprocess_id + 1;
                var workItem = BaseTestUtils.getSimpleWorkItemModelForDraftProcess(context,
                    draftId);
                var options = {
                  model: workItem,
                  context: context,
                  viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]
                };
                workItem.fetch().then(function () {
                  var docModel = BaseTestUtils.getDocModel(context, docIdList[0]);
                  var docModels = [];
                  docModels.push(docModel);
                  workItem.set('isDoc', true);
                  workItem.set('docModel', docModel);
                  workItem.set('docModels', docModels);
                  workItem.set('mapsList', resp.data);
                  workItem.set('datafetched', true);
                  workItem.set('parent_id', parentId);
                  workItem.set('status', "");
                  workItem.set('draft_id', draftId);
                  workItem.set('doc_id', docIdList[0]);
                  workItem.set('isDraft', true);

                  widget = new WorkItemView(options);
                  tabable = new TabableTestView({
                    view: widget
                  });
                  tabable.show();
                  widget.model.trigger('change', widget.model);
                });
              }, this))
              .fail(_.bind(function (error) {
              }, this));

          BaseTestUtils.waitUntil(function () {
            var elems = widget.$(':tabbable');
            toolbar = widget.$('.workitem-attachment-toolbar-add');

            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties') &&
                toolbar.length === 1) {
              startButton = widget.$el.find(".binf-modal-footer .binf-btn")[0];
              cancelButton = widget.$el.find(".binf-modal-footer .binf-btn")[1];
              return true;
            }
            return false;
          }, 5000).then(done);

        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it('shows start button', function () {
          expect(startButton.textContent).toBe("Start");
        });

        it('shows cancel button', function () {
          expect(cancelButton.textContent).toBe("Cancel");
        });

        it('shows title', function () {
          expect(widget.$el.find(
              ".workitem-header .tile-title > h2")[0].textContent).toBe("Smart ui");
        });

        it('the attachments item', function () {
          var item = widget.$el.find('.workitem-attachments-item');
          expect(item.length).toEqual(2);
        });

        it('the attachment name', function () {
          var item = widget.$el.find('.workitem-attachment-name');
          expect(item[0].textContent).toBe("Desert.jpg");
          expect(item[1].textContent).toBe("Hydrangeas.jpg");
        });

        it('the attachments toolbar', function () {
          expect(toolbar.length).toEqual(1);
          var addButton = $(toolbar).find('.icon-toolbarAdd');
          expect(addButton.length).toEqual(1);

          var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
          expect(toolbarMenu.length).toEqual(3);
          expect($(toolbar).find(
              'li .csui-toolitem:contains(' + attachmentsLang.AddFromDesktopLabel + ')').length).toEqual(1);
          expect(
              $(toolbar).find(
                  'li .csui-toolitem:contains(' + attachmentsLang.AddFromContentServerLabel +
                  ')').length).toEqual(
              1);
          expect($(toolbar).find(
              'li .csui-toolitem:contains(' + attachmentsLang.AddShortcutLabel + ')').length).toEqual(1);
        });
      });

  describe('The WorkItemView for initiating a single document and multiple workflow',
      function () {
        var widget,
            startButton,
            cancelButton,
            tabable,
            toolbar;

        beforeEach(function (done) {
          BaseTestUtils.workItemMock.enable();
          var context   = BaseTestUtils.getContext(),
              docIdList = {0: 38187},
              parentId  = 47888,
              workflow  = BaseTestUtils.getListOfWorkflowMapsAvailableForDocument(context,
                  docIdList,
                  parentId);
          workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                var workItem = BaseTestUtils.getSimpleWorkItemModelForDraftProcess(context,
                    resp.data[0].draftprocess_id);
                var options = {
                  model: workItem,
                  context: context,
                  viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]
                };
                workItem.fetch().then(function () {
                  var docModels          = [],
                      getDelimitedDocIds = function (docIdList) {
                        var delimitedDocIds = '', delim = '';
                        _.each(docIdList, function (docId) {
                          delimitedDocIds = delimitedDocIds.concat(delim).concat(docId);
                          delim = ",";
                        });
                        return delimitedDocIds;
                      };

                  _.each(docIdList, function (docId) {
                    var docModel = BaseTestUtils.getDocModel(context, docId);
                    docModels.push(docModel);
                  });

                  workItem.set('isDoc', true);
                  workItem.set('docModels', docModels);
                  workItem.set('mapsList', resp.data);
                  workItem.set('datafetched', true);
                  workItem.set('parent_id', parentId);
                  workItem.set('status', "");
                  workItem.set('draft_id', resp.data[0].draftprocess_id);
                  workItem.set('doc_id', docIdList[0]);
                  workItem.set('isDraft', true);
                  widget = new WorkItemView(options);
                  tabable = new TabableTestView({
                    view: widget
                  });
                  tabable.show();
                });
              }, this))
              .fail(_.bind(function (error) {
              }, this));

          BaseTestUtils.waitUntil(function () {
            var elems = widget.$(':tabbable');
            toolbar = widget.$('.workitem-attachment-toolbar-add');

            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties') &&
                elems.length === 3 && toolbar.length === 0) {
              startButton = widget.$el.find(".binf-modal-footer .binf-btn")[0];
              cancelButton = widget.$el.find(".binf-modal-footer .binf-btn")[1];
              var e = $.Event("click");
              e.keyCode = 27;
              e.target = {};
              e.target = widget.$el.find(".cs-menu-option")[1];
              widget.headerView.mapSelected(e);
              return true;
            }
            return false;
          }, 5000).then(done);

        });

        afterEach(function () {
          widget.destroy();
          $('body').empty();
          BaseTestUtils.workItemMock.disable();
        });

        it('shows start button', function () {
          expect(startButton.textContent).toBe("Start");
        });

        it('shows cancel button', function () {
          expect(cancelButton.textContent).toBe("Cancel");
        });

        it('the attachments item', function () {
          var item = widget.$el.find('.workitem-attachments-item');
          expect(item.length).toEqual(1);
        });

        it('the attachment name', function () {
          var item = widget.$el.find('.workitem-attachment-name');
          expect(item[0].textContent).toBe("test.jpg");
        });

        it('the attachments toolbar', function () {
          expect(toolbar.length).toEqual(0);
        });

        it('show dropdown', function () {

          var dropdown = widget.$el.find("#select-workflow-type");
          expect(dropdown.length).toEqual(1);
        });
        it('show dropdown list', function () {

          var dropdownlist = widget.$el.find(".cs-menu-option");
          expect(dropdownlist.length).toEqual(2);
        });

        it('check message', function () {
          var msg = widget.$el.find(".workitem-multimap-select-message")[0];
          expect(msg.textContent).toBe(
              "Select the workflow you want to initiate from the drop-down" +
              " list");
        });

      });
});
