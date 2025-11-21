const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor EducaKids funcionando.");
});

const APP_PASSWORD = "vsklvmwtxsaoamtm";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educakids83@gmail.com",
    pass: APP_PASSWORD
  }
});

app.post("/send-activity-email", async (req, res) => {
  const { parentEmail, username, activityName, points } = req.body;

  if (!parentEmail || !username || !activityName || points === undefined) {
    return res.status(400).json({ ok: false, message: "Faltan datos" });
  }

  try {
    await transporter.sendMail({
      from: '"EducaKids" <educakids83@gmail.com>',
      to: parentEmail,
      subject: `Actividad completada por ${username}`,
      html: `
        <h2>🎉 ¡Actividad completada!</h2>
        <p><strong>${username}</strong> completó una actividad.</p>
        <p>📘 Actividad: ${activityName}</p>
        <p>🏆 Puntos: ${points}</p>
      `
    });

    res.json({ ok: true, message: "Correo enviado" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Error enviando correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor escuchando en puerto", PORT));


// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor EducaKids iniciado en puerto", PORT);
});
