// Step 1: Set up our chart
//= ================================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(hairData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty (%):";
    }
    else if (chosenXAxis === "age") {
        label = "Age (Median):";
    }
    else {
      label = "Income (Median):";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80,-60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below

 d3.csv("assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // parse data
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
      });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);


    // Create y scale function
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

   
    // defining Max and min axes 
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(data, function (data) {
        return data.poverty - 0.5;
    });

    xMax = d3.max(data, function (data) {
        return data.poverty;
    });

    yMin = d3.min(data, function (data) {
        return data.healthcare - 1;
    });

    yMax = d3.max(data, function (data) {
        return data.healthcare;
    });

    var xScale = xLinearScale.domain([xMin, xMax]);
    var yScale = yLinearScale.domain([yMin, yMax]);

// Step 7: Append the axes to the chartGroup
//     // ==============================================
    // Add bottomAxis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Add leftAxis to the left side of the display
    chartGroup.append("g")
      .call(leftAxis);


    // Step 8: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d =>  yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".")
        // .attr("stroke-width", "")
        // .attr("stroke", "white");

     // Create group for two x-axis labels
    
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);


    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

      var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");


//     // // Step 9: Initialize tool tip
//     // // ==============================
//     // var toolTip = d3.tip()
//     //     .attr("class", "tooltip")
//     //     .offset([80, -60])
//     //     .html(function (d) {
//     //         return (`${d.abbr}<br>Population In Poverty: ${d.poverty}<br>Hits: ${d.healthcare}`);
//     //     });

//     // Step 10: Create tooltip in the chart
//     // ==============================
//     chartGroup.call(toolTip);


//     // Step 11: Create event listeners to display and hide the tooltip
//     // ==============================
//     circlesGroup.on("mouseover", function (data) {
//         toolTip.show(data);
//     })
//         // onmouseout event
//         .on("mouseout", function (data) {
//             toolTip.hide(data);
//         });


//     // Create axes labels
//     // label circles inside 
//     chartGroup.append("text")
//         .style("text-anchor", "middle")
//         .style("font-family", "Times New Roman")
//         .style("font-size", "10px")
//         .selectAll("tspan")
//         .data(data)
//         .enter()
//         .append("tspan")
//         .attr("x", function (data) {
//             return xScale(data.poverty);
//         })
//         .attr("y", function (data) {
//             return yScale(data.healthcare - .05);
//         })
//         .text(function (data) {
//             return data.abbr
//         });

//     chartGroup.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left + 0.5)
//         .attr("x", 0 - (height / 1.5))
//         .attr("dy", "1em")
//         .attr("class", "text")
//         .text("Lacks Healthcare (%)");

//     chartGroup.append("text")
//         .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 20})`)
//         .attr("class", "text")
//         .text("In Poverty (%)");
// }).catch(function (error) {
//     console.log(error);
// });



