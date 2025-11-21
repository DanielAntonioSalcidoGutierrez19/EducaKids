const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

// Ruta que recibe los datos desde la app
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
      from: `"EducaKids" <${process.env.BREVO_USER}>`,
      to: parentEmail,
      subject: `Actividad completada por ${username}`,
      html: `
        <h2>🎉 ¡Actividad completada!</h2>
        <p><strong>${username}</strong> terminó la actividad:</p>
        <p>📘 <strong>${activityName}</strong></p>
        <p>🏆 <strong>Puntos:</strong> ${points}</p>
        <br>
        <p>Gracias por usar EducaKids ❤️</p>
      `
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Servidor EducaKids escuchando en puerto", PORT)
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor EducaKids escuchando en puerto", PORT);
});

