var barData = {
    "2014": [{
        "name": "Fisheries",
        "value": 3504707
    }, {
        "name": "Climate",
        "value": 5840000
    }, {
        "name": "Oceanscape",
        "value": 9925000
    }, {
        "name": "OHI",
        "value": 5603580
    }, {
        "name": "Core",
        "value": 2406000
    }, {
        "name": "Seascapes",
        "value": 33000000
    }],
    "2015": [{
        "name": "Fisheries",
        "value": 3012303
    }, {
        "name": "Climate",
        "value": 5277986
    }, {
        "name": "Oceanscapes",
        "value": 9553498
    }, {
        "name": "OHI",
        "value": 5054239
    }, {
        "name": "Core",
        "value": 248728
    }, {
        "name": "Seascapes",
        "value": 2294897
    }]
};

var pieData = {
    "2014": [{
        "value": 0.65,
        "name": "Foundation"
    }, {
        "value": 0.1,
        "name": "Private"
    }, {
        "value": 0.08,
        "name": "Corporate"
    }, {
        "value": 0.01,
        "name": "Public (USG)"
    }, {
        "value": 0.16,
        "name": "Public (Other)"
    }],
    "2015": [{
        "value": 0.59,
        "name": "Foundation"
    }, {
        "value": 0.14,
        "name": "Private"
    }, {
        "value": 0.06,
        "name": "Corporate"
    }, {
        "value": 0.04,
        "name": "Public (USG)"
    }, {
        "value": 0.17,
        "name": "Public (Other)"
    }]
};

function createBarChart(data) {
    var w = 450,
        h = 600,
        padding = 100;

    var mean = d3.mean(data[2014], function(d) {
        return d.value;
    });
    var deviation = d3.deviation(data[2014], function(d) {
        return d.value;
    });

    var yScaleLower = d3.scale.linear()
        .domain([0, deviation])
        .range([h - padding, h * (2 / 5) + 15 - padding])
        .clamp(true);

    var yScaleUpper = d3.scale.linear()
        .domain([deviation, d3.max(data[2014], function(d) {
            return d.value;
        })])
        .range([h * (2 / 5) - padding, 0])
        .clamp(true);

    var xScale = d3.scale.ordinal()
        .domain(data[2014].map(function(d) {
            return d.name;
        }))
        .rangeRoundBands([padding, w - padding], 0.1);

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
        .data(data[2014])
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
        .data(data[2014])
        .enter()
        .append("rect")
        .attr({
            x: function(d, i) {
                return xScale(d.name);
            },
            width: xScale.rangeBand(),
            y: h * (2 / 5) - padding,
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
            return 100 * (data[2014].length * 2 + (i + 1));
        })
        .duration(1500)
        .attr({
            y: function(d) {
                return yScaleUpper(d.value);
            },
            height: function(d) {
                return d.value >= deviation ? h * (2 / 5) - padding - yScaleUpper(d.value) : 0;
            }
        });

    svg.selectAll(".xAxis text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height * 1.55 + ")rotate(-45)";
        });
}

function createPieChart(data) {
    var width = 450,
        height = 600,
        radius = Math.min(width, height) / 2,
        outerRadius = radius * 0.75,
        labelr = outerRadius + 15,
        legendRectSize = 18,
        legendSpacing = 4;

    var pie = d3.layout.pie()
        .value(function(d) {
            return d.value;
        })
        .sort(null);

    // var pie = d3.layout.pie()
    //     .value(function(d) {
    //         return d["2014"].value;
    //     })
    //     .sort(null);

    var arcFinal = d3.svg.arc()
        .innerRadius(outerRadius * 0.75)
        .outerRadius(outerRadius);

    var arcInitial = d3.svg.arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius);

    var colorBand = d3.scale.ordinal()
        // .domain(["Foundation", "Private", "Corporate", "Public (USG)", "Public (Other)"])
        .range(["#2E578B", "#5D9548", "#E7A03C", "#BC2C2F", "#6F3C78"]);
        
    var viz = d3.select("div.viz");
    
    var svg = viz.append("svg")
        .attr({
            width: width,
            height: height
        })
        .append("g")
        .attr({
            transform: "translate(" + width / 2 + "," + height / 2 + ")"
        });
        
    var slice = svg.datum(data[2014]).selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .classed("slice", true);
    
    // var input = d3.select("input[value]").html(this.value);
    
    // var slice = svg.datum(data).selectAll("g.slice")
    //     .data(pie)
    //     .enter()
    //     .append("svg:g")
    //     .classed("slice", true);

    var path = slice.append("svg:path")
        .attr({
            fill: function(d, i) {
                return colorBand(d.data.name);
            },
            d: arcInitial
        })
        //http://bl.ocks.org/mbostock/1346410
        // store the initial angles
        .each(function(d) { 
            this._current = d; 
        })
        .classed("slice", true);
        
    //http://bl.ocks.org/mbostock/1346410
    d3.selectAll("input")
        .on("change", change);
        
    var timeout = setTimeout(function() {
        d3.select("input[value=\"2014\"]").property("checked", true).each(change);
    }, 2000);        
        
    function change() {
        var value = this.value;
        clearTimeout(timeout);
        pie.value(function(d) { 
            // return d[value];
            return value;
        }); // change the value function
        path = path.data(pie); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    }        

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arcFinal(i(t));
        };
    }

    slice.append("svg:text")
        .attr({
            // http://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
            transform: function(d) {
                var c = arcFinal.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x * x + y * y);
                return "translate(" + (x / h * labelr) + ',' + (y / h * labelr) + ")";
            },
            dy: ".35em",
            "text-anchor": function(d) {
                // are we past the center?
                return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
            }
        })
        .text(function(d, i) {
            return d3.format("%.4f")(d.value);
        })
        .style({
            fill: "white"
        })
        .classed("slice", true);

    // http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
    var legend = svg.selectAll(".legend")
        .data(colorBand.domain())
        .enter()
        .append("g")
        .attr({
            transform: function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * colorBand.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return "translate(" + horz + "," + vert + ")";
            }
        })
        .classed("legend", true);

    legend.append("rect")
        .attr({
            width: legendRectSize,
            height: legendRectSize
        })
        .style({
            fill: "white",
            stroke: "white"
        })
        .classed("legend", true);

    legend.append("text")
        .attr({
            x: legendRectSize + legendSpacing,
            y: legendRectSize - legendSpacing
        })
        .style({
            fill: "white"
        })
        .text(function(d) {
            return d;
        })
        .classed("legend", true);

    d3.selectAll("path.slice")
        .transition()
        .duration(1500)
        .delay(100)
        .attr({
            d: arcFinal
        });

    d3.selectAll("rect.legend")
        .transition()
        .duration(1500)
        .delay(3500)
        .style({
            fill: colorBand,
            stroke: colorBand
        });

    d3.selectAll("text.slice")
        .transition()
        .duration(1500)
        .delay(3500)
        .style({
            fill: "black"
        });

    legend.selectAll("text.legend")
        .transition()
        .duration(1500)
        .delay(3500)
        .style({
            fill: "black"
        });
}

createBarChart(barData);
createPieChart(pieData);