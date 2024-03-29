import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { element } from "prop-types";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import "./History.css"
import { TextField } from "@mui/material";


const baseURL = "http://localhost:8000/amz_items/";

const History = () => {
	// const [data, setData] = useState(0);
	const [timestamp, setTimestamp] = useState(0)			 // x axis
	const [datapoints, setDatapoints] = useState({});		 // y axis
	
	const [asin, setASIN] = useState(0);
	const [options, setOptions] = useState(null);
	const [allAsins, setAllAsins] = useState(null);

	useEffect(() => {
		if (datapoints !== {}) {
			// console.log(datapoints);
			renderChart();
		}
		if (allAsins === null) {
			autocompleteDropdown();
		}
	})

	const accessToken = sessionStorage.getItem("serverToken");
	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}

	

	const getTimeSeries = async () => {
		
		//response should be a list of dictionaries
		const response = await axios.get(baseURL + "hist/"+asin,{headers: { "Content-Type": "application/json", Bearer: accessToken },});
		// console.log(response);
		//response needs to be sorted based on the timestamp
		//response.sort(function(a,b){return new Date(a.timestamp) - new Date(b.timestamp)});
		//put the sorted times into xAxis
		//put the prices into yAxis in the corresponding order as its time
		// var xAxis = [];
		// var yAxis = [];
		// const data = {
		// 	labels:xAxis,
		// 	datasets: [{
		// 		label:"price history",
		// 		data: yAxis
		// 	}]
		// }
		// console.log(response.data)
		const result = JSON.parse(response.data);
		console.log(result)
		const tuples = []
		result.forEach(element => {
			tuples.push({
				'timestamp': element['timestamp']['$date'], 
				'sellingPrice': element['sellingPrice'],
				'cost': element['price'],
				'orderedUnits': element['Ordered Units'],
				'inventory': element['Sellable On Hand Units'],
			})
		});
		// console.log(tuples)
		tuples.sort(function(a,b){
			return a.timestamp - b.timestamp;
		});
		// console.log(tuples)
		const timestamp = [];
		const sellingPrice = [];
		const cost = [];
		const orderedUnits = [];
		const inventory = [];
		tuples.forEach(element => {
			timestamp.push(element['timestamp']);
			sellingPrice.push(element['sellingPrice']);
			cost.push(element['cost']);
			orderedUnits.push(element['orderedUnits']);
			inventory.push(element['inventory']);
		})
		// console.log(timestamp)
		// console.log(price)
		
		setTimestamp(timestamp);
		// console.log(timestamp)
		const data = {
			"sellingPrice":sellingPrice,
			"cost":cost, 
			"orderedUnits":orderedUnits, 
			"inventory":inventory, 
		}
		setDatapoints(data);
		// console.log("data:", datapoints)
	}

	function renderChart() {
		const charts = document.getElementById("charts");

		let chartExists = Chart.getChart("charts");
		if(chartExists !== undefined){
			chartExists.destroy();
		}

		const histChart = new Chart(charts,{
			type:"line",
			options: {
				aspectRatio: 1,
			},
			data: {
				labels: timestamp,
				datasets: [
					{
						label: "Selling Price",
						data: datapoints['sellingPrice'],
						fill: false,
					},
					{
						label: "Costs",
						data: datapoints['cost'],
						fill: false,
					},
					{
						label: "Ordered Units",
						data: datapoints['orderedUnits'],
						fill: false,
						hidden: true,
					},
					{
						label: "Inventory",
						data: datapoints['inventory'],
						fill: false,
						hidden: true,
					},

				]
			}
		})
	}

	function filterDate() {
		const start = Date.parse(document.getElementById('startDate').value);
		const end = Date.parse(document.getElementById('endDate').value);

		// console.log(start)
		// console.log(end)

		const dates = timestamp.map(ts => Date.parse(ts));
		// console.log(dates)

		var startInd = 0;
		while (start && startInd < dates.length) {
			if (start < dates[startInd]) {
				break;
			}
			startInd++;
		}

		var endInd = dates.length-1;
		while (end && endInd > 0) {
			if (end > dates[endInd]) {
				break;
			}
			endInd--;
		}

		// console.log(startInd, endInd);

		const filterTimestamps = timestamp.slice(startInd, endInd+1);
		// console.log(filterTimestamps);

		let histChart = Chart.getChart("charts");

		let dataInd = 0;
		for (const dataset in datapoints) {
			// console.log(datapoints[dataset])
			const filterDataset = datapoints[dataset].slice(startInd, endInd+1);
			histChart.data.datasets[dataInd].data = filterDataset;
			dataInd++;
			// console.log(filterDataset)
		}
		histChart.data.labels = filterTimestamps;
		histChart.update('none');
	}

	function resetFilter() {
		let histChart = Chart.getChart("charts");
		histChart.data.labels = timestamp;
		let dataInd = 0;
		for (const dataset in datapoints) {
			// console.log(datapoints[dataset])
			histChart.data.datasets[dataInd].data = datapoints[dataset];
			dataInd++;
			// console.log(filterDataset)
		}

		histChart.update('none')
	}

	const autocompleteDropdown = async () => {
		const response = await axios.get(baseURL + "asins",{headers: { "Content-Type": "application/json", Bearer: accessToken },});
		// console.log(response)
		const result = response.data;
		// console.log(result);
		setAllAsins(result);
	}

	return (
		<div className="container">
			{/* <label>
				Enter ASIN: <input value={asin} onChange={e => setASIN(e.target.value)} />
			</label> */}
			{/* <button onClick={autocompleteDropdown}>autocomplete</button> */}
			<Autocomplete
				onChange={(event, newValue) => {
					setASIN(newValue)
				}}
				options={allAsins}
				className="autocomplete"
				renderInput={(params) => <TextField {...params} label="ASIN"/>}
			/>
			<button onClick={getTimeSeries}>Show History</button>
			<div id="chart-space">
				Start: <input type="date" id="startDate"/> End: <input type="date" id="endDate"/>
				<button onClick={filterDate}>Filter</button>
				<button onClick={resetFilter}>Reset</button>

				<canvas id="charts" width="200" height="200"></canvas>
			</div>

			
		</div>
		
	)
}

export default History;