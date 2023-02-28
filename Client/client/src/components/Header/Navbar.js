// import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
	const location = useLocation()
	
	if (location.pathname === "/login" || location.pathname === "/register")
		return null;
		
	return (
		<ul>
			<li>
				<Link to="/">Home</Link>
			</li>
			<li>
				<Link to="/catalog">Catalog</Link>
			</li>
			<li>
				<Link to="/upload">Upload</Link>
			</li>
			<li>
				<Link to="/">Settings</Link>
			</li>
			<li>
				<Link to="/">Logout</Link>
			</li>
		</ul>
	)
}

export default Navbar;