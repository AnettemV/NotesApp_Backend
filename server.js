const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim() === "") {
      return res.json({
        resumen: "No hay texto para resumir"
      });
    }

    try {
      const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Resume este texto en pocas palabras: ${texto}`
            }
          ]
        })
      });

      const data = await respuesta.json();

      if (data.choices && data.choices.length > 0) {
        return res.json({
          resumen: data.choices[0].message.content
        });
      }

      throw new Error("OpenAI fallo");

    } catch (openaiError) {

      const resumenBasico = texto
        .split(" ")
        .slice(0, 15)
        .join(" ");

      return res.json({
        resumen: resumenBasico + "..."
      });
    }

  } catch (error) {
    return res.json({
      resumen: "Error al resumir"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:" + PORT);
});