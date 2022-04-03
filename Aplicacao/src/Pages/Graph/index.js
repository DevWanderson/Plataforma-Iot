import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    makeStyles,
    Card,
    Select,
    Container,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField,
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TableBody
} from '@material-ui/core'
import TimeSeries from '../../Components/Graph/Time-series';
import DonutChart from '../../Components/Graph/Donut-chart';
import SearchForm from '../../Components/SelectDeviceCombo/search-form'
import {getDate, getpropsDevice, getlatitude, getlongitude} from '../../Utils/functions'

//Arley Souto -->
const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 1600
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        marginBottom: theme.spacing(3),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    }
}))
//--*

const nomeVars = {
    '': '',
    'temp': 'Temperatura',
    'hum': 'Umidade',
    'velocidade': 'Velocidade',
    'bateria': 'Tensão da bateria',
    'interval': 'Intervalo de envio',
}

export default function Graph() {
    const classes = useStyle();

    const dadosDevice = useSelector((state) => state.deviceState.dadosDevice);
    const propsDevice = getpropsDevice(dadosDevice);
    const lastDate = new Date((dadosDevice.length > 0) ? dadosDevice[0].ts * 1000 : 0)
    const varsDevice = [...Object.keys(nomeVars).filter((prop) => propsDevice.includes(prop)), 'interval']

    const [selectedVar1, setSelectedVar1] = useState('');
    const [selectedVar2, setSelectedVar2] = useState('');
    const [dayCheck, setDayCheck] = useState(false);
    const [grafFixo, setGrafFixo] = useState(true);
    const [timeWindow, setTimeWindow] = useState(1);
    const [dateField, setDateField] = useState(lastDate.toISOString().slice(0, 10))

    useEffect(() => {
        if(!varsDevice.includes(selectedVar1) || !varsDevice.includes(selectedVar2)){
            setSelectedVar1(varsDevice[0])
            setSelectedVar2(varsDevice[0])    
        }
    }, [dadosDevice]);

    return (
        <Container className={classes.root}>
            <SearchForm />
            <Grid container spacing={8}>
                <Grid container item xs={7} spacing={2}>
                    <TimeSeriesField />
                </Grid>
                <Grid container item xs={4} spacing={2}>
                    <DonutChartField />
                </Grid>
                <Grid container item xs={12} spacing={1}>
                    <Paper>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Teste1</TableCell>
                                        <TableCell>Teste2</TableCell>
                                        <TableCell>Teste3</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow hover role="checkbox">
                                        <TableCell>1</TableCell>
                                        <TableCell>2</TableCell>
                                        <TableCell>3</TableCell>
                                    </TableRow>
                                    <TableRow hover role="checkbox">
                                        <TableCell>4</TableCell>
                                        <TableCell>5</TableCell>
                                        <TableCell>6</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )

    function DonutChartField() {
        return (
            <Card className={classes.card}>
                <DonutChart />
                <DataTable />
            </Card>
        )

        function DataTable() {
            return (
                <Paper>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {propsDevice.includes('ts') ? <TableCell>Data de Envio</TableCell>:""}
                                {propsDevice.includes('temp') ? <TableCell>Temperatura</TableCell>:""}
                                {propsDevice.includes('hum') ? <TableCell>Humidade</TableCell>:""}
                                {propsDevice.includes('lat') &&
                                propsDevice.includes('long') ? <TableCell>Latitude/Longitude</TableCell>:""}
                                {propsDevice.includes('velocidade') ? <TableCell>Velocidade</TableCell>:""}
                                {propsDevice.includes('bateria') ? <TableCell>Bateria</TableCell>:""}
    
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { dadosDevice.map((data,index) => (
                                (index < 4) ?
                                    <TableRow hover role="checkbox">
                                        {propsDevice.includes('ts')         ? <TableCell>{getDate(data.ts)}</TableCell>:""}
                                        {propsDevice.includes('temp')       ? <TableCell>{parseFloat(data.temp).toFixed(1)}°C</TableCell>:""}
                                        {propsDevice.includes('hum')        ? <TableCell>{parseFloat(data.hum).toFixed(1)}%</TableCell>:""}
                                        {propsDevice.includes('lat') &&
                                         propsDevice.includes('long')       ? <TableCell>{getlatitude(data.lat)+', '+getlongitude(data.long)}</TableCell>:""}
                                        {propsDevice.includes('velocidade') ? <TableCell>{data.velocidade} km/h</TableCell>:""}
                                        {propsDevice.includes('bateria')    ? <TableCell>{parseFloat(data.bateria).toFixed(2)}V</TableCell>:""}
                                    </TableRow>
                                : '' )
                            ) }
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            )
        }
    }

    function TimeSeriesField() {
        return (
            <Card className={classes.card}>
                <Grid container spacing={1} style={{justifyContent:'center', alignItems:'center', display:'flex', marginTop:40}}>
                    <Grid container item xs={5} spacing={2}>
                        <DropdownVar1 />
                    </Grid>
                    <Grid container item xs={4} spacing={2}>
                        <DropdownVar2 />
                    </Grid>
                    <Grid container item xs={3} spacing={2}>
                        <DropdownTime />
                    </Grid>
                    <TimeOptions />
                </Grid>
                <TimeSeries var1={selectedVar1} var2={selectedVar2}
                    dayCheck={dayCheck} grafFixo={grafFixo}
                    timeWindow={timeWindow} dateField={dateField} />
            </Card>
        )

        function DropdownVar1() {
            return (
                <div style={{ width: '15%', marginLeft: '2%' }}>
                    <FormControl >
                        <TextField
                            value={selectedVar1}
                            onChange={(e) => setSelectedVar1(e.target.value)}
                            select
                            variant="outlined"
                            label="Variável do lado esquerdo"
                            style={{ marginTop: -10 }}>

                            {(varsDevice.length > 0) ? varsDevice.map((prop) => (
                                <MenuItem key={nomeVars[prop]} value={prop}>{nomeVars[prop]}</MenuItem>
                            )
                            ) : (
                                <MenuItem>Nenhuma variável</MenuItem>
                            )}

                        </TextField>
                    </FormControl>
                </div>

            )
        }
        function DropdownVar2() {
            return (
                <div style={{ width: '15%', marginLeft: '2%' }}>
                    <FormControl>
                        
                        <TextField
                            select
                            variant="outlined"
                            style={{ marginTop: -10 }}
                            label="Variável do lado direito"
                            value={selectedVar2}
                            onChange={(e) => setSelectedVar2(e.target.value)}
                        >
                            {(varsDevice.length > 0) ? varsDevice.map((prop) => (
                                <MenuItem key={nomeVars[prop]} value={prop}>{nomeVars[prop]}</MenuItem>
                            )) : (
                                <MenuItem>Nenhuma variável</MenuItem>
                            )}

                        </TextField>
                    </FormControl>
                </div>
            )
        }
        function DropdownTime() {
            return (
                <div style={{ width: '13%', marginLeft: '6%' }}>
                    <FormControl >
                        <TextField
                            value={timeWindow}
                            onChange={(e) => setTimeWindow(e.target.value)}
                            select
                            label="Janela de tempo"
                            variant="outlined"
                            style={{ marginTop: -10 }}>
                            <MenuItem key={"1 hora"} value={1 / 24}>{"1 hora"}</MenuItem>
                            <MenuItem key={"2 horas"} value={2 / 24}>{"2 horas"}</MenuItem>
                            <MenuItem key={"4 horas"} value={4 / 24}>{"4 horas"}</MenuItem>
                            <MenuItem key={"8 horas"} value={8 / 24}>{"8 horas"}</MenuItem>
                            <MenuItem key={"12 horas"} value={12 / 24}>{"12 horas"}</MenuItem>
                            <MenuItem key={"1 dia"} value={1}>{"1 dia"}</MenuItem>
                            <MenuItem key={"2 dias"} value={2}>{"2 dias"}</MenuItem>
                            <MenuItem key={"4 dias"} value={4}>{"4 dias"}</MenuItem>
                            <MenuItem key={"1 semana"} value={7}>{"1 semana"}</MenuItem>
                            <MenuItem key={"2 semanas"} value={14}>{"2 semanas"}</MenuItem>
                            <MenuItem key={"3 semanas"} value={21}>{"3 semanas"}</MenuItem>
                            <MenuItem key={"1 mês"} value={1 * 30.437}>{"1 mês"}</MenuItem>
                            {/* <MenuItem key={"2 meses"}   value={2*30.437}>{"2 meses"}</MenuItem>
                        <MenuItem key={"4 meses"}   value={4*30.437}>{"4 meses"}</MenuItem>
                        <MenuItem key={"7 meses"}   value={7*30.437}>{"7 meses"}</MenuItem>
                        <MenuItem key={"1 ano"}     value={365.27}>{"1 ano"}</MenuItem> */}
                        </TextField>
                    </FormControl>
                </div>
            )
        }
        function TimeOptions() {
            return (
                <div>
                    <FormControlLabel
                        control={<Checkbox color="prmary" value={dayCheck} onChange={(e) => setDayCheck(e.target.checked)} />}
                        label="Dia específico"
                    />
                    {dayCheck === false ?
                        <FormControlLabel
                            control={<Checkbox color="primary" value={grafFixo} onChange={(e) => setGrafFixo(e.target.checked)} />}
                            label="Manter gráfico estático"
                            checked={grafFixo}
                        />
                        :
                        <TextField type="date" value={dateField} onChange={(e) => setDateField(e.target.value)} />
                    }
                </div>
            )
        }
    }
}