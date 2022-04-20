
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/diverging-bar-chart
function DivergingBarChart(data, {
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 10, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width of chart, in pixels
  height, // the outer height of the chart, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  yDomain, // an array of (ordinal) y-values
  yRange, // [top, bottom]
  colors = d3.schemePiYG[3] // [negative, …, positive] colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = Y;
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  // Lookup the x-value for a given y-value.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));
  const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);

  // Compute the default height.
  if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  const format = xScale.tickFormat(100, xFormat);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${format(X[i])}`;
  } else if (title !== null) {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", height - marginTop - marginBottom)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", xScale(0))
          .attr("y", -22)
          .attr("fill", "currentColor")
          .attr("text-anchor", "center")
          .text(xLabel));

  const bar = svg.append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
      .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
      .attr("x", i => Math.min(xScale(0), xScale(X[i])))
      .attr("y", i => yScale(Y[i]))
      .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
      .attr("height", yScale.bandwidth());

  if (title) bar.append("title")
      .text(title);

  svg.append("g")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(I)
    .join("text")
      .attr("text-anchor", i => X[i] < 0 ? "end" : "start")
      .attr("x", i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
      .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(i => format(X[i]));

  svg.append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(yAxis)
      .call(g => g.selectAll(".tick text")
        .filter(y => YX.get(y) < 0)
          .attr("text-anchor", "start")
          .attr("x", 6));

  return svg.node();
}

// function getRacesIdsByYear(year) {
//   var filteredData = [];
//   d3.csv("./data/races.csv").then(function (data) {
//     data.forEach((d) => {
//       if (d["year"] == year) {
//         filteredData.push(d["raceId"]);
//       }
//     });
//   });
//   return filteredData;
// }

// async function getRacesByYear(year) {
//   const filteredData = [];
//   let racesCSV = await d3.csv("./data/races.csv");
//   racesCSV.forEach((d) => {
//     if (d["year"] == year) {
//       filteredData.push({
//         raceId: d["raceId"],
//         name: d["name"],
//         round: d["round"],
//       });
//     }
//   });
//   return filteredData;
// }

// function getQualifyingResultByDriver(driverId, raceIds) {
//   var filteredData = [];
//   d3.csv("/data/qualifying.csv").then(function (data) {
//     data.forEach((d) => {
//       if (d["driverId"] == driverId && raceIds.includes(d["raceId"])) {
//         // filteredData.push(d["position"]);
//         filteredData.push({
//           raceId: d["raceId"],
//           position: d["position"],
//         });
//       }
//     });
//   });
//   return filteredData;
// }

// function getRaceResultByDriver(driverId, raceIds) {
//   var filteredData = [];
//   d3.csv("/data/results.csv").then(function (data) {
//     data.forEach((d) => {
//       if (d["driverId"] == driverId && raceIds.includes(d["raceId"])) {
//         // filteredData.push(d["position"]);
//         filteredData.push({
//           raceId: d["raceId"],
//           position: d["position"],
//         });
//       }
//     });
//   });
//   return filteredData;
// }

async function getPositionsGainedLost(driverId, year) {
  const filteredData = [];
  let racesCSV = await d3.csv("./data/races.csv");
  let resultsCSV = await d3.csv("./data/results.csv");

  racesCSV.forEach((race) => {
    resultsCSV.forEach((res) => {
      if (
        race["year"] == year &&
        race["raceId"] == res["raceId"] &&
        res["driverId"] == driverId
      ) {
        filteredData.push({
          name: race["name"],
          round: race["round"],
          positionsGainedLost:
            res["grid"] - (res["position"] == "\\N" ? 20 : res["position"]),
        });
      }
    });
  });

  return filteredData;
}

// async function getDriversAsArray() {
//   let drivers = [];

//   let driversCSV = await d3.csv("./data/drivers.csv");

//   driversCSV.forEach((d) => {
//     drivers.push(d["forename"] + " " + d["surname"] );
//   });

//   return drivers;
// }

// getDriversAsArray().then((data) => {
//   console.log(data);
// });

getPositionsGainedLost(844, 2021).then((data) => {
  let chart = DivergingBarChart(data, {
    x: (d) => d["positionsGainedLost"],
    y: (d) => d.name,
    yDomain: d3.groupSort(
      data,
      ([d]) => d["round"],
      (d) => d.name
    ),
    xFormat: "+,d",
    xLabel: "← Positions lost · Positions gained →",
    marginRight: 10,
    marginLeft: 10,
    colors: d3.schemeRdBu[3],
  });

  console.log(chart);

  let svg = document.getElementById("chart");
  svg.appendChild(chart);
});

// states = [
//   { 2010: 37254523, 2019: 39512223, State: "California" },
//   { 2010: 25145561, 2019: 28995881, State: "Texas" },
//   { 2010: 18801310, 2019: 21477737, State: "Florida" },
//   { 2010: 19378102, 2019: 19453561, State: "New York" },
//   { 2010: 12702379, 2019: 12801989, State: "Pennsylvania" },
//   { 2010: 12830632, 2019: 12671821, State: "Illinois" },
//   { 2010: 11536504, 2019: 11689100, State: "Ohio" },
//   { 2010: 9687653, 2019: 10617423, State: "Georgia" },
//   { 2010: 9535483, 2019: 10488084, State: "North Carolina" },
//   { 2010: 9883640, 2019: 9986857, State: "Michigan" },
//   { 2010: 8791894, 2019: 8882190, State: "New Jersey" },
//   { 2010: 8001024, 2019: 8535519, State: "Virginia" },
//   { 2010: 6724540, 2019: 7614893, State: "Washington" },
//   { 2010: 6392017, 2019: 7278717, State: "Arizona" },
//   { 2010: 6547629, 2019: 6949503, State: "Massachusetts" },
//   { 2010: 6346105, 2019: 6833174, State: "Tennessee" },
//   { 2010: 6483802, 2019: 6732219, State: "Indiana" },
//   { 2010: 5988927, 2019: 6137428, State: "Missouri" },
//   { 2010: 5773552, 2019: 6045680, State: "Maryland" },
//   { 2010: 5686986, 2019: 5822434, State: "Wisconsin" },
//   { 2010: 5029196, 2019: 5758736, State: "Colorado" },
//   { 2010: 5303925, 2019: 5639632, State: "Minnesota" },
//   { 2010: 4625364, 2019: 5148714, State: "South Carolina" },
//   { 2010: 4779736, 2019: 4903185, State: "Alabama" },
//   { 2010: 4533372, 2019: 4648794, State: "Louisiana" },
//   { 2010: 4339367, 2019: 4467673, State: "Kentucky" },
//   { 2010: 3831074, 2019: 4217737, State: "Oregon" },
//   { 2010: 3751351, 2019: 3956971, State: "Oklahoma" },
//   { 2010: 3574097, 2019: 3565287, State: "Connecticut" },
//   { 2010: 2763885, 2019: 3205958, State: "Utah" },
//   { 2010: 3725789, 2019: 3193694, State: "Puerto Rico" },
//   { 2010: 3046355, 2019: 3155070, State: "Iowa" },
//   { 2010: 2700551, 2019: 3080156, State: "Nevada" },
//   { 2010: 2915918, 2019: 3017825, State: "Arkansas" },
//   { 2010: 2967297, 2019: 2976149, State: "Mississippi" },
//   { 2010: 2853118, 2019: 2913314, State: "Kansas" },
//   { 2010: 2059179, 2019: 2096829, State: "New Mexico" },
//   { 2010: 1826341, 2019: 1934408, State: "Nebraska" },
//   { 2010: 1852994, 2019: 1792065, State: "West Virginia" },
//   { 2010: 1567582, 2019: 1787147, State: "Idaho" },
//   { 2010: 1360301, 2019: 1415872, State: "Hawaii" },
//   { 2010: 1316470, 2019: 1359711, State: "New Hampshire" },
//   { 2010: 1328361, 2019: 1344212, State: "Maine" },
//   { 2010: 989415, 2019: 1068778, State: "Montana" },
//   { 2010: 1052567, 2019: 1059361, State: "Rhode Island" },
//   { 2010: 897934, 2019: 973764, State: "Delaware" },
//   { 2010: 814180, 2019: 884659, State: "South Dakota" },
//   { 2010: 672591, 2019: 762062, State: "North Dakota" },
//   { 2010: 710231, 2019: 731545, State: "Alaska" },
//   { 2010: 601723, 2019: 705749, State: "District of Columbia" },
//   { 2010: 625741, 2019: 623989, State: "Vermont" },
//   { 2010: 563626, 2019: 578759, State: "Wyoming" },
// ];

// metric = "absolute";
// chart = DivergingBarChart(states, {
//   x:
//     metric === "absolute"
//       ? (d) => d[2019] - d[2010]
//       : (d) => d[2019] / d[2010] - 1,
//   y: (d) => d.State,
//   yDomain: d3.groupSort(
//     states,
//     ([d]) => d[2019] - d[2010],
//     (d) => d.State
//   ),
//   xFormat: metric === "absolute" ? "+,d" : "+%",
//   xLabel: "← decrease · Change in population · increase →",
//   marginRight: 70,
//   marginLeft: 70,
//   colors: d3.schemeRdBu[3],
// });

// let svg = document.getElementById("chart");
// svg.appendChild(chart);
