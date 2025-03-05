'use client';

import { Box, Typography, Button } from '@mui/material';

export default function HomePage() {
  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
          }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Your Project
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is a starter page for your Next.js project with Material-UI.
        </Typography>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Box>
  );
}
