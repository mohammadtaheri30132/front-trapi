'use client';
import React, { useState, useEffect } from "react";
import { usePathname ,useRouter} from "next/navigation";
import { Container, Box, BottomNavigation, BottomNavigationAction, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Link from "next/link";

const TherapistLayout = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname(); // استفاده از usePathname
  const [activeTab, setActiveTab] = useState(0);
  const router=useRouter()
  useEffect(() => {
    setIsMounted(true);
    // تعیین تب فعال بر اساس مسیر جاری
    const currentTab = tabs.findIndex((tab) => pathname === tab.path);
    setActiveTab(currentTab !== -1 ? currentTab : 0);
  }, [pathname]);

  const tabs = [
    { label: "صفحه اصلی", path: "/dashboard/therapist/", icon: <HomeIcon /> },
    // { label: "بیماران", path: "/dashboard/therapist/patients", icon: <PeopleIcon /> },
    // { label: "درآمد", path: "/dashboard/therapist/income", icon: <AttachMoneyIcon /> },
  ];
  const logout=()=>{
    localStorage.clear()
    router.push('/therapist-login')
  }
  if (!isMounted) return null;

  return (
    <Box
      sx={{
        bgcolor: "#e9edf7",
        minHeight: "100vh",
        pb: 7, // فاصله برای تم نویگیشن
      }}
    >
        <Button onClick={logout} sx={{position:'absolute',left:10}}>
            خروج
        </Button>
        <Box
          sx={{
            bgcolor: "#fff",
            p: 3,
            overflowX: "hidden",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          {children}
        </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#ffffff",
          boxShadow: "0px -1px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {tabs.map((tab, index) => (
          <BottomNavigationAction
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            component={Link}
            href={tab.path}
            sx={{
              "&.Mui-selected": {
                color: "#1976d2",
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default TherapistLayout;
