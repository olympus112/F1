let div = d3.select("#racers-list");

d3.csv("/data/drivers.csv").then(drivers => {
    d3.json("/res/images.json").then(images => {
        let location = images.location;
        let racers = images.racers;

        for (let racerId in racers) {

            let image = div.append("img")
                .attr("width", 50)
                .attr("height", 50)
                .attr("src", location + racers[racerId].image);
        }
    });
});
