import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import AboutUs from './components/AboutUs';
import AlumniDirectory from './components/AlumniDirectory';
import EventsPage from './components/EventsPage';
import NewsPage from './components/NewsPage';
import ContactUs from './components/ContactUs';
import ChatPage from './components/ChatPage';  // Assuming you added the ChatPage component
import Chat from './components/Chat';  // Assuming you added the Chat component
import Posts from './components/PostsPage';  // Assuming you added the Posts component
import GalleryPage from './components/GalleryPage';
import ProfilePage from './components/ProfilePage';
import SponsorPage from './components/SponsorPage';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/directory" element={<AlumniDirectory />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:alumniId" element={<Chat />} />
        <Route path='/post' element={<Posts />} />
        <Route path='/gallery' element={<GalleryPage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/sponsors' element={<SponsorPage/>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
