import * as React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import EditProfile from './components/EditProfile';
import Footer from './components/Footer';
import GroupsPage from './components/GroupsPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';

import './App.css';

const AppContent = ({ currentPage, setCurrentPage }) => {
  const location = useLocation(); // Hook to get current path

  // Check if the current page is the first-time user page
  const isEditProfilePage = location.pathname === '/edit-profile';

  const theme = createTheme({
    palette: {
      primary: {
        light: '#E4E0EE',
        main: '#4E2A84',
        dark: '#361d5c',
        contractText: '#fff',
      },
      secondary: {
        main: '#f44336',
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* Conditionally render based on the current route */}
        {!isEditProfilePage && <Header />}
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="messages" element={<div>TBD</div>} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="edit-profile" element={<EditProfile />} />
          </Routes>
        </div>
        {!isEditProfilePage && <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </ThemeProvider>
    </>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(0);

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </BrowserRouter>
    </div>
  );
};

export default App;
