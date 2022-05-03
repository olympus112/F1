import {Box, Grid, ListItem} from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import * as React from 'react';
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

export default function ComparePicker(props) {
    let compareLimit = 4;
    let compareDrivers = props.drivers.filter(
        driver => driver.years.includes(props.year) && driver !== props.driver && !props.compare.includes(driver)
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <FormControl style={{width: '100%'}} component="fieldset" variant="standard">
                    <FormLabel component="legend">
                        <Typography>
                            Chosen drivers <Chip label={props.compare.length} size={'small'} />
                        </Typography>
                    </FormLabel>
                    <List style={{maxHeight: 250, overflow: 'auto'}}>
                        <ListItem key={props.driver.id} disablePadding>
                            <FormControlLabel
                                control={<Checkbox checked disabled/>}
                                label={props.driver.name}
                            />
                        </ListItem>
                        {props.compare.map(driver => {
                            return (
                                <ListItem key={driver.id} disablePadding>
                                    <FormControlLabel
                                        control={<Checkbox checked onChange={event => props.removeCompare(driver)}/>}
                                        label={driver.name}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl style={{width: '100%'}} component="fieldset" variant="standard">
                    <FormLabel component="legend">Choose drivers</FormLabel>
                    <List style={{maxHeight: 250, overflow: 'auto'}}>
                        {compareDrivers.map(driver => {
                            return (
                                <ListItem key={driver.id} disablePadding>
                                    <FormControlLabel
                                        control={<Checkbox checked={false} disabled={props.compare.length >= compareLimit} onChange={event => props.addCompare(driver)}/>}
                                        label={driver.name}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                    <FormHelperText>You can compare {compareLimit === props.compare.length ?  "no" : compareLimit - props.compare.length} more drivers</FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
    )
}