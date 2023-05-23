import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import Button from '@mui/material/Button';

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
                <span className={styles.sidenav_title}> Invoices </span>
                {invoiceList.map(item => {
                    return <Button key={item.id} currentTarget={item.id} className={styles.sideitem} onClick={() => invoiceOnClick(item)}>
                        <span className={styles.linkText}>ID# {item.id} --- ${item.invoiceTotal.amount} </span>
                    </Button>
                })}
            </div>
            <div className={styles.sub_container} style={showInvoice ? {} : { display: 'none' }}>
                <Button variant="contained" onClick={validate}> Validate </Button>
                <LoadingSpinner loading={loading}/>
                <div className={styles.invoice_header}>
                    <h2 className={styles.invoice_title}> Invoice #{currentInvoice.id}</h2>
                    <span className={styles.invoice_date}> {currentInvoice.date} </span>
                </div>

                <p className={styles.invoice_details}> Total Payable Amount | ${currentInvoice.invoiceTotal?.amount} </p>

                <div className={styles.invoice_items}>
                    {currentInvoice.items?.map(item => {
                        return <span> {item.itemSequenceNumber}: Product: {item.amazonProductIdentifier} / Qty: {item.invoicedQuantity?.amount} / Net Cost: ${item.netCost?.amount} / Total: ${item.invoicedQuantity?.amount * item.netCost?.amount}</span>
                    })}
                </div>

            </div>
        </div>
    )
}

export default Invoices;