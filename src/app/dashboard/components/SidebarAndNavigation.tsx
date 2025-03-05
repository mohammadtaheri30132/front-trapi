'use client';

import React, { useEffect, useState } from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileBottomNavigation from './MobileBottomNavigation';

const SidebarAndNavigation = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // تعیین اندازه صفحه نمایش
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // اگر عرض صفحه کمتر از 768px باشد، موبایل در نظر گرفته می‌شود
        };

        // اضافه کردن لیسنر برای تغییر اندازه صفحه
        window.addEventListener('resize', handleResize);

        // بررسی اندازه صفحه در هنگام بارگذاری صفحه
        handleResize();

        // پاک کردن لیسنر بعد از unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <MobileBottomNavigation /> : <DesktopSidebar />;
};

export default SidebarAndNavigation;
