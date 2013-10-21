
    var numberFormat = d3.format(",f");

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
    
    d3.select("#btnExpenditures")
      .on("click", function() {  
          d3.select("#expenditures-container").style("display", "block");
          d3.select("#revenues-container").style("display", "none");
          d3.select("#targetExpenses-container").style("display", "none");

          
          // how do I get the charts to reset all of their filters and transition during the redraw?
          if ((expByCampusChart.filters().length | 
              functionChart.filters().length | 
              functionPieChart.filters().length) > 0) {
            dc.redrawAll("expenditures");
          }
          else {
            dc.renderAll("expenditures");
          }

          formatXAxis();      

          setUpToolTips();
        });

    d3.select("#btnRevenues")
      .on("click", function() {  
          d3.select("#expenditures-container").style("display", "none");
          d3.select("#revenues-container").style("display", "block");
          d3.select("#targetExpenses-container").style("display", "none");

          // use workaround to check for # of filters present & either redrawAll or renderAll
          if ((revByCampusChart.filters().length | 
              sourceOfRevenueChart.filters().length | 
              revSourcePieChart.filters().length) > 0) {
            dc.redrawAll("revenue");
          }
          else {
            dc.renderAll("revenue");
          }

          formatXAxis();

          setUpToolTips();
        });

    d3.select("#btnExpenseTarget")
      .on("click", function() {  
          d3.select("#targetExpenses-container").style("display", "block");
          d3.select("#revenues-container").style("display", "none");
          d3.select("#expenditures-container").style("display", "none");
          
                   
          // use workaround to check for # of filters present & either redrawAll or renderAll
          if ((targetExpByCampusChart.filters().length | 
              targetExpenseChart.filters().length | 
              targetExpensePieChart.filters().length) > 0) {
            dc.redrawAll("targetExpenses");
          }
          else {
            dc.renderAll("targetExpenses");
          }

        
          formatXAxis();

          setUpToolTips();
        });


        formatXAxis();
        setUpToolTips();

      function formatXAxis() {
          // rotate the x Axis labels
          d3.selectAll("g.x text")
              .attr("class", "campusLabel")
              .style("text-anchor", "end") 
              .attr("transform", "translate(-10,0)rotate(315)");
      }

      function setUpToolTips() {
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
