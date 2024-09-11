// src/components/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions
import { db } from '../firebase'; // Firebase config

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events'); // Replace 'events' with the actual collection name in Firestore
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id, // Document ID
        ...doc.data(), // Spread document data into the object
      }));

      // Separate events into upcoming and past events based on the current date
      const now = new Date();
      const upcoming = eventsList.filter(event => new Date(event.date) >= now);
      const past = eventsList.filter(event => new Date(event.date) < now);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <motion.div
        className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Events</h1>

        {/* Upcoming Events Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-primary mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-neutral p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-sm text-textColor">Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-textColor">Location: {event.location}</p>
                  <p className="mt-2">{event.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-textColor">No upcoming events.</p>
          )}
        </section>

        {/* Past Events Section */}
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-neutral p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-sm text-textColor">Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-textColor">Location: {event.location}</p>
                  <p className="mt-2">{event.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-textColor">No past events.</p>
          )}
        </section>
      </motion.div>
    </div>
  );
};

export default EventsPage;
