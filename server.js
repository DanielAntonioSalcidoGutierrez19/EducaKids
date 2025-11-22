const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// VARIABLES DE ENTORNO RAILWAY
// ==============================
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// ==============================
// VERIFICAR VARIABLES
// ==============================
if (!BREVO_API_KEY || !SENDER_EMAIL) {
  console.error("❌ ERROR: Faltan variables BREVO_API_KEY o SENDER_EMAIL");
}

// ==============================
// RUTA PRINCIPAL
// ==============================
app.get("/", (req, res) => {
  res.send("Servidor EducaKids funcionando en Railway.");
});

// ==============================
// ENVIAR CORREO VIA BREVO API
// ==============================
app.post("/send-activity-email", async (req, res) => {
  const { parentEmail, username, activityName, points } = req.body;

  if (!parentEmail || !username || !activityName || points === undefined) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos (parentEmail, username, activityName, points)"
    });
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: SENDER_EMAIL, name: "EducaKids" },
        to: [{ email: parentEmail }],
        subject: `Actividad completada por ${username}`,
        htmlContent: `
          <h2>🎉 ¡Actividad completada!</h2>
          <p><strong>${username}</strong> terminó una actividad en EducaKids.</p>
          <p>📘 Actividad: <strong>${activityName}</strong></p>
          <p>🏆 Puntos: <strong>${points}</strong></p>
        `,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("❌ ERROR BREVO API:", error.response?.data || error);
    res.status(500).json({
      ok: false,
      message: "Error al enviar correo"
    });
  }
});

// ==============================
// INICIAR SERVIDOR RAILWAY
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🚀 Servidor EducaKids en Railway → Puerto:", PORT)
);

