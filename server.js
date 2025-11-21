const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Contraseña de app (sin espacios)
const APP_PASSWORD = "vsklvmwtxsaoamtm";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educakids83@gmail.com",
    pass: APP_PASSWORD
  }
});

// Ruta principal para que Render no falle
app.get("/", (req, res) => {
  res.send("Servidor de EducaKids funcionando ✔");
});

// ========= A) Correo al registrarse =========
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos en la petición"
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
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

// ========= B) Correo al terminar actividad =========
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
        <p><strong>${username}</strong> ha completado una actividad.</p>
        <p>📘 Actividad: <strong>${activityName}</strong></p>
        <p>🏆 Puntos obtenidos: <strong>${points}</strong></p>
        <br/>
        <p>Gracias por usar EducaKids ❤️</p>
      `
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor de EducaKids escuchando en puerto", PORT);
});

