/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/command.error', 'csui/utils/commandhelper',
  'csui/models/command', 'csui/models/nodes'
], function (module, require, _, $, Backbone, Marionette,
    CommandError, CommandHelper, CommandModel, NodeCollection) {
  'use strict';

  var PermissionsCommand = CommandModel.extend({

    defaults: {
      signature: 'permissions',
      command_key: ['permissions', 'Permissions'],
      scope: 'multiple',
      commands: 'csui/utils/commands'
    },

    execute: function (status, options) {
      var self               = this,
          deferred           = $.Deferred(),
          selected           = status.nodes,
          container          = status.container,
          navigationView     = true, nodes,
          metadatanavigation = !!status.originatingView ? status.originatingView.$el.closest(
              '.cs-metadata-navigation-wrapper') : [];

      if (selected && selected.first() === container) {
        selected = container;
        navigationView = false;
      } else {
        nodes = this._getAtLeastOneNode(status);
        selected = selected.first();
      }
      if (metadatanavigation.length > 0) {
        metadatanavigation.addClass("cs-metadata-no-bg-color");
      }
      var context = status.context || options && options.context;

      require(['csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
        'csui/widgets/metadata/metadata.view', 'csui/controls/dialog/dialog.view',
        'csui/widgets/permissions/permissions.view', this.get('commands')
      ], function (PermissioNavigationWidget, MetadataView, DialogView, PermissionsView, commands) {

        var permissionsView, nodeId = selected.get('id'),
            showInDialogView = status.data && !!status.data.dialogView;
        if (status.originatingView instanceof PermissioNavigationWidget) {
          !!status.originatingView.mdv && status.originatingView.mdv.model.get('shortcutNode') ?
          selected.attributes.shortcutNode = status.originatingView.mdv.model.get('shortcutNode') :
          selected;
          permissionsView = new MetadataView({
            model: selected,
            originatingView: status.originatingView,
            containerCollection: status.collection,
            context: context,
            commands: commands,
            showCloseIcon: status.originatingView ? false : true,
            showBackIcon: status.originatingView ? false : true,
            activeTab: status.originatingView.mdv && status.originatingView.mdv.metadataTabView &&
                       status.originatingView.mdv.metadataTabView.options.activeTab,
            selectedTab: status.originatingView.mdv && status.originatingView.mdv.metadataTabView &&
                         status.originatingView.mdv.metadataTabView.tabLinks.selected,
            showPermissionView: true
          });
        }
        else if (navigationView) {
          if (status.collection && status.collection.models &&
              status.collection.models.length > 0) {
            permissionsView = new PermissioNavigationWidget({
              container: container,
              containerCollection: status.collection,  // this is the full collection
              collection: nodes,  // as UX design, this collection can be a subset
              selected: selected,
              originatingView: status.originatingView,
              context: context,
              commands: commands,
              isExpandedView: status.originatingView && !!status.originatingView.options.isExpandedView,
              nameAttribute: options ? options.nameAttribute : undefined,
              showCloseIcon: status.originatingView ? false : true,
              selectedTab: status.selectedTab,
              showPermissionView: true
            });
          } else {
            if (status.originatingView &&
                status.originatingView.supportOriginatingView === undefined) {
              status.originatingView.supportOriginatingView = true;
            }
            permissionsView = new MetadataView({
              model: selected,
              originatingView: status.originatingView,
              context: context,
              commands: commands,
              showCloseIcon: status.originatingView ? false : true,
              showBackIcon: status.originatingView ? true : false,
              selectedTab: status.selectedTab,
              showPermissionView: true
            });
          }
        } else {
          if (status.originatingView &&
              status.originatingView.supportOriginatingView === undefined) {
            status.originatingView.supportOriginatingView = true;
          }
          permissionsView = new MetadataView({
            model: selected,
            originatingView: status.originatingView,
            context: context,
            commands: commands,
            showCloseIcon: status.originatingView ? false : true,
            showBackIcon: status.originatingView ? true : false,
            selectedTab: status.selectedTab,
            showPermissionView: true
          });
        }
        if (status.originatingView instanceof PermissioNavigationWidget) {
          if (status.originatingView.mdv && status.originatingView.mdv.metadataTabView) {
            status.originatingView.mdv.destroy();
            status.originatingView.showPermissionView = true;
            permissionsView.render();
            Marionette.triggerMethodOn(permissionsView, 'before:show');
            status.originatingView.$el.find(".metadata-content").append(permissionsView.el);
          }
        }// replace the originatingView with sliding left/right animation
        else if (status.originatingView && !showInDialogView) {

          var _showOriginatingView, $csProperties;
          var $originatingView = status.originatingView.$el;
          var ntWidthVal = $originatingView.width();
          var ntWidth = ntWidthVal + 'px';

          $originatingView.parent().append("<div class='cs-permissions-wrapper'></div>");
          $csProperties = $($originatingView.parent().find('.cs-permissions-wrapper')[0]);
          $csProperties.hide();

          permissionsView.render();
          Marionette.triggerMethodOn(permissionsView, 'before:show');
          $csProperties.append(permissionsView.el);

          $originatingView.hide('blind', {
            direction: 'left',
            complete: function () {
              $csProperties.show('blind',
                  {
                    direction: 'right',
                    complete: function () {
                      Marionette.triggerMethodOn(permissionsView, 'show');
                    }
                  },
                  100);
            }
          }, 100);

          $originatingView.promise().done(function () {
            status.originatingView.isDisplayed = false;
          });

          _showOriginatingView = function () {
            if (metadatanavigation.length > 0) {
              metadatanavigation.removeClass("cs-metadata-no-bg-color");
            }
            $csProperties.hide('blind', {
              direction: 'right',
              complete: function () {
                $originatingView.show('blind',
                    {
                      direction: 'left',
                      complete: function () {
                        status.originatingView.triggerMethod('dom:refresh');
                        status.originatingView.isDisplayed = true;
                        !!status.collection && (status.collection.requireSwitched = false);
                      }
                    },
                    100);
                permissionsView.destroy();
                $csProperties.remove();
                deferred.resolve();
              }
            }, 100);
          };

          self.listenTo(permissionsView, 'metadata:close',
              _.bind(_showOriginatingView, self));
          self.listenTo(permissionsView, 'metadata:close:without:animation', function () {
            $originatingView.show('blind',
                {
                  direction: 'left',
                  complete: function () {
                    status.originatingView.triggerMethod('dom:refresh');
                    !!status.collection && (status.collection.requireSwitched = false);
                  }
                },
                100);
            permissionsView.destroy();
            $csProperties.remove();
            deferred.resolve();
          });

        } else {  // show permissionsView View in a modal dialog
          if (permissionsView.metadataTabView) {
            permissionsView.metadataTabView.options.isExpandedView = true;
          }
          self.dialog = new DialogView({
            className: 'cs-permissions',
            largeSize: true,
            view: permissionsView
          });

          self.dialog.show();
          self.dialog.ui.header.hide();
          self.dialog.listenTo(permissionsView, 'metadata:close', function () {
            self.dialog.destroy();
            deferred.resolve();
          });
          self.dialog.listenTo(permissionsView, 'metadata:close:without:animation',
              function () {
                self.dialog.destroy();
                deferred.resolve();
              });
        }
      });
      return deferred.promise();
    },

    _getAtLeastOneNode: function (status) {
      if (!status.nodes) {
        return new NodeCollection();
      }
      if (status.nodes.length === 1 && status.collection) {
        return status.collection;
      } else {
        return status.nodes;
      }
    }
  });
  return PermissionsCommand;
});