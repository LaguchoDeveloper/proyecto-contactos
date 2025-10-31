import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import conexion from "./db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/contactos", (req, res) => {
  conexion.query("SELECT * FROM contactos", (err, resultados) => {
    if (err) throw err;
    res.json(resultados);
  });
});


app.post("/contactos", upload.single("foto"), (req, res) => {
  const { nombre, telefono, correo } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  conexion.query(
    "INSERT INTO contactos (nombre, telefono, correo, foto) VALUES (?, ?, ?, ?)",
    [nombre, telefono, correo, foto],
    (err, resultado) => {
      if (err) throw err;
      res.json({ id: resultado.insertId, mensaje: "Contacto agregado" });
    }
  );
});


app.delete("/contactos/:id", (req, res) => {
  const { id } = req.params;
  conexion.query("DELETE FROM contactos WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ mensaje: "Contacto eliminado" });
  });
});


app.listen(3000, () =>
  console.log("🚀 Servidor corriendo en http://localhost:3000")
);
