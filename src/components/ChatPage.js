import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; // Icon for sending messages

const ChatPage = () => {
  const [chats] = useState([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hello!',
      profilePicURL: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Hi there!',
      profilePicURL: 'https://via.placeholder.com/50',
    },
  ]);

  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Simulate message sending
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { message: newMessage, senderId: 'me' }]);
    setNewMessage(''); // Clear the input after sending
  };

  return (
    <div className="min-h-screen flex bg-neutral">
      {/* Sidebar: List of Chats */}
      <div className="w-1/3 bg-white p-4 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 mb-2 cursor-pointer rounded-lg ${selectedChat?.id === chat.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={chat.profilePicURL}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Window */}
      <div className="w-2/3 bg-white flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-xl font-bold">{selectedChat.name}</h2>
            </div>

            {/* Messages List */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-2 rounded-lg ${msg.senderId === 'me' ? 'bg-primary text-white self-end' : 'bg-gray-300'}`}
                  >
                    <p>{msg.message}</p>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>

            {/* Send Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 flex items-center">
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
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 p-4">
            <h2 className="text-gray-500">Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
