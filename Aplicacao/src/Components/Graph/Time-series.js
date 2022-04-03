/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */


import api from '../../Components/Connections/api'
import React, { useState, useEffect } from 'react';
import { CircularProgress, Fade } from '@material-ui/core'
import { useSelector } from 'react-redux';
import { downloadData } from '../../Utils/download_functions'
import { colorVars } from './varsProps'
import { Chart } from 'react-google-charts'


export default function TimeSeries(props) {
    const {var1, var2, dayCheck, grafFixo, timeWindow, dateField} = props

    const currentDevice = useSelector((state) => state.devsInfoState.currentDevice);
    const deviceData = useSelector((state) => state.devsInfoState.deviceData);
    const deviceUnits = useSelector((state) => state.devsInfoState.deviceUnits);

    const [varsLegend, setVarsLegend] = useState({});
    const [graphData, setGraphData] = useState([])
    const [graph, setGraph] = useState([])
    const [animate, setAnimate] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const varsLeg = {interval: 'Intervalo de envio [s]'}

        for(let varible in deviceUnits){
            const word = varible.toString()
            const unit = deviceUnits[varible]
            varsLeg[varible] = `${word.charAt(0).toUpperCase() + word.slice(1)}`
                             + `${unit ?' ['+ unit +']':''}`
        }
        setVarsLegend(varsLeg)
    }, [deviceUnits]);

    useEffect(() => {
        if (dateField!=='' && deviceData.length>0){
            setLoading(true)
            const lastDate = deviceData[0].ts
            const date = new Date( dateField + ' 24:00:00' ).valueOf()/1000

            const finalDate = !dayCheck ? lastDate : date
            const initialDate = (finalDate - timeWindow * 60*60*24)

            downloadData(`dev_eui=${currentDevice}&from_date=${initialDate}${ dayCheck ? `&to_date=${finalDate}` : '' }`)
                .then(data => {
                    setLoading(false)
                    try {
                        if (data.length > 1) {
                            setAnimate(true)
                            setGraphData(data);
                        }
                        else {
                            setGraphData([])
                            console.log('Lista de dados do gráfico baixada vazia!')
                        }
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
        }
        else    setGraphData([])

    }, [timeWindow, dateField])

    useEffect(() => {
        const pointsGraph = getPointsGraph()
        setGraph(pointsGraph)
        setTimeout(() => setAnimate(false), 3000);
    }, [var1, var2, graphData])

    useEffect(() => {

        if (!dayCheck && !grafFixo && (graphData.length > 0)) {
            const date_ts = graphData[0].ts * 1000
            const date = new Date(date_ts).toLocaleString('pt-BR')

            const instervalId = setInterval(() => {
                downloadnAppendData(`from_date=${date.toLocaleString('pt-BR')}`)
                setGraph(getPointsGraph())
            }, 8000)
            return () => {
                clearInterval(instervalId);
            }
        }
    }, [graph, grafFixo])

    function getPointsGraph() {
        const dados = (var1 === 'interval' || var2 === 'interval') ?
            graphData.map((val, i) => (
                { ...val, 'interval': (i < graphData.length-1) ? (graphData[i].ts - graphData[i+1].ts) : null }
            )) : graphData

        const pointsGraph = dados.map((dev) => ([new Date(dev['ts'] * 1000), dev[var1], dev[var2]]))
        return [['t', varsLegend[var1], varsLegend[var2]], ...pointsGraph]
    }

    async function downloadnAppendData(options) {
        const user = JSON.parse(localStorage.getItem('Auth_user')).uid;
        const eui = currentDevice

        await api.get(`data?dev_eui=${eui}&${options}&login=${user}`)
            .then((res) => {
                const dados = graphData
                res.data.forEach((data) => {
                    if (data.ts > dados[0].ts)
                        dados.unshift(data)
                })
                setGraphData(dados);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return !loading ? (graphData.length > 0) ? <DrawGraph /> :
    <p style={{ marginLeft: '15%', marginRight: '12%', marginTop: '24%', marginBottom: '30%' }}> O dispositivo não possui dados para serem visualizados neste período/data.</p> :
        <LoadingRing />

    function DrawGraph() {
        return (
            <Chart
                width={'100%'}
                height={'500px'}
                chartType="LineChart"
                loader={<LoadingRing />}

                data={graph}
                options={{
                    //legend: 'none',
                    chartArea: { width: '85%', height: '70%' },
                    animation: animate && (dayCheck || grafFixo) ?
                        {
                            duration: 1000,
                            easing: 'out',
                            startup: true
                        } : '',
                    series: {
                        0: {
                            targetAxisIndex: 0,
                            ...(var1 !== 'interval' ? {/* curveType: 'function' */} : { lineWidth: 1, lineDashStyle: [4, 5, 2, 5], pointSize: 4 })
                        },
                        1: {
                            targetAxisIndex: 1, visibleInLegend: (var2 === var1 ? false : true),
                            ...(var2 !== 'interval' ? {/* curveType: 'function' */} : { lineWidth: 1, lineDashStyle: [4, 5, 2, 5], pointSize: 4 })
                        },
                    },
                    hAxis: {
                        title: 'Tempo',
                        gridlines: {
                            count: "-1",
                            units: {
                                minutes: { format: ["HH:mm"] },
                                hours: { format: ["HH:mm \n d/MM", "H'h'"] },
                                days: { format: ["dd/MM \n /yyyy", "d/M"] },
                                months: { format: ["MM/yyyy", "M/yy"] }
                            }
                        },
                        minorGridlines: {
                            units: {
                                minutes: { format: ["HH:mm", ":mm"] },
                                hours: { format: ["HH:mm", "H'h'"] },
                                days: { format: ["d"] },
                            }
                        }
                    },
                    vAxes: {
                        //0: { title: textoVars[var1] },
                        //1: { title: textoVars[var2] }
                    },
                    colors: [colorVars[var1], colorVars[var2]],
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        )
    }
    function LoadingRing() {
        return (
            <Fade style={{
                transitionDelay: '1000ms',
                marginLeft: '45%', marginTop: '24%', marginBottom: '28%'
            }}
                in={ true }>
                <CircularProgress style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#FF9400',
                }} />
            </Fade>
        )
    }
}