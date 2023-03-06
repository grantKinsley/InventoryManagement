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

	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="container">
		<div className="card-container">
			<div className="card">
					<h2>Weekly Glance</h2>
						<h4>Sales</h4>
						<div className="green">$ {sales}</div>

						<h4>Products Ordered</h4>
						<div className="green">{ordered}</div>

						<h4>Products Returned</h4>
						<div className="red">{returned}</div>

						<h4>Views</h4>
						<div className="green">{views} views</div>
				</div>

				<div className="card">
					<h2>Hottest Items</h2>
				</div>
		</div>
			
		</div>
		
	)
}

export default Dashboard;