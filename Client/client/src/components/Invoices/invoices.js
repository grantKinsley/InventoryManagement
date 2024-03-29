import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { Button, Typography, Input, Paper, Divider } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import styles from "./invoices.module.css";
import { invoiceExample } from "./invoices_ex";
import { PageItem } from "react-bootstrap";

import LoadingSpinner from "../LoadingSpinner/spinner"

const Invoices = () => {

    const [invoiceList, setInvoiceList] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState({});
    const [loading, setLoading] = useState(false);

    // Temporary
    useEffect(() => {
        console.log(currentInvoice);
        setInvoiceList(invoiceExample);
        console.log(currentInvoice);
    }, [])

    const invoiceOnClick = function (e) {
        console.log(e);
        setCurrentInvoice(e);
        setShowInvoice(true);
    }

    if (sessionStorage.getItem("serverToken") === null) {
        return <Navigate to="/login" />;
    }

    const validate = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Test 1: Totals add up correctly
        console.log(currentInvoice.invoiceTotal.amount);
        console.log(currentInvoice.items);
        var sum = 0;
        for (const i of currentInvoice.items) {
            console.log(i.netCost);
            sum += (i.netCost.amount * i.invoicedQuantity.amount);
        }
        if (currentInvoice.invoiceTotal.amount == sum) {
            alert("Correct");
        } else {
            alert("Incorrect | Difference of $" + (currentInvoice.invoiceTotal.amount - sum));
        }
        setLoading(false);
    }

    return (
        <div className={styles.invoices_container}>
            <div className={styles.sidenav}>
                <Typography variant={"h6"}> Invoices </Typography>
                <div>
                    <SearchIcon />
                    <Input placeholder="Search" />
                </div>
                {invoiceList.map(item => {
                    return <Button variant="outlined" key={item.id} currentTarget={item.id} className={styles.sideitem} onClick={() => invoiceOnClick(item)}>
                        <Typography className={styles.linkText}>ID# {item.id} --- ${item.invoiceTotal.amount} </Typography>
                    </Button>
                })}
            </div>
            
            <div className={styles.sub_container} style={showInvoice ? {} : { display: 'none' }}>
            <Paper className={styles.invoice_paper}
                elevation={3}>
                
                <LoadingSpinner loading={loading} />
                <Typography className={styles.invoice_title} variant="h2">Invoice</Typography>
                <div className={styles.invoice_header}>
                    <Typography className={styles.invoice_number} variant="h6"> No.{currentInvoice.id}</Typography>
                    <Typography className={styles.invoice_date}> Date: {currentInvoice.date} </Typography>
                </div>
                <hr className={styles.hr}/>
                <Typography variant="h6">Product Breakdown</Typography>
                <div className={styles.invoice_items}>
                    {currentInvoice.items?.map(item => {
                        return <Typography> {item.itemSequenceNumber}: Product: {item.amazonProductIdentifier} / Qty: {item.invoicedQuantity?.amount} / Net Cost: ${item.netCost?.amount} / Total: ${item.invoicedQuantity?.amount * item.netCost?.amount}</Typography>
                    })}
                </div>
                <hr className={styles.hr}/>
                <Typography className={styles.invoice_details} variant="h6"> Total Payable Amount: ${currentInvoice.invoiceTotal?.amount}</Typography>
                
                <Button className={styles.validateBtn} variant="contained" onClick={validate}> Validate </Button>
                </Paper>
            </div>
            
        </div>
    )
}

export default Invoices;