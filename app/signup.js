'use client'

import { useState } from 'react';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with username
            await updateProfile(user, { displayName: username });

            // Handle success (e.g., redirect to login or home page)
            console.log('User signed up successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box width="400px" p={4} borderRadius="8px" boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)" bgcolor="white">
                <Typography variant="h5" mb={2}>Sign Up</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                    sx={{ mt: 2, backgroundColor: '#6b8e23', '&:hover': { backgroundColor: '#556b2f' } }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
}
