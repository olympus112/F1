import * as d3 from "d3";

import drivers from "./data/drivers.csv";
import races from "./data/races.csv";
import results from "./data/results.csv";
import lapTimes from "./data/lap_times.csv";
import constructors from "./data/constructors.csv";

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

export async function downloadDrivers() {
    exportToJsonFile('drivers.json', await preprocessDrivers());
}

export async function downloadDriverImages() {
    exportToJsonFile('images.json', await preprocessDriverImages());
}

export async function downloadTeams() {
    exportToJsonFile('teams.json', await preprocessTeams());
}