import React, { useState, useEffect } from 'react';

import { CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileCard from './ProfileCard';
import { handleSignOut } from '../utils/firebase';
import { getUserProfile } from '../utils/firestore';

export default function ProfilePage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(id);
      if (data) {
        setProfileData(data);
      } else {
        handleSignOut();
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      <ProfileCard
        profileData={profileData}
        onEditClick={handleEditClick}
        onSignOutClick={handleSignOut}
      />
    </div>
  );
}
