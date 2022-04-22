import * as d3 from "d3";

import drivers from "./data/drivers.csv";
import races from "./data/races.csv";
import results from "./data/results.csv";
import lapTimes from "./data/lap_times.csv";
import constructors from "./data/constructors.csv";

// [
//     {
//         id: "1",
//         name: "Lewis Hamiltion",
//         nationality: "British",
//         wiki: "http://en.wikipedia.org/wiki/Lewis_Hamilton",
//         years: ["2008", "2009", ...],
//         teams: [
//             {
//                 id: "1",
//                 name: "McLaren",
//                 nationality: "British",
//                 wiki: "http://en.wikipedia.org/wiki/McLaren",
//             }, {
//                 id: "131",
//                 name: "Mercedes",
//                 nationality: "German",
//                 wiki: "http://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One",
//             }
//         ]
//     },
//     {
//         ...
//     }
// ]

async function preprocess() {
    console.log('Started preprocessing');

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

        let teams = {};
        allConstructors.forEach(team => teams[parseInt(team.constructorId)] = {
            name: team.name,
            nationality: team.nationality,
            wiki: team.url,
        })

        let currentResults = allResults.filter(result => parseInt(result.driverId) === currentDriverId);
        let currentRaces = currentResults.map(result => parseInt(result.raceId));
        let currentTeamIds = [...new Set(currentResults.map(result => parseInt(result.constructorId)))];
        let currentTeams = currentTeamIds.map(teamId => {
            return {
                id: teamId,
                name: teams[teamId].name,
                nationality: teams[teamId].nationality,
                wiki: teams[teamId].wiki,
            }
        });

        let filteredRaces = allRaces.filter(race => currentRaces.includes(parseInt(race.raceId)));
        let filteredYears = filteredRaces.map(race => parseInt(race.year));
        let currentYears = [...new Set(filteredYears)];

        let driver = {
            id: currentDriverId,
            name: currentDriverName,
            nationality: currentNationality,
            years: currentYears,
            teams: currentTeams,
            wiki: currentWiki
        };

        result.push(driver);
    }

    console.log('Finished preprocessing');

    return result;
}

export function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'preprocessed.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

export async function downloadPreprocessedData() {
	exportToJsonFile(await preprocess());
}