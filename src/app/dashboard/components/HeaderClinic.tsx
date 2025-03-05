import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import {Logout} from "@mui/icons-material";

const HeaderClinic = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const clinicStore = localStorage.getItem('clinicStore');
    let clinic;
    if (clinicStore) {

        clinic = JSON.parse(clinicStore);
    } else {
        clinic = null;
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return `${date.toLocaleDateString('fa-IR')} - ${date.toLocaleTimeString('fa-IR')}`;
    };
    const handleLogout=()=>{
        localStorage.clear()
        window.location.reload()
    }
    return (

        <AppBar position="static" sx={{
            // width: 'calc(100% - 240px)',
            width:'100%',
            // ml: '240px',
            backgroundColor: '#002a32', color: '#fff', mb: 3 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1, }}>
                    <Typography  variant="h6">کلینیک {clinic?.clinicName}</Typography>
                    <Typography variant="subtitle1">مدیر: {clinic?.name + clinic?.family}</Typography>
                </Box>
                <Typography sx={{marginRight:2}} variant="subtitle2">{formatTime(currentTime)}</Typography>
                <Logout onClick={handleLogout}/>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderClinic;
