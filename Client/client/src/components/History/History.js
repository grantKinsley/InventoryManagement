import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
// import "./History.css"

const History = () => {

	if (sessionStorage.getItem("serverToken") === null) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="container">
            insert stuff here
		</div>
		
	)
}

export default History;