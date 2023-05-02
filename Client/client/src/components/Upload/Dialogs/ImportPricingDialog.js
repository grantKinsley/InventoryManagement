import React from "react";
import Papa from "papaparse";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const baseURL = "http://localhost:8000/amz_items/";

const ImportPricingDialog = (props) => {
    const [file, setFile] = React.useState(null);

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            // handleFiles(e.target.files[0]);
            const inputFile = e.target.files[0];
            setFile(inputFile);
        }
    };

    // triggers the input when the button is clicked
    const handleUpload = () => {
        if (!file) {
            window.alert("Enter a valid file");
            return;
        }
        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            try {
                // Read CSV using PAPA library
                const csv = Papa.parse(target.result, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                });
                const parsedData = csv?.data;
                console.log(parsedData);

                // Send JSON to Backend API

                const accessToken = sessionStorage.getItem("serverToken");
                const response = await axios.post(baseURL, JSON.stringify(parsedData), {
                    headers: { "Content-Type": "application/json", Bearer: accessToken },
                });
                console.log(response);
                window.alert(`Success: ${response.data["Success"]}`);
                props.handleClose();
                
            } catch (err) {
                console.log(err);
                window.alert(err);
                props.handleClose();
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> Import Pricing </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Import Amazon Pricing Info .csv
                    </DialogContentText>
                    <input onChange={handleChange} type="file" />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpload}>Upload File</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default ImportPricingDialog