import React from 'react';

import { Box, Pagination } from '@mui/material';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination count={totalPages} page={currentPage} onChange={onPageChange} color="primary" />
    </Box>
  );
};

export default CustomPagination;
