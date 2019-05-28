/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/dialogs/members.picker/impl/members.picker.view',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/member',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'csui/models/permission/nodepermission.model',
  'csui/dialogs/members.picker/start.locations/start.location.collection',
  'csui/dialogs/members.picker/impl/command.type',
  'csui/dialogs/members.picker/impl/header/members.picker.header.view',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  'csui/utils/log',
  'csui/controls/progressblocker/blocker',
  'csui/controls/wizard/wizard.view',
  'csui/widgets/permissions/impl/edit/permission.level.selector/permission.level.selector.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/permission.attributes.view',
  'csui/widgets/permissions/impl/edit/apply.permission/apply.permission.view',
  'csui/utils/taskqueue',
  'csui/controls/globalmessage/globalmessage', 'i18n',
  'css!csui/dialogs/members.picker/impl/members.picker',
  'csui/dialogs/node.picker/node.picker'
], function (module, _, $, Backbone, Marionette, MembersPickerView, ConnectorFactory,
    MemberModelFactory, MemberModel, MemberCollectionModel, NodePermissionModel,
    StartLocationCollection, CommandType, HeaderView, lang, log, BlockingView, WizardView,
    PermissionLevelSelectorView, PermissionAttributesView, ApplyPermissionView, TaskQueue,
    GlobalMessage, i18n) {
  "use strict";

  var config = _.extend({
    initialLocationLookupOrder: [
      'csui/dialogs/members.picker/start.locations/recent.groups',
      'csui/dialogs/members.picker/start.locations/member.groups',
      'csui/dialogs/members.picker/start.locations/acl.groups',
      'csui/dialogs/members.picker/start.locations/all.members']
  }, module.config());

  _.defaults(config, {
    parallelism: 3
  });

  var defaultOptions = {
    initialSelection: [],
    dialogTitle: lang.dialogTitle,
    orderBy: 'name asc'
  };

  function MembersPickerWizard(options) {
    options || (options = {});
    this.options = _.defaults(options, defaultOptions, {pageSize: 30});
    this.options.connector || (this.options.connector = this._getConnector(this.options));

    if (!this.options.connector) {
      var msg = lang.missingConnector;
      log.error(msg) && console.error(msg);
      throw new Error(msg);
    }
    this.options.targetBrowseHistory = [];
    this.options.navigateFromHistory = false;

    this.options.initialContainer = this._getInitalContainer(this.options);
    this.options.unselectableMembers = this._getArrayOfNodeIds(options.unselectableMembers);
    this.options.selectableMembers = this._getArrayOfNodeIds(options.selectableMembers);
    this.options.commandType = new CommandType(this.options);
  }

  _.extend(MembersPickerWizard.prototype, {

    show: function () {
      this._locations = new StartLocationCollection(this.options);
      this._locations
          .fetch({
            connector: this.options.connector,
            container: this.options.initialContainer,
            nodeId: this.options.nodeModel ? this.options.nodeModel.get("id") : undefined,
            removeInvalid: false
          })
          .done(_.bind(this._showWizard, this));

      this._deferred = $.Deferred();
      return this._deferred.promise();
    },

    _showWizard: function () {
      this._steps = this._createWizardSteps();
      this._wizard = new WizardView({steps: this._steps});
      BlockingView.imbue(this._wizard);
      this._wizard.options.editpermission = this.membersPickerView.options.edit_permission;
      this._wizard.options.groupId = this.membersPickerView.options.groupId;
      this._wizard.options.id = this.membersPickerView.options.groupId;
      this._wizard.options.add = this.membersPickerView.options.add;
      this._wizard.show(this._wizard.options);
      this._wizard.on('save:result', this.onClickFinishButton, this);
      this._wizard.on('add:member', this.onClickAddButton, this);
      this._wizard.currentView.headerView.on('show:selectItem', this.selectUsers, this);
      this._wizard.currentView.headerView.on('enable:add', this.enableAdd, this);
      if (this.options.selectedMember) {
        this.selectUsers(this.options.selectedMember);
      }
    },

    _createHeaderControl: function (initialLocation) {
      var options              = this.options,
          locationSelector     = options.locationSelector == null ? true : options.locationSelector,
          displayStartLocation = options.displayStartLocation == null ? false :
                                 options.displayStartLocation;
      var headerView = new HeaderView({
        locations: this._locations,
        headerViewoptions: this.options,
        title: options.dialogTitle,
        context: options.context,
        authUser: this.options.authUser,
        initialLocation: initialLocation,
        displayStartLocation: displayStartLocation,
        adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
        showUserPicker: options.showUserPicker,
        locationSelector: locationSelector,
        selectedMember: options.selectedMember,
        initialSelection: options.initialSelection
      });

      options.adduserorgroup &&
      headerView.startLocationView.on('change:location', this.onChangeLocation, this);
      headerView.on('hide:parentDialog', this.parentdialogdestroy, this);
      return headerView;
    },

    parentdialogdestroy: function (e) {
      this._wizard.destroy();
    },

    _createPickerView: function (location) {
      if (!this.options.startLocation) {
        this.options.startLocation = this._locations.at(0);
      }
      var options            = this.options,
          locationFactory    = location.get('factory'),
          locationParameters = locationFactory.getLocationParameters(this.options);

      _.defaults(locationParameters, this.options);
      var membersPickerView = new MembersPickerView(locationParameters);
      membersPickerView.on('update:button', this.updateButton, this);
      membersPickerView.on('changing:selection', this._blockDialog, this)
          .on('change:location', this.onChangeLocation, this);
      if (!!options.adduserorgroup) {
        membersPickerView.on('change:complete', this.onSelectionChange, this);
      }
      this.membersPickerView = membersPickerView;
      return membersPickerView;
    },

    _createPermissionLevelSelectorView: function () {
      var permissionLevelView = new PermissionLevelSelectorView({
        selected: 1,
        isContainer: this.options.nodeModel ? this.options.nodeModel.get('container') : true
      });
      permissionLevelView.on('permission:level:selected', this.onPermissionLevelSelection, this);
      return permissionLevelView;
    },

    _createPermissionLevelSubItemsView: function () {
      var applyPermissionView = new ApplyPermissionView({
        selected: 2,
        context: this.options.context,
        model: this.options.nodeModel,
        applyTo: this.options.applyTo
      });
      applyPermissionView.on('permission:level:selected', this.onPermissionLevelSelection, this);
      return applyPermissionView;
    },

    dialogClassName: function () {
      var className = 'target-browse';
      if (this.options && this.options.userClassName) {
        className = className + " " + this.options.userClassName;
      }
      return className;
    },

    _createWizardSteps: function () {
      var options               = this.options,
          initialLocation       = this._getInitialLocation(),

          step1header           = this._createHeaderControl(initialLocation),
          step1view             = this._createPickerView(initialLocation),
          isContainer           = (options.nodeModel && options.nodeModel.get("container") &&
                                   options.nodeModel.get("permissions_model") === "advanced") ?
                                  true : false,
          memberPickerTitleId   = 'memberPickerHeader',
          permissionLevelDescId = _.uniqueId('permissionLevel'),
          step1, step2, step3;
      if (options.adduserorgroup && !options.showUserPicker && isContainer) {
        step1 = {
          title: options.dialogTitle,
          adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
          headerView: step1header,
          view: step1view,
          className: this.dialogClassName,
          nextButton: true,
          userClassName: this.options.dialogClass,
          attributes: {'aria-labelledby': memberPickerTitleId},
          largeSize: true
        };
        step2 = {
          title: options.dialogTitle,
          headers: [{
            label: lang.selectPermissionLevel,
            class: 'csui-permission-level-select',
            id: permissionLevelDescId
          }],
          nextButtonLabel: lang.nextButtonLabel,
          nextButton: true,
          disableNext: false,
          view: this._createPermissionLevelSelectorView(),
          className: this.dialogClassName() + ' csui-permissions-level',
          attributes: {
            'aria-labelledby': memberPickerTitleId,
            'aria-describedby': permissionLevelDescId
          }
        };
        step3 = {
          title: options.dialogTitle,
          doneButtonLabel: lang.doneButtonLabel,
          disableDone: false,
          doneButton: true,
          view: this._createPermissionLevelSubItemsView(),
          className: this.dialogClassName() + ' csui-permissions-apply-dialog',
          attributes: {'aria-labelledby': memberPickerTitleId}
        };
        return [step1, step2, step3];
      } else if (options.adduserorgroup && !options.showUserPicker && !isContainer) {
        step1 = {
          title: options.dialogTitle,
          adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
          headerView: step1header,
          view: step1view,
          className: this.dialogClassName,
          nextButton: true,
          userClassName: this.options.dialogClass,
          attributes: {'aria-labelledby': memberPickerTitleId},
          largeSize: true
        };
        step2 = {
          title: options.dialogTitle,
          headers: [{
            label: lang.selectPermissionLevel,
            class: 'csui-permission-level-select',
            id: permissionLevelDescId
          }],
          doneButtonLabel: lang.doneButtonLabel,
          disableDone: false,
          doneButton: true,
          view: this._createPermissionLevelSelectorView(),
          className: this.dialogClassName() + ' csui-permissions-level',
          attributes: {
            'aria-labelledby': memberPickerTitleId,
            'aria-describedby': permissionLevelDescId
          }
        };
        return [step1, step2];
      } else {
        var memberBrowseStep = {
          title: options.dialogTitle,
          adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
          showUserPicker: options.showUserPicker,
          headerView: step1header,
          view: step1view,
          className: this.dialogClassName,
          userClassName: this.options.dialogClass,
          attributes: {'aria-labelledby': 'memberPickerHeader'},
          largeSize: true,
          buttons: options.buttons
        };

        return [memberBrowseStep];
      }
    },

    _blockDialog: function () {
      this._wizard.blockWithoutIndicator();
      return true;
    },

    onHideDialog: function () {
      if (this._deferred) {
        if (this._result) {
          this._deferred.resolve(this._result);
        } else if (this._deferred.state() === 'pending') {
          this._deferred.reject({cancelled: true});
        }
      }
    },

    onChangeLocation: function (location) {
      if (!location.get) {
        location = this._locations.get('csui/dialogs/members.picker/start.locations/' + location);
      }
      this.options.targetBrowseHistory = [];
      var selectedMembers = this.membersPickerView && this.membersPickerView.selectedMemberList &&
                            this.membersPickerView.selectedMemberList.collection.models;
      this._steps[0].view.destroy();
      this.membersPickerView.trigger('change:complete');
      this.options.previousLocation = location;
      this._steps[0].view = this._createPickerView(location);
      var node = location.get("factory").container;
      this._wizard.currentView.showView(this._steps[0].view);
      if (selectedMembers) {
        this.selectUsers(selectedMembers);
      }
    },

    selectUsers: function (selectedMember) {
      this.membersPickerView && this.membersPickerView.selectedMemberList &&
      this.membersPickerView.selectedMemberList.trigger("show:selectItem", selectedMember);
    },

    enableAdd: function () {
      var buttonView = this._wizard.currentView.footerView.children._views;
      _.each(buttonView, function (add) {
        if (add.model.get('id') === 'Add') {
          add.$el.removeClass("binf-hidden");
        }
      }, this);
    },

    updateButton: function (selectedMemberCollection) {
      this._wizard.currentView.footerView &&
      this._wizard.currentView.footerView.trigger("update:button", selectedMemberCollection);
      this.locationId = !!this._wizard.currentView.headerView.options &&
                        !!this._wizard.currentView.headerView.options.headerViewoptions &&
                        this._wizard.currentView.headerView.options.headerViewoptions.locationID;
      var buttonView = this._wizard.currentView.footerView.children._views;
      _.each(buttonView, function (add) {
        if (add.model.get('id') === 'Add') {
          if (selectedMemberCollection.models.length > 0 && this._wizard.options.add) {
            if (this.options.selectedMember && !this.locationId) {
              add.$el.attr("disabled", "disabled");
            } else {
              add.$el.removeAttr("disabled");
            }
          } else {
            add.$el.attr("disabled", "disabled");
          }
        }
      }, this);
      var memberExists = selectedMemberCollection.models.length > 0 ? true : false;
      this._wizard.currentView.headerView && this._wizard.currentView.headerView.userSearchView &&
      this._wizard.currentView.headerView.userSearchView.updatePlaceHolder(memberExists);
    },

    onClickFinishButton: function () {
      var members, permissions, applyToSubFolders, isContainer;
      if (this && this.getMemberPickerView() && this.getMemberPickerView().getSelection()) {
        members = this.getMemberPickerView().getSelection();
        permissions = this.getPermissionLevelView().getSelectedPermissions();
        isContainer = (this.options.nodeModel.get("container") &&
                       this.options.nodeModel.get("permissions_model") === "advanced") ? true :
                      false;
        if (isContainer) {
          applyToSubFolders = this.getPermissionsApplyView().getApplyToFlag();
        }
        this._result = {
          members: members,
          permissions: permissions,
          apply_to: isContainer ? (applyToSubFolders ? 2 : 3) : 0
        };
        this._wizard.destroy();
        this.onHideDialog();
      }
      /* else if (this.options.showUserPicker) {
         members = this.getMemberPickerView().getSelection();
         permissions = this.getPermissionLevelView().getSelectedPermissions();
         applyToSubFolders = this.getPermissionsApplyView().getApplyToFlag();
         isContainer = (this.options.nodeModel.attributes.type === 0) ? true : false;
         this._result = {
           members: members,
           permissions: permissions,
           apply_to: isContainer ? (applyToSubFolders ? 2 : 3) : 0
         };
         this._wizard.destroy();
         this.onHideDialog();

       }*/ else {
        this._wizard.currentView.updateButton('next', {disabled: true});
      }
    },

    onClickAddButton: function () {
      var id  = this._wizard.options.groupId,
          url = this.options.connector.connection.url;
      url = url.replace('v1', 'v2');
      var self             = this,
          groupName        = this.getMemberPickerView().getSelection() &&
                             this.getMemberPickerView().getSelection().get("name_formatted") ||
                             this.membersPickerView.options.displayName,
          formData         = {},
          ajaxOptions      = {},
          connector        = this.options.connector,
          selecetedGroupId = !!this._wizard.currentView.headerView.options &&
                             !!this._wizard.currentView.headerView.options.headerViewoptions &&
                             this._wizard.currentView.headerView.options.headerViewoptions.locationID;
      id = selecetedGroupId ? selecetedGroupId : id;
      self.groupName = groupName;
      self.failedUsers = [];
      self.passcount = 0;
      self.failcount = 0;
      var queue          = new TaskQueue({
            parallelism: config.parallelism
          }),
          count          = 0,
          selectedModels = this.membersPickerView && this.membersPickerView.selectedMemberList &&
                           this.membersPickerView &&
                           this.membersPickerView.selectedMemberList.collection.models,
          promises       = _.map(selectedModels, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                formData = {
                  member_id: model.id
                };
                ajaxOptions = connector.extendAjaxOptions({
                  type: 'POST',
                  id: id,
                  url: url + '/members/' + id + '/members',
                  data: formData
                });
                self.userName = model.get('name_formatted') || model.get('name');
                $.ajax(ajaxOptions).done(function (resp) {
                  self.passcount += 1;
                  deferred.resolve(model);
                }, self).fail(function (resp) {
                  self.failcount += 1;
                  self.failedUsers.push(self.userName);
                  deferred.resolve(model);
                }, self);
                return deferred.promise();
              }
            });
            count++;
            return deferred.promise(promises);  // return promises
          });

      $.whenAll.apply($, promises).then(function (promises) {
        if (self.passcount === 1 && self.failcount === 0) {
          GlobalMessage.showMessage('success',
              _.str.sformat(lang.singleUserText, self.userName, self.groupName));
        } else if (self.passcount === 0 && self.failcount === 1) {
          GlobalMessage.showMessage('error',
              _.str.sformat(lang.singleUserFailureText, self.userName, self.groupName));
        } else if (self.passcount === 1 && self.failcount > 0) {
          GlobalMessage.showMessage('success',
              _.str.sformat(lang.SinglePassMoreThanOneFail, self.userName, self.groupName,
                  self.failcount));
        } else if (self.passcount > 0 && self.failcount > 0) {
          GlobalMessage.showMessage('success',
              _.str.sformat(lang.manyUserText, self.passcount, self.failcount, self.groupName));
        } else if (self.passcount > 0 && self.failcount === 0) {
          GlobalMessage.showMessage('success',
              _.str.sformat(lang.onlyAllSuccessText, self.passcount, self.groupName));
        } else if (self.passcount === 0 && self.failcount > 0) {
          GlobalMessage.showMessage('error',
              _.str.sformat(lang.onlyAllFailureText, self.failcount, self.groupName));
        }
        self._wizard.destroy();
      });
    },

    _getArrayOfNodeIds: function (unselectableNodes) {
      if (unselectableNodes && !_.isEmpty(unselectableNodes)) {
        if (unselectableNodes[0] instanceof Backbone.Model) {
          return _.map(unselectableNodes, function (node) {
            return node.get('right_id');
          });
        }
      }

      return unselectableNodes;
    },

    _getInitalContainer: function (options) {
      var container = this.options.initialContainer;

      if (container == null || _.isEmpty(container) || !(container instanceof Backbone.Model)) {
        container = new MemberModel(
            {
              groupId: options.groupId,
              displayName: options.displayName
            },
            {connector: options.connector});
      } else {
        container == null;
      }
      return container;
    },
    _getConnector: function (options) {
      var connector;

      if (options.context) {
        connector = options.context.getObject(ConnectorFactory);
      } else if (options.initialSelection || options.initialContainer) {
        var initalSelection = options.initialSelection,
            nodes           = initalSelection ? (_.isArray(initalSelection) ? initalSelection :
                                                 initalSelection.models) : undefined,
            node            = options.initialContainer || nodes[0];
        connector = node && node.connector;
      }

      return connector;
    },

    _getInitialLocation: function () {
      var locationId = this.options.startLocation,
          initialLocation;
      if (locationId) {
        var lastSlash = locationId.lastIndexOf('/');
        if (lastSlash < 0) {
          locationId = 'csui/dialogs/members.picker/start.locations/' + locationId;
        }
        initialLocation = this._locations.get(locationId);
      }
      if (!locationId && this.options.groupId) {
        initialLocation = this._locations.get(
            'csui/dialogs/members.picker/start.locations/current.group');
      }
      return initialLocation;
    },

    onSelectionChange: function (member) {
      var disable = this.getMemberPickerView().getNumberOfSelectItems() > 0, hasFilterName;
      if (member && member.get("id")) {
        this.options.locationID = member.get("id");
      }
      this._wizard.options.add = member && member.add;
      this._wizard.destroyBlockingView();
      var header = this.getMemberPickerHeader();
      if (this.options.saveFilter && header && header.ui.saveFilter) {
        hasFilterName = header.ui.saveFilter.val().trim() ? true : false;
        if (hasFilterName && disable) {
          this._wizard.updateButton('next', {disabled: false});
        } else {
          this._wizard.updateButton('next', {disabled: true});
        }
      } else {
        this._wizard.updateButton('next', {disabled: !disable});
        if (this.membersPickerView &&
            this.membersPickerView.selectedMemberList.collection.models.length > 0 &&
            member && member.get("id") && member.add && !member.get("deleted")) {
          this._wizard.updateButton('Add', {disabled: false});
        } else {
          this._wizard.updateButton('Add', {disabled: true});
        }
      }

      if (this.isCustom) {
        this._steps[1].view = this._createPermissionLevelSelectorView();
        var permissionLevelStep = this._wizard.getStepViewByStepNumber(1);
        permissionLevelStep.showView(this._steps[1].view);
        this.isCustom = false;
      }
    },

    onPermissionLevelSelection: function () {
      var view = this.getPermissionLevelView();
      if (view.selected === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
        var customPermissionView = new PermissionAttributesView({
          permissions: [],
          readonly: false,
          showButtons: false,
          node: this.options.nodeModel
        });

        this._steps[1].view = customPermissionView;
        this._wizard.currentView.showView(this._steps[1].view);
        this.isCustom = true;
        var $treeViewDiv = customPermissionView.$el.find('.csui-permission-attribute-tree'),
            adjustSplitsHeight,
            adjustSplitsRight,
            adjustSplitsSeparator,
            adjustSplits = $treeViewDiv.find(".csui-tree-split");

        for (var i = adjustSplits.length - 1, j = 0; i >= 0, j < adjustSplits.length; i--, j++) {
          adjustSplitsRight = $(adjustSplits[i]).width() * j;
          adjustSplitsSeparator = $(adjustSplits[i]).closest(".csui-tree-child").find(
              '.csui-separator');
          if (adjustSplits[i] === adjustSplits[adjustSplits.length - 1]) {
            adjustSplitsHeight = $treeViewDiv.outerHeight();
          } else {
            adjustSplitsHeight = Math.round(($(adjustSplits[i]).closest("li").position().top) +
                                            $(adjustSplits[i]).closest(
                                                ".csui-tree-child").outerHeight());
            adjustSplitsRight = adjustSplitsRight + j;
          }
          if (i18n && i18n.settings.rtl) {
            $(adjustSplits[i]).css({'height': adjustSplitsHeight, 'left': adjustSplitsRight});
            adjustSplitsSeparator.css({
              'width': ($treeViewDiv.find('.csui-tree-container').width()),
              'left': adjustSplitsRight
            });
            $(adjustSplits[i]).closest('.csui-tree-child').css(
                {'padding-left': adjustSplitsRight + $(adjustSplits[i]).width()});
          } else {
            $(adjustSplits[i]).css({'height': adjustSplitsHeight, 'right': adjustSplitsRight});
            adjustSplitsSeparator.css({
              'width': ($treeViewDiv.find('.csui-tree-container').width()),
              'right': adjustSplitsRight
            });
            $(adjustSplits[i]).closest('.csui-tree-child').css(
                {'padding-right': adjustSplitsRight + $(adjustSplits[i]).width()});
          }
        }
      }
      this._wizard.updateButton('next', {disabled: false});
    },

    getMemberPickerView: function () {
      return this._steps[0].view;
    },

    getMemberPickerHeader: function () {
      return this._steps[0].headerView;
    },

    getPermissionLevelView: function () {
      return this._steps[1].view;
    },

    getPermissionsApplyView: function () {
      return this._steps[2].view;
    }

  });

  return MembersPickerWizard;

});
