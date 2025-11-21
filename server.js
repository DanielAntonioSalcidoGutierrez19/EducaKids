const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ✔ Variables desde Railway
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Ruta para verificar servidor
app.get("/", (req, res) => {
  res.send("Servidor EducaKids funcionando.");
});

// Ruta para enviar correo al completar actividad
app.post("/send-activity-email", async (req, res) => {
  const { parentEmail, username, activityName, points } = req.body;

  if (!parentEmail || !username || !activityName || points === undefined) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos (parentEmail, username, activityName, points)"
    });
  }

  try {
    await transporter.sendMail({
      from: `"EducaKids" <${EMAIL_USER}>`,
      to: parentEmail,
      subject: `Actividad completada por ${username}`,
      html: `
        <h2>🎉 ¡Actividad completada!</h2>
        <p><strong>${username}</strong> terminó una actividad en EducaKids.</p>
        <p>📘 Actividad: <strong>${activityName}</strong></p>
        <p>🏆 Puntos: <strong>${points}</strong></p>
      `
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor EducaKids escuchando en puerto", PORT);
});

