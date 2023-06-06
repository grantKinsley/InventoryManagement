import React, { useState } from 'react'

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

const initialUser = {
  asin: '',
  modelName: '',
  sellingPrice: 0,
  cost: 0,
  subRows: undefined,
}

const AddProductDialog = props => {
  const [product, setProduct] = useState(initialUser)
  const { addProductHandler: addProductHandler } = props
  const [open, setOpen] = React.useState(false)

  const [switchState, setSwitchState] = React.useState({
    addMultiple: false,
  })

  const handleSwitchChange = name => event => {
    setSwitchState({ ...switchState, [name]: event.target.checked })
  }

  const resetSwitch = () => {
    setSwitchState({ addMultiple: false })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    resetSwitch()
  }

  const handleAdd = event => {
    addProductHandler(product)
    setProduct(initialUser)
    switchState.addMultiple ? setOpen(true) : setOpen(false)
  }

  const handleChange = name => ({ target: { value } }) => {
    setProduct({ ...product, [name]: value })
  }

  return (
    <div>
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Testing.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="ASIN"
            type="text"
            fullWidth
            value={product.firstName}
            onChange={handleChange('ASIN')}
          />
          <TextField
            margin="dense"
            label="Model Name"
            type="text"
            fullWidth
            value={product.lastName}
            onChange={handleChange('modelName')}
          />
          <TextField
            margin="dense"
            label="Selling Price"
            type="number"
            fullWidth
            value={product.age}
            onChange={handleChange('sellingPrice')}
          />
          <TextField
            margin="dense"
            label="Cost"
            type="number"
            fullWidth
            value={product.visits}
            onChange={handleChange('cost')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

AddProductDialog.propTypes = {
  addProductHandler: PropTypes.func.isRequired,
}

export default AddProductDialog
