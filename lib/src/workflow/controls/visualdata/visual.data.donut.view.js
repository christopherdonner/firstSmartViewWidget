/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/lib/d3',
  'hbs!workflow/controls/visualdata/impl/wfdonut',
  'css!workflow/controls/visualdata/impl/wfdonut'
], function (_, Marionette, $, d3, template) {

  'use strict';

  var WFStatusView = Marionette.ItemView.extend({

    className: 'wf-status-donut-piechart',

    template: template,

    rootElementType: "svg",

    defaults: {
      marginTop: 10,
      marginTopp: 60,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 20,
      groupAfter: 0
    },

    ui: {
      dataVisContainer: '.wf-status-visual-data-container',
    },
    onDestroy: function () {
      $(window).unbind('resize.app', this.render);
      $('.wfstatus-donut-chart-tooltip.toolTip').remove();
    },

    constructor: function WFStatusView(options) {
      this.options = options;
      this.parentEle = this.options.parent.$el;
      Marionette.ItemView.prototype.constructor.call(this, options);
      $(window).bind("resize.app", this.render);
    },
    onRender: function () {

      var minPadding           = -30;
      this.uniqueID = _.uniqueId('vis_');

      var width  = (this.width() > 0) ? this.width() : $(this.$el).width() - this.marginLeft()
                                                       - this.marginRight(),
          height = (this.height() > 0) ? this.height() : $(this.$el).height() -
                                                         this.marginTop() - this.marginBottom();

      this.visElement = d3.select(this.ui.dataVisContainer[0]).append(this.rootElementType)
          .attr("id", this.uniqueID)
          .attr("focusable", false)
          .attr("width", width + this.marginLeft() + this.marginRight())
          .attr("height", height - this.marginTopp());

      this.visElement.append('g')
          .attr('transform', 'translate(' + this.marginLeft() + ',' + '-' + 40 + ')')
          .attr('class', 'vis-wrapper');

      this.visElement.select('.vis-wrapper')
          .append('g')
          .attr('class', 'pie-chart')
          .attr('transform', 'translate(' + this.width() / 4 + ',' + this.height() / 2 + ')'); // center at 1/3

      this.visElement.select('.vis-wrapper')
          .append('g')
          .attr('class', 'pie-legend-container')
          .attr('transform',
              'translate(' + ((this.width() / 3 ) * 2 + minPadding - 30) + ',' + this.height() / 2 +
              ')'); // center at 2/3 + padding

      var tooltip = d3.select('body')
          .append("div")
          .attr("class", "wfstatus-donut-chart-tooltip toolTip");

      var contentView  = this,
          visElement   = contentView.visElement,
          colors       = ['#09bcef', '#8cc53e', '#f3794e'],
          color        = d3.scaleOrdinal(colors),
          chartData    = this.options.dataset,

          donutWidth   = 1.35, // thickness of donut ring
          radius       = Math.min(width / 4, height / 3) + 10,
          colorOpacity = 0.9,
          outlineStrokeWidth   = 1,
          outlineStrokeColor   = "#ffffff",
          outlineStrokeOpacity = "0.7";

      width = this.width() - this.marginLeft() - this.marginRight();
      height = this.width() - this.marginTop() - this.marginBottom();

      var arc = d3.arc()
          .innerRadius(radius / donutWidth)
          .outerRadius(radius);

      var pie = d3.pie()
          .sort(null)
          .value(function (d) {
            return d.count;
          });

      var segments = visElement.select('.pie-chart').selectAll('.arc')
          .data(pie(chartData))
          .enter().append('g')
          .attr('class', 'arc')
          .style('cursor', 'pointer');

      segments.append('path')
          .attr('d', arc)
          .attr('tabindex', function (d, i) {
            return d.data.count ? 0 : -1;
          })
          .attr('focusable', function (d, i) {
            return d.data.count ? true : false;
          })
          .attr('fill-opacity', colorOpacity)
          .style('fill', function (d, i) {
            return color(i);
          })
          .on("keyup", function (d) {
            if (d3.event.keyCode === 9) {
              visElement.select('.pie-chart').selectAll('.arc')
                  .filter(function (d2, i2) {
                    return (d2.data.status === d.data.status);
                  })
                  .attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          })
          .on("focusout", function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          })
          .on("keydown", function (d) {
            if (d3.event.keyCode === 13) {
              d3.event.data = {status: d.data.status};
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .on("mouseover", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            var mousePos = d3.mouse(d3.select("body").node());
            return tooltip.style("top", mousePos[1] - 25 + "px").style("left", mousePos[0] - 10 + "px");
          })
          .on("mouseout", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            return tooltip.style("visibility", "hidden");
          })
          .on("click", function (d) {
            d3.event.data = {status: d.data.status};
            contentView.options.parent.triggerMethod('click:segment', d3.event);
          });

      var donutTotal = visElement.select('.pie-chart')
          .append('g')
          .attr('class', 'pie-total-container')
          .style('cursor', 'pointer');

      var minFontSize      = 10,
          valueFontSize    = minFontSize,
          valueOffsetRatio = 10;

      donutTotal.append('text')
          .attr('tabindex', '0')
          .attr('class', 'total-count')
          .attr('transform', 'translate(0,' + (-(valueFontSize / valueOffsetRatio) - 10) + ')')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', "#cccccc")
          .text(this.totalCount(chartData))
          .on("focusout", function (d) {
            donutTotal.attr("stroke", "none");
          })
          .on("keydown", function (d) {
            if (d3.event.keyCode === 13) {
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .on("keyup", function (d) {
            if (d3.event.keyCode === 9) {
              donutTotal.attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          });

      donutTotal.append('text')
          .attr('class', 'total-text')
          .attr('transform', 'translate(0,' + (valueFontSize / valueOffsetRatio + 30) + ')')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', "#cccccc")
          .text('Total');

      var legendHeight = calculateLegendHeight() + 12;
      var pieLegendContainer = visElement.select('.pie-legend-container');
      pieLegendContainer.style('font-size', (legendHeight / 2) + 'px');
      var legends = pieLegendContainer.selectAll('.pie-legend')
          .data(pie(chartData))
          .enter().append('g')
          .attr('class', 'pie-legend')
          .on('mouseover', function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "red")
                .transition()
                .duration(1000)
                .attr("stroke-width", 2);
          })
          .on('mouseout', function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          })
          .on("click", function (d) {
            d3.event.data = {status: d.data.status};
            contentView.options.parent.triggerMethod('click:segment', d3.event);
          });
      legends.append('text')
          .attr('class', 'pie-legend-text wf-legend-text')
          .attr('tabindex', function (d, i) {
            return d.data.count ? 0 : -1;
          })
          .attr('focusable', function (d, i) {
            return d.data.count ? true : false;
          })
          .on("keydown", function (d) {
            if (d3.event.keyCode === 13) {
              d3.event.data = {status: d.data.status};
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .attr('dy', '1.2em') // individual offset to center text vertically
          .attr('transform', function (d, i) {
            var offset = (legendHeight * totalSegments(chartData) / 2) - 10,
                x      = getTextWidth(d, i) + legendHeight + 24,
                y      = (calculateYindex(i) * legendHeight) - offset;
            return 'translate(' + x + ',' + y + ')';
          })
          .attr('fill', "#cccccc")
          .text(function (d, i) {
            return d.data.count ? contentView.options.statusArray[d.data.status] : "";
          })
          .on("keyup", function (d) {
            if (d3.event.keyCode === 9) {
              legends.filter(function (d2, i2) {
                    return (d2.data.status === d.data.status);
                  })
                  .attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          })
          .on("focusout", function (d) {
            legends.filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          });

      legends.append('text')
          .attr('class', 'pie-legend-text wf-legend-count')
          .attr('dy', '1.2em')
          .attr('transform', function (d, i) {
            var offset = legendHeight * totalSegments(chartData) / 2,
                x      = 36,
                y      = (calculateYindex(i) * legendHeight) - offset;
            return 'translate(' + x + ',' + y + ')';
          })
          .text(function (d, i) {
            return d.data.count ? d.data.count : "";
          })
          .attr('fill', function (d, i) {
            return color(i);
          });
      legends.style('cursor', 'pointer');
      function calculateYindex(i) {
        if (i === 0) {
          return 0;
        } else {
          var totalCount = 0;
          _.each(chartData, function (set) {
            if (i > 0 && set.count !== 0) {
              totalCount++;
            }
            i--;
          });
          return totalCount;
        }

      }

      function calculateLegendHeight() {
        var n             = chartData.length || 1,
            minSwatchSize = 14, // smallest legible size (font is half this size)
            maxSwatchSize = 24,
            swatchSize;

        swatchSize = ((height * 2) / n) / 2;
        swatchSize = (swatchSize < minSwatchSize) ? minSwatchSize : swatchSize;
        swatchSize = (swatchSize > maxSwatchSize) ? maxSwatchSize : swatchSize;

        return swatchSize;
      }

      function totalSegments(data) {
        var totalSegments = 0;
        _.each(data, function (set) {
          if (set.count !== 0) {
            totalSegments++;
          }
        });
        return totalSegments;
      }

      function getTextWidth(d, i) {
        var textWidth     = 0,
            measuringSpan = document.createElement("span");
        measuringSpan.innerText = d.data.count;
        measuringSpan.style.visibility = 'hidden';
        $('body')[0].appendChild(measuringSpan);
        textWidth = $(measuringSpan).width();
        $('body')[0].removeChild(measuringSpan);
        return textWidth;
      }
    },

    marginTop: function () {
      return this.defaults.marginTop;
    },

    marginBottom: function () {
      return this.defaults.marginBottom;
    },

    marginLeft: function () {
      return this.defaults.marginLeft;
    },

    marginRight: function () {
      return this.defaults.marginRight;
    },

    marginTopp: function () {
      return this.defaults.marginTopp;
    },

    width: function () {

      return this.parentEle.width() - this.marginLeft() - this.marginRight();
    },

    height: function () {
      return this.parentEle.height() - this.marginTop() - this.marginBottom();

    },

    totalCount: function (data) {
      var totalCount = 0;
      _.each(data, function (set) {
        totalCount = totalCount + set.count;
      });
      return totalCount;
    }

  });

  return WFStatusView;

});
