// Step 1: Set up our chart
//= ================================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 0
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

// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function (data) {

    // Step 4: Format the data
    // =================================
    data.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    // reading data in the console
    // console.log(data)

    // Step 5: Create Scales
    //= ============================================

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);


    // Step 6: Create Axes
    // =============================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 7: Append the axes to the chartGroup
    // ==============================================
    // Add bottomAxis
    chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add leftAxis to the left side of the display
    chartGroup
        .append("g")
        .call(leftAxis);

    // Step 8: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".")
        .attr("stroke-width", "1")
        .attr("stroke", "white");


    // Step 9: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Population In Poverty: ${d.poverty}<br>Hits: ${d.healthcare}`);
        });

    // Step 10: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


    // Step 11: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });


    // Create axes labels
    // label circles inside 
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "Times New Roman")
        .style("font-size", "10px")
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
        .attr("x", function (data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function (data) {
            return yLinearScale(data.healthcare - .05);
        })
        .text(function (data) {
            return data.abbr
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 0.5)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "text")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 20})`)
        .attr("class", "text")
        .text("In Poverty (%)");
}).catch(function (error) {
    console.log(error);
});



