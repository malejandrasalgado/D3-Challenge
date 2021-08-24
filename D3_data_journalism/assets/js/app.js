// Step 1: Set up our chart
//= ================================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3
    .select("scatter")
    .append("svg")
    .attr('class', 'chart')
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
    console.log(data)

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
        .attr("opacity", ".75");




});


