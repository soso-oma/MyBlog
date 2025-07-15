import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/profile';
import ForgotPassword from './pages/ForgotPassword'; 
import SearchResults from './pages/SearchResults';
import Notifications from './pages/Notifications';
import Followers from './pages/Followers';
import Following from './pages/Following';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow px-4 sm:px-6 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/post/new" element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
            <Route path="/post/edit/:slug" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
            <Route path="/post/:slug" element={<PostDetails />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile/:id/followers" element={<Followers />} />
            <Route path="/profile/:id/following" element={<Following />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;