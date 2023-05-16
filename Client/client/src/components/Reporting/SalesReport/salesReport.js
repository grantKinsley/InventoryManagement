import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import DatePicker from "react-datepicker";

import "./salesReport.css"

const SalesReport = () => {
    const [timeframe, setTimeframe] = useState(0);
    const [date, setDate] = useState(new Date());

    const handleChange = (event) => {
        setTimeframe(event.target.value);
    }

    return (
        <div className="report-container">
            <FormControl fullWidth>
                <InputLabel id="timeframe-select-label"> Timeframe </InputLabel>
                <Select
                    labelId="timeframe-select-label"
                    id="timeframe-select"
                    value={timeframe}
                    label="Timeframe"
                    onChange={handleChange}
                    style={{ minWidth: '50px', height: '40px'}}
                >
                    <MenuItem value={1}> Daily </MenuItem>
                    <MenuItem value={2}> Weekly </MenuItem>
                    <MenuItem value={3}> Monthly </MenuItem>
                    <MenuItem value={4}> Annual </MenuItem>
                </Select>
            </FormControl>
            <DatePicker selected={date} onChange={(date) => setDate(date)} />
        </div>
    )
}

export default SalesReport;