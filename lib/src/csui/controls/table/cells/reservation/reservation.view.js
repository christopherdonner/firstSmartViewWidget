/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/base', 'csui/utils/log',
  'csui/utils/contexts/factories/user',
  'csui/models/nodes',
  'csui/models/nodechildren',
  'csui/controls/table/cells/templated/templated.view',
  'csui/utils/commands',
  'csui/utils/commands/unreserve',
  'csui/utils/commandhelper',
  'csui/controls/table/cells/cell.registry',
  'hbs!csui/controls/table/cells/reservation/impl/reservation',
  'i18n!csui/controls/table/cells/reservation/impl/nls/lang',
  'css!csui/controls/table/cells/reservation/impl/reservation'
], function ($, _, base, log, UserModelFactory, NodeCollection,
    NodeChildrenCollection, TemplatedCellView, commands, UnreserveCommand,
    CommandHelper, cellViewRegistry, template, lang) {
  'use strict';

  var AddDeleteReservationView = TemplatedCellView.extend({
    template: template,

    triggers: {
      'click .csui-unreserve-cellview': 'remove:reservation'
    },

    events: {"keydown": "onKeyInView"},

    getValueData: function () {
      var reservedById = this.model.get('reserved_user_id');
      if (reservedById && typeof reservedById === 'object') {
        reservedById = reservedById.id;
      }
      var isReserved = this.model.get('reserved') && reservedById;
      var isReservedSharedCollaboration = this.model.get('reserved_shared_collaboration');
      var reservedBy;
      var isReservedByOther = false;
      if (isReserved) {
        var reservedData = this.model.get('reserved_user_id_expand') ||
                           this.model.get('reserved_user_id');
        reservedBy = base.formatMemberName(reservedData);
        isReservedByOther = this.userId !== reservedById;
      }

      var reservedDate = base.formatExactDate(this.model.get('reserved_date')),
          reservedUser = base.formatMemberName(reservedBy),
          reservedTooltip, reservedAria;

      if (isReservedSharedCollaboration) {
        reservedTooltip = lang.reservedSharedCollaborationTooltipPrefix;
        reservedAria = lang.reservedSharedCollaborationAria;
      } else if (isReserved) {
        reservedTooltip = lang.reservedTooltipPrefix;
        reservedAria = lang.reservedAria;
      }
      if (reservedTooltip) {
        reservedTooltip = _.str.sformat(reservedTooltip, reservedBy, reservedDate);
        reservedAria = _.str.sformat(reservedAria, reservedBy, reservedDate);
      }

      var data = {
        reservedTooltip: reservedTooltip,
        reservedAria: reservedAria,
        canUnreserve: this.canUnreserve,
        reserved: isReserved,
        isReservedByOther: isReservedByOther,
        canRevokeShare: this.canRevokeShare,
        reservedSharedCollaboration: isReservedSharedCollaboration
      };

      return data;
    },

    initialize: function () {
      var user = this.options.context.getModel(UserModelFactory);
      this.userId = user.get('id');
      this.unreserveCommand = new UnreserveCommand();
      this.revokeShareCommand = commands.get('RevokeShare');
      this.commandStatus = {nodes: new NodeCollection([this.model]), context: this.options.context};
      this._checkEnabledAction();
      var actions = this.model.collection.delayedActions;
      actions && this.listenTo(actions, 'sync', this._checkEnabledAction);
    },

    _checkEnabledAction: function () {
      this.canUnreserve = this.unreserveCommand.enabled(this.commandStatus);
      this.canRevokeShare = false;
      if (this.revokeShareCommand) {
        this.canRevokeShare = this.revokeShareCommand.enabled(this.commandStatus);
      }
      if (!this.isDestroyed) {
        this.render();
      }
    },

    onRemoveReservation: function (e) {
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

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {

        this.onRemoveReservation();
      }
    }
  }, {
    hasFixedWidth: true,

    columnClassName: 'csui-table-cell-reservation',

    getModelExpand: function (options) {
      return {properties: ['reserved_user_id']};
    }
  });

  return AddDeleteReservationView;
});
