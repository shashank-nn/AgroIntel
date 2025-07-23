import React, { useState } from 'react';
import axios from '../api';

const ChatModal = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! Ask me anything about crops or weather!' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await axios.post('/ai/ask', { message: input });
      setMessages([...newMessages, { from: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="btn btn-outline-success position-fixed"
        style={{ bottom: '30px', right: '30px', zIndex: 1050 }}
        onClick={() => setShow(true)}
      >
        💬
      </button>

      {/* Modal */}
      {show && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">AI Assistant</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded ${msg.from === 'user' ? 'bg-light text-end' : 'bg-success text-white'}`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-success" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
