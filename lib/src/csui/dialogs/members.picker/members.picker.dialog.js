/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/dialog/dialog.view',
  'csui/dialogs/members.picker/impl/members.picker.view',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/member',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'csui/dialogs/members.picker/start.locations/start.location.collection',
  'csui/dialogs/members.picker/impl/command.type',
  'csui/dialogs/members.picker/impl/header/members.picker.header.view',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  'csui/utils/log',
  'csui/controls/progressblocker/blocker',
  'css!csui/dialogs/members.picker/impl/members.picker',
  'csui/dialogs/node.picker/node.picker'
], function (module, _, $, Backbone, Marionette, DialogView, MembersPickerView, ConnectorFactory,
    MemberModelFactory, MemberModel, MemberCollectionModel, StartLocationCollection, CommandType,
    HeaderView, lang, log, BlockingView) {
  "use strict";

  var config = _.extend({
    initialLocationLookupOrder: [
      'csui/dialogs/members.picker/start.locations/recent.groups',
      'csui/dialogs/members.picker/start.locations/member.groups',
      'csui/dialogs/members.picker/start.locations/all.members']
  }, module.config());

  var defaultOptions = {
    initialSelection: [],
    dialogTitle: lang.dialogTitle,
    orderBy: 'name asc'
  };

  function MembersPickerDialog(options) {
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
    this.options.commandType = new CommandType(this.options);
  }

  _.extend(MembersPickerDialog.prototype, {

    show: function () {
      this._locations = new StartLocationCollection(this.options);
      this._locations
          .fetch({
            connector: this.options.connector,
            container: this.options.initialContainer,
            removeInvalid: false
          })
          .done(_.bind(this._showDialog, this));

      this._deferred = $.Deferred();
      return this._deferred.promise();
    },

    _showDialog: function () {
      var options = this.options;
      var initialLocation = this._getInitialLocation();

      this._headerControl = this._createHeaderControl(initialLocation);
      this._view = this._createPickerView(initialLocation);
      this._dialog = this._createDialog();
      this._dialog.show();
    },

    _createHeaderControl: function (initialLocation) {
      var options          = this.options,
          locationSelector = options.locationSelector == null ? true : options.locationSelector;
      var headerView = new HeaderView({
        locations: this._locations,
        title: options.dialogTitle,
        context: options.context,
        initialLocation: initialLocation,
        adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
        locationSelector: locationSelector,
        initialSelection: options.initialSelection
      });

      options.adduserorgroup &&
      headerView.startLocationView.on('change:location', this.onChangeLocation, this);
      return headerView;
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

      membersPickerView.on('changing:selection', this._blockDialog, this)
          .on('change:location', this.onChangeLocation, this);
      if (!!options.adduserorgroup) {
        membersPickerView.on('change:complete', this.onSelectionChange, this);
      }
      this.membersPickerView = membersPickerView;
      return membersPickerView;
    },

    dialogClassName: function () {
      var className = 'target-browse';
      if (this.options && this.options.userClassName) {
        className = className + " " + this.options.userClassName;
      }
      return className;
    },

    _createDialog: function () {
      var options       = this.options,
          dialogButtons = [{
            label: lang.cancelButtonLabel,
            close: true
          }];
      if (options.adduserorgroup) {
        dialogButtons = [
          {
            id: 'select',
            label: options.addButtonLabel || options.commandType.addButtonLabel,
            'default': true,
            disabled: true,
            click: _.bind(this.onClickAddButton, this)
          },
          {
            label: lang.cancelButtonLabel,
            close: true
          }
        ];
      }
      var dialog = new DialogView({
        title: options.dialogTitle,
        adduserorgroup: options.adduserorgroup ? options.adduserorgroup : false,
        headerView: this._headerControl,
        view: this._view,
        className: this.dialogClassName,
        userClassName: this.options.dialogClass,
        attributes: {
          'aria-label': options.dialogTitle
        },
        largeSize: true,
        buttons: dialogButtons
      });

      dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
      BlockingView.imbue(dialog);
      return dialog;
    },

    _blockDialog: function () {
      this._dialog.blockWithoutIndicator();
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
      this._view.destroy();
      this.membersPickerView.trigger('change:complete');
      this.options.previousLocation = location;
      this._view = this._createPickerView(location);
      var node = location.get("factory").container;
      this._dialog.showView(this._view);
    },

    onClickAddButton: function () {
      if (this && this._view && this._view.getSelection()) {
        var members = this._view.getSelection();
        this._result = {
          members: members
        };
        this._dialog.destroy();
      } else {
        this._dialog.updateButton('select', {disabled: true});
      }
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
      var disable = this._view.getNumberOfSelectItems() > 0, hasFilterName;
      if (member && member.get("id")) {
        this.options.locationID = member.get("id");
      }
      this._dialog.destroyBlockingView();
      if (this.options.saveFilter && this._headerControl && this._headerControl.ui.saveFilter) {
        hasFilterName = this._headerControl.ui.saveFilter.val().trim() ? true : false;
        if (hasFilterName && disable) {
          this._dialog.updateButton('select', {disabled: false});
        } else {
          this._dialog.updateButton('select', {disabled: true});
        }
      } else {
        this._dialog.updateButton('select', {disabled: !disable});
      }
    }

  });

  return MembersPickerDialog;

});
