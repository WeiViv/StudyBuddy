import * as React from 'react';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import FirstTimeUser from './components/FirstTimeUser';
import Footer from './components/Footer';
import GroupsPage from './components/GroupsPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import './App.css';

const AppContent = ({ currentPage, setCurrentPage }) => {
  const location = useLocation(); // Hook to get current path

  // Check if the current page is the first-time user page
  const isFirstTimeUserPage = location.pathname === '/first-time-user';

  return (
    <>
      {/* Conditionally render based on the current route */}
      {!isFirstTimeUserPage && <Header />}
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="messages" element={<div>TBD</div>} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="first-time-user" element={<FirstTimeUser />} />
        </Routes>
      </div>
      {!isFirstTimeUserPage && <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />}
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
