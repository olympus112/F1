import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const drivers = ['Max Verstappen','Charles Leclerc','Nico Rosberg']

export default function DriverPicker(props){
    let options = Object.keys(props.drivers)
    console.log(props.drivers);
    const [value, setValue] = React.useState(props.drivers[1]);
    console.log(props.drivers[1]);

    if(options.length === 0){
        return(<div><p>Loading data ...</p></div>)
    } 
    return(
        <div>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue); props.influencefunction(newValue)
                }}
                id="tags-standard"
                options={options}
                // groupBy={(id) => props.drivers[id]}
                getOptionLabel={(id) => props.drivers[id]}
                defaultValue={1}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Pick driver"
                />
                )}
            />
        </div>
    )
}