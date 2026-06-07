import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './Authentication/AuthLayout';
import UserProfile from './User/UserProfile';
import VideoPage from './Video/VideoPage';
import HomePage from './Video/HomePage';
import SearchPage from './Video/SearchPage';
import SubscriptionsPage from './Video/SubscriptionsPage';
import CommunityPage from './Community/CommunityPage';
import SurprisePage from './SurprisePage';
import Layout from './Layout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />} />
      <Route path="/profile" element={<Layout><UserProfile /></Layout>} />
      <Route path="/video/:videoId" element={<Layout><VideoPage /></Layout>}/>
      <Route path="/home" element={<Layout><HomePage /></Layout>}/>
      <Route path="/search" element={<Layout><SearchPage /></Layout>}/>
      <Route path="/subscriptions" element={<Layout><SubscriptionsPage /></Layout>}/>
      <Route path="/community" element={<Layout><CommunityPage /></Layout>}/>
      <Route path="/surprise" element={<Layout><SurprisePage /></Layout>}/>
    </Routes>
  );
};

export default App;
