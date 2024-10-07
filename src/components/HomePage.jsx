import * as React from 'react';

import { Box } from '@mui/material';

import StudentList from './StudentList';

export default function HomePage() {
  return (
    <Box>
      <h1>Home Page</h1>
      <StudentList />
    </Box>
  );
}
