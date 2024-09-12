import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Install heroicons: npm install @heroicons/react
import { motion } from 'framer-motion'; // Install framer-motion: npm install framer-motion
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import your Firebase config
import { doc, getDoc } from 'firebase/firestore'; // For Firestore queries

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is authenticated and fetch the profile info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        setCurrentUser({ ...user, ...userData });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear the user state after logout
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-md fixed top-0 left-0 w-full z-50"> {/* Fixed positioning */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/">AlumniConnect</Link>
        </motion.h1>

        {/* Menu for large screens */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-300 transition duration-300">Home</Link>
          <Link to="/post" className="hover:text-gray-300 transition duration-300">Posts</Link>
          <Link to="/gallery" className="hover:text-gray-300 transition duration-300">Gallery</Link>
          <Link to="/about" className="hover:text-gray-300 transition duration-300">About Us</Link>
          <Link to="/directory" className="hover:text-gray-300 transition duration-300">Alumni Directory</Link>
          <Link to="/events" className="hover:text-gray-300 transition duration-300">Events</Link>
          <Link to="/news" className="hover:text-gray-300 transition duration-300">News</Link>
          <Link to="/sponsors" className="hover:text-gray-300 transition duration-300">Sponsors</Link>
          <Link to="/contact" className="hover:text-gray-300 transition duration-300">Contact Us</Link>
        </div>

        {/* CTA buttons for larger screens */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.profilePhotoURL || 'https://via.placeholder.com/50'}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <Link to="/profile" className="hover:text-gray-300 transition duration-300">
                {currentUser.fullName || currentUser.email}
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
              {/* Chat Button */}
              <Link to="/chat" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                Chat
              </Link>
            </div>
          ) : (
            <>
              <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Register
              </Link>
              <Link to="/login" className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-pink-500 transition">
                Login
              </Link>
              {/* Chat Button */}
              <Link to="/chat" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                Chat
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {!isOpen ? <MenuIcon className="h-8 w-8 text-white" /> : <XIcon className="h-8 w-8 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-primary text-white space-y-4 px-6 py-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/post" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Posts</Link>
          <Link to="/gallery" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/about" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to="/directory" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Alumni Directory</Link>
          <Link to="/events" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Events</Link>
          <Link to="/news" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>News</Link>
          <Link to='/sponsors' className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Sponsor</Link>
          <Link to="/contact" className="block hover:text-gray-300 transition duration-300" onClick={() => setIsOpen(false)}>Contact Us</Link>
          
          {currentUser ? (
            <>
              <div className="block mt-4">
                <img
                  src={currentUser.profilePhotoURL || 'https://via.placeholder.com/50'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <Link to="/profile" className="block mt-2 hover:text-gray-300" onClick={() => setIsOpen(false)}>
                  {currentUser.fullName || currentUser.email}
                </Link>
              </div>
              {/* Logout Button for mobile */}
              <button
                onClick={handleLogout}
                className="block bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="block bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition mt-4" onClick={() => setIsOpen(false)}>Register</Link>
              <Link to="/login" className="block bg-secondary text-white px-4 py-2 rounded-full hover:bg-pink-500 transition mt-2" onClick={() => setIsOpen(false)}>Login</Link>
            </>
          )}
          {/* Chat Button for mobile */}
          <Link to="/chat" className="block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition mt-2" onClick={() => setIsOpen(false)}>Chat</Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
