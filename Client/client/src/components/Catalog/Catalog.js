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
import { Input, Card, CardContent, CardMedia, CardActionArea, Grid, Typography } from '@mui/material';

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


  if (sessionStorage.getItem("serverToken") === null) {
    return <Navigate to="/login" />;
  }

  if (fetched) {
    return (
      <div className="catalog-container">
        <div className="catalog-header">
          <SearchIcon />
          <Input placeholder="Search" />
        </div>
        <div className="catalog-card-container">
          <Grid container spacing={4}>
            {data.map((item) => {
              return (
                <Grid item xs>
                  <Card key={item["ASIN"]} className="catalog-card">
                    <CardActionArea>
                      <CardMedia className="catalog-card-media" image='https://cdn-icons-png.flaticon.com/512/3301/3301043.png' />
                      <CardContent className="catalog-card-content">
                        <Typography variant={"h6"}> {item["ASIN"]} </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>

    );
  }
};

export default Catalog;
