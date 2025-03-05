import { Grid } from '@mui/system';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';

const TimeSelector = ({ title, setSelectedTime, selectedTime }) => {
  // مقدار پیش‌فرض ساعت 9 صبح
  const defaultTime = moment().set({ hour: 9, minute: 0, second: 0 });

  // تابع برای محدود کردن انتخاب ساعت بین 7 صبح تا 11 شب
  const handleChange = (newValue) => {
    if (newValue && newValue.isBetween(moment().set({ hour: 7, minute: 0 }), moment().set({ hour: 23, minute: 0 }), null, '[)')) {
      setSelectedTime(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <TimePicker
            label={title}
            value={selectedTime || defaultTime} // مقدار پیش‌فرض ساعت 9 صبح
            onChange={handleChange}
            renderInput={(params) => <TextField label={title} {...params} />}
            minTime={moment().set({ hour: 7, minute: 0 })}  // ساعت شروع 7 صبح
            maxTime={moment().set({ hour: 23, minute: 0 })}  // ساعت پایان 11 شب
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default TimeSelector;
