import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

// import "./History.css"


const baseURL = "http://localhost:8000/amz_items/";
const History = () => {
	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}

	var tempASIN = "9876543210"
	
	const getTimeSeries = async () => {
		const accessToken = sessionStorage.getItem("serverToken");
		//response should be a list of dictionaries
		const response = await axios.get(baseURL + "hist/"+tempASIN,{headers: { "Content-Type": "application/json", Bearer: accessToken },});
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
		const LineChart = () => {
			<div>
				<Line data={data} />
			</div>
		}
		

		// new Chart(charts,{
		// 	type:"line",
		// 	data: {
		// 		labels:xAxis,
		// 		datasets:[{
		// 			label:"Price History",
		// 			data:yAxis,
		// 			borderColor:"black",
		// 			fill:false,
		// 		}]
		// 	}
		// })
	}

	return (
		<div className="container">
			<button onClick={getTimeSeries}>Test Time Series</button>
			
		</div>
		
	)
}

export default History;