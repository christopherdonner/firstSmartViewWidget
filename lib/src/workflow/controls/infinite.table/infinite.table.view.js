/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require",
  "csui/lib/jquery",
  "csui/lib/underscore",
  'csui/lib/moment',
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/table/table.view",
  'csui/utils/commands',
  'csui/utils/defaultactionitems',
  "workflow/controls/behaviors/wfstatus.infinite.scrolling.behavior",
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  'csui/lib/perfect-scrollbar'
], function (require, $, _, moment, Backbone, Marionette,
    TableView,
    commands,
    defaultActionItems,
    InfiniteScrollingBehavior,
    PerfectScrollingBehavior) {
  'use strict';

  var InfiniteScrollingTableView = TableView.extend({
        constructor: function InfiniteScrollingTableView(options) {
          InfiniteScrollingTableView.__super__.constructor.apply(this, arguments);
        },

        behaviors: {
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: 'tbody',
            suppressScrollX: true
          },
          InfiniteScrolling: {
            behaviorClass: InfiniteScrollingBehavior,
            contentParent: 'tbody',
            content: 'tbody>tr:visible',
            fetchMoreItemsThreshold: 10
          }
        }

      }
  );

  return InfiniteScrollingTableView;
});

