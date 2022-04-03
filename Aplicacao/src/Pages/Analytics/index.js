import React, { useEffect, useState } from 'react'
import api from '../../Components/Connections/api';
import { useSelector } from 'react-redux';

export default function Analytics() {
    const [metabaseData, setMetabaseData] = useState('');
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null

    useEffect(() => {
        async function metabase() {
            await api.get(`metabase_url?login=${user}`)
                .then((res) => {
                    setMetabaseData(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        metabase()
    }, [])
    return (
        <div style={{ marginTop: 10}}>
            <iframe src={metabaseData} width="100%" style={{ height: '150vh', border:'none' }}></iframe>
        </div>
    )
}