import * as React from 'react';
import Slider, { SliderThumb } from '@mui/material/Slider';
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
        <Paper elevation={0} variant="outlined" sx={{borderColor: props.color.border}} >
        <Grid container>
            <Grid item xs={12}>
                <div style={{position: "relative", left:11.8,top:6}}>
                    <Typography sx={{color: "rgba(0, 0, 0, 0.6)"}}>
                        Choose year
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={12} sx={{px:4,pt:2.4,pb:0.8}}>
                <Slider 
                    sx={{  height: 4,
                        //    padding: '14px 0',
                            '& .MuiSlider-thumb': {
                                height: 20,
                                width: 20},
                            '& .MuiSlider-mark': {
                                backgroundColor: '#bfbfbf',
                                height: 10,
                            },
                        }}
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