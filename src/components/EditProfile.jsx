import React, { useState, useEffect } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuthState } from '../utils/firebase';
import { getUserProfile, updateUserProfile, getMajors } from '../utils/firestore';

const EditProfile = () => {
  // TODO: Don't add empty string if no classes added + don't add empty space behind class names

  const [user] = useAuthState(); // Get the authenticated user
  const [loading, setLoading] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [majorsList, setMajorsList] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    major: '',
    year: '',
    description: '',
    listOfCourses: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    major: false,
    year: false,
    listOfCourses: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.uid) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            major: data.major || '',
            year: data.year || '',
            description: data.description || '',
            listOfCourses: data.listOfCourses.join(', ') || '',
          });
          setSelectedMajors(data.major ? data.major.split(',') : []);
        }
        if (data.major && data.year) {
          setFirstTimeUser(true);
        }
        setLoading(false);
      }
    };

    const fetchMajors = async () => {
      const majorsFromDb = await getMajors();
      setMajorsList(majorsFromDb);
    };

    fetchProfile();
    fetchMajors();
  }, [user]);

  useEffect(() => {
    // Automatically validate form whenever formData changes
    validateForm();
  }, [formData, selectedMajors]);

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Master', 'PhD'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Format phone number as (XXX)-XXX-XXXX
      let formattedValue = value.replace(/\D/g, ''); // Remove all non-numeric characters
      if (formattedValue.length > 3 && formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(3)}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
      } else if (formattedValue.length > 0) {
        formattedValue = `(${formattedValue}`;
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedProfileData = {
        ...formData,
        major: selectedMajors.join(', '),
        listOfCourses: formData.listOfCourses.split(','),
      };
      if (user && user.uid) {
        await updateUserProfile(user.uid, updatedProfileData);
        console.log('Profile created/updated successfully');
        <Alert severity="success">Profile created successfully</Alert>;
        navigate('/'); // Redirect to the home page
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      phoneNumber: formData.phoneNumber.replace(/\D/g, '').length !== 10,
      major: selectedMajors.length === 0,
      year: !formData.year,
      // listOfCourses: !formData.listOfCourses,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const isValid = !Object.values(newErrors).some((error) => error);
    setIsFormValid(isValid);

    return isValid;
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ position: 'relative', padding: '5px' }}>
      {firstTimeUser && (
        <IconButton
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            zIndex: 10,
          }}
          onClick={() => navigate(`/profile/${user.uid}`)}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <div style={{ marginTop: '40px' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name} // Highlight red if there's an error
            helperText={errors.name ? 'Name is required' : ''}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            helperText={errors.email ? 'Email is required' : ''}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
            helperText={errors.phoneNumber ? 'Phone number must be 10 digits' : ''}
            fullWidth
            margin="normal"
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
          <TextField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            error={errors.year}
            helperText={errors.year ? 'Year is required' : ''}
            fullWidth
            margin="normal"
            select
          >
            {years.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="List of Courses (comma-separated)"
            name="listOfCourses"
            value={formData.listOfCourses}
            onChange={handleInputChange}
            error={errors.listOfCourses}
            helperText={errors.listOfCourses ? 'Courses are required' : ''}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // Disable the button if the form is invalid
            disabled={!isFormValid}
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
