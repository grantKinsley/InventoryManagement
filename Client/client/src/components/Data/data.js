import { useState, useContext, useEffect } from "react";
import styled from 'styled-components'
import React from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import Table from "./Table.js"
import { useTable } from "react-table";
import { Navigate } from "react-router-dom";
import loading from "../../resources/loading.gif"

import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [fetched, setFetched] = useState(false);
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
        Header: 'Sellable Inventory',
        accessor: 'Sellable On Hand Units', 
      },
      {
        Header: 'Open PO Qty',
        accessor: 'Open Purchase Order Quantity', 
      },
      {
        Header: 'Sales this Week',
        accessor: 'Ordered Units', 
      },
      {
        Header: 'Weeks of Cover',
        accessor: ''
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
          {Holdon(columns)}
        </div>
    );
    /**
    return (
        <div>
          <h3>Record List</h3>
          <table className="table table-striped" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>ASIN</th>
                <th>Product Title</th>
                <th>Selling Price</th>
                <th>Cost</th>
                <th>Inventory</th>
              </tr>
            </thead>
            <tbody>{recordList()}</tbody>
          </table>
        </div>
      );
      */
  }
}
