const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "No API key" });
    }

    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Resume este texto: ${texto}` }
        ]
      })
    });

    const data = await respuesta.json();

    console.log("Respuesta OpenAI:", data);

    res.json({
      resumen: data.choices[0].message.content
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:3000");
});