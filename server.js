app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

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
                  text: `Resume este texto en pocas palabras:\n${texto}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("RESPUESTA GEMINI:", JSON.stringify(data, null, 2));

    if (!data.candidates) {
      return res.json({
        resumen: "Error: Gemini no respondió correctamente",
      });
    }

    const resumen =
      data.candidates[0]?.content?.parts?.[0]?.text;

    res.json({
      resumen: resumen || "No se pudo generar resumen",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      resumen: "Error del servidor",
    });
  }
});