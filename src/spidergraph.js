import {Card, CardHeader, Box} from '@mui/material';
import React from 'react';
import * as d3 from "d3";
import {Graphs} from "./App";

function renderSpiderGraph(className, data, options, selectGraph) {
    const cfg = {
        width: options.width,			            // Width of the circle
        height: options.height,			            // Height of the circle
        margin: options.margin,                     // The margins of the SVG
        levels: 3,				                    // How many levels or inner circles should there be drawn
        maxValue: 0, 			                    // What is the value that the biggest circle will represent
        labelFactor: 1.2, 	                        // How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 40, 		                        // The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	                        // The opacity of the area of the blob
        dotRadius: 4, 			                    // The size of the colored circles of each blog
        opacityCircles: 0.1, 	                    // The opacity of the circles of each blob
        strokeWidth: 2, 		                    // The width of the stroke around each blob
        roundStrokes: false,	                    // If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)	// Color function
    };

    // Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (const entry in options) {
            if ('undefined' !== typeof options[entry]) {
                cfg[entry] = options[entry];
            }
        }
    }

    const maxValue = Math.max(cfg.maxValue, d3.max(data, racer => d3.max(racer.attributes.map(attribute => attribute.value)))); // Max value of all attributes
    const allAxis = data[0].attributes.map(attribute => attribute.name);	                             // Names of each axis
    const total = allAxis.length;					                                         // The number of different axes
    const radius = Math.min(cfg.width / 2, cfg.height / 2); 	                             // Radius of the outermost circle
    const Format = d3.format('.1%');			 	                                             // Percentage formatting
    const angleSlice = Math.PI * 2 / total;		                                             // The width in radians of each "slice"

    // Scale for the radius
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    // Remove whatever chart with the same id/class was present before
    d3.select(className).select("svg").remove();

    // Initiate the radar chart SVG
    const svg = d3.select(className).append("svg")
        .attr("width", cfg.width + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + className);
    const g = svg.append("g")
        .attr("transform", "translate(" + (cfg.width / 2 + cfg.margin.left) + "," + (cfg.height / 2 + cfg.margin.top) + ")");

    // Debug
    g.append("rect")
        .attr("x", -cfg.width / 2)
        .attr("y", -cfg.height / 2)
        .attr("width", cfg.width)
        .attr("height", cfg.height)
        .attr("stroke", "red")
        .attr("fill", "transparent");

    // Debug
    g.append("rect")
        .attr("x", -cfg.width / 2 - cfg.margin.left)
        .attr("y", -cfg.height / 2 - cfg.margin.top)
        .attr("width", cfg.width + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
        .attr("stroke", "red")
        .attr("fill", "transparent");

    //Filter for the outside glow
    const filter = g.append('defs').append('filter').attr('id', 'glow');
    const feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    const feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    const feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Wrapper for the grid & axes
    const axisGrid = g.append("g").attr("class", "axisWrapper");

    // Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", level => radius / cfg.levels * level)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    // Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", level => -level * radius / cfg.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(level => Format(maxValue * level / cfg.levels));

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (axis, index) => rScale(maxValue * 1.1) * Math.cos(angleSlice * index - Math.PI / 2))
        .attr("y2", (axis, index) => rScale(maxValue * 1.1) * Math.sin(angleSlice * index - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    // Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(axis => axis)
        .call(wrap, cfg.wrapWidth)
        .on("mouseover", function (event, axis) {
            d3.select(event.target.parentElement)
                .transition()
                .style('fill', 'darkOrange')
                .style('font-size', '14px');
        })
        .on("mouseout", function (event, axis) {
            d3.select(event.target.parentElement)
                .transition()
                .style('fill', 'black')
                .style('font-size', '11px');
        })
        .on("click", function (event, axis) {
            for (const [key, graph] of Object.entries(Graphs)) {
                if (graph.name === axis) {
                    selectGraph(graph);
                }
            }
        });

    // The radial line function
    const radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((racer, index) => index * angleSlice);

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    // Create a wrapper for the blobs
    const blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // Append the backgrounds
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", racer => radarLine(racer.attributes))
        .style("fill", (d, index) => cfg.color(index))
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (event, racer) {
            // Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            // Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
            // Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    // Create the outlines
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", racer => radarLine(racer.attributes))
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", (racer, index) => cfg.color(index))
        .style("fill", "none")
        .style("filter", "url(#glow)");

    // Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(racer => racer.attributes)
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", (attribute, index) => rScale(attribute.value) * Math.cos(angleSlice * index - Math.PI / 2))
        .attr("cy", (attribute, index) => rScale(attribute.value) * Math.sin(angleSlice * index - Math.PI / 2))
        .style("fill", (d, i, j) => cfg.color(j))
        .style("fill-opacity", 0.8);

    // Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    // Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data((racer, index) => racer.attributes)
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", (attribute, index) => rScale(attribute.value) * Math.cos(angleSlice * index - Math.PI / 2))
        .attr("cy", (attribute, index) => rScale(attribute.value) * Math.sin(angleSlice * index - Math.PI / 2))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (event, attribute) {
            let newX = parseFloat(d3.select(this).attr('cx')) - 10;
            let newY = parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(attribute.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function () {
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });

    //Set up the small tooltip for when you hover over a circle
    let tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Wraps SVG text
    function wrap(text, width) {
        text.each(function () {
            const text = d3.select(this),
                words = text.text().split(/\s+/).reverse();
            let word,
                line = [],
                lineNumber = 0;
            const lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy"));
            let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}

export default function SpiderGraph(props) {
    const svgRef = React.useRef(null);

    let spiderData = [];

    let getValue = (graph) => {
        if (graph.hasOwnProperty("score")) {
            return graph.score;
        } else if (graph.hasOwnProperty("lsm")) {
            return graph.lsm.score;
        } else {
            return 0;
        }
    };

    let addSpiderData = (driver, data) => {
        let attributes = [];
        for (const [key, graph] of Object.entries(Graphs)) {
            attributes.push({
                name: graph.name,
                value: getValue(data[graph.id])
            });
        }

        spiderData.push({
            id: driver.id,
            name: driver.name,
            attributes: attributes
        });
    }

    addSpiderData(props.driver, props.data)
    props.compare.forEach((compare, index) => {
        addSpiderData(compare, props.compareData[index]);
    });

    // const spidderData = [
    //     {
    //         attributes: [
    //             {name: "Time consistency", value: 0.22},
    //             {name: "Race consistency", value: 0.28},
    //             {name: "Qualification", value: 0.29},
    //             {name: "Racing", value: 0.17},
    //             {name: "Overtaking", value: 0.27},
    //         ]
    //     },
    // ]

    const color = d3.scaleOrdinal()
        .range(["#EDC951", "#CC333F", "#00A0B0", "#3ba95f"]);

    const radarChartOptions = {
        width: props.width,
        height: props.height,
        margin: {top: 60, right: 60, bottom: 60, left: 60},
        levels: 5,
        roundStrokes: false,
        color: color
    };

    React.useEffect(() => {
        renderSpiderGraph(".radarChart", spiderData, radarChartOptions, props.selectGraph);
    }, [spiderData]);

    return <div className="radarChart">
        <svg ref={svgRef}/>
    </div>;
};