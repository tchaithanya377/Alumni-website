// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db, storage } from '../firebase'; // Import Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";  // For uploading images

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    collegeMail: '',
    personalMail: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    degree: '',
    qualification: '',
    department: '',
    jobLocation: '',
    permanentLocation: '',
    employment: '',
    phone: '',
    linkedin: '',
    country: '',
    profilePhoto: null, // Profile photo
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { fullName, collegeMail, personalMail, password, confirmPassword, profilePhoto } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, personalMail, password);
      const user = userCredential.user;

      // Upload profile photo to Firebase Storage if available
      let profilePhotoURL = '';
      if (profilePhoto) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        profilePhotoURL = await getDownloadURL(storageRef);  // Get the photo's download URL
      }

      // Save user profile data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        collegeMail,
        personalMail,
        graduationYear: formData.graduationYear,
        degree: formData.degree,
        qualification: formData.qualification,
        department: formData.department,
        jobLocation: formData.jobLocation,
        permanentLocation: formData.permanentLocation,
        employment: formData.employment,
        phone: formData.phone,
        linkedin: formData.linkedin,
        country: formData.country,
        profilePhotoURL,  // Save profile photo URL in Firestore
      });

      // Redirect to another page after successful registration
      setLoading(false);
      navigate('/login');

    } catch (error) {
      console.error('Error registering user', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-primary text-center mb-6">Register</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* College Email */}
          <div>
            <label className="block text-textColor font-semibold mb-2">College Email</label>
            <input
              type="email"
              name="collegeMail"
              value={formData.collegeMail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Personal Email */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Personal Email</label>
            <input
              type="email"
              name="personalMail"
              value={formData.personalMail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Year of Graduation</label>
            <input
              type="text"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Degree */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Job Location</label>
            <input
              type="text"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Permanent Location */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Permanent Location</label>
            <input
              type="text"
              name="permanentLocation"
              value={formData.permanentLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Current Employment */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Current Employment</label>
            <input
              type="text"
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-textColor font-semibold mb-2">LinkedIn Profile (Optional)</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-textColor font-semibold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input type="checkbox" required className="mr-2" />
            <span className="text-textColor">I agree to the <Link to="/terms" className="text-secondary hover:text-indigo-500 transition duration-300">Terms and Conditions</Link></span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-textColor">Already have an account? 
            <Link to="/login" className="text-secondary hover:text-indigo-500 ml-1 transition duration-300">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
