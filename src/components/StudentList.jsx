import React, { useState, useEffect } from 'react';

import { Box, Stack } from '@mui/material';

import StudentCard from './StudentCard';
import { useAuthState } from '../utils/firebase';
import { getAllUsers, getUserProfile } from '../utils/firestore';

export default function StudentList() {
  const [user] = useAuthState();

  const [userProfile, setUserProfile] = useState({});
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getAllUsers(); // Call getAllUsers function
        setStudentData(studentsData);
      } catch (error) {
        console.error('Error fetching matches data:', error);
      }
    };

    fetchData(); // Call the fetchData function within useEffect
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const userProfile = await getUserProfile(user.uid);
          setUserProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    console.log(studentData, userProfile);
  }, [studentData]);

  return (
    <Box>
      <Stack spacing={2}>
        {studentData.map((profile, index) => (
          <StudentCard key={index} userProfile={userProfile} studentUserProfile={profile} />
        ))}
      </Stack>
    </Box>
  );
}
