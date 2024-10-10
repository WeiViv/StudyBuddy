import React from 'react';

import { ArrowBack } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useAuthNavigation } from '../../hooks/useAuthNavigation';

export default function Header() {
  const { user, handleProfileClick, signInAndCheckFirstTimeUser } = useAuthNavigation();
  const theme = useTheme();

  const isProfilePage = window.location.pathname.includes('/profile/');
  const isRootPage =
    window.location.pathname === '/' ||
    window.location.pathname === '/groups' ||
    window.location.pathname === '/messages';

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.light, color: '#000' }}>
      <Toolbar sx={{ position: 'relative', justifyContent: 'space-between' }}>
        {/* Left side: placeholder to keep spacing consistent */}
        {!isRootPage ? (
          <IconButton edge="start" color="inherit" onClick={() => window.history.back()}>
            <ArrowBack />
          </IconButton>
        ) : (
          <Box sx={{ width: '48px' }} />
        )}

        {/* Centered text */}
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: '600',
            fontSize: '1.4rem',
          }}
        >
          StudyBuddy
        </Typography>

        {/* Right side: Sign In button or user avatar */}
        {!isProfilePage ? (
          user ? (
            <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
          ) : (
            <Button color="inherit" onClick={signInAndCheckFirstTimeUser}>
              Sign In
            </Button>
          )
        ) : (
          <Box sx={{ width: '48px' }} />
        )}
      </Toolbar>
    </AppBar>
  );
}
