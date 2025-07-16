import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/chatbot',
        { message: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages(prev => [...prev, { role: 'bot', text: res.data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: Could not process request' }]);
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Management Chatbot</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/tasks')}>
        Back to Tasks
      </button>
      <div
        className="border p-3 mb-3 rounded"
        style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}
        ref={chatWindowRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${msg.role === 'user' ? 'text-end bg-primary text-white' : 'text-start bg-light'}`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message (e.g., 'Add task: Buy groceries' or 'List tasks')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;