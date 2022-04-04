// https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data

document.getElementById("title").innerHTML = "Recent Global Temperature Change: 1900 - 2012";

var styles = `
svg {
    font-family: Sans-Serif, Arial;
}
.line {
  stroke-width: 2;
  fill: none;
}

.axis path {
  stroke: black;
}

.text {
  font-size: 12px;
}

.title-text {
  font-size: 18px;
}`

// add stylesheets to page
var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

// set d3 related resources and embed in page
var scriptd3 = document.createElement("script");
scriptd3.setAttribute("src", "https://d3js.org/d3.v4.js");

// loaded d3 scripts
document.getElementById("graphContainer").appendChild(scriptd3);
scriptd3.addEventListener('load', function() {
    // d3 loaded
    // svg width/height/margin settings
    const margin = { top: 30, right: 120, bottom: 30, left: 50 },
    width = 1260 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    xAxisLabelPadding = 100;
    // d3 line settings
    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    // Create svg element
    var svg = d3.select("#graphContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height",  height + margin.top + margin.bottom + xAxisLabelPadding)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Data taken from Lawrence Berkeley National Laboratory
    d3.csv("/assets/data/GlobalLandTemperaturesByCountry.csv", function(error, data) {
        if (error) throw error;
        // Average yearly temperatures by month into one average temperature per year
        let currentYear = 1743;
        let currentYearEntries = 0;
        let currentYearTempSum = 0;
        let recentUpdateIndex = 0;
        for (let i = 0; i < data.length; i++) {
            const tempMonth = parseFloat(data[i].AverageTemperature);
            if (!!tempMonth) {
                const year = data[i].dt.substring(0, 4);
                if (currentYear != year) {
                    const averageYearTemp = currentYearTempSum / currentYearEntries;
                    data[recentUpdateIndex]["AverageYearTemperature"] = averageYearTemp;
                    currentYear = year;
                    currentYearEntries = 1;
                    currentYearTempSum = tempMonth;
                }
                else {
                    recentUpdateIndex = i;
                    currentYearTempSum = currentYearTempSum + tempMonth;
                    currentYearEntries = currentYearEntries + 1;
                }   
            }
        }

        // Process data into d3 mappings
        var dataByCountry = d3.nest()
        .key(function(d) { return d.Country; })
        .entries(data);
    
        // Define date formats
        var parseDate = d3.timeParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y")

        const series = dataByCountry.filter((d)=> {
            return true;
        }).map(d => ({
            name: d.key, // name of country
            values: d.values.filter((v) => {
                return !!v.AverageYearTemperature && parseInt(formatDate(parseDate(v.dt))) != "2013" && parseInt(formatDate(parseDate(v.dt))) >= 1900
            }).map(function(v) {
                return {
                    name: d.key,
                    date: new Date(parseDate(v.dt)),
                    AverageYearTemperature: +((v.AverageYearTemperature * 9/5) + 32)
                }
            })
        }));

        // Scale 
        var xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(series[0].values, d => d.date));

        var yScale = d3.scaleLinear()
        .domain([-10, 90])
        .range([height, 0]);

        // Line Color
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Add lines into SVG
        var line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.AverageYearTemperature));

        let lines = svg.append('g')
        .attr('class', 'lines');

        lines.selectAll('.line-group')
        .data(series).enter()
        .append('g')
        .attr('class', 'line-group')  
        .on("mouseover", function(d, i) {
            svg.append("text")
                .attr("class", "title-text")
                .style("fill", color(i))        
                .text(d.name)
                .attr("text-anchor", "middle")
                .attr("x", (width)/2)
                .attr("y", 0);
            })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
            })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => {
            return line(d.values)
        })
        .style('stroke', (d, i) => color(i))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                            .style('opacity', otherLinesOpacityHover);
            d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "pointer");
            })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                            .style('opacity', lineOpacity);
            d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none");
            });

        // Define SVG axes 
        var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(function(d){return formatDate(d)});
        var yAxis = d3.axisLeft(yScale).ticks(5);

        // Append the axes to the SVG
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values")
        .text("Average Temperature in Degrees Fahrenheit");
     });
  });