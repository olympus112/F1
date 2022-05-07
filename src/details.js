import { Card, CardHeader, Box } from "@mui/material";
import React from "react";
import * as d3 from "d3";

const parseDate = d3.timeParse('%d/%m/%Y');


// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 60, left: 200 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const renderTimeC = function renderTimeConsistency(inputData) {
  let data = inputData.data;
  let lsmPoints = inputData.lsm.lsmPoints;

   //convert data.date to date object
   data = data.map(entry => {
    var newEntry = {
      value: entry.value,
    date: new Date(entry.date)}
    return newEntry;
  });

  //convert lsm.date to date object
  lsmPoints = lsmPoints.map(point => {
    var newPoint = {
      value: point.value,
    date: new Date(point.date)}
    return newPoint;
  });


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
  console.log(data);
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
      15
      // d3.max(data, function (d) {  //Auto adjust => less clear which is better between drivers.
      //   return d.value;            //set domain => less red means better => very obvious and can directly be seen
      // }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var indexies = d3.range(data.length);
  var area = d3
    .area()
    .x(function (d) {
      return x(Date.parse(data[d].date));
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
};

const renderRaceC = function renderRaceConsistency(inputData) {
  let data = inputData.data;
  let lsmPoints = inputData.lsm.lsmPoints;

    //convert data to date object
    data = data.map(entry => {
      var newEntry = {
        value: entry.value,
      date: new Date(entry.date)}
      return newEntry;
    });

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

  let width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  data.sort(function (a, b) {
    return a[1] - b[1];
  });

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  let svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Config
  let cfg = {
    labelMargin: 5,
    xAxisMargin: 10,
    legendRightMargin: 0,
  };

  let x = d3.scaleLinear().range([0, width]);

  let colour = d3.scaleSequential(d3.interpolatePRGn);

  let y = d3.scaleBand().range([height, 0]).padding(0.1);

  y.domain(
    data.map(function (d) {
      return d[0];
    })
  );
  x.domain(
    d3.extent(data, function (d) {
      return d[2];
    })
  );

  let max = d3.max(data, function (d) {
    return d[2];
  });
  colour.domain([-max, max]);

  let yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + x(0) + ",0)")
    .append("line")
    .attr("y1", 0)
    .attr("y2", height);

  let xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (height + cfg.xAxisMargin) + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  let bars = svg.append("g").attr("class", "bars");

  bars
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "annual-growth")
    .attr("x", function (d) {
      return x(Math.min(0, d[2]));
    })
    .attr("y", function (d) {
      return y(d[0]);
    })
    .attr("height", y.bandwidth())
    .attr("width", function (d) {
      return Math.abs(x(d[2]) - x(0));
    })
    .style("fill", function (d) {
      return colour(d[2]);
    });

  let labels = svg.append("g").attr("class", "labels");

  labels
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", x(0))
    .attr("y", function (d) {
      return y(d[0]);
    })
    .attr("dx", function (d) {
      return d[2] < 0 ? cfg.labelMargin : -cfg.labelMargin;
    })
    .attr("dy", y.bandwidth())
    .attr("text-anchor", function (d) {
      return d[2] < 0 ? "start" : "end";
    })
    .text(function (d) {
      return d[0].slice(0, -10)+ "GP";
    });
};

const renderRacing = function renderRacing(inputData) {
  let data = inputData.data;

  data.sort(function (a, b) {
    return a[1] - b[1];
  });

  //remove previous svg
  d3.select(".graph").select("svg").remove();

  let svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + 2.3*margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  let g = svg.append("g");

  xScale.domain(
    data.map(function (d) {
      return d[0];
    })
  );
  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d[2];
    }),
  ]);

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
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d;
        })
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
    .attr("x", function (d) {
      return xScale(d[0]);
    })
    .attr("y", function (d) {
      return yScale(d[2]);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d[2]);
    });
};

const graphChoices = [renderRaceC, renderTimeC, renderPosG, renderRacing];

function renderGraph(data, lsmPoints, svg, x, y) {
  var indexies = d3.range(data.length);
  var area = d3
    .area()
    .x(function (d) {
      var date = new Date(data[d].date);
      return x(date);
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
          return x(new Date(d.date));
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
          return x(new Date(d.date));
        })
        .y(function (d) {
          return y(d.value);
        })
    );
}

export default function Details(props) {
  const svgRef = React.useRef(null);
  let renderFunction = graphChoices[props.graph];

  React.useEffect(() => {

    renderFunction(props.data[props.graph]);
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
