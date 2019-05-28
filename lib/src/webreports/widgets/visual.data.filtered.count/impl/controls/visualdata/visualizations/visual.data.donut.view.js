/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.content.view'
], function (_, $, d3, VisualDataContentView) {

    var VisualDataDonutContentView = VisualDataContentView.extend({

        constructor: function VisualDataPieContentView(options) {
            VisualDataContentView.prototype.constructor.apply(this, arguments);
        },

        defaults: {
            marginTop: 30,
            marginRight: 30,
            marginBottom: 30,
            marginLeft: 30,
            groupAfter: 5
        },

        visType: 'donut',

        appendVisElements: function () {
            var minPadding = 40; // minimum padding between chart and legend when widget width is reduced

            this.visElement.append('g')
                .attr('transform', 'translate(' + this.marginLeft() + ',' + this.marginTop() + ')')
                .attr('class', 'vis-wrapper');

            this.visElement.select('.vis-wrapper')
                .append('g')
                .attr('class', 'pie-chart')
                .attr('transform', 'translate(' + this.width() / 3 + ',' + this.height() / 2 + ')'); // center at 1/3

            this.visElement.select('.vis-wrapper')
                .append('g')
                .attr('class', 'pie-legend-container')
                .attr('transform', 'translate(' + ((this.width() / 3 ) * 2 + minPadding) + ',' + this.height() / 2 + ')'); // center at 2/3 + padding
        },

        update: function () {

            var contentView = this,
                visElement = contentView.visElement,
                colors = d3.schemeCategory20,
                color = d3.scaleOrdinal(colors),
                chartData = contentView.collection.models,
                sum = chartData.reduce(function (memo, value) {
                    return memo + value.get('value');
                }, 0),
                donutWidth = 1.5, // thickness of donut ring
                width = this.$el[0].clientWidth - this.marginLeft() - this.marginRight(), // this.width() or this.height() does not work in expanded view
                height = this.$el[0].clientHeight - this.marginTop() - this.marginBottom(),
                radius = Math.min(width / 3, height / 2), // 1/3 of width or half of height
                colorOpacity = 0.9;

            function pieLabel(d, i) {
                var actual = chartData[i].get('value'),
                    percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1),
                    arcSize = d.endAngle - d.startAngle, // in radians
                    minRadius = 100, // minimum radius for labels to appear
                    minArcLength = 44, // ratio of radius to arcSize to determine if label will appear on this arc (arcSize / minArcSizeRatio)
                    label = (contentView.collection.overlayModel.get('view_value_as_percentage')) ? percentage + ' %' : contentView.formatCount(actual);

                label = ((radius * arcSize >= minArcLength) && (radius >= minRadius)) ? label : '';
                return label;
            }

            function explode(d, i, offset) {
                var radial = (d.startAngle + d.endAngle) / 2,
                    offsetX = Math.sin(radial) * offset,
                    offsetY = -Math.cos(radial) * offset;
                return 'translate(' + offsetX + ',' + offsetY + ')';
            }

            function extractSlice(d, i) {
                visElement.selectAll('.arc path,.pie-legend rect,.pie-legend text')
                    .filter(function (d2, i2) {
                        return (d2.index !== d.index);
                    });
                return explode(d, i, 15);
            }

            function replaceSlice(d, i) {
                visElement.selectAll('.arc path,.pie-legend rect').attr('fill-opacity', colorOpacity);
                return explode(d, i, 0);
            }

            function calculateLegendHeight() {
                var n = chartData.length || 1,
                    minSwatchSize = 14, // smallest legible size (font is half this size)
                    maxSwatchSize = 24,
                    swatchSize;

                swatchSize = ((height *2) / n) / 2;
                swatchSize = (swatchSize < minSwatchSize) ? minSwatchSize : swatchSize;
                swatchSize = (swatchSize > maxSwatchSize) ? maxSwatchSize : swatchSize;

                return swatchSize;
            }

            function fontSizeForTotal(innerDiscSize) {
                var stringLength = (contentView.formatCount(sum).length),
                    fontRatios = [1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8], // a hash is faster than Math ;-)
                    fontRatio = (stringLength <= fontRatios.length) ? fontRatios[stringLength - 1] : 12; // 12 is smallest size possible
                return innerDiscSize / fontRatio;
            }

            var arc = d3.arc()
                .innerRadius(radius / donutWidth)
                .outerRadius(radius);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.get('value');
                });

            var segments = visElement.select('.pie-chart').selectAll('.arc')
                .data(pie(chartData))
                .enter().append('g')
                .attr('class', function () {
                    var myClasses = 'arc';
                    return myClasses;
                });

            segments.append('path')
                .attr('d', arc)
                .attr('fill-opacity', colorOpacity)
                .style('fill', function (d, i) {
                    return color(i);
                });

            segments.append('text')
                .attr('class', 'chart-label')
                .attr('transform', function (d) {
                    return 'translate(' + arc.centroid(d) + ')';
                })
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', 14)
                .text(pieLabel);
            var pieLegendContainer = visElement.select('.pie-legend-container');

            var legends = pieLegendContainer.selectAll('.pie-legend')
                .data(pie(chartData))
                .enter().append('g')
                .attr('class', 'pie-legend')
                .on('mouseover', function (d) {
                    visElement.selectAll('.arc')
                        .filter(function (d2, i2) {
                            return (d2.index === d.index);
                        })
                        .attr('transform', extractSlice);
                })
                .on('mouseout', function (d) {
                    visElement.selectAll('.arc')
                        .filter(function (d2, i2) {
                            return (d2.index === d.index);
                        })
                        .attr('transform', replaceSlice);
                });

            var legendHeight = calculateLegendHeight();

            pieLegendContainer.style('font-size',(legendHeight / 2) + 'px');
            legends.append('text')
                .attr('class', 'pie-legend-text')
                .attr('dy','1.2em') // individual offset to center text vertically
                .attr('transform', function (d, i) {
                    var offset = legendHeight * chartData.length / 2,
                        x = legendHeight + 10, // swatch + 10px margin
                        y = (i * legendHeight) - offset;
                    return 'translate(' + x + ',' + y + ')';
                })
                .text(function (d, i) {
                    return contentView.collection.grouped_on_server ? d.data.get('key_formatted') : d.data.get('key');
                });

            legends.append('rect')
                .attr('class', 'pie-legend-swatch')
                .attr('width','2em')
                .attr('height', legendHeight - 4) // 4px padding
                .attr('fill-opacity', colorOpacity)
                .attr('transform', function (d, i) {
                    var offset = legendHeight * chartData.length / 2,
                        x = 0,
                        y = (i * legendHeight) - offset;
                    return 'translate(' + x + ',' + y + ')';
                })
                .attr('fill', function (d, i) {
                    return color(i);
                });

            var donutTotal = visElement.select('.pie-chart')
                .append('g')
                .attr('class', 'pie-total-container');

            var minFontSize = 10,
                valueFontSize = (fontSizeForTotal(radius / donutWidth) >= minFontSize) ? fontSizeForTotal(radius / donutWidth) : minFontSize,
                labelRatio = 2.3,
                valueOffsetRatio = 10,
                labelOffsetRatio = 1.5,
                innerDiscMargin = 10;

            donutTotal.append('g')
                .attr('class', 'pie-total-label-disc')
                .append('circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', (radius / donutWidth) - innerDiscMargin);

            donutTotal.append('text')
                .attr('transform', 'translate(0,' + (-(valueFontSize / labelOffsetRatio)) + ')')
                .attr('class', 'pie-total-label')
                .attr('text-anchor', 'middle')
                .attr('font-size', valueFontSize / labelRatio)
                .text(function () {
                    return (valueFontSize / labelRatio >= 8) ? 'Total' : '';  // FIXME XLATE: 'Total'
                });

            donutTotal.append('text')
                .attr('class', 'total')
                .attr('transform', 'translate(0,' + (valueFontSize / valueOffsetRatio) + ')')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', valueFontSize) // pass in the inner disc radius to get the right font size
                .text(contentView.formatCount(sum));

            pieLegendContainer.append('text')
                .attr('class', 'pie-legend-active-column')
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('y', 0)
                .attr('x', 0)
                .attr('dy', -20)
                .text(this.model.get('active_column_formatted'));

        }

    });

    return VisualDataDonutContentView;

});
