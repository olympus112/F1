import React, {Component} from 'react';
import './App.css';
import {Grid, Container, Typography} from '@mui/material';
import DriverPicker from './driverpicker';
import YearPicker from './yearPicker';
import SpiderGraph from './spidergraph';
import Details from './details';
import {computeRaceConsistency, computeTimeConsistency} from './getCSV.js'
import useWindowDimensions from "./windowdimensions";

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

            // Preloaded data
            preprocessed: props.preprocessed,
            drivers: props.drivers,
            races: props.races,
            results: props.results,
            laptimes: props.laptimes,
            constructors: props.constructors,

            // Graph data
            raceConsistency: computeRaceConsistency(defaultDriver.id, defaultYear, props.races, props.results), // {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},
            timeConsistency: computeTimeConsistency(defaultDriver.id, defaultYear, props.races, props.results), // {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},
            graphChoice: 0  //0: raceConsistency, 1: timeConsistency, 2,3,4 todo!
        }

        this.updateRacerData(this.state.driver.id);

    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
        });
        console.log("Selected new driver: ", driver);

        this.updateRacerData(driver.id);
    }

    selectYear = (year) => {
        this.setState({
            year: year,
        });

        console.log("Selected new year: ", year);

        this.updateRacerData(this.state.driver.id);
    }

    addCompare = (compare) => {
        if (!this.state.compare.includes(compare)) {
            this.setState({
                compare: [...this.state.compare, compare]
            })

            console.log("Added new driver: ", compare.name);
        }
    }

    removeCompare = (compare) => {
        let index = this.state.compare.indexOf(compare);

        if (index > -1) {
            this.state.compare.splice(index, 1);
            this.setState({
                compare: [...this.state.compare]
            })

            console.log("Removed driver: ", compare.name);
        }
    }

    updateRacerData(driverId) {
        let raceConsistency = computeRaceConsistency(driverId, this.state.year, this.state.races, this.state.results);
        let timeConsistency = computeTimeConsistency(driverId, this.state.year, this.state.races, this.state.laptimes);

        this.setState({
            raceConsistency: raceConsistency,
            timeConsistency: timeConsistency
        });
    }

    updateDimensions = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
        console.log("aaa", this.state.width)
    };

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
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

                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Details
                            data={[this.state.raceConsistency, this.state.timeConsistency]}
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
