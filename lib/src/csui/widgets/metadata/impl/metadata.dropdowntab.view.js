/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/tab.panel/tab.panel.view', 'csui/widgets/metadata/metadata.panels',
  'csui/controls/tab.panel/tab.links.dropdown.view',
  'csui/models/browsing.state/nodes/nodes.browsing.state',
  'csui/utils/contexts/factories/browsing.states',
  'csui/models/version', 'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/lib/binf/js/binf'
], function (require, _, Backbone, TabPanelView, metadataPanels, TabLinkDropDownCollectionView,
    NodeBrowsingStateModel, BrowsingStateCollectionFactory, VersionModel, lang) {
  'use strict';

  var MetadataDropdownTabView = TabPanelView.extend({
    className: 'metadata-content-wrapper binf-panel binf-panel-default',

    ui: {
      dropdownToggle: '.binf-dropdown-toggle'
    },

    contentView: function () {
      return this.options.contentView;
    },

    contentViewOptions: function () {
      return {
        context: this.options.context,
        model: this.options.node,
        originatingView: this.options.originatingView,
        metadataView: this.options.metadataView,
        blockingParentView: this.options.blockingParentView,
        selectedProperty: this.options.selectedProperty
      };
    },

    constructor: function MetadataDropdownTabView(options) {
      this.options = options || (options = {});
      _.defaults(options, {
        TabLinkCollectionViewClass: TabLinkDropDownCollectionView,
        implementTabContentsDefaultKeyboardHandling: false,
        delayTabContent: options.delayTabContent !== false
      });

      options.tabs = this._buildTabs();

      TabPanelView.prototype.constructor.call(this, options);

      this.browsingStates = this.options.context &&
                            this.options.context.getCollection(BrowsingStateCollectionFactory);

      this.listenTo(this.options.node, "change", this._nodeChanged)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
      this.listenTo(this, 'before:destroy', this._clearBrowsingState);
    },

    _buildTabs: function () {
      return metadataPanels
          .chain()
          .filter(function (panel) {
            var contentView = panel.get('contentView'),
                enabled     = contentView.enabled;
            if (this.options.node.attributes.customProperties) {
              if (panel.attributes.executeCommand) {
                return !enabled || enabled({
                      context: this.options.context,
                      node: this.options.node
                    });
              } else {
                return false;
              }
            } else {
              return !enabled || enabled({
                    context: this.options.context,
                    node: this.options.node
                  });
            }
          }, this)
          .map(function (panel) {
            return panel.attributes;
          })
          .value();
    },

    onRender: function () {
      this.$el.prepend("<div class='csui-metadata-tab-bar'></div>");
      this._updateBrowsingState();
    },

    onActivateTab: function (tabContent, tabPane, tabLink) {
      tabContent && tabContent.triggerMethod('panel:activated');
      this._updateBrowsingState();
    },

    _updateBrowsingState: function () {
      if (this.browsingStates && this.options.node) {
        var stateChanged = false;
        var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
        var currentStateId = browsingState && browsingState.get('id');
        var newStateId = 'metadata';

        var titleNodeNameSuffix = lang.properties;
        var versionNumInTitle = '';
        var nodeName = this.options.node.get('name');
        var data = {path: {}, query: {}};
        data.path.node_id = this.options.node.get('id');
        var container = this.options.container || this.options.containerCollection;
        data.query.perspective = container ? 'metadata.navigation' : 'metadata';
        if (container && container.get('id') === this.options.node.get('id')) {
          data.query.perspective = 'metadata';
        }

        if (this.options.node instanceof VersionModel) {
          data.path.version_num = this.options.node.get('version_number');
          newStateId = 'version';
          versionNumInTitle = _.str.sformat(lang.versionNumInBrowserTitle, data.path.version_num);
        }

        var tabIndex = this.options.activeTab && this.options.activeTab.get('tabIndex');
        if (tabIndex !== undefined && this.options.collection &&
            tabIndex >= 0 && tabIndex < this.options.collection.length) {
          var tab = this.options.collection.at(tabIndex);
          data.query.panel = tab && tab.get('name');
          var activePanelTitle = tab && tab.get('title');
          activePanelTitle && (titleNodeNameSuffix = activePanelTitle);
        }

        if (versionNumInTitle.length > 0) {
          titleNodeNameSuffix = versionNumInTitle + ' ' + titleNodeNameSuffix;
        }
        data.path.node_name = nodeName + ' - ' + titleNodeNameSuffix;

        if (currentStateId !== newStateId) {
          data.query.container_id = this.options.node.get('parent_id');
          browsingState = new NodeBrowsingStateModel(data);
          browsingState.set('id', newStateId, {silent: true});
          this.browsingStates.push(browsingState, {silent: true});
          this.browsingState = browsingState;
          stateChanged = true;
        } else {
          var browsingStatePath = browsingState.get('path') || {};
          var browsingStateQuery = browsingState.get('query') || {};
          data.query = _.extend({}, browsingStateQuery, data.query);
          if (data.path.node_id !== browsingStatePath.node_id ||
              data.path.version_num !== browsingStatePath.version_num ||
              data.query.panel !== browsingStateQuery.panel) {
            stateChanged = true;
          }
          browsingState.set(data, {silent: true});
        }
        if (stateChanged && this.browsingStates.allowUrlUpdate) {
          this.browsingStates.trigger('state:change');
        } else if (this.browsingStates.updateBrowserTitleAfterPageLoaded === true) {
          this.browsingStates.updateBrowserTitleAfterPageLoaded = false;
          this.browsingStates.trigger('update:title');
        }
      }
    },

    _clearBrowsingState: function () {
      if (this.browsingStates && this.browsingState && this.options.node) {
        this.browsingStates.remove(this.browsingState, {silent: true});
        this.browsingState = undefined;
      }
    },

    _closeToggle: function () {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      if (dropdownToggleEl.parent().hasClass('binf-open')) {
        dropdownToggleEl.binf_dropdown('toggle');
      }
    },

    _updateTabs: function () {
      var tabs = this._buildTabs();
      this.collection.reset(this._convertCollection({tabs: tabs}).models);
    },

    _nodeChanged: function () {
      if (this.options.node.hasChanged('id') || this.options.node.hasChanged('type')) {
        this._updateTabs();
      }
    }

  });

  return MetadataDropdownTabView;

});
