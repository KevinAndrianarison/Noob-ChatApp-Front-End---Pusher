import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/messages').then(response => {
      setMessages(response.data);
    });

    const pusher = new Pusher('273006736645b0143312', {
      cluster: 'mt1',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', newMessage => {
      console.log('====================================');
      console.log(newMessage);
      console.log('====================================');
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  const sendMessage = () => {
    axios.post('http://localhost:8000/api/messages', { sender, message }).then(response => {
      setMessage('');
    });
  };

  return (
    <div>
      <div>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your name"
        value={sender}
        onChange={e => setSender(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
