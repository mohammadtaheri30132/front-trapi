'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete'; // اضافه‌شده
import api from '@/app/utils/api';
import { convertFarsiToEnglish, getClinicProperty } from '@/app/utils/helper';
import DashboardLayout from '@/app/dashboard/components/DashboardLayout';
import YearMonthDayPicker from '@/app/dashboard/components/YearMonthDayPicker';

const AddPatientPage = () => {
    const router = useRouter();
    const [birthDate, setBirthDate] = useState(null);
    const [visitDate, setVisitDate] = useState(null);
    const [therapists, setTherapists] = useState([]); // درمانگرها

    const [newPatient, setNewPatient] = useState({
        firstName: '',
        lastName: '',
        description: '',
        gender: '',
        initialDiagnosis: '',
        visitDate: '',
        address: '',
        phone: '',
        therapistId: '', // مقدار درمانگر
    });

    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                const clinicId = getClinicProperty('id');
                const response = await api.get(`/therapists/${clinicId}`);
                setTherapists(response.data); // درمانگرها بارگذاری می‌شوند
            } catch (error) {
                console.error('Error fetching therapists:', error);
            }
        };

        fetchTherapists();
    }, []);

    const handleDateChange = (date) => {
        setBirthDate(date); // مقدار تاریخ میلادی ذخیره می‌شود
    };

    const handleDateChange2 = (date) => {
        setVisitDate(date); // مقدار تاریخ میلادی ذخیره می‌شود
    };
    
    const handleAddPatient = async () => {
        const therapists =newPatient?.therapistId?[newPatient.therapistId.toString()]:null
        const gender= newPatient?.gender? newPatient?.gender.charAt(0)?.toUpperCase() + newPatient?.gender.slice(1) :null
        const phoneNumber= newPatient.phone ?convertFarsiToEnglish(newPatient.phone):null

        const data = {
            name: newPatient.firstName,
            lastName: newPatient.lastName,
            desc: newPatient.description,
            clinic: getClinicProperty('id'),
            birthDate,
            gender,
            visitDate,
            initialDiagnosis: newPatient.initialDiagnosis,
            address: newPatient.address,
            phoneNumber,
            therapists
        };
      
        try {
            const res = await api.post('/patient', data);
            if (res.status === 201) {
                alert('بیمار با موفقیت ایجاد شد');
                router.push('/dashboard/clinic/patients');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('مشکلی در ایجاد بیمار رخ داد');
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{ p: 3 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push('/dashboard/clinic/patients')}
                    sx={{ mb: 3 }}
                >
                    بازگشت
                </Button>

                <Typography variant="h5" sx={{ mb: 3 }}>
                    افزودن بیمار جدید
                </Typography>

                <Grid container spacing={2}>
                    {/* نام و نام خانوادگی */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="نام"
                            value={newPatient.firstName}
                            onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="نام خانوادگی"
                            value={newPatient.lastName}
                            onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                        />
                    </Grid>

                    {/* تاریخ تولد */}
                    <Grid item xs={12}>
                        <YearMonthDayPicker title="تاریخ تولد" onDateChange={handleDateChange} />
                    </Grid>

                    {/* جنسیت */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>جنسیت</InputLabel>
                            <Select
                                value={newPatient.gender}
                                
                                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                            >
                                <MenuItem value="Male">مذکر</MenuItem>
                                <MenuItem value="Female">مونث</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* شماره همراه و تشخیص اولیه */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="شماره همراه"
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="تشخیص اولیه"
                            value={newPatient.initialDiagnosis}
                            onChange={(e) => setNewPatient({ ...newPatient, initialDiagnosis: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={therapists}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`} // نمایش نام و نام خانوادگی درمانگر
                            onChange={(_, value) => setNewPatient({ ...newPatient, therapistId: value?._id || '' })}
                            renderInput={(params) => (
                                <TextField {...params} label="انتخاب درمانگر" fullWidth />
                            )}
                        />
                    </Grid>
                    {/* تاریخ مراجعه */}
                    <Grid item xs={12}>
                        <YearMonthDayPicker title="تاریخ مراجعه" onDateChange={handleDateChange2} />
                    </Grid>

                    {/* آدرس */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="آدرس"
                            value={newPatient.address}
                            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                        />
                    </Grid>

                    {/* توضیحات */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="توضیحات"
                            value={newPatient.description}
                            onChange={(e) => setNewPatient({ ...newPatient, description: e.target.value })}
                        />
                    </Grid>

                    {/* انتخاب درمانگر */}
                  
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleAddPatient}
                >
                    ثبت بیمار
                </Button>
            </Box>
        </DashboardLayout>
    );
};

export default AddPatientPage;
