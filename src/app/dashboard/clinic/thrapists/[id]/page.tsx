"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from "@/app/utils/api";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, Card, CardContent, Divider } from '@mui/material';
import DashboardLayout from '@/app/dashboard/components/DashboardLayout';
import moment from 'moment-jalaali';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import PercentIcon from '@mui/icons-material/Percent';

const TherapistDashboard = () => {
    const params = useParams();
    const therapistId=params.id

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (therapistId) {
            const fetchData = async () => {
                try {
                    const response = await api.get(`/therapist/${therapistId}`);
                    setData(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [therapistId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return <Typography variant="h6" color="error">خطا در بارگذاری اطلاعات!</Typography>;
    }

    return (
        <DashboardLayout>
            <Box sx={{
                margin: '0 auto', 
            }}>
                {/* اطلاعات تراپیست */}
                <Grid container >
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                اطلاعات تراپیست
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Box display="flex" alignItems="center">
                                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="body1">
                                            نام: {data.therapist.firstName} {data.therapist.lastName}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box display="flex" alignItems="center">
                                        <WorkIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="body1">
                                            تخصص: {data.therapist.specialization}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box display="flex" alignItems="center">
                                        <PercentIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="body1">
                                            درصد سهم: {data.therapist.percentage}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                    {/* درآمد ماهانه */}
                    <Grid item xs={12} sx={{marginTop:4,marginBottom:3,}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>درآمد ماهانه</Typography>
                                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>ماه</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>درآمد (تومان)</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>تعداد ویزیت‌ها</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(data.incomeByMonth).map((month) => (
                                                <TableRow key={month} hover>
                                                    <TableCell align="center">{month}</TableCell>
                                                    <TableCell align="center">
                                                        {data.incomeByMonth[month].totalIncome.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {data.incomeByMonth[month].visitCount}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* جدول ویزیت‌ها */}
                    <Grid item xs={12}>
                        <Typography variant="h6">لیست ویزیت‌ها</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>بیمار ویزیت شده</TableCell>
                                        <TableCell>تاریخ ویزیت</TableCell>
                                        <TableCell>هزینه ویزیت (تومان)</TableCell>
                                        <TableCell>سهم تراپیست (تومان)</TableCell>
                                        <TableCell>وضعیت پرداخت</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.visits.map((visit) => (
                                        <TableRow key={visit.id}>
                                             <TableCell>{visit?.patient?.name}</TableCell>
                                            <TableCell>{visit.visitDate}</TableCell>
                                            <TableCell>{visit.fee.toLocaleString()}</TableCell>
                                            <TableCell>{visit.therapistShare.toLocaleString()}</TableCell>
                                            <TableCell>{visit.paymentStatus === 'Paid' ? 'پرداخت شده' : 'پرداخت نشده'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* جدول بیماران */}
                    <Grid item xs={12} sx={{marginTop:5}}>
                        <Typography variant="h6">بیماران تحت نظر</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>نام بیمار</TableCell>
                                        <TableCell>شماره تماس</TableCell>
                                        <TableCell>آدرس</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.patients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>{patient.name}</TableCell>
                                            <TableCell>{patient.phoneNumber}</TableCell>
                                            <TableCell>{patient.address}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                              {/* جدول گزارش‌های ثبت شده تراپیست */}
                              <Grid item xs={12} sx={{ marginTop: 5 }}>
                        <Typography variant="h6">گزارش‌های ثبت شده تراپیست</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">نام بیمار</TableCell>
                                        <TableCell align="center">تاریخ ثبت گزارش</TableCell>
                                        <TableCell align="center">متن گزارش</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell align="center">{report.patient.name}</TableCell>
                                            <TableCell align="center">
                                                {moment(report.createdAt).format('jYYYY/jMM/jDD')}
                                            </TableCell>
                                            <TableCell align="center">{report.reportText}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
};

export default TherapistDashboard;
