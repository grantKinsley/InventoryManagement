import { useState, useContext, useEffect } from "react";
import styled from 'styled-components'
import React from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import Table from "./Table.js"
import { Navigate } from "react-router-dom";
import loading from "../../resources/loading.gif"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./data.css"

// import Tab from "@mui/material/Tab"
// import Tabs from "@mui/material/Tabs"

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

export default function Data() {
  const [records, setRecords] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [date, setDate] = useState(new Date());
  const { auth } = useContext(AuthContext);

  // ----------------------------------
  useEffect(() => {
    const getRecords = async () => {
      // console.log(auth.token);
      const accessToken = sessionStorage.getItem("serverToken");
      const response = await axios.get(baseURL, {
        headers: { "Content-Type": "application/json", Bearer: accessToken },
      });
      setFetched(true);
      const result = JSON.parse(response.data);
      console.log(result);
      setRecords(result);
    };
    getRecords().catch(console.error);
    return;
  }, [records.length]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ASIN",
        accessor: "ASIN",
      },
      {
        Header: 'Model',
        accessor: 'Product Title', // accessor is the "key" in the data
      },
      {
        Header: 'Selling Price',
        accessor: 'sellingPrice', 
      },
      {
        Header: 'Cost',
        accessor: 'price',
      },
      {
        Header: 'Sellable Inventory',
        accessor: 'Sellable On Hand Units', 
      },
      {
        Header: 'Open PO Qty',
        accessor: 'Open Purchase Order Quantity', 
      },
      {
        Header: 'Sales Qty (Week)',
        accessor: 'Ordered Units', 
      },
      {
        Header: 'Revenue (Week)',
        accessor: 'Ordered Revenue'
      },
    ],
    []
  )

  const Holdon = (columns) => {
    if (fetched) {
      return <Table columns={columns} data={records} />
    } else {
      return <img class="img-fluid img-rounded"
        src={loading} />
    }
  }

  if (sessionStorage.getItem("serverToken") === null) {
    return <Navigate to="/login" />;
  }

  // This following section will display the table with the records of individuals.
  if (fetched) {
    return (
        <div> 
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
          <div className="data-container">
            {Holdon(columns)}
          </div>
        </div>
    );
  }
}
