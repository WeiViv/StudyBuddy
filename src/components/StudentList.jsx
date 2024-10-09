import React, { useState, useEffect } from 'react';

import { Box, Stack, Typography, Autocomplete, TextField } from '@mui/material';

import StudentCard from './UserCard';
import { useAuthState } from '../utils/firebase';
import {
  getAllUsers,
  getUserProfile,
  createMatch,
  getMatchedUserUids,
  getMajors,
} from '../utils/firestore';

export default function StudentList() {
  const [user] = useAuthState();
  const [userProfile, setUserProfile] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState(new Set()); // Track requested users
  const [matchedUserUids, setMatchedUserUids] = useState(new Set()); // Track matched users
  const [selectedMajors, setSelectedMajors] = useState([]); // State for selected majors
  const [majorsList, setMajorsList] = useState([]); // List of majors from Firestore
  const [selectedYears, setSelectedYears] = useState([]); // State for selected years

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
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);

          // Initialize the set of requested users from the user's profile
          const initialRequestedUsers = new Set(
            profile.outgoingMatches.map((match) => match.requestedUser),
          );
          setRequestedUsers(initialRequestedUsers);

          const matchedUids = await getMatchedUserUids(user.uid);
          setMatchedUserUids(new Set(matchedUids));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const majors = await getMajors(); // Fetch majors from Firestore
        setMajorsList(majors);
      } catch (error) {
        console.error('Error fetching majors:', error);
      }
    };

    fetchMajors();
  }, []);

  const handleMatch = async (studentUserProfile) => {
    try {
      await createMatch([studentUserProfile.uid, userProfile.uid], 'University Library');

      // Update local state to reflect the match request
      setRequestedUsers((prev) => new Set(prev).add(studentUserProfile.uid));
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  // TODO: Don't display card if student has sent request to user or if already matched
  // TODO (Question): Should we show student card if user already sent request to that student?
  return (
    <>
      {userProfile && studentData ? (
        <Box>
          <Box
            sx={{
              position: 'sticky',
              top: 64, // Stick at the top of the screen, adjust as needed if there's a header
              zIndex: 1000, // Ensure it's on top of other elements
              backgroundColor: 'white', // Ensure background covers other content
              display: 'flex',
              gap: 2,
            }}
          >
            {/* Autocomplete for filtering by majors */}
            <Autocomplete
              multiple
              options={majorsList} // Pass the majors list as options
              getOptionLabel={(option) => option}
              value={selectedMajors} // Selected majors state
              onChange={(event, newValue) => setSelectedMajors(newValue)} // Update selected majors
              renderInput={(params) => (
                <TextField {...params} label="Filter by Major(s)" variant="outlined" />
              )}
              sx={{ flex: 1, mb: 2, minWidth: 200 }}
            />
            {/* Autocomplete for filtering by year */}
            <Autocomplete
              multiple
              options={['Freshman', 'Sophomore', 'Junior', 'Senior', 'Master', 'PhD']}
              getOptionLabel={(option) => option}
              value={selectedYears} // Selected majors state
              onChange={(event, newValue) => setSelectedYears(newValue)} // Update selected years
              renderInput={(params) => (
                <TextField {...params} label="Filter by Year(s)" variant="outlined" />
              )}
              sx={{ flex: 1, mb: 2, minWidth: 200 }}
            />
            {/* TODO: Autocomplete for filtering by courses */}
          </Box>

          <Stack spacing={2}>
            {studentData
              .filter(
                (profile) =>
                  profile.uid !== userProfile.uid &&
                  !matchedUserUids.has(profile.uid) &&
                  (selectedMajors.length === 0 || selectedMajors.includes(profile.major)) &&
                  (selectedYears.length === 0 || selectedYears.includes(profile.year)),
              )
              .map((profile, index) => {
                const requested = requestedUsers.has(profile.uid);

                const actions = requested
                  ? [
                      {
                        label: 'Requested',
                        variant: 'outlined',
                        color: 'default',
                        onClick: () => {},
                      },
                    ]
                  : [
                      {
                        label: 'Match',
                        onClick: () => handleMatch(profile),
                      },
                    ];

                return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
              })}
          </Stack>
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          Please log in to view.
        </Typography>
      )}
    </>
  );
}
