import { useEffect, useState } from 'react';

import { getUserProfile, getMatchedUserUids } from '../utils/firestore';

export default function useUserProfile(user) {
  const [userProfile, setUserProfile] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [matchedUserUids, setMatchedUserUids] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserProfileData = async () => {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          setRequestedUsers(new Set(profile.outgoingMatches.map((match) => match.requestedUser)));

          const matchedUids = await getMatchedUserUids(user.uid);
          setMatchedUserUids(new Set(matchedUids));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
        setLoading(false);
      };

      fetchUserProfileData();
    }
  }, [user]);

  return { userProfile, requestedUsers, setRequestedUsers, matchedUserUids, loading };
}
