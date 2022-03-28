import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Select,
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField
} from '@material-ui/core'
import TimeSeries from '../../Components/Graph/Time-series';
import { nomeVars } from '../../Components/Graph/varsProps'


export default function Graph() {
    const selectedDevice = useSelector((state) => state.devicesState.selectedDevice)
    const deviceData = useSelector((state) => state.deviceData);
    const deviceProps = useSelector((state) => state.deviceProps);

    const lastDate = new Date((deviceData.length > 0) ? deviceData[0].ts * 1000 : 0)

    const [varsDevice, setVarsDevice] = useState([]);
    const [selectedVar1, setSelectedVar1] = useState('');
    const [selectedVar2, setSelectedVar2] = useState('');
    const [dayCheck, setDayCheck] = useState(false);
    const [grafFixo, setGrafFixo] = useState(true);
    const [timeWindow, setTimeWindow] = useState(1);
    const [dateField, setDateField] = useState(lastDate.toISOString().slice(0, 10))

    useEffect(() => {
        setVarsDevice( [...Object.keys(nomeVars).filter((prop) => deviceProps[selectedDevice].includes(prop)), 'interval'])
    }, [deviceProps]);

    useEffect(() => {
        if(!varsDevice.includes(selectedVar1) || !varsDevice.includes(selectedVar2)){
            setSelectedVar1(varsDevice[0])
            setSelectedVar2(varsDevice[0])    
        }
    }, [varsDevice]);

    //Arley Souto
    const [open, setOpen] = useState(false)

    function handleClickOpen() {
        setOpen(true);
    }
    function handleClose() {
        setOpen(false);
    }
    //--*

    return (
        //Arley Souto -->
        <Container fluid>

            <Button onClick={handleClickOpen}>Configurações</Button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Configurações do Gráfico</DialogTitle>
                <DialogContent style={{ flexDirection: 'column', display: 'flex' }}>
                    <DropdownVar1 />
                    <DropdownVar2 />
                    <DropdownTime />
                    <TimeOptions />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Ok</Button>
                </DialogActions>
            </Dialog>
            <TimeSeries var1={selectedVar1}
                var2={selectedVar2}
                dayCheck={dayCheck}
                grafFixo={grafFixo}
                timeWindow={timeWindow}
                dateField={dateField} />


        </Container>
        // --*
    )

    function DropdownVar1() {
        return (
            <FormControl >
                <InputLabel >Variável do lado esquerdo</InputLabel>
                <Select
                    value={selectedVar1}
                    onChange={(e) => setSelectedVar1(e.target.value)}
                >
                    {(varsDevice.length > 0) ? varsDevice.map((prop) => (
                        <MenuItem key={nomeVars[prop]} value={prop}>{nomeVars[prop]}</MenuItem>
                    )
                    ) : (
                        <MenuItem>Nenhuma variável</MenuItem>
                    )}
                </Select>
            </FormControl>

        )
    }
    function DropdownVar2() {
        return (
            <FormControl>
                <InputLabel>Variável do lado direito</InputLabel>
                <Select
                    value={selectedVar2}
                    onChange={(e) => setSelectedVar2(e.target.value)}
                >

                    {(varsDevice.length > 0) ? varsDevice.map((prop) => (
                        <MenuItem key={nomeVars[prop]} value={prop}>{nomeVars[prop]}</MenuItem>
                    )) : (
                        <MenuItem>Nenhuma variável</MenuItem>
                    )}
                </Select>
            </FormControl>

        )
    }
    function DropdownTime() {
        return (

            <FormControl >
                <InputLabel>Janela de tempo</InputLabel>
                <Select
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                >
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
                </Select>
            </FormControl>

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