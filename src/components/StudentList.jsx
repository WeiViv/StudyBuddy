import React, { useState, useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import StudentCard from './UserCard';
import { useAuthState } from '../utils/firebase';
import { getAllUsers, getUserProfile, createMatch, getMatchedUserUids } from '../utils/firestore';

export default function StudentList() {
  const [user] = useAuthState();
  const [userProfile, setUserProfile] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState(new Set()); // Track requested users
  const [matchedUserUids, setMatchedUserUids] = useState(new Set()); // Track matched users

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
          <Stack spacing={2}>
            {studentData
              .filter(
                (profile) => profile.uid !== userProfile.uid && !matchedUserUids.has(profile.uid),
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
