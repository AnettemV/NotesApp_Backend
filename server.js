const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

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

    res.json({
      resumen: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:3000");
});