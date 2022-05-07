import * as React from 'react';
import Slider from '@mui/material/Slider';
import {Grid,Paper} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function YearPicker(props){
    let years = props.driver.years;
    years.sort();
    let minYear = Math.min(...years);
    let maxYear = Math.max(...years);
    let marks = years.map(year => {
        return {
            value: year,
            label: '\'' + `${year}`.substr(2, 4)
        };
    });

    return (
        <Paper elevation={0} variant="outlined" sx={{borderColor: "#bdbdbd"}}> 
        <Grid container>
            <Grid item xs={12}>
                <div style={{position: "relative", left:10,top:6}}>
                    <Typography sx={{color: "#616161"}}>
                        Choose year
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={12} sx={{px:4}}>
                <Slider 
                    aria-label="Restricted values"
                    // defaultValue={props.year}
                    defaultValue={maxYear}
                    step={null}
                    valueLabelDisplay="on"
                    marks={marks}
                    min={minYear}
                    max={maxYear}
                    track={false}
                    onChange={(event, newYear) => {
                        props.selectYear(newYear);
                        props.resetCompare();
                    }}
                />
            </Grid>
        </Grid>
        </Paper>
      );
}