import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: true,
  offset: 100
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
