import { Card, CardHeader, Box } from '@mui/material';
import * as d3 from 'd3';

export default function Details(props){
    
    //javascript functies maak je hierboven
    var s = "Hier komt de details component, dit is de doorgegeven gegevens: " + props.info;
    console.log("props: ", props);



    return(
        <Card>
            <CardHeader title={s} subheader="ondertitel" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <p>SVG hier?</p>
            </Box>
        </Card>
    )
}