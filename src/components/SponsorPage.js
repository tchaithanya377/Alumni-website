import React, { useState, useEffect } from 'react';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase config
import { motion } from 'framer-motion';

const SponsorPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    description: '',
    logoUrl: '',
    websiteUrl: ''
  });

  // Fetch sponsors from Firestore
  useEffect(() => {
    const fetchSponsors = async () => {
      const sponsorsCollection = collection(db, 'sponsors');
      const sponsorSnapshot = await getDocs(sponsorsCollection);
      const sponsorList = sponsorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSponsors(sponsorList);
    };

    fetchSponsors();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSponsor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new sponsor
  const handleAddSponsor = async (e) => {
    e.preventDefault();

    // Add to Firestore
    await addDoc(collection(db, 'sponsors'), newSponsor);

    // Clear form
    setNewSponsor({
      name: '',
      description: '',
      logoUrl: '',
      websiteUrl: ''
    });

    // Fetch sponsors again to update list
    const sponsorsCollection = collection(db, 'sponsors');
    const sponsorSnapshot = await getDocs(sponsorsCollection);
    const sponsorList = sponsorSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSponsors(sponsorList);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-6">
      <div className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Our Current Sponsors</h1>

        {/* Display sponsors in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {sponsors.length > 0 ? (
            sponsors.map((sponsor) => (
              <motion.div
                key={sponsor.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                {/* Sponsor Logo */}
                <img
                  src={sponsor.logoUrl || 'https://via.placeholder.com/150'}
                  alt={sponsor.name}
                  className="w-full h-48 object-contain mb-4"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback fails
                    e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                  }}
                />

                {/* Sponsor Info */}
                <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>
                <p className="text-gray-600 mb-4">{sponsor.description}</p>

                {/* Sponsor Website */}
                {sponsor.websiteUrl && (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    Visit Website
                  </a>
                )}
              </motion.div>
            ))
          ) : (
            <p>No sponsors available at this moment.</p>
          )}
        </div>

        {/* Add Sponsor Form */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-primary">Add a Sponsor</h2>
          <form onSubmit={handleAddSponsor}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Sponsor Name</label>
              <input
                type="text"
                name="name"
                value={newSponsor.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter sponsor name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Sponsor Description</label>
              <textarea
                name="description"
                value={newSponsor.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter sponsor description"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Sponsor Logo URL</label>
              <input
                type="url"
                name="logoUrl"
                value={newSponsor.logoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter sponsor logo URL"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Sponsor Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={newSponsor.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter sponsor website URL"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Sponsor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SponsorPage;
