import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './Authentication/AuthLayout';
import UserProfile from './User/UserProfile';
import VideoPage from './Video/VideoPage';
import HomePage from './Video/HomePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/video" element={<VideoPage />}/>
      <Route path="/home" element={<HomePage />}/>
    </Routes>
  
  );
};

export default App;
