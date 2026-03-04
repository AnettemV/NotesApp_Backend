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

    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Resume este texto de forma corta: ${texto}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await respuesta.json();

    const resumen =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se pudo generar resumen";

    res.json({
      resumen: resumen,
    });
  } catch (error) {
    res.status(500).json({
      resumen: "Error del servidor",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:" + PORT);
});