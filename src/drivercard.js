import * as React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {Grid} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language';
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";

export default function DriverCard(props) {
    const [open, setOpen] = React.useState(true);

    let teams = [];
    for (let teamId of props.driver.teams) {
        teams.push(
            <Typography>
                {props.driver.name}
            </Typography>
        );
    }

    return (
        <Paper elevation={3}>
            <Grid container direction={'column'} alignItems={'space-between'}>
                <Grid container padding={1} direction={'column'} alignItems={'center'}>
                    <Grid item p={2}>
                        <Avatar
                            alt={props.driver.name}
                            src={props.images[props.driver.id].image}
                            sx={{width: 120, height: 120}}
                            variant={'circle'}>
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant={'h4'} align={'center'}>
                            {props.driver.name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid sx={{width: '100%'}}>
                    <hr style={{width: '60%', color: "lightgray"}}/>
                </Grid>
                <Grid item>
                    <List sx={{width: '100%'}} disablePadding>
                        <ListItem>
                            <ListItemText primary={
                                <Typography>
                                    Nationality
                                </Typography>
                            }/>
                            <Typography>
                                {props.driver.nationality}
                            </Typography>
                        </ListItem>
                        <ListItemButton onClick={() => setOpen(!open)}>
                            <ListItemText primary={
                                <Typography>
                                    Teams <Chip label={props.driver.teams.length} size={'small'} />
                                </Typography>
                            }/>
                            {open ? <ExpandLess/> : <ExpandMore/>}
                        </ListItemButton>
                        <Collapse in={open}>
                            <List disablePadding>
                                {props.driver.teams.map(teamId => {
                                    return (
                                        <Typography pl={4}>
                                            - {props.teams[teamId].name}
                                        </Typography>
                                    );
                                })}
                            </List>
                        </Collapse>
                        <ListItemButton onClick={() => window.open(props.driver.wiki, "_blank")}>
                            <ListItemText primary={
                                <Typography>
                                    Wikipedia
                                </Typography>
                            }/>
                            <LanguageIcon />
                        </ListItemButton>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    );
}