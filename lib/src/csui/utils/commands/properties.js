/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/command.error', 'csui/utils/commandhelper',
  'csui/models/command', 'csui/models/nodes'
], function (module, require, _, $, Backbone, Marionette,
    CommandError, CommandHelper, CommandModel, NodeCollection) {
  'use strict';

  var PropertiesCommand = CommandModel.extend({

    defaults: {
      signature: 'Properties',
      command_key: ['properties', 'Properties'],
      scope: 'multiple',
      commands: 'csui/utils/commands'
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var selected = status.nodes;
      var container = status.container;
      var navigationView = true;
      var nodes;
      if (selected && selected.first() === container) {
        selected = container;
        navigationView = false;
      } else {
        nodes = this._getAtLeastOneNode(status);
      }
      var context = status.context || (options && options.context);
      var originatingView = status.originatingView || (options && options.originatingView);

      require(['csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
        'csui/widgets/metadata/metadata.view', 'csui/controls/dialog/dialog.view',
        'csui/models/nodeversions', this.get('commands')
      ], function (MetadataNavigationWidget, MetadataView, DialogView,
          NodeVersionCollection, commands) {

        var metadata, showInDialogView = status.data && !!status.data.dialogView;
        if (navigationView) {
          if (status.collection && status.collection.models &&
              status.collection.models.length > 0) {
            metadata = new MetadataNavigationWidget({
              container: container,
              containerCollection: status.collection,  // this is the full collection
              collection: nodes,  // as UX design, this collection can be a subset
              selected: selected,
              originatingView: originatingView,
              context: context,
              commands: commands,
              nameAttribute: options ? options.nameAttribute : undefined,
              showCloseIcon: originatingView ? false : true,
              selectedTab: status.selectedTab,
              selectedProperty: status.selectedProperty,
              showThumbnails: status.showThumbnails
            });
          } else {
            if (originatingView && originatingView.supportOriginatingView === undefined) {
              originatingView.supportOriginatingView = true;
            }
            metadata = new MetadataView({
              model: selected.get("id") ? selected : selected.models[0],
              originatingView: originatingView,
              context: context,
              commands: commands,
              showCloseIcon: originatingView ? false : true,
              showBackIcon: originatingView ? true : false,
              selectedTab: status.selectedTab,
              selectedProperty: status.selectedProperty
            });
          }
        } else {
          if (originatingView && originatingView.supportOriginatingView === undefined) {
            originatingView.supportOriginatingView = true;
          }
          metadata = new MetadataView({
            model: selected,
            originatingView: originatingView,
            context: context,
            commands: commands,
            showCloseIcon: originatingView ? false : true,
            showBackIcon: originatingView ? true : false,
            selectedTab: status.selectedTab,
            selectedProperty: status.selectedProperty
          });
        }

        if (originatingView instanceof MetadataNavigationWidget &&
            !(status.collection instanceof NodeVersionCollection)) {
          if (originatingView.mdv && originatingView.mdv.metadataTabView) {
            metadata = null;
            originatingView.showPermissionView = false;
            originatingView._showNode(selected.get("id") ? selected : selected.models[0]);
          }
        } // replace the originatingView with sliding left/right animation
        else if (originatingView && !showInDialogView) {
          originatingView.triggerMethod('metadata:created', metadata);
          var _showOriginatingView, $csProperties;
          var $originatingView = originatingView.$el;
          var ntWidthVal = $originatingView.width();
          var ntWidth = ntWidthVal + 'px';

          $originatingView.parent().append("<div class='cs-properties-wrapper'></div>");
          $originatingView.parent().addClass('csui-node-properties-wrapper');
          $csProperties = $($originatingView.parent().find('.cs-properties-wrapper')[0]);
          $csProperties.hide();

          metadata.render();
          Marionette.triggerMethodOn(metadata, 'before:show');
          $csProperties.append(metadata.el);

          $originatingView.hide('blind', {
            direction: 'left',
            complete: function () {
              $csProperties.show('blind',
                  {
                    direction: 'right',
                    complete: function () {
                      Marionette.triggerMethodOn(metadata, 'show');
                    }
                  },
                  100);
            }
          }, 100);

          $originatingView.promise().done(function () {
            originatingView.isDisplayed = false;
          });

          _showOriginatingView = function () {
            $csProperties.hide('blind', {
              direction: 'right',
              complete: function () {
                $originatingView.show('blind',
                    {
                      direction: 'left',
                      complete: function () {
                        originatingView.triggerMethod('dom:refresh');
                        originatingView.isDisplayed = true;
                        !!status.collection && (status.collection.requireSwitched = false);
                        originatingView.trigger('properties:view:destroyed');
                      }
                    },
                    100);
                $originatingView.parent().removeClass('csui-node-properties-wrapper');
                metadata.destroy();
                $csProperties.remove();
                deferred.resolve();
              }
            }, 100);
          };

          self.listenTo(metadata, 'metadata:close', _.bind(_showOriginatingView, self));
          self.listenTo(metadata, 'metadata:close:without:animation', function () {
            $originatingView.show('blind',
                {
                  direction: 'left',
                  complete: function () {
                    originatingView.triggerMethod('dom:refresh');
                    !!status.collection && (status.collection.requireSwitched = false);
                  }
                },
                100);
            metadata.destroy();
            $csProperties.remove();
            deferred.resolve();
          });

        } else {  // show Metadata View in a modal dialog

          self.dialog = new DialogView({
            className: 'cs-properties',
            largeSize: true,
            view: metadata
          });

          self.dialog.show();
          self.dialog.ui.header.hide();
          self.dialog.listenTo(metadata, 'metadata:close', function () {
            self.dialog.destroy();
            deferred.resolve();
          });

          self.dialog.listenTo(metadata, 'metadata:close:without:animation', function () {
            self.dialog.destroy();
            deferred.resolve();
          });

        }

      }, function (error) {
        deferred.reject(new CommandError(error));
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

  return PropertiesCommand;

});
