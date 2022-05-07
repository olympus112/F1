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

    let getLabel = (driver) => {
        return (
            <Typography>{props.flags[driver.nationality] + " " + driver.name}</Typography>
        );
    };

    // function compare_Drivers() {
    //     let compareList = [];
    //     let driver = props.driver;
    //     let year = props.year;
    //     console.log(driver.id);
    //     console.log(year);
    //     for (let d of props.drivers){
    //         if (d.years.includes(year) && driver.id !== d.id  && !props.compare.includes(d)){
    //             compareList.push(d);
    //         }
    //     }
    //     return compareList;
    // };

    let compareDrivers = props.drivers.filter(
        driver => driver.years.includes(props.year) && driver !== props.driver && !props.compare.includes(driver)
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <FormControl style={{width: '100%'}} component="fieldset" variant="standard">
                    <FormLabel component="legend">
                        <Typography component={"span"}>
                            Chosen drivers <Chip label={props.compare.length} size={'small'}/>
                        </Typography>
                    </FormLabel>
                    <List style={{maxHeight: 250, overflow: 'auto'}}>
                        <ListItem key={props.driver.id} disablePadding>
                            <FormControlLabel
                                control={<Checkbox checked disabled/>}
                                label={getLabel(props.driver)}
                            />
                        </ListItem>
                        {props.compare.map(driver => {
                            return (
                                <ListItem key={driver.id} disablePadding>
                                    <FormControlLabel
                                        control={<Checkbox checked onChange={event => props.removeCompare(driver)}/>}
                                        label={getLabel(driver)}
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
                    <List style={{maxHeight: 200, overflow: 'auto'}}>
                        {compareDrivers.map(driver => {
                            return (
                                <ListItem key={driver.id} disablePadding>
                                    <FormControlLabel
                                        style={{width: "100%"}}
                                        control={<Checkbox checked={false}
                                                           disabled={props.compare.length >= compareLimit}
                                                           onChange={event => props.addCompare(driver)}/>}
                                        label={getLabel(driver)}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                    <FormHelperText>You can
                        compare {compareLimit === props.compare.length ? "no" : compareLimit - props.compare.length} more
                        drivers</FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
    )
}