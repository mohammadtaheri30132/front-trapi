'use client'
import DesktopSidebar from './components/DesktopSidebar';
import MobileBottomNavigation from './components/MobileBottomNavigation';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <main style={{ flex: 1, }}>{children}</main>
            {/*{isMobile && <MobileBottomNavigation />}*/}
        </div>
    );
}
