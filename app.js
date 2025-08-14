const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 🟢 Permitir todas las solicitudes de cualquier origen (modo desarrollo)
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/usuarioRoutes");
const ubigeoRoutes = require("./routes/ubigeoRoutes");
const personaRoutes = require("./routes/personaRoutes");
const valorParametroRoutes = require("./routes/valorParametroRoutes");

app.use("/api/usuarios", userRoutes);
app.use("/api/ubigeos", ubigeoRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/valorParametros", valorParametroRoutes);

// siempre al final
app.use(errorHandler);

module.exports = app;
