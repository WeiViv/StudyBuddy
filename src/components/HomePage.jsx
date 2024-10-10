import React, { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';

import StudentFilter from './Home/StudentFilter';
import StudentList from './Home/StudentList';
import { useAuthState } from '../hooks/useAuthState';
import useUserProfile from '../hooks/useUserProfile';

export default function HomePage() {
  const [user] = useAuthState();
  const { userProfile, requestedUsers, setRequestedUsers, matchedUserUids, loading } =
    useUserProfile(user);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Please log in to access the app.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 60,
          zIndex: 10,
          backgroundColor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          padding: 1,
          marginBottom: 2,
        }}
      >
        <StudentFilter
          selectedMajors={selectedMajors}
          setSelectedMajors={setSelectedMajors}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
      </Box>
      <StudentList
        userProfile={userProfile}
        requestedUsers={requestedUsers}
        setRequestedUsers={setRequestedUsers}
        matchedUserUids={matchedUserUids}
        selectedMajors={selectedMajors}
        selectedYears={selectedYears}
      />
    </Box>
  );
}
