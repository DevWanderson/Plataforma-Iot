import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import "./index.css"

const LoadingStyele = makeStyles(() => ({
    circle: {
        color: '#FF9400',
    },


}))

export default function Load() {
    const classes = LoadingStyele()
    return (
        <div className="spinnerLoad">
            <CircularProgress className={classes.circle} size={100} />
        </div>
    )
}