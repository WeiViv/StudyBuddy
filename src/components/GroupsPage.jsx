import { useState, useEffect } from 'react';

import { Box, Stack, Typography, Modal } from '@mui/material';

import ProfileCard from './ProfileCard';
import StudentCard from './UserCard';
import { useAuthState } from '../hooks/useAuthState';
import { getUserProfile, resolveMatchRequest, getUserMatches } from '../utils/firestore';

function GroupsPage() {
  const [user] = useAuthState();
  const [userProfile, setUserProfile] = useState(null);
  const [incomingRequestProfiles, setIncomingRequestProfiles] = useState([]);
  const [outgoingRequestProfiles, setOutgoingRequestProfiles] = useState([]);
  const [matchProfiles, setMatchProfiles] = useState([]);
  const [openProfileModal, setOpenProfileModal] = useState(false); // State for modal visibility
  const [selectedProfile, setSelectedProfile] = useState(null); // State for selected user profile

  // Fetch the user's profile
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  // Combined useEffect for fetching incoming, outgoing, and current matches
  useEffect(() => {
    const fetchRequestProfiles = async () => {
      if (!userProfile) return;

      try {
        // Fetch incoming request profiles
        const incomingProfilesPromise = Promise.all(
          (userProfile.incomingMatches || []).map(async (req) => {
            const profile = await getUserProfile(req.requestingUser);
            return { ...profile, matchId: req.matchId };
          }),
        );

        // Fetch outgoing request profiles
        const outgoingProfilesPromise = Promise.all(
          (userProfile.outgoingMatches || []).map(async (req) => {
            const profile = await getUserProfile(req.requestedUser);
            return profile;
          }),
        );

        // Fetch current match profiles
        const matchProfilesPromise = getUserMatches(userProfile.uid);

        // Wait for all profiles to be fetched
        const [incomingProfiles, outgoingProfiles, matches] = await Promise.all([
          incomingProfilesPromise,
          outgoingProfilesPromise,
          matchProfilesPromise,
        ]);

        setIncomingRequestProfiles(incomingProfiles);
        setOutgoingRequestProfiles(outgoingProfiles);
        setMatchProfiles(matches);

        // Update match profiles and set selected profile to null when closing modal
        const updatedMatches = matches.filter((m) => m.uid !== selectedProfile?.uid);
        setMatchProfiles(updatedMatches);
      } catch (error) {
        console.error('Error fetching request profiles:', error);
      }
    };

    fetchRequestProfiles();
  }, [userProfile]);

  const handleRequestResolution = async (requestingUserUid, matchId, accept) => {
    try {
      await resolveMatchRequest(userProfile.uid, requestingUserUid, matchId, accept);
      // Update the UI after resolving the request
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        incomingMatches: prevProfile.incomingMatches.filter((req) => req.matchId !== matchId),
      }));
    } catch (error) {
      console.error(`Error ${accept ? 'accepting' : 'denying'} request:`, error);
    }
  };

  const handleOpenProfileModal = (profile) => {
    setSelectedProfile(profile);
    setOpenProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  return (
    <>
      {userProfile ? (
        <Box>
          <h1>Matches</h1>
          <Stack spacing={2}>
            {matchProfiles.length > 0 ? (
              matchProfiles.map((profile, index) => {
                const actions = [
                  {
                    label: 'View Profile',
                    // Allow users to see profile of matches
                    onClick: () => handleOpenProfileModal(profile),
                  },
                ];
                return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
              })
            ) : (
              <Typography variant="body1" color="textSecondary">
                You don't currently have any matches.
              </Typography>
            )}
          </Stack>

          {/* Modal for displaying the selected profile */}
          <Modal
            open={openProfileModal}
            onClose={handleCloseProfileModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={{ p: 3 }}>
              <ProfileCard profileData={selectedProfile} />
            </Box>
          </Modal>

          <h1>Incoming Requests</h1>
          <Stack spacing={2}>
            {incomingRequestProfiles.length > 0 ? (
              incomingRequestProfiles.map((profile, index) => {
                const actions = [
                  {
                    label: 'Accept',
                    onClick: () => handleRequestResolution(profile.uid, profile.matchId, true),
                  },
                  {
                    label: 'Deny',
                    onClick: () => handleRequestResolution(profile.uid, profile.matchId, false),
                    variant: 'outlined',
                    color: 'secondary',
                  },
                ];
                return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
              })
            ) : (
              <Typography variant="body1" color="textSecondary">
                You don't have any incoming requests.
              </Typography>
            )}
          </Stack>

          <h1>Outgoing Requests</h1>
          <Stack spacing={2}>
            {outgoingRequestProfiles.length > 0 ? (
              outgoingRequestProfiles.map((profile, index) => {
                const actions = [
                  {
                    label: 'Requested',
                    variant: 'outlined',
                    color: 'default',
                    onClick: () => {}, // No functionality
                  },
                ];
                return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
              })
            ) : (
              <Typography variant="body1" color="textSecondary">
                You don't have any outgoing requests.
              </Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          Please log in to view your groups.
        </Typography>
      )}
    </>
  );
}

export default GroupsPage;
