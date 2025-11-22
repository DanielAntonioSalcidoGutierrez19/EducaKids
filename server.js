const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor EducaKids funcionando en Railway.");
});

// Enviar correo usando la API DE BREVO (no SMTP)
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
          <h2>🎉 ¡Actividad completada!</h2>
          <p><strong>${username}</strong> terminó una actividad.</p>
          <p>📘 Actividad: <strong>${activityName}</strong></p>
          <p>🏆 Puntos: <strong>${points}</strong></p>
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
  } catch (error) {
    console.log("❌ ERROR BREVO API:", error.response?.data || error);
    res.status(500).json({ ok: false, message: "No se pudo enviar el correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🚀 Servidor EducaKids escuchando en puerto", PORT)
);
