import React, { useEffect } from 'react'
import './styles.css'
import './style.css'
import { Redirect } from 'react-router-dom'
import { useState } from 'react';

//Para usar este compoente é preciso passar 2 props:
// status = mostrar ou nao a anicamção 
// local = rota de redirecionamento 



export default function SuccessAnimationGeneric(props) {

    const [isVisible, setIsVisible] = useState(false)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        setIsVisible(props.status)
    }, [props.status])

    if (isVisible === true) {
        setTimeout(() => {
            setRedirect(true)
        }, 1500)
    }


    if (redirect === true) {
        return <Redirect to={`${props.local}`} />
    }


    return (

        <>
            {isVisible === false ?
                ''
                :
                <div className='containerSucessAnimationGeneric'>
                    <div class="success-checkmark">

                        <div class="check-icon">
                            <span class="icon-line line-tip"></span>
                            <span class="icon-line line-long"></span>
                            <div class="icon-circle"></div>
                            <div class="icon-fix"></div>
                        </div>

                    </div>
                </div>

            }

        </>

    )
}