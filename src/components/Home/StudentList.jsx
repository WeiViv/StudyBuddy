import React, { useState, useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { getAllUsers, createMatch } from '../../utils/firestore';
import StudentCard from '../UserCard';

export default function StudentList({
  userProfile,
  requestedUsers,
  setRequestedUsers,
  matchedUserUids,
  selectedMajors,
  selectedYears,
}) {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const students = await getAllUsers();
        setStudentData(students);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    fetchStudentData();
  }, []);

  const handleMatch = async (studentUserProfile) => {
    try {
      await createMatch([studentUserProfile.uid, userProfile.uid], 'University Library');
      setRequestedUsers((prev) => new Set(prev).add(studentUserProfile.uid));
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const filteredStudentData = studentData?.filter(
    (profile) =>
      profile.uid !== userProfile.uid &&
      !matchedUserUids.has(profile.uid) &&
      (selectedMajors.length === 0 || selectedMajors.includes(profile.major)) &&
      (selectedYears.length === 0 || selectedYears.includes(profile.year)),
  );

  return (
    <Box>
      {userProfile && filteredStudentData ? (
        <Stack spacing={2}>
          {filteredStudentData.map((profile, index) => {
            const requested = requestedUsers.has(profile.uid);
            const actions = requested
              ? [{ label: 'Requested', variant: 'outlined', color: 'default', onClick: () => {} }]
              : [{ label: 'Match', onClick: () => handleMatch(profile) }];
            return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
          })}
        </Stack>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No students found.
        </Typography>
      )}
    </Box>
  );
}
