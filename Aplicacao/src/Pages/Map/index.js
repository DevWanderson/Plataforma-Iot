import React, { useState, useEffect } from 'react';
import SearchForm from '../../Components/SelectDeviceCombo/search-form'
import SingleMap from '../../Components/Map/Map-telemetry';

export default function Mapa() {

    return (
        <React.Fragment>
            <SearchForm />
            <SingleMap height="750px" />
        </React.Fragment>
    )
}
