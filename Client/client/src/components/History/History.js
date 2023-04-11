import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import Chart from 'chart.js/auto';

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
		console.log("DONE?")
		var xAxis = [];
		var yAxis = [];
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