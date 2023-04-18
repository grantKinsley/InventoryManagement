import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { element } from "prop-types";

// import "./History.css"


const baseURL = "http://localhost:8000/amz_items/";
const accessToken = sessionStorage.getItem("serverToken");
const History = () => {
	const [data, setData] = useState(0);
	const [timestamp, setTimestamp] = useState(0)	// x axis
	const [price, setPrice] = useState(0)			// y axis
	const [asin, setASIN] = useState(0)

	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}

	var tempASIN = "9876543210"
	
	const getTimeSeries = async () => {
		
		//response should be a list of dictionaries
		const response = await axios.get(baseURL + "hist/"+asin,{headers: { "Content-Type": "application/json", Bearer: accessToken },});
		console.log(response);
		//response needs to be sorted based on the timestamp
		//response.sort(function(a,b){return new Date(a.timestamp) - new Date(b.timestamp)});
		//put the sorted times into xAxis
		//put the prices into yAxis in the corresponding order as its time
		var xAxis = [];
		var yAxis = [];
		const data = {
			labels:xAxis,
			datasets: [{
				label:"price history",
				data: yAxis
			}]
		}
		// console.log(response.data)
		const result = JSON.parse(response.data);
		// console.log(result)
		const tuples = []
		result.forEach(element => {
			tuples.push({
				'timestamp': element['timestamp']['$date'], 
				'price': element['price']})
		});
		// console.log(tuples)
		tuples.sort(function(a,b){
			return a.timestamp - b.timestamp;
		});
		// console.log(tuples)
		const timestamp = []
		const price = []
		tuples.forEach(element => {
			timestamp.push(element['timestamp'])
			price.push(element['price'])
		})
		console.log(timestamp)
		console.log(price)
		setTimestamp(timestamp)
		setPrice(price)
		// setData(tuples);

		const charts = document.getElementById("charts");

		let chartExists = Chart.getChart("charts");
		if(chartExists != undefined){
			chartExists.destroy();
		}

		var histChart = new Chart(charts,{
			type:"line",
			data: {
				labels:timestamp,
				datasets:[{
					label:"Price History",
					data:price,
					borderColor:"black",
					fill:false,
				}]
			}
		})
	}

	return (
		<div className="container">
			<label>
				Enter ASIN: <input value={asin} onChange={e => setASIN(e.target.value)} />
			</label>
			<button onClick={getTimeSeries}> Show History</button>
			<div>
				{/* {data}
				{timestamp}
				{price} */}
			</div>
			<div>
				<canvas id="charts" width="200" height="200"></canvas>
			</div>

			
		</div>
		
	)
}

export default History;