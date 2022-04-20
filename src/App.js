import React, {Component} from 'react';
import './App.css';
import {Grid, Container, Typography} from '@mui/material';
import DriverPicker from './driverpicker';
import Filter from './filter';
import SpiderGraph from './spidergraph';
import Details from './details';
import {importRaceConsistencyData, importTimeConsistencyData} from './getCSV.js'

import * as d3 from "d3";
import driversCSV from './data/drivers.csv'

const dimensions = {
    width: 400,
    height: 400,
    margin: {top: 60, right: 60, bottom: 60, left: 60}
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            driver: 1,
            drivers: {},
            year: 2020,

            raceConsistency: {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},
            timeConsistency: {data: [{value: 0, date: new Date()}], lsm: {lsmPoints: [{value: 0, date: new Date()}], score: 0}},

            graphChoice: 1
        }
    }

    selectedDriver = (given) => {
        console.log("changed Role");
        this.setState({
            driver: given,
        });
        importRaceConsistencyData(this.state.driver, this.state.year, (retrievedData) => {
          console.log("retrieved data race cons: ", retrievedData);
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

    componentDidMount() {
      console.log("mount component");
        d3.csv(driversCSV).then((data) => {
            let drivers = {};
            data.forEach(driver => drivers[driver.driverId] = driver.forename + ' ' + driver.surname);
            this.setState({drivers: drivers});
        });

        importRaceConsistencyData(this.state.driver, this.state.year, (retrievedData) => {
            this.setState({
                raceConsistency: retrievedData
            })
        });
        importTimeConsistencyData(this.state.driver, this.state.year, (retrievedData) => {
            console.log("retrieved data race cons: ", retrievedData);
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
                    {this.state.drivers[this.state.driver]}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <DriverPicker info={"INFO1"} influencefunction={this.selectedDriver}
                                      drivers={this.state.drivers}/>
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
