'use client'

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, IconButton, InputAdornment, Fade } from '@mui/material';
import { collection, getDocs, setDoc, deleteDoc, getDoc, query, doc } from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";

const backgroundImage = 'https://parr.durasupreme.com/wp-content/uploads/2022/07/SEIG01_HuntleyKitchen-1.jpg';

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [filter, setFilter] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);

    const updateInventory = async () => {
        try {
            const snapshot = query(collection(firestore, 'inventory'));
            const docs = await getDocs(snapshot);
            const inventoryList = [];
            docs.forEach((doc) => {
                inventoryList.push({
                    name: doc.id,
                    ...doc.data(),
                });
            });
            setInventory(inventoryList);
            setFilteredInventory(inventoryList);
        } catch (error) {
            console.log("Error updating inventory: ", error);
        }
    };

    const addItem = async (item) => {
        try {
            const docRef = doc(collection(firestore, 'inventory'), item);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                await setDoc(docRef, { quantity: quantity + 1 });
            } else {
                await setDoc(docRef, { quantity: 1 });
            }
            await updateInventory();
        } catch (error) {
            console.log("Error adding item: ", error);
        }
    };

    const removeItem = async (item) => {
        try {
            const docRef = doc(collection(firestore, 'inventory'), item);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                if (quantity === 1) {
                    await deleteDoc(docRef);
                } else {
                    await setDoc(docRef, { quantity: quantity - 1 });
                }
            }
            await updateInventory();
        } catch (error) {
            console.log('Error removing item: ', error);
        }
    };

    useEffect(() => {
        updateInventory();
    }, []);

    useEffect(() => {
        setFilteredInventory(
            inventory.filter(item => 
                item.name.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [filter, inventory]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box 
            width="100vw" 
            height="100vh" 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center"
            gap={2}
            padding={2}
            sx={{ 
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                color: '#333'
            }}
        > 
            <Modal open={open} onClose={handleClose}>
                <Fade in={open}>
                    <Box
                        position="absolute" 
                        top="50%" 
                        left="50%" 
                        width={350}
                        bgcolor="white"
                        border="2px solid #8e8e8e"
                        boxShadow={24}
                        p={3}
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        sx={{ 
                            transform: "translate(-50%, -50%)"
                        }}
                    > 
                        <Typography variant="h6" color="#333">Add Item</Typography>
                        <Stack width="100%" direction="row" spacing={1}>
                            <TextField 
                                variant="outlined"
                                fullWidth
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                sx={{ 
                                    borderColor: '#8e8e8e'
                                }}
                            /> 
                            <Button 
                                variant="contained"
                                onClick={() => {
                                    addItem(itemName);
                                    setItemName('');
                                    handleClose();
                                }}
                                sx={{ backgroundColor: '#6b8e23', '&:hover': { backgroundColor: '#556b2f' } }}
                            >
                                Add 
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
            <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#6b8e23', '&:hover': { backgroundColor: '#556b2f' } }}>
                Add New Item
            </Button>
            <Box 
                border="1px solid #8e8e8e"
                bgcolor="#d8cfc4"
                width="700px"
                borderRadius="8px"
                padding={1}
                sx={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Box 
                    width="100%"
                    height="80px" 
                    bgcolor="#f5f5dc" 
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                    sx={{
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Typography variant="h4" color="#4e3a27" sx={{ fontFamily: 'Playfair Display, serif' }}>
                        Pantry Tracker
                    </Typography>
                </Box>
                <TextField 
                    variant="outlined"
                    placeholder="Search items..."
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ 
                        margin: 1, 
                        borderColor: '#8e8e8e',
                        transition: 'border-color 0.3s ease',
                        '&:hover': {
                            borderColor: '#6b8e23'
                        }
                    }}
                />
                <Stack 
                    height="300px"
                    spacing={1}
                    overflow="auto"
                >
                    {filteredInventory.map(({ name, quantity }) => (
                        <Box 
                            key={name}
                            width="100%"
                            minHeight="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            bgcolor="#f0f0f0" 
                            padding={2}
                            border="1px solid #ccc"
                            borderRadius="8px"
                            sx={{
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <Typography variant="h6" color="#333"> 
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Typography>
                            <Typography variant="h6" color="#333"> 
                                {quantity}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" onClick={() => addItem(name)} sx={{ backgroundColor: '#6b8e23', '&:hover': { backgroundColor: '#556b2f' } }}> 
                                    Add 
                                </Button>
                                <Button variant="contained" onClick={() => removeItem(name)} sx={{ backgroundColor: '#d9534f', '&:hover': { backgroundColor: '#c9302c' } }}> 
                                    Remove  
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
