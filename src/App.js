import React, {Component} from 'react';
import './App.css';
import {Grid, Container, Typography} from '@mui/material';
import DriverPicker from './driverpicker';
import Filter from './filter';
import SpiderGraph from './spidergraph';
import Details from './details';

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
        // this.getDrivers().then(data => {     
        this.state = {
          driver: 0,
          drivers: {},
        }
    }

    selectedDriver = (given) => {
        this.setState({
            driver: given,
        })
    }

    componentDidMount() {
      d3.csv(driversCSV).then((data) => {
          let drivers = {};
          data.forEach(driver => drivers[driver.driverId] = driver.forename + ' ' + driver.surname);

          this.setState({drivers: drivers});
      });
  }


    render() {
        // importRaceConsistencyData(this.state.driverId, this.state.year, (scoredData) => {
        //   console.log(scoredData.data, scoredData.score);
        // });
        // importTimeConsistencyData(this.state.driverId, this.state.year, (scoredData) =>{
        //   console.log(scoredData.data, scoredData.score);
        // })
        return (
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Titel kan eventueel ik kan ook een header fixen met logo hier
                </Typography>
                <Grid container spacing={2}>
                    {/* spacing = Plek tussen alles in de containers
          er zijn 12 kolommen in een container
          hoeveel plek dat iets inneemt kunt ge aanpassen (gsm=xs,sm=tablet,md=small laptops,lg=laptops)
          op deze manier is u pagina wrapable 
          
          Verder gebruiken we callback functies en states zoals hieronder zichtbaar voor het aanpassen van gegevens
          en deze door te geven naar de andere components*/}
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <DriverPicker info={"INFO1"} influencefunction={this.selectedDriver} drivers={this.state.drivers}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Filter info={"INFO2"} outputinothercomponent={this.state.driver}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <SpiderGraph dimensions={dimensions}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Details info={"INFO4"}/>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default App;
