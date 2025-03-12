import React from "react";
import { NoteInput } from "./components/NoteInput";
import Navbar from "./components/Navbar";
import "./assets/style.css";

function App() {
  return (
    <>
      <Navbar />
      <NoteInput />
    </>
  );
}

export default App;
