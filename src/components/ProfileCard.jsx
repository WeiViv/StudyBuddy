import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { lighten } from '@mui/system';

export default function ProfileCard({ profileData, onEditClick, onSignOutClick }) {
  const theme = useTheme();
  // Defining a common style for the profile details text
  const detailsTextStyle = {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '1rem',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%', // Ensures the parent div takes the full width of the screen
      }}
    >
      <Card
        sx={{
          backgroundColor: lighten(theme.palette.primary.light, 0.8),
          width: '100%', // Full width for mobile screens
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 3,
          padding: 0.2,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: '#4E2A84', width: 56, height: 56 }}
              src={profileData?.profilePic || ''} // Use Google profile picture if available
              alt={profileData?.name}
            >
              {!profileData?.photoURL && (profileData?.name?.[0] || '')}{' '}
              {/* Display initial if there is no Google photo */}
            </Avatar>
          }
          title={
            <Typography
              variant="h5"
              component="div"
              sx={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '540', fontSize: '1.6rem' }}
            >
              {profileData?.name}
            </Typography>
          }
          // subheader={
          //   <Typography
          //     variant="subtitle2"
          //     component="div"
          //     sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '1.1rem' }}
          //   >
          //     {profileData?.major}
          //   </Typography>
          // }
        />
        <CardContent>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Email:</strong> {profileData?.email}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Phone Number:</strong> {profileData?.phoneNumber}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Major:</strong> {profileData?.major}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Year:</strong> {profileData?.year}
          </Typography>
          <Typography variant="body1" sx={detailsTextStyle}>
            <strong>Description:</strong> {profileData?.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            padding: 2,
          }}
        >
          <Button variant="contained" onClick={onEditClick} sx={{ marginRight: 1 }}>
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: '#D2042D', ':hover': { backgroundColor: '#ff6666' } }}
            onClick={onSignOutClick}
          >
            Sign Out
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
