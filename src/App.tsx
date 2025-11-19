import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.scss';

function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="app">
        <main id="main-content">
          <Routes>
            <Route path="/" element={<div>My Payments Dashboard - Start building here!</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
