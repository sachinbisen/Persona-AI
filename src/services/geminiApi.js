// Gemini API helper
const GEMINI_API_KEY = "AIzaSyDctL_V3QOtNnhj-0GPTwb1zTUvZZzP6Nk";

export async function sendToGemini(prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Inspector Sage.";
}
