import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Footer from './components/common/Footer';
import Header from './components/common/Header';
import EditProfile from './components/EditProfile';
import GroupsPage from './components/GroupsPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import { theme } from './utils/theme';
import './App.css';

const AppContent = ({ currentPage, setCurrentPage }) => {
  const location = useLocation();
  const isEditProfilePage = location.pathname === '/edit-profile';

  return (
    <ThemeProvider theme={theme}>
      {!isEditProfilePage && <Header />}
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="groups" element={<GroupsPage />} />
          {/* <Route path="messages" element={<div>TBD</div>} /> */}
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
      {!isEditProfilePage && <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />}
    </ThemeProvider>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </BrowserRouter>
    </div>
  );
};

export default App;
