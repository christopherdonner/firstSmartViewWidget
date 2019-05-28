/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/dialog/dialog.view',
  'csui/dialogs/node.picker/impl/node.picker.view',
  'csui/utils/contexts/factories/connector', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model',
  'csui/dialogs/node.picker/start.locations/start.location.collection',
  'csui/dialogs/node.picker/impl/header/header.view',
  'csui/dialogs/node.picker/impl/footer/footer.view',
  'csui/dialogs/node.picker/impl/command.type',
  'i18n!csui/dialogs/node.picker/impl/nls/lang', 'csui/utils/log',
  'csui/controls/progressblocker/blocker',
  'css!csui/dialogs/node.picker/impl/node.picker'
], function (module, _, $, Backbone, Marionette, DialogView, NodePickerView,
    ConnectorFactory, NodeModelFactory, NodeModel, StartLocationCollection,
    HeaderView, FooterView, CommandType, lang, log, BlockingView, dialogTemplate) {
  "use strict";

  var config = _.extend({
    initialLocationLookupOrder: [
      'csui/dialogs/node.picker/start.locations/recent.containers',
      'csui/dialogs/node.picker/start.locations/current.location',
      'csui/dialogs/node.picker/start.locations/favorites']
  }, module.config());

  var defaultOptions = {
    initialSelection: [],
    selectMultiple: false,
    unselectableNodes: [],
    dialogTitle: lang.dialogTitle,
    orderBy: 'name asc'
  };

  function NodePicker(options) {
    options || (options = {});
    this.options = _.defaults(options, defaultOptions, {pageSize: 30});
    this.options.connector || (this.options.connector = this._getConnector(this.options));

    if (!this.options.connector) {
      var msg = 'Node Picker: insufficient options';
      log.error(msg) && console.error(msg);
      throw new Error(msg);
    }
    this.options.targetBrowseHistory = [];
    this.options.navigateFromHistory = false;

    this.options.initialContainer = this._getInitalContainer(this.options);
    this.options.unselectableNodes = this._getArrayOfNodeIds(options.unselectableNodes);
    this.options.commandType = new CommandType(this.options);
  }

  _.extend(NodePicker.prototype, {

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
      this.recentLocations = this._locations.get(
          'csui/dialogs/node.picker/start.locations/recent.containers');

      var invalidLocations = this._locations.where({invalid: true});
      this._locations.remove(invalidLocations);

      var initialLocation = this._getInitialLocation();
      this.searchLocation = initialLocation;

      this._headerControl = this._createHeaderControl(initialLocation);
      this._view = this._createNodePickerView(initialLocation);
      this._footerView = this._createFooterViewControl();
      this._dialog = this._createDialog();

      this._dialog.show();
    },

    _createHeaderControl: function (initialLocation) {
      var options          = this.options,
          locationSelector = options.locationSelector == null ? true : options.locationSelector;
      this.options.previousLocation = initialLocation;
      var headerView = new HeaderView({
        locations: this._locations,
        title: options.dialogTitle,
        initialLocation: initialLocation,
        includeCombineProperties: options.includeCombineProperties,
        propertiesSeletor: options.propertiesSeletor,
        saveFilter: options.saveFilter,
        locationSelector: locationSelector,
        initialSelection: options.initialSelection,
        globalSearch: options.globalSearch
      });

      headerView.startLocationView.on('change:location', this.onChangeLocation, this);
      headerView.on('change:filterName', this.onChangeFilterName, this);
      headerView.on('focusout:filterName', this.onFocusOutFilterName, this);
      if (headerView.searchBoxView) {
        headerView.searchBoxView.on('change:searchterm', this.onChangeSearchTerm, this);
      }

      return headerView;
    },

    _createNodePickerView: function (location) {
      this.options.searchView = false;
      var locationFactory    = location.get('factory'),
          locationParameters = locationFactory.getLocationParameters(this.options);

      _.defaults(locationParameters, this.options);
      var view = new NodePickerView(locationParameters);

      view
          .on('change:complete', this.onSelectionChange, this)
          .on('changing:selection', this._blockDialog, this)
          .on('back:toSearch', this.onClickBackFromFolderToSearch, this)
          .on('change:location', this.onChangeLocationFromBack, this)
          .on('backto:folder', this.onClickBackFromSearch, this)
          .on('close', this.forceClosed, this);
      view.selectViews.on('drill:up', this.onDrillUp, this);

      return view;
    },

    _createFooterViewControl: function () {
      var options    = this.options,
          footerView = new FooterView({
            isMultiSelectEnabled: this.options.commandType.multiSelect,
            buttons: [
              {
                id: 'select',
                label: options.selectButtonLabel || options.commandType.selectButtonLabel,
                'default': true,
                disabled: true,
                click: _.bind(this.onClickSelectButton, this)
              },
              {
                id: 'cancel',
                label: lang.cancelButtonLabel,
                close: true,
                click: _.bind(this.onClickCancelButton, this)
              }
            ]
          });
      return footerView;
    },

    _blockDialog: function () {
      this._dialog.blockWithoutIndicator();
      return true;
    },

    dialogClassName: function () {
      var className = 'target-browse';
      if (this.options && this.options.view && this.options.view.options &&
          this.options.view.options.saveFilter) {
        className = className + ' csui-save-filter-browse';
      }
      return className;
    },

    _createDialog: function () {
      var options = this.options,
          dialog  = new DialogView({
            title: options.dialogTitle,
            headerView: this._headerControl,
            view: this._view,
            className: this.dialogClassName,
            attributes: {
              'aria-label': options.dialogTitle
            },
            largeSize: true,
            footerView: this._footerView
          });

      dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
      BlockingView.imbue(dialog);
      return dialog;
    },

    onChangeLocation: function (location) {
      this.options.targetBrowseHistory = [];
      this._view.destroy();
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      this.options.previousLocation = location;
      this._view = this._createNodePickerView(location);
      var node = location.get("factory").container;
      this.updateSearch(node);
      this._dialog.showView(this._view);
    },

    onChangeSearchTerm: function (args) {
      this._headerControl.searchQueryModel = args;
      this._view.destroy();
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      if (this.options.targetBrowseHistory.length === 0) {
        this.options.targetBrowseHistory.push(['location', this.options.previousLocation.id]);
      }
      if (!this._view.options.navigateFromHistory && !this.options.searchView) {
        var leftView  = this._view.selectViews.leftView,
            rightView = this._view.selectViews.rightView,
            page      = Math.floor((leftView.collection.skipCount || 0) /
                                   leftView.collection.topCount) + 1,
            pageSize  = parseInt(leftView.collection.topCount) *
                        parseInt(page);
        if (leftView.container && rightView) {
          var nodeObj = {
            "leftId": (rightView && rightView.container && rightView.container.parent) ?
                      rightView.container.parent.get("id") : undefined,
            "rightId": rightView && rightView.container ? rightView.container.get("id") : undefined,
            "pageSize": pageSize
          };
          this.options.targetBrowseHistory.push(['node', nodeObj]);
        } else if (leftView.container && rightView === null &&
                   (["csui/dialogs/node.picker/start.locations/current.location",
                      "csui/dialogs/node.picker/start.locations/enterprise.volume"].indexOf(
                       this.options.previousLocation.get('id')) < 0)) {
          var nodeObj1 = {
            "leftId": leftView.container.get("id"),
            "rightId": undefined,
            "pageSize": pageSize
          };
          this.options.targetBrowseHistory.push(['node', nodeObj1]);
        }
      }
      this.options.locationID = !!this._view.breadcrumbNode ? this._view.breadcrumbNode.get("id") :
                                this.options.locationID;
      this.searchLocation = this.options.previousLocation;
      var location = this._locations.get(
          'csui/dialogs/node.picker/start.locations/search.location');
      this._view = this._createSearchResultsView(location);
      this._dialog.showView(this._view);
    },

    _createSearchResultsView: function (location, isBackClick) {
      if (this._headerControl.searchQueryModel) {
        this.options.query = this._headerControl.searchQueryModel;
      }
      this.options.searchView = true;
      var locationFactory    = location.get('factory'),
          locationParameters = locationFactory.getLocationParameters(this.options);

      _.defaults(locationParameters, this.options);
      var view = new NodePickerView(locationParameters);

      view
          .on('change:complete', this.onSelectionChange, this)
          .on('changing:selection', this._blockDialog, this)
          .on('open:location', this.onClickLocationFromSearch, this)
          .on('change:location', this.onChangeLocationFromBack, this)
          .on('back:toSearch', this.onClickBackFromFolderToSearch, this)
          .on('backto:folder', this.onClickBackFromSearch, this)
          .on('close', this.forceClosed, this);

      return view;
    },

    onChangeLocationFromBack: function (args) {
      this.options.targetBrowseHistory = [];
      var location = this._locations.get(args[1]);
      this._view.destroy();
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      this.options.previousLocation = location;
      this._view = this._createNodePickerView(location);
      var node = location.get("factory").container;
      this.updateSearch(node);
      this._dialog.showView(this._view);
      this._view.selectViews.options.backBtn = true;
    },

    onClickBackFromSearch: function () {
      this._view.destroy();
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      var locationID = !!this.options.locationID ? this.options.locationID :
                       this.options.container ? this.options.container.get("id") :
                       this.options.nodes.models.length > 0 ?
                       this.options.nodes.models[0].get("id") : null;
      var nodeModel = new NodeModel({id: locationID}, {connector: this.options.connector});
      this.updateSearch(nodeModel, undefined, true);
      var location = this._locations.get(
          'csui/dialogs/node.picker/start.locations/search.location');
      if (this.options.locationID === 0) {
        location = this.options.previousLocation;
      }
      if (!!location) {
        var locationFactory = location.get("factory");
        locationFactory.options.container = nodeModel;
        this._view = this._createNodePickerView(location);
        if (this._view) {
          this._dialog.showView(this._view);
        }
      }
      this._view.selectViews.options.backBtn = true;
    },

    onClickLocationFromSearch: function (nodeModel) {
      this._view.destroy();
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      var location        = this._locations.get(
          'csui/dialogs/node.picker/start.locations/default.location'),
          locationFactory = location.get("factory");
      locationFactory.options.container = nodeModel;
      this.options.targetBrowseHistory.push(['search', this.options.query.clone()]);
      this._view = this._createNodePickerView(location);
      if (this._view) {
        this._dialog.showView(this._view);
        this._view.showBackButton();
      }
    },

    onClickBackFromFolderToSearch: function (view) {
      this._view.destroy();
      this._headerControl.searchQueryModel = view.requestedQueryModel;
      this.updateSearch(view.options.container, view.requestedQueryModel, true);
      this.updateFooterSelectedList();
      this._dialog.updateButton('select', {disabled: true});
      var location = this._locations.get(
          'csui/dialogs/node.picker/start.locations/search.location');
      this._view = this._createSearchResultsView(location, true);
      this._view.options.navigateFromHistory = view.options.navigateFromHistory;
      this._dialog.showView(this._view);
      this._view.selectViews.options.backBtn = true;
    },

    onSelectionChange: function (node) {
      var disable = this._view.getNumberOfSelectItems() > 0, hasFilterName;
      if (node && node.get("id") && node.get("name")) {
        this.options.locationID = node.get("id");
        this.updateSearch(node);
        this.updateHeaderStartLocation(node);
      }
      this.updateFooterSelectedList();
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
      if (!!this._view.selectViews.options.backBtn) {
        this._view.selectViews.options.backBtn = false;
        this._view.$el.find('.list-content li:first-child').focus();
      }
    },

    onChangeFilterName: function () {
      var eleLoadContainer = this._dialog.$el.find("div[class='load-container']");
      if (this.options.saveFilter && eleLoadContainer && eleLoadContainer.length === 0) {
        var hasFilterName, disable, isEmpty = true;
        if (this._headerControl.ui.saveFilter) {
          isEmpty = this._headerControl.ui.saveFilter.val().trim().length < 1 ? true : false;
        }
        disable = this._view.getNumberOfSelectItems() > 0;
        this.updateFooterSelectedList();
        if (this._headerControl && this._headerControl.ui.saveFilter) {
          hasFilterName = !isEmpty;
        }
        if (hasFilterName && disable) {
          this._dialog.updateButton('select', {disabled: false});
        } else {
          this._dialog.updateButton('select', {disabled: true});
        }
      }
    },

    onFocusOutFilterName: function () {
      this.isValidVirtualFolderName();
    },

    isValidVirtualFolderName: function () {
      var isEmpty       = false,
          isColonExists = false;
      if (this._headerControl.ui.saveFilter && this._headerControl.ui.saveFilter.length === 1 &&
          this._headerControl.ui.saveFilter.val() !== undefined &&
          this._headerControl.ui.saveFilter.val() !== null) {
        isEmpty = this._headerControl.ui.saveFilter.val().trim().length < 1 ? true : false;
        isColonExists = this._headerControl.ui.saveFilter.val().indexOf(":") >= 0 ? true :
                        false;
      }

      if (isEmpty) {
        this._headerControl.showErrorMessage(lang.nameCannotBeEmpty);
      } else if (isColonExists) {
        this._headerControl.showErrorMessage(lang.nameCannotContainColon);
      } else {
        this._headerControl.removeErrorMessage();
      }
      return !isEmpty && !isColonExists;
    },

    updateHeaderStartLocation: function (node) {
      if (this.options.commandType.browseAllowed(node)) {
        this._headerControl.hideStartLocationLabel(node);
      }
    },

    updateSearch: function (node, queryModel, flag) {
      var locationID   = !!node ? node.get("id") : undefined,
          locationName = !!node ? node.get("name") : "";
      if (this._headerControl.searchBoxView && this._headerControl.searchboxModel) {
        if (flag) {
          var prevLocation = queryModel ? queryModel.get("location_id1") :
                             this._headerControl.searchBoxView.model.get("location_id1");
          this._headerControl.searchboxModel.nodeId = prevLocation;
        } else {
          this._headerControl.searchboxModel.nodeId = locationID;
        }
        this._headerControl.searchboxModel.nodeName = locationName;
        this._headerControl.searchboxModel.trigger("change");
      }
    },

    updateFooterSelectedList: function () {
      var selectedItemsCnt = this._view.getNumberOfSelectItems();
      this._footerView.trigger("selectedItems:updateCount", selectedItemsCnt);
    },

    onClickSelectButton: function () {
      if (this && this._view && (this._view.getSelection().length > 0)) {
        var nodes      = this._view.getSelection(),
            properties = this._headerControl.propertiesView,
            filterName;
        if (this._headerControl.searchQueryModel) {
          this._headerControl.searchQueryModel.clear({silent: true});
        }
        if (this._headerControl.ui && this._headerControl.ui.saveFilter &&
            this.isValidVirtualFolderName()) {
          filterName = this._headerControl.ui.saveFilter.val();
        } else {
          return;
        }
        this._result = {
          nodes: nodes,
          applyProperties: properties && properties.selected,
          openSelectedProperties: properties && properties.openSelectedProperties,
          filterName: filterName
        };
        this._dialog.destroy();
      } else {
        this._dialog.updateButton('select', {disabled: true});
      }
    },

    onHideDialog: function () {
      if (this._deferred) {
        if (this._result) {
          this._deferred.resolve(this._result);
        } else if (this._deferred.state() === 'pending') {
          this._deferred.reject({cancelled: true});
        }
      }
      if (this._headerControl.searchQueryModel) {
        this._headerControl.searchQueryModel.clear({silent: true});
      }
    },

    onDrillUp: function (nodeId) {
      this.options.container = new NodeModel({id: nodeId}, {connector: this.options.connector});
      this._locations.get('csui/dialogs/node.picker/start.locations/search.location').get(
          'factory').options.container = this.options.container;
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

    _getInitalContainer: function (options) {
      var container = this.options.initialContainer;

      if (container == null || _.isEmpty(container)) {
        var node = options.context && options.context.getModel(NodeModelFactory);
        if (node != null && node.parent != null && node.parent.isFetchable()) {
          if (node.parent.get("id") === 1 || node.get("container")) {
            container = node.clone();
          } else {
            container = node.parent.clone();
          }
        } else {
          container = null;
        }
      } else if (!(container instanceof Backbone.Model)) {
        container = new NodeModel(container, {connector: this.options.connector});
      }

      return container;
    },

    _getArrayOfNodeIds: function (unselectableNodes) {

      if (unselectableNodes && !_.isEmpty(unselectableNodes)) {
        if (unselectableNodes[0] instanceof Backbone.Model) {
          return _.map(unselectableNodes, function (node) {
            return node.get('id');
          });
        }
      }

      return unselectableNodes;
    },

    _getInitialLocation: function () {
      var locationId = this.options.startLocation,
          initialLocation;
      if (locationId) {
        var lastSlash = locationId.lastIndexOf('/');
        if (lastSlash < 0) {
          locationId = 'csui/dialogs/node.picker/start.locations/' + locationId;
        }
        initialLocation = this._locations.get(locationId);
      }
      if (!initialLocation) {
        initialLocation = !_.isEmpty(this.options.initialContainer) &&
                          this._locations.get(
                              'csui/dialogs/node.picker/start.locations/current.location');
        if (!initialLocation) {
          _.find(config.initialLocationLookupOrder,
              function (locationId) {
                initialLocation = this._locations.get(locationId);
                return initialLocation;
              }, this);
          initialLocation || (initialLocation = this._locations.first());
        }
      }
      return initialLocation;
    },

    onClickCancelButton: function () {
      this._dialog.destroy();
    }
  });

  NodePicker.defaults = {

    containers: {
      selectableTypes: [-1],
      dialogTitle: lang.dialogTitleForContainers
    },

    documents: {
      selectableTypes: [144],
      dialogTitle: lang.dialogTitleForDocuments
    },

    categories: {
      initialContainer: {
        id: 'volume',
        type: 133
      },
      selectableTypes: [131],
      dialogTitle: lang.dialogTitleForCategories
    }

  };

  return NodePicker;

});
