import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        zIndex: 5
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        background: '#262626'
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
    },
    menuButtom: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',

    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,

    },
    drawerPaper: {
        width: drawerWidth,

    },
    title: {
        flexGrow: 1
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        justifyContent: 'flex-end',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(2)
    },
    rouded: {
        color: '#000',
        backgroundColor: '#FFF'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    form: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

}));

export default useStyles;