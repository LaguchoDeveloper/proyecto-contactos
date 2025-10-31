import mysql from "mysql2";

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "contactosdb"
});

conexion.connect(err => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL!");
});

export default conexion;
