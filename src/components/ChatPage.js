import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase'; // Ensure Firebase auth is imported
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';

const ChatPage = () => {
  const { id } = useParams();  // Get the recipient user ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);  // Store the chat ID
  const [currentUserId, setCurrentUserId] = useState(null);  // Store the current user's ID
  const [recipientUser, setRecipientUser] = useState(null);  // Store the recipient's info
  const messagesEndRef = useRef(null); // For auto-scrolling to the bottom

  // Fetch the current user's ID
  useEffect(() => {
    const fetchCurrentUser = () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);  // Set the current user ID
      } else {
        console.error('No user is logged in.');
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch or Create Chat based on the current user and the other user (from URL)
  useEffect(() => {
    const getOrCreateChat = async () => {
      if (!id || !currentUserId) {
        console.error('User ID or currentUserId is undefined');
        return;
      }

      // Fetch recipient user details from Firestore
      const recipientUserDocRef = doc(db, 'users', id); // Assuming user data is stored in 'users' collection
      const recipientUserSnapshot = await getDoc(recipientUserDocRef);
      if (recipientUserSnapshot.exists()) {
        setRecipientUser(recipientUserSnapshot.data());  // Set the recipient's info
      }

      // Generate Chat ID using both users' IDs to maintain a single chat between them
      const generatedChatId = `${currentUserId}_${id}`;
      const reverseChatId = `${id}_${currentUserId}`; // To handle reverse ordering of IDs

      // Check if a chat exists between the two users
      const chatDocRef = doc(db, 'chats', generatedChatId);
      const chatSnapshot = await getDoc(chatDocRef);

      if (chatSnapshot.exists()) {
        setChatId(chatDocRef.id);  // If chat exists, set chatId
      } else {
        // Check for reverse chat
        const reverseChatDocRef = doc(db, 'chats', reverseChatId);
        const reverseChatSnapshot = await getDoc(reverseChatDocRef);

        if (reverseChatSnapshot.exists()) {
          setChatId(reverseChatDocRef.id);  // Use reverse chat ID
        } else {
          // Create a new chat document if no chat exists
          await setDoc(chatDocRef, {
            participants: [currentUserId, id],  // Add participants to the chat
            createdAt: serverTimestamp(),
          });
          setChatId(chatDocRef.id);  // Set the new chatId
        }
      }
    };

    getOrCreateChat();
  }, [id, currentUserId]);

  // Fetching chat messages from Firestore
  useEffect(() => {
    if (chatId) {
      const q = query(collection(db, 'chats', chatId, 'messages'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        msgs.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);  // Sort messages by timestamp
        setMessages(msgs);
        scrollToBottom();  // Scroll to the latest message
      });

      return () => unsubscribe();
    } else {
      console.error('Chat ID is undefined');
    }
  }, [chatId]);

  // Sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;  // Don't send empty messages
    if (!chatId) {
      console.error('Chat ID is missing, cannot send message');
      return;
    }

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        message: newMessage,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');  // Clear input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-4rem)] mt-[4rem]">  
      {/* Display recipient's name and profile */}
      {recipientUser && (
        <div className="flex items-center space-x-4 mb-4 bg-white p-4 shadow-md rounded-lg">
          <img
            src={recipientUser.profilePhotoURL || 'https://via.placeholder.com/50'}
            alt={recipientUser.fullName || 'User'}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">{recipientUser.fullName || recipientUser.email}</h2>
            <p className="text-gray-500">Chatting with {recipientUser.fullName}</p>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto p-4 bg-white shadow-lg rounded-lg mb-4">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.senderId === currentUserId ? 'justify-end' : ''}`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md ${
                    message.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <span className="text-xs text-gray-400 block mt-1">
                    {message.timestamp?.toDate().toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </div>

      {/* New Message Input */}
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
        <textarea
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows="2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
