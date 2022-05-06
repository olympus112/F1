import * as d3 from "d3";

import drivers from "./data/drivers.csv";
import races from "./data/races.csv";
import results from "./data/results.csv";
import lapTimes from "./data/lap_times.csv";
import qualifying from "./data/qualifying.csv";
import constructors from "./data/constructors.csv";
const countries = require('./data/countries.json');


// [
//     {
//         id: 1,
//         name: "Lewis Hamiltion",
//         nationality: "British",
//         wiki: "http://en.wikipedia.org/wiki/Lewis_Hamilton",
//         years: [2008, 2009, ...],
//         teams: [1, 32, ...]
//     },
//     {
//         ...
//     }
// ]

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

async function getWikiImage(url) {
    let wikiSubject = url.substring(url.lastIndexOf('/') + 1);
    let wikiResponse = await fetch('https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=thumbnail|original&titles=' + wikiSubject);
    let wikiContent = await wikiResponse.json();
    let pages = wikiContent.query.pages;
    let keys = Object.keys(pages);

    if (keys.length === 0)
        return {
            image: '',
            thumbnail: ''
        };

    let page = pages[keys[0]];

    let originalSource = ''
    if (page.hasOwnProperty('original'))
        originalSource = page.original.source;

    let thumbnailSource = ''
    if (page.hasOwnProperty('thumbnail'))
        thumbnailSource = page.thumbnail.source;

    return {
        image: originalSource,
        thumbnail: thumbnailSource
    };
}

async function preprocessDriverImages() {
    console.log('Started driver image preprocessing');

    let result = {};
    let allDrivers = await d3.csv(drivers);
    for (let currentDriver of allDrivers) {
        let currentDriverId = parseInt(currentDriver.driverId);
        let currentDriverWiki = currentDriver.url;

        result[currentDriverId] = await getWikiImage(currentDriverWiki);
    }

    console.log('Finished driver image preprocessing');

    return result;
}

async function preprocessTeams() {
    console.log('Started team preprocessing');

    let result = {};

    let allConstructors = await d3.csv(constructors);
    for (const constructor of allConstructors) {
        result[parseInt(constructor.constructorId)] = {
            id: parseInt(constructor.constructorId),
            name: constructor.name,
            nationality: constructor.nationality,
            wiki: constructor.url,
            image: "", // image: await getWikiImage(team.url),
        };
    }

    console.log('Finished team preprocessing');

    return result;
}

function preprocessTimeConsistency(raceLapTimes) {
    let unfilteredMean = [];
    let unfilteredN = 0;
    let filterVariance = 1.3;

    //calculate Mean of unfiltered lap times (including safety car, pitstop,...)
    raceLapTimes.forEach(lapTime => {
        unfilteredMean.push(parseInt(lapTime.milliseconds));
        unfilteredN++;
    });

    unfilteredMean = unfilteredMean[Math.round(unfilteredN / 2)];

    //list containing only the racetimes in milliseconds, nothing else
    //Filtering applied
    const times = [];
    raceLapTimes.forEach(lapTime => {
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

        return sd / mean * 100;
    }

    return null;
}

function preprocessTimeRacing(driverId, race, qualifications) {
    let parseDate = d3.timeParse('%d/%m/%Y')
    const filteredQualifications = qualifications.filter(qualification => parseInt(qualification.raceId) === parseInt(race.raceId));

    let minTime = 100 * 60; // 100 minutes => just to initialize.
    let racerTime = -1; // default value, if not changed, value does not count.
    filteredQualifications.forEach(qualification => {
        let qualTime = qualification.q3;
        if (qualTime === "\\N")
            qualTime = qualification.q2;
        if (qualTime === "\\N")
            qualTime = qualification.q1;
        qualTime = qualTime.split(":");

        const minutes = parseInt(qualTime[0]);
        const seconds = parseFloat(qualTime[1]);
        const finalTime = minutes * 60 + seconds;

        if (finalTime < minTime)
            minTime = finalTime;

        if (parseInt(qualification.driverId) === driverId)
            racerTime = finalTime;
    })

    if (racerTime !== -1) {
        return racerTime - minTime;
    }

    return null;
}

async function preprocessAllCharacteristics() {
    console.log('Started characteristics preprocessing');

    let allDrivers = await d3.csv(drivers);
    let allRaces = await d3.csv(races);
    let allResults = await d3.csv(results);
    let allLapTimes = await d3.csv(lapTimes);
    let allQualifications = await d3.csv(qualifying);

    let characteristics = {};
    allDrivers.forEach(currentDriver => {
        let currentDriverId = parseInt(currentDriver.driverId);
        let currentResults = allResults.filter(result => parseInt(result.driverId) === currentDriverId);
        let currentRaces = currentResults.map(result => parseInt(result.raceId));
        let filteredRaces = allRaces.filter(race => currentRaces.includes(parseInt(race.raceId)));
        let filteredYears = filteredRaces.map(race => parseInt(race.year));
        let currentYears = [...new Set(filteredYears)];

        let driverCharacteristics = {};
        currentYears.forEach(currentYear => {
            driverCharacteristics[currentYear] = preprocessCharacteristics(allRaces, allResults, allLapTimes, allQualifications, currentDriverId, currentYear);
        });

        characteristics[currentDriverId] = driverCharacteristics;

        if (currentDriverId % 10 === 0)
            console.log(`${currentDriverId / 855.0 * 100}`, "%");
    });

    console.log('Finished characteristics preprocessing');

    return characteristics;
}

function countryCodes() {
    let res = {};
    for (let country of countries) {
        let demonym = country.demonyms.eng;
        res[demonym.m] = country.flag;
    }

    return res;
}

export async function testCharacteristics() {
    console.log('Started characteristics preprocessing');

    let allDrivers = await d3.csv(drivers);
    let allRaces = await d3.csv(races);
    let allResults = await d3.csv(results);
    let allLapTimes = await d3.csv(lapTimes);
    let allQualifications = await d3.csv(qualifying);

    let a = preprocessCharacteristics(allRaces, allResults, allLapTimes, allQualifications, 1, 2021);
    console.log(a);
}

function preprocessCharacteristics(allRaces, allResults, allLapTimes, allQualifications, driverId, year) {
    const parseDate = d3.timeParse('%d/%m/%Y');

    let filteredRaces = allRaces.filter(race => parseInt(race.year) === year);
    // const maxRaceId = Math.max(...filteredRaces.map(race => parseInt(race.raceId)));
    // const minRaceId = Math.min(...filteredRaces.map(race => parseInt(race.raceId)));

    // let filteredResults = allResults.filter(race => parseInt(race.driverId) === driverId && parseInt(race.raceId) >= minRaceId && parseInt(race.raceId) <= maxRaceId);
    // let filteredLapTimes = allLapTimes.filter(lapTime => parseInt(lapTime.driverId) === driverId && parseInt(lapTime.raceId) >= minRaceId && parseInt(lapTime.raceId) <= maxRaceId);
    let filteredResults = allResults.filter(race => parseInt(race.driverId) === driverId);
    let filteredLapTimes = allLapTimes.filter(lapTime => parseInt(lapTime.driverId) === driverId);

    // Positions gained lost
    let pglData = [];
    let pglScore = 0;

    // Racing
    let rData = [];
    let rScore = 0;

    // Race consistency
    let rcData = [];
    let rcScore = 0;

    // Time consistency
    let tcData = [];
    let tcScore = 0;

    // Time racing
    let trData = [];
    let trScore = 0;

    filteredRaces.forEach(race => {
        let found = false;
        let parsedDate = parseDate(race.date);
        let date = new Date(race.year, parsedDate.getMonth(), parsedDate.getDate());

        // Time Consistency
        const raceLapTimes = filteredLapTimes.filter(lapTime => parseInt(lapTime.raceId) === parseInt(race.raceId));
        let timeConsistency = preprocessTimeConsistency(raceLapTimes);
        if (timeConsistency !== null)
            tcData.push({date: date, value: timeConsistency})

        // Time racing
        let timeRacing = preprocessTimeRacing(driverId, race, allQualifications);
        if (timeRacing !== null)
            trData.push({date: date, timeDiff: timeRacing});

        // Other characteristics
        filteredResults.forEach(result => {
            if (parseInt(race.raceId) === parseInt(result.raceId)) {
                found = true;

                // Positions gained lost
                pglData.push([
                    race.name,
                    race.round,
                    parseInt(result.grid) - (result.position === "\\N" ? 20 : parseInt(result.position))
                ])
                pglScore = pglScore + (parseInt(result.grid) - (result.position === "\\N" ? 20 : parseInt(result.position)));

                // Racing
                rData.push([
                    race.name,
                    race.round,
                    result.position === "\\N" ? 20 : parseInt(result.position),
                ]);
                rScore = rScore + (result.position === "\\N" ? 20 : parseInt(result.position));

                // Race consistency
                rcData.push({
                    date: date,
                    value: result.position === '\\N' ? 20 : parseInt(result.position)
                });
            }
        });

        if (!found) {
            // Race consistency
            rcData.push({
                date: date,
                value: 20
            })
        }
    });

    // Positions gained lost
    pglScore = pglScore / pglData.length;
    let positionsGainedLost = {data: pglData, score: pglScore};

    // Racing
    rScore = rScore / rData.length;
    let racing = {data: rData, score: rScore};

    // Race consistency
    rcData = rcData.sort((a, b) => (a.date > b.date) ? 1 : -1)
    rcScore = leastSquareMethod(rcData);
    let raceConsistency = {data: rcData, lsm: rcScore};

    // Time consistency
    tcData = tcData.sort((a, b) => (a.date > b.date) ? 1 : -1);
    tcScore = leastSquareMethod(tcData);
    let timeConsistency = {data: tcData, lsm: tcScore};

    // Time racing
    let timeRacingSum = trData.reduce((total, timeRacing) => total + timeRacing.timeDiff, 0);
    let timeRacingAverage = (timeRacingSum / trData.length) || 0;
    let timeRacing = {data: trData, score: timeRacingAverage};

    return {
        raceConsistency: raceConsistency,
        timeConsistency: timeConsistency,
        positionsGainedLost: positionsGainedLost,
        racing: racing,
        timeRacing: timeRacing
    };
}

async function preprocessDrivers() {
    console.log('Started driver preprocessing');

    let result = [];

    let allDrivers = await d3.csv(drivers);
    let allRaces = await d3.csv(races);
    let allResults = await d3.csv(results);
    let allConstructors = await d3.csv(constructors);
    // let allLapTimes = await d3.csv(lapTimes);

    for (let currentDriver of allDrivers) {
        let currentDriverId = parseInt(currentDriver.driverId);
        let currentDriverName = currentDriver.forename + ' ' + currentDriver.surname;
        let currentNationality = currentDriver.nationality;

        let currentWiki = currentDriver.url;

        let currentResults = allResults.filter(result => parseInt(result.driverId) === currentDriverId);
        let currentRaces = currentResults.map(result => parseInt(result.raceId));
        let currentTeamIds = [...new Set(currentResults.map(result => parseInt(result.constructorId)))];

        let filteredRaces = allRaces.filter(race => currentRaces.includes(parseInt(race.raceId)));
        let filteredYears = filteredRaces.map(race => parseInt(race.year));
        let currentYears = [...new Set(filteredYears)];

        let driver = {
            id: currentDriverId,
            name: currentDriverName,
            nationality: currentNationality,
            years: currentYears,
            teams: currentTeamIds,
            wiki: currentWiki
        };

        result.push(driver);
    }

    let compareYears = (driverA, driverB) => Math.max(...driverB.years) - Math.max(...driverA.years);
    let compareNames = (driverA, driverB) => driverA.name < driverB.name ? -1 : driverA.name === driverB.name ? 0 : 1;

    result.sort((driverA, driverB) => {
        let years = compareYears(driverA, driverB);
        if (years === 0)
            return compareNames(driverA, driverB);

        return years;
    });

    console.log('Finished driver preprocessing');

    return result;
}

export function exportToJsonFile(file, jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', file);
    linkElement.click();
}

export async function downloadCountries() {
    exportToJsonFile("countries.json", await countryCodes());
}

export async function downloadCharacteristics() {
    exportToJsonFile("characteristics.json", await preprocessAllCharacteristics());
}

export async function downloadDrivers() {
    exportToJsonFile('drivers.json', await preprocessDrivers());
}

export async function downloadDriverImages() {
    exportToJsonFile('images.json', await preprocessDriverImages());
}

export async function downloadTeams() {
    exportToJsonFile('teams.json', await preprocessTeams());
}