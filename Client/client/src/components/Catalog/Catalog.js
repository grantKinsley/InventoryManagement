import { useState, useContext, useEffect } from "react";
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

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

const Card = (props) => {
  // return (
  //   <div style={{ padding: 10 }}>
  //     {Object.keys(props.item).map((key) => (
  //       <div key={key}>
  //         {key !== "_id" && key !== "companyId"
  //           ? key + ": " + String(props.item[key])
  //           : ""}
  //       </div>
  //     ))}
  //   </div>
  // );
  // console.log(props.item)
  return (
    <div
      style={{
        padding: 10,
        margin: 10,
        border: "solid",
        borderRadius: 5,
        maxWidth: 1000,
      }}
    >
      <div className="card-info-container">
        <img src={placeholderImg} style={{ maxWidth: 50 }} />
        <div>
          <div style={{ fontSize: 20 }}>
            <b>{props.item["Product Title"]}</b>
          </div>
          <div>ASIN: {props.item.ASIN}</div>
        </div>
        <div>{props.item["Sellable On Hand Units"]}</div>
        {/* <div>Sales</div> */}
      </div>
    </div>
  );
};

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
);


const Catalog = () => {
  const [openAdd, setAddOpen] = useState(false);
  const [openDelete, setDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [asin, setAsin] = useState("");
  const [model, setModel] = useState("");
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);

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

  const downloadCSV = async (e) => {
    const accessToken = sessionStorage.getItem("serverToken");
    const reportURL = baseURL + "report";
    const response = await axios
      .get(reportURL, {
        responseType: "blob",
        headers: {
          Bearer: accessToken,
        }
      })
      .then((res) => {
        fileDownload(res.data, "fileName.CSV");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        <div className="top-elements">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Tooltip title="Download CSV">
            <IconButton onClick={downloadCSV}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete all data">
            <IconButton onClick={handleDeleteClickOpen}>
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
          <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete all company data?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={deleteCompanyData}>Delete data.</Button>
              <Button onClick={handleDeleteClose} autoFocus>
                No, take me back.
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Button variant="contained" onClick={handleAddClickOpen}> Add product + </Button>

        <Dialog open={openAdd} onClose={handleAddClose}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Test.
            </DialogContentText>
            <TextField
              required
              autoFocus
              id="name"
              label="ASIN"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddClose}>Add</Button>
          </DialogActions>
        </Dialog>

        <div className="scrollable-container">
          {data.map((datum) => {
            return <Card item={datum} key={datum.ASIN} />;
          })}
        </div>
      </div>
    );
  }
};

export default Catalog;
