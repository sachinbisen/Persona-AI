import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const personas = [
  { 
    name: "Child", 
    icon: "🧸",
    description: "Playful and simple explanations",
    bg: "from-pink-500/10 to-purple-500/10"
  },
  { 
    name: "Scholar", 
    icon: "📘",
    description: "Detailed and thoughtful answers",
    bg: "from-blue-500/10 to-emerald-500/10"
  },
  { 
    name: "Adventurer", 
    icon: "🧭",
    description: "Energetic and daring responses",
    bg: "from-amber-500/10 to-red-500/10"
  }
];

const PersonaSelect = ({ setPersona }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else if (!user.emailVerified) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  function handleSelect(persona) {
    setPersona(persona);
    navigate("/chat");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-900/10 to-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400 mb-4">
          Choose Your Persona
        </h1>
        <p className="text-gray-400 max-w-md">
          Select how you'd like Inspector Sage to respond to your questions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {personas.map((p) => (
          <div
            key={p.name}
            onClick={() => handleSelect(p.name)}
            className={`persona-card bg-gradient-to-br ${p.bg} hover:shadow-lg transition-all duration-300`}
          >
            <div className="text-6xl mb-4 float-animation">{p.icon}</div>
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-gray-400 text-sm">{p.description}</p>
            <div className="mt-4 text-purple-400 font-medium text-sm">
              Select &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelect;