import React from "react";
import "./spinner.css";

export default function LoadingSpinner(props) {
  return (
    <div className="spinner-container" style={props.loading ? {} : { display: 'none' }}>
      <div className="loading-spinner">
      </div>
    </div>
  );
}