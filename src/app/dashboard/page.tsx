'use client';

import React,{useCallback, useEffect, useState} from 'react';
import { Box, Typography, Paper ,Button} from '@mui/material';
import SidebarAndNavigation from './components/SidebarAndNavigation';
import Timeline from "@/app/dashboard/components/Timeline";
import CreateVisitModal from '@/app/dashboard/components/CreateVisitModal'
import api from '../utils/api';
import { getClinicProperty } from '../utils/helper';
import YearMonthDayPicker from './components/YearMonthDayPicker';
import { format, parseISO } from 'date-fns';
const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [visits, setVisits] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date); // مقدار تاریخ میلادی ذخیره می‌شود
      };
    const getVisits=async()=>{
        const clinicId = getClinicProperty('id');
        const date =format(parseISO(selectedDate), 'yyyy-MM-dd')
        console.log('date',date)
        const res = await api.get(`/visits/${clinicId}/date/${date}`);
        console.log('rsaddsdses',res.data)
        // داده‌های دریافت‌شده
        const visits = res.data;
        setVisits(visits)
    
    }  
    const handleDeleteVisit=useCallback(async(id)=>{
        const userConfirmed = window.confirm("آیا مایل به حذف هستید؟");
        if (userConfirmed) {
          const res = await api.delete('/visit/'+id)
          if(res.status===200){
            alert('حذف با موفقیت انجام شد')
          }
        } 
    },[])
    useEffect(()=>{
        if(selectedDate){
            getVisits()
        }
    },[selectedDate,open])
    return (
        <Box display="flex" minHeight="90vh">
            {/* سایدبار و باتم نویگیشن */}
            <CreateVisitModal open={open} onClose={()=>setOpen(false)}/>
                <Box
                component="main"
                sx={{
                    flex: 1,
                    height:'90vh',
                    // padding: 2,
                    // marginRight: { xs: 0, sm: '240px' }, // در موبایل سایدبار مخفی می‌شود
                }}
            >
                <Paper sx={{ padding: 2,flex:1 }}>
                
                    <YearMonthDayPicker onDateChange={handleDateChange}/>

                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        افزودن
                    </Button>
                    {visits && selectedDate ?(
                        <Timeline handleDeleteVisit={handleDeleteVisit} visits={visits}/>
                    ):(
                        <p>در حال دریافت اطلاعات...</p>
                    )}
                    {/*<Box*/}
                    {/*    component="main"*/}
                    {/*    sx={{*/}
                    {/*        height:'80vh'*/}
                    {/*        // padding: 2,*/}
                    {/*        // marginRight: { xs: 0, sm: '240px' }, // در موبایل سایدبار مخفی می‌شود*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*</Box>*/}
                    {/* محتوای اصلی داشبورد */}
                </Paper>
            </Box>
            
            <SidebarAndNavigation />

        </Box>
    );
};

export default Dashboard;
