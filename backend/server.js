require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

// Check if API key is configured
if (!process.env.OPENROUTER_API_KEY) {
  console.error('ERROR: OPENROUTER_API_KEY is not set in environment variables');
  console.error('Please create a .env file and add your OpenRouter API key');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log('\n🚀 AI Chat Backend Server started successfully!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log('\n📚 Available endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`   GET  http://localhost:${PORT}/api/models`);
  console.log('\n💡 Press Ctrl+C to stop the server\n');
});