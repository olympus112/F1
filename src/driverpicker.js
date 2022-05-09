import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import {Grid} from "@mui/material";
import DriverCard from "./drivercard";
import YearPicker from "./yearPicker";
import ComparePicker from "./comparepicker";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

export default function DriverPicker(props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <DriverCard
                    color={props.color}
                    driver={props.driver}
                    drivers={props.drivers}
                    images={props.images}
                    teams={props.teams}
                    flags={props.flags}
                    selectDriver={props.selectDriver}
                />
            </Grid>
            <Grid item xs={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <YearPicker
                            color={props.color}
                            driver={props.driver}
                            year={props.year}
                            selectYear={props.selectYear}
                            resetCompare={props.resetCompare}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ComparePicker
                            color={props.color}
                            addCompare={props.addCompare}
                            removeCompare={props.removeCompare}
                            inCompare={props.inCompare}
                            driver={props.driver}
                            year={props.year}
                            compare={props.compare}
                            drivers={props.drivers}
                            flags={props.flags}
                            images={props.images}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}