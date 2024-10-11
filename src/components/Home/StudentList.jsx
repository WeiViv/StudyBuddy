import React from 'react';

import { Box, Stack, Typography } from '@mui/material';

import usePagination from '../../hooks/usePagination';
import useStudentData from '../../hooks/useStudentData';
import { createMatch } from '../../utils/firestore/matches';
import CustomPagination from '../common/CustomPagination';
import StudentCard from '../UserCard';

export default function StudentList({
  userProfile,
  requestedUsers,
  setRequestedUsers,
  matchedUserUids,
  selectedMajors,
  selectedYears,
}) {
  const studentData = useStudentData();

  const filteredStudentData = studentData?.filter(
    (profile) =>
      profile.uid !== userProfile.uid &&
      !matchedUserUids.has(profile.uid) &&
      (selectedMajors.length === 0 || selectedMajors.includes(profile.major)) &&
      (selectedYears.length === 0 || selectedYears.includes(profile.year)),
  );

  const {
    currentData: studentsToDisplay,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination(filteredStudentData, 10);

  const handleMatch = async (studentUserProfile) => {
    try {
      await createMatch([studentUserProfile.uid, userProfile.uid], 'University Library');
      setRequestedUsers((prev) => new Set(prev).add(studentUserProfile.uid));
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <Box>
      {userProfile && studentsToDisplay?.length > 0 ? (
        <Stack spacing={2}>
          {studentsToDisplay.map((profile, index) => {
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

      {/* Custom Pagination Component */}
      {filteredStudentData && filteredStudentData.length > 10 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
}
