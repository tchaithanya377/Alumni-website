import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore config
import { motion } from 'framer-motion'; // Import Framer Motion for animations

const ChatListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setFilteredUsers(usersList);  // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search input
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);  // Show all users if no search term
    }
  }, [searchTerm, users]);

  const handleChat = (userId) => {
    navigate(`/chats/${userId}`);  // Navigate to chat page with the userId
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-[4rem]"> {/* Add margin-top to avoid overlap with navbar */}
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-bold p-4 border-b">Your Chats</h2>
        <ul className="divide-y divide-gray-200">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <motion.li
                key={user.id}
                className="p-4 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300"
                whileHover={{ scale: 1.02 }}  // Hover animation
                onClick={() => handleChat(user.id)}
              >
                <div className="flex items-center">
                  <motion.img
                    className="h-12 w-12 rounded-full object-cover mr-4 shadow-lg"
                    src={user.profilePhotoURL || 'https://via.placeholder.com/50'}
                    alt={user.fullName || user.email}
                    whileHover={{ scale: 1.1 }}  // Image zoom animation on hover
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-lg font-medium">{user.fullName || user.email}</span>
                </div>
                <span className="text-sm text-gray-400">Start Chat</span>
              </motion.li>
            ))
          ) : (
            <li className="p-4 text-gray-500">No users found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatListPage;
