/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette", "csui/lib/backbone",
  "csui/widgets/permissions/permissions.view", "csui/utils/contexts/page/page.context",
  "csui/utils/contexts/factories/node", 'csui/utils/contexts/factories/usernodepermission',
  "./permissions.mock.data.js", 'csui/models/action', 'csui/models/actions',
  "../../../utils/testutils/async.test.utils.js",
  "csui/lib/jquery.mousehover"
], function ($, _, Marionette, Backbone, PermissionsView, PageContext, NodeModelFactory,
    AuthenticatedUserNodePermissionFactory, PermissionsMock, ActionModel, ActionCollection,
    AsyncUtils) {
  describe("Permissions View", function () {
    var context,
        ownerTitle                 = "Owner access",
        ownerName                  = "Admin",
        permissionLevelFullControl = "Full control",
        permissionLevelRead        = "Read",
        groupOwnerTitle            = "Group owner access",
        groupOwnerName             = "DefaultGroup",
        publicAccessName           = "Public Access",
        addOwnerOrOwnerGroup       = "Add owner or owner group",
        noOwnerAssignedValue       = "No owner assigned",
        addMajorVersion            = "Add major version",
        userNodePermissionsModel;

    beforeAll(function () {
      PermissionsMock.enable();
      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
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
      PermissionsMock.disable();
    });
    describe("For user with edit permission rights", function () {
      var userWithEditPermissionRights;
      beforeAll(function () {
        userWithEditPermissionRights = 1000;
        userNodePermissionsModel = context.getModel(AuthenticatedUserNodePermissionFactory);
        userNodePermissionsModel.options.user.set("id", userWithEditPermissionRights);
      });

      describe("View having Owner,Group Owner and Public access", function () {
        var v1, node1, region1, permissionTableBody, permissionTableRows, ownerRow, userGroup;
        beforeAll(function (done) {
          node1 = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
          node1.setExpand('permissions', '11111');
          var actionModel = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node1.actions = new ActionCollection([actionModel]);
          userNodePermissionsModel.node = node1;

          userNodePermissionsModel.fetch().always(function () {
            v1 = new PermissionsView({
              context: context,
              model: node1,
              authenticatedUserPermissions: userNodePermissionsModel
            });
            region1 = new Marionette.Region({
              el: $('<div id="permissions-view1"></div>').appendTo(document.body)
            });
            region1.show(v1);
            AsyncUtils.asyncElement(v1.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v1.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });

        });

        afterAll(function () {
          node1.destroy();
          v1.destroy();
          $('#permissions-view1').remove();
        });

        it("view can be instantiated", function () {
          expect(v1).toBeDefined();
          expect(v1.$el.length > 0).toBeTruthy();
          expect(v1.el.childNodes.length > 0).toBeTruthy();
          expect(v1.$el.attr('class')).toContain('cs-permissions');
        });

        it("contains Owner as first entry", function () {
          expect(permissionTableBody.length).toEqual(1);
          expect(permissionTableRows.length).toBeGreaterThan(0);
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Group Owner as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as third entry after Owner and Group Owner respectively",
            function () {
              ownerRow = permissionTableRows.eq(2);
              var publicAccessClass = ownerRow.find(".icon_permmision_public");
              expect(publicAccessClass.length).toEqual(1);
              var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
              expect(publicAccessDisplayName).toEqual(publicAccessName);
              var permissionLevelClass = ownerRow.find(".csui-permission-level");
              expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
            });

        describe("Change Owner permission", function () {
          var tableRows, inlineAction, i;
          beforeAll(function () {
            tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
          });
          for (i = 0; i < 2; i++) {
            it("should show change owner action on hovering over the owner item", function (done) {
              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
              AsyncUtils.asyncElement(v1.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = tableRows.eq(0).find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(el.length).toEqual(1);
                    var changeOwnerAction = el.find(
                        "li[data-csui-command='changeownerpermission']");
                    expect(changeOwnerAction.length).toEqual(1);
                    done();
                  });
            });

            it("should open change owner lookup on click of change owner permission ",
                function (done) {
                  var changeOwnerAction = inlineAction.find(
                      "li[data-csui-command='changeownerpermission'] span");
                  changeOwnerAction.trigger("click");
                  AsyncUtils.asyncElement(v1.$el,
                      '.csui-inline-owner-change .csui-control-userpicker').done(
                      function (el) {
                        var changeOwnerLookup = el.find(".typeahead[type='text']"),
                            saveButton        = v1.$el.find(
                                ".csui-inline-owner-change .cs-save-button[disabled]"),
                            cancelButton      = v1.$el.find(
                                ".csui-inline-owner-change .cs-cancel-button");
                        expect(changeOwnerLookup.length).toEqual(1);
                        expect(saveButton.length).toEqual(1);
                        expect(cancelButton.length).toEqual(1);
                        done();
                      });
                });
            describe("Change Owner Permission Lookup", function () {
              var changeOwnerLookUp, cancelButton, ownerRow;

              beforeAll(function () {
                changeOwnerLookUp = tableRows.eq(0).find(
                    ".csui-control-userpicker .typeahead[type='text']");
                cancelButton = tableRows.eq(0).find(".csui-inline-owner-change .cs-cancel-button");
                ownerRow = tableRows.eq(0);
              });

              it("should show save button as disabled if no text in lookup", function () {
                var saveButton = tableRows.eq(0).find(
                    '.csui-inline-owner-change .cs-save-button[disabled]');
                expect(changeOwnerLookUp.val()).toEqual('');
                expect(saveButton.length).toEqual(1);
              });

              if (i == 0) {
                it("should show clear icon if text in lookup", function (done) {
                  changeOwnerLookUp.val('u');
                  changeOwnerLookUp.trigger('keyup');
                  AsyncUtils.asyncElement(ownerRow, '.cs-search-clear.csui-icon').done(
                      function () {
                        var clearIcon = ownerRow.find('.cs-search-clear.csui-icon'),
                            saveButton;
                        expect(clearIcon.length).toEqual(1);
                        clearIcon.trigger('click');
                        expect(changeOwnerLookUp.val()).toEqual('');
                        saveButton = ownerRow.find(
                            '.csui-inline-owner-change .cs-save-button[disabled]');
                        expect(saveButton.length).toEqual(1);
                        done();
                      });
                });

                it("should display previous owner on clicking cancel", function (done) {
                  cancelButton.trigger('click');
                  AsyncUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-cancel-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change  .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = ownerRow.find(".csui-user-display-name");
                        expect(ownerName[0].innerHTML).toEqual("Admin");
                        done();
                      });
                });

              }
              else {
                it("should enable save button if the user is selected from dropdown",
                    function (done) {
                      changeOwnerLookUp.val('u');
                      changeOwnerLookUp.trigger('keyup');
                      AsyncUtils.asyncElement(ownerRow,
                          'ul.typeahead.binf-dropdown-menu').done(
                          function (el) {
                            var user = el.find('li .name[title="user"]'),
                                saveButton;
                            expect(user.length).toEqual(1);
                            user.trigger('mouseenter').trigger('click');
                            saveButton = v1.$el.find(
                                '.csui-inline-owner-change .cs-save-button:not([disabled])');
                            expect(saveButton.length).toEqual(1);
                            done();
                          });

                    });
                it("should change owner on clicking save", function (done) {
                  var saveButton = v1.$el.find(
                      '.csui-inline-owner-change .cs-save-button:not([disabled])');
                  saveButton.trigger('click');
                  AsyncUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-save-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = v1.$el.find(".csui-user-display-name").first();
                        expect(ownerName[0].innerHTML).toEqual("user");
                        done();
                      });
                });
              }
            });

          }

        });

        describe("Change Owner Group permission", function () {
          var tableRow, inlineAction, i;
          beforeAll(function () {
            tableRow = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
          });
          for (i = 0; i < 2; i++) {
            it("should show change owner group action on hovering over the owner group item",
                function (done) {
                  tableRow.eq(1).trigger(
                      {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
                  AsyncUtils.asyncElement(v1.$el,
                      ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                      function (el) {
                        inlineAction = tableRow.eq(1).find(
                            ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                        expect(el.length).toEqual(1);
                        var changeOwnerAction = el.find(
                            "li[data-csui-command='changeownerpermission']");
                        expect(changeOwnerAction.length).toEqual(1);
                        done();
                      });
                });

            it("should open change owner group lookup on click of change owner group permission ",
                function (done) {
                  var changeOwnerAction = inlineAction.find(
                      "li[data-csui-command='changeownerpermission'] span");
                  changeOwnerAction.trigger("click");
                  AsyncUtils.asyncElement(v1.$el,
                      '.csui-inline-owner-change #csui-inline-permissions-user-picker').done(
                      function (el) {
                        var changeOwnerLookup = el.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = v1.$el.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = v1.$el.find(
                                ".csui-inline-owner-change .cs-cancel-button");
                        expect(changeOwnerLookup.length).toEqual(1);
                        expect(saveButton.length).toEqual(1);
                        expect(cancelButton.length).toEqual(1);
                        done();
                      });
                });
            describe("Change Owner group Permission Lookup", function () {
              var changeOwnerLookUp, cancelButton, ownerRow;

              beforeAll(function () {
                changeOwnerLookUp = tableRow.find(
                    ".csui-control-userpicker .typeahead[type='text']");
                cancelButton = tableRow.find(".csui-inline-owner-change .cs-cancel-button");
                ownerRow = tableRow.eq(1);
              });

              it("should show save button as disabled if no text in lookup", function () {
                var saveButton = tableRow.find(
                    '.csui-inline-owner-change .cs-save-button[disabled]');
                expect(changeOwnerLookUp.val()).toEqual("");
                expect(saveButton.length).toEqual(1);
              });

              if (i == 0) {
                it("should show clear icon if text in lookup", function (done) {
                  changeOwnerLookUp.val('b');
                  changeOwnerLookUp.trigger('keyup');
                  AsyncUtils.asyncElement(ownerRow, '.cs-search-clear.csui-icon').done(
                      function () {
                        var clearIcon = ownerRow.find('.cs-search-clear.csui-icon'),
                            saveButton;
                        expect(clearIcon.length).toEqual(1);
                        clearIcon.trigger('click');
                        expect(changeOwnerLookUp.val()).toEqual('');
                        saveButton = ownerRow.find(
                            '.csui-inline-owner-change .cs-save-button[disabled]');
                        expect(saveButton.length).toEqual(1);
                        done();
                      });
                });

                it("should display previous owner on clicking cancel", function (done) {
                  cancelButton.trigger('click');
                  AsyncUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-cancel-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = ownerRow.find(".csui-user-display-name");
                        expect(ownerName[0].innerHTML).toEqual("DefaultGroup");
                        done();
                      });
                });

              }
              else {
                it("should enable save button if the owner group is selected from dropdown",
                    function (done) {
                      changeOwnerLookUp.val('b').trigger('keyup');
                      AsyncUtils.asyncElement(ownerRow,
                          'ul.typeahead.binf-dropdown-menu').done(
                          function (el) {
                            var user = el.find('li .name[title="Business Attributes"]'),
                                saveButton;
                            expect(user.length).toEqual(1);
                            user.trigger('mouseenter').trigger('click');
                            saveButton = v1.$el.find(
                                '.csui-inline-owner-change .cs-save-button:not([disabled])');
                            expect(saveButton.length).toEqual(1);
                            done();
                          });

                    });
                it("should change owner group on clicking save", function (done) {
                  var saveButton = v1.$el.find(
                      '.csui-inline-owner-change .cs-save-button:not([disabled])');
                  saveButton.trigger('click');
                  AsyncUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-save-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = v1.$el.find(".csui-user-display-name").first();
                        expect(ownerName[0].innerHTML).toEqual("user");
                        done();
                      });
                });
              }
            });

          }

        });

        describe("View Permission Lookup", function () {
          it("on focus permission lookup is the active element", function (done) {

            AsyncUtils.asyncElement(v1.$el, '.typeahead.cs-search').done(
                function () {
                  var permissionLookupSearchField =
                          $('#csui-permissions-user-picker input.cs-search');
                  permissionLookupSearchField.trigger('focus');
                  expect(permissionLookupSearchField[0] === document.activeElement).toBeTruthy();
                  done();
                });
          });

          it("on keypress dropdown open", function (done) {
            var permissionLookupSearchField = $('#csui-permissions-user-picker').find(
                'input.cs-search');
            permissionLookupSearchField.val('a');
            permissionLookupSearchField.trigger('keyup');
            AsyncUtils.asyncElement(v1.$el, 'ul.typeahead.binf-dropdown-menu').done(
                function () {
                  expect($('ul.typeahead.binf-dropdown-menu').length).toEqual(1);
                  done();
                });
          });

          it("Clearing the value when clicking on  search clear icon", function (done) {

            var permissionLKClearButton     = $('#csui-permissions-user-picker' +
                                                ' div.typeahead.cs-search-clear.csui-icon.formfield_clear'),
                permissionLookupSearchField = $('#csui-permissions-user-picker input.cs-search');
            permissionLKClearButton.trigger('click');
            AsyncUtils.asyncElement(v1.$el,
                'div.typeahead.cs-search-clear[style*="none"]').done(
                function () {
                  expect(permissionLookupSearchField.val('')).toBeTruthy();
                  done();
                });

          });

        });

        xdescribe("User group dialog", function () {
          it("should open user group dialog on clicking on any user group", function (done) {
            userGroup = v1.$('.csui-table-row:nth-child(5) .csui-user-display-name');
            expect(userGroup.length).toEqual(1);
            userGroup.trigger('click');
            AsyncUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
                '.binf-modal-content:visible').done(function (el) {
              expect(el.length).toEqual(1);
              done();
            });
          });

          it("should contain users matching the same count of the users ", function () {
            expect(
                $($.fn.binf_modal.getDefaultContainer()).find(
                    '.binf-list-group > a').length).toEqual(2);
          });

          it("should close the user group dialog", function (done) {
            $($.fn.binf_modal.getDefaultContainer()).find('.binf-modal-footer button').trigger(
                'click');
            AsyncUtils.asyncElement($.fn.binf_modal.getDefaultContainer(), '.binf-modal-content',
                true).done(function (el) {
              expect(el.length).toEqual(0);
              done();
            });
          });
        });

        xdescribe("Remove/Delete/Restore permission", function () {
          var tableRows, inlineAction, i;
          for (i = 0; i < 2; i++) {
            it("should show remove action on hovering over the list item", function (done) {
              tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
              AsyncUtils.asyncElement(v1.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = tableRows.eq(2).find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(el.length).toEqual(1);
                    var deleteAction = el.find("li[data-csui-command='deletepermission']");
                    expect(deleteAction.length).toEqual(1);
                    done();
                  });
            });

            it("should open dialog for confirmation on click of remove permission ",
                function (done) {
                  var deleteAction = inlineAction.find(
                      "li[data-csui-command='deletepermission'] span");
                  deleteAction.trigger("click");
                  AsyncUtils.asyncElement($('body'), '.csui-alert .question-header').done(
                      function () {
                        var confirmationDialog = $(".csui-alert .question-header");
                        expect(confirmationDialog.length).toEqual(1);
                        done();
                      });

                });

            if (i === 0) {
              it("should not delete the user on clicking 'no'", function (done) {
                var noButton = $(".csui-alert .binf-modal-footer button[title='No']");
                noButton.trigger('click');
                AsyncUtils.asyncElement($('body'), '.csui-alert .question-header', true).done(
                    function () {
                      expect(tableRows.length).toEqual(7);
                      done();
                    });
              });

            }
            else {
              it("should delete the user on clicking 'yes'", function (done) {
                var yesButton = $(".csui-alert .binf-modal-footer button[title='Yes']");
                var deletedUser = tableRows.find(
                    '.csui-table-cell .csui-profileimg span.icon_permmision_public');
                expect(deletedUser.length).toEqual(1);
                yesButton.trigger('click');
                AsyncUtils.asyncElement($('body'),
                    '.csui-table-cell .member-info span.icon_permmision_public', true).done(
                    function () {
                      tableRows = v1.$el.find(".csui-table-list-body .csui-table-body" +
                                              " .csui-table-row");
                      expect(tableRows.length).toEqual(7);
                      deletedUser = $('.csui-table-cell .member-info span.icon_permmision_public');
                      expect(deletedUser.length).toEqual(0);
                      done();
                    });
              });
              it("should restore the public access permissions on clicking restore public" +
                 " access action from dropdown", function (done) {
                var addPermissionIcon = $(
                    '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission'),
                    restorePublicAccessAction, restoredPermission;
                expect(addPermissionIcon.length).toEqual(1);
                addPermissionIcon.trigger('click');

                AsyncUtils.asyncElement($('body'),
                    '.permissions-content-header .csui-table-header-cell .csui-add-permission + .binf-dropdown-menu',
                    true).done(
                    function () {
                      restorePublicAccessAction = v1.$el.find(".permissions-content-header" +
                                                              " .csui-table-header-cell" +
                                                              " .binf-dropdown-menu" +
                                                              " li[data-csui-command='restorepublicaccess']");
                      restorePublicAccessAction.trigger('click');
                      AsyncUtils.asyncElement($('body'),
                          '.csui-table-cell .csui-profileimg span.icon_permmision_public',
                          true).done(
                          function (el) {
                            restoredPermission = $('.csui-table-cell .member-info' +
                                                   ' span.icon_permmision_public');
                            expect(restoredPermission.length).toEqual(1);
                            done();
                          });
                      done();
                    });
              });
            }
          }
        });

      });

      describe("View having only Group Owner and Public access", function () {
        var v2, node2, region2, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node2 = context.getModel(NodeModelFactory, {attributes: {id: 22222}});
          node2.setExpand('permissions', '22222');

          var actionModel2 = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node2.actions = new ActionCollection([actionModel2]);
          userNodePermissionsModel.node = node2;
          userNodePermissionsModel.fetch().always(function () {
            v2 = new PermissionsView({
              context: context,
              model: node2,
              authenticatedUserPermissions: userNodePermissionsModel
            });
            region2 = new Marionette.Region({
              el: $('<div id="permissions-view2"></div>').appendTo(document.body)
            });
            region2.show(v2);
            AsyncUtils.asyncElement(v2.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v2.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });
        });

        afterAll(function () {
          v2.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v2).toBeDefined();
          expect(v2.$el.length > 0).toBeTruthy();
          expect(v2.el.childNodes.length > 0).toBeTruthy();
          expect(v2.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("contains Group Owner as first entry when there is no Owner", function () {
          ownerRow = permissionTableRows.eq(0);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as second entry after Group Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        xit("should show add owner in add permissions dropdown", function (done) {
          var addIcon = v2.$el.find(
              '.binf-dropdown-toggle.csui-permission-toolbar .csui-add-permission');
          expect(addIcon.length).toEqual(1);
          addIcon.trigger('click');
          AsyncUtils.asyncElement(v2.$el,
              'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.find('a').text()).toEqual("Add owner");
            done();
          });
        });

        xit("should open member picker on clicking 'add owner or owner group' in add permissions" +
            " dropdown",
            function (done) {
              var AddOwnerOrGroupCommand = v2.$el.find('li[data-csui-command="addownerorgroup"] a');
              expect(AddOwnerOrGroupCommand.length).toEqual(1);
              AddOwnerOrGroupCommand.trigger('click');
              AsyncUtils.asyncElement($('body'),
                  '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item:visible').done(
                  function (el) {
                    expect(el.length).toBeGreaterThan(0);
                    done();
                  });
            });

        xit("should add owner on selection", function (done) {
          var row = $(
              'body .target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Admin"]');
          expect(row.length).toEqual(1);
          row.trigger('click');
          var addButton = $('body .binf-modal-footer .binf-btn-primary');
          expect(addButton.length).toEqual(1);
          expect(addButton.text()).toEqual("Add");
          addButton.trigger('click');
          AsyncUtils.asyncElement(v2.$el,
              '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner').done(function () {
            var ownerName = $('.csui-table-row .csui-table-cell .csui-user-display-name').first();
            expect(ownerName.text()).toEqual("Admin");
            done();
          });
        });
      });

      describe("View having only Owner and Public access", function () {
        var v4, node4, region4, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node4 = context.getModel(NodeModelFactory, {attributes: {id: 55555}});
          node4.setExpand('permissions', '55555');

          var actionModel4 = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node4.actions = new ActionCollection([actionModel4]);
          userNodePermissionsModel.node = node4;
          userNodePermissionsModel.fetch().always(function () {
            v4 = new PermissionsView({
              context: context,
              model: node4,
              authenticatedUserPermissions: userNodePermissionsModel
            });
            region4 = new Marionette.Region({
              el: $('<div id="permissions-view2"></div>').appendTo(document.body)
            });
            region4.show(v4);
            AsyncUtils.asyncElement(v4.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v4.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });
        });

        afterAll(function () {
          v4.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v4).toBeDefined();
          expect(v4.$el.length > 0).toBeTruthy();
          expect(v4.el.childNodes.length > 0).toBeTruthy();
          expect(v4.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("contains Owner as first entry", function () {
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Public access as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        xit("should show add owner group in add permissions dropdown", function (done) {
          var addIcon = v4.$el.find(
              '.binf-dropdown-toggle.csui-permission-toolbar .csui-add-permission');//.binf-dropdown-toggle.csui-permission-toolbar
          expect(addIcon.length).toEqual(1);
          addIcon.trigger('click');
          AsyncUtils.asyncElement(v4.$el,
              'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.find('a').text()).toEqual("Add owner group");
            done();
          });
        });

        xit("should open member picker on clicking 'add owner or owner group' in add permissions" +
            " dropdown",
            function (done) {
              var AddOwnerOrGroupCommand = v4.$el.find('li[data-csui-command="addownerorgroup"] a');
              expect(AddOwnerOrGroupCommand.length).toEqual(1);
              AddOwnerOrGroupCommand.trigger('click');
              AsyncUtils.asyncElement($('body'),
                  '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item:visible').done(
                  function (el) {
                    expect(el.length).toBeGreaterThan(0);
                    done();
                  });
            });

        xit("should add owner group on selection", function (done) {
          var row = $(
              'body .target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Recommender"]');
          expect(row.length).toEqual(1);
          row.trigger('click');
          var addButton = $('body .binf-modal-footer .binf-btn-primary');
          expect(addButton.length).toEqual(1);
          expect(addButton.text()).toEqual("Add");
          addButton.trigger('click');
          AsyncUtils.asyncElement(v4.$el,
              '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner_group').done(
              function () {
                var ownerName = $('.csui-table-row .csui-table-cell .csui-user-display-name').eq(1);
                expect(ownerName.text()).toEqual("Recommender");
                done();
              });
        });
      });

      describe("View having only Public access", function () {
        var v3, node3, region3, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node3 = context.getModel(NodeModelFactory, {attributes: {id: 33333}});
          node3.setExpand('permissions', '33333');
          var actionModel3 = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node3.actions = new ActionCollection([actionModel3]);
          userNodePermissionsModel.node = node3;
          userNodePermissionsModel.fetch().always(function () {
            v3 = new PermissionsView({
              context: context,
              model: node3,
              authenticatedUserPermissions: userNodePermissionsModel
            });
            region3 = new Marionette.Region({
              el: $('<div id="permissions-view3"></div>').appendTo(document.body)
            });
            region3.show(v3);
            AsyncUtils.asyncElement(v3.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v3.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });
        });

        afterAll(function () {
          v3.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v3).toBeDefined();
          expect(v3.$el.length > 0).toBeTruthy();
          expect(v3.el.childNodes.length > 0).toBeTruthy();
          expect(v3.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("contains Add owner or owner group as first entry when there is no Owner and Group" +
           " Owner",
            function () {
              expect(permissionTableBody.length).toEqual(1);
              expect(permissionTableRows.length).toBeGreaterThan(0);
              ownerRow = permissionTableRows.eq(0);
              var noOwnerAssignedClass = ownerRow.find(".csui-user-display-name");
              expect(noOwnerAssignedClass.text()).toEqual(addOwnerOrOwnerGroup);
            });

        it("contains Public access as second entry after Group Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("should show edit icon hovering on user name", function (done) {
          ownerRow = permissionTableRows.eq(0);
          var noOwnerAssignedClass = ownerRow.find(".csui-user-display-name");
          noOwnerAssignedClass.trigger('mouseover');
          AsyncUtils.asyncElement(v3.$el,
              '.csui-add-owner-or-group .icon-edit:visible').done(function (el) {
            expect(el.length).toEqual(1);
            done();
          });
        });

        xit("should open member picker on clicking edit icon", function (done) {
          var editIcon = v3.$el.find('.csui-add-owner-or-group .icon-edit:visible');
          editIcon.trigger('click');
          AsyncUtils.asyncElement($('body'),
              '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item').done(
              function () {
                var cancelButton = $('body .binf-modal-footer .binf-btn-default');
                expect(cancelButton.length).toEqual(1);
                expect(cancelButton.text()).toEqual("Cancel");
                cancelButton.trigger('click');
                done();
              });
        });

        xit("should show add owner or owner group in add permissions dropdown", function (done) {
          var addIcon = v3.$el.find(
              '.csui-table-header-toolbar .csui-add-permission');//.binf-dropdown-toggle.csui-permission-toolbar
          expect(addIcon.length).toEqual(1);
          addIcon.trigger('click');
          AsyncUtils.asyncElement(v3.$el,
              'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.find('a').text()).toEqual("Add owner or owner group");
            done();
          });
        });

        xit("should open member picker on clicking 'add owner or owner group' in add permissions" +
            " dropdown",
            function (done) {
              var AddOwnerOrGroupCommand = v3.$el.find('li[data-csui-command="addownerorgroup"] a');
              expect(AddOwnerOrGroupCommand.length).toEqual(1);
              AddOwnerOrGroupCommand.trigger('click');
              AsyncUtils.asyncElement($('body'),
                  '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item:visible').done(
                  function (el) {
                    expect(el.length).toBeGreaterThan(0);
                    done();
                  });
            });

        xit("should add owner or owner group on selection", function (done) {
          var row = $(
              'body .target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Admin"]');
          expect(row.length).toEqual(1);
          row.trigger('click');
          var addButton = $('body .binf-modal-footer .binf-btn-primary');
          expect(addButton.length).toEqual(1);
          expect(addButton.text()).toEqual("Next");
          addButton.trigger('click');
          var permissionLevel = $(
              "body .cs-permission-group-picker .binf-modal-content .binf-modal-footer" +
              " .cs-add-button");
          permissionLevel.trigger('click');
          var applyPermissions = $("body .csui-permissions-apply-dialog .binf-modal-content" +
                                   " .binf-modal-footer" +
                                   " .cs-add-button.csui-acc-focusable-active");
          applyPermissions.trigger('click');
          AsyncUtils.asyncElement(v3.$el,
              '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner').done(function () {
            var ownerName = $('.csui-table-row .csui-table-cell .csui-user-display-name').first();
            expect(ownerName.text()).toEqual("Admin");
            done();
          });
        });
      });
    });

    describe("For user without edit permission rights", function () {
      var userWithoutEditPermissionRights, userNodePermissionsModel;
      beforeAll(function () {
        userWithoutEditPermissionRights = 1500;
        userNodePermissionsModel = context.getModel(AuthenticatedUserNodePermissionFactory);
        userNodePermissionsModel.options.user.set("id", userWithoutEditPermissionRights);
      });

      describe("View having Owner,Group Owner and Public access", function () {
        var v1, node1, region1, permissionTableBody, permissionTableRows, ownerRow, userGroup;
        beforeAll(function (done) {
          node1 = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
          node1.setExpand('permissions', '11111');
          var actionModel = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node1.actions = new ActionCollection([actionModel]);
          userNodePermissionsModel.node = node1;

          userNodePermissionsModel.fetch().always(function () {
            v1 = new PermissionsView({
              context: context,
              model: node1,
              authenticatedUserPermissions: userNodePermissionsModel
            });
            region1 = new Marionette.Region({
              el: $('<div id="readonly-permissions-view1"></div>').appendTo(document.body)
            });
            region1.show(v1);
            AsyncUtils.asyncElement(v1.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v1.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });

        });

        afterAll(function () {
          node1.destroy();
          v1.destroy();
          $('#readonly-permissions-view1').remove();
        });

        it("view can be instantiated", function () {
          expect(v1).toBeDefined();
          expect(v1.$el.length > 0).toBeTruthy();
          expect(v1.el.childNodes.length > 0).toBeTruthy();
          expect(v1.$el.attr('class')).toContain('cs-permissions');
        });

        it("contains Owner as first entry", function () {
          expect(permissionTableBody.length).toEqual(1);
          expect(permissionTableRows.length).toBeGreaterThan(0);
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Group Owner as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as third entry after Owner and Group Owner respectively",
            function () {

              ownerRow = permissionTableRows.eq(2);
              var publicAccessClass = ownerRow.find(".icon_permmision_public");
              expect(publicAccessClass.length).toEqual(1);
              var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
              expect(publicAccessDisplayName).toEqual(publicAccessName);
              var permissionLevelClass = ownerRow.find(".csui-permission-level");
              expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
            });

        it("should not show Inline permission actions on hovering over the list item",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
              AsyncUtils.asyncElement(v1.$el,
                  ".csui-inlinetoolbar", true).done(
                  function (el) {
                    var isInlineToolbar = $('.csui-inlinetoolbar').is(':visible');
                    expect(isInlineToolbar).not.toBe(true);
                    done();
                  });
            });

        it("should open permission popover in read-mode when permission level link is clicked",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).find('.csui-permission-level').click();
              AsyncUtils.asyncElement($(document.body),
                  ".csui-permission-attribute-popover-container .binf-popover").done(
                  function (el) {
                    var popoverContent = el.find(
                        '.binf-popover-content .csui-permission-attributes');
                    var buttonContainer = popoverContent.find(
                        'csui-permission-attribute-buttons-container');
                    expect(popoverContent.length).toEqual(1);
                    expect(buttonContainer.length).toEqual(0);

                    var allCheckbox = popoverContent.find(
                        '.csui-tree-container input[type="checkbox"]');
                    expect(allCheckbox.length).toBeGreaterThan(7);
                    expect(allCheckbox.length).toBeLessThan(11);
                    for (var k = 0; k < allCheckbox.length; k++) {
                      var checkbox = allCheckbox[k];
                      expect(checkbox.disabled).toBeTruthy();
                    }
                    done();
                  });
            });
        it("should show option Add Major Version in popover when Public Access permission level" +
           " link is clicked",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).find('.csui-permission-level').click();
              AsyncUtils.asyncElement(document.body,
                  ".csui-permission-attribute-popover-container .binf-popover").done(
                  function (el) {
                    var mv      = el.find(
                        '.binf-popover-content .csui-tree-container #node_add_major_version'),
                        mvLabel = mv.siblings('.csui-node-name');
                    expect(mv.length).toBeGreaterThan(0);
                    expect(mvLabel.text()).toEqual(addMajorVersion);
                    done();
                  });
            });

      });
    });

    describe("No results scenario on user group dialog", function () {
      var v4, node4, region4, permissionTableBody, permissionTableRows, emptyGroup;
      beforeAll(function (done) {
        node4 = context.getModel(NodeModelFactory, {attributes: {id: 44444}});
        node4.setExpand('permissions', '44444');
        userNodePermissionsModel = context.getModel(AuthenticatedUserNodePermissionFactory);
        var actionModel4 = new ActionModel({
          method: "GET",
          name: "permissions",
          signature: "permissions"
        });
        node4.actions = new ActionCollection([actionModel4]);
        userNodePermissionsModel.node = node4;
        userNodePermissionsModel.options.user.set("id", 1000);
        userNodePermissionsModel.fetch().always(function () {
          v4 = new PermissionsView({
            context: context,
            model: node4,
            authenticatedUserPermissions: userNodePermissionsModel
          });
          region4 = new Marionette.Region({
            el: $('<div id="permissions-view4"></div>').appendTo(document.body)
          });
          region4.show(v4);
          AsyncUtils.asyncElement(v4.$el, '.csui-table-list-body:visible').done(function () {
            permissionTableBody = v4.$el.find(".csui-table-list-body");
            permissionTableRows = permissionTableBody.find(".csui-table-row");
            done();
          });
        });

      });

      afterAll(function () {
        v4.destroy();
        node4.destroy();
        $('#permissions-view4').remove();
      });

      it("should open user group dialog on clicking on empty group", function (done) {
        emptyGroup = v4.$('.csui-table-row .csui-user-display-name');
        expect(emptyGroup.length).toEqual(1);
        emptyGroup.trigger('click');
        AsyncUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.binf-modal-content:visible').done(function (el) {
          expect(el.length).toEqual(1);
          done();
        });
      });

      it("should show no results on clicking empty group", function () {
        expect(
            $($.fn.binf_modal.getDefaultContainer()).find(
                '.binf-list-group > a').length).toEqual(
            0);
      });

      it("should close the empty group dialog", function (done) {
        $($.fn.binf_modal.getDefaultContainer()).find('.binf-modal-footer button').trigger(
            'click');
        AsyncUtils.asyncElement($.fn.binf_modal.getDefaultContainer(), '.binf-modal-content',
            true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });
    });

  });
});



