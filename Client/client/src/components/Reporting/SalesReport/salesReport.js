import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import AuthContext from "../../../context-Api/AuthProvider";

// Imports from MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";
import LoadingSpinner from "../../LoadingSpinner/spinner"

// Imports for Charts
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

// Style
import "./salesReport.css"

const baseURL = "http://localhost:8000/amz_items/";

const SalesReport = () => {
    const [showReport, setShowReport] = useState(false)
    const [loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState(0);
    const [date, setDate] = useState(new Date());

    const accessToken = sessionStorage.getItem("serverToken");
    if (sessionStorage.getItem("serverToken") === null) {
        return <Navigate to="/login" />;
    }

    // Temporary
    const data = {
        labels: ["05/15/23", "05/16/23", "05/17/23", "05/18/23", "05/19/23"],
        datasets: [
            {
                label: 'Test',
                data: [0, 5, 2, 3, 5],
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };


    const generateReport = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.get(baseURL + "hist/", { headers: { "Content-Type": "application/json", Bearer: accessToken }, });
            const result = JSON.parse(response?.data);
            console.log(result);
            setShowReport(true)
        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response");
            }
        }
        setLoading(false);
        setShowReport(true);
    };

    const handleChange = (event) => {
        setTimeframe(event.target.value);
    };

    return (
        <div className="main-container">
            <div className="filters-container">
                <FormControl fullWidth>
                    <InputLabel id="timeframe-select-label"> Timeframe </InputLabel>
                    <Select
                        labelId="timeframe-select-label"
                        id="timeframe-select"
                        value={timeframe}
                        label="Timeframe"
                        onChange={handleChange}
                        style={{ minWidth: '50px', height: '30px' }}
                    >
                        <MenuItem value={1}> Daily </MenuItem>
                        <MenuItem value={2}> Weekly </MenuItem>
                        <MenuItem value={3}> Monthly </MenuItem>
                        <MenuItem value={4}> Annual </MenuItem>
                    </Select>
                </FormControl>
                <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                />
                <Button variant="contained" onClick={generateReport} disabled={loading} 
                style={{ minWidth: '100px' }}> 
                    Generate 
                </Button>
            </div>
            <LoadingSpinner loading={loading}/>
            <div className="report-container" style={showReport ? {} : { display: 'none' }}>
                <div className="summary-container">
                    <div className="summary-box">
                        <span className="summary-title"> Amazon Revenue </span>
                        <span className="value"> $100,000.00 </span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-title"> Sold to Amazon </span>
                        <span className="value"> $80,000.00 </span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-title"> Customer Returns </span>
                        <span className="value"> 231 </span>
                    </div>
                </div>
                <div className="graph-container">
                   
                </div>
            </div>
        </div>
    )
}

export default SalesReport;