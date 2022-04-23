import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import {Grid} from "@mui/material";
import DriverCard from "./drivercard";

export default function DriverPicker(props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <DriverCard driver={props.driver} images={props.images} teams={props.teams}>

                </DriverCard>
            </Grid>
            <Grid item xs={8}>
                <Autocomplete
                    value={props.driver}
                    defaultValue={props.driver}
                    options={props.drivers}
                    getOptionLabel={driver => driver.name}
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
            </Grid>
        </Grid>
    )
}