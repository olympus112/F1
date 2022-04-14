import { Card, CardHeader, Box } from '@mui/material';


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