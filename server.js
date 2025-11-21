const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ TU CONTRASEÑA DE APLICACIÓN
const APP_PASSWORD = "vsklvmwtxsaoamtm";

// Configurar transportador Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educakids83@gmail.com",
    pass: APP_PASSWORD
  }
});

// Ruta para enviar correo al completar una actividad
app.post("/send-activity-email", async (req, res) => {
  console.log("📩 Recibida solicitud de email:", req.body);

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
        <p><strong>${username}</strong> ha terminado una actividad.</p>
        <p>📘 <strong>Actividad:</strong> ${activityName}</p>
        <p>🏆 <strong>Puntos:</strong> ${points}</p>
        <br/>
        <p>Gracias por usar EducaKids ❤️</p>
      `
    });

    console.log("✅ Correo enviado correctamente");
    res.json({ ok: true, message: "Correo enviado correctamente" });

  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

// Ruta simple para verificar que el server está vivo
app.get("/", (req, res) => {
  res.send("Servidor EducaKids funcionando.");
});

// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor EducaKids iniciado en puerto", PORT);
});
