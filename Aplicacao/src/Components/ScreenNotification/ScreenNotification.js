import React, { useState, useEffect } from 'react';
import './style.css'


export default function ScreenNotification(props) {

    const [notice, setNotice] = useState('');
    const [open, setOpen] = useState(false);



    useEffect(() => {
        if (props.notice) {
            setNotice(props.notice)
        }

        if (props.status) {
            setOpen(props.status)
        }

    }, [props.notice, props.status])



    function handleOpen() {
        setOpen(false)
    }

    return (
        <div className='containerScreenNotification' style={open == false ? { display: 'none' } : { display: 'flex' }} >

            <div className='WhiteBlock'>
                <h2>Atenção</h2>
                {notice === '' ?
                    <p>Erro :/</p>
                    :
                    <p>{notice}</p>
                }
                <button className='teste' onClick={handleOpen}> OK</button>
            </div>

        </div>
    );

}