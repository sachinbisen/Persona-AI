import React, { useState, useRef, useEffect } from "react";
import { sendToGemini } from "../services/geminiApi";
import { db, auth } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ChatPage = ({ persona }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatPrompt = (input) => {
    if (persona === "Child") return `Answer playfully like talking to a child: ${input}`;
    if (persona === "Scholar") return `Explain deeply and thoughtfully: ${input}`;
    if (persona === "Adventurer") return `Respond with energy and daring spirit: ${input}`;
    return input;
  };

  async function handleSend() {
    if (!userInput.trim() || isLoading) return;

    const input = userInput.trim(); // Lock the input
    setUserInput("");
    setIsLoading(true);

    const userMsg = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const formatted = formatPrompt(input);
      const reply = await sendToGemini(formatted);

      const botMsg = {
        sender: "bot",
        text: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);

      await addDoc(collection(db, "chats"), {
        userId: auth.currentUser?.uid,
        persona,
        question: input,
        response: reply,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full p-4 bg-gradient-to-b from-gray-900/10 to-gray-900/5">
      <div className="flex items-center justify-between mb-6 p-4 glass-card rounded-xl">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">
            Inspector Sage
          </h2>
          <span className="ml-3 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium">
            {persona}
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-xl font-medium mb-2">Welcome to Inspector Sage</h3>
            <p className="max-w-md">
              Ask me anything! I'll respond in my {persona.toLowerCase()} persona.
            </p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`p-4 max-w-[85%] ${m.sender === "user" ? "message-user" : "message-bot"}`}>
            <p className="font-medium text-sm opacity-80">
              {m.sender === "user" ? "You" : "Inspector Sage"}
            </p>
            <p className="mt-1">{m.text}</p>
            <p className="text-xs opacity-50 mt-2">
              {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-bg/90 via-bg/70 to-transparent pt-6 pb-8 px-2">
        <div className="flex gap-2 items-center glass-card p-3 rounded-xl shadow-lg">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Inspector Sage as a ${persona}...`}
            className="flex-1 bg-transparent border-none focus:outline-none p-2 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !userInput.trim()}
            className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="loader-small w-5 h-5"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
