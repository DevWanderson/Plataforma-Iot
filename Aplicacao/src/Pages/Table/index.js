import { useSelector } from 'react-redux';
import { Container, Table, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { getDate, getpropsDevice, getlatitude, getlongitude } from '../../Utils/functions'


export default function Tabela() {
    const dadosDevice = useSelector((state) => state.deviceState.dadosDevice);
    const propsDevice = getpropsDevice(dadosDevice);


    return (
        <Container fluid>
            <Link to="/home">
                <Button variant="light"><IoMdArrowRoundBack size={30} /></Button>
            </Link>

            <Row lg={true} style={{ marginTop: '2%' }}>

                <Col lg="12">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Type</th>
                                <th>Data</th>
                                {propsDevice.includes('temp') ? <th>Temperatura</th> : ""}
                                {propsDevice.includes('hum') ? <th>Humidade</th> : ""}
                                {propsDevice.includes('lat') ? <th>Latitude</th> : ""}
                                {propsDevice.includes('long') ? <th>Longitude</th> : ""}
                                {propsDevice.includes('velocidade') ? <th>Velocidade</th> : ""}
                                {propsDevice.includes('bateria') ? <th>Bateria</th> : ""}
                            </tr>
                        </thead>
                        {
                            dadosDevice.map((dev) => (
                                <tbody>
                                    <tr>
                                        <td>{dev.device}</td>
                                        <td>{dev.type}</td>
                                        <td>{getDate(dev.ts)}</td>
                                        {propsDevice.includes('temp') ? <td>{parseFloat(dev.temp).toFixed(1)}°C</td> : ""}
                                        {propsDevice.includes('hum') ? <td>{parseFloat(dev.hum).toFixed(1)}%</td> : ""}
                                        {propsDevice.includes('lat') ? <td>{getlatitude(dev.lat)}</td> : ""}
                                        {propsDevice.includes('long') ? <td>{getlongitude(dev.long)}</td> : ""}
                                        {propsDevice.includes('velocidade') ? <td>{dev.velocidade} km/h</td> : ""}
                                        {propsDevice.includes('bateria') ? <td>{parseFloat(dev.bateria).toFixed(2)}V</td> : ""}
                                    </tr>
                                </tbody>
                            ))
                        }
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}