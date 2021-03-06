/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa, screen */





/*
 *  _  _                 _                _        _
 * | |(_) _ _   ___  __ | |_   __ _  _ _ | |_     (_) ___
 * | || || ' \ / -_)/ _|| ' \ / _` || '_||  _| _  | |(_-<
 * |_||_||_||_|\___|\__||_||_|\__,_||_|   \__|(_)_/ |/__/
 *                                              |__/
 * This provides a line chart.
 *
 * The accessor is supposed to return an array of numbers which will be used to draw the stacked segments.
 * Example usage:
 *   var chart1 = Barchart()
 *     .accessor(function (d) { return { Answer1: d.A1} });
 *
 */

define(['helpers/basic-charts/_baseChart'], function(BaseChart) {
  'use strict';

  // This is the function that is called when you do something like: var chart1 = Barchart()
  return function module () {

    // Internal variables
    var dispatch = d3.dispatch('select'); // Dispatcher for the custom events

    // We create a new instance of a BaseChart in order to inheirt all the logic and properties from the baseChart
    var chart = new BaseChart();

    // The draw method is called in a D3 chain such as d3.select('#chart').datum(records).call(stackedRowchart.draw);
    // This will also be called on every chart update.
    chart.draw = function (_selection) {

      // _selection is an array of containers where we should draw a chart. Normally it will only be one unless
      // we're drawing the same chart in multiple containers on the same page.
      _selection.each(function(_data) {

        // We save the data object into our chart object so that it's available
        chart.data = _data;

        // If this is the first run then we don't have the reference to the SVG node saved.
        // We therefore create it along with a few other setup routines
        if (!chart.svg) {
          // Create the SVG
          chart.svg = chart.addSvg(this);
          // Add some behaviours (using methods from the baseChart)
          chart.addResizeListener(chart.draw, _selection)
               .addCSS('css/charts/linechart.css')
               .setup(this);

          // Create containers for chart and axises
          var container = chart.svg.append('g').classed('container-group', true).classed('linechart', true);
          container.append('g').classed('chart-group', true);
          var xAxisGroup = container.append('g').classed('x-axis-group axis', true);
          var yAxisGroup = container.append('g').classed('y-axis-group axis', true);

          // Add Axis titles if present
          if (chart.xAxisTitle) {
            xAxisGroup.append('text')
              .attr("class", "x-axis-label label")
              .attr("text-anchor", "end")
              .text(chart.xAxisTitle);
          }
          if (chart.yAxisTitle) {
            yAxisGroup.append('text')
              .attr('class', 'y-axis-label label')
              .attr("text-anchor", "end")
              .attr('transform', 'rotate(-90)')
              .text(chart.yAxisTitle);
          }
        }

        /*
         *  ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██╗ ██████╗
         * ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝
         * ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██║  ███╗██║██║
         * ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██║██║
         * ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║╚██████╗
         *  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝ ╚═════╝
         */

        // Main visualization variables
        var margin = { top: 20, right: 20, bottom: 70, left: 105 },
            width = 400,      // Width and height determine the chart aspect ratio
            height = 130,
            ratio = height/width,
            gap = 0,
            ease = 'linear';  // Options: https://devdocs.io/d3/transitions#d3_ease

        // Update width and height to match parent (this together with the chart redrawing on window resize makes it responsive)
        var _parentElement = d3.select(this).node();
        height = d3.min([$(window).height() - $('#navbar').height()*1.7, _parentElement.getBoundingClientRect().width * ratio]);
        width = _parentElement.getBoundingClientRect().width;

        // Internal sizing of the chart
        var chartW = width - margin.left - margin.right,
            chartH = height - margin.top - margin.bottom;

        // X and Y scales and axis
        var xScale = d3.scale.ordinal()
          .domain(_data.map(chart.xAccessor))
          .rangeRoundBands([0, chartW], 0.1);
        var yScale = d3.scale.linear()
          .domain(d3.extent(_data, chart.yAccessor))
          .range([chartH, 0]);
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .tickFormat(chart.xAxisTickFormat())
          .orient('bottom');
        var yAxis = d3.svg.axis()
          .scale(yScale)
          .tickFormat(chart.yAxisTickFormat())
          .orient('left');

        var line = d3.svg.line()
          .x(function(d) { return xScale(chart.xAccessor(d)); })
          .y(function(d) { return yScale(chart.yAccessor(d)); });

        // Transform the main <svg> and axes into place.
        chart.svg.transition().attr({width: width, height: height});
        chart.svg.select('.container-group')
          .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});
        chart.svg.select('.x-axis-group.axis')
          .transition()
          .ease(ease)
          .attr({transform: 'translate(0,' + (chartH) + ')'})
          .call(xAxis)
        .selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");
        chart.svg.select('.y-axis-group.axis')
          .transition()
          .ease(ease)
          .call(yAxis);
        chart.svg.select('.x-axis-label')
          .transition()
          .ease(ease)
          .attr('x', chartW)
          .attr('y', margin.bottom);
        chart.svg.select('.y-axis-label')
          .transition()
          .ease(ease)
          .attr('y', -margin.left/2);

        // Draw path
        var path = chart.svg.select('.chart-group')
          .select('path');
        if (path.size() === 0) {
          path = chart.svg.select('.chart-group')
            .append('path');
        }
        path.datum(_data)
          .attr("class", "line")
          .attr("d", line);



      });

      /*
       *     ██╗ ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██╗ ██████╗
       *    ██╔╝██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝
       *   ██╔╝ ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██║  ███╗██║██║
       *  ██╔╝  ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██║██║
       * ██╔╝   ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║╚██████╗
       * ╚═╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝ ╚═════╝
       */

    };

    // Rebind 'customHover' event to the 'exports' function, so it's available 'externally' under the typical 'on' method:
    d3.rebind(chart, dispatch, 'on');

    // Return exports function
    return chart;
  };

});
