'use client';

import { navigationItems } from './navigationItems';

const DesktopSidebar = () => {
    return (
        <aside
            style={{
                width: '250px',

                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '20px',
                backgroundColor: '#fff',
                marginLeft: '20px',
            }}
        >
            <ul>
                {navigationItems.map((item, index) => (
                    <li key={index}>
                        <a href={item.path}>{item.icon} {item.label}</a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default DesktopSidebar;
