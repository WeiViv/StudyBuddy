import React, { useState, useEffect } from 'react';

import { TextField, Button, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuthState } from '../utils/firebase';
import { getUserProfile, updateUserProfile } from '../utils/firestore';

const FirstTimeUser = () => {
  // TODO: Don't add empty string if no classes added + don't add empty space behind class names

  const [user] = useAuthState(); // Get the authenticated user
  const [loading, setLoading] = useState(true);
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
        }
        // check whether the user is a first-time user
        // if not (major and year not ''), redirect to their profile page
        if (data.major && data.year) {
          navigate(`/profile/${user.uid}`);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    // Automatically validate form whenever formData changes
    validateForm();
  }, [formData]);

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Master', 'PhD'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedProfileData = {
        ...formData,
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
      phoneNumber: !/^\d{10}$/.test(formData.phoneNumber),
      major: !formData.major,
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
    <div>
      <h2>Complete Your Profile</h2>
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
        <TextField
          label="Major"
          name="major"
          type="text"
          value={formData.major}
          onChange={handleInputChange}
          error={errors.major}
          helperText={errors.major ? 'Major is required' : ''}
          fullWidth
          margin="normal"
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
  );
};

export default FirstTimeUser;
