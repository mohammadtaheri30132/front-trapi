'use client';

import React, { Suspense, useState } from 'react';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTherapistProperty } from '@/app/utils/helper';
import api from '@/app/utils/api';

const ReportAddPage = () => {
  return (
      <Suspense fallback={<p>در حال بارگذاری...</p>}>
          <CreateReport />
      </Suspense>
  );
};

const CreateReport = () => {
  const router = useRouter();
  const searchParams = useSearchParams();  // برای گرفتن پارامترها از URL

  // گرفتن patientId از URL
  const patientId = searchParams.get('patientId');  
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // این تابع برای ارسال داده به سرور است
  const handleSubmit = async (e) => {
    e.preventDefault();

    // گرفتن JWT از localStorage یا state
    const therapistId = getTherapistProperty('id')  // این ممکنه تغییر کنه بسته به روش ذخیره سازی شما
    if (!therapistId) {
      setError('درمانگر شناسایی نشده');
      return;
    }

    if (!reportText.trim()) {
      setError('متن گزارش الزامی است');
      return;
    }

    try {
      const response = await api.post(`/patients/${patientId}/reports`, {
        therapistId,
        patientId,
        reportText,
      },);
      if(response.status===201){

        setSuccess(true);
        setError('');
   
      } 
      } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال اطلاعات');
      setSuccess(false);
    }
  };

  // دکمه بازگشت
  const handleBack = () => {
    router.back(); // برگشت به صفحه قبلی
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        ایجاد گزارش
      </Typography>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="شناسه بیمار"
              variant="outlined"
              value={patientId || ''}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="متن گزارش"
              variant="outlined"
              multiline
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit} type="submit" variant="contained" color="primary" fullWidth>
              ارسال گزارش
            </Button>
          </Grid>
        </Grid>
      </div>

      {error && (
        <Typography variant="body2" color="error" mt={2}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" color="success" mt={2}>
          گزارش با موفقیت ارسال شد!
        </Typography>
      )}

      <Button onClick={handleBack} variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
        بازگشت
      </Button>
    </Container>

  );
};

export default ReportAddPage;
