import * as d3 from "d3";

const parseDate = d3.timeParse('%d/%m/%Y');

// Returns data to be used in details.js to make the graph and a score (avarage deviation of the data with the least square method)
export function computeRaceConsistency(driverId, year, races, results) {
    let filteredRaces = races.filter(row => row.year === year);
    const maxRaceId = Math.max(...filteredRaces.map(race => race.raceId));
    const minRaceId = Math.min(...filteredRaces.map(race => race.raceId));
    let filteredResults = results.filter(row => row.driverId === driverId && row.raceId >= minRaceId && row.raceId <= maxRaceId);
    let data = [];
    filteredRaces.forEach(race => {
        let found = false;
        let date = parseDate(race.date);
        date = new Date(race.year, date.getMonth(), date.getDate());
        filteredResults.forEach(result => {
            if (race.raceId === result.raceId) {
                found = true;
                if (result.position === '\\N') {
                    data.push({date: date, value: "20"})
                } else
                    data.push({date: date, value: result.position})
            }
        });
        if (!found) {
            data.push({date: date, value: "20"})
        }
    });

    data = data.sort((a, b) => (a.date > b.date) ? 1 : -1)
    const lsm = leastSquareMethod(data);
    return {data: data, lsm: lsm};
}

//returns data to be used in details.js and a score. The score is the avarage standard deviation in laptimes over all the races.
export function computeTimeConsistency(driverId, year, races, lapTimes) {
    let filteredRaces = races.filter(row => row.year === year);
    const maxRaceId = Math.max(...filteredRaces.map(race => race.raceId));
    const minRaceId = Math.min(...filteredRaces.map(race => race.raceId));

    //filter out useless laptimes
    let filteredlapTimes = lapTimes.filter(row => row.driverId === driverId && row.raceId >= minRaceId && row.raceId <= maxRaceId);
    let data = [];

    filteredRaces.forEach(race => {
        let date = parseDate(race.date);
        date = new Date(race.year, date.getMonth(), date.getDate());

        const raceLaptimes = filteredlapTimes.filter(row => row.raceId === race.raceId);

        let unfilteredMean = [];
        let unfilteredN = 0;
        let filterVariance = 1.3;

        //calculate Mean of unfiltered lap times (including safety car, pitstop,...)
        raceLaptimes.forEach(lapTime => {
            unfilteredMean.push(parseInt(lapTime.milliseconds));
            unfilteredN++;
        });

        unfilteredMean = unfilteredMean[Math.round(unfilteredN / 2)];

        //list containing only the racetimes in milliseconds, nothing else
        //Filtering applied
        const times = [];
        raceLaptimes.forEach(lapTime => {
            const t = parseInt(lapTime.milliseconds);
            if (t <= filterVariance * unfilteredMean) {
                times.push(t);
            }
        });

        if (times.length !== 0) {
            let mean = 0;
            let n = 0;
            // calculate avarage and deviation
            times.forEach(time => {
                mean += time;
                n++;
            });
            mean = mean / n;

            //sum of difference between values and mean squared
            let diffMean = 0;
            times.forEach(time => {
                diffMean += Math.pow(Math.abs(time - mean), 2);
            });

            const sd = Math.sqrt(diffMean / n);
            data.push({date: date, value: sd / mean * 100})
        }
    });
    data = data.sort((a, b) => (a.date > b.date) ? 1 : -1);

    //calculate leastSquares
    const lsm = leastSquareMethod(data);

    return {data: data, lsm: lsm};
};

export function computeTimeRacing(driverId, year, races, qualification){
    let filteredRaces = races.filter(row => parseInt(row.year) === year);
    var timeDifferences = [];
    filteredRaces.forEach(race => {
        var raceId = race.raceId;
        var filteredQual = qualification.filter(row => row.raceId === raceId);
        var minTime = 100 * 60 //100 minutes => just to initialize. 
        var racerTime = -1; //default value, if not changed, value does not count. 
        filteredQual.forEach(qual => {
            var qualTime = qual.q3;
            if (qualTime === "\\N"){
                qualTime = qual.q2;
            }
            if (qualTime === "\\N"){
                qualTime = qual.q1;
            }

            qualTime = qualTime.split(":");
            var minutes = parseInt(qualTime[0]);
            var seconds = parseFloat(qualTime[1]);
            var finalTime = minutes * 60 + seconds;
            if (finalTime < minTime){
                minTime = finalTime;
            }
            if (parseInt(qual.driverId) === driverId) {
                racerTime = finalTime;
            }
        })
        if (racerTime !== -1){  
        var timeDiff = racerTime - minTime;
        timeDifferences.push({date: parseDate(race.date), timeDiff: timeDiff});
        }
    });

    var avgTimeDiff = 0;
    timeDifferences.forEach(race => {
        avgTimeDiff +=race.timeDiff;
    });
    avgTimeDiff /= timeDifferences.length;
    console.log(avgTimeDiff);

    return {score: avgTimeDiff, data: timeDifferences};
}




function leastSquareMethod(data) {
    const n = data.length;
    let sumXY = 0;
    let sumX = 0;
    let sumY = 0;
    let sumXSquared = 0;

    data.forEach(element => {
        const date = element.date.getTime();
        const value = parseInt(element.value);
        sumXY += date * value;
        sumX += date;
        sumY += value;
        sumXSquared += date * date;
    });

    const b = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);
    const a = sumY / n - b * sumX / n;

    const lsm = [];
    let sqDiff = 0;
    data.forEach(element => {
        const x = element.date;
        const y = a + b * x;
        lsm.push({value: y, date: x});
        sqDiff += Math.pow((element.value - y), 2);
    });
    const avgDiff = Math.sqrt(sqDiff / data.length);
    return {lsmPoints: lsm, score: avgDiff};
}

export default {computeRaceConsistency, computeTimeConsistency};