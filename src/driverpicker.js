import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const drivers = [
    { name: 'Max Verstappen', years: [2021,2020,2019,2018,2017] },
    { name: 'Charles Leclerc', years: [2021,2020,2019] },
    { name: 'Nico Rosberg', years: [2018] },
];

export default function DriverPicker(props){

    const options = drivers.map((option) => {
        const lastYear = option.years[0];
        return {
          lastYear: "last driving year: " + lastYear,
          ...option,
        };
    })
    //javascript functies maak je hierboven
    //still have to fix dis autocomplete stuffhttps://mui.com/material-ui/react-autocomplete/
    // => dont get how the onChange works yet
    return(
        <div>
            <p>Hier komt de driver pick component, dit is de doorgegeven gegevens: {props.info}</p>
            <Autocomplete
                id="tags-standard"
                options={options.sort((a, b) => a.lastYear < b.lastYear)}
                getOptionLabel={(option) => option.name}
                defaultValue={drivers[0]}
                groupBy={(option) => option.lastYear}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Pick drivers"
                />
                )}
            />
            {/* //VB van hoe je code catched van de top component app */}
            <Button onClick={() => props.influencefunction("Leclerc")} variant="outlined">Change driver to Leclerc</Button>
        </div>
    )
}