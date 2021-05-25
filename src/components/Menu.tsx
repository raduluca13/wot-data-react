import { Button, makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const Menu = () => {
    const classes = useStyles();
    const history = useHistory();

    const redirectTo = (route: string) => {
        history.push(route)
    }

    return <AppBar color="transparent" position="static">
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title}>
                <Button color="default" onClick={() => redirectTo('/teams')}>Teams</Button>
            </Typography>

            <Typography variant="h6" className={classes.title}>
                <Button onClick={() => redirectTo('/tactics')}>Tactics</Button>
            </Typography>

            <Typography variant="h6" className={classes.title}>
                <Button onClick={() => redirectTo('/map')}>Map</Button>
            </Typography>

            <Typography variant="h6" className={classes.title}>
                <Button onClick={() => redirectTo('/profile')}>My profile</Button>
            </Typography>
        </Toolbar>
    </AppBar>


}

export default Menu;