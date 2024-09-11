// src/components/NewsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions
import { db } from '../firebase'; // Firebase config

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);

  // Fetch news from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      const newsCollection = collection(db, 'news'); // Replace 'news' with your Firestore collection name
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort news by date in descending order
      const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNewsList(sortedNews);
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <motion.div
        className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Latest News & Announcements</h1>

        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((newsItem) => (
              <motion.div
                key={newsItem.id}
                className="bg-neutral p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold">{newsItem.title}</h3>
                <p className="text-sm text-textColor">Date: {new Date(newsItem.date).toLocaleDateString()}</p>
                <p className="mt-2">{newsItem.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-textColor">No news available.</p>
        )}
      </motion.div>
    </div>
  );
};

export default NewsPage;
