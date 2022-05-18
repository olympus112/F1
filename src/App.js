import React, {Component} from "react";
import "./App.css";
import {Grid, Container, Typography} from "@mui/material";
import DriverPicker from "./driverpicker";
import YearPicker from "./yearPicker";
import SpiderGraph from "./spidergraph";
import Details from "./details";
import {Paper, Box} from "@mui/material";
import {amber, blue, blueGrey, common, cyan, green, orange, purple, red, teal, yellow} from '@mui/material/colors';
import {
    downloadCharacteristics,
    downloadCountries,
    preprocessMinMaxCharacteristics,
    testCharacteristics
} from "./preprocess";
import {dark} from "@mui/material/styles/createPalette";
// preprocessMinMaxCharacteristics()
// downloadCharacteristics()
export const Graphs = {
    raceConsistency: {
        id: 0,
        name: "Race Consistency",
        explanation: "The Race consistency represents a measurement of how consistent the results are of a driver throughout all the races in a season. If the driver places with low consistency, the coloured area will be bigger."
    },
    timeConsistency: {
        id: 1,
        name: "Time Consistency",
        explanation: "The Time Consistency represents a measurement of how consistent the lap times are of a driver thoughout each race. The y-axis represents the variance in laptimes compared to the avarage laptime of this driver. Higher values on the y-axis will result in a worse time consistency score."
    },
    positionsGainedLost: {
        id: 2,
        name: "Positions Gained/Lost",
        explanation: "The Positions Gained/Lost attribute gives an indication on how good a driver finished the race compared to the starting position. Winning the race gives a score of 1, finishing in the same position as at the start of the race gives a score of 0.5. The score is calculated by comparing the possible gained/lost positions with the actual positions gained/lost."
    },
    racing: {
        id: 3,
        name: "Racing",
        explanation: "The Racing attribute gives an indication of how good this driver is in the race itself. On the y-axis, the position is shown of which the racer finished in each race. This means lower values on the y-axis mean a better Racing score."
    },
    timeRacing: {
        id: 4,
        name: "Time Racing",
        explanation: "The Time Racing attribute compares the final qualifying time of the racer to the best qualifying time of all racers for each qualification. If the driver has the best qualifying time, the y-axis will have a zero value, otherwise the difference with the best time is shown."
    }
};

class App extends Component {
    constructor(props) {
        super(props);

        let defaultDriver = props.preprocessed.drivers[11]; // Lewis Hamilton
        let defaultYear = 2022;

        this.state = {
            // Dimensions
            width: 0,
            height: 0,

            // Current state
            driver: defaultDriver,
            compare: [],
            year: defaultYear,
            graph: Graphs.positionsGainedLost,

            // Preloaded data
            preprocessed: props.preprocessed,
            drivers: props.drivers,
            races: props.races,
            results: props.results,
            laptimes: props.laptimes,
            constructors: props.constructors,

            // Graph data
            data: [
                props.preprocessed.characteristics[defaultDriver.id][defaultYear].raceConsistency,
                props.preprocessed.characteristics[defaultDriver.id][defaultYear].timeConsistency,
                props.preprocessed.characteristics[defaultDriver.id][defaultYear].positionsGainedLost,
                props.preprocessed.characteristics[defaultDriver.id][defaultYear].racing,
                props.preprocessed.characteristics[defaultDriver.id][defaultYear].timeRacing
            ],
            compareData: [],

            // Styling
            color: {
                border: "#bdbdbd",
                driver: teal,
                compare: [blue, orange, red] // Access using red[500], see https://mui.com/material-ui/customization/color/
            }
        };
    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
        });
        this.setState({
            year: driver.years[driver.years.length - 1]
        });
        console.log("Selected new driver: ", driver);
        this.updateRacerData(driver.id, this.state.year);
    };

    selectYear = (year) => {
        this.setState({
            year: year,
        });

        console.log("Selected new year: ", year);

        this.updateRacerData(this.state.driver.id, year);
    };

    selectGraph = (graph) => {
        this.setState({
            graph: graph
        });
    }

    addCompare = (compare) => {
        if (!this.state.compare.includes(compare)) {
            this.setState({
                compare: [...this.state.compare, compare],
                compareData: [...this.state.compareData, this.getData(compare.id, this.state.year)],
            });

            console.log("Added new driver: ", compare.name);
        }
    };

    removeCompare = (compare) => {
        let index = this.state.compare.indexOf(compare);

        if (index > -1) {
            this.state.compare.splice(index, 1);
            this.state.compareData.splice(index, 1);
            this.setState({
                compare: [...this.state.compare],
                compareData: [...this.state.compareData]
            });

            console.log("Removed driver: ", compare.name);
        }
    };

    inCompare = (compare) => {
        return !!this.state.compare.includes(compare);
    };

    resetCompare = (newYear) => {
        let compareDrivers = this.state.preprocessed.drivers.filter(
            driver => driver.years.includes(newYear) && driver !== this.state.driver
        );
        let filteredCompare = this.state.compare.filter(compare => compareDrivers.includes(compare));

        this.setState({
            compare: filteredCompare,
            compareData: filteredCompare.map(compare => this.getData(compare.id, newYear)),
        });

        console.log("Cleared drivers from compare");
    };


    getData = (driverId, year) => {
        return [
            this.state.preprocessed.characteristics[driverId][year].raceConsistency,
            this.state.preprocessed.characteristics[driverId][year].timeConsistency,
            this.state.preprocessed.characteristics[driverId][year].positionsGainedLost,
            this.state.preprocessed.characteristics[driverId][year].racing,
            this.state.preprocessed.characteristics[driverId][year].timeRacing,
        ];
    }

    updateRacerData = (driverId, year) => {
        this.setState({
            data: this.getData(driverId, year)
        });
    }

    updateDimensions = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);

        this.updateRacerData(this.state.driver.id, this.state.year);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        return (
            <Container maxWidth="xl">
                <Box sx={{
                    borderRadius: 1,
                    mb: 1,
                    mt: 1,
                    backgroundSize: "contain",
                    backgroundRepeat: "repeat-x",
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Checkerboard_Pattern_8x6.svg/1200px-Checkerboard_Pattern_8x6.svg.png')",
                }}>
                    <Box sx={{
                        borderRadius: 1,
                        backgroundImage: "linear-gradient(to right, rgb(0, 0, 0, 0.9), transparent)"
                    }}>
                        <Typography variant="h6" gutterBottom component="div" sx={{color: "white", p: 1, pl: 2}}>
                            F1 Dashboard
                        </Typography>
                    </Box>
                </Box>
                <Grid container spacing={2} alignItems={"stretch"} >
                    <Grid item xs={12}>
                        <DriverPicker
                            color={this.state.color}
                            teams={this.state.preprocessed.teams}
                            images={this.state.preprocessed.images}
                            drivers={this.state.preprocessed.drivers}
                            flags={this.state.preprocessed.flags}
                            driver={this.state.driver}
                            year={this.state.year}
                            compare={this.state.compare}
                            selectDriver={this.selectDriver}
                            selectYear={this.selectYear}
                            addCompare={this.addCompare}
                            removeCompare={this.removeCompare}
                            resetCompare={this.resetCompare}
                            inCompare={this.inCompare}
                        />
                    </Grid>
                    <Grid item xs={12} md ={12} lg={4}>
                        <Paper elevation={0} variant="outlined" sx={{
                            borderColor: this.state.color.border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <SpiderGraph
                                width={300}
                                height={400}
                                color={this.state.color}
                                driver={this.state.driver}
                                compare={this.state.compare}
                                data={this.state.data}
                                compareData={this.state.compareData}
                                averages={this.state.preprocessed.averages[this.state.year]}
                                selectGraph={this.selectGraph}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={8}>
                        <Paper elevation={0} variant="outlined" sx={{borderColor: this.state.color.border}}>
                            <Details
                                driver={this.state.driver}
                                compare={this.state.compare}
                                color={this.state.color}
                                data={this.state.data}
                                compareData={this.state.compareData}
                                graph={this.state.graph}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
