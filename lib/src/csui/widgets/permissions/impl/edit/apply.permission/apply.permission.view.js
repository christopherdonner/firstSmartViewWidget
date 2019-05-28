/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/permission/nodepermission.model',
  'hbs!csui/widgets/permissions/impl/edit/apply.permission/impl/apply.permission',
  'hbs!csui/widgets/permissions/impl/edit/apply.permission/impl/include.subitems',
  'i18n!csui/widgets/permissions/impl/edit/apply.permission/impl/nls/lang',
  'csui/utils/taskqueue',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/permissions/impl/permissions'
], function (module, _,
    $,
    Backbone,
    Marionette,
    TabableRegion,
    NodePermissionModel,
    applyPermissionTemplate,
    includeSubitemsTemplate,
    lang,
    TaskQueue) {
  "use strict";

  var config = module.config();
  _.defaults(config, {
    parallelism: 5
  });

  var ApplyPermissionView = Marionette.ItemView.extend({

    className: 'csui-apply-permission',

    template: applyPermissionTemplate,
    includeSubitemsTemplate: includeSubitemsTemplate,

    ui: {
      applyPermissionMsg: '.csui-apply-permission-message',
      appplyToSubFolderContainer: '.csui-apply-permission-sub-folder',
      appplyToSubFolder: '.csui-apply-permission-sub-folder-label',
      applyToSubItemsContainer: 'csui-apply-permission-subitems-container',
      applyToSubItemsTitle: '.csui-apply-subitems-message',
      subItemsCheckBox: '.csui-subtypes-option'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    events: {
      'keydown': 'onKeyInView'
    },

    constructor: function ApplyPermissionView(options) {
      var self = this;
      self._ = _;
      self.userSelectionCount = 0;
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.focusIndex = 0;
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('*[tabindex]');
      if (focusables.length) {
        if (event.keyCode === 13) { //Enter Key
          $(focusables[this.focusIndex]).parent().click();
          event.stopPropagation();
          event.preventDefault();

        }
        else if (keyCode === 38 || keyCode === 40) {
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).focus();

          event.stopPropagation();
          event.preventDefault();
        }
      }
    },

    currentlyFocusedElement: function () {
      var focusables = this.$el.find('*[tabindex]');
      if (focusables.length) {
        return $(focusables[this.focusIndex]);
      }
    },

    onRender: function () {
      var message = "";
      if (this.options.removePermission) {
        message = _.str.sformat(lang.removeToItem, this.options.model.get("container"));
      } else {
        message = _.str.sformat(lang.applyToItem, this.options.model.get("name"));
      }
      this.ui.applyPermissionMsg.html(message);
      if (this.options.model && this.options.model.get("container")) {
        this.loadSubFolderDeatils(this);
        if (this.options.applyTo) {
          this.loadSpecialItems(this.options.applyTo.subTypes,
              this.options.applyTo.thresholdExceeded);
        }
      }
    },

    loadSubFolderDeatils: function (self) {
      var isSubFolderExists = self.options.applyTo && self.options.applyTo.subTypes.indexOf(0);
      if (isSubFolderExists >= 0) {
        self.ui.appplyToSubFolderContainer.removeClass("binf-hidden");
        self.$(self.ui.appplyToSubFolder).html(lang.applytoSubFolder);
        self.requiredFieldSwitchModel = new Backbone.Model({data: false});
        var appplyToSubFolderId = _.uniqueId('appplyToSubFolder');
        self.ui.appplyToSubFolder.attr('id', appplyToSubFolderId);
        require(['csui/controls/form/fields/booleanfield.view'], function (BooleanFieldView) {
          self.requiredFieldSwitchView = new BooleanFieldView({
            mode: 'writeonly',
            model: self.requiredFieldSwitchModel,
            labelId: appplyToSubFolderId
          });
          self.requiredFieldSwitchView.render();
          self.requiredFieldSwitchView.on('field:changed', function (event) {
            self.subFolderSelected = event.fieldvalue;
            if (event.fieldvalue) {
              if (!!self.options.subTypes) {
                self.loadSpecialItems(self.options.subTypes, self.options.thresholdExceeded);
              } else {
                self.fetchSubFoldersSubItems(self.options).then(function (promises) {
                  self.loadSpecialItems(self.options.subTypes, self.options.thresholdExceeded);
                });
              }
            } else if (self.options.applyTo) {
              self.loadSpecialItems(self.options.applyTo.subTypes,
                  self.options.applyTo.thresholdExceeded);
            }
          });
          self.$('.required-fields-switch').append(self.requiredFieldSwitchView.$el);
        });
      } else {
        self.ui.appplyToSubFolderContainer.addClass("binf-hidden");
      }
    },

    loadSpecialItems: function (subTypes, thresholdExceeded) {
      var self               = this,
          subtypes           = subTypes,
          threshold_exceeded = thresholdExceeded,
          isSubFolderExists  = self.options.applyTo && self.options.applyTo.subTypes.indexOf(0),
          folderName         = self.model.get("name"),
          memberName         = this.options.permissionModel &&
                               this.options.permissionModel.get("right_id_expand") &&
                               this.options.permissionModel.get("right_id_expand").name_formatted,
          subTypesStr        = "";
      memberName = this.options.permissionModel &&
                   this.options.permissionModel.get("type") === "public" ? lang.publicAccess :
                   memberName;
      if (subtypes.indexOf(204) >= 0) {
        subTypesStr = subTypesStr === "" ? subTypesStr + lang[204] :
                      subTypesStr + ", " + lang[204];
      }
      if (subtypes.indexOf(207) >= 0) {
        subTypesStr = subTypesStr === "" ? subTypesStr + lang[207] :
                      subTypesStr + ", " + lang[207];
      }
      if (subtypes.indexOf(215) >= 0) {
        subTypesStr = subTypesStr === "" ? subTypesStr + lang[215] :
                      subTypesStr + ", " + lang[215];
      }
      if (subtypes.indexOf(298) >= 0) {
        subTypesStr = subTypesStr === "" ? subTypesStr + lang[298] :
                      subTypesStr + ", " + lang[298];
      }
      if (subtypes.indexOf(3030202) >= 0) {
        subTypesStr = subTypesStr === "" ? subTypesStr + lang[3030202] :
                      subTypesStr + ", " + lang[3030202];
      }

      if (this.options.removePermission) {
        _.str.sformat(lang.removeToItem, folderName);
      }

      if (threshold_exceeded) {
        if (this.options.removePermission) {
          self.ui.applyPermissionMsg.html(
              _.str.sformat(lang.removeThresholdExceeded, folderName));
        } else {
          self.ui.applyPermissionMsg.html(_.str.sformat(lang.applyToThresholdExceeded, folderName));
        }
      } else {
        if (this.options.removePermission) {
          self.ui.applyPermissionMsg.html(
              _.str.sformat(lang.removeToItem, folderName));
        } else {
          !!self.ui.applyPermissionMsg.html && 
              self.ui.applyPermissionMsg.html(_.str.sformat(lang.applyToItem, folderName));
        }
      }
      if (subTypesStr !== "") {
        self.ui.applyToSubItemsContainer.removeClass('binf-hidden');
        self.ui.applyToSubItemsTitle.html(_.str.sformat(lang.includeSubItems, subTypesStr));
      } else {
        !!self.ui.applyToSubItemsTitle.html && self.ui.applyToSubItemsTitle.html("");
        !!self.ui.applyToSubItemsContainer.addClass && 
            self.ui.applyToSubItemsContainer.addClass('binf-hidden');
      }
    },

    fetchSubFoldersSubItems: function (options) {
      this.options = options;
      this.options.subTypes = [];
      var self     = this,
          subTypes = [204, 207, 215, 298, 3030202],
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
                    include_sub_items: true
                  }
                });
                $.ajax(permissionPreCheck).done(function (response) {
                  if (response.results.data.subtypes_info !== undefined) {
                    self.options.subTypes.push(response.results.data.subtypes_info[0].id);
                  }
                  self.options.thresholdExceeded = response.results.data.threshold_exceeded;
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

    getApplyToFlag: function () {
      return this.subFolderSelected;
    }
  });
  return ApplyPermissionView;
});