var functionPieChart = dc.pieChart("#function-pie-chart", "expenditures");
var functionChart = dc.rowChart("#function-chart", "expenditures");
var expByCampusChart = dc.barChart("#exp-by-campus-chart", "expenditures");
var expFiveYearBarChart = dc.barChart("#exp-trend-bar-chart", "expenditures");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);

// load data from a csv file
d3.csv("javascript/expenses_allYears.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var expensesByFunction = ndx.dimension(function (d) {
                return d.expenseFunction;
            });

            var expensesByFunctionGroup = expensesByFunction.group().reduceSum(function (d) { return d.amount; });

            var expensesByCampus = ndx.dimension(function (d) {
                return d.campus;
            });
            var expensesByCampusGroup = expensesByCampus.group().reduceSum(function(d) { return d.amount; });


            var expensesByYear = ndx.dimension(function (d) {
                return d.year;
            });

            var expensesByYearGroup = expensesByYear.group().reduceSum(function (d) { return d.amount; });

            var dateDimension = ndx.dimension(function (d) {
                return d.year;
            });


            // TODO clean up this part
            // tooltips for row chart
            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" +  d.key + "</span> : "  + numberFormat(d.value); });

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + numberFormat(d.value); });

            // tooltips for bar chart
            var barTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.y);});

            // set colors to red <--> purple
            var expenseColors = ["#fde0dd","#fa9fb5","#e7e1ef","#d4b9da","#c994c7","#fcc5c0","#df65b0","#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"];


            functionChart.width(300)
                    .height(500)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .transitionDuration(750)
                    .dimension(expensesByFunction)
                    .group(expensesByFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return ""; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s"));

            functionPieChart.width(100)
                    .height(200)    
                    .transitionDuration(750)
                    .radius(50)
                    .innerRadius(30)
                    .dimension(expensesByFunction)
                    .title(function (d) { return ""; })
                    .group(expensesByFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(false);
                    

            expByCampusChart.width(500)
                    .height(400)
                    .transitionDuration(750)
                    .margins({top: 20, right: 10, bottom: 80, left: 80})
                    .dimension(expensesByCampus)
                    .group(expensesByCampusGroup)
                    .centerBar(true)
                    .brushOn(false)
                    .title(function (d) { return ""; })
                    .gap(1)
                    .elasticY(true)
                    .colors(['steelblue'])
                    .xUnits(dc.units.ordinal)
                    .x(d3.scale.ordinal().domain(["Berkeley", "Davis", "Irvine", "Los Angeles", "Merced", "Riverside", "San Diego", "San Francisco", "Santa Barbara", "Santa Cruz"])) // removed ,  "Systemwide",  "DOE Labs"
                    .y(d3.scale.linear().domain([0, 5500000])) 
                    .renderHorizontalGridLines(true)
                    .yAxis().tickFormat(d3.format("s"));
                    

            expByCampusChart.xAxis();


            expFiveYearBarChart.width(600)
                    .height(100)
                    .transitionDuration(750)
                    .margins({top: 20, right: 200, bottom: 30, left: 180})
                    .dimension(expensesByYear)
                    .group(expensesByYearGroup)
                    .elasticY(true)
                    .centerBar(true)
                    .brushOn(false)
                    .title(function (d) { return ""; })
                    .gap(6)
                    .colors(['#737373'])
                    .xUnits(function(){return 6;})
                    .elasticX(false)
                    .x(d3.scale.linear().domain([2007, 2013]))
                    .renderHorizontalGridLines(true)
                    .xAxis().ticks(4).tickFormat(d3.format("d"));
                    

            expFiveYearBarChart.yAxis().ticks(3).tickFormat(d3.format("s"));
                                            

            dc.dataCount(".dc-data-count", "expenditures")
                    .dimension(ndx)
                    .group(all);

            dc.dataTable(".dc-data-table", "expenditures")
                    .dimension(expensesByYear)
                    .group(function (d) {
                        return d.campus;
                    })
                    .size(170)
                    .columns([
                            function (d) {
                            return d.expenseFunction
                            ;
                        },
                        function (d) {
                            return numberFormat(d.amount);
                        },
                        function (d) {
                            return d.year;
                        }
                    ])
                    .sortBy(function (d) {
                        return d.campus;
                    })
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            expFiveYearBarChart.filter(2012);
            dc.renderAll("expenditures");

        // rotate the x Axis labels
                d3.selectAll("g.x text")
                    .attr("class", "campusLabel")
                    .style("text-anchor", "end") 
                    .attr("transform", "translate(-10,0)rotate(315)");

                d3.selectAll("g.row").call(tip);
                d3.selectAll("g.row").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);

                d3.selectAll(".bar").call(barTip);
                d3.selectAll(".bar").on('mouseover', barTip.show)
                    .on('mouseout', barTip.hide);  



        }

);
