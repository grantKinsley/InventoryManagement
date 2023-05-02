import React from "react";
import Papa from "papaparse";
import axios from "axios";
import "./Upload.css"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NumbersIcon from '@mui/icons-material/Numbers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Button } from '@mui/material';
import ImportCatalogDialog from './Dialogs/ImportCatalogDialog';
import ImportPricingDialog from './Dialogs/ImportPricingDialog';
import ImportSalesDialog from './Dialogs/ImportSalesDialog';
import ImportInventoryDialog from './Dialogs/ImportInventoryDialog';



const baseURL = "http://localhost:8000/amz_items/";

const Upload = () => {

  const [openImportCatalog, setImportCatalog] = React.useState(false);
  const [openImportPricing, setImportPricing] = React.useState(false);
  const [openImportSales, setImportSales] = React.useState(false);
  const [openImportInventory, setImportInventory] = React.useState(false);

  const handleImportCatalogClickOpen = () => {
    console.log("Open");
    setImportCatalog(true);
  };

  const handleImportCatalogClose = () => {
    setImportCatalog(false);
  };

  const handleImportPricingClickOpen = () => {
    console.log("Open");
    setImportPricing(true);
  };

  const handleImportPricingClose = () => {
    setImportPricing(false);
  };

  const handleImportSalesClickOpen = () => {
    console.log("Open");
    setImportSales(true);
  };

  const handleImportSalesClose = () => {
    setImportSales(false);
  };

  const handleImportInventoryClickOpen = () => {
    console.log("Open");
    setImportInventory(true);
  };

  const handleImportInventoryClose = () => {
    setImportInventory(false);
  };


  return (
    <div className="container">
      <h2 className="title">
        Amazon Imports
      </h2>
      <div className="button-container">
        <Button variant="contained" className="img-button" onClick={handleImportCatalogClickOpen}>
          <AddCircleIcon className="icon"/>
          <span> Import Catalog </span>
        </Button>
        <Button variant="contained" className="img-button" onClick={handleImportPricingClickOpen}>
          <NumbersIcon className="icon"/>
          <span> Import Pricing </span>
        </Button>
        <Button variant="contained" className="img-button" onClick={handleImportSalesClickOpen}>
          <MonetizationOnIcon className="icon"/>
          <span> Import Sales </span>
        </Button>
        <Button variant="contained" className="img-button" onClick={handleImportInventoryClickOpen}>
          <InventoryIcon className="icon"/>
          <span> Import Inventory </span>
        </Button>
      </div>
      <ImportCatalogDialog open={openImportCatalog} handleClose={handleImportCatalogClose}/>
      <ImportPricingDialog open={openImportPricing} handleClose={handleImportPricingClose}/>
      <ImportSalesDialog open={openImportSales} handleClose={handleImportSalesClose}/>
      <ImportInventoryDialog open={openImportInventory} handleClose={handleImportInventoryClose}/>
    </div>
  );
};

export default Upload;
