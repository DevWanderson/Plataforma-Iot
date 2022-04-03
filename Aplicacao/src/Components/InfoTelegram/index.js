import React, { useState } from 'react';
import './styles.css';
import TelegramIcon from '@material-ui/icons/Telegram';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Divider
} from '@material-ui/core';

export default function InfoTelegram() {
    const [infoTelegram, setInfoTelegram] = useState(false);

    function handleOpenTelegramInfo(){
        setInfoTelegram(true);
    }
    
    function handleCloseTelegramInfo(){
        setInfoTelegram(false);
    }

    return (
        <div className="container">
            <div className="componentTelegram" onClick={handleOpenTelegramInfo}>
                <TelegramIcon style={{fontSize: 40}} className="telegramIcon"/>
            </div>
            <Dialog open={infoTelegram} onClose={handleCloseTelegramInfo} maxWidth={50}>
                <DialogTitle>Procure no Telegram por PlataformaIoT ou @PlataformaIoTIBTIbot</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        <Typography>1.Clique em começar</Typography>
                        <Typography>2.Insira o email</Typography>
                        <Typography>3.Digite a senha</Typography>
                        <Typography>4.Pronto, você já receberá os alertas no seu dispositivo.🥳</Typography>
                    </DialogContentText>
                </DialogContent>
                <Divider/>
                <DialogActions>
            <button type="button" className="buttonModal" onClick={handleCloseTelegramInfo}>Fechar</button>
                </DialogActions>

            </Dialog>
        </div>
    )
}