import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animation
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Import your Firebase config

const Homepage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Fetch events from Firestore and categorize them into upcoming and past
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events'); // Firestore collection 'events'
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const now = new Date();

      // Sort events by date (optional if not already sorted in Firestore)
      const sortedEvents = eventsList.sort((a, b) => new Date(a.date) - new Date(b.date));

      const upcoming = sortedEvents.filter(event => new Date(event.date) >= now).slice(0, 2); // Limit to 2 upcoming events
      const past = sortedEvents.filter(event => new Date(event.date) < now).slice(-2); // Limit to 2 past events

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary flex flex-col justify-between">

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 md:p-20 text-white">
        {/* Text Section */}
        <motion.div 
          className="text-left space-y-6 max-w-lg"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold">Welcome to AlumniConnect</h1>
          <p className="text-lg md:text-xl font-light">
            Join our alumni community and stay connected with the brightest minds in the industry.
          </p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-primary px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-200 transition duration-300">
              Register Now
            </Link>
            <Link 
              to="/login" 
              className="bg-secondary text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-pink-500 transition duration-300">
              Login
            </Link>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img 
            src="https://mits.ac.in/public/uploads/homepage/88acc160e217ed5fe591be0cff54b910.jpg" 
            alt="Alumni" 
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 md:p-20 bg-white text-primary">
        <motion.div 
          className="flex-1 p-4 space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold">Stay Connected</h2>
          <p className="text-lg">Reconnect with your batchmates and build professional connections.</p>
        </motion.div>
        
        <motion.div 
          className="flex-1 p-4 space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold">Exclusive Events</h2>
          <p className="text-lg">Attend alumni-exclusive events, webinars, and reunions.</p>
        </motion.div>

        <motion.div 
          className="flex-1 p-4 space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold">Career Opportunities</h2>
          <p className="text-lg">Discover new career opportunities within our alumni network.</p>
        </motion.div>
      </section>

      {/* Upcoming Events Section */}
      <section className="p-10 md:p-20 bg-neutral text-primary">
        <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-lg text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="p-10 md:p-20 bg-white text-primary">
        <h2 className="text-3xl font-bold text-center mb-6">Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastEvents.length > 0 ? (
            pastEvents.map(event => (
              <div key={event.id} className="bg-neutral p-6 rounded-lg shadow-md hover:shadow-lg transition">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-lg text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>No past events.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white text-center p-4">
        <p>&copy; 2024 AlumniConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
