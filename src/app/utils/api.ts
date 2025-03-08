import axios from 'axios';
import Router from 'next/router';
import Cookies from 'js-cookie';

// آدرس پایه سرور
// const API_BASE_URL = 'http://185.208.172.201/api';
const API_BASE_URL = 'http://193.242.208.20/back/api';

// تنظیمات axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => {
        // بازگرداندن پاسخ موفق
        return response;
    },
    (error) => {
        // بررسی خطای 401
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                // پاک کردن localStorage
                localStorage.clear();
                
                // هدایت به صفحه لاگین
                // window.location.href = '/login';
            }
        }
        // بازگرداندن سایر خطاها
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  
export default api;
