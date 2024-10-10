import React, { useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import StudentFilter from './Home/StudentFilter';
import StudentList from './Home/StudentList';
import useUserProfile from '../hooks/useUserProfile';
import { useAuthState } from '../utils/firebase';

export default function HomePage() {
  const [user] = useAuthState();
  const { userProfile, requestedUsers, setRequestedUsers, matchedUserUids, loading } =
    useUserProfile(user);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  return (
    <Box>
      {loading ? (
        <CircularProgress>
          <span>Loading...</span>
        </CircularProgress>
      ) : (
        <>
          <StudentFilter
            selectedMajors={selectedMajors}
            setSelectedMajors={setSelectedMajors}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
          <StudentList
            userProfile={userProfile}
            requestedUsers={requestedUsers}
            setRequestedUsers={setRequestedUsers}
            matchedUserUids={matchedUserUids}
            selectedMajors={selectedMajors}
            selectedYears={selectedYears}
          />
        </>
      )}
    </Box>
  );
}
