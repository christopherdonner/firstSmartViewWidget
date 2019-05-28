/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/thumbnail/content/overview/overview.content',
  'csui/controls/thumbnail/content/content.view',
  'csui/controls/thumbnail/content/name/name.view',
  'csui/controls/thumbnail/content/properties/properties.view',
  'csui/controls/thumbnail/content/node.state/node.state.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!csui/controls/thumbnail/content/overview/impl/properties.overview'
], function (module, _, $, Backbone, Marionette, OverviewContent, DefaultContentView, NameView,
    PropertiesView, NodeStateView, PerfectScrollingBehavior, template) {
  'use strict';
  var PropertiesOverview = Marionette.LayoutView.extend({

    className: 'csui-overview-container',
    template: template,
    templateHelpers: function () {
      return {
        columns: this.columnModels
      };
    },
    regions: {
      nameRegion: '.csui-thumbnail-overview-name',
      propertiesRegion: '.csui-thumbnail-overview-properties',
      nodeStateRegion: '.csui-thumbnail-overview-reserved'
    },
    events: {
      'keydown': 'onKeyInView'
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-thumbnail-metadata-container',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    initialize: function () {
      this.propertiesCollection = this.getColumns();
      var self = this, columnModels = [];
      if (this.propertiesCollection && this.propertiesCollection.models) {
        _.each(this.propertiesCollection.models, function (model, index) {
          var region = model.get("key");
          if (!!self.model.get(region)) {
            columnModels.push(model);
          }
        });
      }
      this.columnModels = columnModels;
    },

    constructor: function PropertiesOverview(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.call(this, options);
      var self = this;
      if (this.columnModels) {
        _.each(this.columnModels, function (model, index) {
          var region  = model.get("key"),
              content = options.ContentFactory.getContentView(model);
          if (content) {
            self.addRegion(region, ".csui-thumbnail-overview-" + region);
          } else {
            self.addRegion(region, ".csui-thumbnail-overview-" + region);
          }
        }, this);
      }
    },

    getColumns: function () {
      var self = this,
          cols = [],
          properties;
      if (OverviewContent && OverviewContent.models) {
        this.fixedContent = OverviewContent.fixedOrRemovedOverviewContent;
        properties = OverviewContent.deepClone(); // use fresh collection every time
        properties.remove(
            properties.findWhere({key: 'properties'}));
        var columnModelsByKey = {}, clientNamingKey, serverNamingKey;
        this.options.columns.each(function (nodeColumnModel) {
          var key   = nodeColumnModel.get("column_key"),
              name  = nodeColumnModel.get("name"),
              order = nodeColumnModel.get("definitions_order");
          if (nodeColumnModel.get("isNaming") === true) {
            serverNamingKey = key;
            nodeColumnModel.unset('isNaming', {silent: true});
          }
          columnModelsByKey[key] = nodeColumnModel;
          if (nodeColumnModel.get("type") && order) {
            var tableColumnToMergeWithServerColumn = properties.findWhere({key: key});
            if (tableColumnToMergeWithServerColumn) {
              if (tableColumnToMergeWithServerColumn.get('isNaming') === true) {
                clientNamingKey = tableColumnToMergeWithServerColumn.get("key");
              }
              var sequence = tableColumnToMergeWithServerColumn.get('sequence');
              var mergedColumnAttributes = _.extend({sequence: sequence},
                  nodeColumnModel.attributes);
              tableColumnToMergeWithServerColumn.set(mergedColumnAttributes);
            } else {
              nodeColumnModel.attributes.sequence = order;
              properties.add(nodeColumnModel.attributes);
            }
          }
          if (self.fixedContent.indexOf(key) >= 0) {
            properties.remove(
                properties.findWhere({key: key}));
          }
        }, this);
      }
      return properties;
    },

    currentlyFocusedElement: function (event) {
      return this.$el.find(":focusable")[0];
    },

    onKeyInView: function (event) {
      if (event && event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();
        var popoverTarget = this.$el.parents('body').find('.binf-popover');
        popoverTarget.parent().click();
      }
    },

    onRender: function (e) {
      var self = this;
      var nameView = new NameView({
        model: self.model,
        context: self.options.context,
        column: {name: 'name', defaultAction: false},
        displayIcon: true
      });
      this.nameRegion.show(nameView);
      if (this.columnModels) {
        _.each(this.columnModels, function (model, index) {
          var content = this.options.ContentFactory.getContentView(model);
          content = content ? content : DefaultContentView;
          if (content) {
            var region        = model.get("key"),
                defaultAction = model.get("defaultAction"),
                displayLabel  = true,
                displayIcon   = model.get("displayIcon"),
                name          = model.get("key");
            var contentView = new content({
              tagName: 'DIV',
              contentModel: model,
              model: self.model,
              context: self.options.context,
              column: {name: name, defaultAction: defaultAction},
              displayLabel: displayLabel,
              displayIcon: displayIcon
            });
            self[region].show(contentView);
            if (contentView.$el.find(".csui-thumbnail-value p").length > 0 &&
                contentView.$el.find(".csui-thumbnail-value p")[0].innerHTML === "") {
              contentView.$el.parent().addClass("binf-hidden");
            }
            self.listenTo(contentView, 'clicked:content', function (event) {
              self.trigger('clicked:content', {
                contentView: contentView,
                rowIndex: self._index,
                colIndex: index,
                model: self.model
              });
            });
          }
        }, this);
      }
      var propertiesView = new PropertiesView({
        model: self.model,
        context: self.options.context,
        column: {name: 'properties', defaultAction: true},
        displayIcon: true,
        selectedChildren: self.options.selectedChildren,
        collection: self.options.collection,
        originatingView: self.options.originatingView
      });
      this.propertiesRegion.show(propertiesView);
      var nodeStateView = new NodeStateView({
        model: self.model,
        context: self.options.context,
        column: {name: 'reserved', defaultAction: true},
        displayTitle: false,
        selectedChildren: self.options.selectedChildren,
        collection: self.options.collection,
        originatingView: self.options.originatingView,
        targetView: this
      });
      this.nodeStateRegion.show(nodeStateView);
    }

  });
  return PropertiesOverview;
});