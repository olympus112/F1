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
import * as d3 from "d3";

class CancelIcon extends React.Component {
    render() {
        return null;
    }
}

let FULL_OPACITY = 1.0;
let DEFAULT_OPACITY = 0.35;
let FOCUS_OPACITY = 0.7;
let IGNORE_OPACITY = 0.1;


CancelIcon.propTypes = {onMouseDown: PropTypes.func};
export default function ComparePicker(props) {
    let compareLimit = 3;

    let getLabel = (driver) => {
        return (
            <Typography>{props.flags[driver.nationality] + " " + driver.name}</Typography>
        );
    };

    let compareDrivers = props.drivers.filter(
        driver => driver.years.includes(props.year) && driver !== props.driver /*&& !props.compare.includes(driver)*/
    );

    let colors = [
        props.color.driver,
        ...props.color.compare
    ]

    return (
        <Paper elevation={0} sx={{borderColor: props.color.border}}>
            <FormControl sx={{width: "100%"}}>
                <InputLabel>Choose drivers to compare</InputLabel>
                <Select
                    multiple
                    // sx={{height: 56}}
                    value={[props.driver, ...props.compare]}
                    input={<OutlinedInput label="Choose drivers to compare"/>}
                    renderValue={(compare) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {compare.map((driver, index) => {
                                let sx = {};
                                if (index !== -1) {
                                    sx = {
                                        bgcolor: colors[index][500],
                                        color: "white"
                                    }
                                }
                                return (
                                    <Chip
                                        sx={sx}
                                        avatar={<Avatar alt={driver.name} src={props.images[driver.id].image}/>}
                                        key={"chip_" + driver.name}
                                        label={props.flags[driver.nationality] + " " + driver.name}
                                        onDelete={index === 0 ? null : (event) => props.removeCompare(driver)}
                                        onMouseDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        onMouseEnter={(event) => {
                                            d3.selectAll(".area")
                                                .transition().duration(200)
                                                .style("fill-opacity", IGNORE_OPACITY);
                                            // Bring back the hovered over blob
                                            d3.selectAll(`.driver_${driver.id}`)
                                                .transition().duration(200)
                                                .style("fill-opacity", FOCUS_OPACITY);
                                        }}
                                        onMouseLeave={(event) => {
                                            d3.selectAll(".area")
                                                .transition().duration(200)
                                                .style("fill-opacity", DEFAULT_OPACITY);
                                            d3.selectAll(".area_opaque")
                                                .transition().duration(200)
                                                .style("fill-opacity", FULL_OPACITY);
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
                                    if (props.inCompare(driver)) {
                                        props.removeCompare(driver);
                                    } else if (props.compare.length < compareLimit) {
                                        props.addCompare(driver);
                                    }
                                }}
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