import React from 'react'

import AddProductDialog from './AddProductDialog'
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete'
import GlobalFilter from './GlobalFilter'
import IconButton from '@mui/material/IconButton'
import { lighten, styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import DownloadIcon from '@mui/icons-material/Download';

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

const TitleTypography = styled('Typography')({
    flex: '1 1 100%',
});

const useToolbarStyles = styled(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
}))

const TableToolbar = props => {
    const {
        numSelected,
        addProductHandler,
        deleteProductHandler,
        preGlobalFilteredRows,
        setGlobalFilter,
        globalFilter,
    } = props

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

    return (
        <Toolbar>
            <AddProductDialog addProductHandler={addProductHandler} />
            {numSelected > 0 ? (
                <TitleTypography
                    color="inherit"
                    variant="subtitle1"
                >
                    {numSelected} selected
                </TitleTypography>
            ) : (
                <TitleTypography variant="h6" id="tableTitle">
                    
                </TitleTypography>
            )}
            <Tooltip title="Download CSV">
                <IconButton onClick={downloadCSV}>
                    <DownloadIcon />
                </IconButton>
            </Tooltip>
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={deleteProductHandler}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}
        </Toolbar>
    )
}

TableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    addProductHandler: PropTypes.func.isRequired,
    deleteProductHandler: PropTypes.func.isRequired,
    setGlobalFilter: PropTypes.func.isRequired,
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string.isRequired,
}

export default TableToolbar
