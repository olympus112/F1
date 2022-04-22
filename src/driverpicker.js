import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';

export default function DriverPicker(props) {
    let options = props.drivers;

    return (
        <div>
            <Autocomplete
                value={props.currentDriver}
                defaultValue={props.currentDriver}
                options={options}
                getOptionLabel={(driver) => driver.name}
                onChange={(event, newDriver) => {
                    props.selectDriver(newDriver)
                }}
                id="tags-standard"
                // groupBy={(driver) => Math.max(...driver.years)}
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