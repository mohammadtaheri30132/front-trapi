'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import TherapistLayout from '../components/TherapistLayout';
import api from '@/app/utils/api';
import Cookies from 'js-cookie';
import Link from 'next/link';

// کامپوننت اصلی برای نمایش بیماران
const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const therapis= Cookies.get("therapist")
        const therapistId= JSON.parse(therapis).id

        console.log('therapistId', therapistId)
        const response = await api.get(`/therapists/${therapistId}/patients`);
        console.log('response' , response)
        setPatients(response.data);
      } catch (err) {
        console.log('response',err)
        setError(err.response?.data?.message || 'خطایی رخ داده است.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <TherapistLayout>
         <Box
      sx={{
       
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        لیست بیماران
      </Typography>

      {patients.map((patient,index) => (
      <Link key={index} href={`/dashboard/therapist/reports/add?patientId=${patient.patient._id}`}>
        <Card key={patient._id} sx={{ mb: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {patient.patient.name} {patient.patient.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              توضیحات: {patient.patient.desc}
            </Typography>
          
          </CardContent>
        </Card>
        </Link>

      ))}

      {patients.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          هیچ بیماری مرتبط یافت نشد.
        </Typography>
      )}
    </Box>
    </TherapistLayout>
  );
};

export default PatientsList;
