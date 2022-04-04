document.getElementById("title").innerHTML = "Carbon Dioxide Atmospheric Level";

var styles = `
.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.x.axis path {
    display: none;
}

.line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
}

.overlay {
    fill: none;
    pointer-events: all;
}

.focus circle {
    fill: steelblue;
}

.focus text {
    font-size: 14px;
}

.tooltip {
    fill: white;
    stroke: #000;
}

.tooltip-date, .tooltip-likes {
    font-weight: bold;
}
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

// set d3 related resources and embed in page
var scriptd3 = document.createElement("script");
scriptd3.setAttribute("src", "https://d3js.org/d3.v3.js");
var scriptTopo = document.createElement("script");
scriptTopo.setAttribute("src", "https://d3js.org/topojson.v2.min.js");

// loaded d3 scripts
document.getElementById("graphContainer").appendChild(scriptd3);
scriptd3.addEventListener('load', function() {
  document.getElementById("graphContainer").appendChild(scriptTopo); 
  scriptTopo.addEventListener('load', function() {
    const margin = { top: 30, right: 120, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        tooltip = { width: 100, height: 100, x: 10, y: -30 }

    const parseDate = d3.time.format("%Y").parse
        bisectDate = d3.bisector(function(d) { return d.year; }).left,
        formatValue = d3.format(","),
        dateFormatter = d3.time.format("%Y");

    var x = d3.time.scale()
            .range([0, width]);

    var y = d3.scale.linear()
            .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(dateFormatter);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("s"))

    var line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.mean); });

    var xAxisLabelPadding = 100;
    var svg = d3.select("#graphContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height",  height + margin.top + margin.bottom + xAxisLabelPadding)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // data taken from Global Monitoring Laboratory: https://gml.noaa.gov/ccgg/trends/data.html
    d3.csv("/assets/data/co2_annmean_mlo.csv", function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d.mean = +d.mean;
            d.unc = +d.unc;
            d.year = parseDate(d.year);
        });

        data.sort(function(a, b) {
            return a.year - b.year;
        });

        x.domain([data[0].year, data[data.length - 1].year]);
        y.domain(d3.extent(data, function(d) { return d.mean; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("dy", "3em")
            .attr("dx", "370")
            .text("Year")


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Micromols CO2/mol of dry air");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2)

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)

        focus.append("text")
            .attr("class", "tooltip-likes")
            .attr("x", 60)
            .attr("y", 18);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.year) + "," + y(d.mean) + ")");
            focus.select(".tooltip-date").text(dateFormatter(d.year));
            focus.select(".tooltip-likes").text(formatValue(d.mean));
        }
      });
    });
});


