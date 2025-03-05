'use client'
import React, { useState,useEffect } from 'react';
import jMoment from 'moment-jalaali';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { getClinicProperty } from '@/app/utils/helper';
import api from '@/app/utils/api';
import { Grid } from '@mui/system';
import YearMonthDayPicker from './YearMonthDayPicker';
import TimeSelector from './TimeSelector';
import { format,parseISO } from 'date-fns';

jMoment.loadPersian({ usePersianDigits: false });

const getCurrentJalaliDate = () => jMoment().format('jYYYY-jMM-jDD');

const CreateVisitModal = ({ open, onClose }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatient] = useState('');
  const [fee, setFee] = useState('');
  const [visit,setVisit]=useState({
    tpId:'',
    pId:'',
    percentage:''
  })
  const [paymentStatus, setPaymentStatus] = useState(true); // False = Unpaid, True = Paid
  const [attendanceStatus, setAttendanceStatus] = useState(true); // False = Absent, True = Present
  const [jalaliDate, setJalaliDate] = useState(getCurrentJalaliDate());
  const handleDateChange = (date) => {
    setSelectedDate(date); // مقدار تاریخ میلادی ذخیره می‌شود
  };

  useEffect(() => {
    const fetchTherapists = async () => {
        try {
            try{
              const clinicId = getClinicProperty('id');
              const response = await api.get(`/patients/${clinicId}`)
              const res = await api.get(`/therapists/${clinicId}`);
              console.log('tr',res.data)
              console.log('pa',response.data.data)
              setTherapists(res.data);
              setPatient(response.data.data);

            }catch(e){
              console.log("eroor")
              console.log(e)
            }
        } catch (error) {
        }
    };

    fetchTherapists();
}, [open]);
  const handleSubmit = async() => {
    try {
     
      // تبدیل تاریخ شمسی به میلادی
      console.log(visit)
      const clinicId = getClinicProperty('id');
      const end_time=new Date(endTime)
      const start_time=new Date(startTime)
      const end = format(end_time, 'HH:mm'); 
      const start = format(start_time, 'HH:mm'); 
      const visitData = {
        clinic:clinicId,
        doctor:visit.tpId,
        percentage:visit?.percentage,
        patient:visit.pId,
        visitDate:format(parseISO(selectedDate), 'yyyy-MM-dd'),
        startTime:start,
        endTime:end,
        fee: Number(fee),
        paymentStatus: paymentStatus ? 'Paid' : 'Unpaid',
        attendanceStatus: attendanceStatus ? 'Present' : 'Absent',
      };

      const res=await api.post('/visit',visitData)
      if(res.status===201){
          alert('ویزیت ساخته شد')
      }
      onClose();
    } catch (error) {
      if(error?.response?.status===400){
          alert(error.response.data.message)
      }else{
          alert('مشکلی رخ داده است')
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ایجاد ویزیت جدید</DialogTitle>
      <DialogContent>
      <Grid item xs={12}>
      <Autocomplete
                                options={therapists}
                                getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`} // نمایش نام و نام خانوادگی
                                onChange={( _,value) =>
                                  {
                                    console.log('va ' ,value)
                                    setVisit({ ...visit, percentage:value?.percentage, tpId: value?._id || '' })
                                  }
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="انتخاب درمانگر" fullWidth />
                                )}
                            />
      </Grid>
      <Grid item xs={12} sx={{
        marginTop:2
      }}>

          <Autocomplete
                                options={patients}
                                getOptionLabel={(option) => `${option?.name} ${option?.lastName}`} // نمایش نام و نام خانوادگی
                                onChange={( _,value) =>
                                  
                                    setVisit({ ...visit,  pId: value?._id || '' })
                                  
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="انتخاب بیمار" fullWidth />
                                )}
                            />
                            </Grid>

       <YearMonthDayPicker onDateChange={handleDateChange}/>
        <Grid sx={{display:'flex' ,justifyContent:'space-between'}}>
        <TimeSelector title='زمان شروع' setSelectedTime={setStartTime} selectedTime={startTime}/>
        <TimeSelector title='زمان پایان' setSelectedTime={setEndTime} selectedTime={endTime}/>
        </Grid>
    
        <TextField
          label="مبلغ"
          fullWidth
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.checked)}
            />
          }
          label={paymentStatus ? 'پرداخت شده' : 'پرداخت نشده'}
        />
        <FormControlLabel
          control={
            <Switch
              checked={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.checked)}
            />
          }
          label={attendanceStatus ? 'حاضر' : 'غایب'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          لغو
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          ارسال
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVisitModal;
