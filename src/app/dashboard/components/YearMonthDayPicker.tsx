'use client'
import React, { useState, useEffect } from "react";
import { Grid, Autocomplete, TextField } from "@mui/material";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const YearMonthDayPicker = ({ onDateChange,title }) => {
  const currentYear = moment().jYear();
  const currentMonth = moment().jMonth();
  const currentDay = moment().jDate();

  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);

  const getDaysInMonth = (year, monthIndex) => {
    const daysInMonth = moment.jDaysInMonth(year, monthIndex + 1);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const [days, setDays] = useState(getDaysInMonth(year, month));

  useEffect(() => {
    setDays(getDaysInMonth(year, month));
    setDay(currentDay);
  }, [year, month]);

  useEffect(() => {
    // وقتی مقدار تاریخ تغییر می‌کند، آن را به میلادی تبدیل کرده و به پدر ارسال می‌کنیم.
    const convertedDate = moment(`${year}-${month + 1}-${day}`, 'jYYYY-jM-jD').format('YYYY-MM-DD');
    if (onDateChange) {
      onDateChange(convertedDate); // ارسال تاریخ میلادی به پدر
    }
  }, [year, month, day, onDateChange]);

  return (
    <Grid container spacing={2} sx={{ display: "flex",position:'relative', marginTop: 1, justifyContent: "space-between" }}>
      {/* انتخاب سال */}
      {title&&(
      <p style={{position:'absolute',right:0,top:-10,color:'gray'}} >{title}</p>

      )}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={Array.from({ length: 10 }, (_, i) => currentYear + i)}
          value={year}
          onChange={(event, newValue) => setYear(newValue)}
          getOptionLabel={(option) => `${option}`} // تبدیل به رشته
          renderInput={(params) => <TextField {...params} label="سال" />}
        />
      </Grid>

      {/* انتخاب ماه */}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={months}
          value={months[month]}
          onChange={(event, newValue) => setMonth(months.indexOf(newValue))}
          getOptionLabel={(option) => `${option}`} // تبدیل به رشته (برای اطمینان)
          renderInput={(params) => <TextField {...params} label="ماه" />}
        />
      </Grid>

      {/* انتخاب روز */}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={days}
          value={day}
          onChange={(event, newValue) => setDay(newValue)}
          getOptionLabel={(option) => `${option}`} // تبدیل به رشته
          renderInput={(params) => <TextField {...params} label="روز" />}
        />
      </Grid>
    </Grid>
  );
};

export default YearMonthDayPicker;
