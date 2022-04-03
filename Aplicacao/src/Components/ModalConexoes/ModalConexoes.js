import React, { useEffect, useState } from 'react';

import {
    Container,
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    TextField,
    FormControl,
    InputAdornment,
    Slide,
    Dialog,
    AppBar,
    Toolbar,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Divider
} from '@material-ui/core';

import {
    Search,
    Edit,
    Delete,
    Add,
    LocationOn,
    Router,
    HelpOutline,
    Close
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {TiposConexao} from '../../Components/ModalConexoes/tipos-conexao'

const useStyles = makeStyles((theme) => ({
    cards: {
        flexDirection: 'column',
        marginBottom: '20px',
        boxShadow: '3px 3px 4px 1px rgba(0,0,0,0.39)',
        borderRadius: '10px',
    },
    buttons: {
        borderRadius: '15px',
        width: '120px',
        height: '35px',
        padding: '10px'
    },
    cardsActions: {
        marginTop: '-5%',
        float: 'right',
    },
    form: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textIput: {
        borderRadius: 100,
        width: '45%',
        borderRadius: 100,
    },
    icons: {
        float: 'right',
        marginTop: '0.5%',
        marginRight: '1%',
    },

    appBar: {
        position: 'relative',
        backgroundColor: '#262626'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function ModalConexoes(props) {  
    const [filterConnection, setFilterConnection] = useState([]);
    const [searchConnection, setSearchConnect] = useState('')
    const [typeConexao, setTypeConexao] = useState(TiposConexao);
    const classes = useStyles();

    useEffect(() => {
        setFilterConnection(
            typeConexao.filter(coutry => {
                return coutry.name.toLowerCase().includes(searchConnection.toLowerCase())
            })
        )
    }, [searchConnection])    

    const handleClose = () => {
        props.setOpen(false)
    }

    // console.log(`filterConnection: ${filterConnection.length}`)
    return (        
        <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} arial-label="close">
                        <Close />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Selecione um Tipo de Conexão
                    </Typography>
                </Toolbar>
            </AppBar>

            <FormControl className={(classes.form)} >
                <TextField
                    style={{ marginTop: 15, width: 320 }}
                    label="Pesquisar Conexão"
                    variant="outlined"
                    onChange={e => setSearchConnect(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }} />
            </FormControl>

            {filterConnection.length > 0 ? 
                <List>
                    {filterConnection.map(connection => (
                        <React.Fragment>                            
                            <Link onClick={handleClose} to={connection.navigation} style={{ color: '#131313', textDecoration: 'none' }}>
                                <ListItem button >
                                        { connection.id >= 3 ?
                                            <ListItemText primary={connection.name} style={{color: '#aaa'}}/>                                              
                                            :
                                            <ListItemText primary={connection.name} />  
                                        }
                                </ListItem>
                            </Link>
                            <Divider />
                        </React.Fragment>
                    ))}                    
                </List>
                :
                <Typography color="error" align="center" variant="subtitle1" style={{margin: 20}}>
                    "Nenhum dispositivo encontrado"
                </Typography>
                
            }
        </Dialog>
    );
}

export default ModalConexoes;