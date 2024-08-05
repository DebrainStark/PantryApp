'use client'

import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { collection, getDocs, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  p: 4,
  gap: 3,
}

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async () => {
    if (itemName && itemQuantity) {
      await setDoc(doc(firestore, 'pantry', itemName), { name: itemName, quantity: itemQuantity });
      setItemName('');
      setItemQuantity('');
      setSnackbarMessage('Item added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      updatePantry();
      handleClose();
    }
  };

  const removeItem = async (itemId) => {
    await deleteDoc(doc(firestore, 'pantry', itemId));
    setSnackbarMessage('Item removed successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      p={2}
      gap={2}
    >
      <Box
        width="100%"
        bgcolor="#ADD8E6"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        boxShadow={3}
      >
        <Typography
          variant="h3"
          color="#333"
          textAlign="center"
        >
          PANTRY ITEMS
        </Typography>
      </Box>

      <Box width="100%" display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Item</Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="parent-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField 
            id="outlined-basic" 
            label="Item" 
            variant="outlined" 
            fullWidth 
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField 
            id="outlined-basic" 
            label="Quantity" 
            variant="outlined" 
            fullWidth 
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
          />
          <Button variant="outlined" onClick={addItem}>Add</Button>
        </Box>
      </Modal>

      <Box border="1px solid #123" width="100%" p={2} overflow="auto">
        <Stack width="100%" spacing={2} sx={{ overflow: 'auto' }}>
          {pantry.map((item) => (
            <Box
              key={item.id}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              p={2}
              boxShadow={1}
              borderRadius={2}
            >
              <Typography
                variant="h6"
                color="#333"
                fontWeight="lighter"
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}: {item.quantity}
              </Typography>
              <IconButton color="error" onClick={() => removeItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
