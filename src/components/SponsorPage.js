import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase config
import { motion } from 'framer-motion';

const SponsorPage = () => {
  const [sponsors, setSponsors] = useState([]);

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

        {/* Contact/Account Details for Sponsorship */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-primary">Want to Sponsor Us?</h2>
          <p className="text-lg text-gray-700 mb-4">
            Interested in sponsoring our events or the college? You can reach out to us through the following details:
          </p>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Account Details</h3>
            <p>Account Name: <strong>AlumniConnect</strong></p>
            <p>Bank: <strong>XYZ Bank</strong></p>
            <p>Account Number: <strong>1234567890</strong></p>
            <p>IFSC Code: <strong>XYZB0001234</strong></p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p>Email: <a href="mailto:sponsor@alumniconnect.com" className="text-indigo-600 underline">sponsor@alumniconnect.com</a></p>
            <p>Phone: <a href="tel:+1234567890" className="text-indigo-600 underline">+1234567890</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorPage;
