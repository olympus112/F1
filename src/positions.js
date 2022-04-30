// async function getFinishingPosition(driverId, year) {
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
//           res["position"] == "\\N" ? 20 : res["position"],
//         ]);
//       }
//     });
//   });

//   return filteredData;
// }

// getFinishingPosition(844, 2021).then((val) => {
//   //   console.log(val);

//   let csvContent = "data:text/csv;charset=utf-8,";

//   csvContent += "race,round,position" + "\r\n";
//   val.forEach(function (rowArray) {
//     let row = rowArray.join(",");

//     // console.log(row);

//     csvContent += row + "\r\n";
//     console.log(csvContent);
//   });

//   let encodedUri = encodeURI(csvContent);
//   window.open(encodedUri);
// });



function positionChart() {

    //TODO data inladen, deze werkt nog niet
    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;
  
    const svg = d3.select("svg");
  
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);
  
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
  
    chart.append("g").call(d3.axisLeft(yScale));
  
    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(sample.map((s) => s.language))
      .padding(0.2);
  
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  
    chart
      .selectAll()
      .data(goals)
      .enter()
      .append("rect")
      .attr("x", (s) => xScale(s.language))
      .attr("y", (s) => yScale(s.value))
      .attr("height", (s) => height - yScale(s.value))
      .attr("width", xScale.bandwidth())
      .attr("x", (actual, index, array) => xScale(actual.value));
  }
  
  
  