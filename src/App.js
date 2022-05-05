import React, {Component} from "react";
import "./App.css";
import {Grid, Container, Typography} from "@mui/material";
import DriverPicker from "./driverpicker";
import YearPicker from "./yearPicker";
import SpiderGraph from "./spidergraph";
import Details from "./details";
import {computePositionsGainedLost} from "./positionsGainedLost.js";
import {computeRacing} from "./positions.js";
import {downloadCharacteristics, testCharacteristics} from "./preprocess";

testCharacteristics()
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
            graphChoice: 0, //0: raceConsistency, 1: timeConsistency, 2: positionsGainedLost, 3: racing, 4 todo, 5: qualification!

            // Preloaded data
            preprocessed: props.preprocessed,
            drivers: props.drivers,
            races: props.races,
            results: props.results,
            laptimes: props.laptimes,
            constructors: props.constructors,

            // Graph data
            raceConsistency: props.preprocessed.characteristics[defaultDriver.id][defaultYear].raceConsistency,
            timeConsistency: props.preprocessed.characteristics[defaultDriver.id][defaultYear].timeConsistency,
            positionsGainedLost: props.preprocessed.characteristics[defaultDriver.id][defaultYear].positionsGainedLost,
            racing: props.preprocessed.characteristics[defaultDriver.id][defaultYear].racing,
            timeRacing: props.preprocessed.characteristics[defaultDriver.id][defaultYear].timeRacing
        };
    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
        });
        console.log("Selected new driver: ", driver);

        this.updateRacerData(driver.id,  this.state.year);
    };

    selectYear = (year) => {
        this.setState({
            year: year,
        });

        console.log("Selected new year: ", year);

        this.updateRacerData(this.state.driver.id, year);
    };

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
            raceConsistency: this.state.preprocessed.characteristics[driverId][year].raceConsistency,
            timeConsistency: this.state.preprocessed.characteristics[driverId][year].timeConsistency,
            positionsGainedLost: this.state.preprocessed.characteristics[driverId][year].positionsGainedLost,
            racing: this.state.preprocessed.characteristics[driverId][year].racing,
            timeRacing: this.state.preprocessed.characteristics[driverId][year].timeRacing
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
                        <SpiderGraph width={300} height={300}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Details
                            data={[
                                this.state.raceConsistency,
                                this.state.timeConsistency,
                                this.state.positionsGainedLost,
                                this.state.racing,
                                this.state.timeRacing
                            ]}
                            graphChoice={this.state.graphChoice}
                        />
                    </Grid>
                    {this.state.width}
                </Grid>
            </Container>
        );
    }
}

export default App;
