const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Ruta para resumir
app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        resumen: "Falta el texto",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Resume este texto en pocas palabras: ${texto}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Respuesta Gemini:", data);

    const resumen =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resumen) {
      return res.json({
        resumen: "No se pudo generar resumen",
      });
    }

    res.json({
      resumen: resumen,
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      resumen: "Error del servidor",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:" + PORT);
});