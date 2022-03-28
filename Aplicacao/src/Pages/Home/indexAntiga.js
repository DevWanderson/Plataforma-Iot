import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Grid,
    Card,
    CardActionArea,
    Typography
} from '@material-ui/core'
import { Router, Dashboard, GraphicEq, Map, Face, DataUsage, AddAlert } from '@material-ui/icons'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';



const useStylesPc = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 745,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        display: 'flex',
        flexDirection: 'column',

    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        boxShadow: '5px 5px 5px 5px rgb(0,0,0,0.1)',
        height: 120,
        width: 192,
        borderRadius: 10

    },
    cardIterno: {
        justifyContent: 'center',
        alignItems: 'center'
    }

}));

const useStylesMobile = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        boxShadow: '5px 5px 5px 5px rgb(0,0,0,0.1)',
        height: 120,
        width: 192,
        borderRadius: 10,
        marginBottom: 30,
    },
    cardIterno: {
        justifyContent: 'center',
        alignItems: 'center'
    }

}));

export default function Home() {
    const classesPC = useStylesPc();
    const classesMobile = useStylesMobile();

    const [menu, setMenu] = useState([
        { id: '0', icon: <Router style={{ fontSize: 70, color: '#000' }} />, legend: 'Dispositivo', navigation: '/dispositivos-cadastrados' },
        { id: '1', icon: <Dashboard style={{ fontSize: 70, color: '#000' }} />, legend: 'Dashboard', navigation: '/dashboard' },
        { id: '2', icon: <GraphicEq style={{ fontSize: 70, color: '#000' }} />, legend: 'Gráficos', navigation: 'graphic' },
        { id: '3', icon: <Map style={{ fontSize: 70, color: '#000' }} />, legend: 'Mapa', navigation: '/mapa' },
        { id: '4', icon: <Face style={{ fontSize: 70, color: '#000' }} />, legend: 'Dados', navigation: '' },
        { id: '5', icon: <DataUsage style={{ fontSize: 70, color: '#000' }} />, legend: 'Analytics', navigation: '' },
        { id: '6', icon: <AddAlert style={{ fontSize: 70, color: '#000' }} />, legend: 'Alertas', navigation: '' },
    ])

    const MenuCard = () => {

        function SelectionPCorMobile() {
            const matches = useMediaQuery('(max-width:660px)');

            return (matches ?
                <React.Fragment>
                    {
                        menu.map(menuPrincipal => (
                            <Grid key={menuPrincipal.id} item xs={4}>
                                <Link to={menuPrincipal.navigation} style={{ textDecoration: 'none' }}>
                                    <Card className={classesMobile.card}>
                                        <CardActionArea className={classesMobile.cardIterno}>{menuPrincipal.icon}
                                            <Typography>{menuPrincipal.legend}</Typography>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))
                    }
                </React.Fragment>

                :

                <React.Fragment>
                    {
                        menu.map(menuPrincipal => (
                            <Grid key={menuPrincipal.id} item xs={4}>
                                <Link to={menuPrincipal.navigation} style={{ textDecoration: 'none' }}>
                                    <Card className={classesPC.card}>
                                        <CardActionArea className={classesPC.cardIterno}>{menuPrincipal.icon}
                                            <Typography>{menuPrincipal.legend}</Typography>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))
                    }
                </React.Fragment>
            )
        }

        return <SelectionPCorMobile> </SelectionPCorMobile>;
    }

    function ReturnPcOrMobile() {
        const matches = useMediaQuery('(max-width:660px)');

        return (matches ?
            <Container className={classesMobile.root}>
                <Box display='flex' flexDirection="column">
                    <MenuCard />
                </Box>
            </Container>
            :
            <Container className={classesPC.root}>
                <Grid container spacing={5}>
                    <Grid container item xs={12} spacing={5}>
                        <MenuCard />
                    </Grid>
                </Grid>
            </Container>
        );

    }


    return (
        <ReturnPcOrMobile></ReturnPcOrMobile>
    )


}
