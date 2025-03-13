import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AIChat } from "./components/AIChat";
import { Notes } from "./components/Notes";

import "./assets/style.css";

function App() {
  return (
    <div id="root">
      <Navbar />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<AIChat />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
