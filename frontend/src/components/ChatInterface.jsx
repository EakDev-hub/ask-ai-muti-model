import { useState, useEffect, useRef } from 'react';
import { sendMessage, getModels, sendMultiModelMessage } from '../services/api';
import ReactMarkdown from 'react-markdown';
import './ChatInterface.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState('google/gemini-pro-vision');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant that can analyze images and answer questions.');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  
  // Multi-model state
  const [multiModelMode, setMultiModelMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState([]);
  const [compareView, setCompareView] = useState('stacked'); // 'stacked' or 'side-by-side'
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch available models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchModels = async () => {
    try {
      const fetchedModels = await getModels();
      setModels(fetchedModels);
    } catch (err) {
      console.error('Failed to fetch models:', err);
      // Set default models if fetch fails
      setModels([
        { id: 'google/gemini-pro-vision', name: 'Gemini Pro Vision' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'openai/gpt-4-vision-preview', name: 'GPT-4 Vision' }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMultiModelToggle = () => {
    setMultiModelMode(!multiModelMode);
    if (!multiModelMode) {
      // Switching TO multi-model mode - initialize with current model if empty
      if (selectedModels.length === 0) {
        setSelectedModels([selectedModel]);
      }
    } else {
      // Switching TO single-model mode - clear selections
      setSelectedModels([]);
    }
  };

  const handleModelSelection = (modelId) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (prev.length < 4) {
        return [...prev, modelId];
      } else {
        setError('Maximum 4 models allowed');
        setTimeout(() => setError(null), 3000);
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() && !selectedImage) {
      setError('Please enter a message or select an image');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate multi-model selection
    if (multiModelMode && (selectedModels.length < 2 || selectedModels.length > 4)) {
      setError('Please select 2-4 models for multi-model mode');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      image: selectedImage,
      timestamp: new Date().toISOString(),
      multiModel: multiModelMode,
      selectedModels: multiModelMode ? [...selectedModels] : null
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setLoading(true);
    setError(null);

    try {
      if (multiModelMode) {
        // Multi-model request
        const response = await sendMultiModelMessage(
          inputMessage,
          imageToSend,
          selectedModels,
          systemPrompt
        );

        // Add multi-model AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          multiModel: true,
          responses: response.responses,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Single model request
        const response = await sendMessage(
          inputMessage,
          imageToSend,
          selectedModel,
          systemPrompt
        );

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toISOString(),
          model: response.model
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to get response from AI');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-top">
          <h1>🤖 AI Chat Assistant</h1>
          <div className="header-actions">
            <button
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="btn-toggle-prompt"
              disabled={loading}
              title="Toggle System Prompt"
            >
              {showSystemPrompt ? '📋 Hide Prompt' : '📋 System Prompt'}
            </button>
          </div>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-tab ${!multiModelMode ? 'active' : ''}`}
            onClick={() => !multiModelMode ? null : handleMultiModelToggle()}
            disabled={loading}
          >
            Single Model
          </button>
          <button
            className={`mode-tab ${multiModelMode ? 'active' : ''}`}
            onClick={() => multiModelMode ? null : handleMultiModelToggle()}
            disabled={loading}
          >
            Multi-Model (2-4)
          </button>
        </div>
      </header>

      <div className="model-selector-panel">
        {!multiModelMode ? (
          // Single Model Selector
          <div className="single-model-section">
            <div className="section-header">
              <span className="mode-indicator">📱 Single Model</span>
            </div>
            <label htmlFor="model-select">Select AI Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-dropdown"
              disabled={loading}
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          // Multi-Model Selector
          <div className="multi-model-section">
            <div className="section-header">
              <span className="mode-indicator">🔀 Multi-Model Compare</span>
              <div className="view-controls">
                <span className="view-label">View:</span>
                <button
                  onClick={() => setCompareView('stacked')}
                  className={`btn-view-mode ${compareView === 'stacked' ? 'active' : ''}`}
                  title="Stacked View"
                >
                  📚 Stacked
                </button>
                <button
                  onClick={() => setCompareView('side-by-side')}
                  className={`btn-view-mode ${compareView === 'side-by-side' ? 'active' : ''}`}
                  title="Side by Side View"
                >
                  ⇄ Grid
                </button>
              </div>
            </div>
            
            <label>
              Select Models (2-4):
              <span className="selection-count">{selectedModels.length} selected</span>
            </label>
            
            <div className="model-grid">
              {models.map(model => (
                <button
                  key={model.id}
                  className={`model-card ${selectedModels.includes(model.id) ? 'selected' : ''} ${
                    selectedModels.length >= 4 && !selectedModels.includes(model.id) ? 'disabled' : ''
                  }`}
                  onClick={() => handleModelSelection(model.id)}
                  disabled={loading || (selectedModels.length >= 4 && !selectedModels.includes(model.id))}
                >
                  <div className="model-card-header">
                    {selectedModels.includes(model.id) && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                  <div className="model-card-name">{model.name}</div>
                </button>
              ))}
            </div>
            
            <p className="helper-text">
              💡 Tip: Select 2-4 models to compare their responses side-by-side
            </p>
          </div>
        )}
      </div>

      {showSystemPrompt && (
        <div className="system-prompt-section">
          <label htmlFor="system-prompt">System Prompt:</label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Define how the AI should behave..."
            rows="3"
            disabled={loading}
          />
        </div>
      )}

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>👋 Welcome to AI Chat!</h2>
            <p>Send a message or upload an image to get started.</p>
            <div className="features">
              <div className="feature">
                <span>💬</span>
                <p>Chat with AI</p>
              </div>
              <div className="feature">
                <span>🖼️</span>
                <p>Upload Images</p>
              </div>
              <div className="feature">
                <span>🎯</span>
                <p>Choose Models</p>
              </div>
            </div>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className={`message ${message.role}`}>
            {/* User Message */}
            {message.role === 'user' && (
              <>
                <div className="message-header">
                  <span className="message-role">👤 You</span>
                  {message.multiModel && (
                    <span className="multi-model-badge">🔀 Multi-Model Query</span>
                  )}
                </div>
                <div className="message-content">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="message-image"
                    />
                  )}
                  {message.content && <p>{message.content}</p>}
                </div>
              </>
            )}

            {/* Single Model AI Response */}
            {message.role === 'assistant' && !message.multiModel && !message.isSummary && (
              <>
                <div className="message-header">
                  <span className="message-role">🤖 AI</span>
                  {message.model && (
                    <span className="message-model">{message.model}</span>
                  )}
                </div>
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </>
            )}

            {/* Multi-Model AI Response */}
            {message.role === 'assistant' && message.multiModel && (
              <>
                <div className="message-header">
                  <span className="message-role">🤖 AI Multi-Model Comparison</span>
                </div>
                <div className={`multi-model-responses ${compareView}`}>
                  {message.responses.map((resp, index) => (
                    <div
                      key={index}
                      className={`individual-response ${resp.success ? 'success' : 'error'}`}
                    >
                      <div className="response-header">
                        <span className="response-model">
                          {resp.success ? '✓' : '✗'} {resp.model}
                        </span>
                      </div>
                      <div className="response-content">
                        {resp.success ? (
                          <ReactMarkdown>{resp.response}</ReactMarkdown>
                        ) : (
                          <p className="error-text">❌ {resp.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-header">
              <span className="message-role">🤖 AI</span>
            </div>
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            <button 
              type="button" 
              onClick={handleRemoveImage}
              className="btn-remove-image"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}

        <div className="input-row">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
            id="file-input"
            disabled={loading}
          />
          <label htmlFor="file-input" className="btn-upload" title="Upload Image">
            📎
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            disabled={loading}
          />

          <button 
            type="submit" 
            className="btn-send"
            disabled={loading || (!inputMessage.trim() && !selectedImage)}
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;