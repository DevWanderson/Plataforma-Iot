import React, { useContext, useEffect, useState } from 'react';
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    IconButton,
    Hidden,
    MenuItem,
    Menu,
    capitalize
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import { Home, DeviceHub, NotificationsActive, Ballot, ExitToApp } from '@material-ui/icons';
import { AiFillHome } from "react-icons/ai";
import { FcHome, FcMultipleDevices, FcScatterPlot, FcLineChart, FcGenealogy, FcFeedback, FcExport, FcSettings, FcDocument } from "react-icons/fc";
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import PropTypes from 'prop-types';
import Router from '../../Pages/Routers/appRouter';
import { useTheme } from '@material-ui/core/styles';
import { AuthContext } from '../Context/contextAuth';

import LogoIBTI from '../../Assets/Logo-IBTI.png';
import defaultImg from '../../Assets/avatar_default.jpeg';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0
        },
        borderRadius: `1px 1px 1px 1px`

    },

    appBar: {

        zIndex: theme.zIndex.drawer + 1,
        background: '#262626',
        borderRadius: `1px 1px 1px 1px`

    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

    drawerPaper: {
        width: drawerWidth,
        borderRadius: `1px 1px 1px 1px`

    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },

    titleLogin: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },

    btnExit: {
        borderRadius: 30,
        borderColor: 'transparent',
        background: 'transparent',
        color: '#FF010A',
        cursor: 'pointer'
    },

    large: {
        marginRight: 12,
        right: 8
    },

    menuButtonSelect: {
        background: '#FFF',
        color: '#262626',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'ceneter',
        gap: `16%`,
        '&:hover': {
            background: 'linear-gradient(135deg, #23A14E 0%, #26A67D 100%);',
            color: '#FFF',
            borderRadius: 10
        }
    },

}));

export default function DrawerHeader(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchoEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const { user, signOut } = useContext(AuthContext);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCloseMenu = () => {
        setAnchoEl(null)
    }
    const handleMenu = (event) => {
        setAnchoEl(event.currentTarget)
    }

    const drawer = (
        <div onClickCapture={handleCloseMenu}>
            <div className={classes.toolbar} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: 15 }}>
                {
                    auth && (
                        <div className={classes.titleLogin}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                            >

                                <Avatar variant="rouded" className={classes.rouded}><img src={defaultImg} width={40} height={40}/></Avatar>

                                <Menu
                                    id="menu-appbar"
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    keepMounted
                                    anchorEl={anchorEl}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    <MenuItem>{user && user.name + ' ' + user.lastName}</MenuItem>
                                    <MenuItem>{user && user.email}</MenuItem>

                                </Menu>
                            </IconButton>
                            <Typography>{` ${user && capitalize(user.name)} ${user && capitalize(user.lastName)}`}</Typography>
                            <button onClick={() => signOut()} className={classes.btnExit}>
                                <FcExport size={24} />
                            </button>
                        </div>
                    )
                }
            </div>
            <Divider />
            <List>

                <Link to="/home" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect} >
                        <FcHome size={24} />
                        <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                </Link>
                <Link to="/dispositivos-cadastrados" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcMultipleDevices size={24} />
                        <ListItemText>Dispositivos</ListItemText>
                    </ListItem>
                </Link>
                <Link to="/dados-do-dispositivo" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcScatterPlot size={24} />
                        <ListItemText>Telemetria</ListItemText>
                    </ListItem>
                </Link>
                <Link to="/analytics" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcLineChart size={24} />
                        <ListItemText>Analytics</ListItemText>
                    </ListItem>
                </Link>
                <Link to="/gerenciamento-setor" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcGenealogy size={24} />
                        <ListItemText>Gerenciamento de Setor</ListItemText>
                    </ListItem>
                </Link>
                <Link to="/gerenciamento-de-alertas" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcFeedback size={24} />
                        <ListItemText>Gerenciamento de Alertas</ListItemText>
                    </ListItem>
                </Link>
                <a href='https://drive.google.com/file/d/18kojKf36a3xYHdwMTTikw-jN1E237XR3/view?usp=sharing' style={{ textDecoration: 'none', color: '#131313' }} target="_blank">
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcDocument size={24} />
                        <ListItemText>Guia do Usuário</ListItemText>
                    </ListItem>
                </a>
                {/* <Link to="/gerenciamento-de-alertas" style={{ textDecoration: 'none', color: '#131313' }}>
                    <ListItem onClick={() => setMobileOpen(false)} className={classes.menuButtonSelect}>
                        <FcSettings size={24} />
                        <ListItemText>Configurações</ListItemText>
                    </ListItem>
                </Link> */}

            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root} onClickCapture={handleCloseMenu}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to="/home">
                        <Avatar alt="Remy Sharp" src={LogoIBTI} className={classes.large} />
                    </Link>
                    <Typography variant="h6" className={classes.title} noWrap>
                        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>IBTI - Plataforma IoT</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Router />
            </main>
        </div>
    );
}



