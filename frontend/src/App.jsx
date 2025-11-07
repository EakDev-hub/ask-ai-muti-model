import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import BatchPhotoAnalysis from './components/BatchPhotoAnalysis';
import IDCardAnalysis from './components/IDCardAnalysis';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/batch" element={<BatchPhotoAnalysis />} />
          <Route path="/idcard" element={<IDCardAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;