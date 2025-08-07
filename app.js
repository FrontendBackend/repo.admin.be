const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 🟢 Permitir todas las solicitudes de cualquier origen (modo desarrollo)
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/usuarioRoutes");
const ubigeoRoutes = require("./routes/ubigeoRoutes");

app.use("/api/usuarios", userRoutes);
app.use("/api/ubigeos", ubigeoRoutes);

// siempre al final
app.use(errorHandler);

module.exports = app;
