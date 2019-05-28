/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/nodes', 'csui/utils/commands',
  'csui/utils/commands/unreserve',
  'csui/utils/commandhelper', 'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/member',
  'i18n!csui/controls/form/impl/fields/reservebuttonfield/nls/lang',
  'hbs!csui/controls/form/impl/fields/reservebuttonfield/reservebuttonfield',
  'css!csui/controls/form/impl/fields/reservebuttonfield/reservebuttonfield'
], function (require, _, $, Backbone, Marionette, NodeCollection,
    commands, UnreserveCommand, CommandHelper, UserModelFactory, MemberModelFactory, lang,
    template) {
  "use strict";

  var ReserveButtonFieldView = Marionette.ItemView.extend({
    constructor: function ReserveButtonFieldView(options) {
      if (!!options.data) {
        this.connector = options.data ? options.data.connector : undefined;
        this.unreserveCommand = new UnreserveCommand();
        this.revokeShareCommand = commands.get('RevokeShare');
        this.commandStatus = {nodes: new NodeCollection([options.data.node])};
        this.canUnreserve = this.unreserveCommand.enabled(this.commandStatus);
        this.canRevokeShare = false;
        if (this.revokeShareCommand) {
          this.canRevokeShare = this.revokeShareCommand.enabled(this.commandStatus);
        }

        var node = options.data.node;
        node && this.listenTo(node, 'sync', this._checkEnabledAction);
      }

      Marionette.ItemView.apply(this, arguments);

      if (!!this.options.data) {
        this.reserved = this.options.data.node.get('reserved');
        this.reservedSharedCollaboration = this.options.data.node.get(
            'reserved_shared_collaboration');
        if (this.options.data.options.context) {
          var user = this.options.data.options.context.getModel(UserModelFactory);
          this.userId = user.get('id');
          if (this.canRevokeShare) {
            this.commandStatus.context = this.options.data.options.context;
          }
        }
        var reservedUserId = this.options.data.attributes.data.reserved_user_id;
        this.reservedUser = this.options.connector.config.context.getModel(MemberModelFactory, {
              attributes: {id: reservedUserId},
              options: {
                id: reservedUserId,
                connector: this.options.connector
              },
              temporary: true
            }
        );
        this.reservedUser.ensureFetched();
        this.reservedUser.on('change', this.render, this);
      } else {
        this.reserved = false;
        this.canUnreserve = false;
        this.reservedSharedCollaboration = false;
        this.canRevokeShare = false;
      }
    },

    _checkEnabledAction: function () {
      this.canUnreserve = this.unreserveCommand.enabled(this.commandStatus);
      this.render();
    },

    ui: {
      btnReserveAction: '.csui-btn-reserve-status-action'
    },

    events: {
      'mousedown @ui.btnReserveAction': 'onMouseDown',
      'mouseup @ui.btnReserveAction': 'onMouseUp',
      'click @ui.btnReserveAction': 'reserveAction'
    },

    onMouseDown: function (event) {
      if (this.canUnreserve || this.canRevokeShare) {
        if (this.options.data.attributes.data.reserved_user_id === this.userId) {
          $(this.$el.find('.csui-icon')).addClass('icon-reserved_self_md');
        } else {
          $(this.$el.find('.csui-icon')).addClass('icon-reserved_other_md');
        }
      }
    },

    onMouseUp: function (event) {
      if (this.canUnreserve || this.canRevokeShare) {
        if (this.options.data.attributes.data.reserved_user_id === this.userId) {
          $(this.$el.find('.csui-icon')).removeClass('icon-reserved_self_md');
        } else {
          $(this.$el.find('.csui-icon')).removeClass('icon-reserved_other_md');
        }
      }
    },

    reserveAction: function (event) {
      if (this.canUnreserve || this.canRevokeShare) {
        if (!!this.options.data.beforeAction) {
          if (_.isFunction(this.options.data.beforeAction)) {
            this.options.data.beforeAction();
          }
        }

        this.reserved ? this.unreserve() : this.reserve();
        if (this.canUnreserve || this.canRevokeShare) {
          if (!!this.options.data.afterAction) {
            if (_.isFunction(this.options.data.afterAction)) {
              this.options.data.afterAction();
            }
          }
        }
      }
    },
    onChange: function () {
      if (!!this.options.data.actionOnce) {
        this.$el.off('click', '.csui-btn-reserve-status');
        this.$el.off('mouseover', '.csui-btn-reserve-status');
      }
    },

    reserve: function () {
    },

    unreserve: function () {

      var promiseFromCommand;

      if (this.canUnreserve) {
        promiseFromCommand = this.unreserveCommand.execute(this.commandStatus);

        CommandHelper.handleExecutionResults(
            promiseFromCommand, {
              command: this.unreserveCommand,
              suppressSuccessMessage: this.commandStatus.suppressSuccessMessage,
              suppressFailMessage: this.commandStatus.suppressFailMessage
            });
      } else if (this.canRevokeShare) {
        promiseFromCommand = this.revokeShareCommand.execute(this.commandStatus);

        CommandHelper.handleExecutionResults(
            promiseFromCommand, {
              command: this.revokeShareCommand,
              suppressSuccessMessage: this.commandStatus.suppressSuccessMessage,
              suppressFailMessage: this.commandStatus.suppressFailMessage
            });
      }
    },

    template: template,

    templateHelpers: function () {
      var icon, tooltip = "", noActionCSS = "", tabIndex = 0;
      if (this.reservedSharedCollaboration) {
        if (this.options.data.attributes.data.reserved_user_id === this.userId) {
          icon = "icon-shared_collaborate_self";
        } else {
          icon = "icon-shared_collaborate_other";
        }
      } else if (this.canUnreserve) {
        if (this.options.data.attributes.data.reserved_user_id === this.userId) {
          icon = "icon-reserved_metadata_self";
        } else {
          icon = "icon-reserved_metadata_other";
        }
      } else if (!!this.options.data &&
                 this.options.data.attributes.data.reserved_user_id !== this.userId) {
        icon = "icon-reserved_metadata_other";
      } else if (!!this.options.data &&
                 this.options.data.attributes.data.reserved_user_id === this.userId) {
        icon = "icon-reserved_metadata_self";
      }

      if (this.canRevokeShare && this.reservedSharedCollaboration) {
        tooltip = lang.revokeshare;
      } else if (this.canUnreserve && this.reserved) {
        tooltip = lang.unreserve;
        if (!!this.reservedUser) {
          tooltip = _.str.sformat(lang.reservedByUnreserve, this.reservedUser.get('display_name'));
        }
      } else {
        tabIndex = -1;
      }

      if (!this.canUnreserve || !this.canRevokeShare) {
        noActionCSS = "csui-btn-reserve-no-action";
      }

      return {
        noActionCSS: noActionCSS,
        icon: icon,
        tooltip: tooltip,
        reserved: this.reserved,
        reserveid: this.id,
        reservedSharedCollaboration: this.reservedSharedCollaboration,
        idBtnLabel: this.options.labelId,
        tabIndex: tabIndex
      };
    },

    onRender: function () {
      if (this.reserved) {
        var that = this;
        var $placeholder = this.$el.find(".csui-reserveby-status");
        require(['esoc/controls/userwidget/userwidget.view'],
            function (UserWidgetView) {
              var userWidgetOptions = {
                userid: that.options.data.attributes.data.reserved_user_id,
                context: that.options.connector.config.context,
                baseElement: $placeholder,
                showUserProfileLink: true,
                showMiniProfile: true,
                loggedUserId: that.userId,
                connector: that.connector,
                prettyScrolling: true,
                source: 'extendedInfoText',
                parentView: that
              };
              that.region = new Marionette.Region({el: $placeholder});
              var setUserWidgetAria = function() {
                if (!!that.reservedUser) {
                  $placeholder.find('a.esoc-user-container').attr('aria-label',
                      _.str.sformat(lang.reservedBy,
                          that.reservedUser.get('display_name')));
                }
              };
              that.listenToOnce(that, 'view:shown', function () {
                setUserWidgetAria();
              });
              var userWidget = new UserWidgetView(userWidgetOptions);
              userWidget.listenToOnce(userWidget, 'attach', function () {
                var event = $.Event('tab:content:field:changed');
                that.$el.trigger(event);
                setUserWidgetAria();
              });
              that.region.show(userWidget);
            });
      }
    }
  });

  return ReserveButtonFieldView;

});
