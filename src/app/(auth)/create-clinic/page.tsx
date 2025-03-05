'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, useMediaQuery } from '@mui/material';
import api from "@/app/utils/api";
// import jwt_decode from 'jwt-decode';

const CreateClinicPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [name, setName] = useState('');
    const [family, setFamily] = useState('');
    const [address, setAdress] = useState('');
    const isMobile = useMediaQuery('(max-width:600px)');

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleLogin = async () => {
        if (isFormValid) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('clinicName', clinicName);
            formData.append('name', name);
            formData.append('family', family);
            formData.append('address', address);

            try {
                const res = await api.post('/clinic', formData);
                if(res.status===201){
                    alert('کلینیک با موفقیت ساخته شد!')
                    window.location.href = '/login';

                }

            } catch (error) {
                console.error('Login error:', error);
                // مدیریت خطاها (مثلاً نمایش پیام خطا)
            }
        }
    };
    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
            }}
        >
            <Box
                sx={{
                    width: isMobile ? '100%' : '600px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >

                <Box
                    sx={{
                        flex: 1,
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            marginBottom: '3rem',
                            textAlign: 'center',
                            color: '#002a32',
                        }}
                    >
                        ثبت کینیک
                    </Typography>
                    <TextField
                        label="نام کاربری کلینیک"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="نام کلینیک"
                        variant="outlined"
                        fullWidth
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="رمز عبور کلینیک "
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginBottom: '1.5rem' }}
                    />
                    <TextField
                        label="نام مدیر"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: '1.5rem' }}
                    />
                    <TextField
                        label="نام خانوادگی مدیر"
                        variant="outlined"
                        fullWidth
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}
                        sx={{ marginBottom: '1.5rem' }}
                    />
                    <TextField
                        label="آدرس"
                        variant="outlined"
                        fullWidth
                        value={address}
                        onChange={(e) => setAdress(e.target.value)}
                        sx={{ marginBottom: '1.5rem' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isFormValid}
                        onClick={handleLogin}
                        fullWidth
                        sx={{
                            padding: '0.8rem',
                            borderRadius: '8px',
                        }}
                    >
                        ورود
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export default CreateClinicPage;
