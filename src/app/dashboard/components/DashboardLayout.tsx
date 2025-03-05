'use client'
import React, { useState, useEffect } from "react";
import { usePathname ,useRouter} from 'next/navigation';
import { Container, Box, Tab, Tabs, Button } from "@mui/material";
import Link from "next/link";

const DashboardLayout = ({children}) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname(); // استفاده از usePathname
  const router = useRouter(); // استفاده از usePathname

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const logout=()=>{
    localStorage.clear()
    router.push('/login')
  }
  const tabs = [
    { label: "بیماران", path: "/dashboard/clinic/patients" },
    { label: "گزارش", path: "/dashboard/clinic/reports" },
    { label: "درمانگران", path: "/dashboard/clinic/thrapists" },
    { label: "ویزیت‌ها", path: "/dashboard/clinic/visits" },
  ];

  const activeTab = tabs.findIndex((tab) => pathname === tab.path);

  if (!isMounted) return null;

  return (
    <Box
      sx={{
        bgcolor: "#e9edf7",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "#fff",
          p: 1,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            position:'relative',
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "#ffffff",
            color: "#1976d2",
            boxShadow: 1,
          }}
        >
          <Tabs
            value={activeTab}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
              },
              "& .Mui-selected": {
                color: "#00a32",
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.path}
                label={tab.label}
                component={Link}
                href={tab.path}
              />
            ))}
          </Tabs>
          <Button onClick={logout} sx={{position:'absolute',left:10}}>
            خروج
          </Button>
        </Box>

        <Box
          sx={{
            bgcolor: "#fff",
            p: 3,
            overflowX:'hidden',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardLayout;
