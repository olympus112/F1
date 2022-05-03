import * as React from 'react';
import Slider from '@mui/material/Slider';
import {Grid} from "@mui/material";
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
        <Grid container>
            <Grid item xs={12}>
                <Typography>
                    Choose year
                </Typography>
            </Grid>
            <Grid item xs={12}>
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
                        props.selectYear(newYear)
                    }}
                />
            </Grid>
        </Grid>
      );
}