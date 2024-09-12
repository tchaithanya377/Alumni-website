import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; // Firebase auth
import HomePage from './components/HomePage';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import AboutUs from './components/AboutUs';
import AlumniDirectory from './components/AlumniDirectory';
import EventsPage from './components/EventsPage';
import NewsPage from './components/NewsPage';
import ContactUs from './components/ContactUs';
import ChatPage from './components/ChatPage';  // ChatPage for individual chats
import ChatListPage from './components/ChatListPage'; // List of all chats
import SponsorPage from './components/SponsorPage';
import Posts from './components/PostsPage';
import GalleryPage from './components/GalleryPage';
function ProtectedRoute({ element }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post" element={<ProtectedRoute element={<Posts />} />} />
        <Route path="/gallery" element={<ProtectedRoute element={<GalleryPage />} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/directory" element={<ProtectedRoute element={<AlumniDirectory />} />} />
        <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
        <Route path="/news" element={<ProtectedRoute element={<NewsPage />} />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* Chat Routes */}
        <Route path="/chat" element={<ProtectedRoute element={<ChatListPage />} />} />
        <Route path="/chats/:id" element={<ProtectedRoute element={<ChatPage />} />} />
        <Route path="/sponsors" element={<ProtectedRoute element={<SponsorPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
