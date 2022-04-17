import { Card, CardHeader, Box } from '@mui/material';
import * as d3 from 'd3';
d3.csv("./data/circuits.csv", function(data) {
    
    console.log(data[0]);

    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].circuitId);
        // console.log(data[i].name);
    }
});

export default function Details(props){
    
    //javascript functies maak je hierboven
    var s = "Hier komt de details component, dit is de doorgegeven gegevens: " + props.info;

    return(
        <Card>
            <CardHeader title={s} subheader="ondertitel" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <p>SVG hier?</p>
            </Box>
        </Card>
    )
}