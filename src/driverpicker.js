import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import {Grid} from "@mui/material";
import DriverCard from "./drivercard";
import YearPicker from "./yearPicker";
import ComparePicker from "./comparepicker";

export default function DriverPicker(props) {
    return (
        <Grid container spacing={5}>
            <Grid item xs={4}>
                <DriverCard
                    driver={props.driver}
                    images={props.images}
                    teams={props.teams}
                />
            </Grid>
            <Grid item xs={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            value={props.driver}
                            defaultValue={props.driver}
                            options={props.drivers}
                            getOptionLabel={driver => driver.name}
                            onChange={(event, newDriver) => {
                                props.selectDriver(newDriver)
                            }}
                            id="tags-standard"
                            groupBy={(driver) => Math.max(...driver.years)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pick driver"
                                />
                            )}
                            filterOptions={(options) => options}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Grid container alignItems={'space-between'}>
                                        <Grid item>{option.name}</Grid>
                                        {/*<Grid item>*/}
                                        {/*    <Avatar*/}
                                        {/*        alt={option.name}*/}
                                        {/*        src={images[option.id]}*/}
                                        {/*        sx={{width: 30, height: 30}}*/}
                                        {/*        variant={'circle'}*/}
                                        {/*        props={{loading:'lazy'}}>*/}
                                        {/*    </Avatar>*/}
                                        {/*</Grid>*/}
                                    </Grid>
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid sx={{marginTop: 10}}>
                    </Grid>
                    <Grid item xs={12}>
                        <YearPicker
                            driver={props.driver}
                            year={props.year}
                            selectYear={props.selectYear}
                        />
                    </Grid>
                    <Grid sx={{width: '100%'}}>
                        <hr style={{width: '20%', color: "lightgray"}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ComparePicker
                            addCompare={props.addCompare}
                            removeCompare={props.removeCompare}
                            driver={props.driver}
                            year={props.year}
                            compare={props.compare}
                            drivers={props.drivers}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}