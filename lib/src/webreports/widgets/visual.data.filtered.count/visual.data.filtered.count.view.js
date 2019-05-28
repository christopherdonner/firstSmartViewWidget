/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.donut.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.bar.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.pie.view',
    'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data'
], function (_, VisualDataView, DonutContentView, BarContentView, PieContentView) {

      var VisualDataFilteredCountView = VisualDataView.extend({

          constructor: function VisualDataFilteredCountView(options) {

              options.data.titleBarIcon = ( _.has(options.data, 'titleBarIcon')) ? 'title-icon '+ options.data.titleBarIcon : 'title-icon title-webreports';

              this.contentView = this._getContentView(options);
              this.contentViewOptions = options;
              VisualDataView.prototype.constructor.apply(this, arguments);

          },
          _getContentView: function (options) {
              var contentView = BarContentView;
              var chartType;
              if (options && options.data && options.data.type){
                  chartType = options.data.type;
                  switch(chartType) {
                      case "donut":
                          contentView = DonutContentView;
                          break;
                      case "pie":
                          contentView = PieContentView;
                          break;
                      default:
                          contentView = BarContentView;
                  }
              }

              return contentView;
          }

      });

    return VisualDataFilteredCountView;

});
