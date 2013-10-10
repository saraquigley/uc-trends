var revSourcePieChart = dc.pieChart("#rev-source-pie-chart", "revenue");
var sourceOfRevenueChart = dc.rowChart("#revenue-source-chart", "revenue");
var revByCampusChart = dc.barChart("#rev-by-campus-chart", "revenue");
var fiveYearBarChart = dc.barChart("#rev-trend-bar-chart", "revenue");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);

// load data from a csv file
d3.csv("javascript/revenue_allYears.csv", function (data) {
            // since its a csv file we need to format the data a bit
            var numberFormat = d3.format(",f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            var all = ndx.groupAll();

 

            var revenueBySource = ndx.dimension(function (d) {
                return d.revenueSource;
            });

            var revenueBySourceGroup = revenueBySource.group().reduceSum(function (d) { return d.amount; });

            var revenueByCampus = ndx.dimension(function (d) {
                return d.campus;
            });
            var revenueByCampusGroup = revenueByCampus.group().reduceSum(function(d) { return d.amount; });


            var revenueByYear = ndx.dimension(function (d) {
                return d.year;
            });

            var revenueByYearGroup = revenueByYear.group().reduceSum(function (d) { return d.amount; });

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

            // colors for revenue sources green <--> blue
            var revenueColors = ["#d9ef8b","#a6d96a","#66bd63","#D9EDF7","#ccece6", "#e6f5d0","#b8e186","#7fbc41","#99d8c9","#41ae76","#238b45","#ccebc5","#e0f3db","#78c679","#41ab5d"];


            sourceOfRevenueChart.width(300)
                    .height(500)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .transitionDuration(750)
                    .dimension(revenueBySource)
                    .group(revenueBySourceGroup)
                    .colors(revenueColors)
                    .renderLabel(true)
                    .labelOffsetY(22)
                    .gap(9)
                    .title(function (d) { return ""; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s"));

            revSourcePieChart.width(100)
                    .height(200)    
                    .transitionDuration(750)
                    .radius(50)
                    .innerRadius(30)
                    .dimension(revenueBySource)
                    .group(revenueBySourceGroup)
                    .title(function (d) { return ""; })
                    .colors(revenueColors)
                    .renderLabel(false);
                    

            revByCampusChart.width(500)
                    .height(400)
                    .transitionDuration(750)
                    .margins({top: 20, right: 10, bottom: 80, left: 80})
                    .dimension(revenueByCampus)
                    .group(revenueByCampusGroup)
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
                    

            revByCampusChart.xAxis();


            fiveYearBarChart.width(600)
                    .height(100)
                    .transitionDuration(750)
                    .margins({top: 20, right: 200, bottom: 30, left: 180})
                    .dimension(revenueByYear)
                    .group(revenueByYearGroup)
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
                    

            fiveYearBarChart.yAxis().ticks(3).tickFormat(d3.format("s"));
                                            

            dc.dataCount("#revenue-data-count", "revenue")
                    .dimension(ndx)
                    .group(all);

            dc.dataTable("#revenue-data-table", "revenue")
                    .dimension(revenueByYear)
                    .group(function (d) {
                        return d.campus;
                    })
                    .size(170)
                    .columns([
                            function (d) {
                            return d.revenueSource
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

            fiveYearBarChart.filter(2012);
            dc.renderAll("revenue");




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
