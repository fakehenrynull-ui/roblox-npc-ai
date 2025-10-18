import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { player, message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a friendly NPC in a Roblox game. Keep responses short and natural." },
          { role: "user", content: `${player}: ${message}` },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn’t think of a response.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error contacting AI." });
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
