import React, {Component} from "react";
import "./App.css";
import {Grid, Container, Typography} from "@mui/material";
import DriverPicker from "./driverpicker";
import YearPicker from "./yearPicker";
import SpiderGraph from "./spidergraph";
import Details from "./details";
import {Paper, Box} from "@mui/material";
import {amber, cyan, green, purple, red, yellow} from '@mui/material/colors';
import {downloadCharacteristics, downloadCountries, testCharacteristics} from "./preprocess";

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
                driver: red,
                compare: [purple, amber, cyan, green] // Access using red[500], see https://mui.com/material-ui/customization/color/
                // driver: "#CC333F",
                // compare: ["#9467BC", "#EDC951", "#00A0B0", "#3ba95f"]
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
        if (this.state.compare.includes(compare)) {
            return true;
        }
        return false;
    };

    resetCompare = () => {
        this.setState({
            compare: [],
            compareData: [],
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
                    bgcolor: 'gray',
                    borderRadius: 1,
                    mb: 2
                }}>
                    <Typography variant="h6" gutterBottom component="div" sx={{color: "white", p: 1, pl: 2}}>
                        F1 Dashboard
                    </Typography>
                </Box>
                <Grid container spacing={2}>
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
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} variant="outlined" sx={{
                            borderColor: this.state.color.border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <SpiderGraph
                                width={300}
                                height={300}
                                color={this.state.color}
                                driver={this.state.driver}
                                compare={this.state.compare}
                                data={this.state.data}
                                compareData={this.state.compareData}
                                selectGraph={this.selectGraph}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} variant="outlined" sx={{borderColor: this.state.color.border}}>
                            <Details
                                color={this.state.color}
                                data={this.state.data}
                                compareData = {this.state.compareData}
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
