import React, {Component} from "react";
import "./App.css";
import {Grid, Container, Typography} from "@mui/material";
import DriverPicker from "./driverpicker";
import YearPicker from "./yearPicker";
import SpiderGraph from "./spidergraph";
import Details from "./details";
import {downloadCharacteristics, testCharacteristics} from "./preprocess";

export const Graphs = {
    raceConsistency: {
        id: 0,
        name: "Race Consistency"
    },
    timeConsistency: {
        id: 1,
        name: "Time Consistency"
    },
    positionsGainedLost: {
        id: 2,
        name: "Positions gained/lost"
    },
    racing: {
        id: 3,
        name: "Racing"
    },
};

class App extends Component {
    constructor(props) {
        super(props);

        let defaultDriver = props.preprocessed.drivers[11]; // Lewis Hamilton
        let defaultYear = defaultDriver.years[0];

        this.state = {
            // Dimensions
            width: 0,
            height: 0,

            // Current state
            driver: defaultDriver, // An object containing all information on the driver, this comes from drivers.json
            compare: [],
            year: defaultYear,
            graph: Graphs.positionsGainedLost, //0: raceConsistency, 1: timeConsistency, 2: positionsGainedLost, 3: racing, 4 todo!

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
            ]
        };
    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
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
            });

            console.log("Added new driver: ", compare.name);
        }
    };

    removeCompare = (compare) => {
        let index = this.state.compare.indexOf(compare);

        if (index > -1) {
            this.state.compare.splice(index, 1);
            this.setState({
                compare: [...this.state.compare],
            });

            console.log("Removed driver: ", compare.name);
        }
    };

    updateRacerData = (driverId, year) => {
        this.setState({
            data: [
                this.state.preprocessed.characteristics[driverId][year].raceConsistency,
                this.state.preprocessed.characteristics[driverId][year].timeConsistency,
                this.state.preprocessed.characteristics[driverId][year].positionsGainedLost,
                this.state.preprocessed.characteristics[driverId][year].racing,
            ]
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
                <Typography variant="h4" sx={{mb: 5}}>
                    {this.state.driver.name}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DriverPicker
                            teams={this.state.preprocessed.teams}
                            images={this.state.preprocessed.images}
                            drivers={this.state.preprocessed.drivers}
                            driver={this.state.driver}
                            year={this.state.year}
                            compare={this.state.compare}
                            selectDriver={this.selectDriver}
                            selectYear={this.selectYear}
                            addCompare={this.addCompare}
                            removeCompare={this.removeCompare}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SpiderGraph
                            width={300}
                            height={300}
                            driver={this.state.driver}
                            compare={this.state.compare}
                            year={this.state.year}
                            data={this.state.data}
                            selectGraph={this.selectGraph}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Details
                            data={this.state.data}
                            graph={this.state.graph.id}
                        />
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
