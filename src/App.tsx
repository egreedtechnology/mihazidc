import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Services" element={<Services />} />
      <Route path="/Team" element={<Team />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/BookAppointment" element={<BookAppointment />} />
    </Routes>
  );
}

export default App;
