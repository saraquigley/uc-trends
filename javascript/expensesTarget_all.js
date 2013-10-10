var targetExpensePieChart = dc.pieChart("#targetExpenses-pie-chart", "targetExpenses");
var targetExpenseChart = dc.rowChart("#targetExpenses-chart", "targetExpenses");
var targetExpByCampusChart = dc.barChart("#targExp-by-campus-chart", "targetExpenses");
var targetExpFiveYearBarChart = dc.barChart("#targExp-trend-bar-chart", "targetExpenses");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);

// load data from a csv file
d3.csv("javascript/expenseTarget_allYears.csv", function (data) {
            // since its a csv file we need to format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var targetExpensesByCampus = ndx.dimension(function (d) {
                return d.campus;
            });
            var targetExpensesByCampusGroup = targetExpensesByCampus.group().reduceSum(function(d) { return d.amount; });

            var targetExpensesByFunction = ndx.dimension(function (d) {
                return d.expenseTarget;
            });

            var targetExpensesByFunctionGroup = targetExpensesByFunction.group().reduceSum(function (d) { return d.amount; });


            var targetExpensesByYear = ndx.dimension(function (d) {
                return d.year;
            });

            var targetExpensesByYearGroup = targetExpensesByYear.group().reduceSum(function (d) { return d.amount; });

            var dateDimension = ndx.dimension(function (d) {
                return d.year;
            });



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
            var expenseColors = ["#fee391","#fec44f","#fe9929","#fd8d3c","#e08214","#fdb863","#fdae6b","#ec7014"];


            targetExpenseChart.width(300)
                    .height(500)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .transitionDuration(750)
                    .dimension(targetExpensesByFunction)
                    .group(targetExpensesByFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(true)
                    .labelOffsetY(26)
                    .gap(9)
                    .title(function (d) { return ""; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s"));

            targetExpensePieChart.width(100)
                    .height(200)    
                    .transitionDuration(750)
                    .radius(50)
                    .innerRadius(30)
                    .dimension(targetExpensesByFunction)
                    .title(function (d) { return ""; })
                    .group(targetExpensesByFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(false);
                    

            targetExpByCampusChart.width(500)
                    .height(400)
                    .transitionDuration(750)
                    .margins({top: 20, right: 10, bottom: 80, left: 80})
                    .dimension(targetExpensesByCampus)
                    .group(targetExpensesByCampusGroup)
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
                    

            targetExpByCampusChart.xAxis();


            targetExpFiveYearBarChart.width(600)
                    .height(100)
                    .transitionDuration(750)
                    .margins({top: 20, right: 200, bottom: 30, left: 180})
                    .dimension(targetExpensesByYear)
                    .group(targetExpensesByYearGroup)
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
                    

            targetExpFiveYearBarChart.yAxis().ticks(3).tickFormat(d3.format("s"));
                                            

            dc.dataCount("#expenseTarget-data-count", "targetExpenses")
                    .dimension(ndx)
                    .group(all);

            dc.dataTable("#expenseTarget-data-table", "targetExpenses")
                    .dimension(targetExpensesByYear)
                    .group(function (d) {
                        return d.campus;
                    })
                    .size(170)
                    .columns([
                            function (d) {
                            return d.expenseTarget
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

            targetExpFiveYearBarChart.filter(2012);
            dc.renderAll("targetExpenses");

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
