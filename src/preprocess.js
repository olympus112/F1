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

export function preprocess() {
    let result = [];
    d3.csv(drivers).then(allDrivers => {
        d3.csv(races).then(allRaces => {
            d3.csv(results).then(allResults => {
                d3.csv(lapTimes).then(allLapTimes => {
                    d3.csv(constructors).then(constructors => {
                        for (let currentDriver of allDrivers) {
                            let currentDriverId = currentDriver.driverId;
                            let currentDriverName = currentDriver.forename + ' ' + currentDriver.surname;
                            let currentNationality = currentDriver.nationality;
                            let currentWiki = currentDriver.url;

                            let teams = {};
                            constructors.forEach(team => teams[team.constructorId] = {
                                name: team.name,
                                nationality: team.nationality,
                                wiki: team.url,
                            })

                            let currentResults = allResults.filter(result => result.driverId === currentDriverId);
                            let currentRaces = currentResults.map(result => result.raceId);
                            let currentTeamIds = [...new Set(currentResults.map(result => result.constructorId))];
                            let currentTeams = currentTeamIds.map(teamId => {
                                return {
                                    id: teamId,
                                    name: teams[teamId].name,
                                    nationality: teams[teamId].nationality,
                                    wiki: teams[teamId].wiki,
                                }
                            });

                            let filteredRaces = allRaces.filter(race => race.raceId in currentRaces);
                            let filteredYears = filteredRaces.map(race => race.year);
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
                    });
                });
            });
        });
    });

    return result;
}