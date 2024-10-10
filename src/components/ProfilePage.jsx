import React, { useState } from 'react';

import { Email, Phone, School, CalendarToday, ListAlt } from '@mui/icons-material';
import {
  Avatar,
  Typography,
  Divider,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import SignOutDialog from './SignOutDialog';
import useUserProfile from '../hooks/useUserProfile';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile: profileData, loading } = useUserProfile({ uid: id });
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const theme = useTheme();

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const handleSignOutDialogOpen = () => {
    setSignOutDialogOpen(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', padding: 3 }}>
      {/* Profile Header with Avatar and Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 4 }}>
        <Avatar
          sx={{ width: 100, height: 100, bgcolor: theme.palette.primary, mb: 2 }}
          src={profileData?.profilePic || ''}
          alt={profileData?.name}
        >
          {profileData?.name?.[0]}
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {profileData?.name}
        </Typography>
      </Box>

      {/* Contact Info Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Contact Info
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
            </Box>
            <Typography variant="body2">{profileData?.email}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2" color="textSecondary">
                Phone
              </Typography>
            </Box>
            <Typography variant="body2">{profileData?.phoneNumber}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Bio
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {profileData?.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Study Info Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Study Info
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2" color="textSecondary">
                Year
              </Typography>
            </Box>
            <Typography variant="body2">{profileData?.year}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2" color="textSecondary">
                {profileData?.major && profileData.major.includes(',') ? 'Majors' : 'Major'}
              </Typography>
            </Box>
            <Typography variant="body2">{profileData?.major}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListAlt sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2" color="textSecondary">
                Selected Courses
              </Typography>
            </Box>
            <Typography variant="body2">{profileData?.selectedCourses?.join(', ')}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Edit and Sign Out Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Button variant="contained" onClick={handleEditClick} sx={{ mb: 2, width: '150px' }}>
          Edit Profile
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: 'theme.palette.secondary.main',
            width: '150px',
          }}
          onClick={handleSignOutDialogOpen}
        >
          Sign Out
        </Button>
      </Box>

      {/* Sign Out Confirmation Dialog */}
      <SignOutDialog open={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)} />
    </Box>
  );
}
