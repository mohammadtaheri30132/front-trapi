'use client';

import { navigationItems } from './navigationItems';

const MobileBottomNavigation = () => {
    return (
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: '#fff',
                boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
                zIndex: 1000, // برای قرار گرفتن بالای محتوای دیگر
            }}
        >
            <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
                {navigationItems.map((item, index) => (
                    <li key={index}>
                        <a href={item.path}>{item.icon}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileBottomNavigation;
