'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme/theme';
import './globals.css'; // فایل CSS گلوبال
import { create } from 'jss';
import rtl from 'jss-rtl';
import { jssPreset, StylesProvider } from '@mui/styles';
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
        </StylesProvider>
        </body>
        </html>
    );
}
