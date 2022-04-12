const svg_width = 1200;
const svg_height = 600;
const margin = {top: 50, right: 50, bottom: 50, left: 50};
const content_width = svg_width - margin.left - margin.right;
const content_height = svg_height - margin.top - margin.bottom;

let splitSpiderDetail = Split(['#settings-spider', '#detail'], {
    sizes: [50, 50],
    direction: 'horizontal',
});

// var svg = d3.select("svg")
//             .attr("width", svg_width)
//             .attr("height", svg_height);
//
// var content = svg.append("g")
//                  .attr("class", "content")
//                  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
//
// d3.csv("data/results.csv").then(results => {
//   d3.csv("data/races.csv").then(races => {
//     let racesPerYear = d3.rollup(
//       d3.filter(races, d => d.year == "2009"),
//       v => d3.map(v, d => parseInt(d.raceId)),
//       d => parseInt(d.year)
//     );
//
//     let currentRaces = racesPerYear[2009];
//
//     let meanPointsPerRace = d3.rollup(
//       d3.filter(results, d => d.raceId in currentRaces),
//       v => d3.mean(v, d => d.fastestLapTime),
//       d => parseInt(d.raceId)
//     );
//
//     console.log(meanPointsPerRace);
//
//     let xScale = d3.scaleBand()
//       .domain(meanPointsPerRace.keys())
//       .range([0, content_width])
//       .padding(0.2);
//
//     let yScale = d3.scaleLinear()
//       .domain([0, d3.max(meanPointsPerRace.values())])
//       .range([0, content_height]);
//
//     content.append("g")
//       .attr("class", "axis-bottom")
//       .attr("transform", "translate(0, " + content_height + ")")
//       .call(d3.axisBottom(xScale));
//
//     content.append("g")
//       .attr("class", "axis-left")
//       .call(d3.axisLeft(yScale));
//
//     let color = d3.scaleOrdinal(d3.schemeCategory10);
//
//     let bars = content.selectAll("rect")
//       .data(meanPointsPerRace)
//       .join("rect")
//       .attr("x", d => xScale(d[0]))
//       .attr("y", 0)
//       .attr("width", xScale.bandwidth())
//       .attr("height", d => yScale(d[1]))
//       .attr("fill", d => color(d[1]));
//   });
// });