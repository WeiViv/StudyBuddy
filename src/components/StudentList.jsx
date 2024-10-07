import React, { useState, useEffect } from 'react';

import { Box, Stack } from '@mui/material';

import StudentCard from './StudentCard';
import { getAllUsers } from '../utils/firestore';

export default function StudentList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getAllUsers(); // Call getAllUsers function
        setData(studentsData);
      } catch (error) {
        console.error('Error fetching matches data:', error);
      }
    };

    fetchData(); // Call the fetchData function within useEffect
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Box>
      <Stack spacing={2}>
        {data.map((profile, index) => (
          <StudentCard key={index} userProfile={profile} />
        ))}
      </Stack>
    </Box>
  );
}
