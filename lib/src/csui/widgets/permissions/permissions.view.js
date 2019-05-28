/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/models/node/node.model',
  'csui/widgets/permissions/impl/permissions.content.view',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/permission.list.factory',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/utils/nodesprites', 'csui/utils/command.error',
  'csui/controls/progressblocker/blocker', 'csui/utils/commandhelper',
  'csui/models/nodechildren', 'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/commands', 'csui/utils/contexts/factories/usernodepermission',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior', 'csui/utils/taskqueue',
  'hbs!csui/widgets/permissions/impl/no.permissions',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'css!csui/widgets/permissions/impl/permissions'
], function (module, _, $, Marionette, base, NodeModel, PermissionsContentView,
    NodeModelFactory, UserModelFactory, PermissionCollectionFactory, ViewEventsPropagationMixin,
    NodeSpriteCollection, CommandError, BlockingView, CommandHelper, NodeChildrenCollection,
    ModalAlert, commands, AuthenticatedUserNodePermissionFactory, TabableRegionBehavior,
    TaskQueue, NoPermssionsTemplate, lang) {

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  var PermissionsView = Marionette.ItemView.extend({

    className: 'cs-permissions',

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabableRegionBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    template: false,

    events: {
      'focusin .csui-permissions-user-picker': 'onFocusInUserPicker'
    },

    constructor: function PermissionsView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
      }
      this.options = options;
      this.context = options.context;
      this.user = this.options.context.getModel(UserModelFactory);

      Marionette.ItemView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);

      this.hasPermissionAction = options.model && options.model.actions &&
                                 !!options.model.actions.get({signature: "permissions"});

      if (this.hasPermissionAction) {
        if (this.options.model && this.options.model.models &&
            this.options.model.models.length > 0) {
          this.options.model = this.options.model.models[0];
        }

        this.collection = this.options.collection = this.options.context.getCollection(
            PermissionCollectionFactory, this.options);

        this.collection.options.node = this.options.model;
        var userNodePermissionsModel = this.context.getModel(
            AuthenticatedUserNodePermissionFactory);
        userNodePermissionsModel.node = this.options.model;
        userNodePermissionsModel.node.set("isNotFound", false);
        userNodePermissionsModel.fetch()
            .done(function () {
              self.collection.options.authenticatedUserPermissions = userNodePermissionsModel;
              self.collection.fetch({
                success: _.bind(self.onPermissionsRequestSuccess, self, self.options),
                error: _.bind(self.onPermissionsRequestFailed, self, self.options)
              });
            })
            .fail(function (cause) {
              var errMsg = new CommandError(cause);
            });

        this._blockActions();
        this.listenTo(this, "permission:level:clicked", this._handlePermissionLevelClicked);
        this.listenTo(this, "permission:level:focus", this._handlePermissionLevelFocus);
        this.listenTo(this, "permission:inlineaction:clicked", this._hidePopovers);
      }
    },

    onRender: function () {
      if (!this.hasPermissionAction) {
        var typeName            = this.model.get("type_name") ? this.model.get("type_name") :
                                  this.model.get("shortcutNode") &&
                                  this.model.get("shortcutNode").get("type_name"),
            noPermissionContent = $('<div />', {
              'class': 'csui-no-permissions-container',
              'html': NoPermssionsTemplate({
                'messages': _.str.sformat(lang.noPermissionsAvailable, typeName)
              })
            });
        this.$el.html(noPermissionContent);
      }
    },

    _hidePopovers: function () {
      if (this.$el.parents('body') &&
          this.$el.parents('body').find('.csui-edit-permission-popover-container' +
                                        ' .binf-popover')) {
        var popoverTarget = this.$el.parents('body').find(
            '.csui-edit-permission-popover-container' +
            ' .binf-popover');
        if (popoverTarget.data('binf.popover')) {
          popoverTarget.binf_popover('destroy');
        }
      }
    },

    onFocusInUserPicker: function (event) {
      var popoverTarget = this.$el.find('.binf-popover.binf-in');
      if (popoverTarget.data('binf.popover')) {
        popoverTarget.binf_popover('destroy');
      }
    },

    onPermissionsRequestSuccess: function (options) {
      var self = this;
      if (this.permissionsContentView) {
        this.cancelEventsToViewsPropagation(this.permissionsContentView);
        this.permissionsContentView.destroy();
      }
      var userHasEditPermissions = options.collection.options.authenticatedUserPermissions &&
                                   options.collection.options.authenticatedUserPermissions.get(
                                       "permissions") &&
                                   options.collection.options.authenticatedUserPermissions.get(
                                       "permissions").indexOf("edit_permissions"),
          isContainer            = options.model.get("container");
      if (userHasEditPermissions >= 0 && isContainer) {
        options.applyTo = {};
        this.fetchPermissionsPreCheck(options);
      }
      this.permissionsContentView = new PermissionsContentView(_.defaults({
        originatingView: this,
        context: options.context,
        collection: options.collection,
        applyTo: options.applyTo,
        authUser: this.user,
        authenticatedUserPermissions: options.collection &&
                                      options.collection.options.authenticatedUserPermissions,
        hasPermissionAction: this.hasPermissionAction
      }, options));

      this.propagateEventsToViews(this.permissionsContentView);
      this.renderContent();
      this._unblockActions();
    },

    onPermissionsRequestFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      ModalAlert.showError(error.toString());
      this._unblockActions();
    },

    fetchPermissionsPreCheck: function (options) {
      this.options = options;
      this.options.applyTo.subTypes = [];
      var self     = this,
          subTypes = [0, 204, 207, 215, 298, 3030202],
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          nodeID   = self.model.get('id'),
          url      = (self.model.connector.connection.url).replace("v1", "v2") + "/nodes/" +
                     nodeID + "/descendents/subtypes/exists?sub_types=",
          promises = _.map(subTypes, function (subType) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var permissionPreCheck = self.model.connector.extendAjaxOptions({
                  url: url + subType,
                  type: 'GET',
                  data: {
                    include_sub_items: false
                  }
                });
                $.ajax(permissionPreCheck).done(function (response) {
                  if (response.results.data.subtypes_info !== undefined) {
                    self.options.applyTo.subTypes.push(response.results.data.subtypes_info[0].id);
                  }
                  self.options.applyTo.thresholdExceeded = response.results.data.threshold_exceeded;
                  deferred.resolve(response);
                }).fail(function (response) {
                  deferred.reject(response);
                });
                return deferred.promise();
              }
            });
            return deferred.promise(promises);  // return promises
          });
      return $.whenAll.apply($, promises);
    },

    renderContent: function () {
      var fetching = this.options.model.fetching;
      if (fetching) {
        return fetching.done(_.bind(this.render, this));
      }
      if (this.permissionsContentView) {
        var permissionsContentView = this.permissionsContentView.render();
        Marionette.triggerMethodOn(permissionsContentView, 'before:show', permissionsContentView,
            this);
        this.$el.append(permissionsContentView.el);
        Marionette.triggerMethodOn(permissionsContentView, 'show', permissionsContentView, this);
      }
    },

    onBeforeDestroy: function () {
      if (this.permissionsContentView) {
        this.cancelEventsToViewsPropagation(this.permissionsContentView);
        this.permissionsContentView.destroy();
      }
    },

    _closePermissions: function () {
      var node = this.options.model;
      if (node.get('type') === 1 && node.original && node.original.get('type') === 0) {
        this.trigger("permissions:close");
      } else {
        this.trigger('permissions:close:without:animation');
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView &&
                     this.options.originatingView.$el.is('visible') ? this.options.originatingView :
                     this;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView &&
                     this.options.originatingView.$el.is('visible') ? this.options.originatingView :
                     this;
      origView && origView.unblockActions && origView.unblockActions();
    },

    _handlePermissionLevelClicked: function (args) {
      this._hidePopovers();
      var self     = this,
          cellView = args.cellView;
      if (cellView.$el.data('binf.popover')) { //Return if popover is already open
        return;
      }
      var cmd = commands.get('EditPermission');
      var status = {
        model: cellView.model,
        targetView: {permissions: cellView},
        originatingView: this,
        applyTo: this.options.applyTo,
        authUser: this.user,
        admin_permissions: this.user.get("privilege_user_admin_rights")
      };
      var tableRow = cellView.$el.closest('.csui-table-row');
      tableRow.addClass('active-row');
      self.trigger('block:view:actions');
      if (cmd.enabled(status)) {
        var promisesFromCommand = cmd.execute(status);

        CommandHelper.handleExecutionResults(promisesFromCommand, {
          command: cmd,
          suppressSuccessMessage: status.suppressSuccessMessage,
          suppressFailMessage: status.suppressFailMessage
        }).done(function (nodes) {
          if (!!cmd.allowCollectionRefetch && self.collection.totalCount >
                                              self.collection.topCount) {
            self.collection.fetch();
          }
        }).always(function () {
          self.trigger('unblock:view:actions');
          tableRow.removeClass('active-row');
          self.unblockActions && self.unblockActions();
          cellView.$el.focus();
        });
      } else {

        require(['csui/widgets/permissions/impl/edit/edit.permission.helper'
        ], function (EditPermissionHelper) {
          self.editPermissionHelper = new EditPermissionHelper({
            permissionModel: cellView.model,
            popoverPlacement: "left",
            popoverAtBodyElement: self.options.originatingView ? !self.options.originatingView.options.isExpandedView : true,
            popoverTragetElement: cellView.$el,
            readonly: true,
            originatingView: self
          });

          self.editPermissionHelper.showCustomPermissionPopover();
          self.editPermissionHelper.listenTo(self.editPermissionHelper,
              "closed:permission:level:popover", function () {
                self.editPermissionHelper.destroy();
                self.trigger('unblock:view:actions');
                cellView.$el.closest('.csui-table-row').removeClass('active-row');
              });
        });
      }
    },

    _handlePermissionLevelFocus: function (args) {
      this._hidePopovers();
      var self     = this,
          cellView = args.cellView;
      if (cellView.$el.data('binf.popover')) { //Return if popover is already open
        return;
      }
      var status = {
        model: cellView.model,
        targetView: {permissions: cellView},
        originatingView: this,
        applyTo: this.options.applyTo,
        authUser: this.user,
        admin_permissions: this.user.get("privilege_user_admin_rights")
      };
      cellView.$el.closest('.csui-table-row').addClass('active-row');
      self.trigger('block:view:actions');
      require(['csui/widgets/permissions/impl/edit/edit.permission.helper'
      ], function (EditPermissionHelper) {
        self.editPermissionHelper = new EditPermissionHelper({
          permissionModel: cellView.model,
          popoverPlacement: "left",
          popoverAtBodyElement: self.options.originatingView ? !self.options.originatingView.options.isExpandedView : true,
          popoverTragetElement: cellView.$el,
          readonly: true,
          originatingView: self
        });

        self.editPermissionHelper.showCustomPermissionPopover();
        self.editPermissionHelper.listenTo(self.editPermissionHelper,
            "closed:permission:level:popover", function () {
              self.editPermissionHelper.destroy();
              self.trigger('unblock:view:actions');
              cellView.$el.closest('.csui-table-row').removeClass('active-row');
              cellView.$el.focus();
            });
      });
    }
  });

  _.extend(PermissionsView.prototype, ViewEventsPropagationMixin);

  return PermissionsView;

});
