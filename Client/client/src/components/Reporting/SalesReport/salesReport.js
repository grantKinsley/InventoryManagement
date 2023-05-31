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
import { render } from "react-dom";

const baseURL = "http://localhost:8000/amz_items/";

const SalesReport = () => {
    const [showReport, setShowReport] = useState(false)
    const [loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState(1);
    // const [date, setDate] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [start, setStart] = useState(new Date());

    // data we are tracking
    const [timestamps, setTimestamps] = useState([])
    const [unitsSold, setUnitsSold] = useState([])

    useEffect(() => {
        // on every load, set start to align with end
        const new_start = new Date(end);
        if (timeframe == 1) {    // daily
            new_start.setDate(new_start.getDate()-1);
        }
        else if (timeframe == 2) {   // weekly
            new_start.setDate(new_start.getDate()-7);
        }
        else if (timeframe == 3) {   // monthly
            new_start.setMonth(new_start.getMonth()-1);
        }
        else if (timeframe == 4) {   // yearly
            new_start.setFullYear(new_start.getFullYear()-1);
        }
        setStart(new_start);
	})

    const accessToken = sessionStorage.getItem("serverToken");
    if (sessionStorage.getItem("serverToken") === null) {
        return <Navigate to="/login" />;
    }

    // Temporary
    const data = {
        labels: ["05/14/23", "05/15/23", "05/16/23", "05/17/23", "05/18/23", "05/19/23", "05/20/23"],
        values: [53, 27, 44, 34, 60, 55, 22],
        datasets: [
            {
                label: 'Qty Sold',
                data: [53, 27, 44, 34, 60, 55, 22],
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    const parseResult = (res) => {
        var timeToUnits = {};

        for (var item in res) {
            const date_key = res[item]['timestamp']['$date'].substring(0,10)
            const units_val = res[item]['Shipped Units']
            if (!isNaN(units_val)) { 
                if (date_key in timeToUnits) {
                    timeToUnits[date_key] += units_val;
                }
                else {
                    timeToUnits[date_key] = units_val;
                }
            }
            
        }
        const keys = [];
        const vals = []
        for (let key in timeToUnits) {
            keys.push(key);
            vals.push(timeToUnits[key])
            console.log(key + ' ' + timeToUnits[key]);
        }
        renderChart(keys, vals)
    }


    const generateReport = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.get(baseURL + "hist", { headers: { "Content-Type": "application/json", Bearer: accessToken, Start: start.toJSON(), End: end.toJSON() } });
            const result = JSON.parse(response?.data);
            console.log(result);
            parseResult(result)
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
        const timeframe = event.target.value;
        setTimeframe(timeframe);
    };

    function renderChart(labels, values) {
		const chart = document.getElementById("chart");

		let chartExists = Chart.getChart("chart");
		if(chartExists !== undefined){
			chartExists.destroy();
		}

		const new_chart = new Chart(chart,{
			type:"line",
			options: {
				aspectRatio: 1,
			},
			data: {
				labels: labels,
				datasets: [
					{
						label: "Qty Sold",
						data: values,
						fill: false,
					}

				]
			}
		})
	}

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
                    selected={end}
                    onChange={(end) => setEnd(end)}
                    label="End Date"
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
                        <span className="value"> $24,362.41 </span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-title"> Sold to Amazon </span>
                        <span className="value"> $15,242.00 </span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-title"> Customer Returns </span>
                        <span className="value"> 12 </span>
                    </div>
                </div>
                <div className="graph-container">
				    <canvas id="chart" width="800" height="200"></canvas>
                </div>
            </div>
        </div>
    )
}

export default SalesReport;