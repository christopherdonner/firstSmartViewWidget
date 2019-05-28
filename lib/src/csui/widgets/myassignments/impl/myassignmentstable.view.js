/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log",
  'csui/utils/contexts/factories/myassignmentscolumns',
  'csui/utils/contexts/factories/myassignments',
  'csui/controls/table/rows/description/description.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/myassignments/myassignments.columns',
  'csui/widgets/nodestable/nodestable.view',
  'hbs!csui/widgets/myassignments/impl/myassignmentstable',
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  'css!csui/widgets/myassignments/impl/myassignmentstable'
], function (module, $, _, Backbone, Marionette, log,
    MyAssignmentsColumnCollectionFactory, MyAssignmentsCollectionFactory,
    DescriptionRowView, LayoutViewEventsPropagationMixin,
    myAssignmentsTableColumns, NodesTable, template, lang) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  var MyAssignmentsTableView = NodesTable.extend({

    template: template,

    className: '',

    regions: {
      tableRegion: '#tableviewMA',
      paginationRegion: '#paginationviewMA'
    },

    constructor: function MyAssignmentsTableView(options) {
      NodesTable.prototype.constructor.apply(this, arguments);

      this.propagateEventsToRegions();
    },

    initialize: function () {
      this.collection = this.options.collection ||
                        this.context.getCollection(MyAssignmentsCollectionFactory);
      this.columns = this.collection.columns ||
                     this.context.getCollection(MyAssignmentsColumnCollectionFactory);

      _.defaults(this.options, {
        orderBy: 'date_due asc',
        tableColumns: myAssignmentsTableColumns
      });

      this.setTableView({
        nameEdit: false,
        descriptionRowView: DescriptionRowView,
        descriptionRowViewOptions: {
          firstColumnIndex: 1, lastColumnIndex: 2,
          showDescriptions: !accessibleTable,
          collapsedHeightIsOneLine: false
        },
        selectRows: "none",
        selectColumn: false,
        haveDetailsRowExpandCollapseColumn: false,
        tableColumns: this.options.tableColumns,
        tableTexts: {
          zeroRecords: lang.emptyListText
        },
        inlineBar: {
          options: {}
        }
      });

      this.setPagination();

      if (this.options.collection) {
        this.collection.fetched = false;
      }

    },

    onDestroy: function () {
      if (this.options.collection) {
        this.collection.setResourceScope(this._originalScope);
      }
      NodesTable.prototype.onDestroy.call(this);
    },

    onRender: function () {
      if (this.options.collection && !this.collection.fetched) {
        this._originalScope = this.collection.getResourceScope();
        this.collection.setResourceScope(MyAssignmentsCollectionFactory.getDefaultResourceScope());
        this.collection.setExpand('assignments',
            ['from_user_id', 'location_id', 'workflow_id',
              'workflow_subworkflow_id', 'workflow_subworkflow_task_id']
        );
        this.collection.fetch({reload: true});
      }

      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    }

  });

  _.extend(MyAssignmentsTableView.prototype, LayoutViewEventsPropagationMixin);

  return MyAssignmentsTableView;

});
