import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonaSelect from "./components/PersonaSelect";
import ChatPage from "./components/ChatPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [persona, setPersona] = useState(null);

  return (
    <Router>
      <ThemeToggle />
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/persona" element={<PersonaSelect setPersona={setPersona} />} />
          <Route path="/chat" element={<ChatPage persona={persona} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;