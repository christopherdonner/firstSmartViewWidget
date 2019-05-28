/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.content.view'
], function (_, $, d3, VisualDataContentView) {

    var VisualDataBarContentView = VisualDataContentView.extend({

        constructor: function VisualDataBarContentView(options) {
            VisualDataContentView.prototype.constructor.apply(this, arguments);
        },

        visType: 'bar',

        defaults: {
            marginTop: 20,
            marginRight: 20,
            marginBottom: 100,
            marginLeft: 80,
            groupAfter: 15
        },

        appendVisElements: function () {
            this.visElement = this.visElement.append('g')
                .attr('transform', 'translate(' + this.marginLeft() + ',' + this.marginTop() + ')')
                .attr('class', 'bar-chart');
        },

        update: function () {
            var contentView = this,
                visElement = contentView.visElement,
                chartData = contentView.collection.models,
                sum = chartData.reduce(function (memo, value) {
                    return memo + value.get('value');
                }, 0),
                width = this.width(),
                height = this.height(),
                colors = d3.schemeCategory20,
                color = d3.scaleOrdinal(colors),
                colorOpacity = 0.9;

            var x = d3.scaleBand()
                    .range([0, width])
                    .round(true)
                    .padding(0.1),
                y = d3.scaleLinear(),
                extent = d3.extent(chartData.map(function (d) {
                    return d.get('value');
                })),
                xAxis = d3.axisBottom(x).tickFormat(contentView.shortenText),
                yAxis = d3.axisLeft(y).tickFormat(_.bind(contentView.formatCount, contentView));
            extent = (extent[0] > 0) ? [0, extent[1]] : extent;

            y.domain(extent)
                .range([height, 0])
                .nice(); // extend range to nearest nice value

            function barLabel(d) {
                if (contentView.collection.overlayModel.get('view_value_as_percentage')) {
                    return ((d.get('value') / sum) * 100).toFixed(1) + '%'; // percentage of whole
                }
                else {
                    return contentView.formatCount(d.get('value'));
                }
            }

            function Y0() {
                return y(0);
            }

            function Y(d) {
                return y(d.get('value'));
            }
            x.domain(chartData.map(function (d) {
                return (contentView.collection.grouped_on_server) ? d.get('key_formatted') : d.get('key');
            }));
            var bars = visElement.selectAll('.bar')
                .data(chartData)
                .enter().append('rect')
                .attr('class', function () {
                    var myClasses = 'bar';
                    return myClasses;
                })
                .attr('fill-opacity', colorOpacity)
                .style('fill', function (d, i) {
                    return color(i);
                })
                .style('stroke', function (d, i) {
                    return color(i);
                })
                .attr('x', function (d) {
                   return (contentView.collection.grouped_on_server) ? x(d.get('key_formatted')) : x(d.get('key'));
                })
                .attr('y', function (d) {
                    return d.get('value') < 0 ? Y0() : Y(d);
                })
                .attr('width', x.bandwidth())
                .attr('height', function (d) {
                    return Math.abs(Y(d) - Y0());
                });
            var barLabels = visElement.append('g')
                .attr('class', 'chart-labels')
                .selectAll('text')
                .data(chartData)
                .enter();

            barLabels
                .append('text')
                .style('text-anchor', 'middle')
                .text(barLabel)
                .attr('class', function() {
                    return (this.getBoundingClientRect().width <= x.bandwidth()) ? 'chart-label' : 'chart-label hidden';
                })
                .attr('x', function (d) {
                    return (contentView.collection.grouped_on_server) ? x(d.get('key_formatted')) + (x.bandwidth() / 2) : x(d.get('key')) + (x.bandwidth() / 2);
                })
                .attr('y', function (d) {
                    var offset = Math.abs(height - Y(d)),
                        zeroline = Y0() - Y(d),
                        labelOffset = 0;

                    if (contentView.checkSign(d.get('value')) === -1) {
                        if (zeroline < -24) {
                            labelOffset = -6;
                            d3.select(this).classed('outside', false);
                        }
                        else {
                            labelOffset = 16;
                            d3.select(this).classed('outside', true);
                        }
                        return (height + labelOffset - offset);
                    }
                    else {
                        if (zeroline > 24) {
                            labelOffset = 16;
                            d3.select(this).classed('outside', false);
                        }
                        else {
                            labelOffset = -6;
                            d3.select(this).classed('outside', true);
                        }
                        return (height + labelOffset - offset);
                    }

                });

            var rotateTicks = false; // set a flag so we can rotate ALL tick labels, rather than have a mix of some rotated and others not, which looks messy.
            visElement.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'middle')
                .attr('dy', '6')
                .attr('class',function() {
                    if (this.getBoundingClientRect().width >= x.bandwidth()) {
                        rotateTicks = true;
                    }
                    return null;
                });

            if (rotateTicks) {
                visElement.select('.x.axis')
                    .selectAll('text')
                    .attr('transform','rotate(-30)')
                    .style('text-anchor', 'end');
            }
            visElement.append('g')
                .attr('class', 'x axis zero')
                .attr("transform", "translate(0," + Y0() + ")")
                .call(xAxis.tickFormat('').tickSize(0));
            visElement.append('g')
                .call(yAxis)
                .attr('class', 'y axis');
            visElement.append('g')
                .call(yAxis.tickFormat('').tickSize(-width))
                .selectAll('line')
                .attr('class', 'gridline');

            visElement.append('text')
                .attr('class', 'y-label')
                .text('Total count') // FIXME XLATE
                .attr('transform', 'rotate(-90)')
                .attr('y', -this.marginLeft() + 15)
                .attr('x', -(height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle');

            visElement.append('text') // x-axis label
                .attr('class', 'x-label')
                .text(this.model.get('active_column_formatted'))
                .attr('y', height + this.marginBottom() - 15)
                .attr('x', (width / 2))
                .attr('dx', '1em')
                .style('text-anchor', 'middle');

            visElement.append('text')
                .attr('class', 'total')
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'baseline')
                .attr('y', height + this.marginBottom() - 15)
                .attr('x', 0 - this.marginLeft() + 20)
                .text('Total: ' + contentView.formatCount(sum)); // FIXME XLATE 'Total'

        }

    });

    return VisualDataBarContentView;

});
