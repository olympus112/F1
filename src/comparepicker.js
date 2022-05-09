import {Paper, Grid, ListItem, Box, InputLabel, Select, MenuItem, ListItemText, OutlinedInput} from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import * as React from 'react';
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {AutoComplete} from "antd";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import * as PropTypes from "prop-types";


class CancelIcon extends React.Component {
    render() {
        return null;
    }
}

CancelIcon.propTypes = {onMouseDown: PropTypes.func};
export default function ComparePicker(props) {
    let compareLimit = 3;

    let getLabel = (driver) => {
        return (
            <Typography>{props.flags[driver.nationality] + " " + driver.name}</Typography>
        );
    };

    // function compareDrivers() {
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
        driver => driver.years.includes(props.year) && driver !== props.driver /*&& !props.compare.includes(driver)*/
    );

    return (
        // <Paper elevation={0} variant="outlined" sx={{borderColor: props.color.border}}>
        //     <Grid container spacing={2}>
        //         <Grid item xs={6} sx={{position: "relative", left: 10, top: 10}}>
        //             <FormControl style={{width: '100%'}} component="fieldset" variant="standard">
        //                 <FormLabel component="legend">
        //                     <Typography component={"span"}>
        //                         Chosen drivers <Chip label={props.compare.length + 1} size={'small'}/>
        //                     </Typography>
        //                 </FormLabel>
        //
        //                 <List style={{maxHeight: 120, overflow: 'auto'}}>
        //                     <ListItem key={props.driver.id} disablePadding>
        //                         <FormControlLabel
        //                             control={<Checkbox checked sx={{
        //                                 paddingLeft: 2,
        //                                 transform: "scale(0.8)",
        //                                 width: 40,
        //                                 height: 30,
        //                                 color: props.color.driver[800],
        //                                 '&.Mui-checked': {
        //                                     color: props.color.driver[600],
        //                                 }
        //                             }}/>}
        //                             label={getLabel(props.driver)}
        //                         />
        //                     </ListItem>
        //                     {props.compare.map((driver, index) => {
        //                         return (
        //                             <ListItem key={driver.id} disablePadding>
        //                                 <FormControlLabel
        //                                     control={<Checkbox checked onChange={event => props.removeCompare(driver)}
        //                                                        sx={{
        //                                                            paddingLeft: 2,
        //                                                            transform: "scale(0.8)",
        //                                                            width: 40,
        //                                                            height: 30,
        //                                                            color: props.color.compare[index][800],
        //                                                            '&.Mui-checked': {
        //                                                                color: props.color.compare[index][600],
        //                                                            }
        //                                                        }}/>}
        //                                     label={getLabel(driver)}
        //                                 />
        //                             </ListItem>
        //                         );
        //                     })}
        //                 </List>
        //             </FormControl>
        //         </Grid>
        //
        //         <Grid item xs={6}>
        //             <Box sx={{height: 10, width: 10}}/>
        //             <FormControl style={{width: '100%'}} component="fieldset" variant="standard">
        //                 <FormLabel component="legend">Choose drivers</FormLabel>
        //                 <List style={{maxHeight: 120, overflow: 'auto'}}>
        //                     {compareDrivers.map(driver => {
        //                         return (
        //                             <ListItem key={driver.id} disablePadding>
        //                                 <FormControlLabel
        //                                     style={{width: "100%"}}
        //                                     control={
        //                                         <Checkbox sx={{
        //                                             transform: "scale(0.8)",
        //                                             paddingLeft: 2,
        //                                             width: 40,
        //                                             height: 30
        //                                         }}
        //                                                   checked={false}
        //                                                   disabled={props.compare.length >= compareLimit}
        //                                                   onChange={event => props.addCompare(driver)}/>}
        //                                     label={getLabel(driver)}
        //                                 />
        //                             </ListItem>
        //                         );
        //                     })}
        //                 </List>
        //                 <FormHelperText>You can
        //                     compare {compareLimit === props.compare.length ? "no" : compareLimit - props.compare.length} more
        //                     drivers</FormHelperText>
        //             </FormControl>
        //         </Grid>
        //     </Grid>
        // </Paper>

        <Paper elevation={0} sx={{borderColor: props.color.border}}>
            <FormControl sx={{width: "100%"}}>
                <InputLabel>Choose drivers to compare</InputLabel>
                <Select
                    multiple
                    // renderInput={(params) => (
                    //             <TextField
                    //                 {...params}
                    //                 variant="standard"
                    //                 label="Multiple values"
                    //                 placeholder="Favorites"
                    //             />
                    //             )}
                    sx={{height:56}}
                    value={props.compare}
                    input={<OutlinedInput label="Choose drivers to compare"/>}
                    renderValue={(compare) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {compare.map(driver => {
                                let index = props.compare.indexOf(driver);
                                let sx = {};
                                if (index !== -1) {
                                    sx = {
                                        bgcolor: props.color.compare[index][500],
                                        color: "white"
                                    }
                                }
                                return (
                                    <Chip
                                        sx={sx}
                                        avatar={<Avatar alt={driver.name} src={props.images[driver.id].image}/>}
                                        key={"chip_" + driver.name}
                                        label={props.flags[driver.nationality] + " " + driver.name}
                                        onDelete={(event) => {props.removeCompare(driver)}}
                                        onMouseDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}
                >
                    {compareDrivers.map(driver => {
                        let index = props.compare.indexOf(driver);
                        let sx = {};
                        if (index !== -1) {
                            sx = {
                                color: props.color.compare[index][800],
                                '&.Mui-checked': {
                                    color: props.color.compare[index][600],
                                }
                            }
                        }

                        return (
                            <MenuItem 
                                key={"menu_" + driver.name} 
                                value={driver} 
                                onClick={event => {
                                            if(props.inCompare(driver)){props.removeCompare(driver)}
                                            else{
                                                if(props.compare.length < compareLimit){props.addCompare(driver);};
                                                }
                                            }
                                        }
                            >
                                <Checkbox checked={props.compare.includes(driver)}
                                    disabled={props.compare.length >= compareLimit}
                                    sx={sx}
                                />
                                <ListItemText primary={props.flags[driver.nationality] + " " + driver.name}/>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Paper>
    )
}