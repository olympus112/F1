import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function Filter(props){
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
        <Slider
            aria-label="Restricted values"
            defaultValue={maxYear}
            step={null}
            valueLabelDisplay="on"
            marks={marks}
            min={minYear}
            max={maxYear}
            onChange={(event, newValue) => {
                props.selectYear(newValue)
            }}
        />
      );
}