function createBarChart() {
    var w = 450,
        h = 600,
        padding = 100;

    var data = [{
        name: "Fisheries",
        value: 3504707
    }, {
        name: "Climate",
        value: 5840000
    }, {
        name: "Oceanscape",
        value: 9925000
    }, {
        name: "OHI",
        value: 5603580
    }, {
        name: "Core",
        value: 2406000
    }, {
        name: "Seascapes",
        value: 33000000
    }];
    
    var mean = d3.mean(data, function(d) { return d.value; });
    var deviation = d3.deviation(data, function(d) { return d.value; });

    var yScaleLower = d3.scale.linear()
        .domain([0, deviation])
        .range([h - padding, h * (2/5) + 15 - padding])
        .clamp(true);
        
    var yScaleUpper = d3.scale.linear()
        .domain([deviation, d3.max(data, function(d) {
            return d.value;
        })])
        .range([h * (2/5) - padding, 0])
        .clamp(true);
    
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) {
            return d.name;
        }))
        .rangeRoundBands([padding, w - padding], 0.05);
        
    var yAxisLower = d3.svg.axis()
        .scale(yScaleLower)
        .orient("left")
        .ticks(4);
    
    var yAxisUpper = d3.svg.axis()
        .scale(yScaleUpper)
        .orient("left")
        .ticks(2);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    var colorBand = d3.scale.ordinal()
        .range(["#2E578B", "#5D9548", "#E7A03C", "#BC2C2F", "#6F3C78", "#7C7F7E", "#FEFFFE"]);

    var viz = d3.select("div.viz");

    var svg = viz.append("svg")
        .attr({
            width: w,
            height: h
        });

    svg.append("g")
        .attr({
            transform: "translate(" + padding + ",0)",
            opacity: 0
        })
        .classed("yAxis", true)
        .call(yAxisUpper)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr({
            opacity: 1
        });
        
    svg.append("g")
        .attr({
            transform: "translate(" + padding + ",0)",
            opacity: 0
        })
        .classed("yAxis", true)
        .call(yAxisLower)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr({
            opacity: 1
        });
        
    svg.append("g")
        .attr({
            transform: "translate(0," + (h - padding) + ")"
        })
        .classed("xAxis", true)
        .call(xAxis);
        
    d3.selectAll("g.yAxis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr({
            x1: 0,
            y1: 0,
            x2: (w - 2 * padding),
            y2: 0
        });

    var lowerRects = svg.selectAll("rect.yScaleLower")
        .data(data)
        .enter()
        .append("rect")
        .attr({
            x: function(d, i) {
                return xScale(d.name);
            },
            width: xScale.rangeBand(),
            y: h - padding,
            height: 0,
            fill: function(d, i) {
                return colorBand(i);
            }
        });

    var upperRects = svg.selectAll("rect.yScaleUpper")
        .data(data)
        .enter()
        .append("rect")
        .attr({
            x: function(d, i) {
                return xScale(d.name);
            },
            width: xScale.rangeBand(),
            y: h * (2/5) - padding,
            height: 0,
            fill: function(d, i) {
                return colorBand(i);
            }
        });
        
    //Transition lower rects into place
    lowerRects.transition()
        .delay(function(d, i) {
            return i * 100;
        })
        .duration(1500)
        .attr({
            y: function(d) {
                return yScaleLower(d.value);
            },
            height: function(d) {
                return h - padding - yScaleLower(d.value);
            }
        });

    //Transition upper rects into place
    upperRects.transition()
        .delay(function(d, i) {
            return 100 * (data.length * 2 + (i + 1));
        })
        .duration(1500)
        .attr({
            y: function(d) {
                return yScaleUpper(d.value);
            },
            height: function(d) {
                return d.value >= deviation ?  h * (2/5) - padding - yScaleUpper(d.value) : 0;
            }
        });
        
    svg.selectAll(".xAxis text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height * 1.55 + ")rotate(-45)";
        });
}

createBarChart();