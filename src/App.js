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
        let defaultDriver = props.preprocessed.drivers[0];

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
            graphChoice: 0
        }
    }

    selectDriver = (driver) => {
        this.setState({
            driver: driver,
        });
        console.log("Selected new driver: ", driver);
    }

    componentDidMount() {
        importRaceConsistencyData(this.state.driver, this.state.year, (retrievedData) => {
            this.setState({
                raceConsistency: retrievedData
            })
        });
        importTimeConsistencyData(this.state.driver, this.state.year, (retrievedData) => {
            this.setState({
                timeConsistency: retrievedData
            })
        });
    }

    render() {
        var graphData = [this.state.raceConsistency, this.state.timeConsistency];
        return (
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    {this.state.driver.name}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <DriverPicker
                            teams={this.state.preprocessed.teams}
                            images={this.state.preprocessed.images}
                            drivers={this.state.preprocessed.drivers}
                            driver={this.state.driver}
                            selectDriver={this.selectDriver}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Filter info={"INFO2"} outputinothercomponent={this.state.driver}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <SpiderGraph dimensions={dimensions}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Details info={"INFO4"} data={graphData} graphChoice={this.state.graphChoice}/>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
