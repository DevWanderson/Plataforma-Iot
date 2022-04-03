import React from 'react';
import { useSelector } from 'react-redux';
import './SelectDeviceAlerts.css';
import SearchType from '../../../Components/SearchType/SearchType';
import { useState } from 'react';
import { useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';
import Setor from '../../../Components/Setor';

export default function SelectDeviceAlerts(props) {

    const redux = useSelector(state => state);
    const [options, setOption] = useState([]);
    const [listDevices, setListDevices] = useState([]);
    const [type, setType] = useState('');
    

    
    function getOptions(event) { //Função add opção, verifica se já existe e retira opção da array caso checkout seja alterado para false
        if (event.target.checked === true) {
            if (options == '') {
                setOption([event.target.value])
            } else {
                let isExist = options.filter(item => item == event.target.value)
                if (isExist == '') {
                    setOption([...options, event.target.value])
                }
            }
        } else {
            let newArray = options.filter(item => item != event.target.value)
            setOption(newArray)
            
        }

    }

    /* function getAllOptions(event) {

        if (event.target.checked === true) {
            let newList = listDevices.map(item => {
                return item.device
            })
            setOption(newList);

        } else {
            setOption([])

        }

    } */

    useEffect(() => {
        setType(redux.typeSelected)
        console.log(options)
    }, [redux.typeSelected]) //sempre atualiza o estado type para o type selecionado no compoente SearchType


    useEffect(() => {
        if (redux.setorState.dadosSetor.length != 0) {
            let newList = redux.setorState.dadosSetor.filter(item => item.type == type)
            setListDevices(newList)
            

        }
    }, [type, redux.setorState.dadosSetor]) //pega da lista de todos os devices, os devices que são do mesmo tipo do comp SearchType

    useEffect(() => {
        props.get(options)
        
    }, [options]) //Passa as opções escolhidas para o componente pai

    useEffect(() => {
        setOption([])
    }, [redux.typeSelected]) //Zera o array com as opções escolhidas, caso altere o tipo dos devices

    return (


        <div className='ContainerSelectedDeviceAlerts' style={{ display: props.step == 0 ? 'flex' : 'none' }}>
            <div className='setorAndType'>
                <SearchType /> 
                <Setor />
            </div>
            {listDevices.length === 0 ? ''
                :
                <div className='headerTableSelectedDeviceAlerts'>
                    <span >{`Dipositivos selecionados: ${options.length}`}</span>
                    {/* <span>Todos: <Checkbox color='primary' onChange={getAllOptions} /></span> */}
                </div>
            }



            <ul className='ulSelectedDeviceAlerts' >

                
                {listDevices.length != 0 ?
                    listDevices.map((item) => {
                        return (
                            <>

                                <li key={item.device} className='liSelectedDeviceAlerts'>{item.name}<Checkbox color='primary' value={item.device} onChange={getOptions} /></li>
                                <Typography style={{ color: '#808080', marginTop: -36 }} className='liSelectedDeviceAlerts'>{`UID: ${item.device}`}</Typography>
                                <div className='linhaSelectedDeviceAlerts'></div>
                            </>
                        )
                    })

                    :

                    <p style={{ textAlign: 'center', margin: '0px', padding: '10px' }}>Atenção: Selecione um tipo que possua dispositivos cadastrados.</p>
                }
            </ul>

        </div>



    );
}