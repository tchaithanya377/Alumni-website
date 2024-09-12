import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';  // Import Firestore config
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ChatPage = () => {
  const { id } = useParams();  // Get the chat ID from the route
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      const q = query(collection(db, 'chats', id, 'messages'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [id]);

  return (
    <div>
      {messages.length > 0 ? (
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <p>{message.message}</p>
              <span>{message.timestamp?.toDate().toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages yet</p>
      )}
    </div>
  );
};

export default ChatPage;
