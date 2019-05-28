/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'i18n!webreports/widgets/nodeslistreport/impl/nls/lang',
  'webreports/widgets/nodeslistreport/nodeslistreport.toolbaritems',
  'webreports/widgets/nodeslistreport/nodeslistreport.toolbaritems.masks',
  'webreports/utils/contexts/factories/nodestablereportcolumns',
  'webreports/utils/contexts/factories/nodestablereport',
  'csui/widgets/nodestable/nodestable.view', 'csui/controls/table/table.view',
  'webreports/models/nodestablereport/impl/nodestablereport.columns',
  'hbs!webreports/widgets/nodeslistreport/impl/nodestablereport',
  'css!webreports/widgets/nodeslistreport/impl/nodestablereport',
  'css!webreports/style/webreports.css'
], function ($, _, Backbone, Marionette, lang, toolbarItems, ToolbarItemsMasks,
             NodesTableReportColumnCollectionFactory, NodesTableReportChildrenCollectionFactory,
             NodesTable, TableView, myNodesTableReportColumns, template) {

  var NodesTableReportView = NodesTable.extend({

    template: template,

    className: 'webreports-nodestablereport',

    regions: {
      tableRegion: '#tableview',
      paginationRegion: '#paginationview'
    },

    constructor: function NodesTableReportView(options) {
      options || (options = {});
      options.data.titleBarIcon = ( _.has(options.data, 'titleBarIcon')) ? 'title-icon '+ options.data.titleBarIcon : 'title-icon title-webreports';
      options.toolbarItems = toolbarItems;

      if (!options.toolbarItemsMasks) {
          options.toolbarItemsMasks = new ToolbarItemsMasks();
      }

      NodesTable.prototype.constructor.call(this, options);

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
    },

    initialize: function () {

      var
          options = this.options,
          attributes,
          parameters;

      if (options && options.data) {
        attributes = {id: this.options.data.id};
          if (_.has(options.data, 'parameters')) {
              parameters = options.data.parameters;
              if(!_.isUndefined(parameters) && typeof parameters === "object") {
                  _.extend(attributes,{parameters: parameters});
              }
          }
          if (options.context) {
              _.extend(attributes,{context: options.context});
          }

      }

      this.collection = this.options.collection ||
          this.context.getCollection(NodesTableReportChildrenCollectionFactory, { attributes: attributes });
      this.columns = this.context.getCollection(NodesTableReportColumnCollectionFactory, { attributes: attributes });

      this.setView();

      return true;

    },

    onDestroy: function(){
      $(window).unbind("resize.app", this.onWinRefresh);
    },

    onRender: function () {
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

    setView: function () {

      this.setTableView({
        clientSideDataOperation: false,
        tableColumns: this.options.tableColumns || myNodesTableReportColumns,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks
      });

      this.setPagination();

    },
    tableDomRefresh: function () {
      this.tableView._onDomRefresh();
    },
    templateHelpers: function () {
      var helpers = {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon || 'title-webreports'
      };
      if (this.options.data.header !== false){
        _.extend(helpers,{header: true});
      }

      return helpers;
    },

    windowRefresh: function () {
      this.tableDomRefresh();
    }

  });

  return NodesTableReportView;
});
