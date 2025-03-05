'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Paper, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Timeline from "@/app/dashboard/components/Timeline";
import CreateVisitModal from '@/app/dashboard/components/CreateVisitModal';
import { format, parseISO } from 'date-fns';
import api from '@/app/utils/api';
import { getClinicProperty } from '@/app/utils/helper';
import YearMonthDayPicker from '../../components/YearMonthDayPicker';
import DashboardLayout from '../../components/DashboardLayout';

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [visits, setVisits] = useState(null);
    const [viewSize, setViewSize] = useState('large'); // حالت پیش‌فرض: بزرگ

    const handleViewSizeChange = (event, newSize) => {
        if (newSize !== null) {
            setViewSize(newSize);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date); // مقدار تاریخ میلادی ذخیره می‌شود
    };

    const getVisits = async () => {
        const clinicId = getClinicProperty('id');
        const date = format(parseISO(selectedDate), 'yyyy-MM-dd');
        console.log('date', date);
        const res = await api.get(`/visits/${clinicId}/date/${date}`);
        console.log('rsaddsdses', res.data);
        const visits = res.data;
        setVisits(visits);
    };

    const handleDeleteVisit = useCallback(async (id) => {
        const userConfirmed = window.confirm("آیا مایل به حذف هستید؟");
        if (userConfirmed) {
            const res = await api.delete('/visit/' + id);
            if (res.status === 200) {
                alert('حذف با موفقیت انجام شد');
                getVisits(); // به‌روزرسانی لیست ویزیت‌ها پس از حذف
            }
        }
    }, []);

    useEffect(() => {
        if (selectedDate) {
            getVisits();
        }
    }, [selectedDate, open]);

    return (
        <DashboardLayout>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{width:'40%'}}>
                    <YearMonthDayPicker onDateChange={handleDateChange} />
                </Box>
                <Box display="flex" sx={{direction:'ltr'}} alignItems="center">
                    <ToggleButtonGroup
                        value={viewSize}
                        exclusive
                        onChange={handleViewSizeChange}
                        sx={{ mr: 2 }}
                    >
                        <ToggleButton value="large">بزرگ</ToggleButton>
                        <ToggleButton value="small">کوچک</ToggleButton>
                    </ToggleButtonGroup>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        افزودن
                    </Button>
                </Box>
            </Box>

            <Box display="flex" minHeight="90vh">
                <CreateVisitModal open={open} onClose={() => setOpen(false)} />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        height: '90vh',
                    }}
                >
                    <Paper sx={{ flex: 1 }}>
                        {visits && selectedDate ? (
                            <Timeline small={viewSize === 'small'} handleDeleteVisit={handleDeleteVisit} visits={visits} />
                        ) : (
                            <p>در حال دریافت اطلاعات...</p>
                        )}
                    </Paper>
                </Box>
            </Box>
        </DashboardLayout>
    );
};

export default Dashboard;
