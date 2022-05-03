import React, {Component} from 'react';
import './App.css';
import {Grid, Container, Typography} from '@mui/material';
import DriverPicker from './driverpicker';
import Filter from './filter';
import SpiderGraph from './spidergraph';
import Details from './details';
import {importRaceConsistencyData, importTimeConsistencyData} from './getCSV.js'

const dimensions = {
    width: 400,
    height: 400,
    margin: {top: 60, right: 60, bottom: 60, left: 60}
};

class App extends Component {
    constructor(props) {
        super(props);
        let defaultDriver = props.preprocessed.drivers[11]; // Lewis Hamilton

        this.state = {
            // Current state
            driver: defaultDriver, // An object containing all information on the driver, this comes from drivers.json
            year: defaultDriver.years[0],

            // Preloaded data
            preprocessed: props.preprocessed,
            drivers: props.drivers,
            races: props.races,
            results: props.results,
            laptimes: props.laptimes,
            constructors: props.constructors,

            // Graph data
            raceConsistency: {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},
            timeConsistency: {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},
            graphChoice: 0  //0: raceConsistency, 1: timeConsistency, 2,3,4 todo!
        }
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
        // this.updateRacerData();
    }

    componentDidMount() {
        this.updateRacerData(this.state.driver.id);
    }

    updateRacerData(driverId) {
        let dataRaceCons = importRaceConsistencyData(driverId, this.state.year, this.state.races, this.state.results);
        let dataTimeCons = importTimeConsistencyData(driverId, this.state.year, this.state.races, this.state.laptimes);

        this.setState({
            raceConsistency: dataRaceCons, 
            timeConsistency: dataTimeCons
        });
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
                            selectDriver={this.selectDriver}
                            selectYear={this.selectYear}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <SpiderGraph dimensions={dimensions}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Details data={[this.state.raceConsistency, this.state.timeConsistency]} graphChoice={this.state.graphChoice}/>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
