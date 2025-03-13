import React from "react";
import { NoteInput } from "./components/NoteInput";
import Navbar from "./components/Navbar";
import "./assets/style.css";
import Footer from "./components/Footer";

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="app-container">
        <NoteInput />
      </div>
      <Footer />
    </div>
  );
}

export default App;
