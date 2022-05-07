import React, {Component} from "react";
import "./App.css";
import {Grid, Container, Typography} from "@mui/material";
import DriverPicker from "./driverpicker";
import YearPicker from "./yearPicker";
import SpiderGraph from "./spidergraph";
import Details from "./details";
import {Paper, Box} from "@mui/material";
import {downloadCharacteristics, downloadCountries, testCharacteristics} from "./preprocess";

export const Graphs = {
    raceConsistency: {
        id: 0,
        name: "Race Consistency"
    },
    timeConsistency: {
        id: 1,
        name: "⠀Time⠀ ⠀Consistency⠀"
    },
    positionsGainedLost: {
        id: 2,
        name: "Positions gained/lost"
    },
    racing: {
        id: 3,
        name: "⠀Racing⠀⠀"
    },
    timeRacing: {
        id: 4,
        name: "Time⠀ ⠀Racing⠀⠀"
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
            compareData: []
        };
    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
        });
        this.setState({
            year: driver.years[driver.years.length-1]
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
            <Box
                sx={{
                bgcolor: 'gray',
                borderRadius: 1,
                mb:2
                }}
            >
                <Typography variant="h6" gutterBottom component="div" sx={{color:"white", p:1,pl:2}}>
                    F1 Dashboard
                </Typography>
            </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DriverPicker
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
                            resetCompare = {this.resetCompare}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Paper elevation={0} variant="outlined" sx={{borderColor: "#bdbdbd", display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                            <SpiderGraph
                                width={300}
                                height={300}
                                driver={this.state.driver}
                                compare={this.state.compare}
                                data={this.state.data}
                                compareData={this.state.compareData}
                                selectGraph={this.selectGraph}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} variant="outlined" sx={{borderColor: "#bdbdbd", display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                            <Details
                                data={this.state.data}
                                graph={this.state.graph.id}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
