import { useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import "./Catalog.css";
import placeholderImg from "./logo192.png";
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EnhancedTable from './EnhancedTable';

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

/** 
const SearchBar = ({ setSearchQuery }) => (
  <form className="search-bar">
    <TextField
      id="search-bar"
      className="text"
      label="Enter an ASIN"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton>
  </form>
);*/

const Catalog = () => {
  const [openAdd, setAddOpen] = useState(false);
  const [openDelete, setDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [asin, setAsin] = useState("");
  const [model, setModel] = useState("");
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);
  const [skipPageReset, setSkipPageReset] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // console.log(auth.token);
      const accessToken = sessionStorage.getItem("serverToken");
      const response = await axios.get(baseURL, {
        headers: { "Content-Type": "application/json", Bearer: accessToken },
      });
      setFetched(true);
      const result = JSON.parse(response.data);
      console.log(result);
      setData(result);
    };
    fetchData().catch(console.error);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ASIN",
        accessor: "ASIN",
      },
      {
        Header: 'Model',
        accessor: 'Product Title',
      },
      {
        Header: 'Selling Price',
        accessor: 'sellingPrice',
      },
    ],
    []
  )

  const deleteCompanyData = async (e) => {
    const accessToken = sessionStorage.getItem("serverToken");
    const response = await axios.delete(baseURL, {
      headers: { "Content-Type": "application/json", Bearer: accessToken },
    });
    console.log(response);
    setData([]);
  };

  const handleGetOne = (e) => {
    const fetchOne = async () => {
      const url = baseURL + asin;
      console.log(url);
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json", Bearer: auth.token },
      });
      setFetched(true);
      const result = JSON.parse(response.data);
      setData(result);
    };
    fetchOne().catch(console.error);
  };

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleAddClickOpen = () => {
    setAddOpen(true);
  }

  const handleAddClose = () => {
    setAddOpen(false);
  };

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  if (sessionStorage.getItem("serverToken") === null) {
    return <Navigate to="/login" />;
  }

  if (fetched) {
    return (
      <div className="catalog-container">
        {/*
        <form>
          <label>
            Search by Asin:
            <input
              type="text"
              name="asin"
              onChange={(e) => {
                setAsin(e.target.value);
              }}
            />
          </label>
          <button onClick={handleGetOne}>Search</button>
        </form>
            */}
        <div className="table-container">
          <EnhancedTable
            columns={columns}
            data={data}
            setData={setData}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
        </div>
      </div>
    );
  }
};

export default Catalog;
