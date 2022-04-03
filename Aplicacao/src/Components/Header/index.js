import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import clsx from 'clsx'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import MenuIcon from '@material-ui/icons/Menu'
import { Home, DeviceHub, PlusOne, NotificationsActive, Ballot, ExitToApp } from '@material-ui/icons'
import AddAlertIcon from '@material-ui/icons/AddAlert';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import { AuthContext } from '../Context/contextAuth';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ModalConexoes from '../../Components/ModalConexoes/ModalConexoes';
import WbSunnyTwoToneIcon from '@material-ui/icons/WbSunnyTwoTone';
import {
    Toolbar,
    Drawer,
    useTheme,
    AppBar,
    IconButton,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
    List,
    ListItem,
    Avatar,
    Dialog,
    TextField,
    Slide,
    FormControl,
    InputAdornment,
    Menu,
    MenuItem

} from '@material-ui/core'
import './styles.css';

import LogoIBTI from '../../Assets/Logo-IBTI.png';
import useStyles from './useMakeStyle';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Header() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchoEl] = useState(null);
    const [auth, setAuth] = useState(true)
    const openMenu = Boolean(anchorEl)
    const { user, signOut } = useContext(AuthContext)

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleClickOpen = () => {
        setOpenDialog(true)
        setOpen(false)
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    const handleMenu = (event) => {
        setAnchoEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchoEl(null)
    }

    return (
        <div onClickCapture={handleCloseMenu} className={classes.root}>
            <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Menu"
                        onClick={handleDrawerOpen}
                        edge='start'
                        className={clsx(classes.menuButtom, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to="/home">
                        <Avatar alt="Remy Sharp" src={LogoIBTI} className={classes.large} />
                    </Link>
                    <Typography variant="h6" className={classes.title} noWrap>
                        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>IBTI - Plataforma IoT</Link>
                    </Typography>
                    {
                        auth && (
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                            >

                                <Avatar variant="rouded" className={classes.rouded}>{user && user.name.substr(0, 1).toUpperCase() + user.lastName.substr(0, 1).toUpperCase()}</Avatar>
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
                                    <MenuItem onClick={() => signOut()}>Sair..</MenuItem>
                                   
                                <ExitToApp fontSize={50} color="#000"/>
                                </Menu>
                            </IconButton>
                        )
                    }


                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{ paper: classes.drawerPaper }}

            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link onClick={() => setOpen(false)} to="/home" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dispositivos-cadastrados" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><DeviceHub /></ListItemIcon>
                            <ListItemText>Dispositivos</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dados-do-dispositivo" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><DataUsageIcon /></ListItemIcon>
                            <ListItemText>Telemetria</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/analytics" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><AssessmentIcon /></ListItemIcon>
                            <ListItemText>Analytics</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/gerenciamento-setor" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><Ballot /></ListItemIcon>
                            <ListItemText>Gerenciamento de Setor</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/gerenciamento-de-alertas" style={{ textDecoration: 'none', color: '#131313' }}>
                        <ListItem button>
                            <ListItemIcon><NotificationsActive/></ListItemIcon>
                            <ListItemText>Gerenciamento de Alertas</ListItemText>
                        </ListItem>
                    </Link>
                </List>

            </Drawer>
            <ModalConexoes open={openDialog} setOpen={setOpenDialog} />

            <main className={clsx(classes.content, { [classes.contentShift]: open, })}>
                <div className={classes.drawerHeader} />

            </main>

        </div>

    )
}