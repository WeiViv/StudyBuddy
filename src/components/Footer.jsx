import * as React from 'react';

import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export default function Footer({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box className="footer">
      <BottomNavigation
        showLabels
        value={currentPage}
        onChange={(event, newValue) => {
          setCurrentPage(newValue);
          switch (newValue) {
            case 0:
              navigate('/');
              break;
            case 1:
              navigate('/groups');
              break;
            // case 2:
            //   navigate('/messages');
            //   break;
            default:
              break;
          }
        }}
        sx={{
          backgroundColor: theme.palette.primary.light,
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Groups" icon={<GroupsIcon />} />
        {/* <BottomNavigationAction label="Messages" icon={<MessageIcon />} /> */}
      </BottomNavigation>
    </Box>
  );
}
