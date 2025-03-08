'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, useMediaQuery } from '@mui/material';
import api from "@/app/utils/api";
// import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

const TherapistPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isMobile = useMediaQuery('(max-width:600px)'); // بررسی ریسپانسیو

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleLogin = async () => {
        if (isFormValid) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            try {
                const res = await api.post('/therapist/login', formData);
                if(res.status===200){
                    const token = res.data.token;
                    Cookies.set('token', token)
                    Cookies.set('therapist', JSON.stringify(res.data.therapist))
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}` 
                    console.log('res.data.therapist',res.data.therapist)
                    localStorage.setItem('token', token);
                    window.location.href = '/dashboard/therapist';
                  
                    // window.location.href = '/dashboard'
                }else{
                    alert('رمز عبور صحیح نمیباشد')
                }
                // // ذخیره توکن
                // ;
                //
                // // دیکد کردن توکن JWT برای استخراج اطلاعات (مانند role)
                // // const decodedToken = jwt_decode(token);
                // const role = decodedToken.role; // فرض کنید نقش در توکن به نام 'role' ذخیره شده است
                //
                // // ذخیره نقش کاربر
                // localStorage.setItem('userRole', role);
                //
                // // هدایت کاربر بر اساس نقش
                // if (role === 'superadmin') {
                //     window.location.href = '/clinics-superadmin'; // صفحه مربوط به superadmin
                // } else if (role === 'clinic') {
                //     window.location.href = '/main-clinic'; // صفحه مربوط به clinic
                // } else {
                //     window.location.href = '/exercises'; // پیش‌فرض یا صفحه دیگری
                // }
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
                        ورود به سیستم
                    </Typography>
                    <TextField
                        label="نام کاربری"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="رمز عبور"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

export default TherapistPage;
