import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Delete, RemoveCircle } from "@mui/icons-material";
import api from "@/app/utils/api";

const TimeHeader = ({visits,handleDeleteVisit,small}) => {
    const totalHours = 16; // از ساعت 7 صبح تا 11 شب
    const hourWidth = small?100:200; // عرض هر ساعت
    const timelineStartHour = 7; // شروع تایم‌لاین از ساعت 7 صبح
    const [currentHour, setCurrentHour] = useState(null);

    // اطلاعات پزشکان و زمان ویزیت‌ها
  

    // محاسبه ساعت فعلی
    useEffect(() => {
        const updateCurrentHour = () => {
            const now = new Date();
            setCurrentHour(now.getHours());
        };
        updateCurrentHour();
        const interval = setInterval(updateCurrentHour, 60000); // بروزرسانی هر دقیقه
        return () => clearInterval(interval);
    }, []);

    // محاسبه موقعیت بازه زمانی در تایم‌لاین
    const calculatePosition = (startTime, endTime) => {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const startOffset =
            (startHour - timelineStartHour) * hourWidth + (startMinute / 60) * hourWidth;
        const endOffset =
            (endHour - timelineStartHour) * hourWidth + (endMinute / 60) * hourWidth;

        return { left: startOffset, width: endOffset - startOffset };
    };

    return (
        <Box
            sx={{
                width: "100%",
                overflowX: "auto",
                maxWidth:'1460px',
                position: "relative",
                backgroundColor: "#e9edf740",
                padding: "10px",
            }}
        >
            {/* تایم‌لاین هدر */}
            <Box
                sx={{
                    position: "relative",
                    width:small?'1600px':'3200px',
                    height: "50px",
                    display: "flex",
                    direction:'ltr',
                    borderBottom: "2px solid #ccc",
                }}
            >
                {[...Array(totalHours)].map((_, index) => {
                    const hour = timelineStartHour + index;
                    const isCurrentHour = currentHour === hour;

                    return (
                        <Box
                            key={index}
                            sx={{
                                width: `${hourWidth}px`,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRight: "1px solid #ddd",
                                backgroundColor: isCurrentHour ? "#00a113" : "#002754",
                                borderRadius: "10px",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "#fff" }}>
                                {`${String(hour).padStart(2, "0")}:00`}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* تایم‌لاین پزشکان */}
            <Box sx={{ marginTop: "20px",width:small?'1600px':'3200px' }}>
                {visits?.map((item, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            position: "relative",
                            height: "170px",
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                            marginBottom: "10px",
                        }}
                    >


                        {/* بازه‌های زمانی ویزیت */}
                        <Box
                            sx={{
                                position: "relative",
                                flex: 1,
                                display: "flex",
                                justifyContent:'center',
                                alignItems: "center",
                            }}
                        >
                            {item?.visits?.map((visit, visitIndex, array) => {
                                const { left, width } = calculatePosition(visit.startTime, visit.endTime);
                                const nextVisitStart = array[visitIndex + 1]?.startTime;

                                // محاسبه زمان خالی (در صورت وجود)
                                let gapBox = null;
                                if (nextVisitStart) {
                                    const gapStartOffset = left + width;
                                    const gapEndOffset = calculatePosition(nextVisitStart, nextVisitStart).left;
                                    const gapWidth = gapEndOffset - gapStartOffset;

                                    if (gapWidth > 0) {
                                        gapBox = (
                                            <Box
                                                key={`gap-${visitIndex}`}
                                                sx={{
                                                    position: "absolute",
                                                    left: `${gapStartOffset}px`,
                                                    width: `${gapWidth}px`,
                                                    height: "150px",
                                                    backgroundColor: "#ffedd6a8",
                                                    color: "#734000",
                                                    direction:'ltr',
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                <Typography variant="caption" fontWeight='bold'>
                                                    {visit.endTime} - {nextVisitStart}
                                                </Typography>
                                            </Box>
                                        );
                                    }
                                }

                                return (
                                    <React.Fragment key={visitIndex}>
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                left: `${left}px`,
                                                width: `${width}px`,
                                                height: "150px",
                                                backgroundColor: "#00434b",
                                                direction:'ltr',
                                                color: "#fff",
                                                display: "flex",
                                                padding:'10px 5px',
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            
                                            <Typography sx={{fontWeight:'bold',cursor:'pointer',':hover': { color: '#007bff'}}} variant="caption">ب: {visit?.patientName} {visit?.patientLastName}</Typography>
                                            <Typography sx={{fontWeight:'bold',cursor:'pointer',
                                        ':hover': { color: '#007bff'},
                                        }} variant="caption"> {item?.doctorFirstName} {item?.doctorLastName}</Typography>
                                            <Typography sx={{fontWeight:'bold'}} variant="caption">{visit?.startTime} - {visit?.endTime}</Typography>
                                            {!small&&(
                                                <Box sx={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
                                                <Typography sx={{backgroundColor:'#e10028',width:'49%',padding:'3px 10px',textAlign:'center',borderRadius:'5px'}} variant="caption">حذف</Typography>
                                                <Typography sx={{backgroundColor:'#ff841cfc',color:'#fff',padding:'3px 10px',width:'49%',textAlign:'center',borderRadius:'5px'}} variant="caption">ویرایش</Typography>

                                            </Box>
                                            )}
                            
                                        </Box>

                                        {/* جعبه خاکستری (زمان خالی) */}
                                        {gapBox}
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TimeHeader;
