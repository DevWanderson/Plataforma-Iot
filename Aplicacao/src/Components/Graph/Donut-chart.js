import React from 'react';
import { useSelector } from 'react-redux';
import { getpropsDevice } from '../../utils/functions'
import { colorVars } from './varsProps'
import { Chart } from 'react-google-charts'

export default function DonutChart() {
    const dadosDevice = useSelector((state) => state.devicesState.dadosDevice);
    const propsDevice = getpropsDevice(dadosDevice);
    const varsDevice = Object.keys(colorVars).filter(prop => {
        return propsDevice.includes(prop)
    })
    return (varsDevice.length > 0) ? <DrawGraph/> : <p>Sem dados do gráfico...</p>

    function DrawGraph() {
        return (
            <Chart
                width={'100%'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Carregando gráfico...</div>}
                  diffdata={{
                    old: [
                        ['Variável', ''], ['Dispositivos', 1], ...varsDevice.map( prop => (['', 0]) )
                    ],
                    new: [
                        ['Variável', ''], ['Dispositivos', 0], ...varsDevice.map( prop => (['', 1]) )
                    ],
                  }}

                options={{
                    chartArea: { width: '88%', height: '80%' },
                    enableInteractivity: false,
                    legend:'none',
                    pieSliceText: 'label',
                    pieSliceTextStyle: {
                        color: 'black',
                        fontSize: 20,
                        bold: true
                    },
                    diff: {
                        innerCircle: { radiusFactor: 0.8 },
                        oldData: { opacity: 0.0 }
                    },
                    colors: [ '#FFFFFF', ...varsDevice.map(prop => (colorVars[prop])) ]
                }}
                rootProps={{ 'data-testid': '3' }}
              />
        )
    }

}