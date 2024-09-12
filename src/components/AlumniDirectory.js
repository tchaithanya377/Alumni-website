// src/components/AlumniDirectory.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Import Firebase config

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]); // Holds the data fetched from Firestore
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null); // For selected alumni details
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility

  // Fetch alumni data from Firestore on component mount
  useEffect(() => {
    const fetchAlumni = async () => {
      const alumniCollection = collection(db, 'users'); // 'users' collection in Firestore
      const alumniSnapshot = await getDocs(alumniCollection);
      const alumniList = alumniSnapshot.docs.map(doc => ({
        id: doc.id, // Document ID
        ...doc.data(), // Spread document data into the object
      }));
      setAlumni(alumniList);
      setFilteredAlumni(alumniList); // Set filtered alumni to display all initially
    };

    fetchAlumni();
  }, []);

  // Filter alumni based on search query
  useEffect(() => {
    const result = alumni.filter(alum =>
      alum.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.graduationYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAlumni(result);
  }, [searchQuery, alumni]);

  const handleViewMore = (alum) => {
    setSelectedAlumni(alum); // Set the selected alumni details
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <motion.div
        className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Alumni Directory</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, batch, or department..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
        </div>

        {/* Alumni Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.length > 0 ? (
            filteredAlumni.map((alum, index) => (
              <motion.div
                key={index}
                className="bg-neutral p-6 rounded-lg shadow-md flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={alum.profilePhotoURL}
                  alt={alum.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{alum.fullName}</h2>
                  <p className="text-sm text-textColor">Batch: {alum.graduationYear}</p>
                  <p className="text-sm text-textColor">Department: {alum.department}</p>
                  <p className="text-sm text-textColor">Job: {alum.employment}</p>
                  <button
                    onClick={() => handleViewMore(alum)}
                    className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    View More
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-lg text-textColor">No alumni found.</p>
          )}
        </div>
      </motion.div>

      {/* Modal for showing alumni details */}
      {isModalOpen && selectedAlumni && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-4">{selectedAlumni.fullName}</h2>
            <img
              src={selectedAlumni.profilePhotoURL}
              alt={selectedAlumni.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="text-lg text-textColor mb-2">Batch: {selectedAlumni.graduationYear}</p>
            <p className="text-lg text-textColor mb-2">Degree: {selectedAlumni.degree}</p>
            <p className="text-lg text-textColor mb-2">Department: {selectedAlumni.department}</p>
            <p className="text-lg text-textColor mb-2">Job: {selectedAlumni.employment}</p>
            <p className="text-lg text-textColor mb-2">Location: {selectedAlumni.jobLocation}</p>
            <p className="text-lg text-textColor mb-2">Permanent Location: {selectedAlumni.permanentLocation}</p>
            <p className="text-lg text-textColor mb-2">Phone: {selectedAlumni.phone}</p>
            <p className="text-lg text-textColor mb-2">Email: {selectedAlumni.personalMail}</p>
            <p className="text-lg text-textColor mb-4">{selectedAlumni.qualification}</p>

            {/* "Go to Chat" Button */}
            <Link to={`/chats/${selectedAlumni.id}`}>
              <button
                className="w-full mb-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Go to Chat
              </button>
            </Link>

            <button
              onClick={closeModal}
              className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-indigo-600 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
