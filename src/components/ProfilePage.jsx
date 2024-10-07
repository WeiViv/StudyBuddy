import React, { useState, useEffect } from 'react';

import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
} from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileCard from './ProfileCard'; // Import the ProfileCard component
import { handleSignOut } from '../utils/firebase';
import { getUserProfile, updateUserProfile, getMajors } from '../utils/firestore';

export default function ProfilePage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [majorsList, setMajorsList] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    major: '',
    year: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(id);
      if (data) {
        setProfileData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          major: data.major || '',
          year: data.year || '',
          description: data.description || '',
        });
        setSelectedMajors(data.major ? data.major.split(',') : []);
      } else {
        handleSignOut();
        navigate('/');
      }
      setLoading(false);
    };
    const fetchMajors = async () => {
      const majorsFromDb = await getMajors();
      setMajorsList(majorsFromDb);
    };

    fetchProfile();
    fetchMajors();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3 && formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(3)}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(
          3,
          6,
        )}-${formattedValue.slice(6, 10)}`;
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateProfile = async () => {
    if (validateForm()) {
      try {
        await updateUserProfile(id, formData);
        setEditMode(false);
        window.location.reload();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.major) formErrors.major = 'Major is required';

    if (!formData.email && !formData.phoneNumber) {
      formErrors.contact = 'Either email or phone number is required';
    } else {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      if (formData.phoneNumber && phoneDigits.length !== 10) {
        formErrors.phoneNumber = 'Phone number must be 10 digits';
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      {editMode ? (
        <div>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.contact || !!errors.email}
            helperText={errors.contact || errors.email}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            placeholder="(XXX)-XXX-XXXX"
            error={!!errors.contact || !!errors.phoneNumber}
            helperText={errors.contact || errors.phoneNumber || 'Format: (XXX)-XXX-XXXX'}
          />
          <Autocomplete
            multiple
            options={majorsList}
            getOptionLabel={(option) => option}
            value={selectedMajors}
            onChange={(event, newValue) => {
              if (newValue.length <= 3) {
                setSelectedMajors(newValue); // max 3
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Major"
                error={errors.major}
                helperText={errors.major ? 'Please select your major(s)' : ''}
                margin="normal"
                fullWidth
              />
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              label="Year"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Freshman">Freshman</MenuItem>
              <MenuItem value="Sophomore">Sophomore</MenuItem>
              <MenuItem value="Junior">Junior</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
              <MenuItem value="Master">Master</MenuItem>
              <MenuItem value="PhD">PhD</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <ProfileCard
          profileData={profileData}
          onEditClick={handleEditClick}
          onSignOutClick={handleSignOut}
        />
      )}
    </div>
  );
}
