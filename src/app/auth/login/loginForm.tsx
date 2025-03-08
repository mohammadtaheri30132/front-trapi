'use client';
import api from '@/app/utils/api';
import { useState } from 'react';
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // درخواست API برای لاگین
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const { token } = await response.json();
            Cookies.set('token', token)
            Cookies.set('clinic', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}` 
            localStorage.setItem('token', token);
            window.location.href = '/dashboard/clinic/patients/';
        } else {
            alert('ایمیل یا رمز عبور اشتباه است.');
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <input
                type="email"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>ورود</button>
        </form>
    );
};

export default LoginForm;
