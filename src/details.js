import { Card, CardHeader, Box } from "@mui/material";
import React from "react";
import * as d3 from "d3";

// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 60, left: 200 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const renderTimeC = function renderTimeConsistency(inputData) {
  let data = inputData.data;
  let lsmPoints = inputData.lsm.lsmPoints;

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-65)";
    });

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var indexies = d3.range(data.length);
  var area = d3
    .area()
    .x(function (d) {
      return x(data[d].date.getTime());
    })
    // .x1(function(d) {return d})
    .y1(function (d) {
      return y(data[d].value);
    })
    .y0(function (d) {
      return y(0);
    });
  svg
    .append("path")
    .datum(indexies)
    .attr("class", "area")
    .attr("fill", "red")
    .attr("d", area);

  // Add the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  svg
    .append("path")
    .datum(lsmPoints)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  console.log("graph finished");
};

const renderRaceC = function renderRaceConsistency(inputData) {
  let data = inputData.data;
  let lsmPoints = inputData.lsm.lsmPoints;

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-65)";
    });

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));
  renderGraph(data, lsmPoints, svg, x, y);
};

const renderPosG = function renderPositionsGained(inputData) {
  let data = inputData.data;

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  let svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.log(data);
};

const renderRacing = function renderRacing(inputData) {
  let data = inputData.data;

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  let svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

const graphChoices = [renderRaceC, renderTimeC, renderPosG, renderRacing];

function renderGraph(data, lsmPoints, svg, x, y) {
  var indexies = d3.range(data.length);
  var area = d3
    .area()
    .x(function (d) {
      return x(data[d].date.getTime());
    })
    // .x1(function(d) {return d})
    .y1(function (d) {
      return y(data[d].value);
    })
    .y0(function (d) {
      return y(lsmPoints[d].value);
    });
  svg
    .append("path")
    .datum(indexies)
    .attr("class", "area")
    .attr("fill", "red")
    .attr("d", area);

  // Add the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  svg
    .append("path")
    .datum(lsmPoints)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  console.log("graph finished");
}

export default function Details(props) {
  const svgRef = React.useRef(null);
  let graphChoice = props.graphChoice;
  let renderFunction = graphChoices[graphChoice];

  React.useEffect(() => {
    console.log(props);

    renderFunction(props.data[graphChoice]);
  }, [props]);

  // React.useEffect(() => {
  //     renderFunction(props.data[graphChoice].data, props.data[graphChoice].lsm.lsmPoints);
  // }, [props]);

  return (
    <div className="graph">
      <svg ref={svgRef} />
    </div>
  );
}
