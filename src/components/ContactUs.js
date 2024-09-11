// src/components/ContactUs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../firebase'; // Import Firebase config
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Social Media Icons

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the form data to Firestore
      await addDoc(collection(db, 'contactMessages'), formData);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <motion.div
        className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Contact Us</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Send Message
          </button>

          {/* Success and Error Messages */}
          {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
        </form>

        {/* Social Media Links */}
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Follow Us</h2>
          <div className="flex justify-center space-x-6 text-2xl">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noreferrer" className="text-secondary hover:text-indigo-500 transition duration-300">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com/yourpage" target="_blank" rel="noreferrer" className="text-secondary hover:text-indigo-500 transition duration-300">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/yourpage" target="_blank" rel="noreferrer" className="text-secondary hover:text-indigo-500 transition duration-300">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Map Embed (MITS Location) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Our Location</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.528003796297!2d78.47853901514298!3d13.629615390428668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb28e577d029b6d%3A0x2ed97f6cf8b0b4d3!2sMadanapalle%20Institute%20of%20Technology%20%26%20Science!5e0!3m2!1sen!2sin!4v1632793700159!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Our Location"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
