import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import {
    Container,
    Typography,
    Button,
    Grid,
    Paper
} from '@material-ui/core';

import {
    MeetingRoom,
    NoMeetingRoom,
    PortableWifiOff,
    SettingsInputAntenna
} from '@material-ui/icons';




export default function Mqtt() {
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [messages, setMessages] = useState([]);
    const [porta, setPorta] = useState([]);


    useEffect(() => {
        const options = {
            protocol: 'mqtt',
            username: 'superuser',
            password: 'bEOmT34OpW'
        }

        var client = mqtt.connect("http://pitunnel.com:12640", options);
        //console.log('TEste', JSON.stringify(messages))

        client.on('connect', () => setConnectionStatus(true)) //conexao ok
        client.subscribe('superuser')


        client.once('message', (topic, message, payload) => {
            //const msg = messages.concat(payload.toString())
            //const msgS = JSON.parse(msg)
            setMessages(message);
            console.log(client)
            client.end()

        })

        client.publish('superuser', 'teste')

    }, [])



    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    {
                        connectionStatus === true ?
                            (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <SettingsInputAntenna style={{ fontSize: 40, color: 'green', marginRight: 20 }} />
                                    <Typography variant="h5">
                                        Dispositivo On
                                    </Typography>
                                </div>
                            )
                            :
                            (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PortableWifiOff style={{ fontSize: 40, color: 'red', marginRight: 20 }} />
                                    <Typography variant="h5">
                                        Dispositivo Off
                                    </Typography>

                                </div>
                            )
                    }
                </Grid>
                <Grid item sm={12}>
                    <Typography>
                    {`Teste de resposta: ${messages}`}
                    </Typography>
                </Grid>
            </Grid>

        </Container>
    )
}