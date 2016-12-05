function createPieChart() {
    var width = 450,
        height = 600,
        radius = Math.min(width, height) / 2,
        outerRadius = radius * 0.75,
        legendRectSize = 18,
        legendSpacing = 4;

    var data = [{
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
    }];

    var pie = d3.layout.pie()
        .value(function(d) {
            return d.value;
        })
        .sort(null);

    var arcFinal = d3.svg.arc()
        .innerRadius(outerRadius * 0.75)
        .outerRadius(outerRadius);

    var arcInitial = d3.svg.arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius);

    var colorBand = d3.scale.ordinal()
        .domain(["Foundation", "Private", "Corporate", "Public (USG)", "Public (Other)"])
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

    var path = svg.datum(data).selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr({
            fill: function(d, i) {
                return colorBand(d.data.name);
            },
            d: arcInitial
        })
        .classed("pie",true);

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
        .classed("pie",true);

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
        .classed("pie",true);

    d3.selectAll("path.pie")
        .transition()
        .duration(1500)
        .delay(100)
        .attr({
            d: arcFinal
        });

    d3.selectAll("rect.pie")
        .transition()
        .duration(1500)
        .delay(3500)
        .style({
            fill: colorBand,
            stroke: colorBand
        });

    legend.selectAll("text.pie")
        .transition()
        .duration(1500)
        .delay(3500)
        .style({
            fill: "black"
        });
}
createPieChart();