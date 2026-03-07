import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Freelancers from './pages/Freelancers';
import WriteReviewPage from './pages/WriteReviewPage';
import GigPage from './pages/GigPage';
import ScrollToTop from './components/ScrollToTop';
import './styles/App.css';
import './styles/neobrutalism.css';

const ThemeController = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.classList.remove('neobrutalism-body');
    } else {
      document.body.classList.add('neobrutalism-body');
    }
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ThemeController />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:publicKey" element={<Profile />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route path="/review/:publicKey" element={<WriteReviewPage />} />
          <Route path="/gig/:publicKey/:serviceId" element={<GigPage />} />
          <Route path="/gig/:publicKey" element={<GigPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;