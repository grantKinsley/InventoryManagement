import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import "./Dashboard.css"

const Dashboard = () => {
	const [sales, setSales] = useState(0);
	const [ordered, setOrdered] = useState(0);
	const [returned, setReturned] = useState(0);
	const [views, setViews] = useState(0);
	const [fetched, setFetched] = useState(false);
	const [hottestItems, setHottestItems] = useState([]);
	const [records, setRecords] = useState([]);
	const baseURL = "http://localhost:8000/amz_items/hist";

	useEffect(() => {
		const getRecords = async () => {
			// console.log(auth.token);
			var currentTime = new Date();
			var lastWeekTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - 7);
			//   console.log(currentTime.toJSON())
			//   console.log(lastWeekTime.toJSON())
			const accessToken = sessionStorage.getItem("serverToken");
			const response = await axios.get(baseURL, {
				headers: { "Content-Type": "application/json", Bearer: accessToken, Start: lastWeekTime.toJSON(), End: currentTime.toJSON() },
			});
			setFetched(true);
			const result = JSON.parse(response.data);
			console.log(result);
			setRecords(result);
			// Update dashboard based on queried results
			updateDashboard();
		};
		const updateDashboard = () => {
			const currencyFormatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			});
			const defaultFormatter = new Intl.NumberFormat();
			let [saleSum, orderedSum, returnedSum] = [0,0,0];
			// Arrow function that reads input and converts to number (ie $1,000 -> 1000)
			const parseAsNumber = (input) => Number(String(input).replace(/[^0-9.-]+/g,""));
			for (let item of records) {
				let sale = item?.["Ordered Revenue"] ? parseAsNumber(item["Ordered Revenue"]) : 0;
				let order = item?.["Ordered Units"] ? parseAsNumber(item["Ordered Units"]) : 0;
				let ret = item?.["Customer Returns"] ? parseAsNumber(item["Customer Returns"]) : 0;

				// Correct item entries to have the correct type and format
				item["Ordered Revenue"] = sale;
				item["Ordered Units"] = order;
				item["Customer Returns"] = ret;

				saleSum += sale;
				orderedSum += order;
				returnedSum += ret;
			}
			setSales(currencyFormatter.format(saleSum));
			setOrdered(defaultFormatter.format(orderedSum));
			setReturned(defaultFormatter.format(returnedSum));
			records.sort((a,b) => b["Ordered Revenue"]-a["Ordered Revenue"])
			setHottestItems(records.slice(0,5))
			console.log(records);
		}
		getRecords().catch(console.error);
		return;
	  }, [records.length]);
	
	
	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}
	return (
		<div className="container">
			<div className="card-container">
				<div className="card">
					<h2>Weekly Glance</h2>
					<h4>Sales</h4>
					<div className="green">{sales}</div>

					<h4>Products Ordered</h4>
					<div className="green">{ordered}</div>

					<h4>Products Returned</h4>
					<div className="red">{returned}</div>

					<h4>Views</h4>
					<div className="green">{views} views</div>
				</div>

				<div className="card">
					<h2>Hottest Items</h2>
					{hottestItems.map(a => (<div>{a?.["ASIN"]}</div>))}
				</div>
			</div>

		</div>

	)
}

export default Dashboard;