import { Card, CardHeader, Box } from '@mui/material';

export default function SpiderGraph(props){
    //javascript functies maak je hierboven
    return(
        <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: "#05171d",
        bgcolor: "#e10500",
      }}>
<p>Hier komt de spider graph component, dit is de doorgegeven gegevens: {props.info}</p>
      </Card>
    )
}