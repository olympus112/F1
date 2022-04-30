// async function getPositionsGainedLost(driverId, year) {
//   const filteredData = [];
//   let racesCSV = await d3.csv("./data/races.csv");
//   let resultsCSV = await d3.csv("./data/results.csv");

//   racesCSV.forEach((race) => {
//     resultsCSV.forEach((res) => {
//       if (
//         race["year"] == year &&
//         race["raceId"] == res["raceId"] &&
//         res["driverId"] == driverId
//       ) {
//         filteredData.push([
//           race["name"],
//           race["round"],
//           res["grid"] - (res["position"] == "\\N" ? 20 : res["position"]),
//         ]);
//       }
//     });
//   });

//   return filteredData;
// }

// getPositionsGainedLost(844, 2021).then((val) => {
//   //   console.log(val);

//   let csvContent = "data:text/csv;charset=utf-8,";

//   csvContent += "race,round,gain" + "\r\n";
//   val.forEach(function (rowArray) {
//     let row = rowArray.join(",");

//     // console.log(row);

//     csvContent += row + "\r\n";
//     console.log(csvContent);
//   });

//   let encodedUri = encodeURI(csvContent);
//   window.open(encodedUri);
// });

function positionsGainedLostChart() {
  let margin = { top: 40, right: 50, bottom: 60, left: 50 };

  let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  let svg = d3
    .select("body")
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

  function parse(d) {
    d.round = +d.round;
    d.gain = +d.gain;
    return d;
  }

  // let legend = svg.append("g").attr("class", "legend");

  // legend
  //   .append("text")
  //   .attr("x", width - cfg.legendRightMargin)
  //   .attr("text-anchor", "end")
  //   .text("European Countries by");

  // legend
  //   .append("text")
  //   .attr("x", width - cfg.legendRightMargin)
  //   .attr("y", 20)
  //   .attr("text-anchor", "end")
  //   .style("opacity", 0.5)
  //   .text("2016 Population Growth Rate (%)");

  d3.csv("gainedLost.csv", parse, function (error, data) {
    if (error) throw error;

    y.domain(
      data.map(function (d) {
        return d.race;
      })
    );
    x.domain(
      d3.extent(data, function (d) {
        return d.gain;
      })
    );

    let max = d3.max(data, function (d) {
      return d.gain;
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
        return x(Math.min(0, d.gain));
      })
      .attr("y", function (d) {
        return y(d.race);
      })
      .attr("height", y.bandwidth())
      .attr("width", function (d) {
        return Math.abs(x(d.gain) - x(0));
      })
      .style("fill", function (d) {
        return colour(d.gain);
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
        return y(d.race);
      })
      .attr("dx", function (d) {
        return d.gain < 0 ? cfg.labelMargin : -cfg.labelMargin;
      })
      .attr("dy", y.bandwidth())
      .attr("text-anchor", function (d) {
        return d.gain < 0 ? "start" : "end";
      })
      .text(function (d) {
        return d.race;
      });
  });
}

positionsGainedLostChart()