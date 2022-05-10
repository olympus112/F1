import React from "react";
import * as d3 from "d3";
import {colors,Grid,Paper,Box} from "@mui/material";
import Typography from "@mui/material/Typography";

let parseDate = d3.timeParse('%d/%m/%Y');

let set_height = 420
let set_width = 900

let DEFAULT_OPACITY = 0.35;
let FOCUS_OPACITY = 0.7;
let IGNORE_OPACITY = 0.1;
let STROKE_WIDTH = 2;

// set the dimensions and margins of the graph
let margin = {top: 20, right: 200, bottom: 60, left: 20},
    width = set_width - margin.left - margin.right,
    height = set_height - margin.top - margin.bottom;

let addFilter = (element) => {
    let filter = element.append('defs').append('filter').attr('id', 'glow');
    let feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    let feMerge = filter.append('feMerge');
    let feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    let feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}

let renderTimeConsistency = (inputData, colors, compareData) => {
    let data = inputData.data;
    let lsmPoints = inputData.lsm.lsmPoints;

    //convert data.date to date object
    data = data.map(entry => {
        return {
            value: entry.value,
            date: new Date(entry.date)
        };
    });

    //convert lsm.date to date object
    lsmPoints = lsmPoints.map(point => {
        return {
            value: point.value,
            date: new Date(point.date)
        };
    });

    //remove previous svg
    d3.select(".graph").select("svg").remove();

    // append the svg object to the body of the page
    let svg = d3
        .select(".graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Create master group
    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add glow filter
    addFilter(g);

    // Add X axis --> it is a date format
    let x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-65)");

    // Add Y axis
    let y = d3
        .scaleLinear()
        .domain([
            0,
            15
            // d3.max(data, d => {  //Auto adjust => less clear which is better between drivers.
            //   return d.value;            //set domain => less red means better => very obvious and can directly be seen
            // }),
        ])
        .range([height, 0]);
    g.append("g")
        .call(d3.axisLeft(y));

    let indices = d3.range(data.length);

    // Graph area
    let area = d3.area()
        .x(d => x(Date.parse(data[d].date)))
        // .x1(function(d) {return d})
        .y1(d => y(data[d].value))
        .y0(d => y(0));
    g.append("path")
        .datum(indices)
        .attr("class", "area")
        .attr("fill", (value, index) => colors(index))
        .attr("fill-opacity", DEFAULT_OPACITY)
        .attr("d", area)
        .on('mouseover', function (event) {
            // Dim all areas
            // svg.selectAll(".area")
            //     .transition().duration(200)
            //     .style("fill-opacity", IGNORE_OPACITY);
            // Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", FOCUS_OPACITY);
        })
        .on('mouseout', function () {
            // Bring back all blobs
            d3.selectAll(".area")
                .transition().duration(200)
                .style("fill-opacity", DEFAULT_OPACITY);
        });

    // Graph line
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", (value, index) => colors(index))
        .attr("stroke-width", STROKE_WIDTH)
        .style("filter", "url(#glow)")
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // LSM Line
    // g.append("path")
    //     .datum(lsmPoints)
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 3)
    //     .attr("d", d3.line()
    //         .x(d => x(d.date))
    //         .y(d => y(d.value))
    //     );

    //add compare graphs
    var colorIndex = 0;
    compareData.forEach(dataCmp => {
      var graphData = dataCmp.data;
      colorIndex++;
      g
      .append("path")
      .datum(graphData)
      .attr("fill", "none")
      .attr("stroke", colors(colorIndex))
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)")
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(new Date(d.date));
          })
          .y(function (d) {
            return y(d.value);
          })
      );
      // Graph area
    let area = d3.area()
    .x(d => x(Date.parse(graphData[d].date)))
    .y1(d => y(graphData[d].value))
    .y0(d => y(0));
    g.append("path")
        .datum(indices)
        .attr("class", "area")
        .attr("fill", (value, index) => colors(colorIndex))
        .attr("fill-opacity", DEFAULT_OPACITY)
        .attr("d", area)
        .on('mouseover', function (event) {
            // Dim all areas
            // svg.selectAll(".area")
            //     .transition().duration(200)
            //     .style("fill-opacity", IGNORE_OPACITY);
            // Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", FOCUS_OPACITY);
        })
        .on('mouseout', function () {
            // Bring back all blobs
            d3.selectAll(".area")
                .transition().duration(200)
                .style("fill-opacity", DEFAULT_OPACITY);
        });
    });

    
};


let renderRaceConsistency = (inputData, colors, compareData) => {
    let data = inputData.data;
    let lsmPoints = inputData.lsm.lsmPoints;

    //convert data to date object
    data = data.map(entry => {
        return {
            value: entry.value,
            date: new Date(entry.date)
        };
    });

    // Remove previous svg
    d3.select(".graph").select("svg").remove();

    // Append the svg object to the body of the page
    let svg = d3
        .select(".graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Create main group
    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add glow filter
    addFilter(g);

    // Add X axis --> it is a date format
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-65)");

    // Add Y axis
    let y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
    g.append("g").call(d3.axisLeft(y));

    renderGraph(data, lsmPoints, g, x, y, colors, compareData);
};

let renderPositionsGained = (inputData, colors) => {
    let data = inputData.data;

    let width = set_width - margin.left - margin.right - 300,
        height = set_height - margin.top - margin.bottom;

    //300 margin added to make names appear
    data.sort((a, b) => a[1] - b[1]);

    //remove previous svg
    d3.select(".graph").select("svg").remove();

    // Add svg
    let svg = d3.select(".graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Add main group
    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Config
    let cfg = {
        labelMargin: 5,
        xAxisMargin: 10,
        legendRightMargin: 0,
    };

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleBand().range([height, 0]).padding(0.1);
    let colour = d3.scaleSequential(d3.interpolatePRGn);

    y.domain(data.map(d => d[0]));
    x.domain(d3.extent(data, d => d[2]));

    let max = d3.max(data, d => d[2]);
    colour.domain([-max, max]);

    let yAxis = g
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .append("line")
        .attr("y1", 0)
        .attr("y2", height);

    let xAxis = g
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height + cfg.xAxisMargin) + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    let bars = g.append("g").attr("class", "bars");

    bars
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "annual-growth")
        .attr("x", d => x(Math.min(0, d[2])))
        .attr("y", d => y(d[0]))
        .attr("height", y.bandwidth())
        .attr("width", d => Math.abs(x(d[2]) - x(0)))
        .style("fill", d => colour(d[2]));

    let labels = g.append("g").attr("class", "labels");

    labels
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", x(0))
        .attr("y", d => y(d[0]))
        .attr("dx", d => d[2] < 0 ? cfg.labelMargin : -cfg.labelMargin)
        .attr("dy", y.bandwidth())
        .attr("text-anchor", d => d[2] < 0 ? "start" : "end")
        .text(d => d[0].slice(0, -10) + "GP");
};

let renderRacing = (inputData, color) => {
    let data = inputData.data;

    data.sort((a, b) => a[1] - b[1]);

    //remove previous svg
    d3.select(".graph").select("svg").remove();

    let svg = d3
        .select(".graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + 2.3 * margin.bottom);

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(data.map(d => d[0]));
    yScale.domain([0, d3.max(data, d => d[2]),]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Year");

    g.append("g")
        .call(
            d3.axisLeft(yScale)
                .tickFormat(d => d)
                .ticks(10)
        )
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Finishing position");

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[2]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d[2]));
};

function renderGraph(data, lsmPoints, svg, x, y, colors, compareData) {
    let indices = d3.range(data.length);
    let area = d3.area()
        .x(d => x(new Date(data[d].date)))
        // .x1(function(d) {return d})
        .y1(d => y(data[d].value))
        .y0(d => y(lsmPoints[d].value));

    // Add graph area
    svg.append("path")
        .datum(indices)
        .attr("class", "area")
        .attr("fill", (value, index) => colors(index))
        .style("fill-opacity", DEFAULT_OPACITY)
        .attr("d", area)
        .on('mouseover', function (event) {
            // Dim all areas
            // svg.selectAll(".area")
            //     .transition().duration(200)
            //     .style("fill-opacity", IGNORE_OPACITY);
            // Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", FOCUS_OPACITY);
        })
        .on('mouseout', function () {
            // Bring back all blobs
            d3.selectAll(".area")
                .transition().duration(200)
                .style("fill-opacity", DEFAULT_OPACITY);
        });

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", (value, index) => colors(index))
        .attr("filter", "url(#glow)")
        .attr("stroke-width", STROKE_WIDTH)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    //add lsm line if present
    if (lsmPoints != null){
        svg.append("path")
        .datum(lsmPoints)
        .attr("fill", "none")
        .attr("stroke", colors(0))
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.value))
        );
    }

    //add compare graphs
    var colorIndex = 0;
    compareData.forEach(dataCmp => {
        var graphData = dataCmp.data;
        var lsmPoints = dataCmp.lsm.lsmPoints;
        colorIndex++;
        svg
        .append("path")
        .datum(graphData)
        .attr("fill", "none")
        .attr("stroke", colors(colorIndex))
        .attr("stroke-width", 1.5)
        .attr(
        "d",
        d3
            .line()
            .x(function (d) {
            return x(new Date(d.date));
            })
            .y(function (d) {
            return y(d.value);
            })
        );

        let area = d3.area()
        .x(d => x(new Date(graphData[d].date)))
        // .x1(function(d) {return d})
        .y1(d => y(graphData[d].value))
        .y0(d => y(lsmPoints[d].value));

        // Add graph area of compared data
        svg.append("path")
            .datum(indices)
            .attr("class", "area")
            .attr("fill", colors(colorIndex))
            .style("fill-opacity", DEFAULT_OPACITY)
            .attr("d", area)
            .on('mouseover', function (event) {
                // Dim all areas
                // svg.selectAll(".area")
                //     .transition().duration(200)
                //     .style("fill-opacity", IGNORE_OPACITY);
                // Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", FOCUS_OPACITY);
            })
            .on('mouseout', function () {
                // Bring back all blobs
                d3.selectAll(".area")
                    .transition().duration(200)
                    .style("fill-opacity", DEFAULT_OPACITY);
            });
        //add lsm line if present
        if (lsmPoints != null){
            svg.append("path")
            .datum(lsmPoints)
            .attr("fill", "none")
            .attr("stroke", colors(colorIndex))
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => x(new Date(d.date)))
                .y(d => y(d.value))
            );
        }
    });
}

export default function Details(props) {
    let svgRef = React.useRef(null);
    let graphs = [renderRaceConsistency, renderTimeConsistency, renderPositionsGained, renderRacing];
    //collect relevant data to compare
    let compareData = props.compareData.map(data => data[props.graph.id]);
    const colors = d3.scaleOrdinal().range([props.color.driver[500], ...(props.color.compare.map(color => color[500]))]);

    React.useEffect(() => {
        graphs[props.graph.id](props.data[props.graph.id], colors, compareData);
    }, [props]);

    return (
            <Grid container direction="column">
                <Grid item xs={12} >
                    <div style={{position: "relative", left:11.8,top:6}}>
                        <Typography sx={{fontSize:"20px",fontWeight:"600"}}>
                            {props.graph.name}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                    <div className="graph">
                        <svg ref={svgRef}/>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ px: 1, pb:1,border: '1px dashed grey' ,m:2}}>
                        <div>
                            <Typography variant="caption" sx={{color: "rgba(0, 0, 0, 0.6)"}} >
                                {"Detailed explanation of graph " + props.graph.name + ":"}
                            </Typography>
                        </div>
                        <Typography variant="caption" sx={{pl: 2, color: "rgba(0, 0, 0, 0.6)"}}>
                            {props.graph.explanation}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
    );
}
