import * as React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useAuthState, handleSignIn, handleSignOut } from '../utils/firebase'; // Firebase functions

export default function Header() {
  const [user] = useAuthState();
  const navigate = useNavigate(); // Initialize the navigate hook
  const theme = useTheme();

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.uid}`); // Navigate to the profile page with the user's uid
    }
  };

  const signInAndCheckFirstTimeUser = () => {
    handleSignIn().then((user) => {
      if (!user) {
        navigate('/edit-profile');
      }
    });
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.light, color: '#000' }}>
      <Toolbar>
        {/* App Name */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '600', fontSize: '1.4rem' }}
        >
          StudyBuddy
        </Typography>

        {/* Conditional rendering for user authentication */}
        {user ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileClick} // Navigate to profile page on click
            >
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
          </>
        ) : (
          <Button color="inherit" onClick={signInAndCheckFirstTimeUser}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
