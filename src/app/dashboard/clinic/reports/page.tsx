"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { getClinicProperty } from '@/app/utils/helper';
import api from '@/app/utils/api';
import YearMonthDayPicker from '../../components/YearMonthDayPicker';
import DashboardLayout from '../../components/DashboardLayout';

const ClinicIncomeReport = () => {
  const clinicId = getClinicProperty('id');
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportByYear, setReportByYear] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportByDate, setReportByDate] = useState(null);
  useEffect(() => {
    if (activeTab === 0) fetchReportByYear();
  }, [activeTab, year]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchReportByYear = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clinic/report/income/${clinicId}`);
      setReportByYear(response.data);
    } catch (error) {
      console.error('Error fetching yearly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportByDate = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/clinic/report/by-date/${clinicId}`,
        {
          params: { startDate, endDate },
        }
      );
      setReportByDate(response.data);
    } catch (error) {
      console.error('Error fetching date range report:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFetchByDate = () => {
    fetchReportByDate();
  };

  // Handle Date Change for both startDate and endDate
  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else if (type === 'end') {
      setEndDate(date);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
<DashboardLayout>

    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        گزارش درآمد کلینیک
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} aria-label="income report tabs">
        {/* <Tab label="گزارش سال" /> */}
        <Tab label="گزارش بر اساس تاریخ" />
      </Tabs>

      {activeTab === 0 && (
        <Box mt={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>انتخاب سال</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {[...Array(5)].map((_, index) => (
                <MenuItem key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={3} mt={2}>
            {reportByYear?.months?.map((month, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{month.name}</Typography>
                    <Typography>
                      درآمد: {month.income.toLocaleString()} تومان
                    </Typography>
                    <Typography>
                      تعداد مراجعات: {month.visitsCount.toLocaleString()}
                    </Typography>
                    <Typography>
                      درصد افزایش درآمد: {month.incomeGrowth}%
                    </Typography>
                    <Typography>
                      درصد افزایش مراجعات: {month.visitGrowth}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box mt={4}>
          <Grid container spacing={2} alignItems="center" justifyContent='space-between'>
            <Grid item xs={4} sm={5}>
            <p>شروع تاریخ</p>

              <YearMonthDayPicker
                onDateChange={(date) => handleDateChange(date, 'start')}
                // selectedDate={startDate}
              />
            </Grid>
         
            <Grid item xs={4} sm={5}>
                <p>پایان تاریخ</p>
              <YearMonthDayPicker
                onDateChange={(date) => handleDateChange(date, 'end')}
                // selectedDate={endDate}
              />
            </Grid>
            <Grid item xs={4} sm={0}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFetchByDate}
                disabled={!startDate || !endDate}
              >
                دریافت گزارش
              </Button>
            </Grid>
          </Grid>

          {reportByDate && (
  <Box mt={4}>
    <Typography variant="h6" gutterBottom>
      گزارش درآمد بر اساس تاریخ
    </Typography>

    <Grid container spacing={3} mt={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                درآمد کل:
              </Typography>
              <Typography variant="body1">
                {reportByDate.totalIncome.toLocaleString()} تومان
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                درآمد کلینیک:
              </Typography>
              <Typography variant="body1">
                {reportByDate.clinicIncome.toLocaleString()} تومان
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                درآمد کل تراپیست‌ها:
              </Typography>
              <Typography variant="body1">
                {reportByDate.totalTherapistIncome.toLocaleString()} تومان
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                تعداد کل مراجعات:
              </Typography>
              <Typography variant="body1">
                {reportByDate.totalVisits.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Grid container spacing={3} mt={2}>
      {reportByDate.therapistDetails?.map((doctor, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{doctor.therapist}</Typography>
              <Typography>
                تعداد ویزیت‌ها: {doctor.visits}
              </Typography>
              <Typography>
                درآمد: {doctor.income.toLocaleString()} تومان
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
)}

        </Box>
      )}
    </Box>
</DashboardLayout>

  );
};

export default ClinicIncomeReport;
