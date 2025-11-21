const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Contraseña de aplicación correcta
const APP_PASSWORD = "vskl vmwt xsao amtm".replace(/\s/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educakids83@gmail.com",
    pass: APP_PASSWORD
  }
});

// =============================
// A) CORREO CUANDO SE REGISTRA
// =============================
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos (to, subject, message)"
    });
  }

  try {
    await transporter.sendMail({
      from: '"EducaKids" <educakids83@gmail.com>',
      to,
      subject,
      text: message
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

// ================================
// B) CORREO CUANDO TERMINA ACTIVIDAD
// ================================
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
      from: '"EducaKids" <educakids83@gmail.com>',
      to: parentEmail,
      subject: `Actividad completada por ${username}`,
      html: `
        <h2>🎉 ¡Actividad completada!</h2>
        <p><strong>${username}</strong> ha completado una actividad en EducaKids.</p>
        <p>📘 <strong>Actividad:</strong> ${activityName}</p>
        <p>🏆 <strong>Puntos obtenidos:</strong> ${points}</p>
        <br/>
        <p>Gracias por usar EducaKids ❤️</p>
      `
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor de correos EducaKids escuchando en puerto", PORT);
});
