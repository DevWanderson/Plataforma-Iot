import React from 'react';
import {
    Container,
    Paper,
    Typography
} from '@material-ui/core';
import './style.css';


export default function GerenciamentoUsuario() {
    const cards = [
        { id: 0, nameCard: 'Gerenciar usuário', linkCard: '' },
        { id: 1, nameCard: 'Gerenciar tipo LoraWan', linkCard: '' },
        { id: 2, nameCard: 'Gerenciar tipo MQTT', linkCard: '' },
    ]

    const cardsMap = (card, index) => {
        return (
            <Paper className='paperCard' key={card.id}>
                <Typography variant='h5'>{card.nameCard}</Typography>
                {
                    card.id === 0 ?
                        <div className='btnUserContainer'>
                            <button className='btnEditUser'>Editar usuário</button>
                            <button className='btnEditPass'>Alterar senha</button>
                        </div>
                        :
                        <button className='btnEditType'>Editar tipo</button>
                }
            </Paper>
        )
    }

    return (
        <Container>
            <div>
                <Typography className="titleConfig" variant='h4'>Configurações</Typography>
                <div className='cards'>
                    {cards.map(cardsMap)}
                </div>
            </div>
        </Container>
    )
}