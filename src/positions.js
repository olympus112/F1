// function positionChart() {
//   //TODO data inladen, deze werkt nog niet
//   const margin = 60;
//   const width = 1000 - 2 * margin;
//   const height = 600 - 2 * margin;

//   const svg = d3.select("svg");

//   const chart = svg
//     .append("g")
//     .attr("transform", `translate(${margin}, ${margin})`);

//   const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);

//   chart.append("g").call(d3.axisLeft(yScale));

//   const xScale = d3
//     .scaleBand()
//     .range([0, width])
//     .domain(sample.map((s) => s.language))
//     .padding(0.2);

//   chart
//     .append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(d3.axisBottom(xScale));

//   chart
//     .selectAll()
//     .data(goals)
//     .enter()
//     .append("rect")
//     .attr("x", (s) => xScale(s.language))
//     .attr("y", (s) => yScale(s.value))
//     .attr("height", (s) => height - yScale(s.value))
//     .attr("width", xScale.bandwidth())
//     .attr("x", (actual, index, array) => xScale(actual.value));
// }

export function computeRacing(driverId, year, races, results) {
  let filteredData = [];
  let score = 0;

  races.forEach((race) => {
    results.forEach((res) => {
      if (
        race["year"] == year &&
        race["raceId"] == res["raceId"] &&
        res["driverId"] == driverId
      ) {
        filteredData.push([
          race["name"],
          race["round"],
          res["position"] == "\\N" ? 20 : res["position"],
        ]);

        score = score + res["position"] == "\\N" ? 20 : res["position"];
      }
    });
  });

  score = score/filteredData.length;
  console.log({data: filteredData, score: score});
  return {data: filteredData, score: score};
}

export default { computeRacing };
