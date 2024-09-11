// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the selected user's ID
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Import Firebase config
import { FaPaperPlane } from 'react-icons/fa'; // Icon for sending messages

const Chat = () => {
  const { alumniId } = useParams(); // Get the user ID from the route
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [alumniName, setAlumniName] = useState('');

  // Fetch messages for the chat room
  useEffect(() => {
    if (alumniId) {
      const chatQuery = query(
        collection(db, `chats/${alumniId}/messages`), // Correctly reference the collection
        orderBy('timestamp')
      );
      const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
        const messageList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageList);
      });

      // Fetch alumni name based on alumniId
      const fetchAlumniName = async () => {
        const alumniDocRef = doc(db, 'users', alumniId); // Correctly reference the document
        const alumniDoc = await getDoc(alumniDocRef);
        if (alumniDoc.exists()) {
          setAlumniName(alumniDoc.data().fullName);
        } else {
          console.log("No such alumni document!");
        }
      };
      fetchAlumniName();

      return () => unsubscribe();
    }
  }, [alumniId]);

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }

    try {
      await addDoc(collection(db, `chats/${alumniId}/messages`), {
        senderId: auth.currentUser.uid,
        message: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral items-center justify-center py-10 px-6">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-primary">{`Chat with ${alumniName}`}</h1>

        {/* Chat Messages */}
        <div className="flex-1 h-80 p-4 overflow-y-auto bg-gray-100 rounded-lg mb-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 p-2 rounded-lg ${
                  msg.senderId === auth.currentUser.uid ? 'bg-primary text-white self-end' : 'bg-gray-300'
                }`}
              >
                <p>{msg.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet...</p>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
