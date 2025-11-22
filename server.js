const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Variables de entorno Railway
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

app.post("/send-activity-email", async (req, res) => {
  const { parentEmail, username, activityName, points } = req.body;

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: SENDER_EMAIL },
        to: [{ email: parentEmail }],
        subject: `Actividad completada por ${username}`,
        htmlContent: `
          <h2>Actividad completada 🎉</h2>
          <p>${username} terminó la actividad <strong>${activityName}</strong>.</p>
          <p>Puntos obtenidos: <strong>${points}</strong></p>
        `
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (err) {
    console.log("❌ ERROR BREVO:", err.response?.data || err);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor en Railway → Puerto:", PORT);
});

