import React, { Component } from 'react';
import './App.css';
import { Grid, Container, Typography } from '@mui/material';
import DriverPicker from './driverpicker';
import Filter from './filter';
import SpiderGraph from './spidergraph';
import Details from './details';

const dimensions = {
  width: 300,
  height: 300,
  margin: { top: 30, right: 30, bottom: 30, left: 60 }
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      driver : "Max",
    }
  }

  selectedDriver = (given) => {
    this.setState({
      driver: given,
    })
  }


  render() {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
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
            <DriverPicker info={"INFO1"} influencefunction={this.selectedDriver}/>
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
