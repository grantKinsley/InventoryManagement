import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import "./generalSettings.css"

const General = () => {

    return (
        <div className="general-container">
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" label="API Token" variant="outlined" />

            </Box>
        </div>
    )
}

export default General;