/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/models/node/node.model',
  'csui/widgets/permissions/impl/permissions.lookup/permissions.lookup.view',
  'csui/controls/table.list/table.list.view',
  'csui/widgets/permissions/impl/permissions.list/permissions.dropdown.menu.items',
  'csui/controls/form/pub.sub',
  'csui/utils/commands',
  'csui/utils/contexts/factories/member',
  'csui/utils/contexts/factories/permission.list.factory',
  'csui/widgets/permissions/impl/permissions.list/toolbaritems',
  'csui/widgets/permissions/impl/permissions.list/toolbaritems.masks',
  'csui/widgets/permissions/impl/permissions.list/permission.table.columns',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/progressblocker/blocker',
  'csui/dialogs/members.picker/members.picker.wizard',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'hbs!csui/widgets/permissions/impl/permissions.content',
  'hbs!csui/widgets/permissions/impl/permissions.list/permissions.empty',
  'css!csui/widgets/permissions/impl/permissions'
], function (_, $, Marionette, base, NodeModel, PermissionsLookupView,
    TableListView, dropdownMenuItems, PubSub, commands, MemberModelFactory,
    PermissionCollectionFactory, toolbarItems, ToolbarItemsMasks, permissionTableColumns,
    ViewEventsPropagationMixin, BlockingView, MembersPickerDialog, lang, template, emptyTemplate) {

  var NoPermissionsResultView = Marionette.ItemView.extend({

    className: 'csui-table-empty',
    template: emptyTemplate,

    templateHelpers: function () {
      var emptyText = _.str.sformat(lang.emptyPermissionListMsg, this.model.get('name'));
      return {
        message: emptyText
      };
    },

    constructor: function NoPermissionsResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });

  var PermissionsContentView = Marionette.LayoutView.extend({

    className: 'cs-permissions-content',

    template: template,

    regions: {
      lookupRegion: ".csui-permission-lookup-container",
      listRegion: ".csui-permissions-list-container"
    },

    ui: {
      permissionList: '.csui-permissions-list-container',
      emptyActionsContainer: '.csui-permissions-empty-actions',
      addMemberToGroup: '.csui-addMember',
      grantAccessToMember: '.csui-grantAccess'
    },

    events: {
      'click @ui.addMemberToGroup': 'onClickAddMember'
    },

    onClickAddMember: function (e) {
      var self = this;
      var deferred = $.Deferred();
      var status = self.options.originatingView;
      var selectableMembers = self.originalCollection && self.originalCollection.models &&
                              self.originalCollection.models.length > 0 ?
                              self.originalCollection.models :
                              self.permissionCollection.models;
      selectableMembers = _.filter(selectableMembers, function (member) {
        return member.get("right_id_expand") && member.get("right_id_expand").type === 1;
      });
      var membersPickerDialog = new MembersPickerDialog({
        command: 'adduserorgroup',
        context: status.context,
        connector: status.model.connector,
        dialogClass: 'cs-permission-group-picker',
        displayName: lang.allUsersAndGroups,
        dialogTitle: lang.addUsersAndGroups,
        startLocation: 'acl.groups',
        displayStartLocation: true,
        selectedMember: self.memberFilter,
        showUserPicker: true,
        authUser: self.options.authUser,
        adduserorgroup: true,
        buttons: [
          {
            id: 'Add',
            label: lang.addButtonLabel,
            default: true,
            toolTip: lang.addButtonTooltip
          },
          {
            id: 'Cancel',
            label: lang.cancelButtonLabel,
            disabled: false,
            close: true,
            toolTip: lang.cancelButtonTooltip
          }
        ],
        nodeModel: status.model,
        availablePermissions: self.options.collection.availablePermissions,
        startLocations: ['acl.groups'],
        selectableMembers: selectableMembers
      }, self);
      membersPickerDialog
          .show()
          .done(function () {
            deferred.resolve.apply(deferred, arguments);
          }).fail(function (error) {
        deferred.reject.apply(deferred, arguments);
      });

    },

    constructor: function PermissionsContentView(options) {
      var self = this;
      options || (options = {});
      options.toolbarItems || (options.toolbarItems = toolbarItems);
      options.toolbarItemsMasks || (options.toolbarItemsMasks = new ToolbarItemsMasks());
      this.options = options;
      Marionette.LayoutView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);

      this.memberFilter = this.options.context.getModel(MemberModelFactory);

      this.collection = this.options.collection;

      this.listenTo(this.memberFilter, 'change', function () {
        if (this.collection.isFetchable()) {
          var self             = this,
              userPermissions  = this.permissionsListView.tableHeaderView.options.userPermissionsModel.get(
                  "permissions"),
              edit_permissions = this.options.authUser &&
                                 this.options.authUser.get("privilege_user_admin_rights");
          self.edit_permissions = edit_permissions;
          if (this.memberFilter.get("id")) {
            if (!this.originalCollection) {
              this.originalCollection = this.options.collection.clone();
            }
            this.options.filteredPermissions = true;
            var filteredCollection = _.filter(this.originalCollection.models, function (model) {
                  return model.get("right_id") === this.memberFilter.get("id");
                }, this),
                availableGroups    = _.filter(self.originalCollection.models, function (model) {
                  return model.get("right_id_expand") && model.get("right_id_expand").type === 1;
                }, this);
            this.collection.models = filteredCollection;
            if (this.permissionsListView) {
              this.collection.options.memberId = this.memberFilter.get('id');
              if (filteredCollection.length > 0) {
                this.permissionsListView.trigger("update:table", this.collection);
              } else {
                this.collection.options.clearEmptyPermissionModel = true;
                this.collection.fetch().then(function (resp) {
                  if (resp.results.data && resp.results.data.permissions &&
                      resp.results.data.permissions.length === 0 && self.edit_permissions) {
                    self.ui.permissionList.addClass("empty-permission-list");
                    if (availableGroups.length > 0) {
                      self.ui.emptyActionsContainer.removeClass("binf-hidden");
                      var addMemberToGroup = _.str.sformat(lang.addMemberToGroup,
                          self.memberFilter.get('name'));
                      var grantAccessToMember = _.str.sformat(lang.grantAccessToMember,
                          self.memberFilter.get('name'));
                      self.ui.addMemberToGroup.text(addMemberToGroup);
                      self.ui.grantAccessToMember.text(grantAccessToMember);
                      self.ui.addMemberToGroup.attr("title", addMemberToGroup);
                      self.ui.grantAccessToMember.attr("title", grantAccessToMember);
                    }
                  }
                }, this);
              }
            } else {
              this.model.set("isNotFound", true);
              this.collection.options.memberId = this.memberFilter.get('id');
              this.collection.fetch();
              if (edit_permissions) {
                this.ui.permissionList.addClass("empty-permission-list");
                if (availableGroups.length > 0) {
                  this.ui.emptyActionsContainer.removeClass("binf-hidden");
                  var addMemberToGroup = _.str.sformat(lang.addMemberToGroup,
                      this.memberFilter.get('name'));
                  var grantAccessToMember = _.str.sformat(lang.grantAccessToMember,
                      this.memberFilter.get('name'));
                  this.ui.addMemberToGroup.text(addMemberToGroup);
                  this.ui.grantAccessToMember.text(grantAccessToMember);
                  this.ui.addMemberToGroup.attr("title", addMemberToGroup);
                  this.ui.grantAccessToMember.attr("title", grantAccessToMember);
                }
              }
            }
          } else {
            this.ui.emptyActionsContainer.addClass("binf-hidden");
            this.ui.permissionList.removeClass("empty-permission-list");
            this.model.set("isNotFound", false);
            this.options.filteredPermissions = false;
            this.originalCollection = undefined;
            this.collection.options.memberId = this.memberFilter.get('id');
            this.collection.fetch();
          }
        }
      });

      this.permissionsLookupView = new PermissionsLookupView(_.extend({
        originatingView: this.options.originatingView,
        userPickerModel: this.memberFilter
      }, this.options));
      this.admin_permissions = this.options.authUser &&
                               this.options.authUser.get("privilege_system_admin_rights");
      this.columnCollection = permissionTableColumns.clone();
      this.updateColumnsCollection();
      this.permissionsListView = new TableListView(_.extend({
        originatingView: this.options.originatingView,
        context: this.options.context,
        memberFilter: this.memberFilter,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: this.collection,
        tableColumns: this.columnCollection,
        emptyView: NoPermissionsResultView,
        emptyViewModel: this.memberFilter,
        applyTo: this.options.applyTo,
        admin_permissions: this.admin_permissions,
        hasPermissionAction: this.options.hasPermissionAction
      }, this.options));

      if (this._isCollectionEditable()) {
        this.listenTo(this.permissionsListView, 'render', this.createPermissionDropDown);
      }
      this.listenTo(this.options.authenticatedUserPermissions, 'change',
          this._updatePermissionTable);
      this.listenTo(this.permissionsListView, 'render', this._resizePermissionTable);
      this.listenTo(this.permissionsListView, 'scroll', this._handleScroll);
      this.listenTo(this.permissionsListView, 'resizetable', this._resizePermissionTable);
      this.propagateEventsToViews(this.permissionsLookupView, this.permissionsListView);
    },

    updateColumnsCollection: function () {
      var models;
      if (this.options.hasPermissionAction) {
        if ((this.admin_permissions || this.options.authenticatedUserPermissions &&
                                       this.options.authenticatedUserPermissions.hasEditPermissionRights())) {
          models = permissionTableColumns.models;
        } else {
          models = permissionTableColumns.filter(function (model) {
            return !model.attributes.isToolbar;
          });
        }
      } else {
        models = permissionTableColumns.filter(function (model) {
          return !model.attributes.isToolbar;
        });
      }
      this.columnCollection.set(models, {remove: true});
    },

    _updatePermissionTable: function () {
      if (!this._isCollectionEditable()) {
        this.permissionsListView.$el.find('.csui-add-permission').addClass('binf-hidden');
        this.permissionsListView.$el.find('.csui-add-owner-or-group .csui-user-display-name').text(
            lang.NoOwnerAssigned);
      }
    },

    _resizePermissionTable: function (event) {
      var tableEle = this.$el.find('.csui-table-body');

      if (tableEle) {
        if (tableEle.parents('.csui-table-list').hasClass('csui-table-list-no-scrollable')) {
          tableEle.parents('.csui-table-list').removeClass('csui-table-list-no-scrollable');
        }

        if (tableEle.height() > tableEle.parent().height()) {
          tableEle.parents('.csui-table-list').removeClass('csui-table-list-no-scrollable');
        } else {
          tableEle.parents('.csui-table-list').addClass('csui-table-list-no-scrollable');
        }

      }
    },

    _isCollectionEditable: function () {
      var userRights = this.collection.options.authenticatedUserPermissions;
      return (userRights && userRights.hasEditPermissionRights() || this.admin_permissions);
    },

    showAddPermissionDropDown: function (e) {
      if (e.target.getAttribute('aria-expanded') !== "true") {
        this.createMenuItems(e);
      }
    },

    createPermissionDropDown: function () {
      if (this._isCollectionEditable()) {
        var toggler     = this.permissionsListView.$el.find('.csui-add-permission').addClass(
            'icon-toolbarAdd').addClass('binf-dropdown-toggle'),
            togglerCell = toggler.closest('.csui-table-header-cell'),
            toolItems;
        toggler.attr({
          'data-binf-toggle': 'dropdown',
          'aria-expanded': 'false',
          'tabindex': '-1',
          'aria-label': lang.AddUserOrGroup,
          'title': lang.AddDropdownTitle,
          'role': 'button'
        });
        toggler.bind('click', _.bind(this.showAddPermissionDropDown, this));
        this.dropDownEl = toggler;
        togglerCell.bind('keydown', _.bind(this.onKeyInView, this));
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        if (this.$(event.target).hasClass('csui-toolitem')) {
          this.$(event.target).click();
        } else {
          this.$el.find('.csui-add-permission').click();
        }
      }
    },

    createMenuItems: function (event) {
      var dropdownContainer = $(event.target).parent().addClass(
          'binf-dropdown');
      var listItems                                  = dropdownMenuItems.dropdownMenuList,
          ulEle, liEle, signature, toolItems, status = {};
      ulEle = $('<ul class="binf-dropdown-menu" role="menu"></ul>');
      if (this.options.filteredPermissions) {
        _.extend(this.originalCollection.options, this.collection.options);
        status.permissionCollection = this.originalCollection;
      } else {
        status.permissionCollection = this.collection;
      }

      listItems.collection.models.forEach(function (item_) {
        signature = item_.get('signature');
        var command = commands.findWhere({signature: signature});
        status.toolItem = item_;
        if (!!command && signature !== "disabled" && command.enabled(status)) {
          command.set('startLocation', status.startLocation);
          liEle = '<li data-csui-command="' + item_.get('signature') +
                  '"><a tabindex="-1" class="csui-toolitem">' + item_.get('name') + '</a></li>';
          ulEle.append(liEle);
        }
      });
      dropdownContainer.find('ul').remove();
      dropdownContainer.append(ulEle);
      toolItems = this.permissionsListView.$el.find('.csui-add-permission').parent().find(
          '.csui-toolitem');
      toolItems.bind('click', _.bind(this.executeToolItemAction, this));
    },

    executeToolItemAction: function (event) {
      var self = this;
      this.commands = commands;
      var signature = event.target.parentElement.getAttribute(
          'data-csui-command'),
          command   = this.commands.findWhere({signature: signature});
      var status = {
        startLocation: command.get('startLocation'),
        context: this.options.context,
        permissionCollection: this.collection,
        originalCollection: this.originalCollection,
        nodeModel: this.model,
        originatingView: this,
        connector: this.model.connector,
        nodeId: this.model.get('id'),
        applyTo: this.options.applyTo
      };
      if (command && command.enabled(status)) {
        this._ = _;
        command.execute(status).done(_.bind(function (resp) {
          if (self.permissionsLookupView.pickerView &&
              self.permissionsLookupView.pickerView.ui.searchclear.is(":visible")) {
            self.permissionsLookupView.pickerView.ui.searchclear.click();
          } else {
            if (resp.get("addOwnerGroup")) {
              self.collection.addOwnerOrGroup(resp);
            } else if (resp.get("publicAccess")) {
              self.collection.addPublicAccess(resp);
            } else {
              self.collection.add(resp);
            }
          }
          if (self.originalCollection && self.originalCollection.models) {
            var diffInCollection = this.collection.models.filter(function (item1) {
              for (var i in self.originalCollection.models) {
                if ((item1.get('right_id') === self.originalCollection.models[i].get('right_id') &&
                     item1.get('type') === self.originalCollection.models[i].get('type'))
                    || item1.get('type') === null) {
                  return false;
                }
              }
              return true;
            });
            if (diffInCollection.length > 0 && diffInCollection[0].get("type") === "owner" &&
                self.originalCollection.findWhere({type: 'owner'})) {
              self.originalCollection.remove(self.originalCollection.findWhere({type: 'owner'}));
            }
            self.originalCollection.models.push(diffInCollection[0]);
          }
        }, this)).always(function () {
          self.dropDownEl.focus();
        });
      }
    },

    onRender: function () {
      this.lookupRegion.show(this.permissionsLookupView);
      this.listRegion.show(this.permissionsListView);
    },

    onBeforeDestroy: function () {
      if (this.collection.options.memberId) {
        delete this.collection.options.memberId;
        this.memberFilter.set({id: '', group_id: '', name: ''}, {silent: true});
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    },

    _handleScroll: function (event) {
      this.options.originatingView && this.options.originatingView.trigger('scroll', event);
    }

  });

  _.extend(PermissionsContentView.prototype, ViewEventsPropagationMixin);

  return PermissionsContentView;

});
