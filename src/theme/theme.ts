import { createTheme } from '@mui/material/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { jssPreset, StylesProvider } from '@mui/styles';

// JSS برای راست‌چین کردن
// const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const theme = createTheme({
    direction: 'rtl', // راست‌چین کردن
    typography: {
        fontFamily: 'Estedad, Arial, sans-serif', // فونت پیش‌فرض
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    palette: {
        primary: {
            main: '#007BFF', // رنگ اصلی
            contrastText: '#FFFFFF', // متن روی دکمه‌ها
        },
        secondary: {
            main: '#6C757D', // رنگ فرعی
            contrastText: '#FFFFFF', // متن روی دکمه‌ها
        },
        background: {
            default: '#F5F5F5', // رنگ پس‌زمینه پیش‌فرض
            paper: '#FFFFFF', // رنگ پس‌زمینه کارت‌ها و کامپوننت‌ها
        },
        text: {
            primary: '#212529', // رنگ اصلی متن
            secondary: '#6C757D', // رنگ فرعی متن
        },
    },
    shape: {
        borderRadius: 8, // شعاع گرد
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // جلوگیری از بزرگ کردن حروف در دکمه‌ها
                    fontWeight: 700, // وزن فونت دکمه‌ها
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Estedad, Arial, sans-serif', // اعمال فونت Estedad روی Typography
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // گرد کردن کارت‌ها و باکس‌ها
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // سایه استاندارد
                },
            },
        },
    },
});

export default theme;
